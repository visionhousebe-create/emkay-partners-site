import { en } from './en';
import { fr, type Dict } from './fr';
import { nl } from './nl';
import type { Locale } from './config';

export const DICTS: Record<Locale, Dict> = { fr, en, nl };
export const getDict = (l: Locale): Dict => DICTS[l];
export type { Dict };
export * from './config';
