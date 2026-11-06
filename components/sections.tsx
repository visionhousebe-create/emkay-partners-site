'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { BRANDS, DOORS, GROUP, IRL, LINKS, ORIENT, RATIO, ROOM, SECTION_MEDIA, type FormKind } from '@/lib/data';
import { PATHS } from '@/lib/i18n/config';
import { useI18n } from './i18n';
import LangSwitch from './LangSwitch';
import { coverOf, type Project } from '@/lib/projects';
import ProjectModal from './ProjectModal';
import { BrandMark, Logo, Media } from './media';

const B = BRANDS;

/** Lien externe ; tant que l'URL n'est pas renseignée dans LINKS, rendu à l'identique mais non cliquable. */
function Ext({ href, children, ...rest }: React.ComponentProps<'a'>) {
  const { t, locale } = useI18n();
  if (!href) return <span {...(rest as React.ComponentProps<'span'>)} aria-disabled="true" title={t.common.soon}>{children}</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
}

export type UI = {
  wide: boolean;
  fine: boolean;
  reduced: boolean;
  netRef: RefObject<HTMLCanvasElement | null>;
  openQa: () => void;
  openForm: (k: FormKind) => void;
  roomHover: number;
  setRoomHover: (i: number) => void;
};

export function Sections({ ui, projects }: { ui: UI; projects: Project[] }) {
  return (
    <>
      <Portal ui={ui} />
      <BrandSelector ui={ui} />
      <VisionHouse ui={ui} projects={projects} />
      <Overton ui={ui} />
      <OrizonConnect ui={ui} />
      <Bavare ui={ui} />
      <ViensManger ui={ui} />
      <EmkayRoom ui={ui} />
      <Identites ui={ui} />
      <Collaborations ui={ui} />
      <Chiffres />
      <InRealLife ui={ui} />
      <Orientation ui={ui} />
      <Portes />
      <APropos />
      <Manifeste ui={ui} />
      <Contact ui={ui} />
      <Footer />
    </>
  );
}

