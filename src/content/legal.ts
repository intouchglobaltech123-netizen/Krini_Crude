import { routes, site } from "./site";
import type { PageSeo } from "./pages";

/**
 * Privacy Policy and Terms & Conditions, linked from the footer. Written for
 * what this site actually does: an enquiry form (name, phone, message),
 * WhatsApp, email and phone links, no accounts, no online payments, no
 * advertising cookies. Have them reviewed before launch, and update `updated`
 * whenever the text changes.
 */

/** A section: paragraphs, then a list, then paragraphs after the list. */
export type LegalBlock = { h: string; p?: string[]; list?: string[]; after?: string[] };
export type LegalDoc = { id: "privacy" | "terms"; label: string; title: string; lead: string; updated: string; seo: PageSeo; glance: string[]; body: LegalBlock[] };

const c = site.contact;
const office = c.office.join(" ").replace(/,\s*$/, "");
const reach = `Email ${c.email}, call ${c.phone}, or write to Krini Crude, ${office}.`;
const updated = "16 October 2026";

export const privacy: LegalDoc = {
  id: "privacy",
  label: "Privacy Policy",
  title: "Privacy Policy",
  lead: "What we collect when you use this website or get in touch, why, and the choices you have.",
  updated,
  glance: [
    "We collect only what you send us: your name, number and message.",
    "We use it to answer you, quote and supply. We never sell it.",
    "No advertising or tracking cookies on this site.",
    "Ask us any time to see, correct or delete your details.",
  ],
  seo: {
    title: "Privacy Policy | Krini Crude",
    description: "How Krini Crude collects, uses and protects the details you share through our website, enquiry form, WhatsApp, email and phone.",
    path: routes.privacy,
    image: "/images/og.jpg",
    imageAlt: "Krini Crude: industrial lubricants, construction chemicals and aerosols",
  },
  body: [
    {
      h: "Who we are",
      p: [
        `This website is run by Krini Crude, a manufacturer of lubricants, greases, construction chemicals and aerosols, with its office at ${office}. In this policy, “we”, “us” and “our” mean Krini Crude.`,
      ],
    },
    {
      h: "What we collect",
      p: ["We only collect what you choose to give us, and a little technical information your browser sends to every website."],
      list: [
        "Enquiry form: your name, contact number and message (and the product or type of enquiry you chose).",
        "WhatsApp, email and phone: your number or email address and whatever you write or say to us.",
        "Technical information: your browser and device type, pages visited and the time of the visit, as kept in our hosting provider’s standard server logs.",
      ],
    },
    {
      h: "How we use it",
      list: [
        "To reply to your enquiry, prepare quotations and supply the products you order.",
        "To provide after-sales support and keep a record of our dealings with you.",
        "To keep the website working, secure and free of misuse.",
        "To meet our legal, tax and accounting obligations.",
      ],
      after: ["We do not sell your details, and we do not use them for advertising by anyone else."],
    },
    {
      h: "Who we share it with",
      p: [
        "Only with people who help us do the above: our staff, our website host and the service that delivers enquiry-form messages to us, and, when you order, the transport and logistics partners who deliver it. When you contact us on WhatsApp, WhatsApp’s own privacy policy also applies. We may disclose details where the law requires it.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website does not use advertising or tracking cookies. Your browser may store small technical settings needed for the site to work properly; they are not used to identify you. If we add analytics in future, we will update this policy first.",
      ],
    },
    {
      h: "How long we keep it",
      p: ["Enquiries are kept as long as needed to deal with them and any business that follows, and order and invoice records for as long as Indian tax and company law requires."],
    },
    {
      h: "Keeping it safe",
      p: ["The site is served over a secure (HTTPS) connection and access to enquiries is limited to the people who handle them. No method of sending or storing data is completely secure, but we take reasonable care to protect what you share."],
    },
    {
      h: "Your choices",
      p: [
        `You can ask us what details we hold about you, ask us to correct them, or ask us to delete them where we are not required to keep them, in line with India’s Digital Personal Data Protection Act, 2023. ${reach}`,
      ],
    },
    {
      h: "Changes to this policy",
      p: ["We may update this policy from time to time. The date at the top shows when it last changed."],
    },
  ],
};

export const terms: LegalDoc = {
  id: "terms",
  label: "Terms & Conditions",
  title: "Terms & Conditions",
  lead: "The terms for using this website and for quotations and orders placed with Krini Crude.",
  updated,
  glance: [
    "An enquiry is not an order: an order is confirmed by us in writing.",
    "Prices are in rupees and exclude GST and freight unless stated.",
    "Check product suitability with our team and the data sheet before use.",
    "Indian law applies; the courts at Chennai have jurisdiction.",
  ],
  seo: {
    title: "Terms & Conditions | Krini Crude",
    description: "Terms for using the Krini Crude website and for quotations, orders, delivery and product information from Krini Crude, Chennai.",
    path: routes.terms,
    image: "/images/og.jpg",
    imageAlt: "Krini Crude: industrial lubricants, construction chemicals and aerosols",
  },
  body: [
    {
      h: "About these terms",
      p: ["By using this website you agree to these terms. If you do not agree, please do not use the site. Orders are also governed by the quotation, order confirmation or invoice we issue; where they differ from these terms, those documents apply."],
    },
    {
      h: "Product information",
      p: [
        "Product descriptions, grades, uses and technical details on this site are given in good faith as general guidance. Results depend on the application, equipment and conditions of use, so please check suitability with our team and the product’s technical data sheet before use. Specifications, packing and availability may change without notice. Pictures are for illustration.",
      ],
    },
    {
      h: "Enquiries, quotations and orders",
      list: [
        "An enquiry through the website, WhatsApp, email or phone is not an order.",
        "Quotations are valid for the period stated on them and may change with raw material prices and taxes.",
        "An order is accepted only when we confirm it in writing (including by email or WhatsApp).",
        "Prices are in Indian rupees and, unless stated otherwise, exclude GST, packing and freight.",
        "Payment terms are as stated on the quotation or invoice.",
      ],
    },
    {
      h: "Delivery",
      p: ["Delivery dates are estimates. We are not responsible for delays caused by events outside our reasonable control, such as transport disruption, strikes, shortages or natural events. Please inspect goods on arrival and tell us of any damage or shortage within 7 days."],
    },
    {
      h: "Use and storage of products",
      p: ["Our products are industrial chemicals. Store, handle, use and dispose of them as described on the label and safety data sheet, keep them away from children, and follow local regulations. Aerosol cans are pressurised: keep them away from heat and flame and do not pierce or burn them, even when empty."],
    },
    {
      h: "Private label and custom formulation",
      p: ["For products made under your brand or to your formulation, the agreed specification, quantities, artwork and timelines are set out in a separate written agreement. You are responsible for having the rights to any brand names, logos and artwork you give us."],
    },
    {
      h: "Liability",
      p: ["To the extent the law allows, we are not liable for indirect or consequential loss, or for loss arising from use of a product outside its recommended application or instructions. Our total liability for any order is limited to the price paid for the products concerned. Nothing in these terms limits rights you have under law that cannot be excluded."],
    },
    {
      h: "Website content",
      p: ["The text, product names, logos and design of this site belong to Krini Crude or are used with permission. You may view and print pages for your own business use, but not copy or reuse them otherwise without our written consent. Links to other websites are provided for convenience; we are not responsible for their content."],
    },
    {
      h: "Governing law",
      p: ["These terms are governed by the laws of India, and the courts at Chennai, Tamil Nadu have exclusive jurisdiction."],
    },
    {
      h: "Contact",
      p: [`Questions about these terms? ${reach}`],
    },
  ],
};
