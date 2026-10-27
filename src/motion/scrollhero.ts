import { prefersReducedMotion, type Disposer } from "./env";
import type { Scroller } from "./smooth";
import { heroSeq } from "../content/media";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Home's hero (ScrollHero.tsx): the stage stays on screen while its section
 * scrolls past; the scroll position (p, 0 → 1) picks the film's frame, drawn
 * on a canvas to cover the screen, and the step whose words are shown. The
 * film holds its first frame for the first heroSeq.lead of the scroll (the
 * name), plays to heroSeq.hold, and its last frame stays for the rest; each
 * step starts at its moment in the film (heroSeq.beats). On a screen narrower
 * than the film the crop follows its subject (heroSeq.focus).
 *
 * The frames come in sheets (heroSeq.perSheet frames stacked top to bottom
 * in one image), loaded coarse to fine (every 8th sheet, then every 4th, …)
 * so any scroll position soon has a sheet near it. Between two frames the
 * canvas blends them, so the film runs smoothly at a low frame rate. Until a
 * frame's sheet is in, the nearest loaded frame is drawn.
 *
 * Flow's watermark is always on screen once and whole: the footage's own, or,
 * when the crop leaves it out, the same mark in the stage's corner. With
 * reduced motion the hero stays one screen (CSS).
 */
