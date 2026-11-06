import { Archivo, Instrument_Serif } from 'next/font/google';
import { HTML_LANG, type Locale } from '@/lib/i18n/config';
import '../app/globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], style: ['normal', 'italic'], variable: '--font-archivo', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });

/** Document HTML commun aux trois langues ; seul l'attribut lang change. */
export default function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG[locale]} className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
