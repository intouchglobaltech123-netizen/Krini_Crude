import type { CSSProperties } from "react";
import { enquireHref, routes, site, type PageId } from "../content/site";
import type { Line } from "../content/catalogue";
import { Arrow, Glyph } from "./ui";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/**
 * The top of every page, in two levels. A thin dark strip (ISO, the factory,
 * phone, email, WhatsApp) folds away once the page moves; under it the white
 * bar: the logo on the left; Home, About Us, Products and Blog in one box and
 * the gold Enquire now button on the right. Each is a plain link (Products
 * goes to the Products page; no panel opens under it). Below 1024px the menu
 * opens as a sheet from the bar: Home, About Us, Products and Blog.
 */
export function Nav({ current, line: currentLine }: { current?: PageId; line?: Line["id"] }) {
  const { contact, menu } = site;
  const here = currentLine ? menu.lines.find((m) => m.line === currentLine)?.label : menu.pages.find((n) => n.id === current)?.label;
  const onProducts = current === "products" || !!currentLine;
  const links: { id: string; label: string; href: string; on: boolean }[] = [
    { id: "home", label: "Home", href: routes.home, on: current === "home" },
    { id: "about", label: "About Us", href: routes.about, on: current === "about" },
    { id: "products", label: "Products", href: routes.products, on: onProducts },
    { id: "blog", label: "Blog", href: routes.blog, on: current === "blog" },
  ];
  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-bone px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="nav fixed inset-x-0 top-0 z-50" data-nav>
        <div className="nav-strip">
          <div className="frame nav-strip-in">
            <p className="nav-strip-note">
              <span className="nav-strip-dot" aria-hidden="true" />
              ISO 9001:2015 certified manufacturer · Factory near Madhavaram, Chennai
            </p>
            <ul className="nav-strip-reach">
              <li>
                <a href={contact.phoneHref}>
                  <Glyph name="call" size={15} /> {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`}>
                  <Glyph name="mail" size={15} /> {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="nav-main">
          <div className="frame nav-bar nav-split flex items-center justify-between gap-6">
            {/* the logo, exactly as supplied (icon and words), on the left; the four pages in one box and Enquire now on the right */}
            <a href={routes.home} className="nav-logo nav-logo-c shrink-0" aria-label="Krini Crude, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-krini-h.webp?v=kc4" alt="" width={735} height={330} className="nav-mark nav-logo-full nav-logo-dark" />
              {/* the same logo with white words, for the dark home film on a phone */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-krini-h-light.webp?v=kc4" alt="" width={735} height={330} className="nav-logo-lite" />
            </a>
            <nav aria-label="Primary" className="nav-box hidden lg:block">
              <ul className="nav-list">
                {links.map((item) => (
                  <li key={item.id}>
                    <a className={`nav-link${item.on ? " is-current" : ""}`} href={item.href} aria-current={item.on ? "page" : undefined}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="nav-side nav-side-r flex items-center gap-3">
              <a href={enquireHref("Enquiry")} className="btn btn-primary nav-enquire hidden sm:inline-flex" data-magnetic data-enquire="Enquiry">
                Enquire now <Arrow />
              </a>
              <button
                type="button"
                className="menu-toggle lg:hidden"
                aria-label="Open menu"
                aria-expanded="false"
                aria-controls="site-menu"
                data-menu-toggle
              >
                <span className="menu-toggle-icon" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <span className="menu-toggle-label label" aria-hidden="true">
                  <span>Menu</span>
                  <span>Close</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Phones and tablets: a sheet that drops from the top bar over the dimmed page: Home,
          About Us, Products and Blog, then quick ways to get in touch and Enquire now (the
          Contact page). */}
      <div id="site-menu" className="menu lg:hidden" data-menu aria-hidden="true">
        <div className="menu-dim" data-menu-dim />
        <div className="menu-sheet" data-lenis-prevent>
          <div className="menu-head menu-item label" style={vars({ "--i": 0 })}>
            <span>Menu</span>
            {here ? (
              <span className="menu-now">
                <span className="menu-now-dot" aria-hidden="true" />
                <span className="sr-only">You are on: </span>
                <span>{here}</span>
              </span>
            ) : null}
          </div>
          <nav aria-label="Mobile">
            <ul className="menu-grid">
              {menu.pages.map((item, i) => (
                <li key={item.id} className="menu-item" style={vars({ "--i": i + 1 })}>
                  <a
                    href={item.href}
                    className={`menu-tile${item.id === current || (item.id === "products" && currentLine) ? " is-current" : ""}`}
                    aria-current={item.id === current || (item.id === "products" && currentLine) ? "page" : undefined}
                    data-menu-link
                    tabIndex={-1}
                  >
                    <span className="menu-tile-top">
                      <span className="label">{String(i + 1).padStart(2, "0")}</span>
                      <Glyph name={item.id === "about" ? "user" : item.id} />
                    </span>
                    <span className="menu-tile-name display-tight">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-foot menu-item" style={vars({ "--i": 6 })}>
            <a href={contact.phoneHref} className="menu-quick" data-menu-link tabIndex={-1}>
              <Glyph name="call" /> Call
            </a>
            <a href={contact.whatsapp} className="menu-quick" target="_blank" rel="noopener noreferrer" data-menu-link tabIndex={-1}>
              WhatsApp
            </a>
            <a href={enquireHref("Enquiry")} className="btn btn-primary menu-enquire" data-menu-link data-enquire="Enquiry" tabIndex={-1}>
              Enquire now <Arrow />
            </a>
          </div>
          <p className="menu-contact menu-item label" style={vars({ "--i": 7 })}>
            {contact.phone} · {contact.email}
          </p>
        </div>
      </div>
    </>
  );
}
