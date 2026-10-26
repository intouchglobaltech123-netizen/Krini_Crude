/**
 * Structured data (schema.org JSON-LD) for search engines. Every page carries
 * one graph: the company and the website, then the page itself, its
 * breadcrumbs and whatever it holds (questions and answers, a list of
 * products, an article). Built only from facts on the site; nothing here is
 * shown on the page that isn't also visible on it.
 *
 * To add once supplied: `logo` (a square PNG of the real Krini Crude logo,
 * 112 px or larger) and `sameAs` (the company's social profiles) on the
 * organisation, and `datePublished` on each article (articles.ts, `date`).
 */
import { routes, site, isPlaceholder } from "./site";
import type { Line } from "./catalogue";
import { readingTime, type Article } from "./articles";
import type { Crumb, PageSeo } from "./pages";

type Node = Record<string, unknown>;

export const abs = (path: string) => new URL(path, site.url).toString();
const ORG = `${site.url}/#organization`;
const WEBSITE = `${site.url}/#website`;
const BLOG = `${abs(routes.blog)}#blog`;

const office = {
  "@type": "PostalAddress",
  streetAddress: "95/20B, Gujji Main Road, Anna Nagar East",
  addressLocality: "Chennai",
  postalCode: "600102",
  addressRegion: "Tamil Nadu",
  addressCountry: "IN",
};
const factory = {
  "@type": "PostalAddress",
  streetAddress: "Ground Floor, 161A, Chinakoladi Lakshmi Nagar, Tiruverkadu",
  addressLocality: "Chennai",
  postalCode: "600077",
  addressRegion: "Tamil Nadu",
  addressCountry: "IN",
};
const phone = site.contact.phoneHref.replace("tel:", "");

export function organization(): Node {
  return {
    "@type": "Organization",
    "@id": ORG,
    name: site.name,
    url: site.url,
    description: site.seo.description,
    slogan: site.tagline,
    email: site.contact.email,
    telephone: phone,
    address: office,
    location: [
      { "@type": "Place", name: "Krini Crude office", address: office, hasMap: site.contact.officeMap },
      { "@type": "Place", name: "Krini Crude factory", address: factory, hasMap: site.contact.factoryMap },
    ],
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: phone, email: site.contact.email, areaServed: "IN" }],
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Industrial lubricants",
      "Metalworking fluids",
      "Cutting oils",
      "Hydraulic oils",
      "Gear oils",
      "Engine oils",
      "Greases",
      "Shuttering oil",
      "Shuttering grease",
      "Aerosol spray paints",
      "Anti-spatter spray",
      "Private label manufacturing",
    ],
  };
}

export function website(): Node {
  return { "@type": "WebSite", "@id": WEBSITE, url: site.url, name: site.name, inLanguage: "en-IN", publisher: { "@id": ORG } };
}

/** The page itself. `type`: WebPage, AboutPage, ContactPage, CollectionPage… */
export function webPage(p: PageSeo, type = "WebPage", extra: Node = {}): Node {
  const url = abs(p.path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: p.title,
    description: p.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE },
    about: { "@id": ORG },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(p.image), width: 1200, height: 630 },
    ...(p.path === routes.home ? {} : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    ...extra,
  };
}

export function breadcrumbs(trail: Crumb[]): Node {
  const last = trail[trail.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(last.path)}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function faqPage(path: string, faq: readonly { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** What Krini Crude does (Services page). */
export function services(items: readonly { title: string; body: string }[]): Node[] {
  return items.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.body,
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "India" },
  }));
}

/** A product line's products, each linking to its place on the page. */
export function productList(line: Line): Node {
  const url = abs(routes.line(line.slug));
  return {
    "@type": "ItemList",
    "@id": `${url}#products`,
    name: `${line.title} by Krini Crude`,
    numberOfItems: line.products.length,
    itemListElement: line.products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: `${url}#${p.id}` })),
  };
}

/** All three lines (Products page). */
export function lineList(ls: readonly Line[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${abs(routes.products)}#lines`,
    name: "Krini Crude product lines",
    numberOfItems: ls.length,
    itemListElement: ls.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.title, url: abs(routes.line(l.slug)) })),
  };
}

function posting(a: Article): Node {
  const url = abs(routes.article(a.slug));
  const words = a.body.map((b) => ("text" in b ? b.text : b.items.join(" "))).join(" ").split(/\s+/).length;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: a.title,
    description: a.summary,
    image: [abs(a.share), abs(a.image)],
    articleSection: a.category,
    inLanguage: "en-IN",
    wordCount: words,
    timeRequired: `PT${readingTime(a)}M`,
    author: { "@type": "Organization", "@id": ORG, name: site.name, url: site.url },
    publisher: { "@id": ORG },
    isPartOf: { "@id": BLOG },
    ...(isPlaceholder(a.date) ? {} : { datePublished: a.date }),
  };
}

export function article(a: Article): Node {
  return { ...posting(a), mainEntityOfPage: { "@id": `${abs(routes.article(a.slug))}#webpage` } };
}

export function blog(list: readonly Article[]): Node {
  return {
    "@type": "Blog",
    "@id": BLOG,
    url: abs(routes.blog),
    name: `${site.name} blog`,
    publisher: { "@id": ORG },
    inLanguage: "en-IN",
    blogPost: list.map(posting),
  };
}

/** One graph per page: the company and the site, then the page's own nodes. */
export function graph(nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": [organization(), website(), ...nodes] };
}
