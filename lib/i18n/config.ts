// Langues du site. Le français est la langue par défaut : il reste aux adresses d'origine (/, /mentions-legales…),
// l'anglais vit sous /en et le néerlandais (Belgique) sous /nl.

export const LOCALES = ['fr', 'en', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

/** Libellé court affiché dans le sélecteur de langue. */
export const LOCALE_LABEL: Record<Locale, string> = { fr: 'FR', en: 'EN', nl: 'NL' };
/** Nom complet de la langue (accessibilité). */
export const LOCALE_NAME: Record<Locale, string> = { fr: 'Français', en: 'English', nl: 'Nederlands' };
/** Code de langue HTML / hreflang. */
export const HTML_LANG: Record<Locale, string> = { fr: 'fr-BE', en: 'en', nl: 'nl-BE' };
/** Locale Open Graph. */
export const OG_LOCALE: Record<Locale, string> = { fr: 'fr_BE', en: 'en_GB', nl: 'nl_BE' };

export type PageKey = 'home' | 'legal' | 'privacy';

/** Adresse de chaque page dans chaque langue. */
export const PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en', nl: '/nl' },
  legal: { fr: '/mentions-legales', en: '/en/legal-notice', nl: '/nl/wettelijke-vermeldingen' },
  privacy: { fr: '/politique-de-confidentialite', en: '/en/privacy-policy', nl: '/nl/privacybeleid' },
};

/** Liens hreflang d'une page (pour les métadonnées). */
export function alternates(page: PageKey, locale: Locale) {
  return {
    canonical: PATHS[page][locale],
    languages: {
      'fr-BE': PATHS[page].fr,
      en: PATHS[page].en,
      'nl-BE': PATHS[page].nl,
      'x-default': PATHS[page].fr,
    },
  };
}
