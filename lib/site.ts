// URL publique du site. En production : définir NEXT_PUBLIC_SITE_URL (ex. https://www.domaine.be) = domaine canonique.
// À défaut : URL de production Vercel, puis URL du déploiement en cours, puis localhost.
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (fromVercel ? `https://${fromVercel}` : 'http://localhost:3000')
).replace(/\/+$/, '');

/** Seule la production est indexable ; les Previews Vercel restent hors des moteurs de recherche. */
export const INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production';

export const SITE_NAME = 'EMKAY Partners';
export const SITE_TITLE = 'EMKAY Partners — Marques, événements & expériences';
export const SITE_DESCRIPTION = 'EMKAY Partners développe des marques dans la communication, l’événementiel, les rencontres et les expériences depuis Bruxelles.';
