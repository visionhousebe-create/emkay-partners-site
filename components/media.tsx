'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { LOGO_SIZE, type Brand, type MediaType } from '@/lib/data';

/** Logo officiel — fichier fourni, proportions d'origine (jamais redessiné). */
export function Logo({ src, alt, style, className, priority }: { src: string; alt: string; style?: CSSProperties; className?: string; priority?: boolean }) {
  const [w, h] = LOGO_SIZE[src] || [400, 120];
  return <Image src={src} alt={alt} width={w} height={h} style={style} className={className} priority={priority} />;
}

/**
 * Logo d'une marque ; tant que son fichier officiel n'est pas fourni (src vide), affiche son nom
 * dans la typographie du site (provisoire, pas une recréation de logo).
 */
export function BrandMark({ brand, src, size, style }: { brand: Brand; src: string; size: string; style?: CSSProperties }) {
  if (src) return <Logo src={src} alt={brand.name} style={style} />;
  return <span className="brand-word" role="img" aria-label={brand.name} style={{ fontSize: size, marginBottom: style?.marginBottom }}>{brand.name}</span>;
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
export function Media({ src, type, poster, placeholder, alt, autoplay = 'visible', sizes = '100vw' }: { src: string | string[]; type?: MediaType | ''; poster?: string; placeholder: string; alt?: string; autoplay?: 'visible' | 'hover'; sizes?: string }) {
  const srcs = (Array.isArray(src) ? src : [src]).filter(Boolean);
  if (!srcs.length) return <div className="media-empty"><b>{placeholder.toUpperCase()}</b></div>;
  if (srcs.some((s) => isVideo(s, type))) return <LazyVideo srcs={srcs} poster={poster} autoplay={autoplay} />;
  return <Image src={srcs[0]} alt={alt || placeholder} fill sizes={sizes} style={{ objectFit: 'cover' }} />;
}
