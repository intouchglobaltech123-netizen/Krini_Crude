import { enquireHref, site } from "../content/site";
import { Arrow, Fact, Icon, SectionHead, type IconName } from "./ui";

/**
 * The Services page's sections: the production hall, what we do, private
 * label step by step and the ways to work with us. The hall opens like a
 * roller shutter and eases back as it crosses the screen; the icons draw
 * themselves (src/motion/cinema.ts). An oil line runs through the private
 * label steps and fills as they scroll past, lighting each step as the oil
 * reaches it (src/motion/interactions.ts, initPipeline).
 */

/** The production hall, full width: one still per frame shape (4:3, 16:9, 21:9), so the frame never crops it. */
export function ServicesHall() {
  return (
    <figure className="pb-4">
      <div className="media relative mx-auto aspect-[4/3] w-full max-w-[1600px] sm:aspect-[16/9] lg:aspect-[21/9]" data-shutter data-zoom-frame>
        <picture>
          <source media="(min-width: 1024px)" srcSet="/images/factory/hall-219.webp" />
          <source media="(min-width: 640px)" srcSet="/images/factory/hall-169.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/factory/aerosol-43.webp"
            alt="The aerosol filling hall at our factory: compressor, air receiver, filters and filling machines"
            width={1200}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
        </picture>
      </div>
      <figcaption className="frame mt-4 flex items-center justify-between">
        <span className="label text-mute">Production hall, Tiruverkadu</span>
      </figcaption>
    </figure>
  );
}

/**
 * The five services as picture cards, with a sixth card to get in touch: two
 * columns on phones and tablets, three from 1024px. Each picture keeps its own
 * 4:3 shape (never cropped, so its watermark stays whole) and carries the
 * service's number. On phones a card keeps to a short line; the description
 * shows from 640px and what the service covers from 768px. "Enquire" opens
 * the Contact form with the right kind of enquiry chosen.
 */
export function ServicesList({ label, heading }: { label: string; heading: string }) {
  const s = site.services;
  return (
    <section id="what-we-do" className="section" aria-labelledby="what-title">
      <div className="frame">
        <SectionHead>{label}</SectionHead>
        <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-12">
          <h2 id="what-title" className="display text-display-sm lg:col-span-7" data-split>
            {heading}
          </h2>
          <p className="max-w-md self-end text-mute lg:col-span-4 lg:col-start-9" data-reveal>
            {s.lead}
          </p>
        </div>
        <ol className="svc-grid mt-12 lg:mt-20">
          {s.items.map((c, i) => (
            <li key={c.title} className="svc-card group" data-reveal>
              <div className="svc-media media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.imageAlt} width={1200} height={900} loading="lazy" decoding="async" className="block aspect-[4/3] h-auto w-full object-cover" />
                <span className="svc-num label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="svc-body">
                <span className="svc-icon" data-draw>
                  <Icon name={c.icon as IconName} />
                </span>
                <h3 className="svc-title display-tight">{c.title}</h3>
                <p className="svc-short">{c.short}</p>
                <p className="svc-text">{c.body}</p>
                <ul className="ticks svc-more">
                  {c.more.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                {"detail" in c ? (
                  <p className="svc-detail">
                    <Fact value={c.detail} />
                  </p>
                ) : null}
                <a href={enquireHref(c.enquire)} className="svc-enquire label" data-enquire={c.enquire} aria-label={`Enquire about ${c.title.toLowerCase()}`}>
                  Enquire <Arrow />
                </a>
              </div>
            </li>
          ))}
          <li className="svc-card svc-cta" data-reveal>
            <p className="label text-amber">Enquiries</p>
            <p className="svc-cta-title display-tight">Tell us what you need.</p>
            <p className="svc-short svc-cta-text">Products and quantities, a formulation, or a product under your brand.</p>
            <a href={enquireHref("Enquiry")} className="btn btn-primary svc-cta-btn" data-enquire="Enquiry" data-magnetic>
              Enquire <Arrow />
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}

/**
 * Home: the five services as tiles pointing to the Services page: two columns
 * on phones (the fifth across both), three from 640px, five in a row from
 * 1024px. On phones a tile keeps to a short line.
 */
export function ServicesStrip() {
  const s = site.services;
  return (
    <ul className="svc-strip">
      {s.items.map((c, i) => (
        <li key={c.title} className="svc-tile group" data-reveal>
          <div className="svc-tile-top">
            <span className="svc-icon" data-draw>
              <Icon name={c.icon as IconName} />
            </span>
            <span className="label text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="svc-tile-title display-tight">{c.title}</h3>
          <p className="svc-short">{c.short}</p>
          <p className="svc-text">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** Private label: what it is, a way to discuss it, and the sectors we make for. */
export function PrivateLabel({ label, heading }: { label: string; heading: readonly string[] }) {
  const pl = site.services.privateLabel;
  return (
    <section id="private-label" className="section theme-navy" aria-labelledby="pl-title">
      <div className="frame">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-amber" data-reveal>
              {label}
            </p>
            <h2 id="pl-title" className="display mt-6 text-display-sm lg:text-h" data-split>
              {heading[0]}{" "}
              <br />
              {heading[1]}
            </h2>
          </div>
          <div className="self-end lg:col-span-4 lg:col-start-9" data-reveal>
            <p className="text-mute">{pl.lead}</p>
            <a href={enquireHref("Private label")} className="btn btn-primary mt-8" data-enquire="Private label" data-magnetic>
              Discuss private label <Arrow />
            </a>
          </div>
        </div>

        <div className="mt-14 lg:mt-20">
          <p className="label text-mute" data-reveal>
            Sectors we manufacture for
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Private label sectors" data-chips>
            {pl.sectors.map((sec) => (
              <li key={sec} className="chip">
                {sec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Three ways to work with Krini Crude. */
export function Ways({ label, heading }: { label: string; heading: string }) {
  return (
    <section id="ways" className="section border-t border-bone/10" aria-labelledby="ways-title">
      <div className="frame">
        <SectionHead>{label}</SectionHead>
        <h2 id="ways-title" className="display mt-12 max-w-[20ch] text-display-sm lg:mt-20" data-split>
          {heading}
        </h2>
        <ol className="cells mt-16 md:grid-cols-3 lg:mt-24">
          {site.services.ways.map((w, i) => (
            <li key={w.title} className="cell flex flex-col" data-reveal>
              <p className="label text-amber tabular-nums">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display-tight mt-6 text-2xl leading-tight">{w.title}</h3>
              <p className="mt-4 flex-1 text-mute">{w.body}</p>
              <a href={w.href} className="label mt-10 inline-flex items-center gap-3 text-bone hover:text-amber">
                {w.cta} <Arrow />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
