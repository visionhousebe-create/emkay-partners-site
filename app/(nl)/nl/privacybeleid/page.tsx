import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';
import { legalMetadata } from '@/lib/meta';

export const metadata: Metadata = legalMetadata('nl', 'privacy');

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function Privacybeleid() {
  return (
    <LegalPage locale="nl" page="privacy">
      <p>EMKAY Partners hecht belang aan de bescherming van uw persoonsgegevens. Dit beleid legt uit welke gegevens via deze website worden verzameld, waarom, hoelang ze worden bewaard en wat uw rechten zijn, overeenkomstig de Algemene Verordening Gegevensbescherming (AVG, Verordening (EU) 2016/679) en de Belgische wet van 30 juli 2018 betreffende de bescherming van natuurlijke personen met betrekking tot de verwerking van persoonsgegevens.</p>

      <h2>1. Verwerkingsverantwoordelijke</h2>
      <dl className="lg-dl">
        <dt>Verantwoordelijke</dt><dd>EMKAY PARTNERS SRL</dd>
        <dt>Maatschappelijke zetel</dt><dd>Avenue des Gerfauts 10, bus 34<br />1170 Watermaal-Bosvoorde, België</dd>
        <dt>Ondernemingsnummer (KBO)</dt><dd>1024.829.348</dd>
        <dt>Contact privacy</dt><dd><Mail /></dd>
      </dl>
      <p>Deze verwerking omvat EMKAY Partners en de merken die het ontwikkelt en uitbaat en die op deze website worden voorgesteld: Vision House, Overton, Orizon Connect, Bavare en Viens Manger. Voor elke vraag over uw gegevens kunt u schrijven naar <Mail />.</p>

      <h2>2. Verzamelde gegevens</h2>
      <p><strong>Wanneer u een contactformulier invult</strong>, verzamelen wij uitsluitend de informatie die u ons zelf bezorgt:</p>
      <ul>
        <li>uw naam en e-mailadres (verplicht om u te kunnen antwoorden);</li>
        <li>afhankelijk van het formulier: uw bedrijf of organisatie, uw telefoonnummer, het soort project of samenwerking en een indicatief budget (optioneel, behalve de organisatie in het formulier „Ik wil samenwerken”);</li>
        <li>de inhoud van uw bericht.</li>
      </ul>
      <p>Wij vragen u geen gevoelige gegevens (gezondheid, politieke of religieuze overtuigingen enz.) in uw berichten op te nemen: die zijn niet nodig om uw verzoek te behandelen.</p>
      <p><strong>Bij elk bezoek</strong> registreert de hostingprovider automatisch technische logbestanden (IP-adres, datum en uur, opgevraagde pagina, type browser) die nodig zijn voor de werking en de beveiliging van de website.</p>
      <p>Wij verzamelen geen gegevens via sociale netwerken, voeren geen profilering uit en nemen geen geautomatiseerde beslissingen die rechtsgevolgen voor u hebben.</p>

      <h2>3. Doeleinden en rechtsgronden</h2>
      <ul>
        <li><strong>Uw verzoek beantwoorden</strong> en een eventueel project, een samenwerking of een gesprek opvolgen. Rechtsgrond: precontractuele maatregelen op uw verzoek (artikel 6.1.b AVG) en het gerechtvaardigd belang van EMKAY Partners om te antwoorden aan wie contact opneemt (artikel 6.1.f).</li>
        <li><strong>Beveiliging en goede werking van de website</strong> (technische logbestanden, bescherming tegen geautomatiseerde verzendingen en spam). Rechtsgrond: gerechtvaardigd belang (artikel 6.1.f).</li>
        <li><strong>Naleving van onze wettelijke verplichtingen</strong>, in voorkomend geval (bijvoorbeeld boekhoudkundige verplichtingen als uw verzoek tot een overeenkomst leidt). Rechtsgrond: wettelijke verplichting (artikel 6.1.c).</li>
      </ul>
      <p>Uw gegevens worden nooit verkocht, verhuurd of overgedragen. Ze worden niet gebruikt voor commerciële prospectie zonder uw voorafgaande toestemming.</p>

      <h2>4. Ontvangers en verwerkers</h2>
      <p>Uw gegevens zijn enkel toegankelijk voor de personen binnen EMKAY Partners en zijn merken die uw verzoek behandelen. Ze passeren via technische dienstverleners die in onze naam en op onze instructies handelen, met verbintenissen inzake vertrouwelijkheid en beveiliging (artikel 28 AVG):</p>
      <ul>
        <li>hosting van de website: Vercel Inc. (Verenigde Staten);</li>
        <li>ontvangst van de formulierberichten: Formspree, Inc. (Verenigde Staten), dat ons de berichten per e-mail bezorgt.</li>
      </ul>
      <p>Uw gegevens kunnen ook aan de autoriteiten worden meegedeeld wanneer de wet dat vereist.</p>

      <h2>5. Doorgifte buiten de Europese Unie</h2>
      <p>Omdat de bovenvermelde dienstverleners in de Verenigde Staten gevestigd zijn, kunnen sommige gegevens daarheen worden doorgegeven. Die doorgiften zijn omkaderd door de waarborgen van de artikelen 45 en 46 AVG: een adequaatheidsbesluit van de Europese Commissie (EU-U.S. Data Privacy Framework) of standaardcontractbepalingen, afhankelijk van de dienstverlener. U kunt informatie over die waarborgen opvragen via <Mail />.</p>

      <h2>6. Bewaartermijn</h2>
      <ul>
        <li>Berichten die via het formulier worden ontvangen: 30 dagen, daarna worden ze gewist, tenzij een lopend gesprek, project of contractuele relatie een langere bewaring vereist (in dat geval gedurende de relatie en daarna gedurende de toepasselijke wettelijke termijnen).</li>
        <li>Technische logbestanden: volgens het beleid van de hostingprovider, voor een beperkte duur.</li>
      </ul>

      <h2>7. Beveiliging</h2>
      <p>De website is uitsluitend toegankelijk via een versleutelde verbinding (HTTPS). De formulieren zijn beschermd tegen geautomatiseerde verzendingen en de toegang tot de ontvangen berichten is beperkt tot de personen die ze nodig hebben. Omdat geen enkele verzending via het internet volledig veilig is, raden wij u aan enkel de informatie te delen die nodig is voor uw verzoek.</p>

      <h2>8. Cookies en publieksmeting</h2>
      <p>Momenteel plaatst deze website geen reclamecookies, cookies van sociale netwerken of cookies voor publieksmeting, en gebruikt ze geen trackers waarvoor uw toestemming nodig is. Lettertypen en afbeeldingen worden rechtstreeks door de website geleverd, zonder een beroep te doen op een externe dienst.</p>
      <p>Wordt een video van een externe dienst (YouTube of Vimeo) in de voorstelling van een project opgenomen, dan wordt die pas geladen wanneer u die voorstelling opent; die dienst kan dan bepaalde gegevens verwerken volgens zijn eigen privacybeleid. YouTube-video’s worden geïntegreerd in de modus voor verbeterde privacy.</p>
      <p>Als er een tool voor publieksmeting of een andere tracker wordt toegevoegd, wordt dit beleid bijgewerkt en wordt uw toestemming vooraf gevraagd wanneer de wet dat vereist.</p>

      <h2>9. Externe links</h2>
      <p>Deze website bevat links naar diensten van derden (bijvoorbeeld LinkedIn of het ticketplatform Passpass). Wanneer u die volgt, verwerken die diensten uw gegevens volgens hun eigen privacybeleid en onder hun eigen verantwoordelijkheid.</p>

      <h2>10. Uw rechten</h2>
      <p>Overeenkomstig de artikelen 15 tot 21 AVG beschikt u op elk moment over:</p>
      <ul>
        <li>een recht op inzage in uw gegevens en op een kopie ervan;</li>
        <li>een recht op rectificatie van onjuiste of onvolledige gegevens;</li>
        <li>een recht op wissing van uw gegevens;</li>
        <li>een recht op beperking van de verwerking;</li>
        <li>een recht van bezwaar tegen de verwerking op basis van ons gerechtvaardigd belang;</li>
        <li>een recht op overdraagbaarheid van de gegevens die u ons hebt verstrekt;</li>
        <li>het recht om uw toestemming op elk moment in te trekken, wanneer de verwerking daarop gebaseerd is.</li>
      </ul>
      <p>Om deze rechten uit te oefenen, schrijft u naar <Mail /> met vermelding van uw verzoek. Als wij redelijke twijfel hebben over uw identiteit, kunnen wij u om bijkomende informatie vragen om die te controleren. U ontvangt een antwoord binnen een maand na ontvangst van uw verzoek; die termijn kan met twee maanden worden verlengd bij een complex verzoek, in welk geval u daarvan op de hoogte wordt gebracht. De uitoefening van deze rechten is gratis.</p>

      <h2>11. Klacht</h2>
      <p>Bent u van mening dat de verwerking van uw gegevens niet in overeenstemming is met de regelgeving, dan kunt u ons eerst contacteren via <Mail />. U hebt ook het recht om een klacht in te dienen bij de Gegevensbeschermingsautoriteit (GBA), Drukpersstraat 35, 1000 Brussel, <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">www.gegevensbeschermingsautoriteit.be</a>.</p>

      <h2>12. Minderjarigen</h2>
      <p>Deze website en de formulieren ervan zijn bestemd voor een volwassen en professioneel publiek. Personen jonger dan 13 jaar mogen ons geen persoonsgegevens bezorgen zonder de toestemming van hun ouders of wettelijke vertegenwoordigers.</p>

      <h2>13. Wijzigingen</h2>
      <p>Dit beleid kan wijzigen, met name bij een wijziging van dienstverlener, van de naam van een merk of van een functionaliteit van de website. De toepasselijke versie is die welke op het moment van uw bezoek op deze pagina staat.</p>
    </LegalPage>
  );
}
