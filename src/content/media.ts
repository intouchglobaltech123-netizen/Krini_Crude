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
const seqVersion = "flow14";

/**
 * Home's hero (ScrollHero.tsx): realistic, machinery only, no people, made with Google Flow
 * (Nano Banana stills as start and end frames, Omni 1.1 Flash clips) and joined with fades:
 * aluminium formwork panels craned in and pinned, clamped and braced into a mould round the rebar;
 * a spray lance mists shuttering oil on the inner faces; concrete pumped in, levelled and cured
 * (time-lapse); the panels release and are stacked intact beside a clean concrete block; in a
 * precast segment shed, modelled on the owner's own factory videos, concrete is poured into a
 * blue ribbed steel mould with an arched, oiled black bed, and the cured curved segment is hoisted
 * straight up as one rigid piece, off clean to join the stacks on timber; on site a tower crane lowers a precast panel into the
 * top floor of a 13-storey apartment block, which is then finished (paint, shutters, glazing,
 * garden), ending on it in daylight.
 * Cut to 23.6 s. Laptops play it part by part, one part per scroll (stops); phones play it on a loop.
 */
export const heroSeq = {
  /** The film's frames: 22 s sampled 5 times a second. */
  frames: 109,
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
  videoRate: 1,
  first: `${base}/images/hero-seq/first.webp?v=${seqVersion}`,
  /** The subject stays in the middle of the frame, as [second, x]. */
  focus: [
    [0, 0.5],
    [23.7, 0.5],
  ] as [number, number][],
  /**
   * Where each step of the words starts, in seconds of the film: the name over the column
   * shuttering, then the four stages (site.film.stages: foundation and concrete columns, aluminium
   * formwork, precast, steel and welding), and the finished building with the promise and the buttons.
   */
  beats: [0, 0.3, 2.1, 6.9, 17.6],
  /** Laptops: the seconds where each part of the film ends; one scroll plays the next part (0 is the opening frame under the name). */
  stops: [0, 2.1, 6.9, 17.6, 23.63],
  /** How far into its stretch of the film a scroll step lands (0 its start, 1 the next step's start). */
  land: 0.3,
  /** The share of the scroll before the film starts (the name over its first frame), and the share at which it ends (its last frame stays for the rest). */
  lead: 0.04,
  hold: 0.96,
  /** Flow's mark is part of every frame here (bottom right), so no copy of it is placed on top. */
  mark: { src: `${base}/images/veo-mark.png`, width: 0, height: 0, right: 0, bottom: 0 },
} as const;
