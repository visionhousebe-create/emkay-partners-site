import type { Metadata, Viewport } from 'next';
import { getDict } from './i18n';
import { alternates, LOCALES, OG_LOCALE, PATHS, type Locale } from './i18n/config';
import { INDEXABLE, SITE_NAME, SITE_URL } from './site';

export const viewport: Viewport = { themeColor: '#2B143D', width: 'device-width', initialScale: 1 };

/** Métadonnées communes à toutes les pages d'une langue (posées par le layout racine de la langue). */
export function layoutMetadata(locale: Locale): Metadata {
  const t = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s | ${SITE_NAME}` },
    description: t.meta.description,
    applicationName: SITE_NAME,
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: PATHS.home[locale],
      siteName: SITE_NAME,
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: { card: 'summary_large_image', title: t.meta.title, description: t.meta.description },
  };
}

/** Accueil : adresse canonique + versions dans les autres langues. */
export function homeMetadata(locale: Locale): Metadata {
  return { alternates: alternates('home', locale) };
}

/** Pages légales : titre, description et versions dans les autres langues. */
export function legalMetadata(locale: Locale, page: 'legal' | 'privacy'): Metadata {
  const L = getDict(locale).legal;
  return {
    title: page === 'legal' ? L.legalMetaTitle : L.privacyMetaTitle,
    description: page === 'legal' ? L.legalMetaDesc : L.privacyMetaDesc,
    alternates: alternates(page, locale),
  };
}
