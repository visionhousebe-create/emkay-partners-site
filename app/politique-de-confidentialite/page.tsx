import type { Metadata } from 'next';
import { LegalPage, Todo } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles du site EMKAY Partners.',
  alternates: { canonical: '/politique-de-confidentialite' },
};

export default function Confidentialite() {
  return (
    <LegalPage label="DONNÉES PERSONNELLES" title={<>Politique de <em>confidentialité.</em></>} updated={<Todo>date</Todo>}>
      <p>EMKAY Partners attache de l’importance à la protection de vos données personnelles. Cette politique explique quelles données sont collectées via ce site, pourquoi, et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD — règlement (UE) 2016/679) et à la législation belge.</p>

      <h2>Responsable du traitement</h2>
      <dl className="lg-dl">
        <dt>Responsable</dt><dd><Todo>dénomination sociale exacte et forme juridique</Todo></dd>
        <dt>Adresse</dt><dd><Todo>adresse du siège</Todo></dd>
        <dt>Numéro d’entreprise (BCE)</dt><dd><Todo>numéro BCE</Todo></dd>
        <dt>Contact vie privée</dt><dd><Todo>adresse e-mail dédiée aux demandes RGPD</Todo></dd>
      </dl>
      <p>Le traitement couvre EMKAY Partners et les marques développées et exploitées par EMKAY Partners présentées sur ce site.</p>

      <h2>Données collectées</h2>
      <p>Uniquement lorsque vous remplissez un formulaire de contact :</p>
      <ul>
        <li>nom ;</li>
        <li>adresse e-mail ;</li>
        <li>le cas échéant : entreprise ou organisation, numéro de téléphone, type de projet ou de collaboration, budget indicatif ;</li>
        <li>le contenu de votre message.</li>
      </ul>
      <p>Lors de toute visite, l’hébergeur enregistre des journaux techniques (adresse IP, date, page demandée, navigateur) nécessaires au fonctionnement et à la sécurité du site.</p>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li><strong>Répondre à votre demande</strong> et assurer le suivi d’un éventuel projet, d’une collaboration ou d’un échange — base légale : mesures précontractuelles prises à votre demande et intérêt légitime d’EMKAY Partners à répondre aux personnes qui la contactent.</li>
        <li><strong>Sécurité et bon fonctionnement du site</strong> (journaux techniques, protection contre les envois automatisés) — base légale : intérêt légitime.</li>
      </ul>
      <p>Vos données ne sont jamais vendues ni utilisées à des fins de prospection sans votre accord.</p>

      <h2>Destinataires</h2>
      <p>Les données sont destinées aux personnes d’EMKAY Partners et des marques développées et exploitées par EMKAY Partners chargées de traiter votre demande. Elles transitent par des prestataires techniques agissant pour notre compte :</p>
      <ul>
        <li>hébergement du site : <Todo>nom de l’hébergeur et pays</Todo> ;</li>
        <li>réception des messages : <Todo>outil utilisé (ex. messagerie, Make, n8n, Zapier, Slack) et pays</Todo>.</li>
      </ul>
      <p>Lorsque certains prestataires sont établis hors de l’Union européenne, les transferts sont encadrés par les garanties prévues par le RGPD (décision d’adéquation ou clauses contractuelles types). <Todo>à confirmer selon les prestataires retenus</Todo></p>

      <h2>Durée de conservation</h2>
      <p>Les messages reçus via le formulaire sont conservés <Todo>durée (ex. 3 ans après le dernier échange)</Todo>, puis supprimés, sauf relation contractuelle en cours. Les journaux techniques sont conservés selon la politique de l’hébergeur.</p>

      <h2>Cookies et mesure d’audience</h2>
      <p>À ce jour, ce site ne dépose aucun cookie publicitaire ni de mesure d’audience. Les polices de caractères sont servies directement par le site, sans appel à un service tiers. Si un outil de mesure d’audience est ajouté, cette politique sera mise à jour et votre consentement sera demandé lorsque la loi l’exige.</p>

      <h2>Vos droits</h2>
      <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données. Pour les exercer, écrivez à <Todo>adresse e-mail de contact vie privée</Todo> en précisant votre demande. Une réponse vous sera apportée dans un délai d’un mois.</p>
      <p>Vous pouvez également introduire une réclamation auprès de l’Autorité de protection des données (APD), rue de la Presse 35, 1000 Bruxelles — <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>.</p>

      <h2>Modifications</h2>
      <p>Cette politique peut évoluer, notamment en cas de changement de nom d’une marque, de prestataire ou de fonctionnalité du site. La date de dernière mise à jour figure en haut de cette page.</p>
    </LegalPage>
  );
}
