import type { Metadata } from 'next';
import { LegalPage, Todo } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site EMKAY Partners.',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegales() {
  return (
    <LegalPage label="INFORMATIONS LÉGALES" title={<>Mentions <em>légales.</em></>} updated={<Todo>date</Todo>}>
      <h2>Éditeur du site</h2>
      <p>Le présent site est édité par :</p>
      <dl className="lg-dl">
        <dt>Dénomination sociale</dt><dd><Todo>dénomination sociale exacte</Todo></dd>
        <dt>Forme juridique</dt><dd><Todo>forme juridique (SRL, SA…)</Todo></dd>
        <dt>Siège social</dt><dd><Todo>adresse complète</Todo></dd>
        <dt>Numéro d’entreprise (BCE)</dt><dd><Todo>numéro BCE</Todo></dd>
        <dt>Numéro de TVA</dt><dd><Todo>numéro de TVA</Todo></dd>
        <dt>E-mail</dt><dd><Todo>adresse e-mail de contact</Todo></dd>
        <dt>Téléphone</dt><dd><Todo>numéro de téléphone</Todo></dd>
        <dt>Responsable de la publication</dt><dd><Todo>nom et fonction</Todo></dd>
      </dl>
      <p>Ci-après « EMKAY Partners ».</p>

      <h2>Hébergement</h2>
      <dl className="lg-dl">
        <dt>Hébergeur</dt><dd><Todo>nom, adresse et site de l’hébergeur</Todo></dd>
      </dl>

      <h2>Objet du site</h2>
      <p>Ce site présente EMKAY Partners ainsi que les marques développées et exploitées par EMKAY Partners, dans les domaines de la communication, de l’événementiel, des rencontres professionnelles, des sorties et des découvertes culinaires. Il permet de prendre contact avec EMKAY Partners et ses marques.</p>

      <h2>Propriété intellectuelle</h2>
      <p>L’ensemble des éléments de ce site — textes, logos, marques, photographies, vidéos, éléments graphiques et code — est la propriété d’EMKAY Partners ou des marques développées et exploitées par EMKAY Partners, ou fait l’objet d’une autorisation d’utilisation. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
      <p>Les photographies et contenus présentant des projets réalisés pour des tiers restent, le cas échéant, la propriété de leurs auteurs ou de leurs clients respectifs.</p>

      <h2>Responsabilité</h2>
      <p>EMKAY Partners s’efforce de fournir des informations exactes et à jour, sans pouvoir en garantir l’exhaustivité. EMKAY Partners ne saurait être tenue responsable d’une indisponibilité temporaire du site ni du contenu des sites externes vers lesquels il renvoie.</p>

      <h2>Données personnelles</h2>
      <p>Le traitement des données transmises via les formulaires de contact est décrit dans la <a href="/politique-de-confidentialite">politique de confidentialité</a>.</p>

      <h2>Droit applicable</h2>
      <p>Le présent site et ses mentions légales sont soumis au droit belge. Tout litige relève de la compétence des juridictions de <Todo>arrondissement judiciaire (ex. Bruxelles)</Todo>.</p>
    </LegalPage>
  );
}
