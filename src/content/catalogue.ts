/**
 * The product catalogue: three product lines and the products in each.
 *
 * Product names, variants and grades are as published on krinicrude.com
 * (home page and the /lubricants, /construction and /aerosols pages, read
 * September and October 2026), and so are the lines' descriptions, the
 * pages' series names and the "Available products" in `range` (word for
 * word). The `about` and `uses`
 * lines explain in general terms what each type of product is for; they make
 * no claim about Krini Crude's own specifications. Anything the live site does
 * not state (technical data, pack sizes) is a placeholder().
 */
import { placeholder, type Placeholder } from "./placeholder";

export type ProductRangeItemDetails = {
  image?: string;
  imageAlt?: string;
  description?: string;
  purpose?: string[];
  coverage?: string;
  coverageNote?: string;
  benefits?: string[];
  properties?: {
    property: string;
    value: string;
    spec?: string;
  }[];
  propertiesPendingNote?: string;
  application?: string[];
  packing?: string;
  storage?: string;
  shelfLife?: string;
  note?: string;
  pdsRevision?: string;
  status?: "verified" | "pending";
  purposeTitle?: string;
  applicationTitle?: string;
  dilution?: string;
  dilutionNote?: string;
  dilutionRatios?: {
    operation: string;
    ratio: string;
  }[];
  metaLine?: string;
  sheetUrl?: string;
  sheetLabel?: string;
  reportUrl?: string;
  reportLabel?: string;
  videoUrl?: string;
  reportKicker?: string;
  reportButtonText?: string;
};

export type ProductRangeItem = {
  name: string;
  text: string;
  details?: ProductRangeItemDetails;
};

export type Product = {
  id: string;
  name: string;
  /** Variants or grades, as listed on krinicrude.com. */
  variants?: string[];
  /** "Available products" under this category on krinicrude.com: each name and its description, word for word. */
  range?: ProductRangeItem[];
  /** What this type of product does, in general terms. */
  about: string;
  /** Precise 3-line card description for shop cards. */
  cardText?: string;
  /** Typical uses, in general terms. */
  uses?: string[];
  /** Krini Crude's own published claims for the product. */
  claims?: string[];
  /** Missing facts, shown as TBC chips. */
  tbc?: Placeholder[];
};

export type Line = {
  id: "lubricants" | "construction" | "aerosols";
  /** The brand this line is sold under (shown on its products' cards and pages); a logo where we have one. */
  brand: { name: string; logo?: string; logoFull?: string };
  slug: string;
  index: string;
  title: string;
  short: string;
  /** The line's description on krinicrude.com (home page, "Our Product Range"), word for word. */
  description: string;
  /** The line's own page on krinicrude.com: its title and the line under it, word for word. */
  series: string;
  strap: string;
  image: string;
  imageAlt: string;
  seo: { title: string; description: string };
  /** The page's h1 (the paragraph under it is the description, above). */
  heading: string;
  products: Product[];
  /** Industries on krinicrude.com that this line serves (ids in site.industries). */
  industries: string[];
  faq: { q: string; a: string }[];
};

const TDS = placeholder("Technical data sheet");

