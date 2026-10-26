'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ALIAS, ARRIVE, BRANDS, FORMS, QUICK, SETTINGS, type FormKind } from '@/lib/data';
import { ScrollEngine, type EngineState } from '@/lib/scrollEngine';
import { Logo } from './media';
import { Sections, type UI } from './sections';
import type { Project } from '@/lib/projects';

const B = BRANDS;
const AUTO: Record<string, string> = { nom: 'name', email: 'email', telephone: 'tel', entreprise: 'organization', organisation: 'organization' };

export default function EmkaySite({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ScrollEngine | null>(null);
  const timers = useRef<{ tv?: number; tq?: number; tm?: number }>({});
  const qaOpener = useRef<Element | null>(null);

  const [wide, setWide] = useState(true);
  const [fine, setFine] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [es, setEs] = useState<EngineState>({ brand: -1, header: false, hd: '#F5F1E9' });
  const [cursor, setCursor] = useState('');
  const [hoverDot, setHoverDot] = useState(-1);
  const [choice, setChoice] = useState<FormKind | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const formAt = useRef(0);
  const [qa, setQa] = useState(false);
  const [qaIn, setQaIn] = useState(false);
  const [qaHover, setQaHover] = useState(-1);
  const [mega, setMega] = useState(false);
  const [megaIn, setMegaIn] = useState(false);
  const [megaHover, setMegaHover] = useState(-1);
  const [roomHover, setRoomHover] = useState(-1);

  // Valeurs lues par les gestionnaires d'événements globaux.
  const live = useRef({ wide, fine, qa, mega, choice, roomHover, cursor });
  live.current = { wide, fine, qa, mega, choice, roomHover, cursor };

  // ——— Navigation interne (voile violet pour les longs sauts) ———
  const goTo = useCallback((raw: string, instant?: boolean) => {
    const id = ALIAS[raw] || raw, el = document.getElementById(id);
    const eng = engine.current;
    if (!el) return false;
    eng?.update();
    const top = el.getBoundingClientRect().top + scrollY, f = live.current.wide ? ARRIVE[id] : undefined; // téléphone : sections à plat, on arrive en haut
    const y = Math.max(0, f != null ? top + f * Math.max(0, el.offsetHeight - innerHeight) : top);
    try { history.replaceState(null, '', id === 'top' ? location.pathname + location.search : '#' + id); } catch { /* noop */ }
    const L = live.current;
    if (L.qa || L.mega || L.choice) { setQa(false); setQaIn(false); setMega(false); setMegaIn(false); }
    document.documentElement.style.overflow = '';
    const v = veilRef.current, jump = () => { window.scrollTo({ top: y, behavior: 'instant' }); engine.current?.update(); };
    if (instant || eng?.reduced || !v) { jump(); return true; }
    if (Math.abs(y - scrollY) < innerHeight * 1.2) { window.scrollTo({ top: y, behavior: 'smooth' }); return true; }
    clearTimeout(timers.current.tv);
    v.style.transition = 'opacity .32s ease'; v.style.opacity = '1'; v.style.pointerEvents = 'auto';
    timers.current.tv = window.setTimeout(() => {
      jump();
      requestAnimationFrame(() => requestAnimationFrame(() => { v.style.transition = 'opacity .6s ease'; v.style.opacity = '0'; v.style.pointerEvents = 'none'; }));
    }, 340);
    return true;
  }, []);

  const openQa = useCallback(() => {
    qaOpener.current = document.activeElement;
    document.documentElement.style.overflow = 'hidden';
    setQa(true); setQaIn(false); setMega(false); setQaHover(-1);
    clearTimeout(timers.current.tq);
    timers.current.tq = window.setTimeout(() => {
      setQaIn(true);
      document.querySelector<HTMLElement>('[data-trap] nav a')?.focus({ preventScroll: true });
    }, 30);
  }, []);

  const closeQa = useCallback(() => {
    setQaIn(false);
    clearTimeout(timers.current.tq);
    timers.current.tq = window.setTimeout(() => {
      setQa(false);
      document.documentElement.style.overflow = '';
      (qaOpener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    }, 380);
  }, []);

  const openMega = () => { clearTimeout(timers.current.tm); setMega(true); setMegaIn(false); setMegaHover(-1); timers.current.tm = window.setTimeout(() => setMegaIn(true), 20); };
  const closeMega = () => { clearTimeout(timers.current.tm); setMegaIn(false); timers.current.tm = window.setTimeout(() => setMega(false), 320); };

  const openForm = useCallback((k: FormKind) => { formAt.current = Date.now(); setChoice(k); setSent(false); setSendError(''); }, []);

  // ——— Montage : moteur, écouteurs ———
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const isFine = matchMedia('(pointer: fine)').matches;
    const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setFine(isFine); setReduced(isReduced); setWide(innerWidth > 900);
    if (isFine && SETTINGS.customCursor) document.body.classList.add('emk-cursor');

    const eng = new ScrollEngine(root, {
      getWide: () => live.current.wide,
      getRoomHover: () => live.current.roomHover,
      orbitSpeed: SETTINGS.orbitSpeed,
      onState: setEs,
    });
    eng.net = netRef.current;
    engine.current = eng;

    const onResize = () => { live.current.wide = innerWidth > 900; setWide(innerWidth > 900); eng.schedule(); };
    const onMove = (e: MouseEvent) => {
      eng.mx = e.clientX / innerWidth - 0.5; eng.my = e.clientY / innerHeight - 0.5;
      const c = curRef.current;
      if (c) c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const t = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const l = t ? t.dataset.cursor || '' : '';
      if (l !== live.current.cursor) { live.current.cursor = l; setCursor(l); }
    };
    const onDocClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]'); if (!a) return;
      const h = (a.getAttribute('href') || '').slice(1);
      if (!h) { e.preventDefault(); return; }
      if (goTo(decodeURIComponent(h))) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      const L = live.current;
      if (e.key === 'Escape') {
        if (L.choice) setChoice(null);
        else if (L.qa) closeQa();
        else if (L.mega) { setMega(false); setMegaIn(false); }
        return;
      }
      if (e.key !== 'Tab') return;
      const traps = document.querySelectorAll('[data-trap]'), t = traps[traps.length - 1]; if (!t) return;
      const f = [...t.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((x) => x.tabIndex !== -1 && (x.offsetParent !== null || x === document.activeElement));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], cur = document.activeElement;
      if (!t.contains(cur)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
    };
    const onHash = () => { const h = location.hash.slice(1); if (h) goTo(decodeURIComponent(h)); };

    document.addEventListener('scroll', eng.schedule, { capture: true, passive: true });
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    addEventListener('hashchange', onHash);
    addEventListener('resize', onResize);
    addEventListener('mousemove', onMove, { passive: true });

    const hashTimers: number[] = [];
    const h0 = location.hash.slice(1);
    if (h0) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      [60, 450, 1100].forEach((t) => hashTimers.push(window.setTimeout(() => goTo(decodeURIComponent(h0), true), t)));
    }
    eng.start();
    const t1 = window.setTimeout(() => eng.update(), 400);
    const tm = timers.current;

    return () => {
      document.removeEventListener('scroll', eng.schedule, { capture: true });
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      removeEventListener('hashchange', onHash);
      removeEventListener('resize', onResize);
      removeEventListener('mousemove', onMove);
      clearTimeout(t1); hashTimers.forEach(clearTimeout);
      clearTimeout(tm.tv); clearTimeout(tm.tq); clearTimeout(tm.tm);
      document.documentElement.style.overflow = '';
      document.body.classList.remove('emk-cursor');
      eng.stop();
      engine.current = null;
    };
  }, [goTo, closeQa]);

  // Après chaque rendu (changement de mise en page wide/narrow, menus…), recalcule les positions.
  useEffect(() => { engine.current?.invalidate(); engine.current?.schedule(); });

  const { brand, header, hd } = es;
  const ui: UI = { wide, fine, reduced, netRef, openQa, openForm, roomHover, setRoomHover };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!choice || sending) return;
    setSending(true); setSendError('');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, kind: choice, _t: Date.now() - formAt.current }) });
      if (res.ok) setSent(true);
      else setSendError(res.status === 422 || res.status === 400 ? 'MERCI DE VÉRIFIER VOTRE NOM, VOTRE E-MAIL ET VOTRE MESSAGE.' : 'VOTRE MESSAGE N’A PAS PU PARTIR. MERCI DE RÉESSAYER DANS UN INSTANT.');
    } catch {
      setSendError('VOTRE MESSAGE N’A PAS PU PARTIR. MERCI DE RÉESSAYER DANS UN INSTANT.');
    } finally {
      setSending(false);
    }
  };

  const qaBtnOn = header && !qa && !choice && !mega;
  const indicatorOn = brand >= 0 && wide;
  const form = choice ? FORMS[choice] : null;

  return (
    <div ref={rootRef} className="emk-root">
      {/* ——— Header ——— */}
      <header className="hd" style={{ color: hd, opacity: header ? 1 : 0, pointerEvents: header ? 'auto' : 'none', background: wide ? undefined : isLightColor(hd) ? 'rgba(14,9,20,.72)' : 'rgba(251,246,240,.8)' }}>
        <a href="#top" aria-label="EMKAY Partners, accueil" className="hd-logo">
          {wide ? (
            <Logo src="/logos/emkay.png" alt="EMKAY Partners" priority style={{ display: 'block', height: 30, width: 'auto', filter: isLightColor(hd) ? 'none' : 'brightness(0)', transition: 'filter .6s ease' }} />
          ) : (
            <span className="hd-logo-txt">EMKAY PARTNERS</span>
          )}
        </a>
        <a href={'#' + (brand >= 0 ? B[brand].id : 'top')} aria-label="Section en cours" aria-hidden={!indicatorOn} tabIndex={indicatorOn ? undefined : -1} className="hd-ind" style={{ opacity: indicatorOn ? 1 : 0, pointerEvents: indicatorOn ? 'auto' : 'none', visibility: wide ? 'visible' : 'hidden', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ opacity: 0.5 }}>/</span><span style={{ fontWeight: 700 }}>{brand >= 0 ? B[brand].name : ''}</span><span style={{ opacity: 0.6 }}>{brand >= 0 ? '0' + (brand + 1) : '00'} / 05</span>
        </a>
        {wide ? (
          <nav aria-label="Navigation principale" className="hd-nav">
            <a href="#groupe" data-cursor="ALLER" className="hd-link">LE GROUPE</a>
            <div onMouseEnter={() => { if (fine && !mega) openMega(); else if (fine) { clearTimeout(timers.current.tm); setMegaIn(true); } }} onMouseLeave={() => { if (fine) closeMega(); }} style={{ position: 'relative' }}>
              <button type="button" onClick={() => (mega && megaIn ? closeMega() : openMega())} aria-expanded={mega} aria-haspopup="true" data-cursor="OUVRIR" className="btn-reset hd-link hd-mega-btn">
                NOS MARQUES<span style={{ display: 'inline-block', transition: 'transform .4s', transform: `rotate(${megaIn ? '180deg' : '0deg'})` }}>↓</span>
              </button>
              {mega && (
                <div role="menu" className="mega-wrap">
                  <div className="mega" style={{ opacity: megaIn ? 1 : 0, transform: `translateY(${megaIn ? '0px' : '-8px'})`, clipPath: megaIn ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}>
                    <div className="mega-head"><span>MARQUE</span><span>POUR QUOI ?</span><span /></div>
                    {QUICK.map((q, i) => {
                      const b = B[q.b], on = megaHover === i;
                      return (
                        <a key={b.id} href={'#' + b.id} role="menuitem" data-cursor="ALLER" onMouseEnter={() => setMegaHover(i)} onFocus={() => setMegaHover(i)} className="mega-row" style={{ background: on ? q.qBg : 'rgba(43,20,61,0)', color: on ? q.qFg : '#F5F1E9' }}>
                          <span className="mega-name">{b.name}</span>
                          <span className="mega-short">{q.short}</span>
                          <span className="mega-arrow" style={{ transform: `translateX(${on ? '6px' : '0px'})` }}>→</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <a href="#projets" data-cursor="ALLER" className="hd-link">NOS PROJETS</a>
            <a href="#a-propos" data-cursor="ALLER" className="hd-link">À PROPOS</a>
            <a href="#contact" data-cursor="ALLER" className="hd-link">CONTACT</a>
          </nav>
        ) : (
          <button type="button" onClick={openQa} aria-label="Ouvrir le menu" className="btn-reset hd-menu">MENU</button>
        )}
      </header>

      {/* ——— Accès rapide ——— */}
      {qa && (
        <div data-trap="" role="dialog" aria-modal="true" aria-label="Accès rapide" className="qa" style={{ opacity: qaIn ? 1 : 0, clipPath: qaIn || reduced ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}>
          <div className="qa-in">
            <div className="qa-top">
              <Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', height: 28, width: 'auto', objectFit: 'contain' }} />
              <button type="button" onClick={closeQa} aria-label="Fermer l’accès rapide" className="btn-reset qa-close">FERMER ✕</button>
            </div>
            <div className="qa-title">
              <h2 className="serif" style={{ opacity: qaIn ? 1 : 0, transform: `translateY(${qaIn ? '0px' : '24px'})` }}>Où voulez-vous <em>aller ?</em></h2>
              <p style={{ opacity: qaIn ? 1 : 0 }}>Accédez directement à la marque ou à l’information qui vous intéresse.</p>
            </div>
            <nav aria-label="Nos marques" onMouseLeave={() => setQaHover(-1)} className="qa-list">
              {QUICK.map((q, i) => {
                const b = B[q.b], on = qaHover === i;
                const delay = (0.12 + i * 0.06).toFixed(2) + 's';
                return (
                  <a key={b.id} href={'#' + b.id} data-cursor="ALLER" onMouseEnter={() => setQaHover(i)} onFocus={() => setQaHover(i)} className="qa-row"
                    style={{ background: on ? q.qBg : 'rgba(43,20,61,0)', color: on ? q.qFg : '#F5F1E9', opacity: qaIn ? 1 : 0, transform: `translateY(${qaIn || reduced ? '0px' : '28px'})`, transition: `background-color .6s ease, color .5s ease, opacity .6s ease ${delay}, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}` }}>
                    <span className="qa-num">{b.num}</span>
                    <span className="qa-mid">
                      <span className="qa-name">{b.name}</span>
                      <span className="qa-purpose serif">{q.purpose}</span>
                    </span>
                    <span className="qa-go">
                      {wide && <span>ALLER À {b.name}</span>}
                      <span style={{ fontSize: 18, transition: 'transform .5s cubic-bezier(.2,.7,.2,1)', transform: `translateX(${on ? '8px' : '0px'})` }}>→</span>
                    </span>
                  </a>
                );
              })}
            </nav>
            <div className="qa-links" style={{ opacity: qaIn ? 1 : 0 }}>
              <a href="#projets" data-cursor="ALLER">VOIR NOS PROJETS →</a>
              <a href="#a-propos" data-cursor="ALLER">COMPRENDRE EMKAY PARTNERS →</a>
              <a href="#contact" data-cursor="ALLER">NOUS CONTACTER →</a>
            </div>
            <div className="qa-foot">BRUXELLES, BELGIQUE.</div>
          </div>
        </div>
      )}

      {wide && fine && (
        <button type="button" onClick={openQa} data-cursor="OUVRIR" aria-label="Accès rapide aux marques et au contact" className="btn-reset qa-fab" style={{ opacity: qaBtnOn ? 1 : 0, pointerEvents: qaBtnOn ? 'auto' : 'none' }}>ACCÈS RAPIDE ↗︎</button>
      )}

      <div ref={veilRef} aria-hidden="true" className="veil" />

      {/* ——— Navigation latérale des marques ——— */}
      {wide && SETTINGS.sideNav && (
        <div onMouseLeave={() => setHoverDot(-1)} className="side" style={{ opacity: brand >= 0 ? 1 : 0, pointerEvents: brand >= 0 ? 'auto' : 'none' }}>
          <div className="side-line" />
          {B.map((b, i) => {
            const size = brand === i ? 11 : 5;
            return (
              <a key={b.id} href={'#' + b.id} onMouseEnter={() => setHoverDot(i)} className="side-item">
                <span style={{ whiteSpace: 'nowrap', transition: 'opacity .3s, transform .3s', opacity: hoverDot === i ? 1 : 0, transform: `translateX(${hoverDot === i ? '0px' : '8px'})` }}>{b.name}</span>
                <span style={{ opacity: 0.7 }}>{b.num}</span>
                <span style={{ width: size, height: size, background: '#F5F1E9', borderRadius: '50%', transition: 'all .3s', marginRight: (5 - size) / 2 }} />
              </a>
            );
          })}
        </div>
      )}

      <Sections ui={ui} projects={projects} />

      {/* ——— Formulaire ——— */}
      {form && (
        <div data-trap="" role="dialog" aria-modal="true" aria-label="Formulaire de contact" className="form-dlg">
          <div className="form-top">
            <span>CONTACT</span>
            <button type="button" onClick={() => setChoice(null)} className="btn-reset form-close">FERMER ✕</button>
          </div>
          <div className="form-body">
            <h3 className="serif form-title">{form.title}</h3>
            {!sent ? (
              <>
                <p className="form-intro">{form.intro}</p>
                <form onSubmit={submit} className="form-grid">
                  {/* Champ piège anti-spam : invisible pour les visiteurs, rempli par les robots. */}
                  <label className="hp" aria-hidden="true">Site web<input name="site_web" type="text" tabIndex={-1} autoComplete="off" /></label>
                  {form.fields.map((f) => (
                    <label key={choice + f.name} className="form-field" style={{ gridColumn: f.kind === 'area' ? '1/-1' : 'auto' }}>
                      <span>{f.label}</span>
                      {f.kind === 'text' && <input name={f.name} type={f.type} required={f.req} autoComplete={AUTO[f.name]} className="input" />}
                      {f.kind === 'select' && (
                        <select name={f.name} required={f.req} className="input" style={{ cursor: 'pointer', color: '#F5F1E9' }}>
                          {f.options!.map((t, i) => <option key={t} value={i === 0 ? '' : t} style={{ color: '#080808' }}>{t}</option>)}
                        </select>
                      )}
                      {f.kind === 'area' && <textarea name={f.name} rows={4} required={f.req} className="input" style={{ lineHeight: 1.4, whiteSpace: 'pre-wrap' }} />}
                    </label>
                  ))}
                  <div className="form-actions">
                    <span role="status" aria-live="polite">{sendError || 'BRUXELLES, BELGIQUE.'}</span>
                    <button type="submit" disabled={sending} className="btn-reset btn-light">{sending ? 'ENVOI…' : 'ENVOYER ↗︎'}</button>
                  </div>
                </form>
              </>
            ) : (
              <p className="form-thanks">Merci, votre message a bien été pris en compte. On revient vers vous très vite.</p>
            )}
          </div>
        </div>
      )}

      {/* ——— Curseur ——— */}
      {fine && SETTINGS.customCursor && (
        <div ref={curRef} className="cur">
          <div className="cur-dot" style={{ opacity: cursor ? 0 : 1 }} />
          {cursor && <div className="cur-label">{cursor}</div>}
        </div>
      )}
    </div>
  );
}

/** Couleur de texte du header claire (→ logo EMKAY blanc) ou foncée (→ logo noir). */
function isLightColor(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return true;
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}
