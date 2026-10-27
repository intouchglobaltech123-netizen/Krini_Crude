import { LegalPage } from "../../src/views/LegalPage";
import { privacy } from "../../src/content/legal";
import { pageMetadata } from "../../src/seo/metadata";
import "../legal.css";

export const metadata = pageMetadata(privacy.seo);

export default function Page() {
  return <LegalPage doc={privacy} />;
}
