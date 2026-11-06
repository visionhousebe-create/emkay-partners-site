import type { MetadataRoute } from 'next';
import { LOCALES, PATHS, type PageKey } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/site';

// Chaque page existe en français (par défaut), en anglais et en néerlandais ; chacune déclare ses équivalents.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { key: PageKey; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
    { key: 'home', priority: 1, changeFrequency: 'monthly' },
    { key: 'legal', priority: 0.2, changeFrequency: 'yearly' },
    { key: 'privacy', priority: 0.2, changeFrequency: 'yearly' },
  ];
  const abs = (p: string) => `${SITE_URL}${p === '/' ? '/' : p}`;
  return pages.flatMap(({ key, priority, changeFrequency }) =>
    LOCALES.map((l) => ({
      url: abs(PATHS[key][l]),
      lastModified: now,
      changeFrequency,
      priority: l === 'fr' ? priority : priority * 0.9,
      alternates: { languages: { 'fr-BE': abs(PATHS[key].fr), en: abs(PATHS[key].en), 'nl-BE': abs(PATHS[key].nl) } },
    })),
  );
}
