import { enquireHref, routes, site } from "../content/site";
import { lines } from "../content/catalogue";
import { seo, trail } from "../content/pages";
import { breadcrumbs, webPage } from "../content/schema";
import { Shell } from "../components/Shell";
import { Breadcrumbs } from "../components/PageHeader";
import { Arrow, Glyph } from "../components/ui";
import { isPlaceholder } from "../content/placeholder";

/**
 * About (styles: app/about/about.css, all under .ab3): compact, four blocks, every fact said once.
 *
 *  1. Header: the headline and one line beside a photo of the plant, the four figures under them.
 *  2. Two tiles: who we are (with the markets) and the three ways to work with us.
 *  3. Leadership, vision & mission: the Director's photo and words, then the vision and
 *     the four commitments. The name, photo and message come from site.pages.about.leadership;
 *     until they are filled in, a plain portrait frame and the published fact about the
 *     Director's role are shown.
 *  4. What we make: the three lines (construction, lubricants, aerosols), each with its brand
 *     and its products, as text cards.
 *  5. Where we are: the office and the factory (phone and email are in the footer).
 */

const FIGURES = [
  { value: "70+", label: "Products" },
  { value: "1000+", label: "Happy clients" },
  { value: "ISO", label: "Certified company" },
  { value: "Pan-India", label: "All major states" },
];

const WAYS = [
  { n: "01", title: "Our formulations", body: "Products made to formulations developed by our own team." },
  { n: "02", title: "Your formulation", body: "Products made to the formulation you specify." },
  { n: "03", title: "Your brand", body: "Private label and tailor-made products for your brand." },
];

const MISSION = [
  { title: "Research & development", body: "Invest substantially in research and development." },
  { title: "Modern technology", body: "Keep acquiring modern technologies." },
  { title: "Reach", body: "Keep expanding geographically." },
  { title: "Support", body: "Comprehensive after-sales support for every client." },
];

/** The order the three lines are shown in: construction first. */
const LINE_ORDER = ["construction", "lubricants", "aerosols"] as const;

const MARKETS = ["Industrial", "Automotive", "Marine", "Construction", "Infrastructure", "Specialist sectors"];

