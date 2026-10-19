// Moteur d'animation au défilement — porté depuis le prototype EMKAY FINAL.
// Fonctionne directement sur le DOM (attributs data-*) pour éviter un rendu React à chaque frame.
//
//   data-sc="sticky" | "enter"   section pilotée ; expose --p (progression 0→1) et --y (parallaxe)
//   data-r="0.3"                 révélation quand --p ≥ seuil (data-fx = up | pop | mask)
//   data-steps / data-stack / data-seq / data-bgs   séquences pas à pas
//   data-show="a,b"              visible tant que a ≤ p < b
//   data-count / data-count-once compteurs
//   data-brand / data-hd         marque courante + couleur du header

import { GROUP, ROOM } from './data';

type El = HTMLElement & {
  _p?: number; _on?: boolean; _sh?: boolean; _d?: number; _a?: number; _k?: number;
  _counted?: boolean; _raf?: number; _caps?: HTMLElement[]; _links?: SVGPathElement[]; _it?: HTMLElement[];
};

export type EngineState = { brand: number; header: boolean; hd: string };

type Opts = {
  getWide: () => boolean;
  getRoomHover: () => number;
  orbitSpeed: number;
  onState: (s: EngineState) => void;
};

const cl = (v: number) => Math.max(0, Math.min(1, v));
const E3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class ScrollEngine {
  root: HTMLElement;
  o: Opts;
  reduced: boolean;
  pts: [number, number][];
  mx = 0;
  my = 0;
  last: EngineState = { brand: -1, header: false, hd: '#F5F1E9' };
  private raf = 0;
  private loopId = 0;
  private orbit: El | null = null;
  private orbitVisible = false;
  private roomP = 0;
  private oa = 0;
  private ot = 0;
  private gEl: El | null = null;
  private gVis = false;
  private gT = 0;
  private gP: number | null = null;
  net: HTMLCanvasElement | null = null;

  constructor(root: HTMLElement, o: Opts) {
    this.root = root;
    this.o = o;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s = 11;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.pts = Array.from({ length: 150 }, () => [rnd(), rnd()] as [number, number]);
  }

  start() {
    const loop = (ts: number) => {
      if (this.orbit && this.orbitVisible) this.orbitFrame(ts);
      if (this.gEl && this.gVis) {
        const base = this.gP ?? this.gT;
        const d = this.gT - base;
        if (Math.abs(d) > 0.0004 || this.gP == null) { this.gP = base + d * 0.085; this.groupFrame(this.gEl, this.gP); }
      }
      this.loopId = requestAnimationFrame(loop);
    };
    if (!this.reduced) this.loopId = requestAnimationFrame(loop);
    this.update();
  }

  stop() {
    cancelAnimationFrame(this.loopId);
    cancelAnimationFrame(this.raf);
    this.loopId = 0;
  }

  schedule = () => {
    if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.update(); });
  };

  reveal(c: El, on: boolean) {
    if (c._on === on) return;
    c._on = on;
    const fx = c.dataset.fx || 'up';
    c.style.transition = this.reduced ? 'opacity .3s ease' : 'opacity .9s cubic-bezier(.2,.7,.1,1), transform 1s cubic-bezier(.2,.7,.1,1), filter 1.1s ease, clip-path 1.2s cubic-bezier(.7,0,.2,1)';
    if (fx === 'mask') { c.style.clipPath = on ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)'; return; }
    c.style.opacity = on ? '1' : '0';
    c.style.pointerEvents = on ? '' : 'none';
    if (this.reduced) return;
    if (fx === 'pop') c.style.transform = on ? 'none' : 'scale(.3)';
    else c.style.transform = on ? 'none' : 'translateY(40px)';
  }

  show(c: El, on: boolean) {
    if (c._sh === on) return;
    c._sh = on;
    c.style.transition = on ? 'opacity .55s ease .32s, transform .8s cubic-bezier(.2,.7,.1,1) .32s' : 'opacity .28s ease, transform .3s ease';
    c.style.opacity = on ? '1' : '0';
    c.style.transform = on || this.reduced ? 'none' : 'translateY(16px)';
  }

  stack(c: El, d: number) {
    if (c._d === d) return;
    c._d = d;
    c.style.transition = this.reduced ? 'opacity .3s' : 'opacity .8s cubic-bezier(.2,.7,.1,1), transform .9s cubic-bezier(.2,.7,.1,1)';
    c.style.opacity = String(d < 0 ? 0.24 : d === 0 ? 1 : 0);
    c.style.transform = d > 0 && !this.reduced ? 'translateY(36px)' : 'none';
  }

  countUp(c: El) {
    const n = +(c.dataset.count || 0);
    cancelAnimationFrame(c._raf || 0);
    if (this.reduced) { c.textContent = '+' + n; return; }
    const t0 = performance.now();
    const f = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
      c.textContent = '+' + Math.round(n * e);
      if (k < 1) c._raf = requestAnimationFrame(f);
    };
    c._raf = requestAnimationFrame(f);
  }

  /** Listes d'éléments mises en cache ; invalidées après chaque rendu React (le DOM peut avoir changé). */
  private cache: {
    secs: { el: El; reveals: El[]; steps: El[]; shows: El[]; counts: El[]; pq: HTMLElement | null }[];
    brands: El[]; hds: El[];
  } | null = null;

  invalidate() { this.cache = null; this.railGeo = new WeakMap(); }

  private collect() {
    const root = this.root;
    const secs = [...root.querySelectorAll<El>('[data-sc]')].map((el) => ({
      el,
      reveals: [...el.querySelectorAll<El>('[data-r]')].filter((c) => c.closest('[data-sc]') === el || !c.closest('[data-sc]')),
      steps: el.dataset.steps ? [...el.querySelectorAll<El>('[data-i]')] : [],
      shows: el.hasAttribute('data-group') ? [] : [...el.querySelectorAll<El>('[data-show]')],
      counts: el.hasAttribute('data-count-once') ? [...el.querySelectorAll<El>('[data-count]')] : [],
      pq: el.id === 'top' ? el.querySelector<HTMLElement>('[data-portal-qa]') : null,
    }));
    return (this.cache = { secs, brands: [...root.querySelectorAll<El>('[data-brand]')], hds: [...root.querySelectorAll<El>('[data-hd]')] });
  }

  update() {
    const root = this.root;
    const vh = innerHeight;
    const wide = this.o.getWide();
    const C = this.cache || this.collect();

    // 1) Écriture qui change la mise en page (hauteur de Vision House), avant toute lecture.
    for (const { el } of C.secs) {
      if (!el.hasAttribute('data-vhs')) continue;
      const n = el.querySelectorAll('[data-card]').length || 1;
      const h = wide ? vh * (1 + 0.2 + n * 0.5 + 0.6) + 'px' : '';
      if (el.style.height !== h) el.style.height = h;
    }
    // 2) Toutes les lectures de position en une passe (évite les recalculs de layout en cascade).
    const rects = C.secs.map((s) => s.el.getBoundingClientRect());
    const brandRects = C.brands.map((el) => el.getBoundingClientRect());
    const hdRects = C.hds.map((el) => el.getBoundingClientRect());
    const rootTop = root.getBoundingClientRect().top;

    // 3) Écritures.
    C.secs.forEach(({ el, reveals, steps, shows, counts, pq }, i) => {
      const r = rects[i];
      let v: number;
      if (el.dataset.sc === 'sticky') v = cl(-r.top / Math.max(1, r.height - vh));
      else {
        v = cl((vh - r.top) / (vh * 0.75));
        el.style.setProperty('--y', this.reduced || !wide ? '0' : ((r.top + r.height / 2 - vh / 2) / vh).toFixed(3));
      }
      el._p = v;
      el.style.setProperty('--p', v.toFixed(4));
      const vis = r.bottom > 0 && r.top < vh;
      if (pq) { const on = v < 0.1; pq.style.pointerEvents = on ? 'auto' : 'none'; pq.tabIndex = on ? 0 : -1; }
      if (el.hasAttribute('data-vhs')) {
        if (wide) { const first = el._k === undefined, k = this.vhRail(el, v); el._k = k; if (vis || first) this.vhMorph(el, k); }
        else { el._k = 0; this.vhRailReset(el); this.vhMorph(el, null); }
      }
      for (const c of reveals) this.reveal(c, v >= parseFloat(c.dataset.r || '0'));
      if (el.dataset.steps) {
        const n = +el.dataset.steps, a = Math.min(n - 1, Math.floor(v * n));
        if (el.hasAttribute('data-stack')) steps.forEach((c) => this.stack(c, +(c.dataset.i || 0) - a));
        else if (el.hasAttribute('data-seq')) steps.forEach((c) => this.show(c, +(c.dataset.i || 0) === a));
        else steps.forEach((c) => this.reveal(c, +(c.dataset.i || 0) === a));
        if (el._a !== a) {
          el._a = a;
          if (el.dataset.bgs) {
            const inner = el.firstElementChild as HTMLElement, b = el.dataset.bgs.split(','), f = (el.dataset.fgs || '').split(',');
            inner.style.backgroundColor = b[a];
            if (f[a]) inner.style.color = f[a];
          }
          const cc = el.querySelector<El>(`[data-i="${a}"] [data-count]`);
          if (cc) this.countUp(cc);
        }
      }
      for (const c of shows) {
        const [a, b] = (c.dataset.show || '').split(',').map(Number);
        this.show(c, v >= a && v < b);
      }
      if (counts.length && v > 0.35 && !el._counted) { el._counted = true; counts.forEach((c) => this.countUp(c)); }
      if (el.dataset.canvas && vis) this.drawNet(v);
      if (el.hasAttribute('data-group')) {
        this.gEl = el; this.gVis = vis; this.gT = v;
        if (vis && (this.reduced || !this.loopId)) { this.gP = v; this.groupFrame(el, v); }
      }
      if (el.id === 'groupe') {
        this.orbit = el.querySelector<El>('[data-orbit]'); this.orbitVisible = vis; this.roomP = v;
        if (vis && (this.reduced || !this.loopId)) this.orbitFrame(0);
      }
    });

    let brand = -1, hd = this.last.hd;
    C.brands.forEach((el, i) => {
      const r = brandRects[i];
      if (r.top <= vh * 0.5 && r.bottom >= vh * 0.5) brand = el.hasAttribute('data-vhs') && (el._k || 0) > 0.5 ? 1 : +(el.dataset.brand || 0);
    });
    C.hds.forEach((el, i) => {
      const r = hdRects[i];
      if (r.top <= 40 && r.bottom > 40) {
        const at = parseFloat(el.dataset.hdAt || '0.85');
        hd = (el.dataset.hdEnd && (el._p || 0) >= at ? el.dataset.hdEnd : el.dataset.hd) || hd;
      }
    });
    const header = -rootTop > vh * 0.25;
    const L = this.last;
    if (brand !== L.brand || header !== L.header || hd !== L.hd) {
      this.last = { brand, header, hd };
      this.o.onState(this.last);
    }
  }

  // ——— Vision House : rail horizontal de projets puis morph vers Overton ———
  // Toutes les cartes ont la même hauteur ; le rail défile de droite à gauche, la carte au centre est mise en avant.
  private railGeo = new WeakMap<HTMLElement, { vw: number; vh: number; start: number; end: number; centers: number[] }>();

  private railGeometry(el: El, cards: HTMLElement[]) {
    const g = this.railGeo.get(el);
    if (g && g.vw === innerWidth && g.vh === innerHeight) return g;
    const vw = innerWidth, first = cards[0], last = cards[cards.length - 1];
    const centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    const geo = {
      vw, vh: innerHeight, centers,
      start: vw * 0.74 - (first ? first.offsetLeft : 0), // première carte déjà visible à droite, à côté du titre
      end: last ? vw / 2 - (last.offsetLeft + last.offsetWidth / 2) : 0, // dernière carte centrée
    };
    this.railGeo.set(el, geo);
    return geo;
  }

  vhRail(el: El, p: number) {
    const cards = [...el.querySelectorAll<HTMLElement>('[data-card]')], n = cards.length || 1;
    const T = 0.2 + n * 0.5 + 0.6, pi = 0.2 / T, u = 0.5 / T, pE = pi + n * u;
    const ui = el.querySelector<HTMLElement>('[data-vhui]');
    const io = cl((p - pi * 0.4) / (u * 0.7));
    if (ui) { ui.style.opacity = (1 - io).toFixed(3); ui.style.transform = this.reduced ? '' : `translateY(${(-io * 6).toFixed(2)}vh)`; }
    const track = el.querySelector<HTMLElement>('[data-track]');
    if (track && cards.length) {
      const g = this.railGeometry(el, cards);
      const r = E3(cl((p - pi * 0.15) / (pE - u * 0.35 - pi * 0.15)));
      const x = g.start + (g.end - g.start) * r;
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      cards.forEach((c, i) => {
        const d = Math.min(1, Math.abs(x + g.centers[i] - g.vw / 2) / (g.vw * 0.62));
        c.style.transform = this.reduced ? '' : `scale(${(1 - d * 0.1).toFixed(4)})`;
        c.style.opacity = (1 - d * 0.5).toFixed(3);
        c.style.filter = d > 0.04 ? `brightness(${(1 - d * 0.35).toFixed(3)})` : '';
      });
    }
    return cl((p - pE) / (1 - pE));
  }

  vhRailReset(el: El) {
    el.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => { c.style.transform = ''; c.style.opacity = '1'; c.style.filter = ''; });
    const track = el.querySelector<HTMLElement>('[data-track]'); if (track) track.style.transform = '';
    const ui = el.querySelector<HTMLElement>('[data-vhui]');
    if (ui) { ui.style.opacity = '1'; ui.style.transform = ''; }
  }

  vhMorph(el: El, k: number | null) {
    const xf = el.querySelector<HTMLElement>('[data-xf]'); if (!xf) return;
    const xa = xf.querySelector<HTMLElement>('[data-xa]')!, xb = xf.querySelector<HTMLElement>('[data-xb]')!, xg = xf.querySelector<HTMLElement>('[data-xg]')!, xt = xf.querySelector<HTMLElement>('[data-xt]')!;
    const tr = el.querySelector<HTMLElement>('[data-track]');
    if (k == null) {
      Object.assign(xf.style, { left: '0px', top: '0px', width: '100%', height: '100svh', opacity: '1', pointerEvents: 'auto', clipPath: '' });
      xa.style.opacity = '0';
      [xb, xg, xt].forEach((n) => (n.style.opacity = '1'));
      xt.style.transform = '';
      return;
    }
    if (k <= 0) { xf.style.opacity = '0'; xf.style.pointerEvents = 'none'; if (tr) tr.style.opacity = '1'; return; }
    const box = el.firstElementChild as HTMLElement, br = box.getBoundingClientRect();
    const meds = el.querySelectorAll<HTMLElement>('[data-vhmedia]'), last = meds[meds.length - 1];
    const r = last ? last.getBoundingClientRect() : br;
    const g = E3(cl(k / 0.6)), L = (a: number, b: number) => a + (b - a) * g;
    xf.style.left = L(r.left - br.left, 0).toFixed(1) + 'px';
    xf.style.top = L(r.top - br.top, 0).toFixed(1) + 'px';
    xf.style.width = L(r.width, br.width).toFixed(1) + 'px';
    xf.style.height = L(r.height, br.height).toFixed(1) + 'px';
    xf.style.opacity = '1';
    xf.style.pointerEvents = k > 0.97 ? 'auto' : 'none';
    const sh = cl((k - 0.2) / 0.5);
    const empty = xa.hasAttribute('data-empty');
    xa.style.opacity = empty ? '0' : '1';
    xa.style.filter = `saturate(${(1 - 0.6 * sh).toFixed(2)}) brightness(${(1 - 0.35 * sh).toFixed(2)}) contrast(${(1 + 0.15 * sh).toFixed(2)})`;
    xb.style.opacity = (empty ? cl(k / 0.15) : cl((k - 0.35) / 0.35)).toFixed(3);
    xg.style.opacity = cl((k - 0.5) / 0.3).toFixed(3);
    const t = cl((k - 0.72) / 0.22);
    xt.style.opacity = t.toFixed(3);
    xt.style.transform = this.reduced ? '' : `translateY(${((1 - t) * 24).toFixed(1)}px)`;
    if (tr) tr.style.opacity = (1 - cl(k * 2.5)).toFixed(3);
  }

  // ——— EMKAY Room : orbites ———
  orbitFrame(ts: number) {
    const o = this.orbit; if (!o) return;
    const W = o.clientWidth, H = o.clientHeight, P = this.roomP;
    const items = o._it && o._it.length === 5 ? o._it : (o._it = [...o.querySelectorAll<HTMLElement>('[data-oi]')]);
    const core = o.querySelector<HTMLElement>('[data-core]');
    let mw = 0, mh = 0;
    items.forEach((n) => { mw = Math.max(mw, n.offsetWidth); mh = Math.max(mh, n.offsetHeight); });
    const cw = core ? core.offsetWidth : 200, ch = core ? core.offsetHeight : 60;
    const rxMax = Math.max(60, W / 2 - mw / 2 - 6), ryMax = Math.max(40, H / 2 - mh / 2 - 30);
    const rxMin = Math.min(rxMax, cw / 2 + mw / 2 + 24), ryMin = Math.min(ryMax, ch / 2 + mh / 2 + 24);
    const now = ts || 0, dt = this.ot ? Math.min(64, now - this.ot) : 0;
    this.ot = now;
    const hover = this.o.getRoomHover();
    const slow = hover >= 0 ? 0.35 : 1;
    this.oa += this.reduced ? 0 : (dt / 1000) * this.o.orbitSpeed * 0.6 * slow;
    const base = this.oa + P * 40;
    const mx = this.mx, my = this.my;
    items.forEach((n, i) => {
      const c = ROOM[i] || { f: 1, fy: 1, oy: 0, ph: i * 72 };
      const rx = rxMin + (rxMax - rxMin) * c.f, ry = ryMin + (ryMax - ryMin) * c.fy;
      const ang = ((base + c.ph) * Math.PI) / 180;
      const depth = 0.4 + c.f * 0.6;
      const x = Math.cos(ang) * rx - mx * 18 * depth, y = Math.sin(ang) * ry + c.oy * H - my * 12 * depth;
      n.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
      n.style.zIndex = hover === i ? '3' : '2';
    });
    if (core) core.style.transform = `translate(calc(-50% + ${(-mx * 6).toFixed(1)}px), calc(-50% + ${(-my * 4).toFixed(1)}px))`;
  }

  // ——— Le Groupe : convergence des marques ———
  groupFrame(el: El, p: number) {
    const S = (a: number, b: number) => cl((p - a) / (b - a));
    const stg = (k: number, o: number) => E3(cl(k * 1.3 - o * 0.1));
    const stage = el.querySelector<HTMLElement>('[data-stage]'); if (!stage) return;
    const W = stage.clientWidth, H = stage.clientHeight, wide = this.o.getWide();
    const caps = el._caps && el._caps.length === 4 ? el._caps : (el._caps = [...el.querySelectorAll<HTMLElement>('[data-cap]')]);
    const links = el._links || (el._links = [...el.querySelectorAll<SVGPathElement>('[data-link]')]);
    const X = wide ? W * 0.3 : W * 0.6, Y = H * 0.45;
    const step = el.querySelector<HTMLElement>('[data-gstep]');
    if (step) step.textContent = p < 0.18 ? '01 — INTRODUCTION' : p < 0.455 ? '02 — INAUGURATION' : p < 0.7 ? '03 — ÉVÉNEMENT D’ENTREPRISE' : '04 — CONCLUSION';
    el.querySelectorAll<El>('[data-show]').forEach((c) => { const [a, b] = (c.dataset.show || '').split(',').map(Number); this.show(c, p >= a && p < b); });
    const sr = stage.getBoundingClientRect();
    const center = el.querySelector<HTMLElement>('[data-center]');
    const cr = center ? center.getBoundingClientRect() : sr;
    caps.forEach((c) => {
      const i = +(c.dataset.cap || 0), g = GROUP[i] || { side: 1, row: 1 };
      let dx = 0, dy = 0, op = 0, draw = 0;
      if (p < 0.42) { const k = stg(S(0.19, 0.3), i); dx = g.side * (1 - k) * X; dy = -g.row * Math.sin(Math.PI * k) * 18; op = k; draw = E3(S(0.28, 0.32)); }
      else if (p < 0.465) { const r = E3(S(0.42, 0.465)); dx = g.side * r * X * 0.7; dy = g.row * r * 20; op = 1 - r; draw = 1 - E3(S(0.42, 0.44)); }
      else if (p < 0.665) { const k = stg(S(0.47, 0.58), 3 - i); dx = g.side * (1 - k) * X * 0.25; dy = g.row * (1 - k) * Y; op = k; draw = E3(S(0.57, 0.61)); }
      else { const f = E3(S(0.665, 0.7)); dy = g.row * f * Y * 0.6; op = 1 - f; draw = 1 - E3(S(0.665, 0.68)); }
      if (this.reduced) { dx = 0; dy = 0; }
      c.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
      c.style.opacity = op.toFixed(3);
      c.style.pointerEvents = op > 0.5 ? '' : 'none';
      const r1 = c.querySelector<HTMLElement>('[data-role="1"]'), r2 = c.querySelector<HTMLElement>('[data-role="2"]');
      const second = p >= 0.455;
      if (r1) r1.style.opacity = second ? '0' : '1';
      if (r2) r2.style.opacity = second ? '1' : '0';
      const ln = links[i];
      if (ln) {
        const b = c.getBoundingClientRect();
        let d: string;
        if (wide) {
          const x1 = (g.side < 0 ? b.right : b.left) - sr.left, y1 = b.top + b.height / 2 - sr.top;
          const x2 = (g.side < 0 ? cr.left - 16 : cr.right + 16) - sr.left, y2 = cr.top + cr.height / 2 - sr.top;
          const m = (x2 - x1) * 0.55;
          d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + m).toFixed(1)} ${y1.toFixed(1)} ${(x2 - m).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        } else {
          const x1 = b.left + b.width / 2 - sr.left, y1 = b.top - sr.top;
          const x2 = cr.left + cr.width / 2 - sr.left + g.side * 20, y2 = cr.bottom - sr.top + 10;
          const m = (y1 - y2) * 0.5;
          d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${(y1 - m).toFixed(1)} ${x2.toFixed(1)} ${(y2 + m).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        }
        ln.setAttribute('d', d);
        ln.setAttribute('stroke-dashoffset', (1 - draw).toFixed(3));
        ln.setAttribute('opacity', (draw * 0.5).toFixed(3));
      }
    });
  }

  // ——— Orizon Connect : réseau ———
  drawNet(p: number) {
    const c = this.net; if (!c) return;
    const dpr = Math.min(2, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const x = c.getContext('2d'); if (!x) return;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, w, h);
    const t = cl((p - 0.76) / 0.2);
    const th = (0.04 + Math.min(p, 0.76) * 0.14) * Math.max(w, h);
    const P = this.pts.map(([a, b]) => [a * w, b * h]);
    x.lineWidth = 1;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], d = Math.sqrt(dx * dx + dy * dy);
      if (d < th) {
        x.strokeStyle = `rgba(74,26,107,${((1 - d / th) * 0.3 * (1 - t)).toFixed(3)})`;
        x.beginPath(); x.moveTo(P[i][0], P[i][1]); x.lineTo(P[j][0], P[j][1]); x.stroke();
      }
    }
    const L1 = (a: number, b: number) => Math.round(a + (b - a) * t);
    x.fillStyle = `rgba(${L1(161, 227)},${L1(40, 18)},${L1(106, 43)},${(0.4 + 0.55 * t).toFixed(2)})`;
    const rad = 1.4 + t * 5;
    P.forEach(([a, b]) => { x.beginPath(); x.arc(a, b, rad, 0, 6.283); x.fill(); });
    const k = Math.min(1, p / 0.7), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const L = (a: number, b: number) => a + (b - a) * e;
    const A = [L(0.04, 0.68) * w, L(0.06, 0.5) * h], B = [L(0.96, 0.82) * w, L(0.9, 0.5) * h];
    x.globalAlpha = 1 - t;
    x.setLineDash([4, 6]);
    x.strokeStyle = `rgba(74,26,107,${(0.25 + e * 0.6).toFixed(2)})`;
    x.beginPath(); x.moveTo(A[0], A[1]); x.lineTo(B[0], B[1]); x.stroke(); x.setLineDash([]);
    if (e > 0.97) { x.strokeStyle = 'rgba(245,154,51,.85)'; x.beginPath(); x.arc((A[0] + B[0]) / 2, h * 0.5, 34 + Math.sin(p * 40) * 4, 0, 6.283); x.stroke(); }
    ([[A, '#E2463A'], [B, '#4A1A6B']] as [number[], string][]).forEach(([q, col]) => {
      x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 16;
      x.beginPath(); x.arc(q[0], q[1], 6, 0, 6.283); x.fill(); x.shadowBlur = 0;
    });
    x.globalAlpha = 1;
  }
}
