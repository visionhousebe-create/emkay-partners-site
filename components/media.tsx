'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties } from 'react';
import { LOGO_SIZE, type MediaType } from '@/lib/data';

/** Logo officiel — fichier fourni, proportions d'origine (jamais redessiné). */
export function Logo({ src, alt, style, className, priority }: { src: string; alt: string; style?: CSSProperties; className?: string; priority?: boolean }) {
  const [w, h] = LOGO_SIZE[src] || [400, 120];
  return <Image src={src} alt={alt} width={w} height={h} style={style} className={className} priority={priority} />;
}

export const isVideo = (src: string, type?: string) => type === 'video' || /\.(mp4|webm|mov)(\?|#|$)/i.test(src);

/** Lecture automatique, muette, quand ≥ 50 % de la vidéo est visible (et prefers-reduced-motion respecté). */
function useAutoplay(ref: React.RefObject<HTMLVideoElement | null>, mode: 'visible' | 'hover', src: string) {
  useEffect(() => {
    const v = ref.current;
    if (!v || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const vis = e.isIntersecting && e.intersectionRatio >= 0.5;
      const coarse = !matchMedia('(pointer:fine)').matches;
      if (vis && !reduced && (mode === 'visible' || coarse)) { v.muted = true; v.play().catch(() => {}); }
      else if (!vis) v.pause();
    }), { threshold: [0, 0.5] });
    io.observe(v);
    return () => io.disconnect();
  }, [ref, mode, src]);
}

/** Photo ou vidéo plein cadre (object-fit: cover). Sans source : emplacement vide. */
export function Media({ src, type, poster, placeholder, alt, autoplay = 'visible', sizes = '100vw' }: { src: string; type?: MediaType | ''; poster?: string; placeholder: string; alt?: string; autoplay?: 'visible' | 'hover'; sizes?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref, autoplay, src);
  if (!src) return <div className="media-empty"><b>{placeholder.toUpperCase()}</b></div>;
  if (isVideo(src, type)) {
    const hover = autoplay === 'hover';
    return (
      <video
        ref={ref} className="media-fill" src={src} poster={poster || undefined} muted loop playsInline preload="metadata"
        onMouseEnter={hover ? (e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); } : undefined}
        onMouseLeave={hover ? (e) => e.currentTarget.pause() : undefined}
      />
    );
  }
  return <Image src={src} alt={alt || placeholder} fill sizes={sizes} style={{ objectFit: 'cover' }} />;
}
