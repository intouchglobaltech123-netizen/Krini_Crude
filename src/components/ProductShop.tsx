import fs from "node:fs";
import path from "node:path";
import { site } from "../content/site";
import { lines, type Line, type Product, type ProductRangeItem, type ProductRangeItemDetails } from "../content/catalogue";
import type { ReactNode } from "react";
import { ShopClient, type ShopItem, type ShopRow } from "./ShopClient";

/** The order the lines are listed in on the Products page: construction first, then lubricants, then aerosols. */
const SHOP_ORDER: Line["id"][] = ["construction", "lubricants", "aerosols"];

/** A product's name as a file name: "Silease 360 Shuttering Oil" → "silease-360-shuttering-oil". */
const slugOf = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The two views of a product's pack (front and back): photos dropped into
 * public/images/products/ as <slug>-front.webp and <slug>-back.webp (or .png / .jpg) are picked
 * up at build time. The front falls back to the catalogue's photo; a back with no photo yet shows
 * an empty frame saying so.
 */
const VIEWS = ["Front", "Back"] as const;
const EXTS = ["webp", "png", "jpg", "jpeg"];
const publicDir = path.join(process.cwd(), "public");
function viewsOf(slug: string, image?: string) {
  return VIEWS.map((label) => {
    const base = `/images/products/${slug}-${label.toLowerCase()}`;
    const ext = EXTS.find((e) => fs.existsSync(path.join(publicDir, `${base}.${e}`)));
    const src = ext ? `${base}.${ext}` : label === "Front" ? image : undefined;
    return { label, src };
  });
}

/**
 * How it is diluted, by kind of product, where the kind itself settles it (a neat oil, an engine
 * or gear oil, a grease or an aerosol is used as it comes); anything else waits for its data sheet.
 */
const AS_SUPPLIED: Record<string, string> = {
  "cutting-oil": "Used neat (undiluted), as supplied. Do not mix with water.",
  "hydraulic-oil": "Used as supplied: no dilution. Fill to the grade and level your equipment maker specifies.",
  "gear-oil": "Used as supplied: no dilution. Fill to the grade and level your equipment maker specifies.",
  "engine-oil": "Used as supplied: no dilution. Use the grade your engine maker specifies.",
  greases: "Applied as supplied: no dilution.",
  "shuttering-grease": "Applied as supplied: no dilution.",
};
/**
 * A product's data sheet: the report the catalogue names, or a PDF in public/documents/ whose name
 * starts with the product's slug (1-cool-aquacut-150-pds-2024.pdf). Its video: an AI-generated clip
 * dropped into public/videos/products/ as <slug>.mp4 (or .webm). Either may be missing: the
 * product page then offers to send the data sheet on WhatsApp, and says the video is coming.
 */
const docsDir = path.join(publicDir, "documents");
const docFiles = fs.existsSync(docsDir) ? (fs.readdirSync(docsDir) as string[]).filter((f) => /\.pdf$/i.test(f)) : [];
function sheetOf(slug: string, d: ProductRangeItemDetails = {}) {
  if (d.sheetUrl) return d.sheetUrl;
  const docs = fs.existsSync(docsDir) ? (fs.readdirSync(docsDir) as string[]).filter((f) => /\.pdf$/i.test(f)) : [];
  const pds = docs.find(
    (x) =>
      (x.toLowerCase().includes("pds") || x.toLowerCase().includes("data-sheet") || x.toLowerCase().includes("sheet")) &&
      (x.toLowerCase().startsWith(`${slug}-`) || x.toLowerCase() === `${slug}.pdf`),
  );
  if (pds) return `/documents/${pds}`;
  if (d.reportUrl) return d.reportUrl;
  const f = docs.find((x) => x.toLowerCase().startsWith(`${slug}-`) || x.toLowerCase() === `${slug}.pdf`);
  if (f) return `/documents/${f}`;
  return `/documents/${slug}-pds.pdf`;
}
function videoOf(slug: string, d?: ProductRangeItemDetails) {
  if (d?.videoUrl) return d.videoUrl;
  const ext = ["mp4", "webm"].find((e) => fs.existsSync(path.join(publicDir, "videos", "products", `${slug}.${e}`)));
  return ext ? `/videos/products/${slug}.${ext}` : undefined;
}

