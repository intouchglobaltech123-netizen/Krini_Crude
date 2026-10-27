/**
 * "How it's made": how crude oil becomes a Krini Crude lubricant, in ten steps
 * and four places. Steps 1 to 8 (in nature, at the oilfield, at the refinery)
 * describe the oil industry's general process. Steps 9 and 10 happen at Krini
 * Crude's factory near Madhavaram, Chennai (as the live site states); they
 * describe how lubricants are generally blended and packed, and the details
 * the live site does not give are marked TBC, to be confirmed by the team.
 */
import { placeholder, type Placeholder } from "./placeholder";

const base = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export type PlaceId = "nature" | "oilfield" | "refinery" | "plant";

/** Where each part of the journey happens (`bar`: the short name under the film frame on phones). */
export const places: readonly { id: PlaceId; label: string; bar: string; where: string }[] = [
  { id: "nature", label: "In nature", bar: "Nature", where: "Underground, over millions of years" },
  { id: "oilfield", label: "At the oilfield", bar: "Oilfield", where: "Oilfields around the world" },
  { id: "refinery", label: "At the refinery", bar: "Refinery", where: "Oil refineries" },
  { id: "plant", label: "At our plant", bar: "Our plant", where: "Near Madhavaram, Chennai" },
];

export type ProcessStep = {
  id: string;
  place: PlaceId;
  title: string;
  /** One line, for the jump bar's labels and the home page. */
  short: string;
  body: string;
  /** What the clip shows. */
  alt: string;
  /** What the team still needs to confirm for this step. */
  tbc?: readonly Placeholder[];
};

export const processSteps: readonly ProcessStep[] = [
  {
    id: "formed",
    place: "nature",
    title: "Formed underground",
    short: "Ancient sea life, buried and slowly turned into oil.",
    body: "Over millions of years, the remains of tiny sea plants and animals settle on the seabed and are buried under mud and rock. As they sink deeper, heat and pressure slowly turn them into crude oil.",
    alt: "Plankton drifting down through blue-green water onto the seabed",
  },
  {
    id: "trapped",
    place: "nature",
    title: "Trapped in rock",
    short: "It rises through porous rock until a seal stops it.",
    body: "Oil is lighter than water, so it creeps upward through porous rock such as sandstone until it meets a layer it cannot pass, like shale or salt. There it gathers in a reservoir, often with gas above it and water below.",
    alt: "Amber crude oil seeping between the grains of porous rock",
  },
  {
    id: "drilled",
    place: "oilfield",
    title: "Found and drilled",
    short: "Surveys find the reservoir; a rig drills down to it.",
    body: "Geologists map the rock layers with seismic surveys to find these traps. A rig then drills a well down to the reservoir, often kilometres deep, lining it with steel casing as it goes.",
    alt: "A drilling rig lit up at dusk in the desert",
  },
  {
    id: "lifted",
    place: "oilfield",
    title: "Brought to the surface",
    short: "Pumped up, then separated from gas and water.",
    body: "At first the reservoir’s own pressure pushes the oil up the well; later, pumps lift it. At the surface, the crude is separated from the gas, water and sand that come up with it.",
    alt: "A pumpjack rocking on an oilfield at golden hour",
  },
  {
    id: "shipped",
    place: "oilfield",
    title: "Shipped to a refinery",
    short: "By pipeline and tanker, often across oceans.",
    body: "The crude travels by pipeline and by tanker ship to a refinery, often from the other side of the world.",
    alt: "A crude oil tanker sailing on a calm sea at sunrise",
  },
  {
    id: "distilled",
    place: "refinery",
    title: "Separated by heat",
    short: "Distillation splits crude by boiling point.",
    body: "At the refinery, the crude is washed to remove salt, heated to around 350–400 °C and fed into a distillation column. The vapour rises and cools, and each part condenses at its own height: gases at the top, then petrol, kerosene and diesel, with a heavy residue at the bottom.",
    alt: "A refinery’s distillation columns lit up at night",
  },
  {
    id: "vacuum",
    place: "refinery",
    title: "Split again, under vacuum",
    short: "The heavy residue gives the oils lubricants are made from.",
    body: "The residue goes to a second column under vacuum. At low pressure it boils at lower temperatures, so it separates without breaking down, into the heavy distillates that lubricant base oils are made from.",
    alt: "A vacuum distillation column and its pipework against an evening sky",
  },
  {
    id: "refined",
    place: "refinery",
    title: "Refined into base oil",
    short: "Impurities and wax out, clean base oil in.",
    body: "These distillates are refined again: aromatics are taken out so the oil holds its thickness as temperatures change, wax so it still flows in the cold, and a final treatment with hydrogen improves its colour and stability. Newer refineries use hydrocracking to make even purer base oils.",
    alt: "Pale golden base oil being poured into a glass beaker",
  },
  {
    id: "blended",
    place: "plant",
    title: "Blended to the formulation",
    short: "Base oil and additives, mixed to each recipe.",
    body: "At our factory, base oil is measured out with the additives each formulation calls for (anti-wear, anti-rust and anti-oxidation additives in hydraulic and gear oils, for example; emulsifiers that let soluble cutting oils mix with water) and blended until uniform.",
    alt: "Golden oil swirling in a stainless-steel blending tank as an additive pours in",
    tbc: [placeholder("Where our base oils come from"), placeholder("Our blending process and equipment")],
  },
  {
    id: "packed",
    place: "plant",
    title: "Tested, filled and dispatched",
    short: "Each batch checked, then packed under our brand or yours.",
    body: "Each batch is checked against its specification before it is filled, labelled and dispatched to customers across India: under the Krini Crude name or, for private label, under yours.",
    alt: "Filling nozzles pouring golden oil into drums on a filling line",
    tbc: [placeholder("Tests run on each batch"), placeholder("Pack sizes")],
  },
];

