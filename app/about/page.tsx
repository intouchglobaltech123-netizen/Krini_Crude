import { AboutPage } from "../../src/views/AboutPage";
import { seo } from "../../src/content/pages";
import { pageMetadata } from "../../src/seo/metadata";
// the About page's own styles (all under .ab), after the site's stylesheets
import "./about.css";

export const metadata = pageMetadata(seo.about);

export default function Page() {
  return <AboutPage />;
}
