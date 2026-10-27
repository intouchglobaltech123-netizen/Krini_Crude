import { LegalPage } from "../../src/views/LegalPage";
import { terms } from "../../src/content/legal";
import { pageMetadata } from "../../src/seo/metadata";
import "../legal.css";

export const metadata = pageMetadata(terms.seo);

export default function Page() {
  return <LegalPage doc={terms} />;
}