/**
 * Whether a picture in public/ is upright (taller than wide), read from its file header (WebP or
 * PNG); undefined when it cannot be told. Beside a beaker, a wide pack shot (a drum on white) is
 * cropped to the drum, while an upright picture is shown whole.
 */
function isUpright(src?: string) {
  if (!src || !src.startsWith("/")) return undefined;
  try {
    const b = fs.readFileSync(path.join(publicDir, src.split("?")[0]!));
    let w = 0;
    let h = 0;
    if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const kind = b.toString("ascii", 12, 16);
      if (kind === "VP8 ") {
        w = b.readUInt16LE(26) & 0x3fff;
        h = b.readUInt16LE(28) & 0x3fff;
      } else if (kind === "VP8L") {
        const n = b.readUInt32LE(21);
        w = (n & 0x3fff) + 1;
        h = ((n >> 14) & 0x3fff) + 1;
      } else if (kind === "VP8X") {
        w = b.readUIntLE(24, 3) + 1;
        h = b.readUIntLE(27, 3) + 1;
      }
    } else if (b.readUInt32BE(0) === 0x89504e47) {
      w = b.readUInt32BE(16);
      h = b.readUInt32BE(20);
    }
    return w && h ? h > w : undefined;
  } catch {
    return undefined;
  }
}

/** Construction chemicals whose video is shown now; the others wait for their AI videos. */
const CONSTRUCTION_VIDEOS = new Set([
  "krini-shuttering-grease",
  "repel-shuttering-grease",
  "silease-360-shuttering-oil",
  "magic-shuttering-oil",
  "nikri-30-shuttering-oil",
  "nikri-al-shuttering-oil",
  "repel-shuttering-oil",
]);
/** Construction chemicals that keep their back view (the two greases); the drums show the front only. */
const CONSTRUCTION_BACKS = new Set(["krini-shuttering-grease", "repel-shuttering-grease"]);

const ON_REQUEST = "Shared with the technical data sheet: ask us on WhatsApp and we send it the same day.";