// ——— 01 Portail ———
function Portal({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  return (
    <section id="top" data-screen-label="01 Portail" data-sc="sticky" data-hd="#F5F1E9" className="portal">
      <div className="portal-in">
        <div className="portal-dim" />
        <div className="portal-house">
          <div data-r="0.3" className="lbl" style={{ fontSize: 12, letterSpacing: '.3em', color: '#AAA6AD' }}>{t.portal.house}</div>
          <h1 className="portal-h1">
            <span data-r="0.4" style={{ display: 'block' }}>{t.portal.h1a}</span>
            <span data-r="0.5" className="serif-i portal-h1-2">{t.portal.h1b}</span>
          </h1>
          <div data-r="0.62" className="portal-list">
            <span>01 VISION HOUSE</span><span>02 OVERTON</span><span>03 ORIZON CONNECT</span><span>04 BAVARE</span><span>05 VIENS MANGER</span>
          </div>
        </div>
        <div className="door door-l"><div className="door-word">EMKAY</div></div>
        <div className="door door-r"><div className="door-word">EMKAY</div></div>
        <div className="portal-front">
          <div className="portal-top"><span>{t.portal.city}</span><span>50.85° N · 4.35° E</span></div>
          <div className="portal-logo">
            <Logo src="/logos/emkay.png" alt="EMKAY Partners" priority style={{ display: 'block', width: 'clamp(240px,30vw,440px)', maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="portal-cue">
            <span style={{ fontSize: 'clamp(12px,1vw,14px)', fontWeight: 700, letterSpacing: '.3em' }}>{t.portal.cue}</span>
            <span style={{ fontSize: 22, lineHeight: 1 }}>↓</span>
            <span className="cue-line"><span style={{ animation: ui.reduced ? 'none' : undefined }} /></span>
            <button type="button" data-portal-qa="" onClick={ui.openQa} data-cursor={t.cursor.open} className="btn-reset portal-qa">{t.portal.qa}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— 03 Sélecteur des marques ———
function BrandSelector({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const { wide } = ui;
  const [active, setActive] = useState<number | null>(null);
  const a = active == null ? null : B[active];
  const fg = a ? a.fg : '#F5F1E9';
  const line = a ? a.fg + '38' : 'rgba(245,241,233,.2)';
  const num = (a ? a.num : '00') + ' / 05';
  return (
    <section id="marques" data-screen-label="03 Sélecteur des marques" data-hd={fg} onMouseLeave={() => { if (wide) setActive(null); }} className="sel" style={{ background: a ? a.bg : '#2B143D', color: fg }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div className="sel-head">
          <span>{t.selector.label}</span>
          <span style={{ opacity: 0.6 }}>{wide ? t.selector.hover : t.selector.touch}</span>
          <span className="tnum">{num}</span>
        </div>
        <div className="sel-grid" style={{ gridTemplateColumns: wide ? 'minmax(0,2.1fr) minmax(0,1fr)' : '1fr' }}>
          <div style={{ minWidth: 0, borderBottom: `1px solid ${line}`, transition: 'border-color .7s' }}>
            {B.map((b, i) => {
              const on = active === i;
              return (
                <a key={b.id} href={'#' + b.id} data-cursor={t.cursor[b.cursor]} className="sel-item"
                  onMouseEnter={() => { if (wide) setActive(i); }} onFocus={() => { if (wide) setActive(i); }}
                  onClick={(e) => { if (!wide && active !== i) { e.preventDefault(); setActive(i); } }}
                  style={{ borderTop: `1px solid ${line}`, opacity: a == null || on ? 1 : 0.28 }}>
                  <div className="sel-row">
                    <span className="sel-num">{b.num}</span>
                    <span className="sel-name" style={{ transform: `translateX(${on ? (wide ? '24px' : '10px') : '0px'})` }}>{b.name}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateRows: on ? '1fr' : '0fr', transition: 'grid-template-rows .7s cubic-bezier(.2,.7,.2,1)' }}>
                    <div style={{ overflow: 'hidden', minHeight: 0 }}>
                      <div className="sel-info" style={{ opacity: on ? 1 : 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em' }}>{t.brands[i].tags}</span>
                        <span style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 460, opacity: 0.85 }}>{t.brands[i].desc}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.12em', borderBottom: '1px solid currentColor', paddingBottom: 2 }}>{t.brands[i].cta}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          {wide && (
            <div style={{ position: 'sticky', top: 110 }}>
              <div className="sel-panel" style={{ background: a ? (a.plate === 'transparent' ? a.bg : a.plate) : undefined, transition: 'background-color .8s' }}>
                <div className="sel-default" style={{ clipPath: a ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)' }}>
                  <span className="lbl" style={{ color: '#AAA6AD' }}>EMKAY PARTNERS</span>
                  <span className="serif" style={{ fontSize: 'clamp(30px,3vw,52px)', lineHeight: 1 }}>{t.selector.defaultA}<br /><em>{t.selector.defaultB}</em></span>
                </div>
                {B.map((b, i) => {
                  const on = active === i;
                  return (
                    <div key={b.id} className="sel-layer" style={{ background: b.plate === 'transparent' ? b.bg : b.plate, zIndex: on ? 3 : 2, clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}>
                      <div className="sel-layer-in" style={{ transform: `scale(${on ? 1 : 0.92})` }}>
                        <BrandMark brand={b} src={b.logo} size="clamp(30px,3.4vw,60px)" style={{ display: 'block', width: b.lw, maxWidth: '100%', maxHeight: '100%', height: 'auto', objectFit: 'contain', borderRadius: b.lr }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="sel-foot">
                <span style={{ transition: 'opacity .4s' }}>{a ? t.brands[active!].cat.toUpperCase() : t.selector.footer}</span><span className="tnum">{num}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ——— 04 Vision House (rail horizontal de projets → morph vers Overton) ———
// Projets lus dans public/vision-house/ (GitHub). Clic sur une carte → fiche complète du projet.
// Hauteur commune des médias sur ordinateur : toutes les cartes sont alignées, seule la largeur suit le format.
const VH_CARD_H = 'min(68vh, 640px)';

function VisionHouse({ ui, projects }: { ui: UI; projects: Project[] }) {
  const { t, locale } = useI18n();
  const { wide } = ui;
  const [open, setOpen] = useState<number | null>(null);
  const lastCover = projects.length ? coverOf(projects[projects.length - 1]) : undefined;
  return (
    <section id="vision-house" data-screen-label="04 Vision House" data-sc="sticky" data-vhs="" data-brand="0" data-hd="#F5F1E9" style={{ position: 'relative', background: '#0C0340' }}>
      <div className="vh-in" style={{ height: wide ? '100vh' : 'auto' }}>
        <div data-vhui="" className="vh-intro" style={{ position: wide ? 'absolute' : 'relative', padding: wide ? '0 8vw' : '14vh 6vw 8vh' }}>
          <Logo src="/logos/visionhouse-white.png" alt="Vision House" style={{ display: 'block', height: 'clamp(18px,1.8vw,26px)', width: 'auto', alignSelf: 'flex-start', objectFit: 'contain' }} />
          <span className="lbl" style={{ letterSpacing: '.24em', color: '#A9A3D6' }}>{t.vh.label}</span>
          <h2 className="vh-h2">{t.vh.h2a}<br /><span className="serif-i" style={{ color: '#B9C4FF' }}>{t.vh.h2b}</span></h2>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 17, lineHeight: 1.5, color: '#CFCBEA' }}>{t.vh.intro}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 32px' }}>
            <button type="button" onClick={() => ui.openForm('project')} data-cursor={t.cursor.open} className="btn-reset cta-line" style={{ pointerEvents: 'auto', fontSize: 12, paddingBottom: 7, borderBottom: '1px solid #B9C4FF' }}>{t.vh.cta}</button>
            <span className="lbl" style={{ letterSpacing: '.24em', color: '#A9A3D6' }}>{t.vh.scroll}</span>
          </div>
        </div>
        <div data-track="" className={`vh-track${wide ? ' vh-rail' : ''}`}>
          {projects.map((pj, i) => {
            const [rw, rh] = pj.format.split('/').map(Number), R = rw / rh;
            const cover = coverOf(pj);
            const photos = pj.media.filter((m) => m.type === 'image').length, videos = pj.media.length - photos;
            const badge = [videos ? (videos > 1 ? `${videos} ${t.vh.videos}` : t.vh.video) : '', photos ? `${photos} ${photos > 1 ? t.vh.photos : t.vh.photo}` : ''].filter(Boolean).join(' · ');
            const sub = [pj.sector, pj.location].filter(Boolean).join(' · ');
            return (
              <div key={pj.id} data-card={i} data-cursor={t.cursor.open} className="vh-card" onClick={() => setOpen(i)} style={{
                width: wide ? `min(calc(${VH_CARD_H} * ${R.toFixed(4)}), 52vw)` : R < 1 ? 'min(100%, 400px)' : '100%',
              }}>
                <div data-vhmedia="" className="vh-media" style={wide ? { height: VH_CARD_H } : { aspectRatio: pj.format, minHeight: R > 1 ? 360 : undefined }}>
                  <Media src={cover?.url || ''} type={cover?.type === 'video' ? 'video' : cover ? 'image' : ''} poster={cover?.poster} autoplay="hover" placeholder={t.common.mediaSoon} alt={`${pj.client} · ${pj.title}`} sizes={wide ? (R < 1 ? '30vw' : '46vw') : '100vw'} quality={90} />
                  <div className="vh-top">
                    {badge ? <span className="vh-badge">{badge}</span> : <span />}
                    <span className="vh-num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <button type="button" className="btn-reset vh-meta" aria-label={`${t.vh.seeProject} ${pj.client}`}>
                    <span className="vh-client xw">{pj.client}</span>
                    {sub && <span className="vh-sub">{sub}</span>}
                    {pj.title && <span className="vh-title serif-i">{pj.title}</span>}
                    <span className="vh-foot"><span>{pj.year}</span><span aria-hidden="true">{t.vh.see}</span></span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div data-xf="" className="vh-xf" style={{ position: wide ? 'absolute' : 'relative', height: wide ? '100%' : '100svh', opacity: wide ? 0 : 1 }}>
          <div data-xa="" data-empty={lastCover ? undefined : ''} style={{ position: 'absolute', inset: 0, opacity: wide && lastCover ? 1 : 0 }}>
            {lastCover && <Media src={lastCover.url} type={lastCover.type === 'video' ? 'video' : 'image'} poster={lastCover.poster} placeholder="" autoplay="visible" />}
          </div>
          <div data-xb="" style={{ position: 'absolute', inset: 0, opacity: wide ? 0 : 1 }}>
            <Image src={SECTION_MEDIA.overton} alt={t.vh.overtonAlt} fill sizes="100vw" quality={90} style={{ objectFit: 'cover' }} />
          </div>
          <div data-xg="" className="vh-xg" style={{ opacity: wide ? 0 : 1 }} />
          <div data-xt="" style={{ position: 'absolute', inset: 0, color: '#F5F1E9', opacity: wide ? 0 : 1, pointerEvents: 'none' }}>
            <div className="lbl" style={{ position: 'absolute', left: '5vw', right: '5vw', top: wide ? 88 : 'auto', bottom: wide ? 'auto' : 'calc(clamp(28px,5vh,56px) + 16vw)', display: 'flex', justifyContent: 'space-between', gap: 24 }}><span>02 / 05</span><span>{t.vh.overtonCat}</span></div>
            <div className="xw ov-gold" style={{ position: 'absolute', left: '5vw', right: '5vw', bottom: 'clamp(28px,5vh,56px)', fontWeight: 900, fontSize: wide ? 'clamp(56px,14vw,280px)' : '15vw', lineHeight: 0.8, letterSpacing: '-.06em' }}>OVERTON</div>
          </div>
        </div>
      </div>
      <span id="overton" aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: '100vh', width: 1, height: 1, pointerEvents: 'none' }} />
      {open !== null && projects[open] && (
        <ProjectModal projects={projects} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} onContact={() => { setOpen(null); ui.openForm('project'); }} />
      )}
    </section>
  );
}

// ——— 05 Overton ———
function Overton({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  return (
    <section id="overton-suite" data-screen-label="05 Overton" data-sc="enter" data-brand="1" data-cursor={t.cursor.see} data-hd="#E9D29C" className="ov" style={{ position: 'relative', zIndex: 1, background: '#0B0A08', color: '#F5F1E9', scrollMarginTop: 0 }}>
      <div className="nx-grid">
        <div>
          <BrandMark brand={B[1]} src={B[1].logoT} size="clamp(32px,3vw,44px)" style={{ display: 'block', width: 200, maxWidth: '100%', height: 'auto', marginBottom: 40 }} />
          <h3 data-r="0.35" className="nx-h3">{t.overton.h3a} <span className="serif-i ov-gold" style={{ letterSpacing: '-.01em' }}>{t.overton.h3b}</span></h3>
          <p className="nx-p">{t.overton.intro}</p>
          <button type="button" onClick={() => ui.openForm('project')} data-cursor={t.cursor.open} className="btn-reset cta-line" style={{ marginTop: 36, color: '#E9D29C', borderBottom: '1px solid #C9A35E' }}>{t.overton.cta}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.overton.levels.map((lv, i, all) => [String(i + 1), lv.t, lv.d] as const).map(([k, title, d], i, all) => (
            <div key={k} data-r={(0.45 + i * 0.05).toFixed(2)} className="nx-row" style={i === all.length - 1 ? { borderBottom: '1px solid rgba(201,163,94,.3)' } : undefined}>
              <span className="nx-row-k">{k}</span>
              <div><div className="nx-row-t">{title}</div><div className="nx-row-d">{d}</div></div>
            </div>
          ))}
          <p className="serif" style={{ margin: '36px 0 0', fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.3, color: '#E9D29C', textWrap: 'pretty' }}>{t.overton.close}</p>
        </div>
      </div>
      <div className="nx-line" />
    </section>
  );
}

// ——— 06 Orizon Connect ———
function OrizonConnect({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const flat = !ui.wide; // téléphone : section normale, sans transition plein écran
  return (
    <section id="orizon-connect" data-screen-label="06 Orizon Connect" data-sc={flat ? 'enter' : 'sticky'} data-canvas="net" data-brand="2" data-cursor={t.cursor.connect} data-hd="#3A1450" data-hd-end={flat ? undefined : '#E3122B'} className={flat ? 'flat' : undefined} style={{ height: flat ? 'auto' : '260vh', position: 'relative' }}>
      <div className="nxc-in">
        <div className="nxc-pink" />
        <canvas ref={ui.netRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
        <div className="nxc-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <BrandMark brand={B[2]} src={B[2].logoT} size="clamp(32px,3vw,44px)" style={{ display: 'block', width: 'clamp(170px,15vw,230px)', height: 'auto', objectFit: 'contain' }} />
            <div className="lbl" style={{ display: 'flex', gap: 24 }}><span>03 / 05</span><span>{t.orizon.cat}</span></div>
          </div>
          <h3 data-r="0.06" className="nxc-h3">{t.orizon.h3a} <span className="serif-i oz-sun" style={{ letterSpacing: '-.02em' }}>{t.orizon.h3b}</span></h3>
          <div className="nxc-bottom">
            <div data-r="0.2">
              <div className="lbl" style={{ color: '#A1286A', marginBottom: 18 }}>{t.orizon.bring}</div>
              <div className="nxc-chain">
                {t.orizon.chain.map((w, i) => (
                  <span key={w} style={{ display: 'contents' }}>{i > 0 && <span style={{ color: '#E2463A' }}>↔︎</span>}<span>{w}</span></span>
                ))}
              </div>
            </div>
            <div data-r="0.3">
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#4A2A55', textWrap: 'pretty' }}><em>Orizon Connect</em> {t.orizon.pA} <em>{t.orizon.pB}</em></p>
              <button type="button" onClick={() => ui.openForm('talk')} data-cursor={t.cursor.open} className="btn-reset cta-line" style={{ marginTop: 28, borderBottom: '1px solid #E2463A' }}>{t.orizon.cta}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— 07 Bavare ———
const STICKERS: { r: string; top: string; left: string; rot: number; bg: string; fg: string; shadow: boolean }[] = [
  { r: '0.18', top: '6%', left: '4%', rot: -8, bg: '#E3122B', fg: '#FF9EC4', shadow: true },
  { r: '0.25', top: '0%', left: '52%', rot: 6, bg: '#F5F1E9', fg: '#E3122B', shadow: true },
  { r: '0.32', top: '36%', left: '22%', rot: -4, bg: '#F5F1E9', fg: '#E3122B', shadow: true },
  { r: '0.39', top: '30%', left: '70%', rot: 9, bg: '#E3122B', fg: '#FF9EC4', shadow: true },
  { r: '0.46', top: '68%', left: '6%', rot: 12, bg: '#080808', fg: '#FF9EC4', shadow: false },
  { r: '0.53', top: '66%', left: '50%', rot: -10, bg: '#E3122B', fg: '#F5F1E9', shadow: true },
];

function Bavare({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const flat = !ui.wide;
  return (
    <section id="bavare" data-screen-label="07 Bavare" data-sc={flat ? 'enter' : 'sticky'} data-brand="3" data-cursor={t.cursor.out} data-hd="#E3122B" data-hd-end={flat ? undefined : '#F2E7D3'} className={flat ? 'flat' : undefined} style={{ height: flat ? 'auto' : '260vh', position: 'relative' }}>
      <div className="bv-in">
        <div className="bv-marquee">
          <div style={{ transform: 'translateX(calc(-10vw - var(--p,0) * 40vw))' }}>BAVARE BAVARE BAVARE BAVARE</div>
          <div style={{ transform: 'translateX(calc(-60vw + var(--p,0) * 40vw))' }}>{t.bavare.marqueeOut}</div>
          <div style={{ transform: 'translateX(calc(-20vw - var(--p,0) * 30vw))' }}>BAVARE BAVARE BAVARE BAVARE</div>
        </div>
        <div className="bv-top"><span>{t.bavare.label}</span><span>{t.bavare.cat}</span></div>
        <div className="bv-main">
          <div className="bv-left">
            <h2 data-r="0.06" className="bv-h2 serif-i">{t.bavare.h2a}<br />{t.bavare.h2b}</h2>
            <p data-r="0.22" className="bv-p">{t.bavare.p}</p>
          </div>
          <div className="bv-stage">
            <div data-r="0.04" data-fx="pop" className="bv-square" />
            <div data-r="0.3" data-fx="pop" className="bv-polaroid">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={SECTION_MEDIA.bavare} alt={t.bavare.photoAlt} fill sizes="190px" quality={90} style={{ objectFit: 'cover' }} />
              </div>
            </div>
            {STICKERS.map((s, si) => (
              <div key={si} style={{ position: 'absolute', top: s.top, left: s.left, transform: `rotate(${s.rot}deg)`, pointerEvents: 'none' }}>
                <div data-r={s.r} data-fx="pop" className="bv-sticker" style={{ background: s.bg, color: s.fg, boxShadow: s.shadow ? '0 6px 0 rgba(120,0,20,.18)' : undefined }}>{t.bavare.stickers[si]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bv-bottom">
          <span className="bv-sign"><Logo src="/logos/bavard.png" alt="Bavare" style={{ display: 'block', height: 22, width: 'auto', objectFit: 'contain' }} />{t.bavare.sign}</span>
          <Ext href={LINKS.nextBavare} data-cursor={t.cursor.see} data-r="0.4" className="bv-cta">{t.bavare.cta}</Ext>
        </div>
        <div className="bv-wipe" />
      </div>
    </section>
  );
}

// ——— 08 Viens Manger ———
function ViensManger({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const flat = !ui.wide;
  return (
    <section id="viens-manger" data-screen-label="08 Viens Manger" data-sc={flat ? 'enter' : 'sticky'} data-brand="4" data-cursor={t.cursor.taste} data-hd={flat ? '#4A0B16' : '#F2E7D3'} data-hd-end={flat ? undefined : '#4A0B16'} data-hd-at="0.2" className={flat ? 'flat' : undefined} style={{ height: flat ? 'auto' : '260vh', position: 'relative' }}>
      <div className="vm-in">
        <div className="vm-intro">
          <span>05 / 05</span><span className="serif-i" style={{ fontSize: 'clamp(40px,5vw,80px)', letterSpacing: 0 }}>{t.vm.intro}</span>
        </div>
        <div className="vm-card">
          <div data-r="0.32" className="vm-head">
            <span>{t.vm.label}</span>
            <Logo src="/logos/viensmanger.png" alt="Viens Manger" style={{ display: 'block', width: 72, height: 72, borderRadius: '50%', objectFit: 'contain' }} />
            <span>{t.vm.cat}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4vw', alignItems: 'stretch' }}>
            <div className="vm-col" style={{ flex: '1 1 440px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3vh' }}>
              <h2 data-r="0.38" className="vm-h2 serif">{t.vm.h2a} <em>{t.vm.h2b}</em></h2>
              <p data-r="0.46" className="serif-i" style={{ margin: 0, maxWidth: 480, fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1.2 }}>{t.vm.p}</p>
              <div data-r="0.52" className="vm-menu">
                {t.vm.menu.map((w, i) => (
                  <div key={w} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}><span>{w}</span><span style={{ flex: 1, borderBottom: '1px dotted #4A0B16' }} /><span>0{i + 1}</span></div>
                ))}
              </div>
            </div>
            <div data-r="0.42" data-fx="mask" className="vm-photo">
              <Image src={SECTION_MEDIA.viensManger} alt={t.vm.photoAlt} fill sizes="440px" quality={90} style={{ objectFit: 'cover' }} />
              <div className="vm-tag">{t.vm.tag}</div>
            </div>
          </div>
          <div data-r="0.56" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #4A0B16' }}>
            <Ext href={LINKS.vmAddresses} className="cta-line" style={{ fontWeight: 700, paddingBottom: 6, borderBottom: '2px solid #A3161F', color: '#A3161F' }}>{t.vm.cta}</Ext>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— 09 EMKAY Room ———
function EmkayRoom({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  if (!ui.wide) return <EmkayRoomMobile />;
  return (
    <section id="groupe" data-screen-label="09 EMKAY Room" data-sc="sticky" data-hd="#F5F1E9" style={{ height: '220vh', position: 'relative' }}>
      <div className="room-in">
        <div style={{ flex: 'none', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px 40px' }}>
          <div data-r="0.04" className="serif" style={{ fontSize: 'clamp(26px,2.8vw,48px)', lineHeight: 1 }}>{t.room.titleA}<br /><em style={{ color: '#C9C2CF' }}>{t.room.titleB}</em></div>
          <span style={{ fontSize: 11, letterSpacing: '.22em', color: '#AAA6AD' }}>EMKAY ROOM</span>
        </div>
        <div data-orbit="" onMouseLeave={() => ui.setRoomHover(-1)} style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <div data-core="" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(150px,24vw,380px)' }}>
            <Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>
          {ROOM.map((r, i) => {
            const b = B[r.b], on = ui.roomHover === i;
            const plateBg = b.id === 'bavare' ? '#FF9EC4' : 'transparent';
            const shadow = b.id === 'bavare' || b.id === 'viens-manger' ? '0 18px 44px rgba(10,4,18,.32)' : 'none';
            return (
              <a key={b.id} href={'#' + b.id} data-oi={i} data-cursor={t.cursor.see} aria-label={t.common.discoverBrand + ' ' + b.name} onMouseEnter={() => ui.setRoomHover(i)} onFocus={() => ui.setRoomHover(i)} className="room-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: r.w, height: r.h, padding: r.pad, background: plateBg, borderRadius: r.r, boxShadow: shadow, transform: `scale(${on ? 1.08 : 1})`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>
                  <BrandMark brand={b} src={b.logoRoom || b.logoT} onDark size="clamp(17px,1.9vw,28px)" style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: r.r === '50%' ? '50%' : 0 }} />
                </div>
                <div className="room-label" style={{ transform: `translate(-50%,${on ? '0px' : '-6px'})`, opacity: on ? 1 : 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em' }}>{b.name}</span>
                  <span className="serif-i" style={{ fontSize: 17, color: '#D9D3DE' }}>{t.room.roles[i]}</span>
                  <span style={{ marginTop: 4, fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#C9A8E8' }}>{t.room.discover}</span>
                </div>
              </a>
            );
          })}
        </div>
        <p data-r="0.2" style={{ flex: 'none', alignSelf: 'flex-end', margin: 0, maxWidth: 'min(100%,380px)', fontSize: 15, lineHeight: 1.55, color: '#D9D3DE' }}>{t.room.p}</p>
      </div>
    </section>
  );
}

/** EMKAY Room sur téléphone : pas d'orbite — le logo EMKAY puis les cinq marques en grille, toujours lisibles. */
function EmkayRoomMobile() {
  const { t, locale } = useI18n();
  return (
    <section id="groupe" data-screen-label="09 EMKAY Room" data-sc="enter" data-hd="#F5F1E9" className="room-m">
      <div data-r="0.04" className="serif" style={{ fontSize: 30, lineHeight: 1.05 }}>{t.room.titleA}<br /><em style={{ color: '#C9C2CF' }}>{t.room.titleB}</em></div>
      <span className="lbl" style={{ letterSpacing: '.22em', color: '#AAA6AD' }}>EMKAY ROOM</span>
      <div data-r="0.1" className="room-m-core"><Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }} /></div>
      <div className="room-m-grid">
        {ROOM.map((r, i) => {
          const b = B[r.b];
          return (
            <a key={b.id} href={'#' + b.id} data-r={(0.14 + i * 0.04).toFixed(2)} className="room-m-tile" aria-label={t.common.discoverBrand + ' ' + b.name}>
              <span className="room-m-logo" style={{ background: b.id === 'bavare' ? '#FF9EC4' : undefined, borderRadius: b.id === 'bavare' ? 999 : b.id === 'viens-manger' ? '50%' : 0, padding: b.id === 'bavare' ? '8px 14px' : 0 }}>
                <BrandMark brand={b} src={b.logoRoom || b.logoT} onDark size="20px" style={{ display: 'block', maxWidth: '100%', maxHeight: b.id === 'viens-manger' ? 64 : 34, width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: r.r === '50%' ? '50%' : 0 }} />
              </span>
              <span className="serif-i" style={{ fontSize: 16, lineHeight: 1.2, color: '#D9D3DE' }}>{t.room.roles[i]}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#C9A8E8' }}>{t.room.discover}</span>
            </a>
          );
        })}
      </div>
      <p data-r="0.3" style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#D9D3DE' }}>{t.room.p}</p>
    </section>
  );
}

// ——— 10 Différentes identités ———
const IDS = ['VISION HOUSE', 'OVERTON', 'ORIZON CONNECT', 'BAVARE', 'VIENS MANGER'];

function Identites({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  return (
    <section id="identites" data-screen-label="10 Différentes identités" data-sc="sticky" data-steps="6" data-stack="" data-hd="#2B143D" style={{ height: ui.wide ? '560vh' : '380vh', position: 'relative' }}>
      <div className="ids-in">
        <h2 className="ids-h2">{t.ids.h2a}<br /><span className="serif-i" style={{ letterSpacing: '-.02em', color: '#2B143D' }}>{t.ids.h2b}</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(8,8,8,.18)' }}>
          {IDS.map((n, i) => (
            <div key={n} data-i={i} className="ids-row"><span className="ids-name">{n}</span><span className="serif-i ids-verb">{t.ids.verbs[i]}</span></div>
          ))}
          <div data-i="5" className="ids-row ids-last"><span className="ids-name">EMKAY</span><span className="serif-i ids-verb">{t.ids.emkay}</span></div>
        </div>
        <div style={{ position: 'absolute', left: '5vw', right: '5vw', bottom: '5vh', height: 1, background: '#080808', opacity: 0.15 }} />
        <div style={{ position: 'absolute', left: '5vw', right: '5vw', bottom: '5vh', height: 1, background: '#2B143D', transformOrigin: '0 50%', transform: 'scaleX(var(--p,0))' }} />
      </div>
    </section>
  );
}

// ——— 11 Le Groupe — quand nos marques se rencontrent ———
function Collaborations({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const { wide } = ui;
  if (!wide) return <CollaborationsMobile />;
  return (
    <section id="collaborations" data-screen-label="11 Le Groupe" data-sc="sticky" data-group="" data-hd="#F5F1E9" style={{ height: '380vh', position: 'relative' }}>
      <div className="grp-in">
        <div className="grp-head">
          <div>
            <div className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.group.label}</div>
            <h2 className="serif" style={{ margin: '14px 0 0', fontWeight: 400, fontSize: 'clamp(34px,4.4vw,80px)', lineHeight: 0.95, letterSpacing: '-.02em' }}>{t.group.h2a}<br /><em>{t.group.h2b}</em></h2>
          </div>
          <span data-gstep={t.group.steps.join('|')} className="lbl tnum" style={{ color: '#AAA6AD' }}>{t.group.steps[0]}</span>
        </div>
        <div data-stage="" className="grp-stage">
          <svg data-links="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
            {[0, 1, 2, 3].map((i) => <path key={i} data-link={i} d="" fill="none" stroke="#F5F1E9" strokeWidth={1} pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity={0} />)}
          </svg>
          <div data-show="-1,0.17" className="grp-layer" style={{ padding: '0 6vw' }}>
            <p className="serif" style={{ margin: 0, maxWidth: 900, fontSize: 'clamp(24px,2.8vw,48px)', lineHeight: 1.12, textWrap: 'balance' }}>{t.group.introA}<br /><em style={{ color: '#C9C2CF' }}>{t.group.introB}</em></p>
          </div>
          <div style={{ position: 'relative', width: '100%', display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,min(34vw,520px)) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)', gridTemplateAreas: wide ? "'a c b' 'd c e'" : "'c c' 'a b' 'd e'", alignItems: 'center', gap: 'clamp(20px,3vh,36px) clamp(24px,4vw,72px)' }}>
            <div data-center="" style={{ gridArea: 'c', display: 'grid', justifyItems: 'center', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
              <div data-show="0.19,0.445" className="grp-scn">
                <span className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.group.scenario} 01</span>
                <span className="grp-scn-t">{t.group.s1}</span>
                <p data-show="0.3,0.445" className="serif-i" style={{ margin: '6px 0 0', maxWidth: 420, fontSize: 'clamp(17px,1.5vw,24px)', lineHeight: 1.2, color: '#D9D3DE', textWrap: 'balance' }}>{t.group.s1d}</p>
              </div>
              <div data-show="0.47,0.69" className="grp-scn">
                <span className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.group.scenario} 02</span>
                <span className="grp-scn-t">{t.group.s2a}<br />{t.group.s2b}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.2em', color: '#AAA6AD', lineHeight: 1.7, maxWidth: 380 }}>{t.group.s2list}</span>
              </div>
            </div>
            {GROUP.map((g, i) => {
              const b = B[g.brand];
              return (
                <div key={b.id} data-cap={i} className="grp-cap" style={{ gridArea: g.area, justifySelf: wide ? (g.side < 0 ? 'end' : 'start') : 'stretch', width: wide ? 'clamp(190px,22vw,320px)' : 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 'none', width: 12, height: 12, background: b.dot, boxShadow: '0 0 0 1px rgba(245,241,233,.35)' }} />
                    <span className="xw" style={{ fontWeight: 800, fontSize: 'clamp(12px,1.15vw,17px)', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{b.name}</span>
                  </div>
                  <div style={{ display: 'grid' }}>
                    <span data-role="1" className="serif-i grp-role">{t.group.roles[i].r1}</span>
                    <span data-role="2" className="serif-i grp-role" style={{ opacity: 0 }}>{t.group.roles[i].r2}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div data-show="0.715,0.8" className="grp-layer" style={{ padding: '0 5vw' }}>
            <h3 className="grp-big" style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,96px)', letterSpacing: '-.045em', lineHeight: 0.92 }}>{t.group.bigA}<br /><span className="serif-i" style={{ letterSpacing: '-.02em', color: '#C9A8E8' }}>{t.group.bigB}</span></h3>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'clamp(24px,4vh,44px)', textAlign: 'center', padding: '0 6vw', pointerEvents: 'none' }}>
            <p data-show="0.805,0.885" className="serif" style={{ margin: 0, maxWidth: 880, fontSize: 'clamp(24px,2.8vw,48px)', lineHeight: 1.12, textWrap: 'balance' }}>{t.group.alone}</p>
            <p data-show="0.835,0.885" style={{ margin: 0, maxWidth: 720, fontSize: 'clamp(15px,1.3vw,20px)', lineHeight: 1.55, color: '#D9D3DE', textWrap: 'balance' }}>{t.group.together}</p>
          </div>
          <div data-show="0.895,9" className="grp-layer" style={{ padding: '0 5vw' }}>
            <div className="grp-big" style={{ fontWeight: 900, fontSize: 'clamp(34px,5.6vw,108px)', letterSpacing: '-.05em', lineHeight: 0.9 }}>{t.group.finalA}<br />{t.group.finalB}<br /><span style={{ color: '#C9A8E8' }}>{t.group.finalC}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Le Groupe sur téléphone : les deux scénarios en cartes empilées, chaque marque visible avec son rôle. */
function CollaborationsMobile() {
  const { t, locale } = useI18n();
  const scenarios = [
    { n: '01', title: t.group.s1, d: t.group.s1d, k: 'r1' as const },
    { n: '02', title: `${t.group.s2a} ${t.group.s2b}`.replace('- ', ''), d: t.group.s2d, k: 'r2' as const },
  ];
  return (
    <section id="collaborations" data-screen-label="11 Le Groupe" data-sc="enter" data-hd="#F5F1E9" className="grp-m">
      <div className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.group.label}</div>
      <h2 className="serif" style={{ margin: 0, fontWeight: 400, fontSize: 36, lineHeight: 0.98, letterSpacing: '-.02em' }}>{t.group.h2a}<br /><em>{t.group.h2b}</em></h2>
      <p data-r="0.05" className="serif" style={{ margin: 0, fontSize: 22, lineHeight: 1.18 }}>{t.group.introA} <em style={{ color: '#C9C2CF' }}>{t.group.introB}</em></p>
      {scenarios.map((sc, si) => (
        <div key={sc.n} data-r={(0.1 + si * 0.1).toFixed(2)} className="grp-m-scn">
          <span className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.group.scenario} {sc.n}</span>
          <span className="grp-m-t">{sc.title}</span>
          <p className="serif-i" style={{ margin: 0, fontSize: 17, lineHeight: 1.25, color: '#D9D3DE' }}>{sc.d}</p>
          <ul className="grp-m-list">
            {GROUP.map((g, gi) => {
              const b = B[g.brand];
              return (
                <li key={b.id}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 'none', width: 10, height: 10, background: b.dot, boxShadow: '0 0 0 1px rgba(245,241,233,.35)' }} />
                    <span className="xw" style={{ fontWeight: 800, fontSize: 13, letterSpacing: '.06em' }}>{b.name}</span>
                  </span>
                  <span className="serif-i" style={{ fontSize: 17, lineHeight: 1.2, color: '#D9D3DE' }}>{t.group.roles[gi][sc.k]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <h3 data-r="0.3" className="grp-big" style={{ fontWeight: 800, fontSize: 34, letterSpacing: '-.045em', lineHeight: 0.95 }}>{t.group.bigA}<br /><span className="serif-i" style={{ letterSpacing: '-.02em', color: '#C9A8E8' }}>{t.group.bigB}</span></h3>
      <p data-r="0.34" className="serif" style={{ margin: 0, fontSize: 22, lineHeight: 1.18 }}>{t.group.alone}</p>
      <p data-r="0.38" style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#D9D3DE' }}>{t.group.together}</p>
      <div data-r="0.42" className="grp-big" style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-.05em', lineHeight: 0.92 }}>{t.group.finalA}<br />{t.group.finalB}<br /><span style={{ color: '#C9A8E8' }}>{t.group.finalC}</span></div>
    </section>
  );
}

// ——— 12 Chiffres ———
const STATS = [{ n: 3000, r: '0.2' }, { n: 20, r: '0.28' }, { n: 35, r: '0.36' }]; // libellés : t.stats.items

function Chiffres() {
  const { t, locale } = useI18n();
  return (
    <section id="chiffres" data-screen-label="12 Les chiffres EMKAY" data-sc="enter" data-count-once="" data-hd="#2B143D" className="num">
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div data-r="0.05" className="num-head">
          <div>
            <div className="lbl" style={{ letterSpacing: '.24em' }}>{t.stats.label}</div>
            <h2 className="serif" style={{ margin: '18px 0 0', fontWeight: 400, fontSize: 'clamp(36px,4.6vw,84px)', lineHeight: 0.95, letterSpacing: '-.02em' }}>{t.stats.h2a}<br /><em>{t.stats.h2b}</em></h2>
          </div>
          <span className="lbl" style={{ color: '#6c6472' }}>{t.stats.since}</span>
        </div>
        <div className="num-grid">
          {STATS.map((s, si) => (
            <div key={si} data-r={s.r} className="num-cell">
              <span data-count={s.n} className="num-n">+{s.n}</span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.2em', color: '#080808' }}>{t.stats.items[si]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 13 In Real Life ———
// Galerie horizontale : la section reste fixée à l'écran et les photos défilent de droite à gauche
// au rythme du scroll (ordinateur et téléphone). La hauteur de la section = 1 écran + la longueur de la galerie.
function InRealLife({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const { fine, wide } = ui;
  const [hover, setHover] = useState(-1);
  const [shift, setShift] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = trackRef.current; if (!t) return;
    const measure = () => setShift(Math.max(0, Math.round(t.scrollWidth - innerWidth)));
    measure();
    const ro = new ResizeObserver(measure); ro.observe(t);
    addEventListener('resize', measure);
    return () => { ro.disconnect(); removeEventListener('resize', measure); };
  }, []);
  const H = wide ? 'min(60vh, 620px)' : '52svh';
  return (
    <section id="projets" data-screen-label="13 In Real Life" data-sc="sticky" data-hd="#F5F1E9" className="irl" style={{ height: `calc(100svh + ${shift}px)`, ['--irl-shift' as string]: `${shift}px` } as React.CSSProperties}>
      <div className="irl-in">
        <div ref={trackRef} className="irl-track">
          <div className="irl-intro">
            <h2 data-r="0.0" className="irl-h2">IN REAL<br />LIFE</h2>
            <p data-r="0.0" className="serif-i" style={{ margin: 0, maxWidth: 380, fontSize: 'clamp(22px,2.2vw,34px)', lineHeight: 1.15, color: '#C9C2CF' }}>{t.irl.p}</p>
            <span className="lbl" style={{ letterSpacing: '.24em', color: '#AAA6AD' }}>{t.irl.scroll}</span>
          </div>
          {IRL.map((m, i) => {
            const tx = t.irl.items[i];
            const on = hover === i || !fine;
            const [rw, rh] = (RATIO[m.orientation] || '4/5').split('/').map(Number);
            return (
              <figure key={m.src.toString()} data-cursor={t.cursor.open} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} className="irl-fig">
                <div className="irl-media" style={{ height: H, width: `min(calc(${H} * ${(rw / rh).toFixed(4)}), ${wide ? '70vw' : '86vw'})` }}>
                  <Media src={m.src} type={m.type} poster={m.poster} placeholder={tx.ph} alt={`${m.brand} · ${tx.project}`} sizes={wide ? '(max-width: 1600px) 60vw, 1000px' : '90vw'} quality={90} autoplay="visible" />
                  <div className="irl-ov" style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? '0px' : '12px'})` }}>
                    <span><span style={{ color: '#AAA6AD' }}>{t.irl.brand} </span>{m.brand}</span><span><span style={{ color: '#AAA6AD' }}>{t.irl.project} </span>{tx.project}</span>{tx.place && <span><span style={{ color: '#AAA6AD' }}>{t.irl.place} </span>{tx.place}</span>}<span><span style={{ color: '#AAA6AD' }}>{t.irl.year} </span>{m.year}</span>
                  </div>
                </div>
                <figcaption style={{ fontSize: 11, letterSpacing: '.22em', lineHeight: 1.6 }}><b>{String(i + 1).padStart(2, '0')} · {m.brand}</b><br /><span style={{ color: '#AAA6AD' }}>{tx.project}{tx.place ? ` · ${tx.place}` : ''}</span></figcaption>
              </figure>
            );
          })}
        </div>
        <div className="irl-bar" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}

// ——— 14 Votre besoin, notre marque ———
function Orientation({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const { wide } = ui;
  const [act, setAct] = useState(0);
  const panelBg = (id: string, bg: string) => (id === 'overton' ? '#1A1610' : bg);
  const k = Math.max(0, act), ao = ORIENT[k], ab = B[ao.b], at = t.orient.items[k];
  return (
    <section id="orientation" data-screen-label="14 Votre besoin, notre marque" data-sc="enter" data-hd="#080808" className="or">
      <div data-r="0.04" className="lbl" style={{ letterSpacing: '.24em', color: '#2B143D' }}>{t.orient.label}</div>
      <h2 data-r="0.08" className="or-h2">{t.orient.h2a}<br /><span className="serif-i" style={{ letterSpacing: '-.02em', color: '#2B143D' }}>{t.orient.h2b}</span></h2>
      <p data-r="0.16" style={{ margin: '4vh 0 0', maxWidth: 560, fontSize: 18, lineHeight: 1.5, color: '#3a3540' }}>{t.orient.p}</p>
      <div style={{ marginTop: '7vh', display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1.1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 'clamp(24px,4vw,64px)', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #080808' }}>
          {ORIENT.map((o, i) => {
            const b = B[o.b], on = act === i;
            return (
              <div key={o.id} style={{ borderBottom: '1px solid rgba(8,8,8,.25)' }}>
                <button type="button" onMouseEnter={() => { if (wide) setAct(i); }} onFocus={() => { if (wide) setAct(i); }} onClick={() => setAct(!wide && act === i ? -1 : i)} data-cursor={t.cursor[b.cursor]} aria-expanded={on} className="btn-reset or-btn" style={{ opacity: on ? 1 : 0.62 }}>
                  <span className="lbl" style={{ flex: 'none', width: 28, letterSpacing: '.2em', color: '#2B143D' }}>0{i + 1}</span>
                  <span className="or-need" style={{ transform: `translateX(${on && wide ? '14px' : '0px'})` }}>{t.orient.items[i].need}</span>
                  <span style={{ flex: 'none', fontSize: 18, transform: `rotate(${on ? (wide ? '0deg' : '90deg') : '0deg'})`, transition: 'transform .5s ease' }}>→</span>
                </button>
                {!wide && on && (
                  <div style={{ margin: '0 0 20px', padding: 24, background: panelBg(b.id, b.bg), color: b.fg, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em' }}>→ {b.name}</span>
                    <div style={{ height: 56, display: 'flex', alignItems: 'center' }}>
                      <BrandMark brand={b} src={b.logoT} size="28px" style={{ display: 'block', maxHeight: 40, maxWidth: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: b.lr }} />
                    </div>
                    <span style={{ fontSize: 15, lineHeight: 1.7 }}>{t.orient.items[i].services.join(' · ')}</span>
                    <a href={'#' + o.id} style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 700, letterSpacing: '.16em', paddingBottom: 6, borderBottom: '1px solid currentColor' }}>{t.orient.discover} {b.name} →</a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {wide && (
          <div className="or-panel" style={{ background: panelBg(ab.id, ab.bg), color: ab.fg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 11, fontWeight: 700, letterSpacing: '.22em' }}><span>{at.need.toUpperCase()}</span><span>0{k + 1} / 05</span></div>
            <div data-orpanel="" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vh,32px)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.22em' }}>→ {ab.name}</span>
              <div style={{ height: 'clamp(36px,3.4vw,52px)', display: 'flex', alignItems: 'center' }}>
                <BrandMark brand={ab} src={ab.logoT} size="clamp(26px,2.6vw,40px)" style={{ display: 'block', maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: ab.lr }} />
              </div>
              <p className="serif" style={{ margin: 0, fontSize: 'clamp(20px,1.9vw,32px)', lineHeight: 1.2, textWrap: 'balance' }}>{at.services.join(' · ')}</p>
            </div>
            <a href={'#' + ao.id} className="cta-line" style={{ alignSelf: 'flex-start', fontWeight: 700, letterSpacing: '.18em', paddingBottom: 8, borderBottom: '1px solid currentColor' }}>{t.orient.discover} {ab.name} →</a>
          </div>
        )}
      </div>
    </section>
  );
}

// ——— 14b Cinq portes d'entrée ———
function Portes() {
  const { t, locale } = useI18n();
  return (
    <section id="portes" data-screen-label="14b Cinq portes d'entrée" data-sc="enter" data-hd="#F5F1E9" className="portes">
      <p data-r="0.12" className="serif" style={{ margin: 0, fontSize: 'clamp(32px,4.4vw,80px)', lineHeight: 1.02 }}>{t.portes.a}<br /><em style={{ color: '#C9C2CF' }}>{t.portes.b}</em></p>
      <div data-r="0.45" data-fx="mask" style={{ width: 'min(80vw,760px)' }}>
        <Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    </section>
  );
}

// ——— 15 À propos ———
function APropos() {
  const { t, locale } = useI18n();
  return (
    <section id="a-propos" data-screen-label="15 À propos" data-sc="enter" data-hd="#080808" className="about">
      <div style={{ height: 1, background: '#2B143D', margin: '0 -5vw 10vh', transformOrigin: '0 50%', transform: 'scaleX(var(--p,0))' }} />
      <div className="about-grid">
        <div data-r="0.3" style={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
          <span className="lbl" style={{ letterSpacing: '.24em', color: '#2B143D' }}>EMKAY PARTNERS</span>
          <h2 className="serif" style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(40px,5.4vw,96px)', lineHeight: 0.95, letterSpacing: '-.02em', color: '#2B143D' }}>{t.about.h2a}<br /><em>{t.about.h2b}</em></h2>
        </div>
        <div data-r="0.42" style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 22, fontSize: 18, lineHeight: 1.55 }}>
          <p style={{ margin: 0 }}>{t.about.p1}</p>
          <p style={{ margin: 0, color: '#4A4450' }}>{t.about.p2}</p>
        </div>
      </div>
    </section>
  );
}

// ——— 16 Manifeste ———
function Manifeste({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  return (
    <section id="manifeste" data-screen-label="16 Manifeste" data-sc="sticky" data-steps="5" data-seq="" data-bgs="#080808,#0D0A11,#140C1C,#1D0F2A,#2B143D" data-hd="#F5F1E9" style={{ height: ui.wide ? '520vh' : '330vh', position: 'relative', zIndex: 3 }}>
      <div className="mf-in">
        <div data-i="0" className="mf-line serif">{t.manifesto.l1}</div>
        <div data-i="1" className="mf-line serif">{t.manifesto.l2}</div>
        <div data-i="2" className="mf-line serif"><span>{t.manifesto.l3a}<br /><em>{t.manifesto.l3b}</em></span></div>
        <div data-i="3" className="mf-line serif-i">{t.manifesto.l4}</div>
        <div data-i="4" data-fx="pop" className="mf-line mf-final">EMKAY<br />PARTNERS.</div>
      </div>
    </section>
  );
}

// ——— 17 On commence ? ———
function Contact({ ui }: { ui: UI }) {
  const { t, locale } = useI18n();
  const { fine } = ui;
  const [hv, setHv] = useState(-1);
  return (
    <section id="contact" data-screen-label="17 On commence ?" data-sc="enter" data-hd="#F5F1E9" className="ct">
      <h2 data-r="0.08" className="ct-h2">{t.contact.h2}<span style={{ color: '#C9A8E8' }}> ?</span></h2>
      <p data-r="0.14" className="serif-i" style={{ margin: '4vh 0 10vh', maxWidth: 640, fontSize: 'clamp(22px,2.2vw,36px)', lineHeight: 1.15, color: '#D9D3DE' }}>{t.contact.p}</p>
      <div onMouseLeave={() => setHv(-1)} className="ct-doors">
        {DOORS.map((d, i) => {
          const dt = t.contact.doors[i];
          const on = hv === i, dim = hv >= 0 && !on, touch = !fine, light = d.fg === '#F5F1E9';
          return (
            <button key={d.k} type="button" onClick={() => { setHv(-1); ui.openForm(d.k); }} onMouseEnter={() => { if (fine) setHv(i); }} onFocus={() => { if (fine) setHv(i); }}
              data-r={(0.22 + i * 0.07).toFixed(2)} data-cursor={t.cursor.open} className="btn-reset ct-door"
              style={{ background: on ? d.bgH : d.bg, color: d.fg, border: `1px solid ${on ? (light ? 'rgba(245,241,233,.55)' : 'rgba(43,20,61,.45)') : light ? 'rgba(245,241,233,.14)' : 'rgba(43,20,61,.12)'}`, opacity: dim ? 0.62 : 1, transform: `scale(${on && d.fx !== 'soft' ? 1.01 : 1}) translateY(${on ? (d.fx === 'soft' ? '-2px' : '-4px') : '0px'})` }}>
              <span className="ct-topline" style={{ transform: `scaleX(${(on || touch) && d.fx === 'line' ? 1 : 0})` }} />
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <span className="xw" style={{ fontWeight: 800, fontSize: 'clamp(14px,1.1vw,18px)', letterSpacing: '.08em', transformOrigin: '0 0', transform: `scale(${on && d.fx === 'line' ? 1.25 : 1})`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>{d.num}</span>
                <span aria-hidden="true" style={{ position: 'relative', width: 44, height: 12, opacity: d.fx === 'join' ? 1 : 0, transition: 'opacity .4s ease' }}>
                  <span className="ct-join" style={{ left: 0, transform: `translateX(${on && d.fx === 'join' ? '13px' : '0px'})` }} />
                  <span className="ct-join" style={{ right: 0, transform: `translateX(${on && d.fx === 'join' ? '-13px' : '0px'})` }} />
                </span>
              </span>
              <span className="serif ct-door-t">{dt.title}</span>
              <span style={{ marginTop: 'clamp(16px,2.4vh,24px)', maxWidth: 420, fontSize: 'clamp(15px,1.1vw,17px)', lineHeight: 1.5, opacity: 0.86, textWrap: 'pretty' }}>{dt.desc}</span>
              <span className={d.fx === 'soft' ? 'serif-i' : undefined} style={{ marginTop: 12, maxWidth: 420, fontSize: 14, lineHeight: 1.5, opacity: d.fx === 'soft' ? (on || touch ? 1 : 0) : 0.72, transition: 'opacity .5s ease' }}>{dt.sub}</span>
              <span className="ct-cta">
                <span style={{ transform: `translateX(${on ? '4px' : '0px'})`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>{dt.cta}</span>
                <span style={{ transform: `translateX(${on ? '10px' : '0px'})`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>↗︎</span>
              </span>
            </button>
          );
        })}
      </div>
      <div data-r="0.45" style={{ marginTop: '8vh', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <span style={{ fontSize: 11, letterSpacing: '.24em', color: '#C9C2CF' }}>{t.common.brusselsBelgium}</span>
        <button type="button" onClick={() => ui.openForm('write')} data-cursor={t.cursor.open} className="btn-reset btn-light">{t.contact.write}</button>
      </div>
    </section>
  );
}

// ——— 18 Footer ———
function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer data-screen-label="18 Footer" data-hd="#F5F1E9" className="ft">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', width: 'min(70vw,520px)', height: 'auto', objectFit: 'contain' }} />
        <span className="lbl" style={{ fontSize: 12, color: '#D9D3DE' }}>{t.footer.city}</span>
      </div>
      <div className="ft-cols">
        <div className="ft-col">
          <span className="ft-h">{t.footer.brands}</span>
          <a href="#vision-house" data-cursor={t.cursor.go} className="ft-a">Vision House →</a>
          <a href="#overton" data-cursor={t.cursor.go} className="ft-a">Overton →</a>
          <a href="#orizon-connect" data-cursor={t.cursor.go} className="ft-a">Orizon Connect →</a>
          <a href="#bavare" data-cursor={t.cursor.go} className="ft-a">Bavare →</a>
          <a href="#viens-manger" data-cursor={t.cursor.go} className="ft-a">Viens Manger →</a>
        </div>
        <div className="ft-col">
          <span className="ft-h">{t.footer.follow}</span>
          <Ext href={LINKS.linkedin} className="ft-a">LinkedIn ↗︎</Ext>
          <Ext href={LINKS.instagram} className="ft-a">Instagram ↗︎</Ext>
          <a href="#contact" data-cursor={t.cursor.go} className="ft-a">{t.footer.contact} →</a>
        </div>
        <div className="ft-col">
          <span className="ft-h">{t.footer.info}</span>
          <Link href={PATHS.legal[locale]} className="ft-a">{t.footer.legal}</Link>
          <Link href={PATHS.privacy[locale]} className="ft-a">{t.footer.privacy}</Link>
          <LangSwitch locale={locale} page="home" keepHash className="ft-lang" />
        </div>
      </div>
      <div style={{ paddingTop: 20, borderTop: '1px solid rgba(245,241,233,.2)', fontSize: 11, letterSpacing: '.2em', color: '#C9C2CF' }}>© 2026 EMKAY PARTNERS</div>
    </footer>
  );
}