export function AboutPage() {
  const c = site.contact;
  const t = trail.about;
  const lead = site.pages.about.leadership;
  const hasDirector = !isPlaceholder(lead.name);
  const hasPhoto = !isPlaceholder(lead.photo);
  const hasMessage = !isPlaceholder(lead.message);

  return (
    <Shell current="about" schema={[webPage(seo.about, "AboutPage"), breadcrumbs(t)]}>
      <div className="ab3">
        {/* 1. Header */}
        <section className="ab3-top" aria-labelledby="page-title">
          <div className="frame">
            <Breadcrumbs trail={t} />
            <div className="ab3-hero">
              <div className="ab3-hero-copy">
                <p className="ab3-k">About Krini Crude</p>
                <h1 id="page-title" className="ab3-title">
                  Pioneers in lubricants, construction chemicals <span>and aerosols.</span>
                </h1>
                <p className="ab3-sub">Premium industrial products, made at our own factory in Chennai.</p>
                <div className="ab3-actions">
                  <a href={enquireHref("Enquiry")} className="ab3-btn ab3-btn-gold" data-enquire="Enquiry">
                    Talk to our team <Arrow />
                  </a>
                  <a href={routes.products} className="ab3-btn ab3-btn-line">
                    View products <Arrow />
                  </a>
                </div>
              </div>
              <figure className="ab3-hero-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/manufacturing-169.webp" alt="Stainless-steel blending tanks on the manufacturing floor" width={1600} height={900} decoding="async" fetchPriority="high" />
              </figure>
            </div>
            <dl className="ab3-figures">
              {FIGURES.map((f) => (
                <div key={f.label}>
                  <dd>{f.value}</dd>
                  <dt>{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. Tiles: who we are, ways to work with us */}
        <section className="ab3-sec" aria-label="Who we are">
          <div className="frame ab3-bento">
            <article className="ab3-tile ab3-who">
              <p className="ab3-k">Who we are</p>
              <h2 className="ab3-h2">A distinguished reputation, built on extensive manufacturing experience.</h2>
              <p className="ab3-text">We make standard, speciality and niche-market products, to our own formulations and to yours.</p>
              <ul className="ab3-chips" aria-label="Markets we serve">
                {MARKETS.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </article>

            <article className="ab3-tile ab3-ways">
              <p className="ab3-k">Ways to work with us</p>
              <ol>
                {WAYS.map((w) => (
                  <li key={w.n}>
                    <span aria-hidden="true">{w.n}</span>
                    <h3>{w.title}</h3>
                    <p>{w.body}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        {/* 3. Leadership, vision & mission (white) */}
        <section className="ab3-lead" aria-labelledby="lead-title">
          <div className="frame">
            <div className="ab3-lead-top">
              <figure className={`ab3-portrait${hasPhoto ? "" : " is-empty"}`}>
                {hasPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(lead.photo)} alt={hasDirector ? String(lead.name) : `The ${lead.role} of Krini Crude`} width={800} height={1000} loading="lazy" decoding="async" />
                ) : (
                  <svg viewBox="0 0 120 150" aria-hidden="true">
                    <circle cx="60" cy="52" r="26" />
                    <path d="M14 150c0-30 20.6-50 46-50s46 20 46 50Z" />
                  </svg>
                )}
              </figure>
              <div className="ab3-lead-copy">
                <p className="ab3-k">Leadership</p>
                <h2 id="lead-title" className="ab3-lead-name">
                  {hasDirector ? String(lead.name) : `Our ${lead.role}`}
                </h2>
                <p className="ab3-lead-role">{lead.role}, Krini Crude</p>
                <span className="ab3-qmark" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="ab3-lead-text">
                  {hasMessage
                    ? String(lead.message)
                    : `Our ${lead.role} personally oversees Research & Development, leading a well-trained, technically strong team dedicated to innovation and excellence.`}
                </p>
              </div>
            </div>

            <div className="ab3-vm">
              <div className="ab3-vision">
                <p className="ab3-k">Our vision</p>
                <p className="ab3-vision-line">Innovation and excellence in manufacturing.</p>
              </div>
              <div className="ab3-mission">
                <p className="ab3-k">Our mission</p>
                <ol>
                  {MISSION.map((m, i) => (
                    <li key={m.title}>
                      <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <b>{m.title}</b>
                        <p>{m.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 4. What we make */}
        <section className="ab3-sec ab3-soft" aria-labelledby="make-title">
          <div className="frame">
            <div className="ab3-head">
              <div>
                <p className="ab3-k">What we make</p>
                <h2 id="make-title" className="ab3-h2">
                  Three product lines, three brands.
                </h2>
              </div>
              <a href={routes.products} className="ab3-link">
                View all products <Arrow />
              </a>
            </div>
            <ul className="ab3-lines">
              {LINE_ORDER.map((id) => lines.find((l) => l.id === id))
                .filter((l): l is (typeof lines)[number] => Boolean(l))
                .map((l, i) => (
                  <li key={l.id}>
                    <a href={routes.line(l.slug)} className="ab3-line">
                      <span className="ab3-line-top">
                        <span className="ab3-line-n" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {l.brand.logoFull ?? l.brand.logo ? (
                      <span className="ab3-line-logo" title={`Brand: ${l.brand.name}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={l.brand.logoFull ?? l.brand.logo} alt={l.brand.name} loading="lazy" decoding="async" />
                      </span>
                    ) : (
                      <span className="ab3-line-brand">{l.brand.name}</span>
                    )}
                      </span>
                      <b>{l.title}</b>
                      <span className="ab3-line-items">
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

        {/* 5. Where we are */}
        <section className="ab3-sec" aria-labelledby="visit-title">
          <div className="frame">
            <div className="ab3-head">
              <div>
                <p className="ab3-k">Where we are</p>
                <h2 id="visit-title" className="ab3-h2">
                  An office in Anna Nagar, a factory in Tiruverkadu.
                </h2>
              </div>
              <a href={enquireHref("Enquiry")} className="ab3-btn ab3-btn-dark" data-enquire="Enquiry">
                Enquire now <Arrow />
              </a>
            </div>
            <div className="ab3-visit">
              {[
                { label: "Office", lines: c.office, map: c.officeMap, glyph: "contact" as const },
                { label: "Factory", lines: c.factory, map: c.factoryMap, glyph: "services" as const },
              ].map((pl) => (
                <div key={pl.label} className="ab3-place">
                  <span className="ab3-place-ic" aria-hidden="true">
                    <Glyph name={pl.glyph} size={20} />
                  </span>
                  <div>
                    <p className="ab3-place-k">{pl.label}</p>
                    <address>{pl.lines.join(" ")}</address>
                  </div>
                  <a href={pl.map} target="_blank" rel="noopener noreferrer" aria-label={`Directions to our ${pl.label.toLowerCase()}`}>
                    Directions <Arrow />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
