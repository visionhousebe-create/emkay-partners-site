'use client';

import { HTML_LANG, LOCALES, LOCALE_LABEL, LOCALE_NAME, PATHS, type Locale, type PageKey } from '@/lib/i18n/config';

/**
 * Sélecteur de langue FR · EN · NL. Chaque langue a sa propre adresse (/, /en, /nl…) :
 * on change donc de page. Sur l'accueil, `keepHash` conserve la section en cours (#overton…).
 */
export default function LangSwitch({ locale, page, keepHash, className, style, full }: { locale: Locale; page: PageKey; keepHash?: boolean; className?: string; style?: React.CSSProperties; full?: boolean }) {
  return (
    <nav aria-label="Langue · Language · Taal" className={`lang${className ? ' ' + className : ''}`} style={style}>
      {LOCALES.map((l) => {
        const href = PATHS[page][l];
        return (
          <a
            key={l}
            href={href}
            hrefLang={HTML_LANG[l]}
            lang={HTML_LANG[l]}
            aria-label={LOCALE_NAME[l]}
            aria-current={l === locale ? 'page' : undefined}
            className={l === locale ? 'on' : undefined}
            onClick={keepHash ? (e) => { if (location.hash) e.currentTarget.href = href + location.hash; } : undefined}
          >
            {full ? LOCALE_NAME[l] : LOCALE_LABEL[l]}
          </a>
        );
      })}
    </nav>
  );
}