/** "01" … "10" */
export const stepNo = (s: ProcessStep) => String(processSteps.indexOf(s) + 1).padStart(2, "0");

/**
 * The clips: a short seamless loop (1280 and 960 wide) and its first frame for
 * each step, made with Google Flow (Veo) and cut by scripts/film/process.sh.
 * With `ready: false`, each step shows a title card instead.
 */
export const processMedia = {
  ready: true,
  width: 1280,
  height: 720,
  clip: (s: ProcessStep) => `${base}/video/process/${stepNo(s)}-${s.id}.mp4`,
  clipSmall: (s: ProcessStep) => `${base}/video/process/${stepNo(s)}-${s.id}-m.mp4`,
  poster: (s: ProcessStep) => `${base}/images/process/${stepNo(s)}-${s.id}.webp`,
  credit: "AI-generated illustrations, not footage of our plant",
};

/** The page's copy. */
export const processPage = {
  seo: {
    title: "How Lubricants Are Made: From Crude Oil to the Drum | Krini Crude",
    description:
      "How crude oil becomes a lubricant: formed underground, drilled, refined into base oil, then blended with additives, tested and packed at our Chennai factory.",
  },
  label: "How it’s made",
  heading: "From crude oil to the drum.",
  lead: "Every lubricant starts as crude oil, deep underground. It is drilled, shipped and refined into base oil, then blended with additives, tested and packed. The last two steps happen at our factory near Madhavaram, Chennai. Here is the whole journey.",
  facts: [
    { value: "10", label: "Steps" },
    { value: "4", label: "Places" },
    { value: "Chennai", label: "Blended & packed" },
  ],
  journey: { label: "The journey", heading: "Ten steps, four places." },
  mix: {
    label: "Product by product",
    heading: "What changes from line to line.",
    lead: "The base oil and the additives depend on the job the product has to do.",
    items: [
      {
        line: "lubricants",
        title: "Hydraulic, gear and engine oils",
        body: "Base oil of the right viscosity grade, with additives against wear, rust, oxidation and foaming. Engine oils also carry detergents that keep the engine clean.",
      },
      {
        line: "lubricants",
        title: "1-COOL cutting oils",
        body: "Neat cutting oils are used as they are, with additives for heavy cuts. Soluble cutting oils carry emulsifiers, so they mix with water into a coolant, and corrosion inhibitors that protect the work.",
      },
      {
        line: "lubricants",
        title: "Greases",
        body: "Base oil thickened into a soft solid, so it stays where it is put.",
      },
      {
        line: "construction",
        title: "Shuttering oils and greases",
        body: "Oil carrying release agents that leave a thin film on the formwork, so the concrete comes away cleanly.",
      },
      {
        line: "aerosols",
        title: "Aerosol sprays",
        body: "Paint, adhesive, anti-spatter or release liquid, sealed in a can with a propellant that delivers it as a fine spray.",
      },
    ] as { line: "lubricants" | "construction" | "aerosols"; title: string; body: string }[],
  },
  faq: [
    {
      q: "What is base oil?",
      a: "The refined oil that makes up most of a finished lubricant. Mineral base oils are refined from crude oil; synthetic ones are made chemically. Additives are blended in to give each product the properties its job needs.",
    },
    {
      q: "What do additives do?",
      a: "They give oil properties base oil does not have on its own: protection against wear, rust and oxidation, resistance to foaming, the ability to mix with water in soluble cutting oils, or a clean release from formwork in shuttering oils.",
    },
    {
      q: "What does ISO VG 68 mean?",
      a: "It is a viscosity grade: the oil’s viscosity at 40 °C is 68 cSt, within 10% either way (61.2 to 74.8 cSt). Hydraulic oils are commonly sold as ISO VG 32, 46 and 68.",
    },
    {
      q: "Where are Krini Crude’s products made?",
      a: "At our factory in Vilangadupakkam, near Madhavaram, Chennai. Our office is in Anna Nagar East, Chennai.",
    },
    {
      q: "Can you make a product to our formulation?",
      a: "Yes. We make products to our own formulations or to formulations you specify, and we manufacture private label products under your brand.",
    },
  ],
  cta: {
    heading: "Need a lubricant made to order?",
    body: "Tell us the product, the grade and the quantity, or send us your formulation.",
  },
};
