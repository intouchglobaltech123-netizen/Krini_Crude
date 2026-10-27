"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** A label and its value (a row of a product page's tables). */
export type ShopRow = { k: string; v: string };

/** One product a buyer can order (built on the server: ProductShop.tsx). */
export type ShopItem = {
  key: string;
  /** The product's name as a file name: its photos are /images/products/<slug>-front.webp and so on. */
  slug: string;
  name: string;
  /** One short line under the name (catalogue.ts range tagline). */
  tagline?: string;
  /** The product itself in a lab beaker, shown beside the pack on the card. */
  beaker?: string;
  /** The card picture is taller than wide (so beside the beaker it is shown whole, not cropped). */
  imageUpright?: boolean;
  /** The product type it belongs to (Soluble Cutting Oil, Shuttering Oil…). */
  type: string;
  /** The kind of product it is, for the drop-down under its line (Shuttering Oil, Hydraulic Oil…). */
  group: string;
  text: string;
  /** Grades or variants to choose from, if any. */
  grades: string[];
  line: string;
  lineTitle: string;
  lineShort: string;
  /** The brand it is sold under (Lubecon, 1-COOL, Vibrant), and its logo where we have one. */
  brand: string;
  brandLogo?: string;
  /** The brand's full logo (with its strapline), for the plate shown where there is no photo yet. */
  brandLogoFull?: string;
  image?: string;
  imageAlt?: string;
  /** Its data sheet (a PDF) and its AI-generated video, where we have them. */
  sheet?: string;
  report?: string;
  reportLabel?: string;
  video?: string;
  /** The pack from the front and the back (a view without a photo yet has no src). */
  views: { label: string; src?: string }[];
  /** The product page's sections: every product has all of them. */
  about: string;
  highlights: string[];
  applications: string[];
  applicationsTitle: string;
  general: ShopRow[];
  properties: { property: string; value: string; spec?: string }[];
  dilution?: string;
  dilutionNote?: string;
  dilutionRatios?: { operation: string; ratio: string }[];
  /** Dilution in words, where there is no table of ratios. */
  dilutionText?: string;
  coverageNote?: string;
  howTo?: string[];
  howToTitle?: string;
  packing: ShopRow[];
  note?: string;
  /** Real customer reviews (catalogue.ts), newest first; empty until some come in. */
  reviews: ShopReview[];
};
export type ShopReview = { name: string; rating: number; text: string; place?: string; date?: string };
export type ShopLine = { id: string; title: string; brand?: string; logo?: string; logoFull?: string };
type CartLine = { id: string; key: string; name: string; type: string; line: string; grade: string; qty: number };

const STORE = "kc:cart";
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ");

/**
 * Products as a simple shop (Products page). A search box and the three lines
 * as chips narrow the cards; each card has a photo, what it is, a short line
 * about it, a grade to pick where there are grades, and Add to cart. The cart
 * (remembered on this device) opens from the side: change quantities, add a
 * note, and send the whole list on WhatsApp in one tap. There is
 * no payment online: Krini Crude replies with price, stock and delivery.
 * Every product is in the page's HTML; the search and cart need scripts.
 */
