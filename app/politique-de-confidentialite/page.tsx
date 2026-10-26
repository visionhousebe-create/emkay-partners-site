import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité d’EMKAY Partners : données collectées, finalités, destinataires, durée de conservation, cookies et droits (RGPD).',
  alternates: { canonical: '/politique-de-confidentialite' },
};

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function Confidentialite() {
  return (
    <LegalPage label="DONNÉES PERSONNELLES" title={<>Politique de <em>confidentialité.</em></>}>
      <p>EMKAY Partners attache de l’importance à la protection de vos données personnelles. Cette politique explique quelles données sont collectées via ce site, pourquoi, combien de temps elles sont conservées et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD, règlement (UE) 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l’égard des traitements de données à caractère personnel.</p>

      <h2>1. Responsable du traitement</h2>
      <dl className="lg-dl">
        <dt>Responsable</dt><dd>EMKAY PARTNERS SRL</dd>
        <dt>Siège social</dt><dd>Avenue des Gerfauts 10, boîte 34<br />1170 Watermael-Boitsfort, Belgique</dd>
        <dt>Numéro d’entreprise (BCE)</dt><dd>1024.829.348</dd>
        <dt>Contact vie privée</dt><dd><Mail /></dd>
      </dl>
      <p>Ce traitement couvre EMKAY Partners et les marques qu’elle développe et exploite, présentées sur ce site : Vision House, Overton, Orizon Connect, Bavare et Viens Manger. Pour toute question relative à vos données, écrivez à <Mail />.</p>

      <h2>2. Données collectées</h2>
      <p><strong>Lorsque vous remplissez un formulaire de contact</strong>, nous collectons uniquement les informations que vous choisissez de nous transmettre :</p>
      <ul>
        <li>votre nom et votre adresse e-mail (obligatoires pour pouvoir vous répondre) ;</li>
        <li>selon le formulaire : votre entreprise ou organisation, votre numéro de téléphone, le type de projet ou de collaboration et un budget indicatif (facultatifs, sauf l’organisation dans le formulaire « Je veux collaborer ») ;</li>
        <li>le contenu de votre message.</li>
      </ul>
      <p>Merci de ne pas transmettre de données sensibles (santé, opinions politiques ou religieuses, etc.) dans vos messages : elles ne sont pas nécessaires pour traiter votre demande.</p>
      <p><strong>Lors de toute visite</strong>, l’hébergeur enregistre automatiquement des journaux techniques (adresse IP, date et heure, page demandée, type de navigateur) nécessaires au fonctionnement et à la sécurité du site.</p>
      <p>Nous ne collectons aucune donnée via des réseaux sociaux, ne réalisons aucun profilage et ne prenons aucune décision automatisée produisant des effets juridiques à votre égard.</p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li><strong>Répondre à votre demande</strong> et assurer le suivi d’un éventuel projet, d’une collaboration ou d’un échange. Base légale : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD) et intérêt légitime d’EMKAY Partners à répondre aux personnes qui la contactent (article 6.1.f).</li>
        <li><strong>Sécurité et bon fonctionnement du site</strong> (journaux techniques, protection contre les envois automatisés et le spam). Base légale : intérêt légitime (article 6.1.f).</li>
        <li><strong>Respect de nos obligations légales</strong>, le cas échéant (par exemple comptables, si votre demande aboutit à un contrat). Base légale : obligation légale (article 6.1.c).</li>
      </ul>
      <p>Vos données ne sont jamais vendues, louées ni cédées. Elles ne sont pas utilisées à des fins de prospection commerciale sans votre consentement préalable.</p>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>Vos données sont accessibles uniquement aux personnes d’EMKAY Partners et des marques qu’elle exploite chargées de traiter votre demande. Elles transitent par des prestataires techniques qui agissent pour notre compte, sur nos instructions, dans le cadre d’engagements de confidentialité et de sécurité (article 28 du RGPD) :</p>
      <ul>
        <li>hébergement du site : Vercel Inc. (États-Unis) ;</li>
        <li>réception des messages du formulaire : Formspree, Inc. (États-Unis), qui nous transmet les messages par e-mail.</li>
      </ul>
      <p>Vos données peuvent également être communiquées aux autorités lorsque la loi l’impose.</p>

      <h2>5. Transferts hors de l’Union européenne</h2>
      <p>Les prestataires ci-dessus étant établis aux États-Unis, certaines données peuvent y être transférées. Ces transferts sont encadrés par les garanties prévues aux articles 45 et 46 du RGPD : décision d’adéquation de la Commission européenne (EU-U.S. Data Privacy Framework) ou clauses contractuelles types, selon le prestataire. Vous pouvez obtenir des informations sur ces garanties en écrivant à <Mail />.</p>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>Messages reçus via le formulaire : 30 jours, puis suppression, sauf si un échange, un projet ou une relation contractuelle en cours nécessite de les conserver plus longtemps (dans ce cas, pendant la durée de la relation, puis pendant les délais légaux applicables).</li>
        <li>Journaux techniques : selon la politique de l’hébergeur, pour une durée limitée.</li>
      </ul>

      <h2>7. Sécurité</h2>
      <p>Le site est accessible exclusivement en connexion chiffrée (HTTPS). Les formulaires sont protégés contre les envois automatisés et l’accès aux messages reçus est limité aux personnes qui en ont besoin. Aucune transmission sur Internet n’étant totalement sûre, nous vous invitons à ne communiquer que les informations nécessaires à votre demande.</p>

      <h2>8. Cookies et mesure d’audience</h2>
      <p>À ce jour, ce site ne dépose aucun cookie publicitaire, de réseau social ni de mesure d’audience, et n’utilise aucun traceur nécessitant votre consentement. Les polices de caractères et les images sont servies directement par le site, sans appel à un service tiers.</p>
      <p>Si une vidéo hébergée par un service tiers (YouTube ou Vimeo) est intégrée à la présentation d’un projet, elle n’est chargée qu’à l’ouverture de cette présentation ; ce service peut alors traiter certaines données selon sa propre politique de confidentialité. Les vidéos YouTube sont intégrées en mode de confidentialité renforcée.</p>
      <p>Si un outil de mesure d’audience ou un autre traceur est ajouté, cette politique sera mise à jour et votre consentement sera demandé au préalable lorsque la loi l’exige.</p>

      <h2>9. Liens externes</h2>
      <p>Ce site contient des liens vers des services tiers (par exemple LinkedIn ou la billetterie Passpass). Lorsque vous les suivez, ces services traitent vos données selon leur propre politique de confidentialité, sous leur seule responsabilité.</p>

      <h2>10. Vos droits</h2>
      <p>Conformément aux articles 15 à 21 du RGPD, vous disposez à tout moment :</p>
      <ul>
        <li>d’un droit d’accès à vos données et d’en obtenir une copie ;</li>
        <li>d’un droit de rectification des données inexactes ou incomplètes ;</li>
        <li>d’un droit à l’effacement de vos données ;</li>
        <li>d’un droit à la limitation du traitement ;</li>
        <li>d’un droit d’opposition au traitement fondé sur notre intérêt légitime ;</li>
        <li>d’un droit à la portabilité des données que vous nous avez fournies ;</li>
        <li>du droit de retirer votre consentement à tout moment, lorsque le traitement repose sur celui-ci.</li>
      </ul>
      <p>Pour exercer ces droits, écrivez à <Mail /> en précisant votre demande. Si nous avons un doute raisonnable sur votre identité, nous pourrons vous demander une information complémentaire pour la vérifier. Une réponse vous sera apportée dans un délai d’un mois à compter de la réception de votre demande ; ce délai peut être prolongé de deux mois en cas de demande complexe, auquel cas vous en serez informé. L’exercice de ces droits est gratuit.</p>

      <h2>11. Réclamation</h2>
      <p>Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez nous contacter en priorité à <Mail />. Vous avez également le droit d’introduire une réclamation auprès de l’Autorité de protection des données (APD), rue de la Presse 35, 1000 Bruxelles, <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>.</p>

      <h2>12. Mineurs</h2>
      <p>Ce site et ses formulaires s’adressent à un public adulte et professionnel. Les personnes de moins de 13 ans ne doivent pas nous transmettre de données personnelles sans l’accord de leurs parents ou représentants légaux.</p>

      <h2>13. Modifications</h2>
      <p>Cette politique peut évoluer, notamment en cas de changement de prestataire, de nom d’une marque ou de fonctionnalité du site. La version applicable est celle publiée sur cette page au moment de votre visite.</p>
    </LegalPage>
  );
}
