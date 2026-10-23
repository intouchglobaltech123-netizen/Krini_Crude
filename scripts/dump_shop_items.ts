import fs from 'node:fs';
import path from 'node:path';
import { lines, type Line, type Product, type ProductRangeItemDetails } from '../src/content/catalogue';

const SHOP_ORDER: Line["id"][] = ["construction", "lubricants", "aerosols"];

const slugOf = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const docsDir = path.join(process.cwd(), "public", "documents");
const docFiles = fs.existsSync(docsDir) ? (fs.readdirSync(docsDir) as string[]).filter((f) => /\.pdf$/i.test(f)) : [];

function sheetOf(slug: string, d: ProductRangeItemDetails = {}) {
  if (d.sheetUrl) return d.sheetUrl;
  const pds = docFiles.find(
    (x) =>
      (x.toLowerCase().includes("pds") || x.toLowerCase().includes("data-sheet") || x.toLowerCase().includes("sheet")) &&
      (x.toLowerCase().startsWith(`${slug}-`) || x.toLowerCase() === `${slug}.pdf`),
  );
  if (pds) return `/documents/${pds}`;
  if (d.reportUrl) return d.reportUrl;
  const f = docFiles.find((x) => x.toLowerCase().startsWith(`${slug}-`) || x.toLowerCase() === `${slug}.pdf`);
  return f ? `/documents/${f}` : undefined;
}

const shopLines = SHOP_ORDER.map((id) => lines.find((l) => l.id === id)!).filter(Boolean);

const items: any[] = [];
for (const line of shopLines) {
  for (const p of line.products) {
    if (p.range?.length) {
      for (const r of p.range) {
        const d = r.details ?? {};
        const slug = slugOf(r.name);
        items.push({
          slug,
          name: r.name,
          line: line.id,
          lineTitle: line.title,
          brand: line.brand.name,
          about: d.description ?? `${r.text}. ${p.about}`,
          benefits: d.benefits ?? p.claims ?? [],
          purpose: d.purpose ?? p.uses ?? [],
          properties: d.properties ?? [],
          dilution: d.dilution,
          dilutionRatios: d.dilutionRatios ?? [],
          application: d.application ?? [],
          packing: d.packing,
          storage: d.storage,
          shelfLife: d.shelfLife,
          coverage: d.coverage,
          coverageNote: d.coverageNote,
          note: d.note,
          sheet: sheetOf(slug, d),
        });
      }
    } else {
      const slug = slugOf(p.name);
      items.push({
        slug,
        name: p.name,
        line: line.id,
        lineTitle: line.title,
        brand: line.brand.name,
        about: p.about,
        benefits: p.claims ?? (p.variants?.length ? [`Available in: ${p.variants.join(', ')}`] : []),
        purpose: p.uses ?? [],
        properties: [],
        packing: "Standard industrial packaging (pails, drums, barrels)",
        storage: "Store in original tightly closed container in a cool, dry place.",
        shelfLife: "12 months from date of manufacture when stored properly.",
        sheet: sheetOf(slug),
      });
    }
  }
}

fs.writeFileSync('scripts/shop_items.json', JSON.stringify(items, null, 2), 'utf8');
console.log(`Successfully dumped ${items.length} shop items to scripts/shop_items.json`);