export function ShopClient({ items, lines, whatsapp, top }: { items: ShopItem[]; lines: ShopLine[]; whatsapp: string; email?: string; top?: ReactNode }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  /** A kind of product within the line (from the line's drop-down), or "" for the whole line. */
  const [sub, setSub] = useState("");
  /** The line whose drop-down is open. */
  const [menu, setMenu] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [ready, setReady] = useState(false);
  /** The product whose page is open (its key), or none. */
  const [view, setView] = useState<string | null>(null);
  const [pvQty, setPvQty] = useState(1);
  /** The product's video, open over its page. */
  const [vidOpen, setVidOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const pvBackRef = useRef<HTMLButtonElement>(null);

  // the cart is kept on this device between visits
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      if (Array.isArray(saved.cart)) setCart(saved.cart);
      if (typeof saved.notes === "string") setNotes(saved.notes);
    } catch {
      /* nothing saved, or storage blocked */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ cart, notes }));
    } catch {
      /* storage blocked: the cart lasts for this visit */
    }
  }, [cart, notes, ready]);

  // while the cart or a product page is open, the page behind stays still
  const locked = open || view !== null;
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const scroller = (window as unknown as { __scroller?: { stop?: () => void; start?: () => void } }).__scroller;
    root.classList.add("has-dialog");
    scroller?.stop?.();
    return () => {
      root.classList.remove("has-dialog");
      scroller?.start?.();
    };
  }, [locked]);

  // the cart panel: Esc closes it
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open]);

  // a product page: a link of its own (#p=…), so the back button closes it and it can be shared
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#p=(.+)$/);
      const key = m ? decodeURIComponent(m[1]) : null;
      setView(key && items.some((i) => i.key === key) ? key : null);
    };
    fromHash();
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("popstate", fromHash);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [items]);
  const openProduct = (key: string) => {
    history.pushState({ kcp: key }, "", `#p=${encodeURIComponent(key)}`);
    setView(key);
  };
  const closeProduct = () => {
    setView(null);
    if ((history.state as { kcp?: string } | null)?.kcp) history.back();
    else history.replaceState(history.state, "", location.pathname + location.search);
  };
  // a new product page opens at its top, quantity 1, the back button in focus; Esc goes back
  useEffect(() => {
    if (!view) return;
    setPvQty(1);
    setVidOpen(false);
    const top = () => pvRef.current?.scrollTo({ top: 0 });
    top();
    requestAnimationFrame(top);
    pvBackRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector(".pdrawer.is-open")) return;
      if (document.querySelector(".pv-vid")) setVidOpen(false);
      else closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const shown = useMemo(() => {
    const words = norm(query).split(" ").filter(Boolean);
    return items.filter((it) => {
      if (cat !== "all" && it.line !== cat) return false;
      if (sub && it.group !== sub) return false;
      if (!words.length) return true;
      const hay = norm(`${it.name} ${it.brand} ${it.group} ${it.type} ${it.lineTitle} ${it.text} ${it.grades.join(" ")}`);
      return words.every((w) => hay.includes(w));
    });
  }, [items, query, cat, sub]);

  // a line's drop-down closes on a tap outside it, or Esc
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.(".pshop-catw.is-open")) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const count = cart.reduce((n, l) => n + l.qty, 0);
  const lineId = (it: ShopItem, grade: string) => `${it.key}::${grade}`;
  const inCart = (it: ShopItem) => cart.find((l) => l.id === lineId(it, grades[it.key] ?? "")) || cart.find((l) => l.key === it.key);

  const add = (it: ShopItem) => {
    const grade = grades[it.key] ?? "";
    const id = lineId(it, grade);
    setCart((c) => (c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id, key: it.key, name: it.name, type: it.type, line: it.lineShort, grade, qty: 1 }]));
    setBump((b) => b + 1);
  };
  const addQty = (it: ShopItem, qty: number) => {
    const grade = grades[it.key] ?? "";
    const id = lineId(it, grade);
    setCart((c) => (c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...c, { id, key: it.key, name: it.name, type: it.type, line: it.lineShort, grade, qty }]));
    setBump((b) => b + 1);
  };
  const setQty = (id: string, qty: number) => setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));

  const order = [
    "Hi Krini Crude, I would like to order:",
    ...cart.map((l, i) => `${i + 1}. ${l.name}${l.grade ? ` (${l.grade})` : ""} · ${l.type} · Qty: ${l.qty}`),
    notes.trim() ? `Notes: ${notes.trim()}` : "",
    "Company / name: ",
    "Delivery location: ",
  ]
    .filter(Boolean)
    .join("\n");
  const waHref = `${whatsapp.split("?")[0]}?text=${encodeURIComponent(order)}`;
  const pv = view ? items.find((i) => i.key === view) : undefined;
  // more products under it: the same kind first, then the same line, then the rest
  const similar = pv
    ? [
        ...items.filter((i) => i.key !== pv.key && i.type === pv.type),
        ...items.filter((i) => i.key !== pv.key && i.type !== pv.type && i.line === pv.line),
        ...items.filter((i) => i.line !== pv.line),
      ].slice(0, 6)
    : [];
  const pvGrade = pv ? grades[pv.key] ?? "" : "";
  const pvLine = pv ? inCart(pv) : undefined;
  const pvWa = pv
    ? `${whatsapp.split("?")[0]}?text=${encodeURIComponent(
        [
          "Hi Krini Crude, I would like to order:",
          `1. ${pv.name}${pvGrade ? ` (${pvGrade})` : ""} · ${pv.type} · Qty: ${pvQty}`,
          "Company / name: ",
          "Delivery location: ",
        ].join("\n"),
      )}`
    : "";

  // the brands beside the heading: Lubecon on Construction Chemicals, 1-COOL on Lubricants, both on
  // All products (Aerosols are sold as Vibrant, which has no logo yet)
  const headBrands = lines.filter((l) => (cat === "all" ? l.id === "construction" || l.id === "lubricants" : l.id === cat) && (l.logoFull || l.logo));

  return (
    <section id="all-products" className="pshop" aria-labelledby="page-title">
      <div className="frame">
        {top}
        <div className="pshop-head">
          <div className="pshop-head-main">
            <h1 id="page-title" className="pshop-title">
              Our products
            </h1>
            {headBrands.length ? (
              <div className="pshop-head-logos" key={cat}>
                {headBrands.map((l) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={l.id}
                    className={`pshop-head-logo pshop-head-logo-${l.id}`}
                    src={l.logoFull ?? l.logo}
                    alt={l.brand ?? ""}
                    title={`${l.title}: sold under our ${l.brand} brand`}
                    decoding="async"
                  />
                ))}
              </div>
            ) : null}
          </div>
          <ol className="pshop-steps" aria-label="How ordering works">
            <li>
              <b>1</b> Add to cart
            </li>
            <li>
              <b>2</b> Send the list on WhatsApp
            </li>
            <li>
              <b>3</b> We confirm price and delivery
            </li>
          </ol>
        </div>

        {/* Sticky bar: categories on the left, search bar & cart in remaining space on the right */}
        <div className="pshop-bar">
          <div className="pshop-cats" role="group" aria-label="Product lines">
            {[{ id: "all", title: "All products" }, ...lines].map((l) => {
              const inLine = l.id === "all" ? items : items.filter((i) => i.line === l.id);
              // the kinds of product in this line, in catalogue order (Shuttering Oil, Shuttering Grease…)
              const groups = l.id === "all" ? [] : Array.from(new Set(inLine.map((i) => i.group)));
              const isOpen = menu === l.id && groups.length > 1;
              return (
                <div key={l.id} className={`pshop-catw${isOpen ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="pshop-cat"
                    aria-pressed={cat === l.id}
                    aria-haspopup={groups.length > 1 ? "menu" : undefined}
                    aria-expanded={groups.length > 1 ? isOpen : undefined}
                    onClick={() => {
                      if (l.id === "all") {
                        setCat("all");
                        setSub("");
                        setMenu(null);
                        return;
                      }
                      if (cat !== l.id) {
                        setCat(l.id);
                        setSub("");
                      }
                      setMenu((m) => (m === l.id ? null : l.id));
                    }}
                  >
                    <b className="pshop-cat-t">{l.title}</b>
                    <span>{inLine.length}</span>
                    {groups.length > 1 ? (
                      <svg className="pshop-cat-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    ) : null}
                  </button>
                  {isOpen ? (
                    <div className="pshop-menu" role="menu" aria-label={l.title}>
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={cat === l.id && !sub}
                        onClick={() => {
                          setSub("");
                          setMenu(null);
                        }}
                      >
                        All {l.title.toLowerCase()}
                        <span>{inLine.length}</span>
                      </button>
                      {groups.map((g) => (
                        <button
                          key={g}
                          type="button"
                          role="menuitemradio"
                          aria-checked={cat === l.id && sub === g}
                          onClick={() => {
                            setSub(g);
                            setMenu(null);
                          }}
                        >
                          {g}
                          <span>{inLine.filter((i) => i.group === g).length}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <label className="pshop-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="sr-only">Search products</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: hydraulic oil, 46, shuttering, spray…" autoComplete="off" />
            {query ? (
              <button type="button" className="pshop-clear" onClick={() => setQuery("")} aria-label="Clear search">
                ×
              </button>
            ) : null}
          </label>
        </div>
        <p className="pshop-count" aria-live="polite">
          {shown.length} {shown.length === 1 ? "product" : "products"}
          {sub ? (
            <>
              {" "}
              in <b>{sub}</b>
              <button type="button" className="pshop-subx" onClick={() => setSub("")} aria-label={`Show all ${lines.find((x) => x.id === cat)?.title ?? "products"}`}>
                × Show all
              </button>
            </>
          ) : null}
          {query ? <> for “{query}”</> : null}
        </p>

        {shown.length ? (
          <ul className="pshop-grid">
            {shown.map((it) => {
              const line = inCart(it);
              return (
                <li
                  key={it.key}
                  className="kcard"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("select, button, label, a")) openProduct(it.key);
                  }}
                >
                  <div className={`kcard-media${it.beaker ? " has-beaker" : ""}${it.imageUpright ? " is-upright" : ""}`}>
                    <Photo src={it.image} alt="" brand={it.brand} brandLogo={it.brandLogoFull} name={it.name} />
                    {it.beaker ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="kbeaker" src={it.beaker} alt="" width={480} height={640} loading="lazy" decoding="async" />
                    ) : null}
                    <Brand name={it.brand} logo={it.brandLogo} />
                  </div>
                  <div className="kcard-body">
                    <div className="kcard-meta-top">
                      <span className="kcard-type">{it.type}</span>
                      {it.sheet ? <span className="kcard-pds-tag" title="Technical data sheet available">PDS</span> : null}
                    </div>
                    <h3 className="kcard-name">
                      <button type="button" className="kcard-link" onClick={() => openProduct(it.key)}>
                        {it.name}
                      </button>
                    </h3>
                    {it.tagline ? <p className="kcard-tag">{it.tagline}</p> : null}
                    <div className="kcard-specs">
                      {it.grades.length ? (
                        <span className="kcard-spec-item" title="Multiple grades available (choose inside product page)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m12 6v6l4 2" />
                          </svg>
                          {it.grades.length} Grades available
                        </span>
                      ) : (
                        <span className="kcard-spec-item" title="Certified Manufacturer">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          ISO 9001:2015
                        </span>
                      )}
                      <span className="kcard-spec-item" title="Packaging">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        {it.packing?.[0]?.v?.replace(/^Standard packing:\s*/i, "").replace(/^Pack sizes on request/i, "Pack on request").replace(/\s*\(.*\)\s*$/, "") || "Industrial pack"}
                      </span>
                    </div>
                  </div>
                  <div className="kcard-foot">
                    {line ? (
                      <div className="kcard-step" aria-label={`${it.name} in cart`}>
                        <button type="button" onClick={() => setQty(line.id, line.qty - 1)} aria-label="One less">
                          −
                        </button>
                        <span>
                          <b>{line.qty}</b> in cart{line.grade ? ` (${line.grade})` : ""}
                        </span>
                        <button type="button" onClick={() => setQty(line.id, line.qty + 1)} aria-label="One more">
                          +
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="kcard-add" onClick={() => add(it)}>
                        <CartIcon /> Add to cart
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="pshop-empty">
            <p>
              No products match <b>“{query}”</b>.
            </p>
            <p>Try another word, or tell us what you need.</p>
            <a href={`${whatsapp.split("?")[0]}?text=${encodeURIComponent(`Hi Krini Crude, I am looking for: ${query}`)}`} target="_blank" rel="noopener noreferrer" className="pshop-wa">
              Ask on WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Floating circular cart button in bottom-right corner */}
      <button
        type="button"
        className={`pshop-float${bump ? " is-bump" : ""}`}
        key={`fab-${bump}`}
        onClick={() => setOpen(true)}
        aria-label={`Open cart, ${count} items`}
        title={`Open cart (${count})`}
      >
        <span className="pshop-float-icon">
          <CartIcon />
        </span>
        <b className="pshop-float-badge">{count}</b>
      </button>

      {/* a product's own page, over the shop: like a store's product page */}
      {pv ? (
        <div className="pv" role="dialog" aria-modal="true" aria-labelledby="pv-title" ref={pvRef} data-lenis-prevent>
          <div className="pv-bar">
            <div className="pv-bar-in">
              <button type="button" className="pv-back" onClick={closeProduct} ref={pvBackRef} aria-label="Back to products">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <p className="pv-bar-t">{pv.name}</p>
              <button type="button" className="pv-cartbtn" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
                <CartIcon />
                {count ? <b>{count}</b> : null}
              </button>
            </div>
          </div>

          <div className="pv-wrap">
          <div className="pv-top">
            <div className="pv-media">
              <Gallery key={pv.key} views={pv.views} video={pv.video} name={pv.name} brand={pv.brand} brandLogo={pv.brandLogo} plateLogo={pv.brandLogoFull} alt={pv.imageAlt ?? pv.name} />
            </div>
            <div className="pv-info">
              <p className="pv-crumbs">
                <span>{pv.lineTitle}</span>
                <span aria-hidden="true">›</span>
                <span>{pv.type}</span>
              </p>
              <h2 id="pv-title" className="pv-name">
                {pv.name}
              </h2>
              {pv.tagline ? <p className="pv-tagline">{pv.tagline}</p> : null}
              <p className="pv-by">
                <span>Brand</span>
                {pv.brandLogo ? <Brand name={pv.brand} logo={pv.brandLogo} /> : <b>{pv.brand}</b>}
              </p>
              <p className="pv-text">{pv.text}</p>
              <p className="pv-price">
                <b>Price on request</b>
                <span>Add it to the cart and send the list: we reply with price, stock and delivery.</span>
              </p>
              {pv.grades.length ? (
                <div className="pv-block">
                  <p className="pv-k">Grade</p>
                  <div className="pv-chips" role="group" aria-label="Grade">
                    {["", ...pv.grades].map((g) => (
                      <button key={g || "any"} type="button" className="pv-chip" aria-pressed={pvGrade === g} onClick={() => setGrades((x) => ({ ...x, [pv.key]: g }))}>
                        {g || "Not sure / any"}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="pv-block pv-qtyrow">
                <p className="pv-k">Quantity</p>
                <div className="pv-qty">
                  <button type="button" onClick={() => setPvQty((q) => Math.max(1, q - 1))} aria-label="One less">
                    −
                  </button>
                  <b aria-live="polite">{pvQty}</b>
                  <button type="button" onClick={() => setPvQty((q) => q + 1)} aria-label="One more">
                    +
                  </button>
                </div>
              </div>
              {/* larger screens: the buttons here, beside the photos (phones: the bar at the foot) */}
              <div className="pv-cta">
                {pvLine ? (
                  <button type="button" className="pv-add is-in" onClick={() => setOpen(true)}>
                    <CartIcon /> Go to cart ({pvLine.qty})
                  </button>
                ) : (
                  <button type="button" className="pv-add" onClick={() => addQty(pv, pvQty)}>
                    <CartIcon /> Add to cart
                  </button>
                )}
                <a href={pvWa} className="pv-wa" target="_blank" rel="noopener noreferrer">
                  <WaIcon /> Order on WhatsApp
                </a>
              </div>
              {/* the data sheet and the test report, where we have them (the video is in the photos) */}
              {pv.sheet || pv.report ? (
              <div className={`pv-docs${pv.sheet && pv.report ? "" : " is-solo"}`}>
                {pv.sheet ? (
                  <a href={pv.sheet} className="pv-doc" target="_blank" rel="noopener noreferrer" data-no-fast>
                    <DocIcon />
                    <span>
                      <b>Product data sheet</b>
                      <small>View the PDF</small>
                    </span>
                  </a>
                ) : null}
                {pv.report ? (
                  <a href={pv.report} className="pv-doc" target="_blank" rel="noopener noreferrer" data-no-fast>
                    <DocIcon />
                    <span>
                      <b>Test report</b>
                      <small>View certificate</small>
                    </span>
                  </a>
                ) : null}
              </div>
              ) : null}
              <ul className="pv-assure">
                <li>ISO 9001:2015 certified factory, Chennai</li>
                <li>No payment online</li>
                <li>Reply on WhatsApp</li>
              </ul>
            </div>
          </div>

          <div className="pv-details">
            <section className="pv-sec">
              <h3>
                <SecIcon kind="about" />
                About this product
              </h3>
              <p>{pv.about}</p>
            </section>
            <section className="pv-sec">
              <h3>
                <SecIcon kind="star" />
                Highlights
              </h3>
              <ul className="pv-list">
                {pv.highlights.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
            <section className="pv-sec">
              <h3>
                <SecIcon kind="target" />
                {pv.applicationsTitle}
              </h3>
              {pv.applications.length && pv.applications.some((u) => u.length > 48) ? (
                // long lines ("Anti-Spatter Effect: prevents…"): a list, each with its name in bold
                <ul className="pv-feats">
                  {pv.applications.map((u) => {
                    const m = u.match(/^([^:]{2,40}):\s*(.+)$/);
                    return (
                      <li key={u}>
                        {m ? (
                          <>
                            <b>{m[1]}</b>
                            <span>{m[2]}</span>
                          </>
                        ) : (
                          <span>{u}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : pv.applications.length ? (
                <ul className="pv-tags">
                  {pv.applications.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="pv-ask">Tell us your application and surface: our team confirms whether this product suits it.</p>
              )}
            </section>
            <section className="pv-sec pv-sec-wide">
              <h3>
                <SecIcon kind="specs" />
                Specifications
              </h3>
              <div className="pv-spec-grid">
                <div>
                  <p className="pv-spec-k">General</p>
                  <dl className="pv-specs">
                    {pv.general.map((r) => (
                      <div key={r.k}>
                        <dt>{r.k}</dt>
                        <dd>{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="pv-spec-k">Technical data</p>
                  {pv.properties.length ? (
                    <dl className="pv-specs">
                      {pv.properties.map((r) => (
                        <div key={r.property}>
                          <dt>{r.property}</dt>
                          <dd>
                            {r.value}
                            {r.spec ? <small>{r.spec}</small> : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : pv.sheet ? (
                    <div className="pv-ask pv-ask-box">
                      <DocIcon />
                      <p>View the complete technical specifications and official data sheet for {pv.name}.</p>
                      <a href={pv.sheet} className="pv-ask-btn" target="_blank" rel="noopener noreferrer" data-no-fast>
                        <DocIcon /> View official data sheet (PDF)
                      </a>
                    </div>
                  ) : (
                    <div className="pv-ask pv-ask-box">
                      <p>Technical values for {pv.name} are shared on request: ask us and our team replies the same day.</p>
                      <a
                        href={`${whatsapp.split("?")[0]}?text=${encodeURIComponent(`Hi Krini Crude, please share the technical details of ${pv.name}.`)}`}
                        className="pv-ask-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ask for technical details
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {pv.coverageNote ? <p className="pv-small">{pv.coverageNote}</p> : null}
            </section>
            {/* construction chemicals are ready to use, so they have no dilution section (ProductShop.tsx) */}
            {pv.dilutionText || pv.dilutionRatios?.length ? (
            <section className="pv-sec">
              <h3>
                <SecIcon kind="drop" />
                Dilution guidelines{pv.dilution && pv.dilutionRatios?.length ? `: ${pv.dilution}` : ""}
              </h3>
              {pv.dilutionRatios?.length ? (
                <dl className="pv-specs">
                  {pv.dilutionRatios.map((r) => (
                    <div key={r.operation}>
                      <dt>{r.operation}</dt>
                      <dd>{r.ratio}</dd>
                    </div>
                  ))}
                </dl>
              ) : pv.dilutionText?.startsWith("Shared with") ? (
                // no dilution guidance published yet: the same "ask us" box as the technical data
                <div className="pv-ask pv-ask-box">
                  <p>{pv.dilutionText}</p>
                  <a
                    href={`${whatsapp.split("?")[0]}?text=${encodeURIComponent(`Hi Krini Crude, what is the dilution / mixing guidance for ${pv.name}?`)}`}
                    className="pv-ask-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WaIcon /> Ask about dilution
                  </a>
                </div>
              ) : (
                <p>{pv.dilutionText}</p>
              )}
              {pv.dilutionNote && !pv.dilutionRatios?.length ? <p className="pv-small">{pv.dilutionNote}</p> : null}
            </section>
            ) : null}
            <section className="pv-sec pv-sec-pack">
              <h3>
                <SecIcon kind="box" />
                Packing &amp; storage
              </h3>
              <dl className="pv-specs">
                {pv.packing.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            {pv.howTo?.length ? (
              <section className="pv-sec pv-sec-wide">
                <h3>
                  <SecIcon kind="steps" />
                  {pv.howToTitle ?? "How to use"}
                </h3>
                <ol className="pv-steps">
                  {pv.howTo.map((h, n) => (
                    <li key={h}>
                      <b>{n + 1}</b>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            {pv.note ? <p className="pv-note">{pv.note}</p> : null}

            <Reviews key={pv.key} name={pv.name} reviews={pv.reviews} whatsapp={whatsapp} />

            <section className="pv-sec pv-more">
              <h3>
                <SecIcon kind="grid" />
                Similar products
              </h3>
              <ul className="pv-similar">
                {similar.map((s2) => (
                  <li key={s2.key}>
                    <button type="button" className="pv-mini" onClick={() => openProduct(s2.key)}>
                      <span className="pv-mini-media">
                        <Photo src={s2.image} alt="" brand={s2.brand} brandLogo={s2.brandLogoFull} name={s2.name} />
                      </span>
                      <span className="pv-mini-type">{s2.type}</span>
                      <span className="pv-mini-name">{s2.name}</span>
                      <span className="pv-mini-go">View product</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          </div>

          {vidOpen && pv.video ? (
            <div className="pv-vid" role="dialog" aria-modal="true" aria-label={`${pv.name}: product video`} onClick={() => setVidOpen(false)}>
              <div className="pv-vid-box" onClick={(e) => e.stopPropagation()}>
                <div className="pv-vid-head">
                  <p>
                    <b>{pv.name}</b>
                    <span>AI-generated product video</span>
                  </p>
                  <button type="button" onClick={() => setVidOpen(false)} aria-label="Close video">
                    ×
                  </button>
                </div>
                <video src={pv.video} controls autoPlay muted playsInline preload="metadata" />
              </div>
            </div>
          ) : null}

          {/* phones: always at the foot, Add to cart and Order on WhatsApp */}
          <div className="pv-buy">
            {pvLine ? (
              <button type="button" className="pv-add is-in" onClick={() => setOpen(true)}>
                <CartIcon /> Go to cart ({pvLine.qty})
              </button>
            ) : (
              <button type="button" className="pv-add" onClick={() => addQty(pv, pvQty)}>
                <CartIcon /> Add to cart
              </button>
            )}
            <a href={pvWa} className="pv-wa" target="_blank" rel="noopener noreferrer">
              <WaIcon /> Order on WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <div className={`pdrawer-dim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`pdrawer${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden={!open} data-lenis-prevent>
        <div className="cart-head">
          <span className="cart-head-ic" aria-hidden="true">
            <CartIcon />
          </span>
          <div className="cart-head-t">
            <h2 id="cart-title">Your cart</h2>
            <p>
              {cart.length
                ? `${cart.length} ${cart.length === 1 ? "product" : "products"} · ${count} ${count === 1 ? "item" : "items"}`
                : "Nothing added yet"}
            </p>
          </div>
          <button type="button" ref={closeRef} className="cart-close" onClick={() => setOpen(false)} aria-label="Close cart" tabIndex={open ? 0 : -1}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {cart.length ? (
            <ul className="cart-list">
              {cart.map((l) => (
                <li key={l.id} className="cart-item">
                  <span className="cart-tile" aria-hidden="true">
                    <DrumIcon />
                  </span>
                  <div className="cart-info">
                    <b className="cart-name">{l.name}</b>
                    <span className="cart-tags">
                      <span className="cart-tag">{l.type}</span>
                      {l.grade ? <span className="cart-tag cart-tag-grade">{l.grade}</span> : null}
                    </span>
                    <div className="cart-row">
                      <div className="cart-qty" role="group" aria-label={`Quantity of ${l.name}`}>
                        <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="One less" tabIndex={open ? 0 : -1}>
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="One more" tabIndex={open ? 0 : -1}>
                          +
                        </button>
                      </div>
                      <button type="button" className="cart-del" onClick={() => setQty(l.id, 0)} aria-label={`Remove ${l.name}`} tabIndex={open ? 0 : -1}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="cart-empty">
              <span className="cart-empty-ic" aria-hidden="true">
                <CartIcon />
              </span>
              <p>Your cart is empty</p>
              <span>Add products from the list, then send us the order on WhatsApp.</span>
              <button type="button" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                Browse products
              </button>
            </div>
          )}

          {cart.length ? (
            <button type="button" className="cart-more" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              + Add more products
            </button>
          ) : null}

          <div className="cart-next">
            <p className="cart-next-k">What happens next</p>
            <ol>
              <li>
                <b>1</b> You send the list on WhatsApp
              </li>
              <li>
                <b>2</b> We check stock and reply with price and delivery
              </li>
              <li>
                <b>3</b> You confirm, and we dispatch
              </li>
            </ol>
          </div>
        </div>

        <div className="cart-foot">
          <label className="cart-notes">
            <span>Add a note (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Pack size, quantity in litres or kg, delivery city…"
              tabIndex={open ? 0 : -1}
            />
          </label>
          <a href={cart.length ? waHref : undefined} aria-disabled={!cart.length} className="cart-wa" target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            <WaIcon /> Send order on WhatsApp
          </a>
          {cart.length ? (
            <button type="button" className="cart-clear cart-clear-solo" onClick={() => setCart([])} tabIndex={open ? 0 : -1}>
              Clear cart
            </button>
          ) : null}
          <p className="cart-fine">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6L12 3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            No payment now. We confirm price, stock and delivery first.
          </p>
        </div>
      </aside>
    </section>
  );
}

/** The frame a product photo goes in (the same look as ui.tsx's MediaSlot, without its imports). */
function PhotoSlot() {
  return (
    <div className="media-slot" style={{ aspectRatio: "4 / 3" }} aria-hidden="true" data-media-slot>
      <span className="media-slot-in">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7.5h3l1.6-2.5h6.8L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13" r="3.6" />
        </svg>
        <span className="media-slot-label">Product photo</span>
        <span className="media-slot-size">800 × 600 px</span>
      </span>
    </div>
  );
}

/** A product's photo; with none yet, a clean industrial pack silhouette. */
function Photo({ src, alt }: { src?: string; alt: string; brand?: string; brandLogo?: string; name?: string }) {
  if (!src) {
    return (
      <div className="kplate" aria-hidden="true">
        <div className="kplate-drum">
          <svg viewBox="0 0 64 80" className="kplate-drum-svg" fill="none" stroke="currentColor">
            <ellipse cx="32" cy="14" rx="26" ry="9" strokeWidth="2.2" />
            <path d="M6 14v52c0 5 11.6 9 26 9s26-4 26-9V14" strokeWidth="2.2" />
            <path d="M6 31c0 5 11.6 9 26 9s26-4 26-9" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6" />
            <path d="M6 48c0 5 11.6 9 26 9s26-4 26-9" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6" />
            <ellipse cx="22" cy="14" rx="5" ry="2" strokeWidth="1.5" />
          </svg>
          <span className="kplate-tag">Industrial Pack</span>
        </div>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="kphoto" src={src} alt={alt} width={800} height={600} loading="lazy" decoding="async" />;
}

/**
 * A product page's photos: the pack from the front and the back, one at a time. Scroll or
 * swipe across, use the arrows, or tap a view below; a view whose photo has not come yet says so.
 */
function Gallery({
  views,
  video,
  name,
  brand,
  brandLogo,
  plateLogo,
  alt,
}: {
  views: ShopItem["views"];
  video?: string;
  name: string;
  brand: string;
  brandLogo?: string;
  plateLogo?: string;
  alt: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [at, setAt] = useState(0);

  type GalleryItem =
    | { kind: "image"; label: string; src?: string }
    | { kind: "video"; label: "AI Video"; video?: string };

  const frontView = views.find((v) => v.label === "Front") ?? { label: "Front" };
  const backView = views.find((v) => v.label === "Back") ?? { label: "Back" };
  const sampleView = views.find((v) => v.label === "Sample");

  const allViews: GalleryItem[] = [
    { kind: "image", label: "Front", src: frontView.src },
    // a back view only where the product has one (construction chemicals show the front only)
    ...(views.some((v) => v.label === "Back") ? [{ kind: "image" as const, label: "Back", src: backView.src }] : []),
    { kind: "video", label: "AI Video", video },
    ...(sampleView ? [{ kind: "image" as const, label: "Sample", src: sampleView.src }] : []),
  ];

  // the video plays with sound when its view is picked; a browser that blocks sound without a tap
  // first plays it muted instead; it pauses when another view is picked
  const vidAt = allViews.findIndex((v) => v.kind === "video" && v.video);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (at === vidAt) {
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    } else {
      v.pause();
    }
  }, [at, vidAt]);
  const go = (k: number) => {
    const t = track.current;
    if (!t) return;
    const n = Math.max(0, Math.min(allViews.length - 1, k));
    t.scrollTo({ left: n * t.clientWidth, behavior: "smooth" });
    setAt(n);
  };
  const onScroll = () => {
    const t = track.current;
    if (t && t.clientWidth) setAt(Math.round(t.scrollLeft / t.clientWidth));
  };
  return (
    <div className="pg">
      <div className="pg-stage">
        <div className="pg-track" ref={track} onScroll={onScroll} data-lenis-prevent tabIndex={0} aria-label={`${name}: media`}>
          {allViews.map((v, k) => (
            <figure className={`pg-slide${v.kind === "video" ? " pg-slide-vid" : ""}`} key={v.label}>
              {v.kind === "video" ? (
                v.video ? (
                  <div className="pg-video-stage">
                    <video
                      ref={vid}
                      src={v.video}
                      controls
                      playsInline
                      loop
                      preload="metadata"
                      className="pg-video-media"
                    />
                  </div>
                ) : (
                  <div className="pg-empty">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                    <b>AI Video</b>
                    <span>Video coming soon</span>
                  </div>
                )
              ) : v.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.src} alt={`${alt}, ${v.label.toLowerCase()} view`} decoding="async" />
              ) : v.label === "Front" ? (
                <Photo alt="" brand={brand} brandLogo={plateLogo ?? brandLogo} name={name} />
              ) : (
                <div className="pg-empty">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7.5h3l1.6-2.5h6.8L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
                    <circle cx="12" cy="13" r="3.6" />
                  </svg>
                  <b>{v.label} view</b>
                  <span>Photo coming soon</span>
                </div>
              )}
            </figure>
          ))}
        </div>
        <span className="pg-brand">
          <Brand name={brand} logo={brandLogo} />
        </span>
        <span className="pg-count" aria-live="polite">
          {allViews[at]?.label} · {at + 1}/{allViews.length}
        </span>
        <button type="button" className="pg-arrow pg-prev" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous view">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className="pg-arrow pg-next" onClick={() => go(at + 1)} disabled={at === allViews.length - 1} aria-label="Next view">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="pg-thumbs" role="group" aria-label="Views">
        {allViews.map((v, k) => (
          <button key={v.label} type="button" className={`pg-thumb${v.kind === "video" ? " pg-thumb-vid" : ""}`} aria-pressed={at === k} onClick={() => go(k)}>
            <span className="pg-thumb-img">
              {v.kind === "video" ? (
                v.video ? (
                  <span className="pg-thumb-vid-preview">
                    <video src={v.video} muted playsInline preload="metadata" />
                    <span className="pg-thumb-play-icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    </span>
                  </span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                )
              ) : v.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.src} alt="" loading="lazy" decoding="async" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7.5h3l1.6-2.5h6.8L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
                  <circle cx="12" cy="13" r="3.6" />
                </svg>
              )}
            </span>
            <span className="pg-thumb-t">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const brandKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * The brand a product is sold under, on a small white plate: Lubecon on construction chemicals,
 * 1-COOL on lubricants; a brand without a logo (Vibrant aerosols) shows nothing.
 */
function Brand({ name, logo }: { name: string; logo?: string }) {
  if (!logo) return null;
  return (
    <span className={`kbrand kbrand-${brandKey(name)} has-logo`} title={`Brand: ${name}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={name} loading="lazy" decoding="async" />
    </span>
  );
}

/** Five stars, filled to a rating (halves round to the nearest star). */
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="rv-stars" aria-label={`${value.toFixed(1)} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={n <= full ? "is-on" : ""}>
          <path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9L12 3.2Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Ratings & reviews: the average and how the stars spread, then each review. Only real reviews are
 * shown (catalogue.ts, details.reviews): until there are some, the section says so. Writing one
 * sends it to Krini Crude on WhatsApp, and it is added to the page once checked (there is no
 * account or database behind the site).
 */
function Reviews({ name, reviews, whatsapp }: { name: string; reviews: ShopReview[]; whatsapp: string }) {
  const [writing, setWriting] = useState(false);
  const [stars, setStars] = useState(0);
  const [who, setWho] = useState("");
  const [text, setText] = useState("");
  const n = reviews.length;
  const avg = n ? reviews.reduce((t, r) => t + r.rating, 0) / n : 0;
  const spread = [5, 4, 3, 2, 1].map((k) => ({ k, c: reviews.filter((r) => Math.round(r.rating) === k).length }));
  const sendHref = `${whatsapp.split("?")[0]}?text=${encodeURIComponent(
    [`Review of ${name}`, `Rating: ${stars} / 5`, `Name / company: ${who.trim()}`, `Review: ${text.trim()}`].join("\n"),
  )}`;
  const ok = stars > 0 && text.trim().length > 3;
  return (
    <section className="pv-sec pv-sec-wide rv" aria-labelledby="rv-title">
      <h3 id="rv-title">
        <SecIcon kind="star" />
        Ratings &amp; reviews
      </h3>
      <div className="rv-grid">
        <div className="rv-sum">
          {n ? (
            <>
              <p className="rv-avg">
                <b>{avg.toFixed(1)}</b>
                <Stars value={avg} size={20} />
              </p>
              <p className="rv-n">
                Based on {n} {n === 1 ? "review" : "reviews"}
              </p>
              <ul className="rv-bars">
                {spread.map(({ k, c }) => (
                  <li key={k}>
                    <span>{k}★</span>
                    <i>
                      <em style={{ width: `${n ? (c / n) * 100 : 0}%` }} />
                    </i>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rv-none">
              <Stars value={0} size={22} />
              <p>
                <b>No reviews yet</b>
                <span>Used {name}? Be the first to review it.</span>
              </p>
            </div>
          )}
          <button type="button" className="rv-write" onClick={() => setWriting((w) => !w)} aria-expanded={writing}>
            {writing ? "Close" : "Write a review"}
          </button>
        </div>

        <div className="rv-main">
          {writing ? (
            <div className="rv-form">
              <p className="rv-k">Your rating</p>
              <div className="rv-pick" role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((k) => (
                  <button key={k} type="button" role="radio" aria-checked={stars === k} aria-label={`${k} star${k > 1 ? "s" : ""}`} className={k <= stars ? "is-on" : ""} onClick={() => setStars(k)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9L12 3.2Z" />
                    </svg>
                  </button>
                ))}
              </div>
              <label className="rv-field">
                <span>Name or company</span>
                <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="e.g. Ravi, precast yard, Chennai" autoComplete="off" />
              </label>
              <label className="rv-field">
                <span>Your review</span>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="How did it work for you? Finish, coverage, release, value…" />
              </label>
              <div className="rv-send">
                <a href={ok ? sendHref : undefined} aria-disabled={!ok} className="rv-send-btn" target="_blank" rel="noopener noreferrer">
                  Send review on WhatsApp
                </a>
                <small>We check every review before it appears here.</small>
              </div>
            </div>
          ) : null}

          {n ? (
            <ul className="rv-list">
              {reviews.map((r, k) => (
                <li key={`${r.name}-${k}`} className="rv-item">
                  <div className="rv-item-top">
                    <span className="rv-badge">
                      {r.rating.toFixed(0)} ★
                    </span>
                    <b>{r.name}</b>
                    {r.place ? <span className="rv-place">{r.place}</span> : null}
                    {r.date ? <span className="rv-date">{r.date}</span> : null}
                  </div>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          ) : !writing ? (
            <p className="rv-empty">Reviews from our customers will appear here. Bought this product? Tap <b>Write a review</b> and tell others how it worked for you.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.5 5 3.5-5 3.5v-7Z" fill="currentColor" />
    </svg>
  );
}

/** The small gold mark beside each section's heading on a product page. */
function SecIcon({ kind }: { kind: "about" | "star" | "target" | "specs" | "drop" | "box" | "steps" | "grid" }) {
  const d: Record<typeof kind, string> = {
    about: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 7.5v.5",
    star: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 12h.01",
    specs: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
    drop: "M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z",
    box: "M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12l8.5-4.5M12 12v9",
    steps: "M5 6h3v3H5zM5 15h3v3H5zM11 7.5h8M11 16.5h8",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  };
  return (
    <span className="pv-ic" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d={d[kind]} />
      </svg>
    </span>
  );
}

/** A small drum, for a product in the cart. */
function DrumIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="7" ry="2.5" />
      <path d="M5 5v14c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5" />
      <path d="M5 10c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5M5 15c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6.2" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </svg>
  );
}

function WaIcon() {
  // no WhatsApp logo next to WhatsApp buttons and links (asked for, October 2026): the words say it
  return null;
}
