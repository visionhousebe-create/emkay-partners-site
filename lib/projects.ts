// Projets Vision House — modèle partagé (site + administration).
// Le contenu réel est édité dans /admin et stocké dans Vercel Blob ; DEFAULT_PROJECTS sert tant que rien n'est publié.

export type ProjectFormat = '16/9' | '4/5' | '1/1' | '9/16';
export type ProjectMedia = { url: string; type: 'image' | 'video'; poster?: string; alt?: string };

export type Project = {
  id: string;
  /** Nom du client ou de la marque — ex. « N de Natacha ». */
  client: string;
  /** Secteur / type de client — ex. « Salon de coiffure ». */
  sector: string;
  /** Ville ou pays — ex. « Bruxelles ». */
  location: string;
  /** Ce qui a été fait / le résultat — ex. « Aftermovie · campagne ads promotionnelle ». */
  title: string;
  /** Texte libre affiché dans la fiche du projet. */
  description: string;
  year: string;
  services: string[];
  /** Proportion de la carte et du média principal. */
  format: ProjectFormat;
  /** Le premier média est la couverture. */
  media: ProjectMedia[];
  published: boolean;
};

export const FORMATS: { value: ProjectFormat; label: string }[] = [
  { value: '16/9', label: 'Paysage 16:9' },
  { value: '4/5', label: 'Portrait 4:5' },
  { value: '1/1', label: 'Carré 1:1' },
  { value: '9/16', label: 'Vertical 9:16' },
];

export const MAX_PROJECTS = 30;
export const MAX_MEDIA = 40;

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'micf-inauguration', client: 'MICF', sector: 'Soirée d’inauguration', location: '', title: 'Projet photo', description: '', year: '', services: ['Photographie'], format: '16/9', media: [], published: true },
  { id: 'n-de-natacha', client: 'N de Natacha', sector: 'Salon de coiffure', location: 'Belgique', title: 'Aftermovie · campagne ads promotionnelle', description: '', year: '', services: ['Vidéo', 'Aftermovie', 'Publicité'], format: '16/9', media: [], published: true },
  { id: 'agent-independant', client: 'Agent indépendant', sector: '', location: 'Bruxelles', title: 'Inconnu → expert reconnu dans son secteur', description: '', year: '', services: ['Vidéo'], format: '16/9', media: [], published: true },
  { id: 'centre-affaires', client: 'Centre d’affaires', sector: '', location: 'Belgique', title: 'En cours · audience en construction', description: '', year: '', services: ['Vidéo', 'Format vertical'], format: '9/16', media: [], published: true },
];

/** Hôtes autorisés pour les médias : fichiers du site et stockage Vercel Blob public. */
export const isAllowedMediaUrl = (u: string) => u.startsWith('/media/') || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u);

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'projet';

/** Nettoie et valide une liste de projets venant de l'administration ou du stockage. Lève une erreur si invalide. */
export function sanitizeProjects(input: unknown): Project[] {
  if (!Array.isArray(input)) throw new Error('projects must be an array');
  if (input.length > MAX_PROJECTS) throw new Error(`max ${MAX_PROJECTS} projects`);
  const seen = new Set<string>();
  return input.map((raw, i) => {
    const p = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    let id = slugify(str(p.id, 80) || str(p.client, 80) || `projet-${i + 1}`);
    while (seen.has(id)) id = `${id}-${i + 1}`;
    seen.add(id);
    const format = FORMATS.some((f) => f.value === p.format) ? (p.format as ProjectFormat) : '16/9';
    const media = (Array.isArray(p.media) ? p.media : []).slice(0, MAX_MEDIA).flatMap((m): ProjectMedia[] => {
      const o = (m && typeof m === 'object' ? m : {}) as Record<string, unknown>;
      const url = str(o.url, 1000);
      if (!url || !isAllowedMediaUrl(url)) return [];
      const poster = str(o.poster, 1000);
      return [{ url, type: o.type === 'video' ? 'video' : 'image', ...(poster && isAllowedMediaUrl(poster) ? { poster } : {}), ...(str(o.alt, 200) ? { alt: str(o.alt, 200) } : {}) }];
    });
    const services = (Array.isArray(p.services) ? p.services : []).map((s) => str(s, 40)).filter(Boolean).slice(0, 8);
    return {
      id,
      client: str(p.client, 80) || `Projet ${i + 1}`,
      sector: str(p.sector, 80),
      location: str(p.location, 60),
      title: str(p.title, 140),
      description: str(p.description, 2000),
      year: str(p.year, 12),
      services,
      format,
      media,
      published: p.published !== false,
    };
  });
}
