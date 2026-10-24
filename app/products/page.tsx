import { ProductsPage } from "../../src/views/ProductsPage";
import { seo } from "../../src/content/pages";
import { pageMetadata } from "../../src/seo/metadata";
import "./shop.css";

export const metadata = pageMetadata(seo.products);

export default function Page() {
  return <ProductsPage />;
}
