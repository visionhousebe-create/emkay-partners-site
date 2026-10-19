'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';

/** Fiche d'un projet Vision House : galerie photo / vidéo avec le son, textes, appel à l'action. */
export default function ProjectModal({ projects, index, onClose, onNavigate, onContact }: {
  projects: Project[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
  onContact: () => void;
}) {
  const p = projects[index];
  const [mi, setMi] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const m = p.media[mi];
  const count = p.media.length;

  useEffect(() => { setMi(0); }, [index]);

  useEffect(() => {
    opener.current = document.activeElement;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = '';
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      else if (e.key === 'ArrowRight' && count > 1) setMi((x) => (x + 1) % count);
      else if (e.key === 'ArrowLeft' && count > 1) setMi((x) => (x - 1 + count) % count);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [count, onClose]);

  const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const meta = [p.sector, p.location, p.year].filter(Boolean);
  const next = (index + 1) % projects.length;

  return (
    <div data-trap="" role="dialog" aria-modal="true" aria-label={`Projet ${p.client}`} className="pm">
      <div className="pm-top">
        <span>VISION HOUSE — PROJET {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <button ref={closeRef} type="button" onClick={onClose} className="btn-reset pm-close" aria-label="Fermer le projet">FERMER ✕</button>
      </div>

      <div className="pm-body">
        <div className="pm-stage">
          {m ? (
            m.type === 'embed' ? (
              <iframe key={m.url} className="pm-embed" src={m.url} title={`Vidéo — ${p.client}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            ) : m.type === 'video' ? (
              <video key={m.url} className="pm-media" src={m.url} poster={m.poster} controls playsInline preload="metadata" autoPlay={!reduced} muted={!reduced} loop />
            ) : (
              <Image key={m.url} src={m.url} alt={m.alt || `${p.client} — ${p.title || 'projet'} (${mi + 1}/${count})`} fill sizes="(max-width: 900px) 100vw, 66vw" quality={90} style={{ objectFit: 'contain' }} />
            )
          ) : (
            <div className="pm-empty">MÉDIAS À VENIR</div>
          )}
          {count > 1 && (
            <>
              <button type="button" className="btn-reset pm-nav pm-prev" aria-label="Média précédent" onClick={() => setMi((x) => (x - 1 + count) % count)}>←</button>
              <button type="button" className="btn-reset pm-nav pm-next" aria-label="Média suivant" onClick={() => setMi((x) => (x + 1) % count)}>→</button>
              <span className="pm-count" aria-live="polite">{mi + 1} / {count}</span>
            </>
          )}
        </div>

        <aside className="pm-info">
          <span className="lbl" style={{ color: '#A9A3D6' }}>CLIENT</span>
          <h2 className="pm-client">{p.client}</h2>
          {meta.length > 0 && <p className="pm-meta">{meta.join(' · ')}</p>}
          {p.title && <p className="pm-title serif-i">{p.title}</p>}
          {p.description && <p className="pm-desc">{p.description}</p>}
          {p.services.length > 0 && <ul className="pm-tags">{p.services.map((s) => <li key={s}>{s}</li>)}</ul>}
          <div className="pm-cta">
            <button type="button" className="btn-reset cta-line" style={{ borderBottom: '1px solid #B9C4FF' }} onClick={onContact}>PARLER DE MA COMMUNICATION ↗</button>
            {projects.length > 1 && <button type="button" className="btn-reset pm-nextp" onClick={() => onNavigate(next)}>PROJET SUIVANT : {projects[next].client} →</button>}
          </div>
        </aside>
      </div>

      {count > 1 && (
        <div className="pm-thumbs" role="tablist" aria-label="Médias du projet">
          {p.media.map((x, j) => (
            <button key={x.url} type="button" role="tab" aria-selected={j === mi} aria-label={`Média ${j + 1}`} className={`btn-reset pm-thumb${j === mi ? ' on' : ''}`} onClick={() => setMi(j)}>
              {x.type !== 'image'
                ? (x.poster ? <Image src={x.poster} alt="" fill sizes="96px" style={{ objectFit: 'cover' }} /> : <span className="pm-vid">▶</span>)
                : <Image src={x.url} alt="" fill sizes="96px" style={{ objectFit: 'cover' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
