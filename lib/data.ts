// ——— Données centralisées ———
// Ajouter / modifier du contenu ici : la mise en page se met à jour toute seule.

export type Brand = {
  id: string;
  num: string;
  name: string;
  cat: string;
  tags: string;
  desc: string;
  cta: string;
  bg: string;
  fg: string;
  dot: string;
  cursor: string;
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
  { id: 'vision-house', num: '01', name: 'VISION HOUSE', cat: 'Marketing & communication', tags: 'STRATÉGIE / CONTENU / POSITIONNEMENT', desc: 'Stratégie, contenu et visibilité pour faire de la communication un véritable levier de développement.', cta: 'DÉCOUVRIR VISION HOUSE ↗︎', bg: '#0C0340', fg: '#F5F1E9', dot: '#0C0340', cursor: 'VOIR', logo: '/logos/visionhouse.png', logoT: '/logos/visionhouse-white.png', lw: '100%', lr: '0', plate: '#0C0340' },
  // Overton et Orizon Connect : logos officiels à fournir → déposer les fichiers dans public/logos/, renseigner logo / logoT (et logoRoom pour fond violet) et LOGO_SIZE.
  { id: 'overton', num: '02', name: 'OVERTON', cat: 'Événements & expériences', tags: 'ÉVÉNEMENTS / EXPÉRIENCES', desc: 'Des événements imaginés par Overton ou créés sur mesure pour les entreprises et les marques.', cta: 'DÉCOUVRIR OVERTON ↗︎', bg: '#0B0A08', fg: '#E9D29C', dot: '#C9A35E', cursor: 'VOIR', logo: '', logoT: '', lw: '90%', lr: '0', plate: '#0B0A08' },
  { id: 'orizon-connect', num: '03', name: 'ORIZON CONNECT', cat: 'Rencontres professionnelles', tags: 'RENCONTRES / BUSINESS / CONNEXIONS', desc: 'Rapprocher entrepreneurs, dirigeants, entreprises et partenaires : la qualité des connexions avant tout.', cta: 'DÉCOUVRIR ORIZON CONNECT ↗︎', bg: '#FBF1E7', fg: '#3A1450', dot: '#E2463A', cursor: 'CONNECTER', logo: '', logoT: '', lw: '86%', lr: '0', plate: '#FBF1E7' },
  { id: 'bavare', num: '04', name: 'BAVARE', cat: 'Événements sociaux', tags: 'SORTIR / LIEUX / RENCONTRES', desc: "Des occasions simples de sortir, discuter et rencontrer, dans des lieux qu'on ne connaissait pas encore.", cta: 'VOIR LE PROCHAIN BAVARE ↗︎', bg: '#FF9EC4', fg: '#E3122B', dot: '#FF9EC4', cursor: 'SORTIR', logo: '/logos/bavard.png', logoT: '/logos/bavard.png', lw: '80%', lr: '0', plate: '#FF9EC4' },
  { id: 'viens-manger', num: '05', name: 'VIENS MANGER', cat: 'Food & découvertes', tags: 'RESTAURANTS / LIEUX / DÉCOUVERTE', desc: 'Restaurants, lieux, concepts culinaires et expériences qui valent le détour.', cta: 'DÉCOUVRIR VIENS MANGER ↗︎', bg: '#4A0B16', fg: '#F2E7D3', dot: '#C23A4E', cursor: 'GOÛTER', logo: '/logos/viensmanger.png', logoT: '/logos/viensmanger.png', lw: '74%', lr: '50%', plate: 'transparent' },
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
  { b: 0, purpose: 'Communication, stratégie & contenu', short: 'Communication, stratégie, contenu', qBg: '#0C0340', qFg: '#F5F1E9' },
  { b: 1, purpose: 'Événements & expériences', short: 'Événements & expériences', qBg: '#0B0A08', qFg: '#E9D29C' },
  { b: 2, purpose: 'Networking & connexions professionnelles', short: 'Networking & connexions', qBg: '#FBF1E7', qFg: '#3A1450' },
  { b: 3, purpose: 'Sorties, rencontres & lieux', short: 'Sorties & rencontres', qBg: '#FF9EC4', qFg: '#E3122B' },
  { b: 4, purpose: 'Food & découvertes', short: 'Food & découvertes', qBg: '#4A0B16', qFg: '#F2E7D3' },
];

