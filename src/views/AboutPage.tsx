import { enquireHref, routes, site } from "../content/site";
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
 *  4. Where we are: the office and the factory (phone and email are in the footer).
 * The three product lines are shown on the home page, so they are not repeated here.
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
  { title: "Listen first", body: "We learn what your site, machine or product really needs." },
  { title: "Make it to fit", body: "We make or adjust the product to match that need." },
  { title: "Deliver on time", body: "The right quantity and pack, when you need it." },
  { title: "Stay with you", body: "Help after delivery, and quick answers when anything changes." },
];

/** The markets, each with a small line icon (24 x 24, drawn in the current colour). */
const MARKETS: { name: string; icon: string }[] = [
  { name: "Industrial", icon: "M3 20h18M4 20V10l5 3v-3l5 3V7h6v13M17 7V4h2v3M8 17h2M13 17h2" },
  { name: "Automotive", icon: "M3 13l2-5.2A2 2 0 0 1 6.9 6.5h10.2a2 2 0 0 1 1.9 1.3L21 13v4h-2.2M5.2 17H3v-4h18M3 13h18M7 17a2 2 0 1 0 0-.01M17 17a2 2 0 1 0 0-.01" },
  { name: "Marine", icon: "M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 8v13M8 11.5h8M4 14c0 4 3.6 7 8 7s8-3 8-7M4 14l-1.5 1.5M4 14l1.8 1.2M20 14l1.5 1.5M20 14l-1.8 1.2" },
  { name: "Construction", icon: "M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M10 8.4V6a2 2 0 0 1 4 0v2.4M9 18v-4M15 18v-4" },
  { name: "Infrastructure", icon: "M2 18h20M4 18v-6M20 18v-6M2 12c4 0 6.5-5 10-5s6 5 10 5M8 18v-7.5M16 18v-7.5M12 18V7" },
  { name: "Specialist sectors", icon: "M9 3h6M10 3v6.2L4.8 18.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9.2V3M7.3 15h9.4" },
];

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
              <p className="ab3-text">We make standard, speciality and niche-market products.</p>
              <ul className="ab3-chips" aria-label="Markets we serve">
                {MARKETS.map((m) => (
                  <li key={m.name}>
                    <svg className="ab3-chip-ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={m.icon} />
                    </svg>
                    {m.name}
                  </li>
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
                <p className="ab3-vision-line">Your need comes first: the right product, made for your work.</p>
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

        {/* 4. Where we are */}
        <section className="ab3-sec ab3-soft" aria-labelledby="visit-title">
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
