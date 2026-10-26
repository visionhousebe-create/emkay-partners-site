import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site EMKAY Partners : éditeur, hébergement, propriété intellectuelle, responsabilité et droit applicable.',
  alternates: { canonical: '/mentions-legales' },
};

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function MentionsLegales() {
  return (
    <LegalPage label="INFORMATIONS LÉGALES" title={<>Mentions <em>légales.</em></>}>
      <p>Les présentes mentions légales sont publiées conformément au Code de droit économique belge (notamment ses articles III.25 et XII.6) et au Code des sociétés et des associations (article 2:20). En naviguant sur ce site, vous en acceptez les conditions.</p>

      <h2>1. Éditeur du site</h2>
      <p>Le site accessible à l’adresse www.emkaypartners.com est édité par :</p>
      <dl className="lg-dl">
        <dt>Dénomination sociale</dt><dd>EMKAY PARTNERS</dd>
        <dt>Forme juridique</dt><dd>Société à responsabilité limitée (SRL)</dd>
        <dt>Siège social</dt><dd>Avenue des Gerfauts 10, boîte 34<br />1170 Watermael-Boitsfort, Belgique</dd>
        <dt>Numéro d’entreprise (BCE)</dt><dd>1024.829.348 · RPM Bruxelles</dd>
        <dt>Numéro de TVA</dt><dd>BE 1024.829.348</dd>
        <dt>E-mail</dt><dd><Mail /></dd>
      </dl>
      <p>Ci-après « EMKAY Partners ».</p>

      <h2>2. Hébergement</h2>
      <dl className="lg-dl">
        <dt>Hébergeur</dt><dd>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis, <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></dd>
      </dl>

      <h2>3. Objet du site</h2>
      <p>Ce site présente EMKAY Partners ainsi que les marques développées et exploitées par EMKAY Partners : Vision House (communication et stratégie), Overton (événements et expériences), Orizon Connect (rencontres professionnelles), Bavare (événements sociaux) et Viens Manger (food et découvertes). Il permet de prendre contact avec EMKAY Partners et ses marques.</p>
      <p>Les informations publiées sur ce site sont fournies à titre informatif. Elles ne constituent pas une offre contractuelle : toute prestation fait l’objet d’un devis ou d’un accord écrit distinct.</p>

      <h2>4. Propriété intellectuelle</h2>
      <p>La structure du site ainsi que l’ensemble de ses éléments (textes, logos, noms de marques, photographies, vidéos, éléments graphiques, mise en page et code) sont protégés par le droit d’auteur, le droit des marques et, plus généralement, par le droit de la propriété intellectuelle (Livre XI du Code de droit économique et Convention Benelux en matière de propriété intellectuelle).</p>
      <p>Ces éléments sont la propriété d’EMKAY Partners ou des marques qu’elle développe et exploite, ou font l’objet d’une autorisation d’utilisation. Toute reproduction, représentation, adaptation, extraction ou exploitation, totale ou partielle, par quelque procédé que ce soit, sans l’autorisation écrite préalable d’EMKAY Partners, est interdite et peut donner lieu à des poursuites.</p>
      <p>Les photographies, vidéos et contenus présentant des projets réalisés pour des tiers restent, le cas échéant, la propriété de leurs auteurs ou de leurs clients respectifs. Ils sont présentés uniquement à titre de références ; tout ayant droit peut en demander le retrait à l’adresse <Mail />.</p>

      <h2>5. Liens hypertextes</h2>
      <p>Ce site contient des liens vers des sites et services externes (par exemple LinkedIn ou la billetterie Passpass). EMKAY Partners n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité et leurs pratiques en matière de données personnelles.</p>
      <p>La création d’un lien vers ce site est autorisée, à condition qu’il ouvre la page dans une nouvelle fenêtre ou un nouvel onglet, sans l’intégrer dans un cadre (« framing ») et sans laisser croire à un partenariat qui n’existe pas. EMKAY Partners peut demander la suppression d’un lien à tout moment.</p>

      <h2>6. Responsabilité</h2>
      <p>EMKAY Partners met tout en œuvre pour fournir des informations exactes et à jour, sans pouvoir en garantir l’exhaustivité ni l’absence d’erreurs. Les informations peuvent être modifiées à tout moment, sans préavis.</p>
      <p>EMKAY Partners s’efforce d’assurer l’accès au site en permanence, mais ne peut être tenue responsable d’une interruption, d’une indisponibilité temporaire, d’un dysfonctionnement ou d’un dommage résultant de l’utilisation du site, notamment d’un virus ou d’une intrusion informatique, dans les limites autorisées par la loi.</p>

      <h2>7. Données personnelles et cookies</h2>
      <p>Le traitement des données transmises via les formulaires de contact, ainsi que l’usage des cookies, sont décrits dans la <a href="/politique-de-confidentialite">politique de confidentialité</a>.</p>

      <h2>8. Signaler un contenu</h2>
      <p>Pour signaler un contenu inexact, illicite ou portant atteinte à vos droits, écrivez à <Mail /> en précisant l’adresse de la page concernée et la nature du problème. Nous traiterons votre demande dans les meilleurs délais.</p>

      <h2>9. Droit applicable et litiges</h2>
      <p>Le présent site et ses mentions légales sont soumis au droit belge. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les juridictions de l’arrondissement judiciaire de Bruxelles sont seules compétentes, sans préjudice des règles impératives de protection des consommateurs.</p>
    </LegalPage>
  );
}
