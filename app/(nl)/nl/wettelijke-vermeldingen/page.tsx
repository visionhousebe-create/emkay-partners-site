import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';
import { legalMetadata } from '@/lib/meta';
import { PATHS } from '@/lib/i18n/config';

export const metadata: Metadata = legalMetadata('nl', 'legal');

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function WettelijkeVermeldingen() {
  return (
    <LegalPage locale="nl" page="legal">
      <p>Deze wettelijke vermeldingen worden gepubliceerd overeenkomstig het Belgische Wetboek van economisch recht (in het bijzonder de artikelen III.25 en XII.6) en het Wetboek van vennootschappen en verenigingen (artikel 2:20). Door deze website te bezoeken, aanvaardt u de voorwaarden ervan.</p>

      <h2>1. Uitgever van de website</h2>
      <p>De website op het adres www.emkaypartners.com wordt uitgegeven door:</p>
      <dl className="lg-dl">
        <dt>Maatschappelijke naam</dt><dd>EMKAY PARTNERS</dd>
        <dt>Rechtsvorm</dt><dd>Besloten vennootschap (SRL / BV)</dd>
        <dt>Maatschappelijke zetel</dt><dd>Avenue des Gerfauts 10, bus 34<br />1170 Watermaal-Bosvoorde, België</dd>
        <dt>Ondernemingsnummer (KBO)</dt><dd>1024.829.348 · RPR Brussel</dd>
        <dt>Btw-nummer</dt><dd>BE 1024.829.348</dd>
        <dt>E-mail</dt><dd><Mail /></dd>
      </dl>
      <p>Hierna „EMKAY Partners” genoemd.</p>

      <h2>2. Hosting</h2>
      <dl className="lg-dl">
        <dt>Hostingprovider</dt><dd>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Verenigde Staten, <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></dd>
      </dl>

      <h2>3. Doel van de website</h2>
      <p>Deze website stelt EMKAY Partners voor, evenals de merken die EMKAY Partners ontwikkelt en uitbaat: Vision House (communicatie en strategie), Overton (evenementen en belevingen), Orizon Connect (zakelijke ontmoetingen), Bavare (sociale evenementen) en Viens Manger (food en ontdekkingen). Via de website kunt u contact opnemen met EMKAY Partners en zijn merken.</p>
      <p>De informatie op deze website wordt ter informatie verstrekt. Ze vormt geen contractueel aanbod: voor elke dienst wordt een afzonderlijke offerte of schriftelijke overeenkomst opgesteld.</p>

      <h2>4. Intellectuele eigendom</h2>
      <p>De structuur van de website en alle onderdelen ervan (teksten, logo’s, merknamen, foto’s, video’s, grafische elementen, lay-out en code) zijn beschermd door het auteursrecht, het merkenrecht en, meer algemeen, het recht van de intellectuele eigendom (Boek XI van het Wetboek van economisch recht en het Benelux-Verdrag inzake de intellectuele eigendom).</p>
      <p>Deze onderdelen zijn eigendom van EMKAY Partners of van de merken die het ontwikkelt en uitbaat, of worden gebruikt met toestemming. Elke volledige of gedeeltelijke reproductie, weergave, aanpassing, extractie of exploitatie, op welke wijze ook, zonder voorafgaande schriftelijke toestemming van EMKAY Partners is verboden en kan aanleiding geven tot vervolging.</p>
      <p>Foto’s, video’s en inhoud over projecten die voor derden werden uitgevoerd, blijven in voorkomend geval eigendom van hun auteurs of van hun respectieve klanten. Ze worden uitsluitend als referentie getoond; elke rechthebbende kan de verwijdering ervan vragen via <Mail />.</p>

      <h2>5. Hyperlinks</h2>
      <p>Deze website bevat links naar externe websites en diensten (bijvoorbeeld LinkedIn of het ticketplatform Passpass). EMKAY Partners heeft geen controle over die websites en wijst elke aansprakelijkheid af voor hun inhoud, beschikbaarheid en praktijken op het vlak van persoonsgegevens.</p>
      <p>Een link naar deze website plaatsen is toegestaan, op voorwaarde dat de pagina in een nieuw venster of tabblad opent, zonder ze in een kader te integreren („framing”) en zonder de indruk te wekken van een samenwerking die niet bestaat. EMKAY Partners kan op elk moment vragen om een link te verwijderen.</p>

      <h2>6. Aansprakelijkheid</h2>
      <p>EMKAY Partners stelt alles in het werk om juiste en actuele informatie te verstrekken, maar kan niet garanderen dat die volledig of foutloos is. De informatie kan op elk moment zonder voorafgaande kennisgeving worden gewijzigd.</p>
      <p>EMKAY Partners streeft ernaar de website permanent toegankelijk te houden, maar kan niet aansprakelijk worden gesteld voor een onderbreking, tijdelijke onbeschikbaarheid, storing of schade die voortvloeit uit het gebruik van de website, met name door een virus of een inbraak in het informaticasysteem, binnen de grenzen van wat de wet toestaat.</p>

      <h2>7. Persoonsgegevens en cookies</h2>
      <p>De verwerking van de gegevens die via de contactformulieren worden verstuurd en het gebruik van cookies worden beschreven in het <a href={PATHS.privacy.nl}>privacybeleid</a>.</p>

      <h2>8. Inhoud melden</h2>
      <p>Wilt u onjuiste of onrechtmatige inhoud melden, of inhoud die uw rechten schendt? Schrijf dan naar <Mail /> met vermelding van het adres van de betrokken pagina en de aard van het probleem. Wij behandelen uw verzoek zo snel mogelijk.</p>

      <h2>9. Toepasselijk recht en geschillen</h2>
      <p>Deze website en de wettelijke vermeldingen ervan vallen onder het Belgische recht. Bij een geschil wordt eerst naar een minnelijke oplossing gezocht. Lukt dat niet, dan zijn uitsluitend de rechtbanken van het gerechtelijk arrondissement Brussel bevoegd, onverminderd de dwingende regels ter bescherming van de consument.</p>
    </LegalPage>
  );
}
