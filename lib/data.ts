// ——— Données centralisées ———
// Ajouter / modifier du contenu ici : la mise en page se met à jour toute seule.

export type CursorKey = 'open' | 'see' | 'go' | 'connect' | 'out' | 'taste';

// Les textes (catégorie, description, appels à l'action…) sont dans lib/i18n/{fr,en,nl}.ts, dans le même ordre.
export type Brand = {
  id: string;
  num: string;
  name: string;
  bg: string;
  fg: string;
  dot: string;
  /** Libellé du curseur personnalisé (traduit via le dictionnaire, clé de t.cursor). */
  cursor: CursorKey;
  /** Logo sur fond de marque (sélecteur « Nos marques »). Vide tant que le logo officiel n'est pas fourni : le nom s'affiche alors en texte. */
  logo: string;
  /** Logo pour fonds sombres / transparents (orientation, EMKAY Room). */
  logoT: string;
  /** Variante claire spécifique à EMKAY Room (fond violet). */
  logoRoom?: string;
  /** Largeur du logo dans le sélecteur. */
  lw: string;
  /** Rayon du logo (Viens Manger est rond). */
  lr: string;
  /** Fond du calque logo dans le sélecteur. */
  plate: string;
};

export const BRANDS: Brand[] = [
  { id: 'vision-house', num: '01', name: 'VISION HOUSE', bg: '#0C0340', fg: '#F5F1E9', dot: '#0C0340', cursor: 'see', logo: '/logos/visionhouse.png', logoT: '/logos/visionhouse-white.png', lw: '100%', lr: '0', plate: '#0C0340' },
  // Overton et Orizon Connect : logos officiels à fournir → déposer les fichiers dans public/logos/, renseigner logo / logoT (et logoRoom pour fond violet) et LOGO_SIZE.
  { id: 'overton', num: '02', name: 'OVERTON', bg: '#0B0A08', fg: '#E9D29C', dot: '#C9A35E', cursor: 'see', logo: '', logoT: '', lw: '90%', lr: '0', plate: '#0B0A08' },
  { id: 'orizon-connect', num: '03', name: 'ORIZON CONNECT', bg: '#FBF1E7', fg: '#3A1450', dot: '#E2463A', cursor: 'connect', logo: '', logoT: '', lw: '86%', lr: '0', plate: '#FBF1E7' },
  { id: 'bavare', num: '04', name: 'BAVARE', bg: '#FF9EC4', fg: '#E3122B', dot: '#FF9EC4', cursor: 'out', logo: '/logos/bavard.png', logoT: '/logos/bavard.png', lw: '80%', lr: '0', plate: '#FF9EC4' },
  { id: 'viens-manger', num: '05', name: 'VIENS MANGER', bg: '#4A0B16', fg: '#F2E7D3', dot: '#C23A4E', cursor: 'taste', logo: '/logos/viensmanger.png', logoT: '/logos/viensmanger.png', lw: '74%', lr: '50%', plate: 'transparent' },
];

/** Dimensions intrinsèques des logos (pour next/image, sans déformation). */
export const LOGO_SIZE: Record<string, [number, number]> = {
  '/logos/emkay.png': [472, 119],
  '/logos/visionhouse.png': [379, 45],
  '/logos/visionhouse-white.png': [1516, 162],
  '/logos/bavard.png': [446, 131],
  '/logos/viensmanger.png': [484, 487],
};

// Accès rapide + menu « Nos marques » du header.
export const QUICK = [
  { b: 0, qBg: '#0C0340', qFg: '#F5F1E9' },
  { b: 1, qBg: '#0B0A08', qFg: '#E9D29C' },
  { b: 2, qBg: '#FBF1E7', qFg: '#3A1450' },
  { b: 3, qBg: '#FF9EC4', qFg: '#E3122B' },
  { b: 4, qBg: '#4A0B16', qFg: '#F2E7D3' },
];

