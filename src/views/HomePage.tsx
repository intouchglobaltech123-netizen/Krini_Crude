import { seo } from "../content/pages";
import { faqPage, webPage } from "../content/schema";
import { enquireHref, routes, site } from "../content/site";
import { lines } from "../content/catalogue";
import { Shell } from "../components/Shell";
import { ScrollHero } from "../components/ScrollHero";
import { Arrow, Icon, type IconName } from "../components/ui";

/**
 * Home, kept to what a first-time visitor and a search engine need:
 *  1. the hero (a film played by scrolling; the name and its tagline are the page's h1);
 *  2. what we make: the three lines (construction chemicals, lubricants, aerosols), each with
 *     its brand's logo and its products by name, linking to the products (styles: app/home.css);
 *  3. industries we serve: the live site's four, each linking to its products;
 *  4. questions buyers ask, as an accordion (with the page's FAQPage structured data), only those
 *     whose answers are not already on the page;
 *  5. a simple enquiry panel: the heading, one line and Enquire now (the phone, email and
 *     WhatsApp are in the footer; the addresses on About and Contact).
 * Who we are lives on the About page, so it is not repeated here.
 */

/** The order the lines are shown in: construction first. */
const LINE_ORDER = ["construction", "lubricants", "aerosols"] as const;

const INDUSTRY_ICON: Record<string, IconName> = { "auto-assembly": "car", "auto-component": "gear", construction: "crane", paint: "spray" };
const LINE_SLUG: Record<string, string> = { lubricants: "lubricants", construction: "construction-chemicals", aerosols: "aerosols" };

export function HomePage() {
  const faq = site.pages.home.faq;
  // only questions whose answers are not already on the page: the products (cards above), the
  // industries (section above) and the addresses (About and Contact) are not asked again
  const questions = faq.items.filter((f) => !/office and factory|which industries|lubricants and oils|shuttering oil|aerosol sprays/i.test(f.q));
  const shown = LINE_ORDER.map((id) => lines.find((l) => l.id === id)).filter((l): l is (typeof lines)[number] => Boolean(l));
  return (
    <Shell current="home" schema={[webPage(seo.home), faqPage(seo.home.path, questions)]}>
      <ScrollHero />

      <section id="range" className="hm-make hm-soft" aria-labelledby="make-title">
        <div className="frame">
          <div className="hm-head hm-head-row">
            <div>
              <p className="hm-k">What we make</p>
              <h2 id="make-title" className="hm-h2">
                Three product lines, three brands.
              </h2>
            </div>
            <a href={routes.products} className="hm-all">
              View all products <Arrow />
            </a>
          </div>

          <ul className="hm-lines">
            {shown.map((l, i) => (
              <li key={l.id}>
                <a href={routes.line(l.slug)} className="hm-line">
                  <span className="hm-line-top">
                    <span className="hm-line-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.brand.logoFull ?? l.brand.logo ? (
                      <span className="hm-line-logo" title={`Brand: ${l.brand.name}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={l.brand.logoFull ?? l.brand.logo} alt={l.brand.name} loading="lazy" decoding="async" />
                      </span>
                    ) : (
                      <span className="hm-line-brand">{l.brand.name}</span>
                    )}
                  </span>
                  <h3>{l.title}</h3>
                  <span className="hm-line-items">
                    {l.strap.split("•").map((x) => (
                      <span key={x}>{x.trim()}</span>
                    ))}
                  </span>
                  <em>
                    View products <Arrow />
                  </em>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="industries" className="hm-make" aria-labelledby="ind-title">
        <div className="frame">
          <div className="hm-head">
            <div>
              <p className="hm-k">Industry we serve</p>
              <h2 id="ind-title" className="hm-h2">
                Delivering end to end lubricant solutions.
              </h2>
            </div>
          </div>
          <ul className="hm-inds">
            {site.industries.map((ind) => (
              <li key={ind.id} className="hm-ind">
                <span className="hm-ind-ic" aria-hidden="true">
                  <Icon name={INDUSTRY_ICON[ind.id] ?? "factory"} />
                </span>
                <h3>{ind.title}</h3>
                <p>{ind.body}</p>
                <a href={routes.line(LINE_SLUG[ind.line] ?? ind.line)} aria-label={`Read more: ${ind.title}`}>
                  Read more <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="hm-make" aria-labelledby="faq-title">
        <div className="frame hm-faq">
          <div className="hm-faq-head">
            <p className="hm-k">{faq.label}</p>
            <h2 id="faq-title" className="hm-h2">
              {faq.heading}
            </h2>
            <p className="hm-lead">{faq.lead}</p>
          </div>
          <div className="hm-faq-list">
            {questions.map((f, i) => (
              <details key={f.q} className="hm-q" open={i === 0}>
                <summary>
                  <span className="hm-q-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hm-q-t">{f.q}</span>
                  <span className="hm-q-ic" aria-hidden="true" />
                </summary>
                <div className="hm-q-a">
                  <p>{f.a}</p>
                  {"link" in f && f.link ? (
                    <a href={f.link.href}>
                      {f.link.label} <Arrow />
                    </a>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="hm-make hm-cta-sec" aria-labelledby="cta-title">
        <div className="frame">
          <div className="hm-cta">
            <div className="hm-cta-top">
              <div>
                <p className="hm-k hm-k-light">Enquiries</p>
                <h2 id="cta-title" className="hm-cta-h">
                  {site.contact.headline}
                </h2>
                <p className="hm-cta-p">Tell us the products, quantities and application, or the product you want made under your brand.</p>
              </div>
              <div className="hm-cta-btns">
                <a href={enquireHref("Enquiry")} className="hm-btn hm-btn-gold" data-enquire="Enquiry">
                  Enquire now <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