// Le Groupe — scénarios (r1 = Inauguration, r2 = Événement d'entreprise). Viens Manger volontairement absent.
export const GROUP = [
  { brand: 1, area: 'a', side: -1, row: -1, r1: 'Conception et production de l’événement', r2: 'Imagine et produit l’expérience' },
  { brand: 0, area: 'b', side: 1, row: -1, r1: 'Communication et visibilité', r2: 'Construit la communication autour du rendez-vous' },
  { brand: 2, area: 'd', side: -1, row: 1, r1: 'Invités et connexions professionnelles', r2: 'Facilite les rencontres et les connexions professionnelles' },
  { brand: 3, area: 'e', side: 1, row: 1, r1: 'Dimension sociale et expérience', r2: 'Apporte une dimension plus sociale lorsque le format s’y prête' },
];

export type MediaType = 'image' | 'video';

/** Un fichier, ou plusieurs formats du même média (ex. ['/media/clip.webm', '/media/clip.mp4']). */
export type MediaSrc = string | string[];

// Projets Vision House : dossiers public/vision-house/ (voir public/vision-house/LISEZ-MOI.md).

export type Orientation = 'vertical' | 'portrait' | 'square' | 'landscape' | 'wide';
export const RATIO: Record<Orientation, string> = { vertical: '9/16', portrait: '4/5', square: '1/1', landscape: '16/9', wide: '21/9' };

// In Real Life — photo ou vidéo (type: 'video' ou extension .mp4/.webm/.mov).
// basis / min / m / px : placement libre dans la galerie (desktop) et parallaxe horizontale.
export const IRL: { brand: string; project: string; year: string; orientation: Orientation; type?: MediaType; src: MediaSrc; poster?: string; basis: string; min: string; m: string; px: number; ph: string }[] = [
  { brand: 'OVERTON', project: 'INAUGURATION', year: '2026', orientation: 'portrait', src: '/media/irl-1-hd.webp', basis: '0 1 56%', min: '300px', m: '0', px: -40, ph: 'Overton · inauguration (photo ou MP4)' },
  { brand: 'BAVARE', project: 'SOIRÉE SOCIALE', year: '2026', orientation: 'portrait', src: '/media/irl-2-hd.webp', basis: '0 1 30%', min: '260px', m: '14vh 0 0', px: 50, ph: 'Bavare · soirée' },
  { brand: 'VISION HOUSE', project: 'TOURNAGE', year: '2026', orientation: 'portrait', src: '/media/irl-3-hd.webp', basis: '0 1 20%', min: '220px', m: '0 0 0 8vw', px: 30, ph: 'Coulisses · tournage' },
  { brand: 'VIENS MANGER', project: 'EXPÉRIENCE FOOD', year: '2025', orientation: 'portrait', src: '/media/irl-4-hd.webp', basis: '0 1 32%', min: '260px', m: '-6vh 0 0', px: -60, ph: 'Viens Manger · restaurant' },
  { brand: 'ORIZON CONNECT', project: 'RENCONTRES', year: '2025', orientation: 'landscape', src: '/media/irl-5-v2.webp', basis: '0 1 34%', min: '260px', m: '20vh 0 0', px: 40, ph: 'Rencontres · participants' },
  { brand: 'BAVARE', project: 'ON SORT', year: '2025', orientation: 'wide', src: '/media/irl-6-hd.webp', basis: '1 1 100%', min: '100%', m: '0 -5vw', px: -30, ph: 'Plein écran · photo ou vidéo' },
  { brand: 'VISION HOUSE', project: 'PRODUCTION', year: '2025', orientation: 'vertical', src: '/media/irl-7-hd.webp', basis: '0 1 22%', min: '220px', m: '0', px: -30, ph: 'Vidéo verticale 9:16 · production' },
  { brand: 'VIENS MANGER', project: "L'ADRESSE", year: '2025', orientation: 'landscape', src: '/media/irl-8-hd.webp', basis: '0 1 44%', min: '280px', m: '12vh 0 0', px: 50, ph: 'Lieu · restaurant' },
  { brand: 'OVERTON', project: 'ACTIVATION', year: '2024', orientation: 'portrait', src: '/media/irl-9-hd.webp', basis: '0 1 18%', min: '200px', m: '-4vh 0 0', px: -50, ph: 'Équipes · activation' },
];

