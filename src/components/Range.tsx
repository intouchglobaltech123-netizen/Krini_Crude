import { site } from "../content/site";
import { Arrow, SectionHead, Whole } from "./ui";
import { SwipeUI } from "./Swipe";

/**
 * Home, right after the hero: lubricants, greases and aerosols, the three
 * things its film shows. Beside the heading, a line naming the range product by
 * product and where it is made (the page's plainest statement of what Krini
 * Crude makes, for people and for search). Each card opens on a still from its moment in the
 * film, then the name, the series, the live site's line and a spec plate of
 * the range (products and grades as published on krinicrude.com; each name
 * links to its product), and a link to the line. Three side by side from
 * 1024px, a row to swipe on phones.
 */
export function Range() {
  const r = site.pages.home.range;
  const count = String(r.families.length).padStart(2, "0");
  return (
    <section id="range" className="section range" aria-labelledby="range-title">
      <div className="frame">
        <SectionHead>{r.label}</SectionHead>
        <div className="range-head">
          <h2 id="range-title" className="display text-display-wide" data-split>
            {r.heading[0]}{" "}
            <br />
            {r.heading[1]}
          </h2>
          <p className="range-lead" data-reveal>
            <Whole>{r.lead}</Whole>
          </p>
        </div>
        <ul className="range-grid m-swipe" data-swipe>
          {r.families.map((f, i) => (
            <li key={f.id} className="range-card" data-reveal>
              <div className="range-media overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image}
                  alt={f.alt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                />
              </div>
              <div className="range-body">
                <p className="range-index label tabular-nums">
                  <span className="text-amber">{String(i + 1).padStart(2, "0")}</span> / {count}
                </p>
                <h3 className="range-name display-tight">{f.name}</h3>
                <p className="range-series label">{f.series}</p>
                <p className="range-line">{f.line}</p>
                <dl className="range-spec">
                  {f.rows.map((row) => (
                    <div key={row.label} className="range-row">
                      <dt className="label">
                        <a href={row.href}>{row.label}</a>
                      </dt>
                      <dd>
                        {row.values.map((v) => (
                          <span key={v} className="grade">
                            {v}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
                <a href={f.href} className="range-link label">
                  {f.link} <Arrow />
                </a>
              </div>
            </li>
          ))}
        </ul>
        <SwipeUI count={r.families.length} label="product family" />
      </div>
    </section>
  );
}
