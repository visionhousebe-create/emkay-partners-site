/*
 * <media-slot> — emplacement média universel (image OU vidéo).
 *
 * Attributs :
 *   id           identifiant unique (obligatoire pour la persistance)
 *   src          source par défaut (./media/client01.mp4 ou .jpg) — venant des données
 *   type         "video" | "image" — sinon détecté depuis l'extension / le MIME
 *   poster       image d'attente pour une vidéo
 *   placeholder  texte de l'état vide
 *   autoplay     "hover" (défaut) | "visible"
 *
 * Glisser-déposer ou cliquer : accepte image/jpeg, png, webp, video/mp4, video/webm.
 * Le fichier déposé est conservé dans un fichier annexe .media-<id>.state.json
 * (vidéos ≤ 20 Mo). Au-delà, il n'est affiché que pour la session : placez alors
 * le fichier dans ./media/ et renseignez mediaSrc dans les données.
 */
(() => {
  if (customElements.get('media-slot')) return;
  const ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/webm';
  const MAX_PERSIST = 20 * 1024 * 1024;
  const isVid = (src, type) => type === 'video' || /^data:video\//.test(src || '') || /\.(mp4|webm|mov)(\?|#|$)/i.test(src || '');
  const stateFile = (id) => '.media-' + String(id).replace(/[^a-z0-9_-]/gi, '_') + '.state.json';
  const readAsDataURL = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });

  const CSS =
    ':host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:rgba(255,255,255,.04);contain:paint}' +
    '.m{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;text-align:center;' +
    '  color:rgba(245,241,233,.72);font:500 12px/1.4 Archivo,system-ui,sans-serif;letter-spacing:.06em;border:1px dashed rgba(245,241,233,.28);cursor:pointer}' +
    '.empty b{font-weight:700;letter-spacing:.18em;font-size:10px;color:rgba(245,241,233,.9)}' +
    ':host([data-over]) .empty,:host([data-over]) .ov{background:rgba(245,241,233,.12)}' +
    '.tag{position:absolute;left:10px;top:10px;padding:5px 8px;font:700 10px/1 Archivo,system-ui,sans-serif;letter-spacing:.2em;background:rgba(12,3,64,.78);color:#F5F1E9;pointer-events:none}' +
    '.ctl{position:absolute;right:10px;top:10px;display:flex;gap:6px;opacity:0;transition:opacity .25s}' +
    ':host(:hover) .ctl,:host(:focus-within) .ctl{opacity:1}' +
    '.ctl button{all:unset;cursor:pointer;padding:7px 10px;font:700 10px/1 Archivo,system-ui,sans-serif;letter-spacing:.18em;background:#F5F1E9;color:#0C0340}' +
    '.note{position:absolute;left:10px;right:10px;bottom:10px;padding:8px 10px;font:500 11px/1.4 Archivo,system-ui,sans-serif;background:rgba(12,3,64,.88);color:#F5F1E9;display:none}' +
    ':host([data-note]) .note{display:block}';

  class MediaSlot extends HTMLElement {
    static get observedAttributes() { return ['src', 'type', 'poster', 'placeholder']; }
    constructor() {
      super();
      const r = this.attachShadow({ mode: 'open' });
      r.innerHTML = '<style>' + CSS + '</style><div class="host-inner"></div>' +
        '<div class="ctl" data-dc-edit-transparent><button data-act="pick" title="Remplacer le média">REMPLACER</button><button data-act="clear" title="Revenir à la source par défaut">×</button></div>' +
        '<div class="note"></div><input type="file" hidden accept="' + ACCEPT + '">';
      this._box = r.querySelector('.host-inner');
      this._input = r.querySelector('input');
      this._note = r.querySelector('.note');
      this._stored = null;
      r.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('[data-act]');
        if (a) { e.preventDefault(); e.stopPropagation(); if (a.dataset.act === 'pick') this._input.click(); else this._clear(); return; }
        if (e.target.closest && e.target.closest('.empty')) { e.preventDefault(); e.stopPropagation(); this._input.click(); }
      });
      this._input.addEventListener('change', () => { const f = this._input.files && this._input.files[0]; if (f) this._take(f); this._input.value = ''; });
      this.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); this.setAttribute('data-over', ''); });
      this.addEventListener('dragleave', () => this.removeAttribute('data-over'));
      this.addEventListener('drop', (e) => {
        e.preventDefault(); e.stopPropagation(); this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) this._take(f);
      });
      this.addEventListener('mouseenter', () => { if ((this.getAttribute('autoplay') || 'hover') === 'hover') this.play(); });
      this.addEventListener('mouseleave', () => { if ((this.getAttribute('autoplay') || 'hover') === 'hover') this.pause(); });
    }
    connectedCallback() {
      if (!this._sync) { this._sync = (e) => { if (e.detail && e.detail.sid === this._sid && e.detail.from !== this) { this._stored = e.detail.stored; this._render(); } }; window.addEventListener('media-slot-sync', this._sync); }
      this._render();
      if (this._sid && !this._loaded) {
        this._loaded = true;
        fetch(stateFile(this._sid)).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.u) { this._stored = j; this._render(); } }).catch(() => {});
      }
      if (!this._io && 'IntersectionObserver' in window) {
        this._io = new IntersectionObserver((es) => es.forEach((e) => {
          const vis = e.isIntersecting && e.intersectionRatio >= 0.5;
          const mode = this.getAttribute('autoplay') || 'hover';
          const coarse = !matchMedia('(pointer:fine)').matches;
          if (vis && (mode === 'visible' || coarse)) this.play(); else if (!vis) this.pause();
        }), { threshold: [0, 0.5] });
        this._io.observe(this);
      }
    }
    disconnectedCallback() { this._io && this._io.disconnect(); this._io = null; if (this._sync) { window.removeEventListener('media-slot-sync', this._sync); this._sync = null; } }
    _broadcast() { window.dispatchEvent(new CustomEvent('media-slot-sync', { detail: { sid: this._sid, stored: this._stored, from: this } })); }
    attributeChangedCallback() { if (this.isConnected) this._render(); }
    get _sid() { return this.getAttribute('slot-id') || this.id; }
    get _src() { const a = (this.getAttribute('src') || '').trim(); return (this._stored && this._stored.u) || (a.includes('{{') ? '' : a); }
    get _isVideo() { return this._stored ? this._stored.t === 'video' : isVid(this._src, this.getAttribute('type')); }
    get mediaType() { return this._src ? (this._isVideo ? 'video' : 'image') : 'empty'; }
    play() {
      const v = this._box.querySelector('video'); if (!v) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {});
    }
    pause() { const v = this._box.querySelector('video'); if (v) v.pause(); }
    _render() {
      const src = this._src, ph = this.getAttribute('placeholder') || 'Média';
      const key = src + '|' + this._isVideo;
      if (this._key === key) return; this._key = key;
      this._box.innerHTML = '';
      this.shadowRoot.querySelector('.ctl').style.display = src ? '' : 'none';
      if (!src) {
        if (this.hasAttribute('noempty')) return;
        const e = document.createElement('div'); e.className = 'empty';
        e.innerHTML = '<b>VIDÉO MP4 OU IMAGE</b><span></span><span style="opacity:.7">Glisser-déposer ou cliquer</span>';
        e.children[1].textContent = ph;
        this._box.appendChild(e); return;
      }
      if (this._isVideo) {
        const v = document.createElement('video');
        v.className = 'm'; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
        v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('loop', '');
        const poster = this.getAttribute('poster'); if (poster && !poster.includes('{{')) v.poster = poster;
        v.src = src;
        this._box.appendChild(v);
        const t = document.createElement('span'); t.className = 'tag'; t.textContent = '▶ VIDÉO'; this._box.appendChild(t);
      } else {
        const i = document.createElement('img'); i.className = 'm'; i.alt = ph; i.loading = 'lazy'; i.src = src; this._box.appendChild(i);
      }
    }
    _say(msg) { this._note.textContent = msg; this.setAttribute('data-note', ''); clearTimeout(this._nt); this._nt = setTimeout(() => this.removeAttribute('data-note'), 6000); }
    async _take(f) {
      const ok = /^(image\/(jpeg|png|webp)|video\/(mp4|webm))$/.test(f.type);
      if (!ok) { this._say('Format non pris en charge. Utilisez JPG, PNG, WebP, MP4 ou WebM.'); return; }
      const t = f.type.startsWith('video/') ? 'video' : 'image';
      if (f.size > MAX_PERSIST) {
        this._stored = { u: URL.createObjectURL(f), t }; this._render(); this._broadcast();
        this._say('Fichier volumineux : affiché pour cette session uniquement. Placez-le dans ./media/ et renseignez mediaSrc.');
        return;
      }
      const u = await readAsDataURL(f);
      this._stored = { u, t }; this._render(); this._broadcast();
      const w = window.omelette && window.omelette.writeFile;
      if (w && this._sid) Promise.resolve(w(stateFile(this._sid), JSON.stringify({ u, t, name: f.name }))).catch(() => this._say("Enregistrement impossible : le média reste visible pour cette session."));
      this.dispatchEvent(new CustomEvent('media-change', { bubbles: true, detail: { type: t, name: f.name } }));
    }
    _clear() {
      this._stored = null; this._render(); this._broadcast();
      const w = window.omelette && window.omelette.writeFile;
      if (w && this._sid) Promise.resolve(w(stateFile(this._sid), JSON.stringify({}))).catch(() => {});
    }
  }
  customElements.define('media-slot', MediaSlot);
})();
