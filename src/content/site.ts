/**
 * Single source of truth for the copy on every page.
 *
 * Facts about Krini Crude are taken from the live https://www.krinicrude.com/
 * site (home, about, lubricants, construction, aerosols and contact pages,
 * read September 2026). Anything the live site does not state is wrapped in
 * `placeholder()` so it renders as a clearly marked "to be confirmed" chip
 * instead of an invented claim. Product lines and products: catalogue.ts.
 * Blog articles: articles.ts. The whole site's copy, page by page, is also
 * written out in docs/CONTENT.md.
 */
import { lines } from "./catalogue";
import { placeholder } from "./placeholder";

export { placeholder, isPlaceholder } from "./placeholder";
export type { Placeholder } from "./placeholder";

/** Every page on the site. The preview build maps these to .html files. */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  products: "/products",
  blog: "/blog",
  contact: "/contact",
  process: "/how-its-made",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  /** The product lines have no pages of their own: a line's links go to all products on the Products page. */
  line: (slug: string) => `/products#all-products`,
  article: (slug: string) => `/blog/${slug}`,
} as const;

/**
 * Where an enquiry button leads: the Contact page (quick buttons, the form and
 * Visit us), with the form's type chosen and, from a product, the product
 * named in the message (src/motion/interactions.ts, initEnquiry).
 */
export const enquireHref = (type = "Enquiry", product?: string) =>
  `${routes.contact}?type=${encodeURIComponent(type)}${product ? `&product=${encodeURIComponent(product)}` : ""}`;

export type PageId = "home" | "about" | "services" | "products" | "blog" | "contact";

