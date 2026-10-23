"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductRangeItem } from "../content/catalogue";
import { MediaSlot } from "./ui";
import { enquireHref } from "../content/site";
import { Arrow } from "./ui";

export function ProductDetailsTrigger({
  product,
  type,
  compact = false,
}: {
  product: ProductRangeItem;
  type: string;
  /** On a product card: one small dark button with an arrow in place of the chips. */
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const d = product.details;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsImageOpen(false);
      return;
    }

    // Freeze smooth scrolling on background page
    window.dispatchEvent(new CustomEvent("scroller:stop"));
    const winScroller = (window as unknown as { __scroller?: { stop: () => void; start: () => void } }).__scroller;
    winScroller?.stop?.();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageOpen) {
          setIsImageOpen(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.documentElement.classList.add("has-dialog");

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("has-dialog");
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;

      // Resume smooth scrolling on background page
      window.dispatchEvent(new CustomEvent("scroller:start"));
      winScroller?.start?.();
    };
  }, [isOpen]);

  if (!d) return null;

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    window.location.href = enquireHref(type, product.name);
  };

  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <>
      {compact ? (
        <button
          type="button"
          className="scard-more"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={`${product.name}: full details`}
          title="Full details"
        >
          <Arrow />
        </button>
      ) : (
      <div className="lp-pitem-chips">
        <button
          type="button"
          className="lp-chip lp-chip-gold lp-chip-btn"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          id={`btn-${slug}-details`}
        >
          Full details
        </button>
        {d.pdsRevision ? (
          <span className="lp-chip lp-chip-subtle">{d.pdsRevision}</span>
        ) : null}
      </div>
      )}

      {isOpen && mounted && createPortal(
        <div
          className="pds-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`pds-modal-title-${slug}`}
          data-lenis-prevent="true"
        >
          <div
            className="pds-modal-container"
            data-lenis-prevent="true"
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <header className="pds-modal-header">
              <div className="pds-modal-title-wrap">
                <span className="pds-modal-tag label">Technical Product Data Sheet</span>
                <h3 id={`pds-modal-title-${slug}`} className="pds-modal-title display-tight">
                  {product.name}
                </h3>
                <p className="pds-modal-sub">{product.text}</p>
              </div>
              <div className="pds-modal-header-actions">
                {d.pdsRevision ? (
                  <span className="lp-chip lp-chip-gold pds-header-chip">{d.pdsRevision}</span>
                ) : null}
                <button
                  type="button"
                  className="pds-close-btn"
                  aria-label="Close product details"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Scrollable Content Body */}
            <div
              className="pds-modal-body"
              data-lenis-prevent="true"
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Top Hero: Image + Overview Description + Average Coverage */}
              <div className="pds-modal-top">
                {d.image ? (
                  <button
                    type="button"
                    className="pds-modal-thumb-box pds-modal-thumb-clickable"
                    onClick={() => setIsImageOpen(true)}
                    aria-label={`Enlarge image for ${product.name}`}
                    title="Click to view full image"
                  >
                    <MediaSlot label="Product photo" w={130} h={130} className="pds-modal-img" />
                    <span className="pds-modal-thumb-zoom-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      View
                    </span>
                  </button>
                ) : null}
                <div className="pds-modal-top-info">
                  {d.description ? <p className="pds-modal-desc">{d.description}</p> : null}
                  {d.coverage ? (
                    <div className="lp-coverage-pill">
                      <span className="label">Average Coverage</span>
                      <span className="lp-coverage-val">{d.coverage}</span>
                      {d.coverageNote ? (
                        <p className="lp-coverage-note">{d.coverageNote}</p>
                      ) : null}
                    </div>
                  ) : null}
                  {d.dilution ? (
                    <div className="lp-coverage-pill">
                      <span className="label">Recommended Concentration</span>
                      <span className="lp-coverage-val">{d.dilution}</span>
                      {d.dilutionNote ? (
                        <p className="lp-coverage-note">{d.dilutionNote}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Suitable Applications */}
              {d.purpose?.length ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">
                    {d.purposeTitle || "Suitable Applications & Formwork Types"}
                  </h4>
                  <ul className="lp-range-tags">
                    {d.purpose.map((use) => (
                      <li key={use} className="lp-range-tag">
                        {use}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Key Benefits */}
              {d.benefits?.length ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">Key Benefits &amp; Performance Highlights</h4>
                  <ul className="ticks ticks-amber lp-ticks">
                    {d.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Typical Properties Table */}
              {d.properties?.length ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">Typical Properties &amp; Technical Specifications</h4>
                  <div className="lp-props-table-wrap">
                    <table className="lp-props-table">
                      <thead>
                        <tr>
                          <th scope="col">Property / Parameter</th>
                          <th scope="col">Typical Value</th>
                          <th scope="col">Specification Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.properties.map((prop) => (
                          <tr key={prop.property}>
                            <td className="lp-props-prop">{prop.property}</td>
                            <td className="lp-props-val">{prop.value}</td>
                            <td className="lp-props-spec">{prop.spec || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {d.sheetUrl ? (
                    <div className="pds-report-card">
                      <div className="pds-report-card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="pds-report-card-content">
                        <span className="pds-report-card-kicker">Technical Data Sheet</span>
                        <span className="pds-report-card-title">{d.sheetLabel || "Official Product Data Sheet (PDS)"}</span>
                      </div>
                      <a
                        href={d.sheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pds-report-card-btn"
                      >
                        View Data Sheet
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  ) : null}
                  {d.reportUrl ? (
                    <div className="pds-report-card">
                      <div className="pds-report-card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="pds-report-card-content">
                        <span className="pds-report-card-kicker">{d.reportKicker || "Original Test Certificate"}</span>
                        <span className="pds-report-card-title">{d.reportLabel || "Manufacturer Test Certificate (MTC)"}</span>
                      </div>
                      <a
                        href={d.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pds-report-card-btn"
                      >
                        {d.reportButtonText || "View original report"}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {/* Recommended Concentration Ratios */}
              {d.dilutionRatios?.length ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">Recommended Concentration &amp; Dilution</h4>
                  <div className="lp-props-table-wrap">
                    <table className="lp-props-table">
                      <thead>
                        <tr>
                          <th scope="col">Application / Operation</th>
                          <th scope="col">Recommended Concentration %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.dilutionRatios.map((item) => (
                          <tr key={item.operation}>
                            <td className="lp-props-prop">{item.operation}</td>
                            <td className="lp-props-val" style={{ color: "var(--color-gold, #f59e0b)" }}>
                              {item.ratio}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {/* Application / Mixing Method */}
              {d.application?.length ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">
                    {d.applicationTitle || "Application Method & Instructions"}
                  </h4>
                  <ol className="lp-range-steps">
                    {d.application.map((step, idx) => (
                      <li key={idx}>
                        <span className="lp-step-num">{idx + 1}</span>
                        <span className="lp-step-text">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {/* Packaging, Storage & Handling */}
              {d.packing || d.storage || d.shelfLife ? (
                <section className="pds-modal-section">
                  <h4 className="pds-modal-sec-title">Packaging, Storage &amp; Handling</h4>
                  <div className="lp-range-meta">
                    {d.packing ? (
                      <div className="lp-range-meta-item">
                        <span className="lp-range-meta-label">Standard Packing</span>
                        <span className="lp-range-meta-value">{d.packing}</span>
                      </div>
                    ) : null}
                    {d.shelfLife ? (
                      <div className="lp-range-meta-item">
                        <span className="lp-range-meta-label">Shelf Life</span>
                        <span className="lp-range-meta-value">{d.shelfLife}</span>
                      </div>
                    ) : null}
                    {d.storage ? (
                      <div className="lp-range-meta-item">
                        <span className="lp-range-meta-label">Storage &amp; Handling</span>
                        <span className="lp-range-meta-value">{d.storage}</span>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {/* Technical Qualification Disclaimer */}
              {d.note ? <p className="lp-range-disclaimer">{d.note}</p> : null}
            </div>

            {/* Footer */}
            <footer className="pds-modal-footer">
              {d.sheetUrl ? (
                <a
                  href={d.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pds-footer-report-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  View Product Data Sheet
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : null}
              {d.reportUrl ? (
                <a
                  href={d.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pds-footer-report-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {d.reportButtonText || "View original report"}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : null}
              <a
                href={enquireHref(type, product.name)}
                className="btn btn-primary lp-btn"
                data-enquire={type}
                data-product={product.name}
                onClick={handleEnquireClick}
              >
                Enquire now <Arrow />
              </a>
            </footer>
          </div>
        </div>,
        document.body
      )}

      {isImageOpen && d.image && mounted && createPortal(
        <div
          className="pds-lightbox-backdrop"
          onClick={() => setIsImageOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Full image view of ${product.name}`}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="pds-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="pds-lightbox-close"
              onClick={() => setIsImageOpen(false)}
              aria-label="Close image view"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="pds-lightbox-img-wrap">
              <MediaSlot label={`${product.name}: product photo`} w={1200} h={1200} className="pds-lightbox-img" />
            </div>
            <div className="pds-lightbox-caption">
              <span className="pds-lightbox-title">{product.name}</span>
              {d.imageAlt ? <span className="pds-lightbox-sub">{d.imageAlt}</span> : null}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
