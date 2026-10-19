'use client';

import { upload } from '@vercel/blob/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FORMATS, MAX_MEDIA, MAX_PROJECTS, slugify, type Project, type ProjectMedia } from '@/lib/projects';
import { Logo } from '../media';

type Upload = { id: string; name: string; pct: number; error?: string };

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime';
const isVideoFile = (f: File) => f.type.startsWith('video/');
const safeName = (name: string) => {
  const dot = name.lastIndexOf('.');
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  return `${slugify(dot > 0 ? name.slice(0, dot) : name)}${ext ? '.' + ext : ''}`;
};
const newId = () => `projet-${Math.random().toString(36).slice(2, 8)}`;
const blank = (): Project => ({ id: newId(), client: 'Nouveau projet', sector: '', location: '', title: '', description: '', year: '', services: [], format: '16/9', media: [], published: false });

export default function AdminApp({ initialProjects, source, storage, loadError }: { initialProjects: Project[]; source: 'blob' | 'default'; storage: boolean; loadError: string }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [saved, setSaved] = useState(JSON.stringify(initialProjects));
  const [sel, setSel] = useState(0);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(
    loadError ? { kind: 'err', text: `Lecture des projets impossible : ${loadError}` } : source === 'default' ? { kind: 'info', text: 'Projets de départ (rien n’a encore été publié depuis cette administration).' } : null,
  );
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const posterFor = useRef(-1);

  const dirty = useMemo(() => JSON.stringify(projects) !== saved, [projects, saved]);
  const uploading = uploads.some((u) => u.pct < 100 && !u.error);
  const p = projects[sel];

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty || uploading) e.preventDefault(); };
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [dirty, uploading]);

  const update = (patch: Partial<Project>) => setProjects((ps) => ps.map((x, i) => (i === sel ? { ...x, ...patch } : x)));
  const move = <T,>(arr: T[], from: number, to: number) => { const a = [...arr]; const [x] = a.splice(from, 1); a.splice(to, 0, x); return a; };

  const addProject = () => {
    if (projects.length >= MAX_PROJECTS) return;
    setProjects((ps) => [...ps, blank()]);
    setSel(projects.length);
  };
  const removeProject = () => {
    if (!p || !confirm(`Supprimer le projet « ${p.client} » ? Ses médias seront supprimés à la publication.`)) return;
    setProjects((ps) => ps.filter((_, i) => i !== sel));
    setSel((s) => Math.max(0, s - 1));
  };
  const moveProject = (d: -1 | 1) => {
    const to = sel + d;
    if (to < 0 || to >= projects.length) return;
    setProjects((ps) => move(ps, sel, to));
    setSel(to);
  };

  const sendFiles = async (files: File[], onDone: (url: string, f: File) => void) => {
    if (!p) return;
    const projectId = slugify(p.id);
    for (const f of files) {
      const uid = Math.random().toString(36).slice(2);
      setUploads((u) => [...u, { id: uid, name: f.name, pct: 0 }]);
      try {
        const blob = await upload(`vision-house/${projectId}/${safeName(f.name)}`, f, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
          contentType: f.type || undefined,
          multipart: f.size > 20 * 1024 * 1024,
          // La progression est envoyée en différé : ne jamais revenir en arrière une fois l'envoi terminé (100 %).
          onUploadProgress: ({ percentage }) => setUploads((u) => u.map((x) => (x.id === uid && x.pct < 100 ? { ...x, pct: Math.max(x.pct, Math.min(99, Math.round(percentage))) } : x))),
        });
        setUploads((u) => u.map((x) => (x.id === uid ? { ...x, pct: 100 } : x)));
        onDone(blob.url, f);
      } catch (e) {
        setUploads((u) => u.map((x) => (x.id === uid ? { ...x, error: (e as Error).message || 'échec' } : x)));
      }
    }
    setTimeout(() => setUploads((u) => u.filter((x) => x.error || x.pct < 100)), 2500);
  };

  const onFiles = (list: FileList | null) => {
    if (!list || !p) return;
    const room = MAX_MEDIA - p.media.length;
    const files = [...list].slice(0, Math.max(0, room));
    const target = sel;
    sendFiles(files, (url, f) =>
      setProjects((ps) => ps.map((x, i) => (i === target ? { ...x, media: [...x.media, { url, type: isVideoFile(f) ? 'video' : 'image' }] } : x))),
    );
  };
  const onPoster = (list: FileList | null) => {
    const f = list?.[0];
    const mi = posterFor.current;
    if (!f || mi < 0 || !f.type.startsWith('image/')) return;
    const target = sel;
    sendFiles([f], (url) =>
      setProjects((ps) => ps.map((x, i) => (i === target ? { ...x, media: x.media.map((m, j) => (j === mi ? { ...m, poster: url } : m)) } : x))),
    );
  };
  const setMedia = (media: ProjectMedia[]) => update({ media });

  const publish = async () => {
    setBusy(true); setStatus(null);
    try {
      const res = await fetch('/api/admin/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projects }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        setProjects(j.projects); setSaved(JSON.stringify(j.projects));
        setStatus({ kind: 'ok', text: 'Publié. Le site est à jour (rechargez la page du site pour voir le résultat).' });
      } else if (res.status === 401) setStatus({ kind: 'err', text: 'Session expirée : reconnectez-vous (vos modifications restent dans cet onglet).' });
      else if (j.error === 'no_storage') setStatus({ kind: 'err', text: 'Stockage Vercel Blob non configuré : impossible de publier.' });
      else setStatus({ kind: 'err', text: `Publication impossible (${j.detail || j.error || res.status}).` });
    } catch {
      setStatus({ kind: 'err', text: 'Publication impossible : réseau indisponible.' });
    }
    setBusy(false);
  };
  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); location.reload(); };

  return (
    <div className="adm">
      <header className="adm-hd">
        <a href="/" target="_blank" rel="noreferrer" className="adm-brand"><Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', height: 26, width: 'auto' }} /><span>VISION HOUSE · PROJETS</span></a>
        <div className="adm-actions">
          {dirty && <span className="adm-dirty">Modifications non publiées</span>}
          <button type="button" className="btn-reset adm-btn adm-primary" onClick={publish} disabled={busy || uploading || !storage || !dirty}>{busy ? 'PUBLICATION…' : 'PUBLIER SUR LE SITE'}</button>
          <button type="button" className="btn-reset adm-link" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      {!storage && <p className="adm-banner adm-err-b">Stockage non configuré : créez un Blob Store dans Vercel (Storage → Create → Blob) relié à ce projet, puis redéployez. En attendant, vous pouvez préparer les textes mais pas envoyer de fichiers ni publier.</p>}
      {status && <p className={`adm-banner ${status.kind === 'ok' ? 'adm-ok-b' : status.kind === 'err' ? 'adm-err-b' : ''}`} role="status">{status.text}</p>}

      <div className="adm-body">
        <aside className="adm-list">
          <div className="adm-list-h"><span>PROJETS ({projects.length})</span><button type="button" className="btn-reset adm-link" onClick={addProject} disabled={projects.length >= MAX_PROJECTS}>+ Ajouter</button></div>
          <ol>
            {projects.map((x, i) => (
              <li key={x.id}>
                <button type="button" className={`btn-reset adm-item${i === sel ? ' on' : ''}`} onClick={() => setSel(i)}>
                  <span className="adm-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="adm-item-t"><b>{x.client || 'Sans nom'}</b><small>{[x.media.length ? `${x.media.length} média${x.media.length > 1 ? 's' : ''}` : 'aucun média', x.published ? '' : 'masqué'].filter(Boolean).join(' · ')}</small></span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {p ? (
          <section className="adm-edit">
            <div className="adm-row adm-tools">
              <button type="button" className="btn-reset adm-btn" onClick={() => moveProject(-1)} disabled={sel === 0}>↑ Monter</button>
              <button type="button" className="btn-reset adm-btn" onClick={() => moveProject(1)} disabled={sel === projects.length - 1}>↓ Descendre</button>
              <label className="adm-check"><input type="checkbox" checked={p.published} onChange={(e) => update({ published: e.target.checked })} /> Visible sur le site</label>
              <button type="button" className="btn-reset adm-btn adm-danger" onClick={removeProject}>Supprimer</button>
            </div>

            <div className="adm-grid">
              <Field label="Client / marque *" value={p.client} onChange={(v) => update({ client: v })} max={80} />
              <Field label="Secteur" value={p.sector} onChange={(v) => update({ sector: v })} max={80} hint="ex. Salon de coiffure" />
              <Field label="Lieu" value={p.location} onChange={(v) => update({ location: v })} max={60} hint="ex. Bruxelles" />
              <Field label="Année" value={p.year} onChange={(v) => update({ year: v })} max={12} />
              <Field label="Réalisation / résultat" value={p.title} onChange={(v) => update({ title: v })} max={140} wide hint="ex. Aftermovie · campagne ads promotionnelle" />
              <Field label="Services (séparés par des virgules)" value={p.services.join(', ')} onChange={(v) => update({ services: v.split(',').map((s) => s.trim()).filter(Boolean) })} max={300} wide />
              <label className="adm-field wide">
                <span>Description (affichée dans la fiche du projet)</span>
                <textarea rows={5} maxLength={2000} value={p.description} onChange={(e) => update({ description: e.target.value })} />
              </label>
              <label className="adm-field">
                <span>Format de la carte</span>
                <select value={p.format} onChange={(e) => update({ format: e.target.value as Project['format'] })}>
                  {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </label>
            </div>

            <div className="adm-media-h">
              <span>MÉDIAS ({p.media.length}/{MAX_MEDIA}) — le premier est la couverture</span>
              <button type="button" className="btn-reset adm-btn adm-primary" onClick={() => fileRef.current?.click()} disabled={!storage || p.media.length >= MAX_MEDIA}>+ Ajouter photos / vidéos</button>
              <input ref={fileRef} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
              <input ref={posterRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => { onPoster(e.target.files); e.target.value = ''; }} />
            </div>
            <div
              className="adm-drop"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('over'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('over')}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('over'); if (storage) onFiles(e.dataTransfer.files); }}
            >
              {p.media.length === 0 && <p>Glissez-déposez des photos (JPG, PNG, WebP) ou des vidéos (MP4, WebM, MOV) ici.</p>}
              <ul className="adm-media">
                {p.media.map((m, j) => (
                  <li key={m.url}>
                    <div className="adm-thumb">
                      {m.type === 'video'
                        ? <video src={m.url} poster={m.poster} muted playsInline preload="metadata" />
                         : <img src={m.url} alt="" loading="lazy" />}
                      {j === 0 && <span className="adm-cover">COUVERTURE</span>}
                      <span className="adm-kind">{m.type === 'video' ? 'VIDÉO' : 'PHOTO'}</span>
                    </div>
                    <div className="adm-mtools">
                      <button type="button" className="btn-reset" title="Vers la gauche" onClick={() => j > 0 && setMedia(move(p.media, j, j - 1))} disabled={j === 0}>←</button>
                      <button type="button" className="btn-reset" title="Vers la droite" onClick={() => j < p.media.length - 1 && setMedia(move(p.media, j, j + 1))} disabled={j === p.media.length - 1}>→</button>
                      {j > 0 && <button type="button" className="btn-reset" title="Mettre en couverture" onClick={() => setMedia(move(p.media, j, 0))}>★</button>}
                      {m.type === 'video' && <button type="button" className="btn-reset" title="Image d’aperçu de la vidéo" onClick={() => { posterFor.current = j; posterRef.current?.click(); }} disabled={!storage}>{m.poster ? 'Aperçu ✓' : '+ Aperçu'}</button>}
                      <button type="button" className="btn-reset adm-x" title="Retirer" onClick={() => setMedia(p.media.filter((_, k) => k !== j))}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {uploads.length > 0 && (
              <ul className="adm-uploads">
                {uploads.map((u) => (
                  <li key={u.id}><span>{u.name}</span><span className="adm-bar"><i style={{ width: `${u.error ? 100 : u.pct}%`, background: u.error ? '#B3261E' : undefined }} /></span><span>{u.error ? `Échec : ${u.error}` : `${u.pct} %`}</span></li>
                ))}
              </ul>
            )}
            <p className="adm-help">Conseils : photos en JPG/WebP, 2500 px de large maximum. Vidéos en MP4 (H.264), 1080p, quelques minutes au plus ; ajoutez une image d’aperçu pour chaque vidéo. Les fichiers retirés sont supprimés du stockage à la publication.</p>
          </section>
        ) : (
          <section className="adm-edit"><p>Aucun projet. <button type="button" className="btn-reset adm-link" onClick={addProject}>Ajouter un projet</button></p></section>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, max, hint, wide }: { label: string; value: string; onChange: (v: string) => void; max: number; hint?: string; wide?: boolean }) {
  return (
    <label className={`adm-field${wide ? ' wide' : ''}`}>
      <span>{label}</span>
      <input type="text" value={value} maxLength={max} placeholder={hint} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
