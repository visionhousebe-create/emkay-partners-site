import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], style: ['normal', 'italic'], variable: '--font-archivo', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'EMKAY Partners — Une maison. Des univers bien à eux.',
  description: 'EMKAY Partners, structure entrepreneuriale bruxelloise : Vision House, Nexplore, Nexplore Connect, Bavare et Viens Manger.',
};

export const viewport: Viewport = { themeColor: '#2B143D', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
