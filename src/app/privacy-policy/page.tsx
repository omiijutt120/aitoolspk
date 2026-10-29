import { Document } from '@/components/document';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Privacy policy',
  'How AiToolsPk handles website visits, WhatsApp enquiries, technical logs and privacy requests. No customer accounts or on-site payment collection.',
  '/privacy-policy/'
);
export default function Privacy() {
  return (
    <Document
      path="/privacy-policy/"
      policy
      eyebrow="YOUR INFORMATION"
      title="Privacy policy"
      lead="AiToolsPk is a catalog website. You can browse without creating an account or submitting personal information."
    >
      <h2>Who to contact</h2>
      <p>
        AiToolsPk operates the catalog at AiToolsPk.tech. For privacy questions
        or deletion requests, message +92 371 4549245 on WhatsApp and label your
        message “Privacy request”.
      </p>
      <h2>Information used on this website</h2>
      <p>
        The website has no customer registration, contact forms, password
        collection, checkout or payment processing. Search terms and filters
        appear in the page URL so you can share a view. Avoid entering personal
        or sensitive information in search.
      </p>
      <p>
        The application does not set advertising cookies, install tracking
        pixels or run third-party analytics. Your hosting or network provider
        may process IP addresses, browser details, requested URLs and access
        timestamps in technical logs to deliver and secure the website.
        Retention depends on the hosting service configured for the site.
      </p>
      <h2>WhatsApp conversations</h2>
      <p>
        Opening WhatsApp takes you to a separate service with its own privacy
        terms. A product enquiry includes the public product name, selected
        plan, warranty, price, ID and page URL. It is not sent until you send
        the message. If you contact us, we receive the phone number, profile
        details and information you share through WhatsApp.
      </p>
      <p>
        We use enquiry and order conversation information to answer questions,
        confirm an order, arrange delivery, resolve problems and handle refund
        requests. Do not send passwords, recovery keys, cookies, authentication
        codes or full payment card information.
      </p>
      <h2>Sharing and retention</h2>
      <p>
        We do not sell customer conversation data or add people to marketing
        lists through this site. Information may be shared only as necessary to
        fulfil an agreed order, resolve a payment issue, comply with law or
        protect against fraud. The specific delivery method must be explained
        before payment. We do not forward account credentials.
      </p>
      <p>
        We keep order and support conversations while needed to deliver the
        order, honour agreed support terms and resolve disputes or recordkeeping
        obligations. You can ask for deletion of information no longer needed
        for those purposes. We will explain if some records must be retained.
      </p>
      <h2>Your choices</h2>
      <p>
        You can browse without contacting us. You may ask what information is
        held in your conversation, request a correction or request deletion.
        Contact us from the number used for the enquiry where possible so we can
        identify the relevant records. We will not ask for passwords to verify a
        request.
      </p>
      <h2>Third-party services and changes</h2>
      <p>
        WhatsApp and any product vendor you choose have their own data
        practices. Review their terms before using their services. Changes to
        this policy will appear on this page with an updated effective date.
      </p>
    </Document>
  );
}
