import { site } from "../content/site";
import { heroSeq } from "../content/media";
import { Arrow, Name } from "./ui";

/** The steps as named on the rail beside the hero (the name, then the five stages of the build); where each starts in the scroll is heroSeq.beats. */
const STEPS = ["Krini Crude", ...site.film.stages.map((s) => s.rail)];
/** Phones, under the buttons: three of the live site's figures (site.stats). */
const [productsStat, , clientsStat] = site.stats;
const OPEN_STATS = [
  { value: `${productsStat?.value ?? 70}${productsStat?.suffix ?? "+"}`, label: "Products" },
  { value: `${clientsStat?.value ?? 1000}${clientsStat?.suffix ?? "+"}`, label: "Happy clients" },
  { value: "ISO", label: "Certified" },
];

/**
 * Home's hero: a building going up from bare land, played by scrolling (a Google Flow film,
 * src/content/media.ts heroSeq; src/motion/scrollhero.ts draws it on a canvas). No people:
 * everything moves by itself. The scroll picks the film's frame and the step whose words are
 * shown: the name over the empty plot, then one screen per stage of the build (site.film.stages),
 * each opening close on where a Krini Crude product is at work (lubricants in the excavator,
 * shuttering oil, aluminium formwork release, precast mould release, anti-spatter and colour
 * sprays) with the product named, and last the finished building under the promise and the
 * buttons. The rail on the right names every stage and jumps to it. On an upright phone the film
 * plays as a video at the top of one screen, the stage on screen named over it (.sh-chip). With
 * reduced motion or without JavaScript the hero is one screen: the finished building, the name,
 * the promise and the buttons. Docs: docs/HERO.md.
 */
export function ScrollHero() {
  const { film } = site;
  const stages = film.stages;
  const total = String(stages.length).padStart(2, "0");
  return (
    <section id="top" className="sh theme-navy" data-hero data-scrollhero aria-labelledby="hero-title" suppressHydrationWarning>
      <div className="sh-stage" data-sh-stage>
        <picture className="sh-still" aria-hidden="true">
          <source media="(max-aspect-ratio: 4/5)" srcSet={heroSeq.endTall} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroSeq.end} alt="" width={heroSeq.width} height={heroSeq.height} decoding="async" fetchPriority="high" />
        </picture>
        <canvas className="sh-canvas" data-sh-canvas aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sh-mark" data-sh-mark src={heroSeq.mark.src} alt="" width={35} height={17} aria-hidden="true" />
        <div className="sh-scrim" aria-hidden="true" />
        {/* phones: the film plays on its own, so the stage on screen is named over it */}
        <p className="sh-chip label" aria-hidden="true">
          {stages.map((st, i) => (
            <span key={st.name} data-sh-chip={i + 1}>
              <b>{String(i + 1).padStart(2, "0")}</b> {st.name}
            </span>
          ))}
        </p>

        <div className="sh-words frame">
          <div className="sh-step sh-open is-on" data-sh-step="0">
            <h1 id="hero-title" className="sh-title">
              <span className="sh-kicker label">{film.kicker}</span>{" "}
              <span className="sh-name display">
                <Name />
              </span>{" "}
              <span className="sh-tagline">{film.tagline}</span>
            </h1>
            <p className="sh-motto">{film.motto}</p>
            {/* phones: the film plays as a video on one screen, so the buttons sit here */}
            <div className="sh-open-ctas">
              <a href={film.ctas.primary.href} className="btn btn-primary">
                {film.ctas.primary.label} <Arrow />
              </a>
              <a href={film.ctas.secondary.href} className="btn btn-ghost">
                {film.ctas.secondary.label} <Arrow />
              </a>
            </div>
            <dl className="sh-open-stats">
              {OPEN_STATS.map((st) => (
                <div key={st.label}>
                  <dt>{st.label}</dt>
                  <dd>{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* the build, one stage a screen: the stage's number and name over the film */}
          {stages.slice(0, -1).map((st, i) => (
            <div key={st.name} className="sh-step sh-build" data-sh-step={i + 1}>
              <p className="sh-count label">
                <span className="text-amber">Stage {String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true"> / {total}</span>
              </p>
              <h2 className="sh-big display-tight">{st.name}</h2>
              {st.product ? (
                <p className="sh-product">
                  <span className="sh-product-k label">Krini product</span>
                  <span className="sh-product-v">{st.product}</span>
                </p>
              ) : null}
              <p className="sh-body">{st.line}</p>
              {"link" in st && st.link ? (
                <a href={st.link.href} className="sh-link label">
                  {st.link.label} <Arrow />
                </a>
              ) : null}
            </div>
          ))}

          <div className="sh-step sh-end" data-sh-step={stages.length}>
            <p className="sh-count label">
              <span className="text-amber">Stage {total}</span>
              <span aria-hidden="true"> / {total}</span>
              <span> · {stages[stages.length - 1].name}</span>
            </p>
            <p className="sh-big display-tight">{film.promise}</p>
            <p className="sh-body">{stages[stages.length - 1].line}</p>
            <div className="sh-ctas">
              <a href={film.ctas.primary.href} className="btn btn-primary" data-magnetic>
                {film.ctas.primary.label} <Arrow />
              </a>
              <a href={film.ctas.secondary.href} className="btn btn-ghost" data-magnetic>
                {film.ctas.secondary.label} <Arrow />
              </a>
            </div>
          </div>
        </div>

        {/* in the middle at the foot of the first screen: keep scrolling */}
        <div className="sh-scroll" aria-hidden="true">
          <span className="sh-mouse">
            <span className="sh-wheel" />
          </span>
          <span className="sh-scroll-text">Scroll to see it built</span>
          <svg className="sh-chev" width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1 1.5 7 7.5l6-6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>

        {/* where the visitor is: one mark per step, each a way to jump there */}
        <nav className="sh-rail" aria-label="Hero steps">
          <ol>
            {STEPS.map((s, i) => (
              <li key={s}>
                <button type="button" className={`sh-tick${i === 0 ? " is-on" : ""}`} data-sh-tick={i} aria-label={`Step ${i + 1}: ${s}`}>
                  <span className="sh-tick-name label">{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="sh-bar" aria-hidden="true">
          <span data-sh-bar />
        </div>
        {/* phones: at the foot of the one-screen hero, a nudge to scroll on */}
        <div className="sh-down" aria-hidden="true">
          <span>Scroll</span>
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1 1.5 7 7.5l6-6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