export const lines: Line[] = [
  {
    id: "lubricants",
    brand: { name: "1-COOL", logo: "/images/logo-1cool-mark.webp", logoFull: "/images/logo-1cool.webp" },
    slug: "lubricants",
    index: "01",
    title: "Lubricants",
    short: "Lubricants",
    description:
      "Premium quality lubricants and greases for automotive, industrial, and specialty applications. Our lubricants ensure optimal performance and longevity.",
    series: "1-COOL Metal Working Fluid Series",
    strap: "Cutting Oil • Soluble Cutting Oil • Rust Preventive • Hydraulic • Gear • Engine Oils",
    image: "/images/lubricants.webp",
    imageAlt: "A drop of amber lubricant stretching from a steel nozzle",
    seo: {
      title: "Cutting Oils, Coolants, Hydraulic, Gear & Engine Oils | Krini Crude",
      description:
        "1-COOL neat and soluble cutting oils, rust preventives, hydraulic oil 32/46/68, gear oil 90 to 320 and engine oils 15W40, 20W40, 5W30. Made in Chennai.",
    },
    heading: "1-COOL metalworking fluids and industrial lubricants.",
    products: [
      {
        id: "cutting-oil",
        name: "Cutting Oil",
        variants: ["Neat cutting oil", "Broaching", "Gear hobbing", "Stamping", "Drawing oil"],
        cardText:
          "Neat cutting oils used undiluted to reduce friction, prevent tool wear, and deliver a smooth machining surface finish.",
        about:
          "Neat (straight) cutting oils are used undiluted. They lubricate the contact between tool and workpiece, which reduces friction and tool wear and helps give a good surface finish.",
        uses: ["Machining where lubrication at the cutting edge matters most", "Broaching and gear hobbing", "Stamping and drawing of sheet metal"],
        tbc: [TDS],
      },
      {
        id: "soluble-cutting-oil",
        name: "Soluble Cutting Oil",
        variants: ["Mineral coolant oil", "Semi-synthetic coolant oil"],
        range: [
          {
            name: "1-COOL Aquacut 150",
            text: "Premium mineral coolant cutting fluid developed for light to heavy duty machining and grinding.",
            details: {
              status: "verified",
              pdsRevision: "PDS 2024",
              image: "/images/1-cool-aquacut-150-pail.webp",
              imageAlt: "1-COOL Aquacut 150 water soluble coolant oil 20L pail",
              sheetUrl: "/documents/1-cool-aquacut-150-pds-2024.pdf",
              sheetLabel: "1-COOL Aquacut 150 Product Data Sheet (PDS 2024)",
              videoUrl: "/videos/products/1-cool-aquacut-150.mp4",
              description:
                "1-COOL AQUACUT 150 is a premium mineral coolant cutting fluid developed for use in light to heavy duty machining of ferrous and non-ferrous metal alloys, as well as general purpose grinding. Formulated with special lubricity and E.P. additives and rust inhibitors, it delivers extended sump life and improved tool longevity.",
              metaLine:
                "Key benefits · Technical properties · Dilution ratios · Mixing guidelines · Storage & handling · Packing",
              dilution: "3% – 8%",
              dilutionNote: "Grinding (3–5%), General Machining (5–6%), Heavy Duty (5–8%)",
              purposeTitle: "Suitable Operations & Material Compatibility",
              purpose: [
                "Light to heavy duty machining operations",
                "General purpose metal grinding",
                "Cast Iron",
                "Ferrous & non-ferrous metal alloys",
                "Stainless Steels",
                "Turning, milling, drilling & sawing",
              ],
              benefits: [
                "Excellent cooling and lubricating properties for superior surface finish",
                "High resistance to bacterial attack, reducing foul odour and maximizing coolant life",
                "Forms a highly stable milky emulsion even in hard water conditions",
                "Offers excellent rust and corrosion protection for multi-metal components",
                "Nitrite and chlorine free, ensuring an environmentally safe workspace",
                "Significantly extends sump life while minimizing cutting tool wear",
              ],
              properties: [
                { property: "Appearance (Concentrate)", value: "Clear brown transparent", spec: "Visual" },
                { property: "Emulsion Appearance", value: "Milky White", spec: "Diluted in water" },
                { property: "Density @ 29.5 °C", value: "0.840 g/ml", spec: "Standard density" },
                { property: "Thermal Stability Test", value: "Passes", spec: "Stable thermal profile" },
                { property: "Cast Iron Corrosion Test", value: "No rust", spec: "@ 3%, 200 ppm (IP 287)" },
                { property: "pH (5% dilution)", value: "9.4", spec: "In distilled water" },
                { property: "Refractometer Reading Factor", value: "1.0", spec: "Direct reading" },
              ],
              dilutionRatios: [
                { operation: "Surface & Cylindrical Grinding", ratio: "3 – 5 %" },
                { operation: "General Machining (Turning / Milling)", ratio: "5 – 6 %" },
                { operation: "Heavy Duty Cutting & Broaching", ratio: "5 – 8 %" },
              ],
              applicationTitle: "Mixing Guidelines & Sump Management",
              application: [
                "While mixing, always add coolant oil to water and never the reverse, agitating continuously to ensure a homogenous milky emulsion.",
                "Use good quality water. Deionized (D.I.) water provides extended sump life, as high water hardness and chlorides reduce emulsion life and corrosion inhibition.",
                "Always thoroughly clean and sterilize the machine sump before charging with fresh coolant mixture.",
                "Check emulsion concentration regularly using a refractometer (multiplication factor: 1.0) and top up with premixed coolant rather than pure water.",
              ],
              packing: "Standard packing: 20 L pails & 210 L industrial steel drums",
              storage:
                "Store indoors in original tightly sealed containers between 5 °C and 40 °C. Protect from freezing and direct exposure to intense heat or rain.",
              shelfLife: "12 months from date of manufacture when stored in unopened containers",
              note: "Typical values based on laboratory batch testing (PDS Rev. 2024). Technical values are typical and not a sales specification.",
            },
          },
          {
            name: "1-COOL AL 5000",
            text: "High-performance semi-synthetic, environment friendly cutting fluid for light to heavy duty machining and grinding.",
            details: {
              status: "verified",
              pdsRevision: "PDS 2026",
              image: "/images/1-cool-al-5000-pail.webp",
              imageAlt: "1-COOL AL 5000 semi synthetic coolant oil 20L pail",
              sheetUrl: "/documents/1-cool-al-5000-pds.pdf",
              sheetLabel: "1-COOL AL 5000 Product Data Sheet (PDS 2026)",
              videoUrl: "/videos/products/1-cool-al-5000.mp4",
              description:
                "1-COOL AL 5000 is a semi-synthetic, environment friendly cutting fluid developed for use in light to heavy duty machining of ferrous and non-ferrous metal alloys. It is also suitable for general purpose grinding. Formulated with special lubricity and E.P. additives and rust inhibitors, it delivers extended sump life, reduced downtime, and improved tool longevity.",
              metaLine:
                "Key benefits · Technical properties · Dilution ratios · Mixing guidelines · Storage & handling · Packing",
              dilution: "3% – 12%",
              dilutionNote: "Grinding (3–5%), General Machining (4–5%), Heavy Duty (6–12%)",
              purposeTitle: "Suitable Operations & Material Compatibility",
              purpose: [
                "Light to heavy duty machining operations",
                "General purpose metal grinding",
                "Cast Iron",
                "Ferrous and Non-ferrous Alloys",
                "Stainless Steels",
                "Turning, milling, drilling & sawing",
              ],
              benefits: [
                "Excellent cooling and lubricating properties for precision surface finish",
                "Pleasant odour of the emulsions, making it highly user friendly",
                "High resistance to bacterial attack, reducing odour and maximizing coolant life",
                "Forms a stable emulsion even in hard water conditions",
                "Offers excellent rust protection of ferrous components",
                "Reduces machine downtime and maintenance costs",
                "Nitrite and chlorine free, hence environmentally safe",
              ],
              properties: [
                { property: "Appearance (Concentrate)", value: "Clear Amber fluid", spec: "Visual inspection" },
                { property: "Emulsion Appearance", value: "Translucent to off white", spec: "Diluted in water" },
                { property: "Density @ 29.5 °C", value: "0.970 g/ml", spec: "Standard density" },
                { property: "Thermal Stability Test", value: "Passes", spec: "Stable thermal profile" },
                { property: "Cast Iron Corrosion Test", value: "No rust", spec: "@ 3%, 200 ppm (IP 287)" },
                { property: "pH (10% dilution)", value: "9.6", spec: "In distilled water" },
                { property: "Refractometer Reading Factor", value: "1.4", spec: "Refractometer multiplier" },
              ],
              dilutionRatios: [
                { operation: "Surface & Cylindrical Grinding", ratio: "3 – 5 %" },
                { operation: "General Machining (Turning / Milling)", ratio: "4 – 5 %" },
                { operation: "Heavy Duty Machining & Cutting", ratio: "6 – 12 %" },
              ],
              applicationTitle: "Mixing Guidelines & Sump Management",
              application: [
                "While mixing, always add oil to water and never the reverse, agitating thoroughly to form a stable translucent emulsion.",
                "Use good quality water. Deionized (D.I.) water gives extended sump life, as high hardness and chlorides reduce product life and corrosion inhibition.",
                "Ensure machine sumps are thoroughly cleaned and sterilized before charging with fresh coolant mixture.",
                "Check emulsion concentration regularly using a refractometer (multiplication factor: 1.4) and replenish with premixed emulsion rather than pure water.",
              ],
              packing: "Standard packing: 20 L pails & 210 L industrial steel drums",
              storage:
                "Store indoors in original tightly closed containers between 5 °C and 40 °C. Protect from freezing and direct exposure to intense heat or rain.",
              shelfLife: "12 months from date of manufacture when stored in unopened containers",
              note: "Typical values based on laboratory batch testing (PDS Rev. 2026). Technical values are typical and not a sales specification.",
            },
          },
          {
            name: "1-COOL AL 7000",
            text: "Premium semi synthetic coolant oil engineered for heavy duty machining and grinding.",
            details: {
              status: "verified",
              pdsRevision: "PDS 2026",
              image: "/images/1-cool-al-7000.webp",
              imageAlt: "1-COOL CASPRO 7000 semi synthetic coolant oil 26L pail",
              sheetUrl: "/documents/1-cool-al-7000-pds.pdf",
              sheetLabel: "1-COOL AL 7000 Product Data Sheet (PDS 2026)",
              description:
                "1-COOL CASPRO 7000 is a high performance semi synthetic metal working coolant oil designed for a wide range of machining and grinding operations. It provides excellent cooling, lubrication and corrosion protection, ensuring longer tool life and superior surface finish.",
              dilution: "3% – 10%",
              dilutionNote: "Grinding (3–5%), General Machining (4–6%), Heavy Duty (6–10%)",
              purposeTitle: "Application & Operations",
              purpose: [
                "CNC machining",
                "Milling, Turning, Drilling",
                "Grinding operations",
                "General metal working processes",
                "Ferrous and non-ferrous metals",
              ],
              benefits: [
                "Excellent cooling and lubrication",
                "Longer tool life and reduced machine wear",
                "Better precision surface finish",
                "Good corrosion protection",
                "Stable emulsion with high sump life",
                "Suitable for a wide range of metals",
              ],
              properties: [
                { property: "Appearance", value: "Light Yellow", spec: "Visual" },
                { property: "Emulsion Type", value: "White Milky", spec: "Diluted in water" },
                { property: "pH (5-6% emulsion)", value: "8.5 – 9.5", spec: "Standard pH" },
                { property: "Specific Gravity @ 30°C", value: "0.95 – 1.05", spec: "Standard density" },
                { property: "Refractometer Factor", value: "1.0", spec: "Direct reading" },
              ],
              application: [
                "Always add oil into water while stirring continuously to ensure a stable milky emulsion.",
                "Maintain concentration between 4% to 8% depending on operation severity.",
                "Keep sump clean and aerated for maximum coolant performance.",
              ],
              packing: "Standard packing: 26 L pails & 210 L industrial steel drums",
              storage:
                "Store in a cool, dry place. Keep the container tightly closed. Avoid direct sunlight. Refer MSDS for safe handling.",
              shelfLife: "12 months from date of manufacture when stored in unopened containers",
            },
          },
        ],
        about:
          "Soluble cutting oils are mixed with water to make a coolant. The coolant carries heat away from the cutting zone, lubricates, flushes away chips and helps protect parts and machines from rust.",
        uses: ["Turning, milling, drilling and other machining with a coolant system", "Operations where cooling matters as much as lubrication"],
        tbc: [TDS],
      },
      {
        id: "rust-preventive-oil",
        name: "Rust Preventive Oil",
        variants: ["Dewatering RP oil", "Oil based RP oil"],
        range: [
          {
            name: "1-COOL Rust Proteck R5",
            text: "Dewatering rust preventive oil for machined metal components with fast water displacement.",
            details: {
              status: "verified",
              pdsRevision: "PDS 2026",
              image: "/images/rust-preventive-oil.webp",
              imageAlt: "1-COOL Rust Proteck R5 rust preventive oil 20L pail",
              sheetUrl: "/documents/rust-preventive-oil-pds.pdf",
              sheetLabel: "1-COOL Rust Proteck R5 Product Data Sheet (PDS 2026)",
              description:
                "1-COOL RUST PROTECK R5 is a rust preventive oil with dewatering properties, designed to protect metal components from rust and corrosion. It quickly displaces moisture and forms a protective film on the metal surface.",
              purpose: [
                "Rust prevention for machined metal components",
                "Dewatering after cleaning operations",
                "Storage and transit protection",
                "Suitable for ferrous metals",
                "General industrial use",
              ],
              benefits: [
                "Excellent rust protection",
                "Quick water displacement",
                "Good film coverage",
                "Easy application by dip, spray or brush",
                "Suitable for storage and shipment",
              ],
              properties: [
                { property: "Appearance", value: "Clear Light Yellow", spec: "Visual" },
                { property: "Density @ 30°C", value: "0.85 – 0.90 g/cm³", spec: "ASTM D1298" },
                { property: "Kinematic Viscosity @ 40°C (cSt)", value: "10 – 20 cSt", spec: "ASTM D445" },
                { property: "Flash Point (°C)", value: "> 150 °C", spec: "ASTM D92" },
              ],
              application: [
                "Apply neat as supplied by dipping, spraying or brushing onto clean metal parts.",
                "Ensure parts are adequately drained after immersion to form a uniform protective barrier.",
              ],
              packing: "Standard packing: 20 L pails & 210 L steel drums",
              storage:
                "Store in a cool, dry place. Keep the container tightly closed. Avoid direct sunlight and keep away from heat and ignition sources.",
              shelfLife: "12 months from date of manufacture when stored as recommended.",
            },
          },
        ],
        about:
          "Rust preventive oils leave a protective film on metal parts between operations, in storage and in transit. Dewatering types first displace water from freshly washed or machined parts.",
        uses: ["Protecting machined components between operations", "Storage and shipment of steel parts", "Parts that come out of washing or water-based coolant"],
        tbc: [TDS],
      },
      {
        id: "hydraulic-oil",
        name: "Hydraulic Oil",
        variants: ["32", "46", "68"],
        range: [
          {
            name: "1-COOL Hydraulic 68",
            text: "High performance anti-wear hydraulic oil formulated with premium base oils and advanced additives.",
            details: {
              status: "verified",
              pdsRevision: "PDS 2026",
              image: "/images/hydraulic-oil.webp",
              imageAlt: "1-COOL Hydraulic 68 high performance hydraulic oil 20L pail",
              sheetUrl: "/documents/hydraulic-oil-pds.pdf",
              sheetLabel: "1-COOL Hydraulic Oil Product Data Sheet (PDS 2026)",
              videoUrl: "/videos/products/1-cool-hydraulic-68.mp4",
              description:
                "1-COOL HYDRAULIC 68 is a high performance anti-wear hydraulic oil, formulated with premium base oils and advanced additives to provide excellent oxidation stability, wear protection and long service life in hydraulic systems.",
              purposeTitle: "Application & Equipment",
              purpose: [
                "Hydraulic systems",
                "Industrial hydraulic equipment",
                "Machine tools",
                "Presses and injection moulding machines",
                "Circulation systems",
                "General industrial use",
              ],
              benefits: [
                "Excellent anti-wear protection",
                "Good oxidation stability",
                "Resists rust and corrosion",
                "Maintains system cleanliness",
                "Longer oil life and reduced downtime",
                "Smooth operation",
              ],
              properties: [
                { property: "Appearance", value: "Clear Light Yellow", spec: "Visual" },
                { property: "Density @ 30°C (g/cm³)", value: "0.86 – 0.90", spec: "ASTM D1298" },
                { property: "Kinematic Viscosity @ 40°C (cSt)", value: "68", spec: "ASTM D445" },
                { property: "Viscosity Index", value: "≥ 95", spec: "ASTM D2270" },
                { property: "Flash Point (°C)", value: "≥ 200", spec: "ASTM D92" },
                { property: "Pour Point (°C)", value: "≤ -15", spec: "ASTM D97" },
              ],
              packing: "Standard packing: 20 L pails & 210 L steel drums",
              storage:
                "Store in a cool, dry place. Keep container tightly closed. Avoid direct sunlight. Keep away from heat and ignition sources. Refer MSDS for safe handling.",
              shelfLife: "12 months from date of manufacture when stored as recommended.",
            },
          },
        ],
        about:
          "Hydraulic oils transmit power in hydraulic systems while lubricating pumps, valves and cylinders. The grade is the oil's viscosity: choose the one your equipment maker recommends for your operating temperatures.",
        uses: ["Hydraulic presses and injection moulding machines", "Machine tool hydraulics", "Mobile and industrial hydraulic equipment"],
        tbc: [TDS],
      },
      {
        id: "gear-oil",
        name: "Gear Oil",
        variants: ["90", "140", "220", "320"],
        cardText:
          "Lubricates gearboxes and drives, maintaining an oil film under heavy loads to reduce friction, heat and tooth wear.",
        about:
          "Gear oils lubricate gearboxes and gear drives, keeping a film of oil between meshing teeth under load to reduce wear, heat and noise.",
        uses: ["Industrial gearboxes and gear drives", "Automotive and equipment gear assemblies, as specified by the manufacturer"],
        tbc: [TDS],
      },
      {
        id: "engine-oil",
        name: "Engine Oil",
        variants: ["15W40", "20W40", "5W30"],
        cardText:
          "Engine oils lubricate, clean and cool internal combustion engines, protecting vital parts from wear and thermal stress.",
        about:
          "Engine oils lubricate, clean and cool internal combustion engines. Use the grade your vehicle or engine manufacturer specifies.",
        uses: ["Petrol and diesel engines, in the grade the engine maker specifies"],
        tbc: [TDS],
      },
      {
        id: "greases",
        name: "Greases",
        cardText:
          "High-performance lubricants thickened to stay in place where oils run off, protecting bearings, joints and slides.",
        about:
          "Greases are lubricants thickened to stay in place where an oil would run off, for bearings, joints and slides that are not in a circulating oil system.",
        tbc: [placeholder("Grease types and grades")],
      },
    ],
    industries: ["auto-assembly", "auto-component"],
    faq: [
      {
        q: "What is the difference between neat and soluble cutting oil?",
        a: "Neat cutting oil is used undiluted and mainly lubricates the cut. Soluble cutting oil is mixed with water into a coolant that cools as well as lubricates. The right choice depends on the operation, the material and your machines; our team can advise.",
      },
      {
        q: "Which grades of hydraulic, gear and engine oil do you make?",
        a: "Hydraulic oil in grades 32, 46 and 68; gear oil in grades 90, 140, 220 and 320; engine oil in 15W40, 20W40 and 5W30.",
      },
      {
        q: "What is 1-COOL?",
        a: "1-COOL is Krini Crude's metalworking fluid series: cutting oils, soluble cutting oils (coolants), rust preventive, hydraulic, gear and engine oils.",
      },
      {
        q: "Can you make a lubricant to our own formulation or under our brand?",
        a: "Yes. We manufacture to our own formulations and to formulations specified by customers, and we make products for brands to sell under their own name.",
      },
    ],
  },
  {
    id: "construction",
    brand: { name: "Lubecon", logo: "/images/logo-lubecon.webp" },
    slug: "construction-chemicals",
    index: "02",
    title: "Construction Chemicals",
    short: "Construction",
    description:
      "High-performance construction chemicals and solutions for infrastructure, building, and civil engineering projects. Built for durability and strength.",
    series: "Construction Chemicals",
    strap: "Shuttering Oil • Shuttering Grease • Mold Release Solutions",
    image: "/images/construction.webp",
    imageAlt: "Release oil sprayed onto steel formwork beside rebar at dusk",
    seo: {
      title: "Shuttering Oil, Mold Release Oil & Greases Manufacturer | Krini Crude",
      description:
        "Shuttering oil and grease, mold release oil and grease for formwork and precast concrete, made in Chennai for building and infrastructure projects.",
    },
    heading: "Shuttering and mold release oils and greases for concrete.",
    products: [
      {
        id: "shuttering-oil",
        name: "Shuttering Oil",
        range: [
          /* listed first on krinicrude.com/construction (October 2026), without a page of its own yet */
          {
            name: "Repel Shuttering Oil",
            text: "Premium shuttering oil suitable for aluminium and all formwork, ensuring clean stripping and smooth concrete surface finishes.",
          },
          {
            name: "Silease 360 Shuttering Oil",
            text: "Precast shuttering oil and mould release agent for precast concrete production.",
            details: {
              status: "verified",
              pdsRevision: "Rev. 09/2026",
              image: "/images/silease-360-shuttering-oil.webp",
              imageAlt: "Silease 360 Precast Shuttering Oil 200L drum",
              description:
                "SILEASE 360 is a ready-to-use mould release oil developed for precast concrete production. It forms a uniform release film on the formwork, supports clean demoulding and helps reduce surface pinholes and honeycombing when applied correctly.",
              purpose: [
                "Precast concrete production",
                "Mild steel moulds",
                "Plywood formwork",
                "FRP formwork",
                "Vertical and horizontal precast moulding",
              ],
              coverage: "40 m²/L",
              coverageNote:
                "Average coverage. Actual coverage may vary with formwork porosity, surface condition and application method.",
              benefits: [
                "Helps minimise pinholes and improves the appearance of precast concrete surfaces",
                "Provides clean and easy demoulding with reduced concrete adhesion to formwork",
                "Promotes a uniform surface finish without adversely affecting concrete colour",
                "Suitable for vertical and horizontal precast moulding applications",
                "Ready to use and economical due to high spreading coverage",
              ],
              properties: [
                { property: "Appearance", value: "Milky / Ivory Emulsion", spec: "Visual inspection" },
                { property: "Viscosity, B4 cup", value: "Typical: 100 seconds", spec: "Specification: 30–200 seconds" },
                { property: "Density at 15 °C", value: "Approx. 0.90 g/mL", spec: "Specification: >0.866 g/mL" },
                { property: "Suitable formwork", value: "Mild steel, plywood and FRP", spec: "Precast moulds" },
                { property: "Coverage", value: "Average 40 m²/L", spec: "Typical site rate" },
              ],
              application: [
                "Clean the formwork and remove concrete residue, rust, dust, water and excess oil.",
                "Apply a very thin, uniform film by fine spray, lint-free cloth, roller or suitable applicator.",
                "Avoid puddles and over-application; wipe off excess oil before placing reinforcement or concrete.",
                "For new or highly absorbent plywood, conduct a small site trial and adjust the application rate.",
              ],
              packing: "Standard packing: 200 L barrel",
              storage:
                "Store in the original closed container in a cool, dry, well-ventilated area away from heat and direct sunlight. Use appropriate gloves and eye protection. Avoid prolonged skin contact. Refer to the Safety Data Sheet before use.",
              shelfLife: "6 months from date of manufacture when stored as recommended",
              sheetUrl: "/documents/silease-360-shuttering-oil-pds-2026.pdf",
              sheetLabel: "Silease 360 Precast Shuttering Oil PDS (Rev. 09/2026)",
              note: "Typical values are not guaranteed specifications. Suitability and coverage should be confirmed by a site trial under actual conditions. For industrial use only.",
            },
          },
          {
            name: "Magic Shuttering Oil",
            text: "High-performance release oil for Mivan aluminium formwork, MS, plywood and all formworks.",
            details: {
              status: "verified",
              pdsRevision: "Rev. 09/2026",
              description:
                "Magic Shuttering Oil is a ready-to-use release oil developed for Mivan aluminium formwork. It forms a thin, uniform release film that supports clean demoulding, smooth concrete finishes and efficient reuse of formwork when applied correctly.",
              purpose: [
                "Mivan aluminium formwork",
                "Mild steel (MS) formwork",
                "Plywood formwork",
                "Building and infrastructure site formwork",
              ],
              coverage: "30–40 m²/L",
              coverageNote:
                "Average coverage. Actual coverage may vary with formwork porosity, surface condition and application method.",
              benefits: [
                "Excellent release performance on Mivan aluminium formwork",
                "Clean demoulding with reduced adhesion to the formwork",
                "Promotes a smooth and uniform concrete surface finish",
                "Helps reduce concrete build-up and simplifies cleaning",
                "Ready to use with economical spreading coverage",
              ],
              properties: [
                { property: "Appearance", value: "Brown transparent liquid", spec: "Visual inspection" },
                { property: "Kinematic viscosity at 40 °C", value: "Typical: 32 cSt", spec: "Specification: >12 cSt" },
                { property: "Density at 15 °C", value: "Typical: 0.88 g/mL", spec: "Specification: >0.80 g/mL" },
                { property: "Flash point, Pensky-Martens", value: "Typical: 180 °C", spec: "Specification: >100 °C" },
                { property: "Coverage", value: "30–40 m²/L", spec: "Typical site rate" },
              ],
              application: [
                "Clean the formwork and remove concrete residue, rust, dust, water and excess oil.",
                "Apply a very thin, uniform film by fine spray, lint-free cloth, roller or suitable applicator.",
                "Avoid puddles and over-application; wipe off excess oil before placing reinforcement or concrete.",
                "Conduct a small site trial to establish the optimum application rate for site conditions.",
              ],
              packing: "Standard packing: 200 L barrel",
              storage:
                "Store in the original closed container in a cool, dry, well-ventilated area away from heat and direct sunlight. Use appropriate gloves and eye protection. Avoid prolonged skin contact. Refer to the Safety Data Sheet before use.",
              shelfLife: "12 months from date of manufacture when stored as recommended",
              sheetUrl: "/documents/magic-shuttering-oil-product-data-sheet-2026.pdf",
              sheetLabel: "Magic Shuttering Oil Product Data Sheet (Rev. 09/2026)",
              reportUrl: "/documents/magic-shuttering-oil-test-report-oct-2026.pdf",
              reportLabel: "Original Laboratory Test Certificate (Sri Sai Test Report Oct 2026)",
              note: "Typical values are not guaranteed specifications. Suitability and coverage should be confirmed by a site trial under actual conditions. For industrial use only.",
            },
          },
          {
            name: "Nikri 30 Shuttering Oil",
            text: "Cost-effective shuttering oil formulated for MS, plywood and infrastructure road projects with reliable concrete release.",
            /* krinicrude.com/product/nikri30, read October 2026: its key features and coverage, word for word */
            details: {
              status: "verified",
              image: "/images/nikri-30-shuttering-oil.webp",
              imageAlt: "Nikri 30 Shuttering Oil 200L drum for MS, plywood and road projects",
              sheetUrl: "/documents/nikri-30-shuttering-oil-pds.pdf",
              sheetLabel: "Nikri 30 Shuttering Oil Product Data Sheet",
              description: "Road Project Shuttering Oil. Cost Effective MS, Plywood & Road Projects Shuttering Oil.",
              purposeTitle: "Suitable formwork & projects",
              purpose: ["MS (mild steel) formwork", "Plywood formwork", "Road projects"],
              benefits: ["Easy mold release", "No stains on concrete after demolding", "Used for MS, plywood"],
              coverage: "20–25 m²/L",
            },
          },
          {
            name: "Nikri AL Shuttering Oil",
            text: "Emulsion-based concrete formwork release agent for Mivan aluminium, MS, plywood and FRP formwork.",
            details: {
              status: "verified",
              pdsRevision: "NIKRI AL / 2026",
              image: "/images/nikri-al-shuttering-oil.webp",
              imageAlt: "Nikri AL Emulsion-based Shuttering Oil 200L drum for Mivan aluminium formwork",
              sheetUrl: "/documents/nikri-al-shuttering-oil-pds.pdf",
              sheetLabel: "Nikri AL Shuttering Oil Product Data Sheet",
              description:
                "NIKRI AL is an emulsion-based shuttering oil that forms a uniform release film between concrete and formwork, supporting cleaner stripping and a smoother concrete finish.",
              purpose: [
                "Mivan aluminium formwork",
                "Mild steel (MS) formwork",
                "Plywood formwork",
                "FRP (Fibre-reinforced plastic) formwork",
                "Compatible architectural formwork",
              ],
              benefits: [
                "Promotes easy demoulding and reduces concrete adhesion",
                "Helps minimise pinholes on concrete surfaces",
                "Supports smoother, cleaner concrete finishes",
                "Recommended for Mivan aluminium, MS, plywood and FRP formwork",
              ],
              properties: [
                { property: "Appearance", value: "Ivory, non-transparent", spec: "Visual inspection" },
                { property: "Density at 15 °C", value: "0.90 g/mL", spec: "Typical (MTC batch KN/AL/09)" },
                { property: "Viscosity, B4 cup", value: "100 seconds", spec: "Standard flow cup test" },
                { property: "Flash point", value: "Not applicable", spec: "Emulsion-based formulation" },
              ],
              application: [
                "Prepare: Clean and dry the formwork; remove concrete, dust, rust flakes and excess oil.",
                "Mix: Stir the emulsion thoroughly before use.",
                "Apply: Spray, roll, brush or wipe on a thin, continuous, uniform film.",
                "Best result: Remove pools and runs; use only the minimum quantity required for complete coverage.",
              ],
              packing: "Standard packing: 200 L barrel (custom packaging on request)",
              storage:
                "Store tightly closed in a cool, dry and well-ventilated place. Protect from freezing and excessive heat. Use suitable gloves and eye protection. Avoid prolonged skin contact and inhalation of mist. Trial application is recommended before full-scale use.",
              shelfLife: "6 months from date of manufacture when stored as recommended",
              reportUrl: "/documents/nikri-al-shuttering-oil-mtc-march-2025.pdf",
              reportLabel: "View original report (MTC March 2025)",
              note: "Typical values based on MTC batch KN/AL/09, September 2026. Values are indicative and not a sales specification. Technical values are typical and not a sales specification.",
            },
          },
        ],
        about:
          "Applied to formwork (shuttering) before the concrete is poured, shuttering oil leaves a release film so the formwork strips cleanly without concrete sticking to it, which protects the concrete surface and helps the formwork last for more pours.",
      },
      {
        id: "shuttering-grease",
        name: "Shuttering Grease",
        range: [
          {
            name: "Krini Shuttering Grease",
            text: "Heavy-duty calcium-based shuttering grease for wall ties, sleeves and structural formwork.",
            details: {
              status: "verified",
              pdsRevision: "PDS - Calcium Based",
              image: "/images/krini-shuttering-grease-tub.webp",
              imageAlt: "Krini Shuttering Grease 1kg tub and bulk formwork release grease",
              sheetUrl: "/documents/krini-shuttering-grease-pds.pdf",
              sheetLabel: "Krini Shuttering Grease Product Data Sheet",
              description:
                "KRINI SHUTTERING GREASE is a calcium and oil-based release grease formulated for easy application and smooth demoulding. Ideal for wall ties, sleeves, and critical corner structures where oil runoff occurs.",
              purpose: [
                "Wall ties, sleeves and shuttering joints",
                "Critical and corner formwork structures",
                "Heavy-duty infrastructure formwork",
                "Building and structural shuttering works",
              ],
              benefits: [
                "Provides easy application and user friendly (non-hazardous)",
                "Provides smooth release from wall ties, sleeves and other shuttering works",
                "Used as mold release agent for critical or corner structures where oil performance is low",
                "Non-stainable finishing on concrete surfaces",
                "Does not leave any residue or powder after demolding",
              ],
              properties: [
                { property: "Appearance", value: "Grease", spec: "Calcium & oil based" },
                { property: "Colour", value: "Brown", spec: "Visual inspection" },
                { property: "Relative Density", value: "0.910", spec: "Standard density" },
                { property: "Drop Point", value: "100 °C", spec: "MTC Batch KN/SG/07" },
                { property: "Flash Point", value: ">230 °C (230 °C MTC)", spec: "Non-combustible" },
                { property: "Boiling Point", value: ">300 °C", spec: "Stable thermal profile" },
                { property: "Solubility", value: "Insoluble in water", spec: "Water resistant film" },
              ],
              application: [
                "Ensure formwork, wall ties, or sleeves are clean and free of heavy debris and loose rust flakes.",
                "Apply a thin, continuous and uniform film of grease using a brush, cloth, or applicator.",
                "Pay special attention to corners, joints, and critical sections prone to concrete sticking.",
                "Avoid excessive grease buildup; remove heavy runs before concrete pouring.",
              ],
              packing: "Standard packing: 20 kg buckets & 180 kg drums",
              storage:
                "Store in original tightly closed containers in a cool, dry place. Avoid excessive heat for prolonged periods of time.",
              shelfLife: "12 months from date of manufacture when stored as recommended",
              reportUrl: "/documents/krini-shuttering-grease-mtc-july-2025.pdf",
              reportLabel: "View original report (MTC July 2025)",
              note: "Stable under normal temperature conditions. Typical values based on MTC Batch KN/SG/07, July 2025. Technical values are typical and not a sales specification.",
            },
          },
          {
            name: "Repel Shuttering Grease",
            text: "Premium calcium-based shuttering grease for wall ties, sleeves and complex formwork.",
            details: {
              status: "verified",
              pdsRevision: "PDS - Calcium Based",
              image: "/images/repel-shuttering-grease-tub.webp",
              imageAlt: "Repel Shuttering Grease premium calcium-based formwork release grease tub",
              sheetUrl: "/documents/repel-shuttering-grease-pds.pdf",
              sheetLabel: "Repel Shuttering Grease Product Data Sheet",
              description:
                "REPEL SHUTTERING GREASE is a high-performance calcium and oil-based release grease formulated for easy application and smooth demoulding. Ideal for wall ties, sleeves, and critical corner structures where oil runoff occurs.",
              purpose: [
                "Wall ties, sleeves and shuttering joints",
                "Critical and corner formwork structures",
                "Complex architectural shapes and precast moulds",
                "Building and infrastructure formwork",
              ],
              benefits: [
                "Provides easy application and user friendly (non-hazardous)",
                "Provides smooth release from wall ties, sleeves and other shuttering works",
                "Used as mold release agent for critical or corner structures where oil performance is low",
                "Non-stainable finishing on concrete surfaces",
                "Does not leave any residue or powder after demolding",
              ],
              properties: [
                { property: "Appearance", value: "Grease", spec: "Calcium & oil based" },
                { property: "Colour", value: "Ivory (Half white) / Light Yellow", spec: "Visual" },
                { property: "Relative Density", value: "0.910", spec: "Standard density" },
                { property: "Drop Point", value: "100 °C", spec: "MTC Batch KN/RG/09" },
                { property: "Flash Point", value: ">230 °C (220 °C MTC)", spec: "Non-combustible" },
                { property: "Boiling Point", value: ">300 °C", spec: "Stable thermal profile" },
                { property: "Solubility", value: "Insoluble in water", spec: "Water resistant film" },
              ],
              application: [
                "Ensure formwork, wall ties, or sleeves are clean and free of heavy debris and loose rust flakes.",
                "Apply a thin, continuous and uniform film of grease using a brush, cloth, or applicator.",
                "Pay special attention to corners, joints, and critical sections prone to concrete sticking.",
                "Avoid excessive grease buildup; remove heavy runs before concrete pouring.",
              ],
              packing: "Standard packing: 20 kg buckets & 180 kg drums (3,000 kg batch capacity)",
              storage:
                "Store in original tightly closed containers in a cool, dry place. Avoid excessive heat for prolonged periods of time.",
              shelfLife: "12 months from date of manufacture when stored as recommended",
              reportUrl: "/documents/repel-shuttering-grease-mtc-sep-2026.pdf",
              reportLabel: "View original report (MTC Sep 2026 - 3,000 KGS)",
              note: "Stable under normal temperature conditions. Typical values based on MTC Batch KN/RG/09, September 2026. Technical values are typical and not a sales specification.",
            },
          },
        ],
        about:
          "A release agent for formwork in grease form. Ask our team whether an oil or a grease suits your formwork, surface and site conditions.",
      },
      {
        id: "mold-release-oil",
        name: "Mold Release Oil",
        cardText:
          "Applied to moulds so cast concrete units release cleanly with a smooth surface finish, allowing moulds to be reused.",
        about:
          "Mold (mould) release oil is applied to moulds so that cast concrete units come away cleanly, with a good surface finish, and the moulds can be reused.",
        uses: ["Precast concrete moulds", "Moulded concrete products"],
        claims: ["Formulated not just as physical release but also chemically engineered for superior performance and concrete finish."],
        tbc: [TDS],
      },
      {
        id: "mold-release-grease",
        name: "Mold Release Grease",
        about: "Mould release in grease form, for moulds and conditions where a grease is preferred to an oil.",
        uses: ["Precast concrete moulds"],
        claims: ["Formulated not just as physical release but also chemically engineered for superior performance and concrete finish."],
        tbc: [TDS],
      },
    ],
    industries: ["construction"],
    faq: [
      {
        q: "What is shuttering oil used for?",
        a: "Shuttering oil is applied to formwork before concrete is poured. It stops the concrete sticking, so the formwork strips cleanly, the concrete keeps a clean face and the formwork can be reused.",
      },
      {
        q: "What is the difference between shuttering oil and mold release oil?",
        a: "Both are release agents. Shuttering oil is used on site formwork; mold release oil is used on moulds, typically for precast concrete. We make both, in oil and grease form.",
      },
      {
        q: "Should I use a release oil or a release grease?",
        a: "It depends on the formwork or mould, the surface and how the product will be applied. Tell us about your application and our team will recommend one.",
      },
    ],
  },
  {
    id: "aerosols",
    brand: { name: "Vibrant" },
    slug: "aerosols",
    index: "03",
    title: "Aerosols",
    short: "Aerosols",
    description:
      "Advanced aerosol products for industrial maintenance, automotive care, and specialty applications. Engineered for precision and efficiency.",
    series: "Aerosol Sprays",
    strap: "Vibrant Colour Sprays • Adhesive Sprays • Industrial Solutions",
    image: "/images/aerosols.webp",
    imageAlt: "Aerosol can releasing a back-lit mist over a welded steel plate",
    seo: {
      title: "Spray Paints, Galva Zinc, Anti-Spatter & Adhesive Sprays | Krini Crude",
      description:
        "Spray paints in black or any RAL shade, galva zinc, silicone-free anti-spatter, Lock Bond adhesive and release sprays, made by Krini Crude, Chennai.",
    },
    heading: "Aerosol spray paints, anti-spatter, adhesive and release sprays.",
    products: [
      {
        id: "colour-sprays",
        name: "Vibrant Colour Sprays",
        variants: ["Black (glossy / matt)", "Any RAL shade", "Galva zinc spray"],
        about:
          "Aerosol spray paints for touch-up, marking and finishing. Colours can be matched to a powder coating or to any RAL shade.",
        range: [
          {
            name: "Black (Glossy/Matt)",
            text: "High-quality black spray paint in glossy and matt finishes for touch-up, marking and industrial finishing.",
            details: {
              status: "verified",
              pdsRevision: "Vibrant Series",
              image: "/images/black-glossy-matt.webp",
              imageAlt: "Vibrant Glossy Black acrylic aerosol spray paint can 550ml",
              sheetUrl: "/documents/black-glossy-matt-pds.pdf",
              sheetLabel: "Vibrant Black Spray Paint Product Data Sheet",
              description:
                "VIBRANT BLACK SPRAY PAINT is a premium acrylic-based aerosol spray paint formulated for indoor and outdoor applications. Engineered with fast-drying resins and deep pigment technology, it delivers a smooth, uniform, and durable coating available in deep glossy and sleek matt black finishes.",
              metaLine:
                "Indoor & Outdoor · Fast drying · High opacity · Durable finish · Weather resistant · Glossy & Matt available",
              purposeTitle: "Key Features & Application Areas",
              purpose: [
                "Indoor & Outdoor Use: High resistance to weathering, UV exposure, and environmental moisture",
                "Fast Drying: Dries to touch rapidly, enabling faster assembly and reduced handling downtime",
                "Excellent Coverage: High-opacity formulation masks underlying substrates with fewer coats",
                "Durable Coating: Resists chipping, peeling, and mild abrasion across metal, wood, and plastic surfaces",
                "Touch-Up & Finishing: Ideal for powder-coated equipment, fabricated metal parts, and maintenance touch-ups",
              ],
              benefits: [
                "Smooth, professional spray pattern with minimal overspray",
                "Available in both high-sheen Glossy Black and sophisticated Matt Black finishes",
                "Strong adhesion on clean ferrous and non-ferrous surfaces",
                "CFC-free propellant system safe for ozone layer",
                "Long-lasting colour retention without fading",
              ],
              properties: [
                { property: "Product Type", value: "Acrylic Aerosol Spray Paint" },
                { property: "Finish Options", value: "Glossy Black / Matt Black" },
                { property: "Drying Time", value: "Touch dry in 10–15 min; Full cure in 24 hrs" },
                { property: "Application Area", value: "Indoor and Outdoor" },
                { property: "Corrosion & UV Resistance", value: "Excellent" },
                { property: "Substrates", value: "Mild steel, fabricated metal, wood, ABS plastics" },
                { property: "Propellant", value: "CFC-free aerosol" },
              ],
              application: [
                "Clean surface thoroughly: remove oil, grease, rust, dirt, and moisture before spraying.",
                "Shake the can vigorously for at least 1 minute after the mixing ball begins to rattle.",
                "Hold can upright 20–30 cm from surface and apply in light, even coats using a sweeping motion.",
                "Apply 2–3 thin coats rather than one heavy coat, waiting 2–5 minutes between passes.",
                "After use, invert can and spray for 2 seconds to clear the nozzle and prevent clogging.",
              ],
              packing: "Standard packing: Aerosol spray cans (Cartons of 12 / 24 cans)",
              storage:
                "Store below 50 °C in a cool, dry, well-ventilated area away from direct sunlight, sparks, and open flames. Pressurized container: do not puncture or incinerate.",
              shelfLife: "24 months from date of manufacture when properly stored",
              note: "Krini Crude Vibrant Series Aerosol Paints.",
            },
          },
          {
            name: "Any RAL Shades",
            text: "Custom shade aerosol spray paint formulated and matched to any RAL colour code.",
            details: {
              status: "verified",
              pdsRevision: "Vibrant Series",
              image: "/images/any-ral-shades.webp",
              imageAlt: "Vibrant Custom Shade Acrylic Aerosol Spray Paint in Any RAL Colour",
              sheetUrl: "/documents/any-ral-shades-pds.pdf",
              sheetLabel: "Vibrant Custom Shade Spray Paint Product Data Sheet",
              description:
                "VIBRANT CUSTOM SHADE AEROSOL SPRAY PAINT is a professional-grade custom color-matched spray paint prepared to any requested RAL shade code. Specially formulated with quick-drying industrial resins, it provides precise color matching to powder coatings, painted equipment, and architectural standards with exceptional finish uniformity and weather durability.",
              metaLine:
                "Custom RAL color matching · Fast drying · High precision shade match · Weather resistant · Glossy, Satin & Matt finishes",
              purposeTitle: "Color Matching & Application Capabilities",
              purpose: [
                "Precise RAL Matching: Matched to any classic RAL colour code (e.g., RAL 7035, RAL 9010, RAL 5015)",
                "Touch-Up & Finishing: Seamless touch-up on powder-coated fabrications, panels, enclosures, and equipment",
                "Indoor & Outdoor Durability: Resists UV degradation, fading, moisture, and temperature fluctuations",
                "Multi-Substrate Adhesion: Bonds firmly to steel, aluminium, plastics, wood, and pre-painted surfaces",
                "Consistent Spray Pattern: Uniform mist delivers factory-level finish without runs, drips, or blotches",
              ],
              benefits: [
                "Exact shade replication matching powder-coated installations and architectural components",
                "Rapid touch-dry formulation minimizes production turnaround and downtime",
                "Available in high-gloss, satin, or semi-matt finish sheens upon request",
                "Eco-friendly, ozone-safe propellant formulation with zero CFCs or lead",
                "Long service life with high UV color fastness",
              ],
              properties: [
                { property: "Product Type", value: "Custom-Matched Acrylic Aerosol Paint" },
                { property: "Color Range", value: "Any RAL Classic Shade (Custom Formulation)" },
                { property: "Drying Time", value: "Touch dry in 10–15 min; Full cure in 24 hrs" },
                { property: "Finish Options", value: "Glossy / Satin / Matt (As per specification)" },
                { property: "Weather & UV Resistance", value: "High / Exterior Grade" },
                { property: "Application Method", value: "Aerosol Spray (Uniform fan pattern)" },
                { property: "Propellant", value: "CFC-free aerosol" },
              ],
              application: [
                "Ensure surfaces are dry, clean, and free of dust, grease, rust, and contaminants.",
                "Shake the aerosol can vigorously for at least 1 minute after the agitator ball starts rattling.",
                "Test spray on a small test piece to verify color match before primary application.",
                "Apply in 2–3 light, even coats holding the can 20–25 cm away in smooth, overlapping strokes.",
                "Allow 3–5 minutes flash-off between coats; allow 24 hours for complete hardness.",
                "Invert can and spray for 2 seconds after use to clear the actuator valve.",
              ],
              packing: "Standard packing: 400 ml aerosol spray cans (Cartons of 12 / 24 cans)",
              storage:
                "Store below 50 °C in a cool, dry, well-ventilated area away from direct sunlight and heat sources.",
              shelfLife: "24 months from date of manufacture",
              note: "Krini Crude Vibrant Series Custom Shade Aerosols.",
            },
          },
          {
            name: "Galva Zinc Spray",
            text: "Bright galvanizing zinc coating spray with boosted zinc protection for cathodic rust defense.",
            details: {
              status: "verified",
              pdsRevision: "300 GMS",
              image: "/images/galva-zinc-spray.webp",
              imageAlt: "Vibrant Bright Galva Coating 300g zinc aerosol spray can",
              sheetUrl: "/documents/galva-zinc-spray-pds.pdf",
              sheetLabel: "Vibrant Bright Galva Coating Product Data Sheet",
              description:
                "VIBRANT BRIGHT GALVA COATING is a high-performance zinc-rich cold galvanizing aerosol spray formulated with boosted zinc protection. It provides cathodic rust and corrosion defense for all ferrous metal surfaces, fabricated structural steelwork, weld seams, and cut edges, delivering a clean, bright metallic zinc finish.",
              metaLine:
                "Boosted zinc protection · Cathodic rust defense · Bright metallic finish · Fast drying · Weld-through capable · 300 gms aerosol",
              purposeTitle: "Key Features & Protective Capabilities",
              purpose: [
                "Boosted Zinc Protection: High zinc concentration delivers galvanic and barrier corrosion defense",
                "Bright Galva Finish: Matches the visual sheen of freshly hot-dip galvanized steelwork",
                "Weld Seam & Cut Edge Repair: Seals cut edges, drill holes, and welded joints after fabrication",
                "Cathodic Electrochemical Protection: Sacrificial zinc action prevents rust creep under scratches",
                "Fast Drying Formulation: Dries quickly for rapid handling, transport, or recoating",
              ],
              benefits: [
                "Prevents rust and galvanic corrosion in harsh industrial and coastal environments",
                "Excellent adhesion on bare steel, weathered galvanizing, and cleaned ferrous metals",
                "Can be used as a standalone protective coating or as a rust-inhibiting primer",
                "Smooth, even spray pattern eliminates drip marks and uneven build-up",
                "Formulated with ozone-friendly propellants and Krini Crude quality assurance",
              ],
              properties: [
                { property: "Product Type", value: "Cold Galvanizing Zinc Aerosol Coating" },
                { property: "Net Weight", value: "300 Gms" },
                { property: "Protection Type", value: "Cathodic / Electrochemical Sacrificial" },
                { property: "Finish / Sheen", value: "Bright Metallic Zinc" },
                { property: "Drying Time", value: "Touch dry in 15 min; Full cure in 24 hrs" },
                { property: "Corrosion Resistance", value: "Boosted Zinc Barrier Protection" },
                { property: "Manufacturer", value: "Krini Crude Lubricants" },
              ],
              application: [
                "Remove heavy rust, scale, grease, and dirt; abrade bare steel lightly for optimal adhesion.",
                "Shake can vigorously for at least 2 minutes after the agitator ball is heard.",
                "Hold upright 20–25 cm from the surface and spray in light, overlapping passes.",
                "Apply 2 uniform coats allowing 10–15 minutes flash-off between coats.",
                "Invert can and spray for 2 seconds after use to clear the actuator valve.",
              ],
              packing: "Standard packing: 300 gms aerosol spray cans (Cartons of 12 / 24 cans)",
              storage:
                "Store in a cool, dry, well-ventilated area below 50 °C away from direct sunlight, ignition sources, and open flames.",
              shelfLife: "24 months from date of manufacture",
              note: "Krini Crude Lubricants - Vibrant Aerosol Series.",
            },
          },
        ],
        tbc: [],
      },
      {
        id: "lock-bond-adhesive-spray",
        name: "Lock Bond Adhesive Spray",
        variants: ["400 ml"],
        about: "A multi-purpose industrial adhesive in an aerosol, for bonding in production and maintenance.",
        range: [
          {
            name: "Lock-Bond Adhesive Spray 400ml",
            text: "Multi-purpose adhesive spray, lasts longer, non-toxic, ozone friendly, CFC and lead free.",
            details: {
              status: "verified",
              pdsRevision: "400 ML",
              image: "/images/lock-bond-adhesive-spray-400ml.webp",
              imageAlt: "Lock-Bond Multi Purpose Adhesive Aerosol Spray 400ml can",
              sheetUrl: "/documents/lock-bond-adhesive-spray-400ml-pds.pdf",
              sheetLabel: "Lock-Bond Adhesive Spray Product Data Sheet",
              description:
                "LOCK-BOND ADHESIVE SPRAY is a premium multi-purpose industrial aerosol adhesive formulated for fast tack, high bonding strength, and long-lasting durability across a wide spectrum of materials. It is non-toxic, ozone-friendly, CFC and lead-free, ensuring safe handling in manufacturing, workshop assembly, and industrial maintenance.",
              metaLine:
                "Multi-purpose · Fast tack · High bonding strength · Lasts longer · Non-toxic · Ozone friendly & CFC-free · 400 ml aerosol",
              purposeTitle: "Key Features & Suitable Materials",
              purpose: [
                "Multi Purpose Adhesive Spray: Bonds paper, cardboard, fabric, foam, plastics, leather, foil, wood & metals",
                "Lasts Longer: Formulated for enduring bond durability under industrial conditions",
                "Non-Toxic: Safe formulation for workplace and operator handling",
                "Ozone Friendly: 100% CFC and lead free propellant system",
                "Fast Tack & Rapid Bonding: High initial adhesion reducing clamping and setup times",
                "Uniform Fine Mist: Provides smooth, even coverage without clogging or overspray puddling",
              ],
              benefits: [
                "Instant tack with strong, permanent or repositionable adhesion",
                "Clean spray pattern prevents bleed-through and wrinkling",
                "Non-toxic and eco-conscious formulation with zero CFCs or lead",
                "Long shelf life and dependable spray valve performance",
                "Ideal for automotive interiors, upholstery, packaging, and sign-making",
              ],
              properties: [
                { property: "Product Type", value: "Aerosol Spray Adhesive" },
                { property: "Net Volume", value: "400 ml" },
                { property: "Tack Type", value: "Fast tack / High initial grab" },
                { property: "Toxicity", value: "Non-Toxic" },
                { property: "Environmental Safety", value: "Ozone Friendly (CFC & Lead Free)" },
                { property: "Propellant", value: "Eco-friendly hydrocarbon aerosol" },
                { property: "Manufactured By", value: "Krini Crude, Chennai, Tamil Nadu, India" },
              ],
              application: [
                "Shake the can vigorously for 15–30 seconds before spraying.",
                "Ensure surfaces to be bonded are clean, dry, and free from oil, grease, or dust.",
                "Hold the can upright approximately 20–25 cm (8–10 inches) from the target surface.",
                "Depress the actuator nozzle firmly and apply an even, overlapping coat.",
                "Allow solvent to flash off for 30–60 seconds until tacky, then join surfaces with uniform pressure.",
                "After use, invert the can and spray for 2 seconds to clear the nozzle and prevent clogging.",
              ],
              packing: "Standard packing: 400 ml aerosol spray cans (Cartons of 12 / 24 cans)",
              storage:
                "Store in a cool, well-ventilated dry area below 50 °C (122 °F). Keep away from open flames, heat sources, and direct sunlight. Pressurized container: do not pierce or incinerate.",
              shelfLife: "24 months from date of manufacture when stored properly",
              note: "Manufactured by Krini Crude, Thiruverkadu Road, Chennai, Tamil Nadu, India - 600077.",
            },
          },
        ],
        tbc: [],
      },
      {
        id: "anti-spatter-spray",
        name: "Anti-Spatter Spray",
        about:
          "Sprayed on the work and on fixtures and nozzles before welding, anti-spatter leaves a thin film so weld spatter does not stick, which saves grinding and clean-up.",
        range: [
          {
            name: "Relese Anti-Spatter Spray",
            text: "Silicone-free anti-spatter spray engineered to prevent spatter adhesion on metal surfaces and welding torch nozzles.",
            details: {
              status: "verified",
              pdsRevision: "550 ML",
              image: "/images/relese-anti-spatter-spray.webp",
              imageAlt: "Relese Anti Spatter Spray 550ml silicone-free aerosol can",
              sheetUrl: "/documents/relese-anti-spatter-spray-pds.pdf",
              sheetLabel: "Relese Anti Spatter Spray Product Data Sheet",
              description:
                "RELESE ANTI-SPATTER SPRAY is a premium industrial aerosol welding anti-spatter agent. Specially formulated without silicone, it forms a thin, protective barrier on workpieces, welding nozzles, contact tips, and jigs to prevent welding spatter from adhering. It eliminates laborious post-weld chiselling and grinding, and allows direct subsequent painting, powder coating, or galvanizing without fish-eye defects.",
              metaLine:
                "Silicone-free · Anti-spatter effect · Lasts longer · Paintable & plateable · Torch & nozzle protection · 550 ml aerosol",
              purposeTitle: "Key Features & Welding Applications",
              purpose: [
                "Anti-Spatter Effect: Prevents hot metal droplets and welding spatter from adhering to steelwork",
                "Silicone-Free Formulation: Allows direct subsequent painting, galvanizing, or plating without adhesion issues",
                "Lasts Longer: Enduring heat-resistant film provides lasting protection through extended welding cycles",
                "Protects Torch & Nozzles: Extends the working life of MIG/MAG contact tips, gas shrouds, and diffusers",
                "Saves Post-Weld Labor: Eliminates costly manual grinding, chipping, and mechanical surface cleaning",
                "MIG / MAG & Robotic Welding: Suitable for manual fabrication shops, structural steel, and automated robotic welding cells",
              ],
              benefits: [
                "Non-flammable carrier formulation with uniform spray mist",
                "100% silicone-free for flawless post-weld surface treatment and painting",
                "Prolongs the service life of expensive welding torch consumables",
                "Economical 550 ml can size for maximum coverage per aerosol unit",
                "Ozone friendly with safe, modern propellants",
              ],
              properties: [
                { property: "Product Type", value: "Industrial Welding Anti-Spatter Aerosol" },
                { property: "Net Volume", value: "550 ml" },
                { property: "Silicone Content", value: "100% Silicone-Free" },
                { property: "Film Characteristic", value: "Non-greasy, heat-resistant barrier film" },
                { property: "Post-Weld Finish", value: "Paintable, Powder-Coatable, Galvanizable" },
                { property: "Welding Types", value: "MIG / MAG, Robotic, Spot & Arc Welding" },
                { property: "Propellant", value: "Eco-friendly propellant" },
              ],
              application: [
                "Shake can well before use.",
                "Spray a light, uniform coat on areas adjacent to the weld seam before beginning welding.",
                "Spray inside the torch shroud / gas nozzle to prevent spatter buildup.",
                "Proceed with welding as normal.",
                "Wipe away residual spatter and film with a dry cloth or mild degreaser after welding.",
                "Invert can and spray for 2 seconds after use to clear the actuator valve.",
              ],
              packing: "Standard packing: 550 ml aerosol spray cans (Cartons of 12 / 24 cans)",
              storage: "Store in a cool, dry area below 50 °C away from open flames and direct heat.",
              shelfLife: "24 months from date of manufacture",
              note: "Krini Crude Relese Series Welding Consumables.",
            },
          },
        ],
        tbc: [],
      },
      {
        id: "release-spray",
        name: "Release Spray",
        about: "A release agent in aerosol form, for quick, even application on moulds and surfaces.",
        tbc: [placeholder("Applications and technical data")],
      },
    ],
    industries: ["paint"],
    faq: [
      {
        q: "Can you match a spray paint to our powder coating colour?",
        a: "Yes. Our colour sprays can be matched to a powder coating or to any RAL shade.",
      },
      {
        q: "Is your anti-spatter spray silicone-free?",
        a: "Yes. Our anti-spatter spray is silicone-free, which matters when welded parts are going to be painted or powder coated.",
      },
      {
        q: "What sizes does Lock Bond adhesive spray come in?",
        a: "Lock Bond Adhesive Spray comes in a 400 ml can.",
      },
    ],
  },
];

export const lineById = (id: Line["id"]) => lines.find((l) => l.id === id)!;
export const lineBySlug = (slug: string) => lines.find((l) => l.slug === slug);
