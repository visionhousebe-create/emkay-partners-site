// Lecture / écriture des projets Vision House dans Vercel Blob (serveur uniquement).
// Chaque publication crée un fichier versionné cms/projects-<horodatage>.json ; le plus récent fait foi.
// Les 20 dernières versions sont conservées (historique / retour arrière manuel possible depuis Vercel → Storage).

import { del, list, put } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import { DEFAULT_PROJECTS, sanitizeProjects, type Project } from './projects';

export const PROJECTS_TAG = 'vh-projects';
const PREFIX = 'cms/projects-';
const KEEP_VERSIONS = 20;

export const blobConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN;

async function listVersions() {
  const out: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PREFIX, cursor, limit: 1000 });
    out.push(...r.blobs.map((b) => ({ url: b.url, pathname: b.pathname })));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)); // plus récent d'abord
}

/** Projets publiés (non mis en cache) — utilisé par l'administration. `source` indique d'où ils viennent. */
export async function readProjects(): Promise<{ projects: Project[]; source: 'blob' | 'default' }> {
  if (!blobConfigured()) return { projects: DEFAULT_PROJECTS, source: 'default' };
  const [latest] = await listVersions();
  if (!latest) return { projects: DEFAULT_PROJECTS, source: 'default' };
  const res = await fetch(latest.url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`projects fetch failed: HTTP ${res.status}`);
  return { projects: sanitizeProjects(await res.json()), source: 'blob' };
}

/** Projets pour le site public : mis en cache, rafraîchis à chaque publication (tag) ou au plus tard toutes les heures. */
export const getSiteProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      return (await readProjects()).projects;
    } catch (e) {
      console.error('[projects] lecture impossible, projets par défaut utilisés :', (e as Error).message);
      return DEFAULT_PROJECTS;
    }
  },
  ['vh-projects-v1'],
  { tags: [PROJECTS_TAG], revalidate: 3600 },
);

/** Publie une nouvelle version, supprime les médias retirés et purge les anciennes versions. */
export async function saveProjects(next: Project[]) {
  const previous = (await readProjects().catch(() => null))?.projects ?? [];
  const pathname = `${PREFIX}${String(Date.now()).padStart(15, '0')}.json`;
  await put(pathname, JSON.stringify(next), { access: 'public', contentType: 'application/json', cacheControlMaxAge: 60, addRandomSuffix: false });

  // Médias retirés de tous les projets → supprimés du stockage (uniquement les fichiers Blob).
  const urls = (ps: Project[]) => new Set(ps.flatMap((p) => p.media.flatMap((m) => [m.url, m.poster].filter(Boolean) as string[])));
  const keep = urls(next);
  const removed = [...urls(previous)].filter((u) => !keep.has(u) && u.includes('.blob.vercel-storage.com/'));
  if (removed.length) await del(removed).catch((e) => console.warn('[projects] suppression de médias échouée :', (e as Error).message));

  const versions = await listVersions();
  const old = versions.slice(KEEP_VERSIONS).map((v) => v.url);
  if (old.length) await del(old).catch((e) => console.warn('[projects] purge des versions échouée :', (e as Error).message));
  return { pathname, removedMedia: removed.length };
}
