'use client';

import { createContext, useContext } from 'react';
import { DICTS, type Dict, type Locale } from '@/lib/i18n';

const Ctx = createContext<{ locale: Locale; t: Dict }>({ locale: 'fr', t: DICTS.fr });

/** Fournit la langue courante et ses textes à tous les composants du site. */
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, t: DICTS[locale] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