// Le Groupe : position des marques dans les scénarios (rôles traduits dans t.group.roles). Viens Manger volontairement absent.
export const GROUP = [
  { brand: 1, area: 'a', side: -1, row: -1 },
  { brand: 0, area: 'b', side: 1, row: -1 },
  { brand: 2, area: 'd', side: -1, row: 1 },
  { brand: 3, area: 'e', side: 1, row: 1 },
];

export type MediaType = 'image' | 'video';

/** Un fichier, ou plusieurs formats du même média (ex. ['/media/clip.webm', '/media/clip.mp4']). */
export type MediaSrc = string | string[];

// Projets Vision House : dossiers public/vision-house/ (voir public/vision-house/LISEZ-MOI.md).

export type Orientation = 'vertical' | 'portrait' | 'square' | 'landscape' | 'wide';
export const RATIO: Record<Orientation, string> = { vertical: '9/16', portrait: '4/5', square: '1/1', landscape: '16/9', wide: '21/9' };

// In Real Life — photo ou vidéo (type: 'video' ou extension .mp4/.webm/.mov).
// basis / min / m / px : placement libre dans la galerie (desktop) et parallaxe horizontale.
// Projet, lieu et texte de remplacement : t.irl.items (même ordre).
export const IRL: { brand: string; year: string; orientation: Orientation; type?: MediaType; src: MediaSrc; poster?: string }[] = [
  { brand: 'OVERTON', year: '2026', orientation: 'portrait', src: '/media/irl-1-hd.webp' },
  { brand: 'BAVARE', year: '2026', orientation: 'portrait', src: '/media/irl-2-hd.webp' },
  { brand: 'VISION HOUSE', year: '2026', orientation: 'portrait', src: '/media/irl-3-hd.webp' },
  { brand: 'VIENS MANGER', year: '2025', orientation: 'portrait', src: '/media/irl-4-hd.webp' },
  { brand: 'ORIZON CONNECT', year: '2026', orientation: 'landscape', src: '/media/irl-5-v2.webp' },
  { brand: 'BAVARE', year: '2025', orientation: 'wide', src: '/media/irl-6-hd.webp' },
  { brand: 'VISION HOUSE', year: '2025', orientation: 'vertical', src: '/media/irl-7-hd.webp' },
  { brand: 'VIENS MANGER', year: '2025', orientation: 'landscape', src: '/media/irl-8-hd.webp' },
  { brand: 'OVERTON', year: '2024', orientation: 'portrait', src: '/media/irl-9-hd.webp' },
];

// Photos de section (remplaçables).
export const SECTION_MEDIA = {
  overton: '/media/img-nx-hd.webp',
  bavare: '/media/img-bavard-hd.webp',
  viensManger: '/media/img-vm-hd.webp',
};

export const ORIENT = [
  { id: 'vision-house', b: 0 },
  { id: 'overton', b: 1 },
  { id: 'orizon-connect', b: 2 },
  { id: 'bavare', b: 3 },
  { id: 'viens-manger', b: 4 },
];

// EMKAY Room — orbites elliptiques distinctes (fractions du rayon dispo), décalage vertical, phase.
export const ROOM = [
  { b: 0, f: 0.62, fy: 0.55, oy: -0.02, ph: 200, w: 'clamp(130px,15vw,230px)', h: 'clamp(30px,3.2vw,48px)', pad: '0', r: '0' },
  { b: 1, f: 0.82, fy: 0.78, oy: -0.1, ph: 280, w: 'clamp(120px,13vw,200px)', h: 'clamp(36px,3.6vw,56px)', pad: '0', r: '0' },
  { b: 2, f: 0.96, fy: 0.7, oy: 0.04, ph: 350, w: 'clamp(120px,13vw,200px)', h: 'clamp(42px,4.6vw,70px)', pad: '0', r: '0' },
  { b: 3, f: 1, fy: 0.92, oy: 0, ph: 60, w: 'clamp(120px,13vw,200px)', h: 'clamp(44px,4.4vw,68px)', pad: 'clamp(6px,.7vw,10px) clamp(12px,1.2vw,18px)', r: '999px' },
  { b: 4, f: 0.78, fy: 0.86, oy: 0.08, ph: 130, w: 'clamp(76px,7.6vw,124px)', h: 'clamp(76px,7.6vw,124px)', pad: '0', r: '50%' },
];

