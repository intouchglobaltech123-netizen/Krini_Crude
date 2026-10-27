/**
 * Every page on the site: its search title and description, its address and
 * the picture shown when it is shared. The Next.js routes read their metadata
 * from here, the sitemap lists these pages, and the preview build renders them.
 */
import { routes, site } from "./site";
import type { Line } from "./catalogue";
import { articles, type Article } from "./articles";
import { processPage } from "./process";

export type PageSeo = {
  title: string;
  description: string;
  /** Path from the site root, e.g. "/products/lubricants". */
  path: string;
  /** 1200x630 share picture. */
  image: string;
  imageAlt: string;
  type?: "website" | "article";
};

export const seo = {
  home: {
    ...site.pages.home.seo,
    path: routes.home,
    image: "/images/og.jpg",
    imageAlt: "Krini Crude: industrial lubricants, construction chemicals and aerosols",
  },
  about: {
    ...site.pages.about.seo,
    path: routes.about,
    image: "/images/og-about.jpg",
    imageAlt: "Storage tanks and drums at the Krini Crude factory near Madhavaram, Chennai",
  },
  services: {
    ...site.pages.services.seo,
    path: routes.services,
    image: "/images/og-services.jpg",
    imageAlt: "The aerosol filling hall at the Krini Crude factory: compressor, air receiver and filling machines",
  },
  products: {
    ...site.pages.products.seo,
    path: routes.products,
    image: "/images/og-lubricants.jpg",
    imageAlt: "A drop of amber lubricant falling from a steel nozzle",
  },
  blog: {
    ...site.pages.blog.seo,
    path: routes.blog,
    image: "/images/og-blog.jpg",
    imageAlt: "A drop of amber oil landing on a steel plate",
  },
  contact: {
    ...site.pages.contact.seo,
    path: routes.contact,
    image: "/images/og-contact.jpg",
    imageAlt: "Storage tanks and drums at the Krini Crude factory near Madhavaram, Chennai",
  },
  process: {
    ...processPage.seo,
    path: routes.process,
    image: "/images/og-process.jpg",
    imageAlt: "Golden oil swirling in a stainless-steel blending tank",
  },
} satisfies Record<string, PageSeo>;

export const lineSeo = (l: Line): PageSeo => ({
  ...l.seo,
  path: routes.line(l.slug),
  image: `/images/og-${l.id}.jpg`,
  imageAlt: l.imageAlt,
});

export const articleSeo = (a: Article): PageSeo => ({
  title: `${a.title} | Krini Crude`,
  description: a.summary,
  path: routes.article(a.slug),
  image: a.share,
  imageAlt: a.imageAlt,
  type: "article",
});

/** Where the page sits: the trail for the breadcrumbs and their structured data. */
export type Crumb = { name: string; path: string };
export const trail = {
  about: [{ name: "Home", path: routes.home }, { name: "About", path: routes.about }],
  services: [{ name: "Home", path: routes.home }, { name: "Services", path: routes.services }],
  products: [{ name: "Home", path: routes.home }, { name: "Products", path: routes.products }],
  blog: [{ name: "Home", path: routes.home }, { name: "Blog", path: routes.blog }],
  contact: [{ name: "Home", path: routes.home }, { name: "Contact", path: routes.contact }],
  process: [{ name: "Home", path: routes.home }, { name: "How it’s made", path: routes.process }],
  line: (l: Line): Crumb[] => [...trail.products, { name: l.title, path: routes.line(l.slug) }],
  article: (a: Article): Crumb[] => [...trail.blog, { name: a.title, path: routes.article(a.slug) }],
};

/** Every page, in site order: for the sitemap and the preview build. */
export type PageEntry = PageSeo & { key: string; priority: number };
export const allPages = (): PageEntry[] => [
  { key: "home", priority: 1, ...seo.home },
  { key: "about", priority: 0.7, ...seo.about },
  { key: "services", priority: 0.8, ...seo.services },
  { key: "products", priority: 0.9, ...seo.products },
  { key: "process", priority: 0.7, ...seo.process },
  { key: "blog", priority: 0.6, ...seo.blog },
  ...articles.map((a) => ({ key: `article:${a.slug}`, priority: 0.5, ...articleSeo(a) })),
  { key: "contact", priority: 0.8, ...seo.contact },
];
