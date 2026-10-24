import { lines } from "../content/catalogue";
import { seo, trail } from "../content/pages";
import { abs, breadcrumbs, lineList, webPage } from "../content/schema";
import { Shell } from "../components/Shell";
import { Breadcrumbs } from "../components/PageHeader";
import { ProductShop } from "../components/ProductShop";

/**
 * Products, kept simple: the page opens on the shop (ProductShop), under the
 * breadcrumbs, with its heading as the page's h1: search,
 * the three lines as chips, every product as a card with Add to cart, and the
 * cart that sends the order on WhatsApp. Nothing under it (no questions or
 * enquiry band on this page).
 */
export function ProductsPage() {
  const t = trail.products;
  // one guide per line, in line order
  return (
    <Shell
      current="products"
      schema={[
        webPage(seo.products, "CollectionPage", { mainEntity: { "@id": `${abs(seo.products.path)}#lines` } }),
        breadcrumbs(t),
        lineList(lines),
      ]}
    >
      <ProductShop top={<Breadcrumbs trail={t} />} />
    </Shell>
  );
}