export const site = {
  name: "Krini Crude",
  url: "https://www.krinicrude.com",
  tagline: "Quality Industrial Solutions",
  seo: {
    title: "Lubricant & Construction Chemical Manufacturer, Chennai | Krini Crude",
    description:
      "ISO 9001:2015 certified lubricant manufacturer in Chennai: 1-COOL cutting oils, hydraulic, gear & engine oils, greases, shuttering oil, aerosol sprays and private label.",
  },
  /**
   * The top menu, as on krinicrude.com: Home, About Us, the three product
   * menus and Enquire now. Each product menu lists products (anchors on the
   * line's page); some products open a side list of their range, named as
   * in the live site's menu. `product` overrides where a side-list item
   * goes (the live menu lists the anti-spatter spray under the colour sprays).
   */
  menu: {
    pages: [
      { id: "home", label: "Home", href: routes.home },
      { id: "about", label: "About Us", href: routes.about },
      { id: "products", label: "Products", href: routes.products },
      { id: "blog", label: "Blog", href: routes.blog },
    ] as { id: PageId; label: string; href: string }[],
    lines: [
      {
        line: "lubricants",
        label: "Lubricants",
        items: [
          { product: "cutting-oil", label: "Cutting Oil" },
          { product: "soluble-cutting-oil", label: "Soluble Cutting Oil" },
          { product: "rust-preventive-oil", label: "Rust Preventive Oil" },
          { product: "hydraulic-oil", label: "Hydraulic Oil" },
          { product: "gear-oil", label: "Gear Oil" },
          { product: "engine-oil", label: "Engine Oil" },
        ],
      },
      {
        line: "construction",
        label: "Construction",
        items: [
          { product: "shuttering-oil", label: "Shuttering Oil", sub: [{ label: "Repel" }, { label: "Silease 360" }, { label: "Magic Oil" }, { label: "Nikri 30" }, { label: "Nikri AL" }] },
          { product: "shuttering-grease", label: "Shuttering Grease", sub: [{ label: "Krini Shuttering Grease" }, { label: "Repel Shuttering Grease" }] },
        ],
      },
      {
        line: "aerosols",
        label: "Aerosols",
        items: [
          {
            product: "colour-sprays",
            label: "Vibrant Colour Sprays",
            sub: [
              { label: "Black (Glossy/Matt)" },
              { label: "Any RAL Shades" },
              { label: "Galva Zinc Spray" },
              { label: "Relese Anti-Spatter Spray", product: "anti-spatter-spray" },
            ],
          },
          { product: "lock-bond-adhesive-spray", label: "Lock Bond Adhesive Spray", sub: [{ label: "Lock-Bond Adhesive 400ml" }] },
        ],
      },
    ] as { line: "lubricants" | "construction" | "aerosols"; label: string; items: { product: string; label: string; sub?: { label: string; product?: string }[] }[] }[],
  },

  /**
   * The hero's words (home page, ScrollHero.tsx): the name and the live site's
   * two hero lines (the page's h1 and the line under it), then the promise
   * over the film's last frame.
   */
  film: {
    brand: "Krini Crude",
    /**
     * A small line over the name, inside the h1, so the page's main heading says what Krini Crude
     * is and where, in the words people search with (the name and the tagline alone don't).
     */
    kicker: "Lubricant manufacturer in Chennai",
    /** The hero's headline, beside the name (from the hero brief). */
    tagline: "Built on Precision. Engineered to Last.",
    /** The supporting line under the headline. */
    motto: "Specialists in beam shuttering, concrete casting, and metal deck slab solutions.",
    promise: "Built on Precision. Engineered to Last.",
    /** The hero's two buttons (opening screen on phones, and the last screen). */
    ctas: {
      primary: { label: "Explore Our Solutions", href: "/products" },
      secondary: { label: "Contact Us", href: "/contact" },
    },
    /**
     * The hero film (the client's building-first film, Google Flow), one part per scroll: the finished
     * building, then Magic Shuttering Oil rolled on to the concrete face of a Mivan aluminium panel in
     * the pit, the oiled box poured and stripped clean, a precast mould, and the building rising to its
     * defect-free finish
     * (heroSeq.stops says where each part ends). Product claims are krinicrude.com's own.
     */
    stages: [
      /* each stage's words say exactly what its part of the film shows */
      {
        name: "Oil on the Mivan panels",
        rail: "Oiling",
        product: "Magic Shuttering Oil",
        line: "Magic Shuttering Oil is rolled up and down the aluminium panel: a thin, wet, even film before every pour.",
        link: { label: "Magic Shuttering Oil", href: "/products/construction-chemicals" },
      },
      {
        name: "Pour and clean strip",
        rail: "Pour",
        product: "Magic Shuttering Oil",
        line: "Concrete is poured against the oiled faces, and the panels strip clean: nothing sticks, no stains.",
        link: { label: "Shuttering oils & greases", href: "/products/construction-chemicals" },
      },
      {
        name: "Precast moulds",
        rail: "Precast",
        product: "Silease 360 precast shuttering oil",
        line: "Oil is rolled on to the steel mould with a big roller first; only then is the concrete poured, and the unit lifts out clean.",
        link: { label: "Precast shuttering oil", href: "/products/construction-chemicals" },
      },
      {
        /* a non-breaking hyphen, so the big heading never breaks after "Defect-" */
        name: "Defect\u2011free finish",
        rail: "Finish",
        product: "",
        line: "Floor by floor to the finished building: smooth, even concrete with no blowholes, no stains, no honeycombing.",
      },
    ],
  },
  /**
   * The showroom, right after the hero: the three product lines side by side,
   * each lit on its own plinth. Its heading is the home page's h1.
   */
  hero: {
    kicker: "Our Product Range",
    /** The live site's heading for its product range. The words in [brackets] light up one by one with the three plinths. */
    heading: ["[Complete] [industrial]", "[solutions]"],
    /** Figures as published on the live site. */
    lead: "70+ products for 1000+ clients across India, made at our Chennai factory under our brand or yours.",
    /** Under each plinth: the line's products, named as on the live site. Keyed by product line id. */
    lines: {
      lubricants: "Cutting Oil, Soluble Cutting Oil, Rust Preventive Oil, Hydraulic Oil, Gear Oil, Engine Oil",
      construction: "Shuttering Oil, Precast Shuttering Oil, Shuttering Grease",
      aerosols: "Vibrant Colour Sprays, Lock Bond Adhesive Spray, Anti-Spatter Spray, Release Spray",
    },
  },
  /**
   * Home's hero (ScrollHero.tsx): what Krini Crude does, one part of the
   * film's single take each, in its order. The names are the three the owner
   * chose; the lines under them are the live site's own words.
   */
  work: [
    {
      id: "lubricants",
      name: "Lubricants & oils",
      rail: "Lubricants",
      body: "Cutting oil, soluble cutting oil, rust preventive, hydraulic, gear and engine oils, for automotive, industrial and specialty applications.",
      /** Under the words in the hero: grades as published on krinicrude.com (catalogue.ts). */
      spec: [
        { label: "Hydraulic", values: ["32", "46", "68"], href: "/products/lubricants#hydraulic-oil" },
        { label: "Gear", values: ["90", "140", "220", "320"], href: "/products/lubricants#gear-oil" },
        { label: "Engine", values: ["15W40", "20W40", "5W30"], href: "/products/lubricants#engine-oil" },
      ],
      link: "View lubricants",
      href: "/products/lubricants",
    },
    {
      id: "greases",
      name: "Greases",
      rail: "Greases",
      body: "Greases stay in place where an oil would run off: for bearings, joints and slides.",
      spec: [
        { label: "Greases", values: ["Bearings", "Joints", "Slides"], href: "/products/lubricants#greases" },
        { label: "Shuttering", values: ["Krini", "Repel"], href: "/products/construction-chemicals#shuttering-grease" },
      ],
      link: "View greases",
      href: "/products/lubricants#greases",
    },
    {
      id: "aerosols",
      name: "Aerosols & sprays",
      rail: "Aerosols",
      body: "Colour, zinc, adhesive, anti-spatter and release sprays for industrial maintenance, automotive care and specialty applications.",
      spec: [
        { label: "Colour", values: ["Black", "Any RAL", "Galva zinc"], href: "/products/aerosols#colour-sprays" },
        { label: "Lock Bond", values: ["Adhesive, 400 ml"], href: "/products/aerosols#lock-bond-adhesive-spray" },
        { label: "Anti-spatter", values: ["Silicone-free"], href: "/products/aerosols#anti-spatter-spray" },
      ],
      link: "View aerosols",
      href: "/products/aerosols",
    },
  ],

  /**
   * The company, in its own words: the "Welcome to Krini Crude" text on the
   * live site's home and About pages, word for word.
   */
  about: {
    headline: "Pioneers in lubricants, construction chemicals and aerosols.",
    /** The first paragraph of the welcome (home page, under "Welcome to Krini Crude"). */
    lead: "Krini Crude is one of the leading manufacturers of premium quality industrial products in India. With extensive manufacturing experience, we have developed a distinguished reputation as proud pioneers in lubricants, construction chemicals, and aerosol manufacturing. We are manufacturing a range of standard, speciality and niche market products using own and customer specified formulations. Our markets include industrial, automotive, marine, construction, infrastructure, and more specialist sectors.",
    /** The whole welcome, on the About page. */
    story: [
      "Krini Crude is one of the leading manufacturers of premium quality industrial products in India. With extensive manufacturing experience, we have developed a distinguished reputation as proud pioneers in lubricants, construction chemicals, and aerosol manufacturing. We are manufacturing a range of standard, speciality and niche market products using own and customer specified formulations. Our markets include industrial, automotive, marine, construction, infrastructure, and more specialist sectors.",
      "We are strong in R&D, with our CEO personally overseeing the Research & Development operations. Our team comprises well-trained and technically strong staff and employees who are dedicated to innovation and excellence. We have given our products to corporate clients for rebranding, and with our extensive experience in this field, we can offer tailor-made products and comprehensive after-sales support for our valuable clients.",
      "We also offer private label manufacturing to well recognized brands in the automotive aftermarket, construction industry, MRO, and general industrial categories and independent marketing companies across the globe. At Krini Crude, we are committed to investing substantially in Research & Development, acquiring modern technologies and geographical expansion.",
    ],
    /** The three ways a product is formulated (live site: own formulations, customer formulations, tailor-made). */
    routes: [
      // `short`: the same in a few words, for phones, where the three sit side by side
      { icon: "flask", title: "Our formulations", short: "Developed by our own team", body: "Standard, speciality and niche-market products, made to formulations developed by our own team." },
      { icon: "formula", title: "Your formulation", short: "Specified by you", body: "Products made to formulations specified by our customers." },
      { icon: "label", title: "Tailor-made", short: "For your own brand", body: "Tailor-made formulations for corporate clients, for products they sell under their own brand." },
    ],
    markets: ["Industrial", "Automotive", "Marine", "Construction", "Infrastructure", "Specialist sectors"],
  },

  /** "Industry we serve": the live site's own list and descriptions, word for word. */
  industries: [
    {
      id: "auto-assembly",
      title: "Auto Assembly",
      body: "We make speciality lubricants for companies involved in the manufacture of motor vehicles, including most components, such as engines and bodies, for passenger cars and commercial vehicles.",
      line: "lubricants",
    },
    {
      id: "auto-component",
      title: "Auto Component",
      body: "We make lubricants for companies involved in the manufacture of auto components such as engine parts, drive transmission & steering parts, body and chassis components.",
      line: "lubricants",
    },
    {
      id: "construction",
      title: "Construction Industry",
      body: "Shuttering oils and greases with excellent tribology chemistry. Formulated not just as physical release but also chemically engineered for superior performance and concrete finish.",
      line: "construction",
    },
    {
      id: "paint",
      title: "Powder Coating & Paint Industries",
      body: "Colour matched as per powder coating or any RAL shades. Custom colour solutions tailored to your specific requirements.",
      line: "aerosols",
    },
  ] as { id: string; title: string; body: string; line: "lubricants" | "construction" | "aerosols" }[],

  /** Kept for the showroom, the home page and the enquiry form; the full catalogue is in catalogue.ts. */
  products: lines.map((l) => ({
    id: l.id,
    index: l.index,
    title: l.title,
    short: l.short,
    description: l.description,
    items: l.products.map((p) => p.name),
    image: l.image,
    imageAlt: l.imageAlt,
    href: routes.line(l.slug),
  })),

  /** Services: what Krini Crude does for customers, as stated on the live site. */
  services: {
    lead:
      "Made at our factory in Tiruverkadu, Chennai. Our CEO personally oversees Research & Development, and we keep investing in R&D, modern technology and geographical expansion.",
    items: [
      {
        icon: "factory",
        title: "Manufacturing",
        short: "Lubricants, construction chemicals and aerosols.",
        image: "/images/factory/tanks-43.webp",
        imageAlt: "Grey and yellow storage tanks, a stacker and blue drums at the Krini Crude factory",
        enquire: "Request a quote",
        body: "Standard, speciality and niche-market products across lubricants, construction chemicals and aerosols.",
        more: [
          "Metalworking fluids and industrial oils (the 1-COOL series), greases",
          "Ready-to-use shuttering oils and greases",
          "Aerosol spray paints, anti-spatter, adhesive and release sprays",
        ],
      },
      {
        icon: "flask",
        title: "Research & Development",
        short: "Overseen personally by our CEO.",
        image: "/images/factory/lab-43.webp",
        imageAlt: "The Krini Crude laboratory bench: burettes, flasks, measuring cylinders and a balance",
        enquire: "Custom formulation",
        body: "R&D operations overseen personally by our CEO, with continued investment in modern technology.",
        more: ["A well-trained, technically strong team", "Continued investment in R&D and modern technology"],
      },
      {
        icon: "formula",
        title: "Customised Formulation",
        short: "Our formulations, or yours.",
        image: "/images/factory/lab-bench-43.webp",
        imageAlt: "An oil sample, a balance and a measuring cylinder on the laboratory bench",
        enquire: "Custom formulation",
        body: "Products built on our own formulations or on formulations specified by the customer.",
        more: ["Tailor-made products for corporate clients", "Spray colours matched to any RAL shade or to your powder coating"],
      },
      {
        icon: "label",
        title: "Private Label",
        short: "For brands and marketing companies worldwide.",
        image: "/images/factory/aerosol-fill-43.webp",
        imageAlt: "The aerosol filling machine with Vibrant spray cans on the table",
        enquire: "Private label",
        body: "Manufacturing for recognised brands and independent marketing companies across the globe.",
        more: ["Products for rebranding", "Automotive aftermarket, construction, MRO and general industrial"],
      },
      {
        icon: "shield",
        title: "Quality Control",
        short: "ISO 9001:2015 certified, with after-sales support.",
        image: "/images/factory/lab-qc-43.webp",
        imageAlt: "Quality checks in the laboratory: a titration flask, a sample and measuring cylinders",
        enquire: "Enquiry",
        body: "An ISO 9001:2015 certified company, with after-sales support on every product we supply.",
        more: ["Comprehensive after-sales support"],
        detail: "Certified to ISO 9001:2015, the international standard for quality management.",
      },
    ],
    privateLabel: {
      lead:
        "We manufacture for well-recognised brands in the automotive aftermarket, construction, MRO and general industrial categories, and for independent marketing companies across the globe.",
      /** The generic private-label process: check each step against how Krini Crude works. */
      steps: [
        { title: "Raw materials", body: "Base oils, additives and components selected for the application." },
        { title: "Formulation", body: "Our formulation or yours, specified with our R&D team." },
        { title: "Testing", body: "Batches checked against the agreed specification before release." },
        { title: "Manufacturing", body: "Blended and produced at our factory in Tiruverkadu, Chennai." },
        { title: "Packaging", body: "Filled and packed in your brand’s livery." },
        { title: "Finished product", body: "Delivered ready for market, with after-sales support." },
      ],
      /** Sectors named on the live site for private-label work. */
      sectors: ["Automotive aftermarket", "Construction industry", "MRO", "General industrial"],
    },
    /** How customers work with Krini Crude, from what the live site offers. */
    ways: [
      {
        title: "From our range",
        body: "70+ standard, speciality and niche-market products across lubricants, construction chemicals and aerosols.",
        cta: "View products",
        href: routes.products,
      },
      {
        title: "To your formulation",
        body: "Products made to formulations specified by you, or tailor-made with our R&D team.",
        cta: "Discuss a formulation",
        href: enquireHref("Custom formulation"),
      },
      {
        title: "Under your brand",
        body: "Private label manufacturing and products for rebranding, with after-sales support.",
        cta: "Discuss private label",
        href: enquireHref("Private label"),
      },
    ],
  },

  /** The live site's figures, word for word. */
  stats: [
    { value: 70, suffix: "+", label: "Product Range" },
    { text: "All Major States in India", label: "Coverage" },
    { value: 1000, suffix: "+", label: "Happy Clients" },
    { text: "ISO 9001:2015 Certified Company", label: "Certification" },
  ],

  /** What customers can count on: each point is a fact from the live site. */
  principles: [
    { title: "Own and customer formulations", body: "Standard, speciality and niche-market products, made to our formulations or to yours." },
    { title: "R&D led by our CEO", body: "Research & Development overseen personally by our CEO, with a technically strong team." },
    { title: "ISO 9001:2015 certified", body: "An ISO 9001:2015 certified company: quality managed to the international standard.", detail: "Certified to ISO 9001:2015, the international standard for quality management." },
    { title: "Your brand", body: "Private label manufacturing and products for rebranding, for brands across the globe." },
    { title: "After-sales support", body: "Comprehensive after-sales support for every client." },
    { title: "Across India", body: "Supplying all major states in India, with 1000+ happy clients." },
  ] as { title: string; body: string; detail?: ReturnType<typeof placeholder> }[],

  /**
   * The enquiry form, word for word as on krinicrude.com ("Enquire Now"): a
   * pop-up from every "Enquire now" button, and the form on the Contact page.
   */
  enquiry: {
    heading: "Enquire Now",
    lead: "Fill in your details and we’ll get back to you shortly",
    name: { label: "Name", placeholder: "Your full name" },
    phone: { label: "Contact Number", placeholder: "10-digit mobile number" },
    message: { label: "Message / Product Enquiry", placeholder: "Tell us about your requirements…" },
    submit: "Submit Enquiry",
    /** Beside the button: the same enquiry, written out in WhatsApp. */
    whatsapp: "Send on WhatsApp",
    close: "Close",
    /** What the form says back (interactions.ts). */
    status: {
      missing: { name: "Please enter your name.", phone: "Please enter a 10-digit mobile number.", message: "Please tell us about your requirements." },
      sending: "Sending…",
      sent: "Thank you. We’ll get back to you shortly.",
      offline: "Online enquiries aren’t connected yet. Please send it on WhatsApp, email info@krinicrude.com or call +91 80153 43987.",
      failed: "Your enquiry could not be sent. Please send it on WhatsApp, email info@krinicrude.com or call +91 80153 43987.",
      whatsapp: "WhatsApp opened with your enquiry. Send it there to reach the team.",
    },
  },

  /** The band that closes most pages. Pages can change its heading, text and enquiry type. */
  cta: {
    label: "Enquiries",
    heading: "Let’s build performance.",
    body: "Tell us the products, quantities and application, or the product you want made under your brand.",
  },

  /** The footer (every page but Contact), kept to the minimum: the name and tagline, these three links, the phone and the email. */
  footer: {
    links: [
      { label: "About Us", href: routes.about },
      { label: "Our Products", href: routes.products },
    ],
  },

  /** Blog listing copy; the articles themselves are in articles.ts. */
  blog: {
    lead: "Practical guides from the Krini Crude team on choosing, using and looking after lubricants, construction chemicals and aerosols.",
  },

  contact: {
    headline: "Let’s build performance.",
    phone: "+91 8015343987",
    phoneHref: "tel:+918015343987",
    whatsapp: "https://wa.me/918015343987?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products.",
    email: "info@krinicrude.com",
    /** The two addresses, line by line as on the live site's Contact page. */
    office: ["95/20B, Gujji Main Road,", "Anna Nagar East,", "Chennai - 600102,", "Tamil Nadu, India"],
    factory: ["Ground Floor, 161A, Krini Crude,", "Chinakoladi Lakshmi Nagar,", "Tiruverkadu, Chennai,", "Tiruvallur - 600077,", "Tamil Nadu, India"],
    /** Google Maps searches for the two addresses. */
    officeMap: "https://www.google.com/maps/search/?api=1&query=95%2F20B%20Gujji%20Main%20Road%2C%20Anna%20Nagar%20East%2C%20Chennai%20600102",
    factoryMap: "https://www.google.com/maps/search/?api=1&query=161A%20Chinakoladi%20Lakshmi%20Nagar%2C%20Tiruverkadu%2C%20Chennai%20600077",
    hours: "9:00 AM – 6:00 PM",
    enquiryTypes: ["Enquiry", "Request a quote", "Private label", "Custom formulation"],
  },

  /** Per-page copy: page headers, section headings, FAQs and search titles. */
  pages: {
    home: {
      seo: {
        title: "Lubricant & Construction Chemical Manufacturer, Chennai | Krini Crude",
        description:
          "ISO 9001:2015 certified lubricant manufacturer in Chennai: 1-COOL cutting oils, hydraulic, gear & engine oils, greases, shuttering oil, aerosol sprays and private label.",
      },
      /** The live site's "Expertise" section: the welcome, then R&D and private label (the story's 2nd and 3rd paragraphs). */
      about: {
        label: "Expertise",
        heading: ["Welcome to", "Krini Crude"],
        parts: ["Research & Development", "Private label manufacturing"],
      },
      industries: {
        label: "Industry we serve",
        heading: "Delivering end to end lubricant solutions",
      },
      services: { label: "Services", heading: ["From formulation", "to finished product."] },
      privateLabel: {
        label: "Private label",
        heading: "Your brand. Our formulation floor.",
        body: "We manufacture for recognised brands and independent marketing companies across the globe, from formulation to a packed product in your livery.",
        cta: "How private label works",
      },
      blog: { label: "From the blog", heading: "Guides for the shop floor and the site.", cta: "All articles" },
      /**
       * Right after the hero: the three things its film shows, each with a still from its moment
       * in the film and the range in full. Products, grades and series as published on
       * krinicrude.com (catalogue.ts); the line under each name is the live site's own.
       */
      range: {
        label: "What we make",
        heading: ["Lubricants, greases", "and aerosols."],
        /** What the range is and where it is made, product by product (each named as in catalogue.ts). */
        lead: "Made at our factory in Tiruverkadu, Chennai: 1-COOL cutting oils and coolants, rust preventives, hydraulic, gear and engine oils; greases for bearings and formwork; and aerosol sprays for painting, welding and maintenance.",
        credit: "",
        families: [
          {
            id: "lubricants",
            name: "Lubricants & oils",
            series: "1-COOL Metal Working Fluid Series",
            line: "Premium quality lubricants and greases for automotive, industrial, and specialty applications.",
            image: "/images/range-oil.webp",
            alt: "1-COOL metalworking fluids and industrial lubricants",
            rows: [
              { label: "Cutting oil", values: ["Neat", "Broaching", "Gear hobbing", "Stamping", "Drawing"], href: "/products/lubricants#cutting-oil" },
              { label: "Coolants", values: ["Aquacut 150", "AL 5000", "AL 7000"], href: "/products/lubricants#soluble-cutting-oil" },
              { label: "Rust preventive", values: ["Dewatering", "Oil based"], href: "/products/lubricants#rust-preventive-oil" },
              { label: "Hydraulic", values: ["32", "46", "68"], href: "/products/lubricants#hydraulic-oil" },
              { label: "Gear", values: ["90", "140", "220", "320"], href: "/products/lubricants#gear-oil" },
              { label: "Engine", values: ["15W40", "20W40", "5W30"], href: "/products/lubricants#engine-oil" },
            ],
            link: "View lubricants",
            href: "/products/lubricants",
          },
          {
            id: "greases",
            name: "Greases",
            series: "Greases and release greases",
            line: "Greases stay in place where an oil would run off: for bearings, joints and slides.",
            image: "/images/range-grease.webp",
            alt: "High-performance industrial and formwork greases",
            rows: [
              { label: "Greases", values: ["Bearings", "Joints", "Slides"], href: "/products/lubricants#greases" },
              { label: "Shuttering grease", values: ["Krini", "Repel"], href: "/products/construction-chemicals#shuttering-grease" },
            ],
            link: "View greases",
            href: "/products/lubricants#greases",
          },
          {
            id: "aerosols",
            name: "Aerosols & sprays",
            series: "Aerosol Sprays",
            line: "Advanced aerosol products for industrial maintenance, automotive care, and specialty applications.",
            image: "/images/range-spray.webp",
            alt: "Industrial aerosol sprays for maintenance and manufacturing",
            rows: [
              { label: "Colour sprays", values: ["Black, glossy / matt", "Any RAL shade"], href: "/products/aerosols#colour-sprays" },
              { label: "Galva zinc", values: ["Zinc coating spray"], href: "/products/aerosols#colour-sprays" },
              { label: "Lock Bond", values: ["Adhesive, 400 ml"], href: "/products/aerosols#lock-bond-adhesive-spray" },
              { label: "Anti-spatter", values: ["Silicone-free"], href: "/products/aerosols#anti-spatter-spray" },
              { label: "Release spray", values: ["Moulds and surfaces"], href: "/products/aerosols#release-spray" },
            ],
            link: "View aerosols",
            href: "/products/aerosols",
          },
        ],
      },
      /**
       * Before the closing band: what buyers ask first, answered from the facts on the site (live
       * site, catalogue.ts), each pointing on to the page that says more. They go into the page's
       * structured data as an FAQPage. Worded for the home page; the other pages ask their own.
       */
      faq: {
        label: "Questions",
        heading: "Questions buyers ask.",
        lead: "What we make, where we make it and how to buy it, in brief.",
        items: [
          {
            q: "Is Krini Crude a manufacturer?",
            a: "Yes. Krini Crude is an ISO 9001:2015 certified manufacturer of lubricants, greases, construction chemicals and aerosol sprays: more than 70 products, made at our factory in Tiruverkadu, Chennai, to our own formulations or to yours.",
            link: { label: "About Krini Crude", href: routes.about },
          },
          {
            q: "Where are your office and factory?",
            a: "Our office is at 95/20B, Gujji Main Road, Anna Nagar East, Chennai 600102, and our factory at 161A, Chinakoladi Lakshmi Nagar, Tiruverkadu, Chennai 600077, Tamil Nadu. We supply all major states in India.",
            link: { label: "Contact and directions", href: routes.contact },
          },
          {
            q: "Which lubricants and oils do you make?",
            a: "Our 1-COOL metalworking fluid series: cutting oils (neat, broaching, gear hobbing, stamping and drawing oils), soluble cutting oils (Aquacut 150, AL 5000 and AL 7000 coolants), dewatering and oil-based rust preventive oils, hydraulic oil in grades 32, 46 and 68, gear oil in 90, 140, 220 and 320, and engine oil in 15W40, 20W40 and 5W30.",
            link: { label: "View lubricants", href: routes.line("lubricants") },
          },
          {
            q: "Do you make shuttering oil and shuttering grease?",
            a: "Yes. Shuttering oils (Repel, Silease 360 for precast, Magic Oil, Nikri 30 and Nikri AL) and shuttering greases (Krini and Repel), all ready to use with no dilution. They stop concrete sticking, so formwork strips cleanly and can be used again.",
            link: { label: "View construction chemicals", href: routes.line("construction-chemicals") },
          },
          {
            q: "Which aerosol sprays do you make?",
            a: "Colour spray paints in black (glossy or matt) or any RAL shade, which we can match to your powder coating; Galva zinc spray; a silicone-free anti-spatter spray for welding; Lock Bond adhesive spray in 400 ml cans; and release sprays.",
            link: { label: "View aerosols", href: routes.line("aerosols") },
          },
          {
            q: "Can you make products under our brand?",
            a: "Yes. We offer private label manufacturing, to our formulations or yours, for brands in the automotive aftermarket, construction, MRO and general industrial categories, and for marketing companies across the globe.",
            link: { label: "How private label works", href: `${routes.services}#private-label` },
          },
          {
            q: "Which brands does Krini Crude make?",
            a: "Three brands, all made at our factory in Chennai: 1-COOL for metalworking fluids and industrial lubricants, Lubecon for concrete release oils and shuttering greases, and Vibrant for aerosol spray paints and industrial sprays.",
            link: { label: "View all products", href: routes.products },
          },
          {
            q: "How do I get a price from Krini Crude?",
            a: "Add the products you need to the cart on our Products page and send the list on WhatsApp, or call +91 80153 43987 or email info@krinicrude.com. We reply with the price, stock and delivery time. There is no online payment.",
            link: { label: "Browse products", href: routes.products },
          },
          {
            q: "Does Krini Crude supply across India?",
            a: "Yes. From our ISO 9001:2015 certified factory in Tiruverkadu, Chennai, Krini Crude supplies lubricants, construction chemicals and aerosols to customers in all major states in India, with more than 1000 happy clients and after-sales support on every product.",
            link: { label: "Contact our team", href: routes.contact },
          },
          {
            q: "Which industries do you supply?",
            a: "Auto assembly and auto component makers, construction, and the powder coating and paint industries, as well as industrial, automotive, marine and infrastructure customers: more than 1000 clients across India.",
          },
        ],
      },
    },
    about: {
      seo: {
        title: "About Krini Crude | Industrial Lubricants Manufacturer, Chennai",
        description:
          "One of India’s leading makers of lubricants, construction chemicals and aerosols. ISO 9001:2015 certified, with R&D overseen by our CEO, in Chennai.",
      },
      /** The live site's About page header: "About Krini Crude / Quality Industrial Solutions". */
      label: "About Us",
      heading: "About Krini Crude",
      /** Under the header: facts as published on the live site. */
      facts: [
        { value: "Chennai", label: "Office & factory" },
        { value: "ISO", label: "9001:2015 certified" },
        { value: "70+", label: "Products" },
        { value: "1000+", label: "Happy clients" },
      ],
      lead: "Quality Industrial Solutions",
      /** Around the badge beside the header picture: the live site's own line. */
      seal: "Innovation & excellence in manufacturing",
      /** The live site's About page: "Expertise / Welcome to Krini Crude", then the three paragraphs (site.about.story). */
      story: {
        label: "Expertise",
        heading: "Welcome to Krini Crude",
        /** The live site's words. */
        quote: "A distinguished reputation as proud pioneers in lubricants, construction chemicals and aerosol manufacturing.",
      },
      /**
       * Service first, in plain English: Krini Crude works to each customer's need (tailor-made
       * products, private label, after-sales support), so the vision and mission say that simply.
       */
      vision: {
        label: "Vision & mission",
        visionLabel: "Our vision",
        vision: "Your need comes first: the right product, made for your work.",
        missionLabel: "Our mission",
        mission: [
          { title: "Listen first", body: "We learn what your site, machine or product really needs." },
          { title: "Make it to fit", body: "We make or adjust the product to match that need." },
          { title: "Deliver on time", body: "The right quantity and pack, when you need it." },
          { title: "Stay with you", body: "Help after delivery, and quick answers when anything changes." },
        ],
      },
      rd: { label: "Research & development", desk: "From the CEO’s desk", heading: "Formulation is where the work starts." },
      values: {
        label: "What you can count on",
        heading: "Six things every client gets.",
        lead: "What stays the same on every order, whichever of our 70+ products it is and whoever’s name is on the label.",
      },
      figures: { label: "In figures", heading: "The numbers behind the name." },
      process: {
        label: "How we work",
        heading: "From enquiry to after-sales.",
        steps: [
          { title: "Enquiry", body: "Tell us the application, the products and the quantities, or the product you want under your brand." },
          { title: "Formulation", body: "Our formulation or yours, with our R&D team, overseen by our CEO." },
          { title: "Manufacturing", body: "Made at our factory in Tiruverkadu, Chennai." },
          { title: "Supply", body: "Under our brand or yours, to all major states in India." },
          { title: "After-sales", body: "Comprehensive after-sales support for every client." },
        ],
      },
      places: { label: "Where we are", heading: "An office in Anna Nagar, a factory in Tiruverkadu." },
      leadership: {
        role: "CEO",
        /** A fact from the live site; the name, message and photograph are to be supplied. */
        note: "Our CEO personally oversees Research & Development, with a well-trained, technically strong team dedicated to innovation and excellence.",
        name: "Gokul Raj",
        message: placeholder("CEO’s message, 60 to 100 words"),
        photo: "/images/director.webp",
      },
      faq: [
        {
          q: "What does Krini Crude manufacture?",
          a: "Lubricants and greases (including the 1-COOL metalworking fluid series), construction chemicals (shuttering oils and greases) and aerosol products (spray paints, anti-spatter, adhesive and release sprays): 70+ products in all.",
        },
        {
          q: "Where is Krini Crude based?",
          a: "Our office is at 95/20B, Gujji Main Road, Anna Nagar East, Chennai 600102, and our factory is in Chinakoladi Lakshmi Nagar, Tiruverkadu, Chennai 600077, Tamil Nadu.",
        },
        { q: "Is Krini Crude ISO 9001:2015 certified?", a: "Yes, Krini Crude is an ISO 9001:2015 certified company." },
        { q: "Which markets do you supply?", a: "Industrial, automotive, marine, construction, infrastructure and more specialist sectors, across all major states in India." },
        {
          q: "Can you make products to our formulation or under our brand?",
          a: "Yes. We manufacture to our own formulations and to formulations specified by customers, and we offer private label manufacturing and products for rebranding.",
        },
      ],
    },
    services: {
      seo: {
        title: "Private Label & Custom Formulation Manufacturing | Krini Crude",
        description:
          "Manufacturing, R&D, custom formulations and private label lubricants, construction chemicals and aerosols for brands in India and across the globe.",
      },
      label: "Services",
      heading: "Manufacturing, formulation and private label, under one roof.",
      facts: [
        { value: "05", label: "Services" },
        { value: "03", label: "Ways to work with us" },
        { value: "R&D", label: "Overseen by our CEO" },
        { value: "ISO", label: "9001:2015 certified" },
      ],
      what: { label: "What we do", heading: "Five services, one factory." },
      privateLabel: { label: "Private label & customised manufacturing", heading: ["Your brand.", "Our formulation floor."] },
      cta: {
        heading: "Planning a product under your brand?",
        body: "Tell us about the product, the market it is for, pack sizes and volumes, and whether you have a formulation.",
      },
      lead:
        "From your brief to a finished, packed product: we manufacture our own range, make products to your formulation and produce for brands to sell under their own name.",
      ways: { label: "Ways to work with us", heading: "Three ways to work with Krini Crude." },
      faq: [
        {
          q: "Do you offer private label manufacturing?",
          a: "Yes. We manufacture for well-recognised brands in the automotive aftermarket, construction, MRO and general industrial categories, and for independent marketing companies across the globe.",
        },
        {
          q: "Can you manufacture to our own formulation?",
          a: "Yes. We make products to our own formulations and to formulations specified by our customers, and our R&D team can develop tailor-made products.",
        },
        { q: "Who oversees your R&D?", a: "Our CEO personally oversees our Research & Development operations." },
        { q: "Can you match a spray colour to our powder coating?", a: "Yes. Our colour sprays can be matched to a powder coating or to any RAL shade." },
        { q: "Do you provide after-sales support?", a: "Yes, we offer comprehensive after-sales support for every client." },
      ],
    },
    products: {
      seo: {
        title: "Products: Lubricants, Construction Chemicals & Aerosols | Krini Crude",
        description:
          "70+ products made in Chennai: 1-COOL cutting oils and coolants, hydraulic, gear and engine oils, shuttering oils and greases, and aerosol sprays.",
      },
      label: "Products · 70+ products",
      heading: "Industrial lubricants, construction chemicals and aerosol sprays.",
      facts: [
        { value: "03", label: "Product lines" },
        { value: "70+", label: "Products" },
        { value: "1-COOL", label: "Metalworking fluid series" },
        { value: "RAL", label: "Any shade, in our colour sprays" },
      ],
      lines: { label: "Our Product Range", heading: ["Complete industrial", "solutions"] },
      index: {
        label: "Every product at a glance",
        heading: "Find a product by name or grade.",
        note: "Products, variants and grades as listed on krinicrude.com. Ask us for the technical data sheet of any product.",
      },
      guides: { label: "Guides", heading: "Choosing and using our products." },
      cta: {
        heading: "Need a price or a sample?",
        body: "Send us the products, grades, quantities and delivery location, and we will come back with a quote.",
      },
      lead:
        "Standard, speciality and niche-market products in three lines, made at our factory in Chennai to our formulations or to yours, and available under your brand.",
      faq: [
        { q: "How many products do you make?", a: "More than 70, across lubricants and greases, construction chemicals and aerosols." },
        {
          q: "Do you supply outside Tamil Nadu?",
          a: "Yes. We supply all major states in India, and we manufacture private label products for brands and marketing companies across the globe.",
        },
        {
          q: "How do I get a quote?",
          a: "Send us an enquiry with the products, quantities, application and delivery location, or call +91 80153 43987.",
        },
      ],
    },
    blog: {
      seo: {
        title: "Guides to Lubricants, Construction Chemicals & Aerosols | Krini Crude",
        description:
          "Practical guides on cutting oils and coolants, oil grades, shuttering and mold release, anti-spatter sprays, lubricant storage and private label.",
      },
      label: "Blog",
      heading: "Notes from the formulation floor.",
      filter: "Filter by topic",
      cta: {
        heading: "Need a product recommendation?",
        body: "Tell us the machine, the material or the job, and our team will suggest a product.",
      },
    },
    contact: {
      seo: {
        title: "Contact Krini Crude | Enquiries, Quotes & Private Label, Chennai",
        description:
          "Call +91 80153 43987, WhatsApp or email info@krinicrude.com. Office in Anna Nagar East, Chennai; factory in Tiruverkadu. Send an enquiry or request a quote.",
      },
      label: "Contact",
      heading: "Contact Krini Crude.",
      lead: "Tell us the products and quantities you need, or the product you want made under your brand.",
      visit: { label: "Visit us" },
    },
  },
} as const;

export type Site = typeof site;