function itemOf(line: Line, p: Product, r?: ProductRangeItem): ShopItem {
  const d = r?.details ?? {};
  const name = r?.name ?? p.name;
  const slug = slugOf(name);
  const grades = r ? [] : (p.variants ?? []);
  const general: ShopRow[] = [
    { k: "Brand", v: line.brand.name },
    { k: "Category", v: line.title },
    { k: "Product type", v: p.name },
    ...(grades.length ? [{ k: line.id === "lubricants" && /oil/i.test(p.name) && /^\d/.test(grades[0]!) ? "Grades (viscosity)" : "Grades / variants", v: grades.join(" · ") }] : []),
    ...(d.coverage ? [{ k: "Coverage", v: d.coverage }] : []),
    // every construction chemical is ready to use (the client, October 2026): no dilution section
    ...(line.id === "construction" ? [{ k: "Dilution", v: "Not needed: ready to use, apply as supplied" }] : []),
    { k: "Made at", v: "ISO 9001:2015 certified factory, Chennai" },
  ];
  const highlights = d.benefits?.length
    ? d.benefits
    : p.claims?.length
      ? p.claims
      : [
          ...(grades.length ? [`Available in ${grades.join(", ")}`] : []),
          `Sold under our ${line.brand.name} brand`,
          "Made at our ISO 9001:2015 certified factory in Chennai",
          "Bulk supply, and private label under your own brand",
        ];
  const dilutionText =
    line.id === "construction"
      ? undefined
      : d.dilution && !d.dilutionRatios?.length
      ? d.dilution
      : !d.dilutionRatios?.length
        ? line.id === "aerosols"
          ? "Ready to use from the can: no mixing or dilution."
          : (AS_SUPPLIED[p.id] ?? ON_REQUEST)
        : undefined;
  const packing: ShopRow[] = [
    { k: "Packing", v: d.packing ?? "Pack sizes on request" },
    ...(d.storage ? [{ k: "Storage", v: d.storage }] : []),
    ...(d.shelfLife ? [{ k: "Shelf life", v: d.shelfLife }] : []),
  ];
  if (!d.storage) packing.push({ k: "Storage", v: line.id === "aerosols" ? "Store below 50 °C, away from heat and direct sunlight. Pressurised container." : "Store indoors in the closed original container, away from heat and direct sunlight." });
    // the product in a beaker: beside the pack on the card, and a third view on its page
    // construction chemicals (the client, October 2026): the drums from the front only, no back view;
    // the two shuttering greases keep their back view
    const packViews =
      line.id === "construction" && !CONSTRUCTION_BACKS.has(slug)
        ? [{ label: "Front", src: d.image ?? viewsOf(slug)[0]?.src }]
        : viewsOf(slug, d.image);
    const views = [...packViews, ...(r?.beaker ? [{ label: "Sample", src: r.beaker }] : [])];
    const cardImg = d.image ?? views.find((v) => v.label === "Front" && v.src)?.src;
    return {
      key: r ? `${p.id}-${r.name}` : p.id,
      slug,
      name,
      tagline: r?.tagline,
      beaker: r?.beaker,
      imageUpright: r?.beaker ? isUpright(cardImg) : undefined,
      type: r ? p.name : line.short,
      group: p.name,
      text: r?.text ?? p.cardText ?? p.about,
      grades,
      line: line.id,
      lineTitle: line.title,
      lineShort: line.short,
      brand: line.brand.name,
      brandLogo: line.brand.logo,
      brandLogoFull: line.brand.logoFull ?? line.brand.logo,
      image: cardImg,
      imageAlt: d.imageAlt ?? name,
      views,
      // data sheets (and test reports) are offered for construction chemicals only
      sheet: line.id === "construction" ? sheetOf(slug, d) : undefined,
    report: line.id === "construction" ? d.reportUrl : undefined,
    reportLabel: d.reportLabel,
    // construction chemicals: no video yet (their AI videos come later, so the video view says "coming
    // soon"), except the two shuttering greases, whose videos stay on (the client, October 2026)
    video: line.id === "construction" && !CONSTRUCTION_VIDEOS.has(slug) && !d.videoUrl ? undefined : videoOf(slug, d),
    about: d.description ?? (r ? `${r.text}. ${p.about}` : p.about),
    highlights,
    applications: d.purpose ?? p.uses ?? [],
    applicationsTitle: d.purposeTitle ?? "Suitable applications",
    general,
    properties: d.properties ?? [],
    dilution: d.dilution,
    dilutionNote: d.dilutionNote,
    dilutionRatios: d.dilutionRatios,
    dilutionText,
    coverageNote: d.coverageNote,
    howTo: d.application,
    howToTitle: d.applicationTitle,
    packing,
    note: d.note,
    reviews: d.reviews ?? [],
  };
}

/**
 * One card per item a buyer can order: each named product in a range, or the product type itself
 * where it has no named range. Each carries everything its product page shows (ShopClient's
 * ProductView): the four views of the pack, the brand, about this product, highlights, suitable
 * applications, specifications, dilution and packing & storage, from the catalogue (which follows
 * krinicrude.com); where the catalogue has nothing for a section, the page says so plainly.
 */
function itemsOf(line: Line): ShopItem[] {
  return line.products.flatMap((p) => (p.range?.length ? p.range.map((r) => itemOf(line, p, r)) : [itemOf(line, p)]));
}

/** A WhatsApp chat to the sales number with the query already started (an enquiry, not an order). */
export const orderHref = (name: string, line: string) =>
  `${site.contact.whatsapp.split("?")[0]}?text=${encodeURIComponent(
    `Hi Krini Crude, I have a query about:\n• ${name} (${line})\nMy question: \nCity: `,
  )}`;

/** The WhatsApp mark for the Ask on WhatsApp buttons. */
export function WhatsAppIcon() {
  // no WhatsApp logo next to WhatsApp buttons and links (asked for, October 2026): the words say it
  return null;
}

/**
 * The Products page's shop: every product, from the catalogue, handed to
 * ShopClient (search, the lines as chips, and on every product Enquire on WhatsApp:
 * the products are to view and ask about, not to order).
 */
export function ProductShop({ top }: { top?: ReactNode }) {
  const shopLines = SHOP_ORDER.map((id) => lines.find((l) => l.id === id)!).filter(Boolean);
  return (
    <ShopClient
      top={top}
      items={shopLines.flatMap(itemsOf)}
      lines={shopLines.map((l) => ({ id: l.id, title: l.title, brand: l.brand.name, logo: l.brand.logo, logoFull: l.brand.logoFull }))}
      whatsapp={site.contact.whatsapp}
      email={site.contact.email}
    />
  );
}
