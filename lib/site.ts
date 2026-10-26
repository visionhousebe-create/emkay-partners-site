// Domaine canonique validé : www.emkaypartners.com (emkaypartners.com sans www redirige vers lui, côté Vercel).
export const CANONICAL_URL = 'https://www.emkaypartners.com';

// NEXT_PUBLIC_SITE_URL permet de surcharger l'URL si besoin.
// Production Vercel → domaine canonique. Preview → URL du déploiement. Local → localhost.
const vercelEnv = process.env.VERCEL_ENV;
const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelEnv === 'production' ? CANONICAL_URL : deploymentUrl)
).replace(/\/+$/, '');

/** Seule la production est indexable ; les Previews Vercel restent hors des moteurs de recherche. */
export const INDEXABLE = vercelEnv ? vercelEnv === 'production' : process.env.NODE_ENV === 'production';

export const SITE_NAME = 'EMKAY Partners';
export const SITE_TITLE = 'EMKAY Partners | Marques, événements & expériences';
export const SITE_DESCRIPTION = 'EMKAY Partners développe des marques dans la communication, l’événementiel, les rencontres et les expériences depuis Bruxelles.';

/** Adresse de contact officielle (mentions légales, confidentialité). */
export const CONTACT_EMAIL = 'office@emkaypartners.com';