// ——— Formulaires ———
// Structure des champs ; libellés et listes de choix traduits dans t.form.
export type FormKind = 'project' | 'collab' | 'talk' | 'write';
export type FieldLabel = 'nom' | 'entreprise' | 'organisation' | 'email' | 'telephone' | 'typeProject' | 'typeCollab' | 'budget' | 'message' | 'proposal';
export type Field = { name: string; label: FieldLabel; req: boolean; kind: 'text' | 'select' | 'area'; type?: string; options?: 'projectTypes' | 'budgets' | 'collabTypes' };

const T = (name: string, label: FieldLabel, req: boolean, type = 'text'): Field => ({ name, label, req, kind: 'text', type });
const A = (name: string, label: FieldLabel, req: boolean): Field => ({ name, label, req, kind: 'area' });
const SEL = (name: string, label: FieldLabel, options: Field['options']): Field => ({ name, label, req: false, kind: 'select', options });

export const FORMS: Record<FormKind, Field[]> = {
  project: [T('nom', 'nom', true), T('entreprise', 'entreprise', false), T('email', 'email', true, 'email'), SEL('type', 'typeProject', 'projectTypes'), SEL('budget', 'budget', 'budgets'), A('message', 'message', true)],
  collab: [T('nom', 'nom', true), T('organisation', 'organisation', true), T('email', 'email', true, 'email'), T('telephone', 'telephone', false, 'tel'), SEL('type', 'typeCollab', 'collabTypes'), A('message', 'proposal', true)],
  talk: [T('nom', 'nom', true), T('email', 'email', true, 'email'), A('message', 'message', true)],
  write: [T('nom', 'nom', true), T('email', 'email', true, 'email'), A('message', 'message', true)],
};

// Textes des trois portes : t.contact.doors (même ordre).
export const DOORS: { k: FormKind; num: string; bg: string; bgH: string; fg: string; fx: 'line' | 'join' | 'soft' }[] = [
  { k: 'project', num: '01', bg: '#3A1E52', bgH: '#45255F', fg: '#F5F1E9', fx: 'line' },
  { k: 'collab', num: '02', bg: '#1F0E2D', bgH: '#170A22', fg: '#F5F1E9', fx: 'join' },
  { k: 'talk', num: '03', bg: '#EEE6EC', bgH: '#F6F0F3', fg: '#2B143D', fx: 'soft' },
];

// Liens à compléter : laisser '' tant que l'URL réelle n'est pas connue (le lien est alors masqué ou désactivé).
export const LINKS = { linkedin: 'https://www.linkedin.com/company/emkay-partners-com/', instagram: 'https://www.instagram.com/emkaypartners/', nextBavare: 'https://passpass.be/fr/o/bavare-9B5Xlv', vmAddresses: 'https://www.instagram.com/viensmangerr/' };

// Hash aliases (anciennes adresses) + positions d'arrivée dans les sections sticky.
// Anciennes adresses (dont #nexplore et #nexplore-connect avant le changement de nom) → nouvelles sections.
export const ALIAS: Record<string, string> = { vision: 'vision-house', nexplore: 'overton', 'nexplore-connect': 'orizon-connect', 'horizon-connect': 'orizon-connect', horizon: 'orizon-connect', orizon: 'orizon-connect', connect: 'orizon-connect', bavard: 'bavare', vm: 'viens-manger', irl: 'projets', apropos: 'a-propos', room: 'groupe', top: 'top' };
export const ARRIVE: Record<string, number> = { 'orizon-connect': 0.35, bavare: 0.6, 'viens-manger': 0.6, groupe: 0.3 };

/** Réglages (anciennement le panneau du prototype). */
export const SETTINGS = { customCursor: true, sideNav: true, orbitSpeed: 5 };
