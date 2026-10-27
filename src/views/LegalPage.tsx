import { routes, site } from "../content/site";
import type { LegalDoc } from "../content/legal";
import { breadcrumbs, webPage } from "../content/schema";
import { Shell } from "../components/Shell";
import { Breadcrumbs } from "../components/PageHeader";

/**
 * Privacy Policy or Terms & Conditions (styles: app/legal.css, all under .lg2).
 *
 *  1. A navy header: "Legal", the title, a short lead, when it was last updated, and a switch
 *     between the two documents.
 *  2. "At a glance": the four things most people want to know, in plain words.
 *  3. The sections as numbered cards; the list of sections beside them on large screens and
 *     folded into "On this page" on phones.
 *  4. A contact card: call, email or WhatsApp.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const t = [
    { name: "Home", path: routes.home },
    { name: doc.label, path: doc.seo.path },
  ];
  const c = site.contact;
  const id = (i: number) => `${doc.id}-${i + 1}`;
  const words = doc.body
    .flatMap((b) => [...(b.p ?? []), ...(b.list ?? []), ...(b.after ?? [])])
    .join(" ")
    .split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const docs = [
    { id: "privacy", label: "Privacy Policy", href: routes.privacy },
    { id: "terms", label: "Terms & Conditions", href: routes.terms },
  ];
  const toc = (
    <ol>
      {doc.body.map((b, i) => (
        <li key={b.h}>
          <a href={`#${id(i)}`}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {b.h}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <Shell schema={[webPage(doc.seo), breadcrumbs(t)]}>
      <section className="legal lg2" aria-labelledby="page-title">
        <header className="lg2-top">
          <div className="frame">
            <Breadcrumbs trail={t} />
            <p className="lg2-k">Legal</p>
            <h1 id="page-title" className="lg2-title">
              {doc.title}
            </h1>
            <p className="lg2-lead">{doc.lead}</p>
            <p className="lg2-meta">
              <span>Last updated {doc.updated}</span>
              <span>{minutes} min read</span>
            </p>
            <nav className="lg2-switch" aria-label="Legal documents">
              {docs.map((d) => (
                <a key={d.id} href={d.href} aria-current={d.id === doc.id ? "page" : undefined}>
                  {d.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div className="frame lg2-wrap">
          <aside className="lg2-glance" aria-label="At a glance">
            <p className="lg2-glance-k">At a glance</p>
            <ul>
              {doc.glance.map((g) => (
                <li key={g}>
                  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                    <circle cx="10" cy="10" r="10" />
                    <path d="M5.8 10.4l2.7 2.7 5.7-6" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg2-grid">
            <nav className="lg2-toc" aria-label="On this page">
              <details className="lg2-toc-fold">
                <summary>
                  On this page <small>{doc.body.length} sections</small>
                </summary>
                {toc}
              </details>
              <div className="lg2-toc-side">
                <p className="lg2-toc-k">On this page</p>
                {toc}
              </div>
            </nav>

            <div className="lg2-body">
              {doc.body.map((b, i) => (
                <section key={b.h} id={id(i)} className="lg2-sec" aria-labelledby={`${id(i)}-h`}>
                  <h2 id={`${id(i)}-h`}>
                    <span className="lg2-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {b.h}
                  </h2>
                  {b.p?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {b.list ? (
                    <ul>
                      {b.list.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ) : null}
                  {b.after?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              ))}

              <aside className="lg2-ask" aria-label="Questions">
                <p className="lg2-ask-k">Questions about this {doc.id === "privacy" ? "policy" : "page"}?</p>
                <p className="lg2-ask-t">Our team will gladly help. Reach us the way that suits you.</p>
                <div className="lg2-ask-btns">
                  <a href={c.phoneHref} className="lg2-ask-gold">
                    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z" />
                    </svg>
                    Call us
                  </a>
                  <a href={`mailto:${c.email}`}>
                    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
                    </svg>
                    Email
                  </a>
                  <a href={c.whatsapp} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8s-.39-.12-.55.12-.63.8-.78.96-.29.19-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33a.45.45 0 0 0-.02-.42c-.06-.12-.55-1.33-.76-1.82s-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.1 3.65c1.53.66 2.13.72 2.9.6a2.5 2.5 0 0 0 1.63-1.15 2 2 0 0 0 .14-1.15c-.06-.1-.22-.16-.47-.28Z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
