'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { LOGO_SIZE, type Brand, type MediaType } from '@/lib/data';

/** Logo officiel — fichier fourni, proportions d'origine (jamais redessiné). */
export function Logo({ src, alt, style, className, priority }: { src: string; alt: string; style?: CSSProperties; className?: string; priority?: boolean }) {
  const [w, h] = LOGO_SIZE[src] || [400, 120];
  return <Image src={src} alt={alt} width={w} height={h} style={style} className={className} priority={priority} />;
}

/**
 * Logo d'une marque ; tant que son fichier officiel n'est pas fourni (src vide), affiche un logotype
 * provisoire composé avec les polices du site (styles .bw-* dans globals.css) :
 * Overton → symbole « fenêtre » + capitales serif espacées, or champagne ; Orizon Connect → dégradé coucher de soleil.
 * `onDark` : variante pour fond sombre (EMKAY Room).
 */
export function BrandMark({ brand, src, size, style, onDark }: { brand: Brand; src: string; size: string; style?: CSSProperties; onDark?: boolean }) {
  if (src) return <Logo src={src} alt={brand.name} style={style} />;
  const cls = `brand-word bw-${brand.id}${onDark ? ' on-dark' : ''}`;
  const box: CSSProperties = { fontSize: size, marginBottom: style?.marginBottom };
  if (brand.id === 'overton') {
    return (
      <span className={cls} role="img" aria-label={brand.name} style={box}>
        <OvertonSymbol />
        <span className="bw-ov-txt" aria-hidden="true">
          <span className="bw-ov-name">OVERTON</span>
          <span className="bw-ov-rule" />
        </span>
      </span>
    );
  }
  if (brand.id === 'orizon-connect') {
    return (
      <span className={cls} role="img" aria-label={brand.name} style={box}>
        <span className="bw-hz-top" aria-hidden="true"><span className="bw-hz-sun" /><span className="bw-hz-name">ORIZON</span></span>
        <span className="bw-hz-sub" aria-hidden="true">CONNECT</span>
      </span>
    );
  }
  return <span className={cls} role="img" aria-label={brand.name} style={box}>{brand.name}</span>;
}

/**
 * Symbole Overton — la « fenêtre d'Overton » : un cadre de fenêtre posé sur l'éventail des idées
 * (lignes horizontales). Ce qui est dans la fenêtre est éclairé ; le reste s'efface.
 * Le cadre est légèrement décentré : la fenêtre se déplace, comme l'opinion.
 */
function OvertonSymbol() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="bw-ov-sym" viewBox="0 0 56 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="20" y1="3" x2="40" y2="45">
          <stop offset="0" stopColor="#C9A35E" /><stop offset=".45" stopColor="#F3DFAE" /><stop offset=".55" stopColor="#FFF3D1" /><stop offset="1" stopColor="#B8893F" />
        </linearGradient>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="56" y2="0">
          <stop offset="0" stopColor="#C9A35E" stopOpacity="0" /><stop offset=".34" stopColor="#E2C07A" stopOpacity=".9" /><stop offset=".66" stopColor="#E2C07A" stopOpacity=".9" /><stop offset="1" stopColor="#C9A35E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* l'éventail des idées : une ligne qui traverse la fenêtre et s'efface aux extrêmes */}
      <line x1="0" x2="56" y1="27" y2="27" stroke={`url(#${id}f)`} strokeWidth="1.3" />
      {/* la fenêtre, légèrement décentrée */}
      <rect x="21" y="3" width="18" height="42" fill="none" stroke={`url(#${id}g)`} strokeWidth="1.8" />
      <line x1="30" x2="30" y1="3" y2="45" stroke={`url(#${id}g)`} strokeWidth=".9" opacity=".7" />
    </svg>
  );
}

const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i;
export const isVideo = (src: string, type?: string) => type === 'video' || VIDEO_RE.test(src);
const mime = (src: string) => (/\.webm(\?|#|$)/i.test(src) ? 'video/webm' : 'video/mp4');

/**
 * Vidéo légère pour l'arrivée sur la page :
 * - aucune donnée chargée tant que la vidéo n'approche pas de l'écran (IntersectionObserver, marge 300px) ;
 * - ensuite preload="metadata" seulement ; lecture muette en boucle quand ≥ 50 % visible ;
 * - autoplay="hover" : lecture au survol sur ordinateur, à la visibilité sur mobile ;
 * - prefers-reduced-motion : jamais de lecture automatique (le poster reste affiché).
 * `src` accepte un fichier ou une liste ['…/clip.webm', '…/clip.mp4'] (le navigateur prend le premier compatible).
 */
function LazyVideo({ srcs, poster, autoplay }: { srcs: string[]; poster?: string; autoplay: 'visible' | 'hover' }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const key = srcs.join('|');

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '300px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [key]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !near) return;
    v.load();
    if (!('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const vis = e.isIntersecting && e.intersectionRatio >= 0.5;
      const coarse = !matchMedia('(pointer:fine)').matches;
      if (vis && !reduced && (autoplay === 'visible' || coarse)) { v.muted = true; v.play().catch(() => {}); }
      else if (!vis) v.pause();
    }), { threshold: [0, 0.5] });
    io.observe(v);
    return () => io.disconnect();
  }, [near, autoplay, key]);

  const hover = autoplay === 'hover';
  return (
    <video
      ref={ref} className="media-fill" poster={poster || undefined} muted loop playsInline preload={near ? 'metadata' : 'none'} aria-hidden="true"
      onMouseEnter={hover ? (e) => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); } : undefined}
      onMouseLeave={hover ? (e) => e.currentTarget.pause() : undefined}
    >
      {near && srcs.map((s) => <source key={s} src={s} type={mime(s)} />)}
    </video>
  );
}

/** Photo ou vidéo plein cadre (object-fit: cover). Sans source : emplacement vide. */
export function Media({ src, type, poster, placeholder, alt, autoplay = 'visible', sizes = '100vw', quality = 90 }: { src: string | string[]; type?: MediaType | ''; poster?: string; placeholder: string; alt?: string; autoplay?: 'visible' | 'hover'; sizes?: string; quality?: number }) {
  const srcs = (Array.isArray(src) ? src : [src]).filter(Boolean);
  if (!srcs.length) return <div className="media-empty"><b>{placeholder.toUpperCase()}</b></div>;
  if (srcs.some((s) => isVideo(s, type))) return <LazyVideo srcs={srcs} poster={poster} autoplay={autoplay} />;
  return <Image src={srcs[0]} alt={alt || placeholder} fill sizes={sizes} quality={quality} style={{ objectFit: 'cover' }} />;
}
