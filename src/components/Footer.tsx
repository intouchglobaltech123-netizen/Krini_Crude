import type { CSSProperties } from "react";
import { routes, site, type PageId } from "../content/site";
import { lines } from "../content/catalogue";
import { Arrow, Glyph } from "./ui";
import { FooterMotion } from "./FooterMotion";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/**
 * Every page but Contact ends here, and it moves (theme.css "Footer,
 * animated"; FooterMotion.tsx):
 *  - three fine gold lines flow along its top edge, like oil;
 *  - the four columns (the Krini Crude logo with a line about us and Enquire now;
 *    the pages; the product lines; how to reach us) rise in one after another
 *    when the footer scrolls into view;
 *  - the back to top button carries a ring showing how far down the page you are.
 * Under it all, the copyright left; Privacy Policy and Terms & Conditions right.
 */
export function Footer({ current }: { current?: PageId }) {
  const year = new Date().getFullYear();
  const c = site.contact;
  const here = (href: string) => (current && href === routes[current as keyof typeof routes] ? "page" : undefined);
  const pages = [
    // the same pages as the top bar
    { label: "Home", href: routes.home },
    { label: "About Us", href: routes.about },
    { label: "Products", href: routes.products },
    { label: "Blog", href: routes.blog },
  ];
  return (
    <footer className="site-footer ft3" data-ft3>
      {/* three fine gold lines flowing like oil along the top */}
      <div className="ft3-wave" aria-hidden="true">
        <svg viewBox="0 0 2880 48" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ft3-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b9911e" />
              <stop offset="0.25" stopColor="#f0d77f" />
              <stop offset="0.5" stopColor="#d4af37" />
              <stop offset="0.75" stopColor="#f0d77f" />
              <stop offset="1" stopColor="#b9911e" />
            </linearGradient>
          </defs>
          <path className="ft3-line ft3-line-1" d="M0 24 C 118.8 12 241.2 12 360 24 C 478.8 36 601.2 36 720 24 C 838.8 12 961.2 12 1080 24 C 1198.8 36 1321.2 36 1440 24 C 1558.8 12 1681.2 12 1800 24 C 1918.8 36 2041.2 36 2160 24 C 2278.8 12 2401.2 12 2520 24 C 2638.8 36 2761.2 36 2880 24 C 2998.8 12 3121.2 12 3240 24 C 3358.8 36 3481.2 36 3600 24" />
          <path className="ft3-line ft3-line-2" d="M-120 26 C -40.8 18 40.8 18 120 26 C 199.2 34 280.8 34 360 26 C 439.2 18 520.8 18 600 26 C 679.2 34 760.8 34 840 26 C 919.2 18 1000.8 18 1080 26 C 1159.2 34 1240.8 34 1320 26 C 1399.2 18 1480.8 18 1560 26 C 1639.2 34 1720.8 34 1800 26 C 1879.2 18 1960.8 18 2040 26 C 2119.2 34 2200.8 34 2280 26 C 2359.2 18 2440.8 18 2520 26 C 2599.2 34 2680.8 34 2760 26 C 2839.2 18 2920.8 18 3000 26 C 3079.2 34 3160.8 34 3240 26 C 3319.2 18 3400.8 18 3480 26" />
          <path className="ft3-line ft3-line-3" d="M-60 22 C -0.6 17 60.6 17 120 22 C 179.4 27 240.6 27 300 22 C 359.4 17 420.6 17 480 22 C 539.4 27 600.6 27 660 22 C 719.4 17 780.6 17 840 22 C 899.4 27 960.6 27 1020 22 C 1079.4 17 1140.6 17 1200 22 C 1259.4 27 1320.6 27 1380 22 C 1439.4 17 1500.6 17 1560 22 C 1619.4 27 1680.6 27 1740 22 C 1799.4 17 1860.6 17 1920 22 C 1979.4 27 2040.6 27 2100 22 C 2159.4 17 2220.6 17 2280 22 C 2339.4 27 2400.6 27 2460 22 C 2519.4 17 2580.6 17 2640 22 C 2699.4 27 2760.6 27 2820 22 C 2879.4 17 2940.6 17 3000 22 C 3059.4 27 3120.6 27 3180 22 C 3239.4 17 3300.6 17 3360 22" />
        </svg>
      </div>

      <div className="frame">
        <div className="ft3-grid">
          <div className="ft3-brand" data-ft style={vars({ "--i": 0 })}>
            <a href={routes.home} className="ft3-logo" aria-label="Krini Crude, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-krini-h.webp?v=kc4" alt="" width={735} height={330} />
            </a>
            <p className="ft3-about">
              Lubricants, greases, construction chemicals and aerosols, made at our ISO 9001:2015 certified factory in Chennai.
            </p>
            <a href={routes.contact} className="ft3-cta">
              Enquire now <Arrow />
            </a>
          </div>

          <nav className="ft3-col" aria-label="Pages" data-ft style={vars({ "--i": 1 })}>
            <p className="ft3-k">Explore</p>
            <ul>
              {pages.map((l) => (
                <li key={l.label}>
                  <a href={l.href} aria-current={here(l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft3-col" aria-label="Product lines" data-ft style={vars({ "--i": 2 })}>
            <p className="ft3-k">Products</p>
            <ul>
              {lines.map((l) => (
                <li key={l.id}>
                  <a href={routes.line(l.slug)}>{l.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft3-col" data-ft style={vars({ "--i": 3 })}>
            <p className="ft3-k">Reach us</p>
            <ul className="ft3-reach">
              <li>
                <a href={c.phoneHref}>
                  <span className="ft3-ic">
                    <Glyph name="call" size={15} />
                  </span>
                  {c.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${c.email}`}>
                  <span className="ft3-ic">
                    <Glyph name="mail" size={15} />
                  </span>
                  {c.email}
                </a>
              </li>
              <li>
                <a href={c.whatsapp} target="_blank" rel="noopener noreferrer">
                  <span className="ft3-ic">
                    <Glyph name="chat" size={15} />
                  </span>
                  WhatsApp us
                </a>
              </li>
              <li className="ft3-hours">
                <span className="ft3-ic">
                  <Glyph name="clock" size={15} />
                </span>
                {c.hours}
              </li>
            </ul>
          </div>
        </div>


        <div className="ft3-bottom">
          <p>© {year} Krini Crude · ISO 9001:2015 certified · Chennai, India</p>
          <div className="ft3-bottom-r">
            <ul className="ft3-legal">
              <li>
                <a href={routes.privacy} aria-current={here(routes.privacy)}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={routes.terms} aria-current={here(routes.terms)}>
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
            <a href="#main" className="ft3-up" aria-label="Back to top" data-back-to-top>
              <svg className="ft3-up-ring" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="20" pathLength="1" />
                <circle className="ft3-up-p" cx="22" cy="22" r="20" pathLength="1" />
              </svg>
              <svg className="ft3-up-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <FooterMotion />
    </footer>
  );
}
