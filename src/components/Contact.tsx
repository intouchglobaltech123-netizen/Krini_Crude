import { site } from "../content/site";
import type { Crumb } from "../content/pages";
import { EnquiryForm } from "./Enquiry";
import { Arrow, Fact, Glyph } from "./ui";

/**
 * Top of the Contact page: just the four ways to reach the team (call,
 * WhatsApp, email, visit) in one row, with the page's h1 kept for search
 * engines and screen readers only. The form and the addresses follow.
 */
export function ContactHero(_: { trail: Crumb[] }) {
  const p = site.pages.contact;
  const c = site.contact;
  const quick = [
    { glyph: "call" as const, label: "Call", value: c.phone, href: c.phoneHref },
    { glyph: "chat" as const, label: "WhatsApp", value: "Chat with us", href: c.whatsapp, external: true },
    { glyph: "mail" as const, label: "Email", value: c.email, href: `mailto:${c.email}` },
    { glyph: "route" as const, label: "Visit", value: "Anna Nagar East", href: c.officeMap, external: true },
  ];
  return (
    <section className="contact-hero relative isolate overflow-hidden" aria-labelledby="page-title">
      <div className="frame">
        {/* the page's heading, for search engines and screen readers; the page itself opens on the four ways to reach us */}
        <h1 id="page-title" className="sr-only">
          {p.heading}
        </h1>
        <ul className="quick" data-reveal>
          {quick.map((q) => (
            <li key={q.label}>
              <a href={q.href} className="quick-tile" {...(q.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="quick-icon">
                  <Glyph name={q.glyph} />
                </span>
                <span className="quick-label label">{q.label}</span>
                <span className="quick-value">{q.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The enquiry form (the live site's "Enquire Now", the same form as the
 * pop-up on other pages: src/components/Enquiry.tsx) and where to find us.
 * Enquire buttons on this page scroll to the form; links from other pages
 * without JavaScript arrive here as /contact?type=…&product=…#enquiry, and
 * what they are about goes into the message (interactions.ts).
 */
export function ContactMain({ endpoint = "" }: { endpoint?: string }) {
  const c = site.contact;
  const v = site.pages.contact.visit;
  return (
    <section id="details" className="section-tight" aria-label="Enquiry form and addresses">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="enquiry lg:col-span-7">
          <EnquiryForm id="enquiry" endpoint={endpoint} wide />
        </div>

        <aside className="visit lg:col-span-5 lg:col-start-8" aria-labelledby="visit-title" data-reveal>
          <p className="visit-k">Find us</p>
          <h2 id="visit-title" className="visit-title">
            {v.label}
          </h2>
          {[
            { label: "Office", lines: c.office, map: c.officeMap },
            { label: "Factory", lines: c.factory, map: c.factoryMap },
          ].map((pl) => (
            <div key={pl.label} className="visit-place">
              <span className="visit-icon" aria-hidden="true">
                <Glyph name="contact" size={20} />
              </span>
              <div>
                <p className="visit-label">{pl.label}</p>
                <address className="visit-addr">{pl.lines.join(" ")}</address>
                <a href={pl.map} className="visit-dir" target="_blank" rel="noopener noreferrer">
                  Get directions <Arrow />
                </a>
              </div>
            </div>
          ))}
          <div className="visit-place">
            <span className="visit-icon" aria-hidden="true">
              <Glyph name="clock" size={20} />
            </span>
            <div>
              <p className="visit-label">Office hours</p>
              <p className="visit-hours">
                <Fact value={c.hours} />
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/**
 * Contact, laid out as one split screen. On the left a dark panel: the page's
 * h1 and a line, the four ways to reach us as rows (call, WhatsApp, email,
 * visit), then the office, the factory and the hours. On the right the enquiry
 * form on white. Enquire buttons elsewhere arrive at #enquiry (the form).
 */
export function ContactSplit({ endpoint = "" }: { endpoint?: string }) {
  const p = site.pages.contact;
  const c = site.contact;
  const ways = [
    { glyph: "call" as const, label: "Call us", value: c.phone, href: c.phoneHref },
    { glyph: "chat" as const, label: "WhatsApp", value: "Chat with the team", href: c.whatsapp, external: true },
    { glyph: "mail" as const, label: "Email", value: c.email, href: `mailto:${c.email}` },
  ];
  const places = [
    { label: "Office", lines: c.office, map: c.officeMap },
    { label: "Factory", lines: c.factory, map: c.factoryMap },
  ];
  return (
    <section className="cx" aria-labelledby="page-title">
      <div className="frame cx-grid">
        <div className="cx-side">
          <p className="cx-k">{p.label}</p>
          <h1 id="page-title" className="cx-title">
            Let&rsquo;s talk.
          </h1>
          <p className="cx-lead">{p.lead}</p>

          <ul className="cx-ways">
            {ways.map((w) => (
              <li key={w.label}>
                <a href={w.href} className="cx-way" {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="cx-way-icon" aria-hidden="true">
                    <Glyph name={w.glyph} size={20} />
                  </span>
                  <span className="cx-way-text">
                    <span className="cx-way-label">{w.label}</span>
                    <span className="cx-way-value">{w.value}</span>
                  </span>
                  <Arrow className="cx-way-arrow" />
                </a>
              </li>
            ))}
          </ul>

          <div className="cx-places">
            {places.map((pl) => (
              <div key={pl.label} className="cx-place">
                <p className="cx-place-k">{pl.label}</p>
                <address className="cx-place-addr">{pl.lines.join(" ")}</address>
                <a href={pl.map} className="cx-place-dir" target="_blank" rel="noopener noreferrer">
                  Directions <Arrow />
                </a>
              </div>
            ))}
          </div>
          <p className="cx-hours">
            <Glyph name="clock" size={18} />
            <span>
              Office hours <strong>
                <Fact value={c.hours} />
              </strong>
            </span>
          </p>
        </div>

        <div className="cx-form" id="details">
          <EnquiryForm id="enquiry" endpoint={endpoint} wide />
        </div>
      </div>
    </section>
  );
}

/** The factory on a map, full width under the split screen. */
export function ContactMap() {
  const c = site.contact;
  // the factory's own pin (site.contact.factoryGeo), so the map opens exactly on it
  const q = `${c.factoryGeo.lat},${c.factoryGeo.lng}`;
  return (
    <section className="cx-map" aria-label="Map to our factory">
      <div className="frame">
        <div className="cx-map-frame">
          <iframe
            title="Krini Crude factory, Vilangadupakkam, near Madhavaram, Chennai, on Google Maps"
            src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a href={c.factoryMap} className="cx-map-card" target="_blank" rel="noopener noreferrer">
            <span className="cx-map-k">Factory · Near Madhavaram</span>
            <span className="cx-map-v">Open in Google Maps</span>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

