import { HomePage } from "../src/views/HomePage";
import { seo } from "../src/content/pages";
import { pageMetadata } from "../src/seo/metadata";
import "./home.css";

export const metadata = pageMetadata(seo.home);

export default function Page() {
  return <HomePage />;
}
