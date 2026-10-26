import Link from 'next/link';
import { Logo } from './media';

/** Information à compléter — visible et repérable (rechercher « À COMPLÉTER » dans le code). */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="lg-todo">[À COMPLÉTER : {children}]</mark>;
}

export function LegalPage({ label, title, children }: { label: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="lg">
      <header className="lg-hd">
        <Link href="/" aria-label="EMKAY Partners, accueil" className="lg-logo">
          <Logo src="/logos/emkay.png" alt="EMKAY Partners" priority style={{ display: 'block', height: 30, width: 'auto' }} />
        </Link>
        <Link href="/" className="lg-back">← RETOUR À L’ACCUEIL</Link>
      </header>
      <section className="lg-hero">
        <span className="lbl" style={{ color: '#C9C2CF', letterSpacing: '.24em' }}>{label}</span>
        <h1 className="serif lg-h1">{title}</h1>
      </section>
      <main className="lg-body">{children}</main>
      <footer className="lg-ft">
        <nav aria-label="Informations légales" className="lg-ft-nav">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <Link href="/" className="btn-light" style={{ display: 'inline-block' }}>RETOUR À L’ACCUEIL ↗︎</Link>
        <span style={{ fontSize: 11, letterSpacing: '.2em', color: '#C9C2CF' }}>© {new Date().getFullYear()} EMKAY PARTNERS</span>
      </footer>
    </div>
  );
}
