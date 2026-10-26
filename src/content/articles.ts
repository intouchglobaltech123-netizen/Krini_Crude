/**
 * Blog articles: practical, general guidance written for the site, in the
 * voice of the Krini Crude team. They make no claim about Krini Crude beyond
 * what krinicrude.com states. Have the technical team review each article
 * before publishing, and set its date: until then the date shows as a TBC chip
 * and the article carries no publication date in its structured data.
 * Every article ends with the same footnote (ArticlePage): general guidance,
 * follow the equipment maker and the product's data sheets.
 */
import { placeholder, type Placeholder } from "./placeholder";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export type Category = "Lubricants" | "Construction chemicals" | "Aerosols" | "Private label";

export type Article = {
  slug: string;
  title: string;
  category: Category;
  /** The product line this article relates to (catalogue.ts), for the box beside it. */
  line?: "lubricants" | "construction" | "aerosols";
  summary: string;
  /** 4:3, 1200x900: the card and the top of the article. */
  image: string;
  imageAlt: string;
  /** 1200x630: the picture shown when the article is shared. */
  share: string;
  date: string | Placeholder;
  body: Block[];
};

const DATE = placeholder("Publication date");

export const articles: Article[] = [
  {
    slug: "neat-vs-soluble-cutting-oil",
    title: "Neat or soluble cutting oil? How to choose a metalworking fluid",
    category: "Lubricants",
    line: "lubricants",
    summary:
      "Neat oils lubricate, soluble oils cool. How to decide which suits your machining, and how to keep a coolant healthy once it is in the machine.",
    image: "/images/blog-cutting-oil.webp",
    imageAlt: "A drop of amber oil landing on a steel plate and spreading into a thin film",
    share: "/images/og-blog.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "The fluid at the cutting edge decides a surprising amount: how long tools last, the finish on the part, how often the machine stops, and how pleasant the shop is to work in. Most machining fluids fall into two families, and the first choice is between them.",
      },
      { type: "h2", text: "Neat cutting oils" },
      {
        type: "p",
        text: "Neat, or straight, cutting oils are used as supplied, without water. Their strength is lubrication: they keep a film between the tool and the workpiece, which reduces friction and wear and helps give a fine surface finish.",
      },
      {
        type: "ul",
        items: [
          "Operations with heavy cutting forces or low speeds, where lubrication matters more than cooling",
          "Broaching, gear hobbing, threading and similar operations",
          "Forming work such as stamping and drawing, which uses dedicated oils",
        ],
      },
      {
        type: "p",
        text: "Because they are not mixed, neat oils are simple to manage: there is no concentration to check. They do not carry heat away as well as a water-based coolant, and they need good mist extraction.",
      },
      { type: "h2", text: "Soluble cutting oils (coolants)" },
      {
        type: "p",
        text: "Soluble oils are concentrates that are mixed with water to make a coolant. Water is very good at carrying heat away, so a coolant cools the cutting zone while the oil in it lubricates, flushes away chips and helps protect parts and machines from rust.",
      },
      {
        type: "ul",
        items: [
          "Mineral soluble oils form a milky emulsion with a relatively high oil content.",
          "Semi-synthetic coolants contain less mineral oil and form a finer emulsion.",
        ],
      },
      {
        type: "p",
        text: "Coolants suit higher-speed turning, milling and drilling, where heat is the main problem, and machines with a central coolant system.",
      },
      { type: "h2", text: "How to choose" },
      {
        type: "ul",
        items: [
          "Start with the operation and the material: what limits tool life today, heat or friction?",
          "Check what the machine builder recommends, and whether the machine is set up for oil or for coolant.",
          "Think about the whole system: sump size, filtration, how chips are handled and how used fluid will be disposed of.",
          "Run a trial on one machine before you change the whole shop, and record tool life and finish before and after.",
        ],
      },
      { type: "h2", text: "Keeping a coolant healthy" },
      {
        type: "p",
        text: "Most coolant problems, from smell to rust to short tool life, come from the concentration drifting or contamination building up.",
      },
      {
        type: "ul",
        items: [
          "Mix the concentrate into water, not water into the concentrate, at the ratio on the product’s data sheet.",
          "Check the concentration regularly with a refractometer, and top up with premixed coolant rather than plain water.",
          "Skim off tramp oil that leaks in from slideways and hydraulics.",
          "Keep sumps clean, and clean the system thoroughly when the coolant is changed.",
        ],
      },
      {
        type: "tip",
        text: "Ask for the product’s technical data sheet before a trial: it gives the mixing ratio and the concentration range to aim for.",
      },
    ],
  },
  {
    slug: "oil-grades-hydraulic-gear-engine",
    title: "Hydraulic, gear and engine oil grades: what the numbers mean",
    category: "Lubricants",
    line: "lubricants",
    summary:
      "32, 46 and 68; 90 and 140; 220 and 320; 15W40. How each grading system works, how to choose the grade your machine needs, and the signs an oil needs attention.",
    image: "/images/blog-lubricants.webp",
    imageAlt: "Helical gears in an open gearbox, with a stream of oil feeding the mesh",
    share: "/images/og-about.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "The number on a drum of oil is its viscosity grade: a measure of how thick the oil is, and so of the film it can hold between moving parts. Hydraulic, gear and engine oils are graded on different scales, though, so the same number does not mean the same thing on each.",
      },
      { type: "h2", text: "Hydraulic oils: ISO grades 32, 46 and 68" },
      {
        type: "p",
        text: "Hydraulic oils, like most industrial oils, carry ISO viscosity grades (ISO VG). The number is the oil’s typical kinematic viscosity, in mm²/s (centistokes), at 40 °C: the higher the number, the thicker the oil.",
      },
      {
        type: "ul",
        items: [
          "ISO VG 32 flows most easily. It suits cooler conditions and systems designed for a thinner oil.",
          "ISO VG 46 is a common middle ground for many industrial machines.",
          "ISO VG 68 holds a thicker film, for warmer running conditions and systems designed for it.",
        ],
      },
      { type: "h2", text: "Gear oils: 90 and 140, or 220 and 320" },
      {
        type: "p",
        text: "Gear oils are graded in two ways. Grades such as 90 and 140 are on the SAE scale for gear oils, used mainly for automotive-type gear assemblies. Industrial gearboxes are usually specified in ISO grades such as 220 and 320, on the same scale as hydraulic oils.",
      },
      {
        type: "p",
        text: "The SAE gear oil scale is separate from the SAE engine oil scale, so their numbers cannot be compared: at operating temperature, a 90 gear oil is roughly as thick as a 40 or 50 engine oil.",
      },
      { type: "h2", text: "Engine oils: 15W40, 20W40 and 5W30" },
      {
        type: "p",
        text: "Most engine oils are multigrades. The number before the W (for winter) describes the oil when cold: the lower it is, the more easily the oil flows at a cold start. The number after it is the oil’s viscosity grade at operating temperature.",
      },
      {
        type: "ul",
        items: [
          "15W40 and 20W40 are both 40 grades once the engine is warm; 15W40 flows more easily when cold.",
          "5W30 flows most easily at a cold start of the three, and is a thinner 30 grade when warm.",
          "Always use the grade the vehicle or engine maker specifies.",
        ],
      },
      { type: "h2", text: "Choosing the right grade" },
      {
        type: "ul",
        items: [
          "Start with the equipment maker’s recommendation, in the manual or on the machine’s plate.",
          "Consider the temperature the oil actually runs at, not only the temperature of the room.",
          "Do not mix grades or different types of oil. If you change products, drain and flush the system as its maker recommends.",
        ],
      },
      { type: "h2", text: "Signs the oil needs attention" },
      {
        type: "ul",
        items: [
          "Milky oil has taken in water.",
          "Foam in a tank or sump points to air getting in, or to contamination.",
          "Dark oil with a burnt smell points to overheating, or to oil that has aged.",
          "Sluggish or jerky hydraulics, or gears running noisier or hotter than usual, are reasons to check both the oil and the machine.",
        ],
      },
      {
        type: "p",
        text: "Krini Crude makes hydraulic oil in grades 32, 46 and 68, gear oil in 90, 140, 220 and 320, and engine oil in 15W40, 20W40 and 5W30.",
      },
      { type: "tip", text: "Label each machine with the oil and the grade it uses, so the right one goes in every time." },
    ],
  },
  {
    slug: "shuttering-oil-mold-release-concrete-finish",
    title: "Shuttering oil and mold release: how to get a clean concrete finish",
    category: "Construction chemicals",
    line: "construction",
    summary:
      "What release agents do, how to choose between oil and grease, and the site habits that give clean concrete faces and longer-lasting formwork.",
    image: "/images/blog-construction.webp",
    imageAlt: "Release oil sprayed onto steel formwork beside rising reinforcement bars at dusk",
    share: "/images/og-construction.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "Concrete bonds to almost anything it sets against. A release agent on the formwork or mould stops that bond, so the form strips cleanly, the concrete keeps a sound, even face, and the formwork can be used again.",
      },
      { type: "h2", text: "Shuttering oil or mold release?" },
      {
        type: "ul",
        items: [
          "Shuttering oil and shuttering grease are used on formwork on site: walls, columns, slabs and beams.",
          "Mold release oil (precast shuttering oil, such as our Silease 360) is used on moulds, typically for precast concrete units and products.",
        ],
      },
      {
        type: "p",
        text: "Both come as oils and as greases. Which suits you depends on the formwork or mould material, the orientation of the surface and how you apply it. Tell your supplier about the job and ask for a recommendation.",
      },
      { type: "h2", text: "Before you apply" },
      {
        type: "ul",
        items: [
          "Clean the formwork: remove old concrete, dust, rust and debris.",
          "Repair damaged faces. A release agent cannot hide a poor surface.",
          "Keep release agent off the reinforcement: on steel bars it weakens the bond between steel and concrete.",
        ],
      },
      { type: "h2", text: "Applying it" },
      {
        type: "ul",
        items: [
          "Apply a thin, even coat. Too much can pool, stain the concrete or leave blemishes on its surface.",
          "Cover the whole face, including edges and corners.",
          "Keep treated forms clean and dry until the pour, protected from rain and dust.",
          "Pour within the time the product’s data sheet allows after application.",
        ],
      },
      { type: "h2", text: "After striking" },
      {
        type: "p",
        text: "Clean the formwork as soon as it is struck, before any residue hardens, and store it flat and covered. Well-kept formwork gives better faces and lasts for more pours.",
      },
      {
        type: "tip",
        text: "For exposed architectural concrete, trial the release agent on a sample panel before the first pour.",
      },
    ],
  },
  {
    slug: "storing-handling-industrial-lubricants",
    title: "Storing and handling industrial lubricants: a practical checklist",
    category: "Lubricants",
    line: "lubricants",
    summary:
      "Most lubrication problems start before the oil reaches the machine. Simple rules for storing drums, dispensing oil and keeping it clean.",
    image: "/images/blog-storage.webp",
    imageAlt: "Rows of stainless-steel tanks with valves and pipework along the aisle of a production hall",
    share: "/images/og-services.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "A lubricant can leave the factory in perfect condition and still fail in service, because water, dust or another oil got into it on the way to the machine. Good storage and handling cost little and protect every litre you buy.",
      },
      { type: "h2", text: "Storage" },
      {
        type: "ul",
        items: [
          "Store lubricants indoors, in a cool, dry, well-ventilated place, away from direct sun, heat and sources of ignition.",
          "Keep containers closed until they are needed.",
          "Store drums on their side with the bungs at the 3 and 9 o’clock positions, or covered if they stand upright, so that rainwater cannot collect on top and be drawn in.",
          "Keep drums off the floor, on racks or pallets.",
          "Use the oldest stock first, and keep labels clean and readable.",
        ],
      },
      { type: "h2", text: "Dispensing" },
      {
        type: "ul",
        items: [
          "Use clean, dedicated containers, pumps and funnels for each product, and label them.",
          "Never mix products unless the supplier confirms they are compatible.",
          "Wipe drum tops and fill points before opening them.",
          "Filter oil into hydraulic systems when the equipment maker recommends it.",
        ],
      },
      { type: "h2", text: "Safety and the environment" },
      {
        type: "ul",
        items: [
          "Keep the safety data sheet for every product where it is stored and used.",
          "Wear suitable gloves and eye protection when handling lubricants.",
          "Keep spill kits to hand and clean up spills at once.",
          "Collect used oil separately and dispose of it through an authorised recycler.",
        ],
      },
      {
        type: "tip",
        text: "One mislabelled container can put the wrong oil into a machine. Label everything, including transfer cans.",
      },
    ],
  },
  {
    slug: "anti-spatter-spray-welding",
    title: "Anti-spatter spray: cleaner welds and less grinding",
    category: "Aerosols",
    line: "aerosols",
    summary:
      "Why weld spatter sticks, how an anti-spatter spray stops it, and why silicone-free matters when parts will be painted or powder coated.",
    image: "/images/blog-aerosols.webp",
    imageAlt: "A back-lit aerosol mist drifting over a steel plate",
    share: "/images/og-aerosols.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "Every MIG / MAG weld throws out small droplets of molten metal. Where they land on the workpiece, on fixtures or on the torch nozzle, they fuse on and have to be chipped or ground off: time, abrasives and sometimes damaged surfaces.",
      },
      { type: "h2", text: "How anti-spatter works" },
      {
        type: "p",
        text: "An anti-spatter spray leaves a thin film on the surface. Spatter that lands on the film cannot fuse to the metal underneath, so it brushes or wipes off instead of being ground away. The same film protects jigs, fixtures and nozzles.",
      },
      { type: "h2", text: "Why silicone-free matters" },
      {
        type: "p",
        text: "Silicone residues are hard to remove and can cause defects such as craters and poor adhesion in paint and powder coating. If welded parts are going to be painted or powder coated, choose a silicone-free anti-spatter spray. Krini Crude’s anti-spatter spray is silicone-free.",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "ul",
        items: [
          "Shake the can well.",
          "Spray a light, even coat on the surfaces around the joint, on fixtures and on the nozzle, from the distance given on the can.",
          "Let the solvent flash off before you strike an arc.",
          "Reapply as the film wears off during long runs.",
        ],
      },
      { type: "h2", text: "Safety" },
      {
        type: "p",
        text: "Aerosols are pressurised and usually flammable. Spray before welding, never onto hot work or near an arc. Work with good ventilation, and store cans away from heat and direct sun.",
      },
      { type: "tip", text: "A light coat is enough. More spray does not mean more protection, only more to clean off." },
    ],
  },
  {
    slug: "private-label-lubricants-manufacturing",
    title: "Private label lubricants: how manufacturing under your brand works",
    category: "Private label",
    summary: "From brief to a packed product with your name on it: the steps, what to prepare, and the questions to ask a manufacturer.",
    image: "/images/blog-private-label.webp",
    imageAlt: "An industrial plant at dusk: a long factory building, pipe racks and storage tanks",
    share: "/images/og-contact.jpg",
    date: DATE,
    body: [
      {
        type: "p",
        text: "Private label manufacturing lets a brand sell lubricants, construction chemicals or aerosols under its own name without building a factory. The manufacturer formulates, tests, blends and packs; the brand keeps the customer.",
      },
      {
        type: "p",
        text: "Krini Crude manufactures for well-recognised brands in the automotive aftermarket, construction, MRO and general industrial categories, and for independent marketing companies across the globe.",
      },
      { type: "h2", text: "What to prepare" },
      {
        type: "ul",
        items: [
          "The applications and customers the product is for",
          "Any specifications or standards the product must meet",
          "Pack sizes, container types, and your artwork and labels",
          "Expected volumes and timelines",
          "The label information required where the product will be sold",
        ],
      },
      { type: "h2", text: "Questions to ask a manufacturer" },
      {
        type: "ul",
        items: [
          "Can you make it to our formulation, or develop one with us?",
          "How is each batch tested, and what records do we receive?",
          "Which pack sizes and containers can you fill?",
          "What are your minimum order quantities and lead times?",
          "Which quality certifications do you hold?",
          "What after-sales support do you provide?",
        ],
      },
      {
        type: "tip",
        text: "Agree the specification in writing before the first batch: it is the reference for every batch that follows.",
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

/** Reading time in minutes, at about 200 words a minute. */
export function readingTime(a: Article) {
  const words = a.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export const categories: Category[] = ["Lubricants", "Construction chemicals", "Aerosols", "Private label"];
