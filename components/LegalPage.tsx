import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { PATHS, type Locale } from '@/lib/i18n/config';
import LangSwitch from './LangSwitch';
import { Logo } from './media';

/** Information à compléter — visible et repérable (rechercher « À COMPLÉTER » dans le code). */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="lg-todo">[À COMPLÉTER : {children}]</mark>;
}

/** Cadre des pages légales (mentions légales, confidentialité), dans la langue de la page. */
export function LegalPage({ locale, page, children }: { locale: Locale; page: 'legal' | 'privacy'; children: React.ReactNode }) {
  const t = getDict(locale), L = t.legal, home = PATHS.home[locale];
  return (
    <div className="lg">
      <header className="lg-hd">
        <Link href={home} aria-label={t.header.home} className="lg-logo">
          <Logo src="/logos/emkay.png" alt="EMKAY Partners" priority style={{ display: 'block', height: 30, width: 'auto' }} />
        </Link>
        <span style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <LangSwitch locale={locale} page={page} className="lg-lang" />
          <Link href={home} className="lg-back">{L.back}</Link>
        </span>
      </header>
      <section className="lg-hero">
        <span className="lbl" style={{ color: '#C9C2CF', letterSpacing: '.24em' }}>{page === 'legal' ? L.legalLabel : L.privacyLabel}</span>
        <h1 className="serif lg-h1">{page === 'legal' ? L.legalTitleA : L.privacyTitleA} <em>{page === 'legal' ? L.legalTitleB : L.privacyTitleB}</em></h1>
      </section>
      <main className="lg-body">
        {L.translationNote && <p className="lg-note">{L.translationNote}</p>}
        {children}
      </main>
      <footer className="lg-ft">
        <nav aria-label={L.nav} className="lg-ft-nav">
          <Link href={PATHS.legal[locale]}>{t.footer.legal}</Link>
          <Link href={PATHS.privacy[locale]}>{t.footer.privacy}</Link>
          <Link href={`${home === '/' ? '' : home}/#contact`}>{t.footer.contact}</Link>
        </nav>
        <Link href={home} className="btn-light" style={{ display: 'inline-block' }}>{L.backBtn}</Link>
        <span style={{ fontSize: 11, letterSpacing: '.2em', color: '#C9C2CF' }}>© {new Date().getFullYear()} EMKAY PARTNERS</span>
      </footer>
    </div>
  );
}
