import "./preloader.css";
import { bootPreloader, type PreloaderOptions } from "./boot";

const options: PreloaderOptions = {
  key: "kc:preloaded",
  // on every full load (a refresh included); links inside the site swap the page without
  // reloading it (FastNav), so it doesn't come back on every click
  once: false,
  // on every visit: opening the site, typing the address, a link from elsewhere, or a refresh
  onlyReload: false,
  // the drop falls and the logo has risen by 1.6 s; the screen is gone by about 2.6 s at most
  minMs: 1700,
  maxMs: 2000,
  logo: `${process.env.NEXT_PUBLIC_ASSET_BASE ?? ""}/images/logo-krini-h.webp?v=kc2`,
};

// "<" escaped so nothing in the options can close the script early
const script = `(${bootPreloader.toString()})(${JSON.stringify(options).replace(/</g, "\\u003c")})`;

/**
 * The loading screen: a drop of gold oil, its ripples, and the Krini Crude logo
 * rising from the surface. All it renders is its boot script (boot.ts), which
 * puts the screen up before anything else on the page has loaded: keep it
 * first inside <body> in app/layout.tsx.
 */
export function Preloader() {
  return <script id="kc-preloader" dangerouslySetInnerHTML={{ __html: script }} />;
}
