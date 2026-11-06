import type { Metadata } from 'next';
import RootDocument from '@/components/RootDocument';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: 'Page introuvable | EMKAY Partners', robots: { index: false } };

/** Page 404 commune aux trois langues (le site a une mise en page racine par langue). */
export default function GlobalNotFound() {
  return (
    <RootDocument locale="fr">
      <main className="nf">
        <span className="lbl">404</span>
        <h1 className="serif">Page introuvable.<br /><em>Page not found · Pagina niet gevonden.</em></h1>
        <nav className="lang nf-links">
          <a href="/">ACCUEIL</a><a href="/en" lang="en">HOME</a><a href="/nl" lang="nl-BE">HOME</a>
        </nav>
      </main>
    </RootDocument>
  );
}
