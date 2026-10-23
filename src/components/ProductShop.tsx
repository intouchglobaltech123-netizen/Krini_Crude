import fs from "node:fs";
import path from "node:path";
import { site } from "../content/site";
import { lines, type Line, type Product, type ProductRangeItemDetails } from "../content/catalogue";
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
 * The four views of a product's pack (front, back, left, right): photos dropped into
 * public/images/products/ as <slug>-front.webp, <slug>-back.webp, <slug>-left.webp and
 * <slug>-right.webp (or .png / .jpg) are picked up at build time. The front falls back to the
 * catalogue's photo; a view with no photo yet shows an empty frame saying which view goes there.
 */
const VIEWS = ["Front", "Back", "Left", "Right"] as const;
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
  "mold-release-grease": "Applied as supplied: no dilution.",
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

const ON_REQUEST = "Shared with the technical data sheet: ask us on WhatsApp and we send it the same day.";

function itemOf(line: Line, p: Product, r?: { name: string; text: string; details?: ProductRangeItemDetails }): ShopItem {
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
    { k: "Made at", v: "ISO certified factory, Chennai" },
  ];
  const highlights = d.benefits?.length
    ? d.benefits
    : p.claims?.length
      ? p.claims
      : [
          ...(grades.length ? [`Available in ${grades.join(", ")}`] : []),
          `Sold under our ${line.brand.name} brand`,
          "Made at our ISO certified factory in Chennai",
          "Bulk supply, and private label under your own brand",
        ];
  const dilutionText =
    d.dilution && !d.dilutionRatios?.length
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
    const views = viewsOf(slug, d.image);
    const cardImg = d.image ?? views.find((v) => v.label === "Front" && v.src)?.src;
    return {
      key: r ? `${p.id}-${r.name}` : p.id,
      slug,
      name,
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
      sheet: sheetOf(slug, d),
    report: d.reportUrl,
    reportLabel: d.reportLabel,
    video: videoOf(slug, d),
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

/** A WhatsApp chat to the sales number with the order already written. */
export const orderHref = (name: string, line: string) =>
  `${site.contact.whatsapp.split("?")[0]}?text=${encodeURIComponent(
    `Hi Krini Crude, I would like to order:\n• ${name} (${line})\nQuantity: \nDelivery location: `,
  )}`;

/** The WhatsApp mark for the Order now buttons. */
export function WhatsAppIcon() {
  // no WhatsApp logo next to WhatsApp buttons and links (asked for, October 2026): the words say it
  return null;
}

/**
 * The Products page's shop: every product, from the catalogue, handed to
 * ShopClient (search, the lines as chips, Add to cart, and the cart that sends
 * the order on WhatsApp).
 */
export function ProductShop({ top }: { top?: ReactNode }) {
  const shopLines = SHOP_ORDER.map((id) => lines.find((l) => l.id === id)!).filter(Boolean);
  return (
    <ShopClient
      top={top}
      items={shopLines.flatMap(itemsOf)}
      lines={shopLines.map((l) => ({ id: l.id, title: l.title, brand: l.brand.name }))}
      whatsapp={site.contact.whatsapp}
      email={site.contact.email}
    />
  );
}
