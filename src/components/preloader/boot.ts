export type PreloaderOptions = {
  /** sessionStorage key that marks the screen as seen in this tab. */
  key: string;
  /** Show it once per tab (true) or on every full page load (false). */
  once: boolean;
  /** Show it only when the page is refreshed (reloaded), not on a first visit or a typed address. */
  onlyReload?: boolean;
  /** Shortest time on screen: long enough for the drop to fall and the logo to rise. */
  minMs: number;
  /** Longest time on screen, however slow the page is. */
  maxMs: number;
  /** The Krini Crude logo, which rises out of the oil. */
  logo: string;
};

/**
 * The loading screen, shown when the page is refreshed: on white, a single
 * drop of gold oil falls onto a still surface, ripples spread out from where it
 * lands, and the Krini Crude logo rises out of the surface. Then the screen fades
 * away. The motion is all CSS (preloader.css); this script only puts the
 * screen up, holds the page still, and takes the screen down when the page
 * has loaded (never sooner than minMs, never later than maxMs).
 *
 * Runs as an inline script at the top of <body> (Preloader.tsx), before React
 * and the page's bundles arrive, so the screen is up from the first paint. It
 * builds its own element, <kc-preloader>, as a direct child of <body>: React
 * skips nodes it doesn't recognise there when it hydrates, so the screen can
 * come and go without React ever owning it.
 *
 * It fires "preloader:lift" on window as it starts to fade and
 * "preloader:done" once it is gone. Add ?intro to the address to see it
 * without refreshing.
 *
 * This function is serialised with Function#toString into the inline script,
 * so it must stay self-contained: no imports, nothing from outside its body.
 */
export function bootPreloader(o: PreloaderOptions): void {
  const d = document;
  const w = window;

  const forced = /[?&]intro(?:[=&]|$)/.test(location.search);
  if (o.onlyReload && !forced) {
    let kind = "";
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      kind = nav ? nav.type : (performance as unknown as { navigation?: { type: number } }).navigation?.type === 1 ? "reload" : "";
    } catch {
      /* no timing: treat as not a refresh */
    }
    if (kind !== "reload") return;
  }
  try {
    if (o.once && !forced && sessionStorage.getItem(o.key)) return;
  } catch {
    /* storage blocked: show it */
  }

  const reduce = w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minMs = reduce ? Math.min(500, o.minMs) : o.minMs;
  const t0 = performance.now();

  // ---- the screen: the drop and its ripples (SVG), and the logo rising from the surface
  let rings = "";
  for (let i = 0; i < 4; i++) rings += `<ellipse class="kc-ring" style="--i:${i}" cx="160" cy="124" rx="150" ry="24"/>`;
  const el = d.createElement("kc-preloader");
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading Krini Crude");
  el.innerHTML =
    // the page can't scroll while the screen is up, and its scrollbar stays out of the picture
    `<style>html{overflow:hidden!important}</style>` +
    `<div class="kc-pre__stage" aria-hidden="true">` +
    `<svg class="kc-pre__svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" focusable="false">` +
    `<defs><linearGradient id="kc-pre-oil" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#ffd54f"/><stop offset=".6" stop-color="#ffc107"/><stop offset="1" stop-color="#ffb300"/>` +
    `</linearGradient></defs>` +
    rings +
    `<path class="kc-drop-fall" d="M0 -16C5 -7 10 -1 10 5A10 10 0 0 1 -10 5C-10 -1 -5 -7 0 -16Z" fill="url(#kc-pre-oil)"/>` +
    `</svg>` +
    `<div class="kc-pre__rise"><img src="${o.logo}" alt="" width="739" height="220" decoding="async" fetchpriority="high"></div>` +
    `</div>`;
  d.body.appendChild(el);

  // ---- hold the page still (Lenis listens for wheel and touch on window too)
  const scrollKeys = /^(?: |Spacebar|PageUp|PageDown|Home|End|ArrowUp|ArrowDown)$/;
  const block = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  const onKey = (e: KeyboardEvent) => {
    if (scrollKeys.test(e.key)) block(e);
  };
  const hold = { capture: true, passive: false };
  w.addEventListener("wheel", block, hold);
  w.addEventListener("touchmove", block, hold);
  w.addEventListener("keydown", onKey, true);
  let held = true;
  const release = () => {
    if (!held) return;
    held = false;
    w.removeEventListener("wheel", block, hold);
    w.removeEventListener("touchmove", block, hold);
    w.removeEventListener("keydown", onKey, true);
    // the scrollbar comes back and the page narrows by its width: have everything that measured
    // the page meanwhile (ScrollTrigger, the hero's canvas, fitted headings) measure again
    const wide = d.documentElement.clientWidth;
    el.querySelector("style")?.remove();
    if (d.documentElement.clientWidth !== wide) w.dispatchEvent(new Event("resize"));
  };

  // ---- take it down once the page has loaded, within [minMs, maxMs]
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    try {
      sessionStorage.setItem(o.key, "1");
    } catch {
      /* fine: it shows again next time */
    }
    w.setTimeout(
      () => {
        release();
        el.classList.add("is-lift");
        w.dispatchEvent(new Event("preloader:lift"));
        w.setTimeout(
          () => {
            el.remove();
            w.dispatchEvent(new Event("preloader:done"));
          },
          reduce ? 300 : 450,
        );
      },
      reduce ? 0 : 150,
    );
  };
  const whenLoaded = () => {
    const wait = Math.max(0, minMs - (performance.now() - t0));
    w.setTimeout(finish, wait);
  };
  if (d.readyState === "complete") whenLoaded();
  else w.addEventListener("load", whenLoaded, { once: true });
  // however slow the page is, it never holds the visitor longer than maxMs
  w.setTimeout(finish, Math.max(minMs, o.maxMs));
}