// Photos de section (remplaçables).
export const SECTION_MEDIA = {
  overton: '/media/img-nx-hd.webp',
  bavare: '/media/img-bavard-hd.webp',
  viensManger: '/media/img-vm-hd.webp',
};

export const ORIENT = [
  { id: 'vision-house', b: 0, need: 'Gagner en visibilité', services: ['Stratégie', 'Communication', 'Contenu', 'Positionnement'] },
  { id: 'overton', b: 1, need: 'Créer un événement', services: ['Événements', 'Inaugurations', 'Expériences', 'Corporate'] },
  { id: 'orizon-connect', b: 2, need: 'Développer mon réseau', services: ['Connexions', 'Networking', 'Rencontres professionnelles', 'Opportunités'] },
  { id: 'bavare', b: 3, need: 'Sortir et rencontrer', services: ['Événements sociaux', 'Rencontres', 'Découverte de lieux', 'Expériences'] },
  { id: 'viens-manger', b: 4, need: 'Découvrir où manger', services: ['Restaurants', 'Concepts food', 'Adresses', 'Expériences culinaires'] },
];

// EMKAY Room — orbites elliptiques distinctes (fractions du rayon dispo), décalage vertical, phase.
export const ROOM = [
  { b: 0, role: 'Communication & stratégie', f: 0.62, fy: 0.55, oy: -0.02, ph: 200, w: 'clamp(130px,15vw,230px)', h: 'clamp(30px,3.2vw,48px)', pad: '0', r: '0' },
  { b: 1, role: 'Événements & expériences', f: 0.82, fy: 0.78, oy: -0.1, ph: 280, w: 'clamp(120px,13vw,200px)', h: 'clamp(36px,3.6vw,56px)', pad: '0', r: '0' },
  { b: 2, role: 'Rencontres professionnelles', f: 0.96, fy: 0.7, oy: 0.04, ph: 350, w: 'clamp(120px,13vw,200px)', h: 'clamp(42px,4.6vw,70px)', pad: '0', r: '0' },
  { b: 3, role: 'Événements sociaux', f: 1, fy: 0.92, oy: 0, ph: 60, w: 'clamp(120px,13vw,200px)', h: 'clamp(44px,4.4vw,68px)', pad: 'clamp(6px,.7vw,10px) clamp(12px,1.2vw,18px)', r: '999px' },
  { b: 4, role: 'Food & découvertes', f: 0.78, fy: 0.86, oy: 0.08, ph: 130, w: 'clamp(76px,7.6vw,124px)', h: 'clamp(76px,7.6vw,124px)', pad: '0', r: '50%' },
];

// ——— Formulaires ———
export type FormKind = 'project' | 'collab' | 'talk' | 'write';
export type Field = { name: string; label: string; req: boolean; kind: 'text' | 'select' | 'area'; type?: string; options?: string[] };

const T = (name: string, label: string, req: boolean, type = 'text'): Field => ({ name, label, req, kind: 'text', type });
const A = (name: string, label: string, req: boolean): Field => ({ name, label, req, kind: 'area' });
const SEL = (name: string, label: string, req: boolean, options: string[]): Field => ({ name, label, req, kind: 'select', options });

