// Lecture des projets Vision House depuis les dossiers public/vision-house/<NN-nom>/ (au moment du build, serveur uniquement).
//
// Chaque dossier contient :
//   projet.txt          les textes (voir LISEZ-MOI.md) ;
//   photos / vidéos     .jpg .jpeg .png .webp .avif / .mp4 .webm .mov, affichés par ordre alphabétique ;
//   couverture.*        (facultatif) force le média de couverture ;
//   <video>.jpg         (facultatif) image d'aperçu d'une vidéo portant le même nom.
// L'ordre des projets suit le nom des dossiers (01-…, 02-…).

import fs from 'node:fs';
import path from 'node:path';
import type { Project, ProjectFormat, ProjectMedia } from './projects';

const ROOT = path.join(process.cwd(), 'public', 'vision-house');
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;

const FORMATS: Record<string, ProjectFormat> = {
  paysage: '16/9', '16:9': '16/9', '16/9': '16/9', horizontal: '16/9',
  portrait: '4/5', '4:5': '4/5', '4/5': '4/5',
  carre: '1/1', 'carré': '1/1', '1:1': '1/1', '1/1': '1/1',
  vertical: '9/16', verticale: '9/16', '9:16': '9/16', '9/16': '9/16',
};

/** Clé normalisée : minuscules, sans accents ni espaces (« Année » → « annee »). */
const key = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const base = (f: string) => f.replace(/\.[^.]+$/, '');
const fileUrl = (dir: string, file: string) => `/vision-house/${encodeURIComponent(dir)}/${encodeURIComponent(file)}`;

/** Lien YouTube / Vimeo → adresse du lecteur intégré ; URL directe https .mp4/.webm → vidéo ; sinon null. */
export function parseVideoLink(raw: string): ProjectMedia | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  const host = u.hostname.replace(/^www\.|^m\./, '');
  let yt = '';
  if (host === 'youtu.be') yt = u.pathname.slice(1);
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') yt = u.searchParams.get('v') || u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1] || '';
  if (/^[A-Za-z0-9_-]{6,20}$/.test(yt)) return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${yt}?rel=0` };
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.match(/(\d{5,12})/)?.[1];
    if (id) return { type: 'embed', url: `https://player.vimeo.com/video/${id}` };
  }
  if (VIDEO.test(u.pathname)) return { type: 'video', url: u.href };
  return null;
}

/** Analyse projet.txt : lignes « clé: valeur », puis --- et la description. */
function parseText(txt: string) {
  const [head, ...rest] = txt.replace(/^﻿/, '').split(/^\s*-{3,}\s*$/m);
  const fields: Record<string, string> = {};
  const videos: string[] = [];
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^\s*([^:#]+?)\s*:\s*(.*)$/);
    if (!m) continue;
    const k = key(m[1]), v = m[2].trim();
    if (k === 'video' || k === 'lienvideo') { if (v) videos.push(v); }
    else fields[k] = v;
  }
  // Plusieurs lignes --- (ex. modèle déjà terminé par ---) : on garde simplement les blocs de texte non vides.
  return { fields, videos, description: rest.map((b) => b.trim()).filter(Boolean).join('\n\n') };
}

export function readProjectsFromFiles(): Project[] {
  let dirs: string[];
  try {
    dirs = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('.')).map((d) => d.name).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
  } catch {
    return [];
  }
  return dirs.flatMap((dir): Project[] => {
    const abs = path.join(ROOT, dir);
    const files = fs.readdirSync(abs).filter((f) => !f.startsWith('.')).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
    const txtFile = files.find((f) => key(f) === 'projettxt');
    if (!txtFile) {
      console.warn(`[vision-house] ${dir} : pas de projet.txt, dossier ignoré`);
      return [];
    }
    const { fields: f, videos, description } = parseText(fs.readFileSync(path.join(abs, txtFile), 'utf8'));
    if (/^(non|no|false|0)$/i.test(f.visible || '')) return [];

    const videoBases = new Set(files.filter((x) => VIDEO.test(x)).map(base));
    const posters = new Map(files.filter((x) => IMAGE.test(x) && videoBases.has(base(x))).map((x) => [base(x), fileUrl(dir, x)]));
    const media: ProjectMedia[] = files.flatMap((x): ProjectMedia[] => {
      if (VIDEO.test(x)) return [{ type: 'video', url: fileUrl(dir, x), ...(posters.has(base(x)) ? { poster: posters.get(base(x)) } : {}) }];
      if (IMAGE.test(x) && !videoBases.has(base(x))) return [{ type: 'image', url: fileUrl(dir, x) }];
      return [];
    });
    const ci = media.findIndex((m) => key(base(decodeURIComponent(m.url.split('/').pop() || ''))) === 'couverture');
    if (ci > 0) media.unshift(...media.splice(ci, 1));
    for (const v of videos) {
      const m = parseVideoLink(v);
      if (m) media.push(m);
      else console.warn(`[vision-house] ${dir} : lien vidéo non reconnu « ${v} »`);
    }

    const client = f.client || f.marque || dir.replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ');
    return [{
      id: dir.replace(/[^a-z0-9-]/gi, '-').toLowerCase(),
      client,
      sector: f.secteur || '',
      location: f.lieu || f.ville || '',
      title: f.realisation || f.resultat || f.titre || '',
      description,
      year: f.annee || '',
      services: (f.services || '').split(/[,·]/).map((s) => s.trim()).filter(Boolean),
      format: FORMATS[key(f.format || '')] || FORMATS[(f.format || '').trim()] || '16/9',
      media,
      published: true,
    }];
  });
}
