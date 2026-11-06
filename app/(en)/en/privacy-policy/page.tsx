import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';
import { legalMetadata } from '@/lib/meta';

export const metadata: Metadata = legalMetadata('en', 'privacy');

const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PrivacyPolicy() {
  return (
    <LegalPage locale="en" page="privacy">
      <p>EMKAY Partners cares about the protection of your personal data. This policy explains which data is collected through this website, why, how long it is kept and what your rights are, in accordance with the General Data Protection Regulation (GDPR, Regulation (EU) 2016/679) and the Belgian Act of 30 July 2018 on the protection of natural persons with regard to the processing of personal data.</p>

      <h2>1. Data controller</h2>
      <dl className="lg-dl">
        <dt>Controller</dt><dd>EMKAY PARTNERS SRL</dd>
        <dt>Registered office</dt><dd>Avenue des Gerfauts 10, box 34<br />1170 Watermael-Boitsfort, Belgium</dd>
        <dt>Company number (CBE)</dt><dd>1024.829.348</dd>
        <dt>Privacy contact</dt><dd><Mail /></dd>
      </dl>
      <p>This processing covers EMKAY Partners and the brands it develops and operates that are presented on this website: Vision House, Overton, Orizon Connect, Bavare and Viens Manger. For any question about your data, write to <Mail />.</p>

      <h2>2. Data collected</h2>
      <p><strong>When you fill in a contact form</strong>, we only collect the information you choose to send us:</p>
      <ul>
        <li>your name and e-mail address (required so that we can reply);</li>
        <li>depending on the form: your company or organisation, your phone number, the type of project or collaboration and an indicative budget (optional, except for the organisation in the “I want to collaborate” form);</li>
        <li>the content of your message.</li>
      </ul>
      <p>Please do not include sensitive data (health, political or religious opinions, etc.) in your messages: it is not needed to handle your request.</p>
      <p><strong>On every visit</strong>, the host automatically records technical logs (IP address, date and time, page requested, browser type) that are necessary for the operation and security of the website.</p>
      <p>We do not collect any data through social networks, we do not carry out any profiling and we do not take any automated decision producing legal effects concerning you.</p>

      <h2>3. Purposes and legal bases</h2>
      <ul>
        <li><strong>Answering your request</strong> and following up on a possible project, collaboration or conversation. Legal basis: pre-contractual measures taken at your request (Article 6(1)(b) GDPR) and the legitimate interest of EMKAY Partners in replying to people who contact it (Article 6(1)(f)).</li>
        <li><strong>Security and proper functioning of the website</strong> (technical logs, protection against automated submissions and spam). Legal basis: legitimate interest (Article 6(1)(f)).</li>
        <li><strong>Compliance with our legal obligations</strong>, where applicable (for example accounting obligations, if your request leads to a contract). Legal basis: legal obligation (Article 6(1)(c)).</li>
      </ul>
      <p>Your data is never sold, rented or transferred. It is not used for direct marketing without your prior consent.</p>

      <h2>4. Recipients and processors</h2>
      <p>Your data is only accessible to the people at EMKAY Partners and its brands who are responsible for handling your request. It passes through technical service providers acting on our behalf, on our instructions, under confidentiality and security commitments (Article 28 GDPR):</p>
      <ul>
        <li>website hosting: Vercel Inc. (United States);</li>
        <li>receipt of form messages: Formspree, Inc. (United States), which forwards the messages to us by e-mail.</li>
      </ul>
      <p>Your data may also be disclosed to the authorities where required by law.</p>

      <h2>5. Transfers outside the European Union</h2>
      <p>As the providers above are established in the United States, some data may be transferred there. These transfers are covered by the safeguards provided for in Articles 45 and 46 GDPR: an adequacy decision of the European Commission (EU-U.S. Data Privacy Framework) or standard contractual clauses, depending on the provider. You can obtain information about these safeguards by writing to <Mail />.</p>

      <h2>6. Retention period</h2>
      <ul>
        <li>Messages received through the form: 30 days, then deleted, unless an ongoing conversation, project or contractual relationship requires them to be kept longer (in which case, for the duration of the relationship and then for the applicable legal periods).</li>
        <li>Technical logs: according to the host’s policy, for a limited period.</li>
      </ul>

      <h2>7. Security</h2>
      <p>The website is only accessible through an encrypted connection (HTTPS). The forms are protected against automated submissions and access to the messages received is limited to the people who need it. As no transmission over the Internet is completely secure, we invite you to share only the information needed for your request.</p>

      <h2>8. Cookies and audience measurement</h2>
      <p>At present, this website does not place any advertising, social network or audience measurement cookies, and does not use any tracker that requires your consent. Fonts and images are served directly by the website, without calling on a third-party service.</p>
      <p>If a video hosted by a third-party service (YouTube or Vimeo) is embedded in a project presentation, it is only loaded when that presentation is opened; the service may then process certain data under its own privacy policy. YouTube videos are embedded in privacy-enhanced mode.</p>
      <p>If an audience measurement tool or another tracker is added, this policy will be updated and your prior consent will be requested where required by law.</p>

      <h2>9. External links</h2>
      <p>This website contains links to third-party services (for example LinkedIn or the Passpass ticketing platform). When you follow them, these services process your data under their own privacy policy and under their sole responsibility.</p>

      <h2>10. Your rights</h2>
      <p>In accordance with Articles 15 to 21 GDPR, you have at any time:</p>
      <ul>
        <li>the right to access your data and obtain a copy of it;</li>
        <li>the right to have inaccurate or incomplete data rectified;</li>
        <li>the right to have your data erased;</li>
        <li>the right to restriction of processing;</li>
        <li>the right to object to processing based on our legitimate interest;</li>
        <li>the right to the portability of the data you have provided to us;</li>
        <li>the right to withdraw your consent at any time, where processing is based on it.</li>
      </ul>
      <p>To exercise these rights, write to <Mail /> specifying your request. If we have reasonable doubts about your identity, we may ask you for additional information to verify it. You will receive a reply within one month of receipt of your request; this period may be extended by two months for complex requests, in which case you will be informed. Exercising these rights is free of charge.</p>

      <h2>11. Complaints</h2>
      <p>If you believe that the processing of your data does not comply with the regulations, you can first contact us at <Mail />. You also have the right to lodge a complaint with the Belgian Data Protection Authority (DPA), Rue de la Presse 35, 1000 Brussels, <a href="https://www.dataprotectionauthority.be" target="_blank" rel="noopener noreferrer">www.dataprotectionauthority.be</a>.</p>

      <h2>12. Minors</h2>
      <p>This website and its forms are intended for an adult, professional audience. People under the age of 13 must not send us personal data without the consent of their parents or legal guardians.</p>

      <h2>13. Changes</h2>
      <p>This policy may change, in particular if a provider, a brand name or a feature of the website changes. The applicable version is the one published on this page at the time of your visit.</p>
    </LegalPage>
  );
}
