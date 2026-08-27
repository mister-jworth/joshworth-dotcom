'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import TiltCover from './TiltCover';

function pathFor(slug) {
  return slug ? `/writing/${slug}` : '/writing';
}

/**
 * The /writing gallery: a grid of covers that morphs into a single-work
 * close-up on click. Grid and detail are two states of one client
 * component (never both mounted at once) so the browser's View Transition
 * API can animate the clicked cover's own element straight from its grid
 * position into the detail layout, while everything else cross-fades.
 *
 * Navigation updates the URL with plain history.pushState rather than the
 * Next router, so it never fights the view-transition animation waiting on
 * a route change to resolve. The [[...slug]] route still exists for real
 * (server-rendered, shareable, no-JS-safe) links to a single work.
 */
export default function WorksGallery({ works, initialSlug = null }) {
  const [openSlug, setOpenSlug] = useState(initialSlug);
  const requestedMotion = useRef(false);
  const open = works.find((w) => w.slug === openSlug) || null;

  const go = useCallback((slug) => {
    const run = () => {
      setOpenSlug(slug);
      window.history.pushState(null, '', pathFor(slug));
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(run);
    } else {
      run();
    }
  }, []);

  // Support the browser back/forward buttons.
  useEffect(() => {
    function onPop() {
      const m = window.location.pathname.match(/^\/writing\/([^/]+)\/?$/);
      setOpenSlug(m ? decodeURIComponent(m[1]) : null);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') go(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  // iOS gates deviceorientation behind a permission prompt that can only be
  // triggered by a user gesture — ask on the first tap anywhere on the page.
  useEffect(() => {
    function unlock() {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function' && !requestedMotion.current) {
        requestedMotion.current = true;
        DOE.requestPermission().catch(() => {});
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  if (open) {
    return (
      <div className="work-detail">
        <button className="work-back" onClick={() => go(null)}>
          ← All Writing
        </button>
        <div className="work-detail-inner">
          <div className="work-detail-cover">
            <TiltCover
              src={open.coverArt}
              alt={`${open.title} cover`}
              name={`work-cover-${open.slug}`}
              variant="detail"
            />
          </div>
          <div className="work-copy">
            <h1>{open.title}</h1>
            {open.workType && <p className="work-byline">A {open.workType} by Josh Worth</p>}
            {(open.synopsis || open.excerpt) && (
              <p className="work-synopsis">{open.synopsis || open.excerpt}</p>
            )}
            {open.pdfUrl ? (
              <a className="button button-solid work-download" href={open.pdfUrl}>
                Download PDF
              </a>
            ) : (
              <p className="work-wip">Still being written — check back soon.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container works-intro">
        <h1 className="page-title">Writing</h1>
        <p className="page-meta">Plays and other written work — click a cover to read more</p>
      </div>
      {works.length > 0 ? (
        <div className="works-grid">
          {works.map((w) => (
            <button key={w.slug} className="work-tile" onClick={() => go(w.slug)}>
              <TiltCover
                src={w.coverArt}
                alt={`${w.title} cover`}
                name={`work-cover-${w.slug}`}
                variant="grid"
              />
              <span className="work-tile-title">{w.title}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="page-meta">More coming soon.</p>
      )}
    </>
  );
}
