import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';
import { legalMetadata } from '@/lib/meta';
import { PATHS } from '@/lib/i18n/config';

export const metadata: Metadata = legalMetadata('en', 'legal');

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function LegalNotice() {
  return (
    <LegalPage locale="en" page="legal">
      <p>This legal notice is published in accordance with the Belgian Code of Economic Law (in particular Articles III.25 and XII.6) and the Belgian Code of Companies and Associations (Article 2:20). By browsing this website, you accept its terms.</p>

      <h2>1. Website publisher</h2>
      <p>The website available at www.emkaypartners.com is published by:</p>
      <dl className="lg-dl">
        <dt>Company name</dt><dd>EMKAY PARTNERS</dd>
        <dt>Legal form</dt><dd>Private limited company (SRL / BV)</dd>
        <dt>Registered office</dt><dd>Avenue des Gerfauts 10, box 34<br />1170 Watermael-Boitsfort, Belgium</dd>
        <dt>Company number (CBE)</dt><dd>1024.829.348 · RLE Brussels</dd>
        <dt>VAT number</dt><dd>BE 1024.829.348</dd>
        <dt>E-mail</dt><dd><Mail /></dd>
      </dl>
      <p>Hereinafter “EMKAY Partners”.</p>

      <h2>2. Hosting</h2>
      <dl className="lg-dl">
        <dt>Host</dt><dd>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States, <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></dd>
      </dl>

      <h2>3. Purpose of the website</h2>
      <p>This website presents EMKAY Partners and the brands developed and operated by EMKAY Partners: Vision House (communication and strategy), Overton (events and experiences), Orizon Connect (business networking), Bavare (social events) and Viens Manger (food and discoveries). It allows visitors to contact EMKAY Partners and its brands.</p>
      <p>The information published on this website is provided for information purposes only. It does not constitute a contractual offer: any service is subject to a separate quotation or written agreement.</p>

      <h2>4. Intellectual property</h2>
      <p>The structure of the website and all of its elements (texts, logos, brand names, photographs, videos, graphic elements, layout and code) are protected by copyright, trademark law and, more generally, intellectual property law (Book XI of the Belgian Code of Economic Law and the Benelux Convention on Intellectual Property).</p>
      <p>These elements are the property of EMKAY Partners or of the brands it develops and operates, or are used with permission. Any reproduction, representation, adaptation, extraction or use, in whole or in part, by any means whatsoever, without the prior written consent of EMKAY Partners, is prohibited and may give rise to legal action.</p>
      <p>Photographs, videos and content presenting projects carried out for third parties remain, where applicable, the property of their authors or of their respective clients. They are shown solely as references; any rights holder may request their removal by writing to <Mail />.</p>

      <h2>5. Hyperlinks</h2>
      <p>This website contains links to external websites and services (for example LinkedIn or the Passpass ticketing platform). EMKAY Partners has no control over these websites and accepts no liability for their content, availability or personal data practices.</p>
      <p>Linking to this website is permitted, provided that the link opens the page in a new window or tab, without embedding it in a frame (“framing”) and without suggesting a partnership that does not exist. EMKAY Partners may request the removal of a link at any time.</p>

      <h2>6. Liability</h2>
      <p>EMKAY Partners makes every effort to provide accurate and up-to-date information, but cannot guarantee that it is complete or free from errors. Information may be changed at any time without notice.</p>
      <p>EMKAY Partners endeavours to keep the website available at all times, but cannot be held liable for any interruption, temporary unavailability, malfunction or damage resulting from the use of the website, in particular from a virus or a security breach, to the extent permitted by law.</p>

      <h2>7. Personal data and cookies</h2>
      <p>The processing of data submitted through the contact forms, as well as the use of cookies, is described in the <a href={PATHS.privacy.en}>privacy policy</a>.</p>

      <h2>8. Reporting content</h2>
      <p>To report content that is inaccurate, unlawful or infringes your rights, write to <Mail />, stating the address of the page concerned and the nature of the problem. We will handle your request as quickly as possible.</p>

      <h2>9. Governing law and disputes</h2>
      <p>This website and its legal notice are governed by Belgian law. In the event of a dispute, an amicable solution will be sought first. Failing that, the courts of the judicial district of Brussels shall have exclusive jurisdiction, without prejudice to mandatory consumer protection rules.</p>
    </LegalPage>
  );
}