export const FORMS: Record<FormKind, { title: string; intro: string; fields: Field[] }> = {
  project: { title: "J'ai un projet.", intro: 'Parlons du projet et identifions la marque EMKAY la plus pertinente.', fields: [T('nom', 'NOM *', true), T('entreprise', 'ENTREPRISE', false), T('email', 'EMAIL *', true, 'email'), SEL('type', 'TYPE DE PROJET', false, ['Choisir…', 'Communication & visibilité', 'Événement', 'Rencontres professionnelles', 'Expérience sociale', 'Food & hospitality', 'Je ne sais pas encore']), SEL('budget', 'BUDGET INDICATIF (FACULTATIF)', false, ['Non précisé', '< 5 000 €', '5 000 – 15 000 €', '15 000 – 50 000 €', '> 50 000 €']), A('message', 'MESSAGE *', true)] },
  collab: { title: 'Je veux collaborer.', intro: 'Imaginons une collaboration, une activation ou un projet commun.', fields: [T('nom', 'NOM *', true), T('organisation', 'ENTREPRISE / ORGANISATION *', true), T('email', 'EMAIL *', true, 'email'), T('telephone', 'TÉLÉPHONE', false, 'tel'), SEL('type', 'TYPE DE COLLABORATION', false, ['Choisir…', 'Lieu', 'Partenariat de marque', 'Prestation', 'Sponsoring', 'Organisation / institution', 'Autre']), A('message', 'VOTRE PROPOSITION *', true)] },
  talk: { title: "J'ai envie d'échanger.", intro: 'Un café, un appel, une idée.', fields: [T('nom', 'NOM *', true), T('email', 'EMAIL *', true, 'email'), A('message', 'MESSAGE *', true)] },
  write: { title: 'Nous écrire.', intro: 'Bruxelles, Belgique.', fields: [T('nom', 'NOM *', true), T('email', 'EMAIL *', true, 'email'), A('message', 'MESSAGE *', true)] },
};

/** Libellé du type de demande transmis avec chaque message. */
export const FORM_LABEL: Record<FormKind, string> = { project: 'Projet', collab: 'Collaboration', talk: 'Échange', write: 'Message' };

export const DOORS: { k: FormKind; num: string; title: string; desc: string; sub: string; cta: string; bg: string; bgH: string; fg: string; fx: 'line' | 'join' | 'soft' }[] = [
  { k: 'project', num: '01', title: 'J’ai un projet.', desc: 'Vous avez une idée, un événement, une marque ou un besoin de communication à développer ?', sub: 'Parlons du projet et identifions la marque EMKAY la plus pertinente.', cta: 'PRÉSENTER MON PROJET', bg: '#3A1E52', bgH: '#45255F', fg: '#F5F1E9', fx: 'line' },
  { k: 'collab', num: '02', title: 'Je veux collaborer.', desc: 'Vous êtes une marque, un lieu, un partenaire, un prestataire ou une organisation ?', sub: 'Imaginons une collaboration, une activation ou un projet commun.', cta: 'PROPOSER UNE COLLABORATION', bg: '#1F0E2D', bgH: '#170A22', fg: '#F5F1E9', fx: 'join' },
  { k: 'talk', num: '03', title: 'J’ai envie d’échanger.', desc: 'Pas encore de projet précis ? Une conversation suffit parfois à faire émerger la suite.', sub: 'Un café, un appel, une idée.', cta: 'ÉCHANGER AVEC NOUS', bg: '#EEE6EC', bgH: '#F6F0F3', fg: '#2B143D', fx: 'soft' },
];

// Liens à compléter : laisser '' tant que l'URL réelle n'est pas connue (le lien est alors masqué ou désactivé).
export const LINKS = { linkedin: 'https://www.linkedin.com/company/emkay-partners-com/', instagram: '', nextBavare: 'https://passpass.be/fr/o/bavare-9B5Xlv', vmAddresses: 'https://www.instagram.com/viensmangerr/', mentions: '/mentions-legales', privacy: '/politique-de-confidentialite' };

// Hash aliases (anciennes adresses) + positions d'arrivée dans les sections sticky.
// Anciennes adresses (dont #nexplore et #nexplore-connect avant le changement de nom) → nouvelles sections.
export const ALIAS: Record<string, string> = { vision: 'vision-house', nexplore: 'overton', 'nexplore-connect': 'orizon-connect', 'horizon-connect': 'orizon-connect', horizon: 'orizon-connect', orizon: 'orizon-connect', connect: 'orizon-connect', bavard: 'bavare', vm: 'viens-manger', irl: 'projets', apropos: 'a-propos', room: 'groupe', top: 'top' };
export const ARRIVE: Record<string, number> = { 'orizon-connect': 0.35, bavare: 0.6, 'viens-manger': 0.6, groupe: 0.3 };

/** Réglages (anciennement le panneau du prototype). */
export const SETTINGS = { customCursor: true, sideNav: true, orbitSpeed: 5 };
