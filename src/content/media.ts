/**
 * Hero imagery: one lit plinth per product line.
 *
 * Unbranded product visualisations generated with Google Flow (Nano Banana
 * Pro, 3:4), downloaded at 2K and graded to match by scripts/showroom.py:
 *   lubricants     a steel drum, an open pail of grease, a tin and a bottle of oil
 *   construction   jerrycans, a drum and a pail of release compound, formwork and rebar behind
 *   aerosols       six spray cans, one releasing an amber mist
 * Each keeps Flow's visible watermark (bottom right), so the page never crops
 * the bottom of the pictures. See docs/HERO.md.
 *
 * Paths are prefixed with NEXT_PUBLIC_ASSET_BASE so a static copy can live in a
 * sub-folder; leave it unset for a normal Next.js deployment.
 */
const base = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

const stage = (name: string, alt: string, focus: string) => ({
  /** 1200×1600 */
  src: `${base}/images/showroom-${name}.webp`,
  /** 720×960, for phones */
  srcSmall: `${base}/images/showroom-${name}-sm.webp`,
  alt,
  /** object-position: the plinth stays anchored to the bottom, only the empty light cone above is trimmed */
  focus,
});

export const heroMedia = {
  width: 1200,
  height: 1600,
  /** Keyed by product line id (site.products[].id). */
  stages: {
    lubricants: stage(
      "lubricants",
      "A steel oil drum, an open pail of amber grease, a tin and a bottle of oil on a black plinth under a spotlight",
      "50% 100%",
    ),
    construction: stage(
      "construction",
      "Two jerrycans, an oil drum and a pail of release compound on a black plinth, with steel formwork and rebar behind",
      "50% 100%",
    ),
    aerosols: stage("aerosols", "Six aerosol cans on a black plinth, one releasing a fine amber mist", "50% 100%"),
  },
  /** Shown under the plinths so the pictures are never mistaken for Krini Crude's own packaging. */
  credit: "AI-generated product visualisations (Google Flow), not Krini Crude packaging",
} as const;

export type HeroMedia = typeof heroMedia;
export type StageId = keyof typeof heroMedia.stages;

/**
 * The hero film's version, added to its frame addresses: change it whenever the
 * frames are replaced, so browsers fetch the new film rather than showing the
 * old one from their cache (the frames are served as unchanging for a year).
 */
const seqVersion = "mivan3";

/**
 * Home's hero (ScrollHero.tsx): the client's building-first film (made with Google Flow), with the
 * oiling of the Mivan panels added in its place (Flow clips made after the client's own site video).
 * In order: the finished building; in the foundation pit, Magic Shuttering Oil rolled on to the
 * smooth face of a Mivan aluminium panel (the face that meets the concrete); the panels standing as a
 * box round the rebar, their oiled inner faces glossy as the concrete is poured in; the box stripped
 * clean; a precast mould poured and its unit lifted out clean; the building rising floor by floor; and
 * the completed building with its trees. Only gloved hands and backs are seen, never faces.
 * Cut to 14.2 s (the client: no longer than 15 s), parts sped up a little: 1920x1080 (heroSeq.video, laptops) and 1280x720 (heroSeq.videoSmall, phones).
 */
export const heroSeq = {
  /** The film's length at 5 frames a second (the frame sheets are only for the scroll-drawn film, which film mode does not use). */
  frames: 72,
  fps: 5,
  perSheet: 10,
  sheet: (k: number) => `${base}/images/hero-seq/s${String(k).padStart(2, "0")}.webp?v=${seqVersion}`,
  /** One frame's size in the sheets. */
  width: 960,
  height: 540,
  /** The last frame (the finished building): the hero without the motion, wide and cut 4:5 for phones. */
  end: `${base}/images/hero-seq/end.webp?v=${seqVersion}`,
  endTall: `${base}/images/hero-seq/end-tall.webp?v=${seqVersion}`,
  /** Phones held upright play the film itself, as a video (muted, looping, videoRate times real time), with its first frame as the poster. */
  video: `${base}/videos/krini-hero.mp4?v=${seqVersion}`,
  /** The same film at 1280x720, for phones (they show it in a band at the top of the screen). */
  videoSmall: `${base}/videos/krini-hero-720.mp4?v=${seqVersion}`,
  videoRate: 1,
  first: `${base}/images/hero-seq/first.webp?v=${seqVersion}`,
  /**
   * Where the subject is across the frame, as [second, x], so a phone's narrow crop follows it: the
   * building's centre, the worker and the panel he is oiling, then the formwork box, the precast mould
   * and the building, all near the centre.
   */
  focus: [
    [0, 0.5],
    [0.9, 0.5],
    [1.3, 0.42],
    [4.0, 0.42],
    [4.4, 0.5],
    [14.2, 0.5],
  ] as [number, number][],
  /**
   * Where each step of the words starts, in seconds of the film: the name over the building, then
   * Magic oil on the Mivan panels, the pour and the clean strip, the precast mould, and the
   * defect-free finish (site.film.stages), the last with the buttons over the completed building.
   */
  beats: [0, 1.0, 4.2, 8.15, 10.85],
  /**
   * Laptops: the seconds where each part of the film ends; one scroll plays the next part, and the
   * page only moves on once the last part has played to the end. Each stop is a clean frame, never
   * inside a fade: 0 the finished building (under the name), 3.9 the panel oiled glossy, 7.8 the
   * concrete box stripped clean, 10.5 the precast unit lifted out of its mould, 14.17 the completed
   * building with its trees.
   */
  stops: [0, 3.9, 7.8, 10.5, 14.17],
  /** How far into its stretch of the film a scroll step lands (0 its start, 1 the next step's start). */
  land: 0.3,
  /** The share of the scroll before the film starts (the name over its first frame), and the share at which it ends (its last frame stays for the rest). */
  lead: 0.04,
  hold: 0.96,
  /** Flow's mark is part of every frame here (bottom right), so no copy of it is placed on top. */
  mark: { src: `${base}/images/veo-mark.png`, width: 0, height: 0, right: 0, bottom: 0 },
} as const;