export function initScrollHero(d: Disposer, scroller: Scroller) {
  const root = document.querySelector<HTMLElement>("[data-scrollhero]");
  const stage = root?.querySelector<HTMLElement>("[data-sh-stage]");
  const canvas = root?.querySelector<HTMLCanvasElement>("[data-sh-canvas]");
  if (!root || !stage || !canvas) return;
  /** A phone held upright (the same test as `band` below, before the stage is measured). */
  const phoneNow = () => stage.clientWidth < 640 && stage.clientHeight > stage.clientWidth;
  // reduced motion: bigger screens show the still; a phone still shows the film, but it waits for a
  // tap on its play button instead of starting by itself
  const reduced = prefersReducedMotion();
  if (reduced && !phoneNow()) {
    root.classList.add("is-still");
    return;
  }
  const waitForTap = reduced;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const hero: HTMLElement = root;
  /** The hero plays its film as a video on every screen (one screen, no scrolling through it). */
  const filmMode = true;
  root.classList.add("is-live");

  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-sh-step]"));
  const ticks = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-sh-tick]"));
  const bar = root.querySelector<HTMLElement>("[data-sh-bar]");
  const mark = root.querySelector<HTMLElement>("[data-sh-mark]");
  const { frames: n, fps, perSheet, width: FW, height: FH, lead, hold } = heroSeq;
  const length = n / fps;
  /** The scroll share (0 → 1) at which the film shows second s. */
  const atSecond = (s: number) => lead + (s / length) * (hold - lead);
  const starts = heroSeq.beats.map((b, i) => (i === 0 ? 0 : atSecond(b)));
  /** Where the subject sits across the frame at second s: between the keyframes, eased. */
  const focusAt = (s: number) => {
    const keys = heroSeq.focus;
    if (s <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [s1, x1] = keys[i];
      if (s <= s1) {
        const [s0, x0] = keys[i - 1];
        const u = (s - s0) / (s1 - s0);
        return x0 + (x1 - x0) * u * u * (3 - 2 * u);
      }
    }
    return keys[keys.length - 1][1];
  };
  const sheetCount = Math.ceil(n / perSheet);

  // ---- the sheets, coarse to fine
  const sheets: (HTMLImageElement | null)[] = new Array(sheetCount).fill(null);
  const order: number[] = [];
  for (let stride = 8; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let i = 0; i < sheetCount; i += stride) if (!order.includes(i)) order.push(i);
  }
  if (!order.includes(sheetCount - 1)) order.splice(1, 0, sheetCount - 1);
  let next = 0;
  let inflight = 0;
  let alive = true;
  d.add(() => {
    alive = false;
  });
  const loadMore = () => {
    while (alive && next < order.length && inflight < 3) {
      const k = order[next++];
      const im = new Image();
      im.decoding = "async";
      inflight++;
      im.onload = () => {
        inflight--;
        sheets[k] = im;
        last = -1; // redraw: this sheet may hold a nearer frame
        queue();
        loadMore();
      };
      im.onerror = () => {
        inflight--;
        loadMore();
      };
      im.src = heroSeq.sheet(k);
    }
  };
  const has = (f: number) => Boolean(sheets[Math.floor(f / perSheet)]);
  /** The nearest frame to f whose sheet is in. */
  const nearest = (f: number) => {
    for (let o = 0; o < n; o++) {
      if (f - o >= 0 && has(f - o)) return f - o;
      if (f + o < n && has(f + o)) return f + o;
    }
    return -1;
  };

  // ---- the stage's size and the crop
  let W = 0;
  let H = 0;
  let dpr = 1;
  /**
   * A phone held upright: one screen, the whole film playing as a video just under the top bar,
   * the full width of the screen and never cropped (filmH = the width at the film's 16:9), with the
   * stage's name, the words and the buttons under it (the client, October 2026).
   */
  let band = false;
  /** An upright phone with the portrait film (heroSeq.tall): the film fills the whole screen, the words over its foot. */
  let tall = false;
  /**
   * A tablet (a touch screen wider than a phone, or any screen under 1025px wide that is not an
   * upright phone): the film plays through by itself, once, like on a phone, and the page scrolls
   * freely; only computers with a mouse or trackpad play it part by part, one part per scroll
   * (the client, October 2026). An upright tablet plays the portrait film.
   */
  let tablet = false;
  let tabTall = false;
  let filmH = 0;
  let filmTop = 0;
  const measure = () => {
    W = stage.clientWidth;
    H = stage.clientHeight;
    band = W < 640 && H > W;
    tall = band && Boolean(heroSeq.tall.video);
    tablet = !band && (window.matchMedia("(pointer: coarse)").matches || W < 1025);
    tabTall = tablet && H > W && Boolean(heroSeq.tall.video);
    root.classList.toggle("is-tablet", tablet);
    root.classList.toggle("is-band", band);
    root.classList.toggle("is-tall", tall);
    root.classList.toggle("is-film", !band);
    // on a phone: the whole film, uncropped, from just under the top bar
    const barBottom = document.querySelector<HTMLElement>("[data-nav] .nav-main")?.getBoundingClientRect().bottom || 80;
    filmTop = band && !tall ? Math.round(clamp(barBottom + 10, 60, 140)) : 0;
    filmH = band && !tall ? Math.round((W * FH) / FW) : H;
    root.style.setProperty("--sh-bar-bottom", `${Math.round(barBottom)}px`);
    root.style.setProperty("--sh-film-top", `${filmTop}px`);
    root.style.setProperty("--sh-film-h", `${filmH}px`);
    root.style.setProperty("--sh-band-top", `${filmTop}px`);
    root.style.setProperty("--sh-band-bottom", `${filmTop + filmH}px`);
    // the words sit low on the screen, but never closer than 66px under the film (its stage's name
    // goes in between); on a short phone they follow straight on under it
    const wordsH = root.querySelector<HTMLElement>(".sh-open")?.offsetHeight || 300;
    // midway between the stage's name (under the film) and "Scroll" (at the foot of the screen)
    root.style.setProperty(
      "--sh-open-top",
      tall
        ? // the portrait film fills the screen: the words sit low over its foot, just above the
          // small gold arrow at the very bottom (moved down, the client, October 2026)
          `${Math.round(Math.max(barBottom + 90, H - 34 - wordsH))}px`
        : `${Math.round(Math.max(filmTop + filmH + 66, (filmTop + filmH + 52 + H - 64 - wordsH) / 2))}px`,
    );
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    last = -1;
  };

  // ---- the words and the rail
  let step = -1;
  const setStep = (k: number) => {
    if (k === step) return;
    step = k;
    steps.forEach((s, i) => s.classList.toggle("is-on", i === k));
    ticks.forEach((t, i) => {
      t.classList.toggle("is-on", i === k);
      if (i === k) t.setAttribute("aria-current", "step");
      else t.removeAttribute("aria-current");
    });
    root.dataset.step = String(k);
    // the bar with the logo stays in view from the first screen
    nav?.classList.remove("is-hidden");
  };
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (nav) {
    d.on(nav, "focusin", () => nav.classList.remove("is-hidden"));
    d.add(() => nav.classList.remove("is-hidden"));
  }

  const paint = (f: number, alpha: number, dx: number, dy: number, dw: number, dh: number) => {
    const im = sheets[Math.floor(f / perSheet)]!;
    const sy = (f % perSheet) * FH;
    ctx.globalAlpha = alpha;
    ctx.drawImage(im, 0, sy, FW, FH, dx, dy, dw, dh);
  };

  let last = -1;
  let raf = 0;
  /** Opened from a link to Home: the last screen, shown as the sharp still. */
  let arrived = false;
  const draw = () => {
    raf = 0;
    let t: number;
    if (band) {
      // a phone held upright: one screen; the film plays as a video (below), not from the sheets
      setStep(0);
      root.classList.remove("at-end");
      return;
    }
    // wider screens: one screen too, the film playing as a video; its time picks the words
    if (filmMode) return;
    {
      const total = root.offsetHeight - H;
      const p = total > 0 ? clamp(-root.getBoundingClientRect().top / total) : 0;
      let k = 0;
      while (k + 1 < starts.length && p >= starts[k + 1]) k++;
      setStep(k);
      root.dataset.stage = String(k);
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      // once the film has ended (the last screen: the promise and the buttons), show its last frame
      // as the sharp still rather than a frame drawn from the sheets
      // (arriving from Home keeps the still for the whole last screen, until the visitor scrolls back)
      if (k < steps.length - 1) arrived = false;
      root.classList.toggle("at-end", arrived || p >= hold - 0.002);

      // the film: still until heroSeq.lead, playing to heroSeq.hold, then still on its last frame
      t = clamp((p - lead) / (hold - lead)) * (n - 1);
    }
    const key = Math.round(t * 8); // eighths of a frame are enough to look smooth
    if (key === last) return;
    const a = Math.floor(t);
    const fa = nearest(a);
    if (fa < 0) return;
    last = key;

    // cover the stage, keeping the film's subject (heroSeq.focus) in view
    const VH = H;
    const s = Math.max(W / FW, VH / FH);
    const dw = FW * s;
    const dh = FH * s;
    let dx = clamp(W / 2 - dw * focusAt(t / fps), W - dw, 0);
    let dy = (VH - dh) / 2;

    // Flow's mark sits in the footage's bottom-right corner. Never half of it on screen: when the
    // crop would cut it, the picture moves (a few pixels) so the mark is either whole or wholly
    // out of view, whichever is nearer; when it is out of view the same mark shows in the stage's
    // corner instead (data-sh-mark), so there is always exactly one.
    const m = heroSeq.mark;
    const fit = (over: number, edge: number, size: number) => {
      // over: how far the picture runs past the screen's edge; edge, size: the mark's margin and size
      if (over <= edge || over >= edge + size) return 0;
      return over - edge < edge + size - over ? -(over - edge) : edge + size - over;
    };
    dx += fit(dx + dw - W, dw * m.right, dw * m.width);
    dy += fit(dy + dh - VH, dh * m.bottom, dh * m.height);
    const markOut = dx + dw - W >= dw * (m.right + m.width) - 0.5 || dy + dh - VH >= dh * (m.bottom + m.height) - 0.5;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(fa, 1, dx, dy, dw, dh);
    const b = a + 1;
    const mix = t - a;
    if (fa === a && b < n && mix > 0.02 && has(b)) paint(b, mix, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
    root.classList.add("is-drawn");

    mark?.classList.toggle("is-on", markOut);
  };
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  measure();
  // the frame sheets are only for the scrolled film; an upright phone plays the video instead
  draw();
  d.on(window, "scroll", queue, { passive: true });
  const onResize = () => {
    measure();
    syncSrc();
    queue();
    startPlay();
  };
  d.on(window, "resize", onResize);
  // the stage's own size too (a window snapped or a device toolbar does not always fire resize)
  let lastW = stage.clientWidth;
  let lastH = stage.clientHeight;
  const sizeWatch = new ResizeObserver(() => {
    if (stage.clientWidth === lastW && stage.clientHeight === lastH) return;
    lastW = stage.clientWidth;
    lastH = stage.clientHeight;
    onResize();
  });
  sizeWatch.observe(stage);
  d.add(() => sizeWatch.disconnect());
  d.add(() => cancelAnimationFrame(raf));

  // ---- on an upright phone the film itself plays, as a muted video, once through (it then rests
  // on its last frame, the finished building) and only while the hero is on screen; its crop
  // follows the film's subject (heroSeq.focus), and the gold line along
  // the foot of the screen shows how far through it is
  let video: HTMLVideoElement | null = null;
  let playing = 0;
  /** A phone: the film has played to its end and now rests on its last frame (no loop). */
  let bandDone = false;
  /** A tablet: the film has played to its end (tabDone), has been started (tabStarted), the start's wait. */
  let tabDone = false;
  let tabStarted = false;
  let tabTimer = 0;
  d.add(() => window.clearTimeout(tabTimer));
  let inView = true;
  const ensureVideo = () => {
    if (video) return video;
    const v = document.createElement("video");
    v.className = "sh-video";
    v.muted = true;
    v.defaultMuted = true;
    v.loop = false;
    v.playsInline = true;
    v.autoplay = band && !waitForTap;
    v.preload = "auto";
    v.poster = tall || tabTall ? heroSeq.tall.first : heroSeq.first;
    v.disablePictureInPicture = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("aria-hidden", "true");
    v.src = filmSrc();
    const rate = () => {
      v.defaultPlaybackRate = heroSeq.videoRate;
      v.playbackRate = heroSeq.videoRate;
    };
    rate();
    d.on(v, "loadedmetadata", rate);
    stage.insertBefore(v, canvas);
    d.on(v, "timeupdate", placeVideo);
    d.on(v, "ended", () => {
      if (tablet) {
        // a tablet: the film has played once; it stays on its last frame
        tabDone = true;
        placeVideo();
        syncBtn();
        return;
      }
      if (band) {
        // a phone: the film has played once; it stays on its last frame
        bandDone = true;
        placeVideo();
        syncBtn();
        return;
      }
      target = -1;
      partLock = Math.max(partLock, performance.now() + 450);
      placeVideo();
    });
    d.on(v, "loadedmetadata", placeVideo);
    d.on(v, "playing", () => {
      started = true;
      refused = false;
      syncBtn();
    });
    d.on(v, "pause", syncBtn);
    video = v;
    return v;
  };
  d.add(() => {
    video?.pause();
    video?.remove();
  });
  /** Which film this screen plays: the upright film on an upright phone, the wide one elsewhere. */
  function filmSrc() {
    return tall || tabTall ? heroSeq.tall.video : band ? heroSeq.videoSmall : heroSeq.video;
  }
  /**
   * The window was resized (or the phone turned): when the screen now wants the other film (a
   * laptop window narrowed to phone size, or the other way round), swap it in and start it afresh.
   */
  function syncSrc() {
    if (!video) return;
    const want = filmSrc();
    if (video.getAttribute("src") === want) return;
    video.pause();
    video.setAttribute("src", want);
    video.poster = tall || tabTall ? heroSeq.tall.first : heroSeq.first;
    video.loop = false;
    bandDone = false;
    tabDone = false;
    tabStarted = false;
    part = 0;
    target = -1;
    video.load();
    if (!band) {
      setStep(0);
      hero.dataset.stage = "0";
    }
  }
  /** Wider screens: which step's words go with the film's current second. */
  /**
   * Wider screens: the film in parts, one per scroll. heroSeq.stops are the seconds where each part
   * ends (the first, 0, is the opening frame under the name); a scroll down plays the film from
   * where it is to the next stop and pauses there, a scroll up goes back a stop. The words of the
   * step come in as its part starts. While a part is playing, scrolling is held (the film is never
   * skipped through), and the page only moves on to the next section once the last part has played
   * to the very end.
   */
  const stops = heroSeq.stops;
  let part = 0;
  let target = -1;
  /** No new step before this moment (performance.now()): a flick's glide is not a second scroll. */
  let partLock = 0;
  /** A part is playing towards its stop. */
  const busy = () => Boolean(video && target >= 0 && !video.paused && !video.ended);
  /** The film has played to its last frame (or was opened there). */
  const atEnd = () =>
    arrived || Boolean(video && part === stops.length - 1 && target < 0 && video.duration && video.currentTime >= Math.min(stops[stops.length - 1], video.duration) - 0.15);
  const goPart = (k: number, play = true) => {
    const v = ensureVideo();
    part = Math.max(0, Math.min(stops.length - 1, k));
    setStep(part);
    hero.dataset.stage = String(part);
    if (play && v.currentTime < stops[part] - 0.05) {
      target = stops[part];
      void v.play().catch(() => {
        v.currentTime = stops[part];
      });
      if (!playing) playing = requestAnimationFrame(tick);
    } else {
      target = -1;
      v.pause();
      v.currentTime = Math.min(stops[part], (v.duration || stops[part] + 1) - 0.05);
      placeVideo();
    }
  };
  function placeVideo() {
    if (!video) return;
    if (tablet) {
      // a tablet: the film plays through; the words of each step come in at its moment in the film
      video.style.objectPosition = "50% 50%";
      const now = video.currentTime || 0;
      const beats: readonly number[] = tabTall ? heroSeq.tall.beats : heroSeq.beats;
      let k = 0;
      while (k + 1 < beats.length && now >= beats[k + 1]) k++;
      if (part !== k || hero.dataset.stage !== String(k)) {
        part = k;
        setStep(k);
        hero.dataset.stage = String(k);
      }
      hero.classList.toggle("at-end", false);
      if (bar && video.duration) bar.style.transform = `scaleX(${(now / video.duration).toFixed(4)})`;
      return;
    }
    if (!band) {
      video.style.objectPosition = "50% 50%";
      const now = video.currentTime || 0;
      // stop at the end of the part being played
      if (!video.paused && target >= 0 && now >= target - 0.04) {
        video.pause();
        video.currentTime = Math.min(target, (video.duration || target + 1) - 0.04);
        target = -1;
        partLock = Math.max(partLock, performance.now() + 450);
      }
      hero.classList.toggle("at-end", false);
      if (bar && video.duration) bar.style.transform = `scaleX(${(now / video.duration).toFixed(4)})`;
      return;
    }
    if (band) {
      // the whole frame shows on a phone, so there is no crop to follow
      video.style.objectPosition = "50% 50%";
    } else {
      const s = Math.max(W / FW, filmH / FH);
      const dw = FW * s;
      const dx = clamp(W / 2 - dw * focusAt(video.currentTime || 0), W - dw, 0);
      video.style.objectPosition = `${dx.toFixed(1)}px 50%`;
    }
    // which stage of the build is on screen (the name over the empty plot is stage 0)
    const now = video.currentTime || 0;
    const beats: readonly number[] = tall ? heroSeq.tall.beats : heroSeq.beats;
    let k = 0;
    while (k + 1 < beats.length && now >= beats[k + 1]) k++;
    if (hero.dataset.stage !== String(k)) hero.dataset.stage = String(k);
    if (bar && video.duration) bar.style.transform = `scaleX(${(video.currentTime / video.duration).toFixed(4)})`;
  }
  const tick = () => {
    playing = 0;
    if (!video) return;
    placeVideo();
    if (inView && !document.hidden) playing = requestAnimationFrame(tick);
  };
  function startPlay() {
    const v = ensureVideo();
    if (arrived && !band) {
      holdEnd(v);
      return;
    }
    // phones and tablets play the film once through; computers play it part by part, one part per
    // scroll (goPart)
    v.loop = false;
    target = tablet ? -1 : target;
    placeVideo();
    if (tablet) {
      v.autoplay = false;
      if (!tabDone && v.duration && v.currentTime >= v.duration - 0.1) tabDone = true;
      if (tabDone || userPaused || !inView || document.hidden) {
        window.clearTimeout(tabTimer);
        v.pause();
        syncBtn();
        return;
      }
      const go = () => {
        if (!inView || document.hidden || userPaused || tabDone) return;
        void v.play().catch(() => {
          refused = true;
          syncBtn();
        });
        if (!playing) playing = requestAnimationFrame(tick);
      };
      if (!tabStarted) {
        // the first time: the name and the buttons stay a moment on the opening frame, then the film runs
        tabStarted = true;
        v.pause();
        window.clearTimeout(tabTimer);
        tabTimer = window.setTimeout(go, 2200);
      } else if (v.paused) {
        go();
      }
      syncBtn();
      return;
    }
    if (!band) {
      // the film waits on its current stop until the next scroll
      v.autoplay = false;
      if (target < 0 || !inView || document.hidden) v.pause();
      if (target < 0 && v.duration && Math.abs(v.currentTime - stops[part]) > 0.06) v.currentTime = stops[part];
      setStep(part);
      hero.dataset.stage = String(part);
      return;
    }
    // a phone: the film plays once through while the hero is on screen, unless the visitor paused
    // it (or, with reduced motion, until they first tap play); after its end it rests on the last frame
    if (!bandDone && v.duration && v.currentTime >= v.duration - 0.1) bandDone = true;
    if (bandDone) {
      v.pause();
      placeVideo();
      syncBtn();
      return;
    }
    v.poster = tall ? heroSeq.tall.first : heroSeq.first;
    if (inView && !document.hidden && !userPaused && !(waitForTap && !started)) {
      v.play().catch(() => {
        // autoplay refused (a battery saver or data saver, say): the first frame stays, with the
        // play button over it, and the first tap anywhere on the page starts the film
        refused = true;
        syncBtn();
      });
      if (!playing) playing = requestAnimationFrame(tick);
    } else {
      v.pause();
    }
    syncBtn();
  }

  // ---- the phone film's play / pause button: the film can always be paused, and when the phone
  // will not start it by itself (a battery or data saver, or reduced motion) one tap starts it
  let started = false;
  let refused = false;
  let userPaused = false;
  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "sh-play is-paused";
  playBtn.innerHTML =
    '<svg class="sh-play-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>' +
    '<svg class="sh-pause-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>' +
    "<span>Play film</span>";
  stage.appendChild(playBtn);
  d.add(() => playBtn.remove());
  function syncBtn() {
    const paused = !video || video.paused;
    playBtn.classList.toggle("is-paused", paused);
    // before the film has ever played (autoplay refused, or reduced motion): a big gold button
    playBtn.classList.toggle("is-big", paused && !started && (refused || waitForTap));
    playBtn.setAttribute("aria-label", paused ? "Play the film" : "Pause the film");
  }
  d.on(playBtn, "click", (e) => {
    e.stopPropagation();
    const v = ensureVideo();
    if (v.paused) {
      userPaused = false;
      v.loop = false;
      // after the film has ended, the button plays it again from the start
      if (bandDone || tabDone || v.ended) {
        bandDone = false;
        tabDone = false;
        v.currentTime = 0;
      }
      void v.play().catch(() => {});
      if (!playing) playing = requestAnimationFrame(tick);
    } else {
      userPaused = true;
      v.pause();
    }
    syncBtn();
  });
  // autoplay refused: the first tap anywhere on the page starts the film (a tap allows playing)
  const kick = () => {
    if (!band || !refused || userPaused || waitForTap || !video || !video.paused || !inView) return;
    void video.play().catch(() => {});
    if (!playing) playing = requestAnimationFrame(tick);
  };
  d.on(document, "touchend", kick, { passive: true });
  d.on(document, "click", kick);
  const seen = new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting);
    startPlay();
  });
  seen.observe(root);
  d.on(document, "visibilitychange", startPlay);
  d.add(() => {
    seen.disconnect();
    cancelAnimationFrame(playing);
  });
  startPlay();

  /** Coming back to Home on a bigger screen: the film stays on its last frame, still. */
  function holdEnd(v: HTMLVideoElement) {
    v.autoplay = false;
    v.loop = false;
    v.poster = heroSeq.end;
    const set = () => {
      v.pause();
      if (v.duration && v.currentTime < v.duration - 0.1) v.currentTime = Math.max(0, v.duration - 0.05);
      placeVideo();
      if (!band) {
        part = stops.length - 1;
        target = -1;
        setStep(part);
        hero.dataset.stage = String(part);
      }
    };
    if (v.readyState >= 1) set();
    else v.addEventListener("loadedmetadata", set, { once: true });
    v.pause();
  }

  // arriving at Home from another page (FastNav, or the back button): open on the film's last
  // frame, not its start. Bigger screens: the last screen of the hero (its promise and buttons)
  // with the film's last frame; an upright phone: the video held still on its last frame.
  const toEnd = () => {
    if (band) {
      // a phone: the film plays once from its start, as on a first visit
      arrived = false;
      if (video && (bandDone || video.ended)) {
        bandDone = false;
        video.currentTime = 0;
      }
      scroller.scrollTo(0, { immediate: true, offset: 0 });
      startPlay();
      return;
    }
    arrived = true;
    if (filmMode) {
      holdEnd(ensureVideo());
      scroller.scrollTo(0, { immediate: true, offset: 0 });
      return;
    }
    root.classList.add("at-end");
    measure();
    const y = root.getBoundingClientRect().top + window.scrollY + root.offsetHeight - window.innerHeight;
    scroller.scrollTo(y, { immediate: true, offset: 0 });
    queue();
  };
  const w = window as unknown as { __kcHeroEnd?: boolean };
  if (w.__kcHeroEnd) {
    w.__kcHeroEnd = false;
    toEnd();
    // and again once the router has finished putting the new page at the top
    requestAnimationFrame(() => requestAnimationFrame(toEnd));
    window.setTimeout(toEnd, 120);
    window.setTimeout(toEnd, 450);
  }
  d.on(window, "hero:end", toEnd);

  // ---- one screen per step: on a mouse wheel or trackpad, each scroll inside the hero moves exactly
  // one step (the name, then each stage of the build, landing near its end so the stage is all but
  // done, then the finished building), and the scroll after the last carries on down the page;
  // scrolling up steps back the same way.
  // Touch screens scroll freely.
  const stepAt = (k: number) => {
    if (k <= 0) return 0;
    if (k >= starts.length - 1) return 1;
    // land heroSeq.land of the way into the step, on a whole frame, so the picture at rest is one
    // frame, not a blend of two
    const p = starts[k] + (starts[k + 1] - starts[k]) * heroSeq.land;
    const f = Math.round(clamp((p - lead) / (hold - lead)) * (n - 1));
    return lead + (f / (n - 1)) * (hold - lead);
  };
  const heroTop = () => root.getBoundingClientRect().top + window.scrollY;
  const heroTotal = () => root.offsetHeight - window.innerHeight;
  let lockedUntil = 0;
  let lastWheel = 0;
  const onWheel = (ev: Event) => {
    const e = ev as WheelEvent;
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || e.deltaY === 0) return;
    const top = heroTop();
    const total = heroTotal();
    const y = window.scrollY;
    // only while the hero fills the screen
    if (y < top - 2 || y > top + total + 2) return;
    const now = performance.now();
    const p = total > 0 ? clamp((y - top) / total) : 0;
    let k = 0;
    while (k + 1 < starts.length && p >= starts[k + 1] - 0.0005) k++;
    const down = e.deltaY > 0;
    const next = down ? k + 1 : k - 1;
    // past the ends: leave the scroll to the page
    if (next < 0 || next > starts.length - 1) {
      if (now < lockedUntil || now - lastWheel < 180) {
        lastWheel = now;
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    // one step per scroll: the rest of a flick (a trackpad's glide) is swallowed until it stops
    const quiet = now - lastWheel > 180;
    lastWheel = now;
    if (now < lockedUntil || (!quiet && now < lockedUntil + 900)) return;
    lockedUntil = now + 1100;
    if (next !== starts.length - 1) arrived = false;
    scroller.scrollTo(top + total * stepAt(next), { offset: 0 });
  };
  // wider screens: a scroll inside the hero plays the next part of the film (or goes back one). While
  // a part plays, scrolling is held; the page scrolls on to the next section only after the last part
  // has played to the end
  const holdScroll = (e: Event) => {
    if (e.cancelable) e.preventDefault();
    e.stopImmediatePropagation();
  };
  const partStep = (down: boolean, e: Event) => {
    if (band || tablet) return;
    const r = root.getBoundingClientRect();
    if (Math.abs(r.top) > 4) return; // only while the hero fills the screen
    const now = performance.now();
    // a part is still playing, or has only just stopped: hold the page where it is
    if (busy() || now < partLock) {
      holdScroll(e);
      return;
    }
    const next = down ? part + 1 : part - 1;
    if (next < 0) return; // above the hero: the page scrolls up as usual
    if (next > stops.length - 1) {
      // below the last part: move on only once the film has played to its end
      if (!atEnd()) {
        holdScroll(e);
        if (!busy()) goPart(stops.length - 1, true);
      }
      return;
    }
    holdScroll(e);
    partLock = now + 700;
    arrived = false;
    goPart(next, down);
  };
  const onPartWheel = (ev: Event) => {
    const e = ev as WheelEvent;
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || Math.abs(e.deltaY) < 2) return;
    partStep(e.deltaY > 0, e);
  };
  let touchY = 0;
  const onTouchStart = (ev: Event) => {
    touchY = (ev as TouchEvent).touches[0]?.clientY ?? 0;
  };
  const onTouchMove = (ev: Event) => {
    const y = (ev as TouchEvent).touches[0]?.clientY ?? 0;
    if (Math.abs(y - touchY) < 30) return;
    partStep(y < touchY, ev);
    touchY = y;
  };
  const onKey = (ev: Event) => {
    const e = ev as KeyboardEvent;
    if (["ArrowDown", "PageDown", " "].includes(e.key)) partStep(true, e);
    else if (["ArrowUp", "PageUp"].includes(e.key)) partStep(false, e);
  };
  if (filmMode) {
    window.addEventListener("wheel", onPartWheel, { capture: true, passive: false });
    window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    window.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    window.addEventListener("keydown", onKey, { capture: true });
    d.add(() => {
      window.removeEventListener("wheel", onPartWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
    });
  }
  if (!filmMode && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    d.add(() => window.removeEventListener("wheel", onWheel, { capture: true }));
  }

  // the rail: each mark jumps to its step (the middle of it)
  ticks.forEach((tick, i) => {
    d.on(tick, "click", () => {
      if (video && tablet) {
        arrived = false;
        tabDone = false;
        tabStarted = true;
        video.currentTime = i === 0 ? 0 : (tabTall ? heroSeq.tall.beats : heroSeq.beats)[i] ?? 0;
        void video.play().catch(() => {});
        return;
      }
      if (video && !band) {
        // jump to the start of that part and play it
        video.currentTime = i === 0 ? 0 : stops[i - 1];
        goPart(i, true);
        return;
      }
      const total = root.offsetHeight - H;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const mid = (starts[i] + (starts[i + 1] ?? 1)) / 2;
      scroller.scrollTo(top + total * mid, { offset: 0 });
    });
  });
  // the pills on the first screen: each jumps to its line's part of the film (without JavaScript
  // they open the line's page)
  root.querySelectorAll<HTMLAnchorElement>("[data-sh-jump]").forEach((pill) => {
    d.on(pill, "click", (e) => {
      if (band) return; // one screen on a phone: the pill opens its page
      const k = Number(pill.dataset.shJump);
      if (!(k > 0 && k < starts.length)) return;
      e.preventDefault();
      const total = root.offsetHeight - H;
      const top = root.getBoundingClientRect().top + window.scrollY;
      scroller.scrollTo(top + total * ((starts[k] + (starts[k + 1] ?? 1)) / 2), { offset: 0 });
    });
  });
}
