'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import TiltCover from './TiltCover';

function pathFor(slug) {
  return slug ? `/writing/${slug}` : '/writing';
}

// The widest column count the grid allows at this viewport — mirrors the
// .works-grid media queries in globals.css (980px, 640px), which cover the
// pre-hydration/no-JS case.
function maxColsForWidth(width) {
  if (width > 980) return 5;
  if (width > 640) return 3;
  return 2;
}

// Rather than always filling every row up to maxCols and leaving whatever
// remainder dangling in a straggly last row (e.g. 7 items at 5-per-row →
// 5, 2, or worse, a lone item on its own row), use the fewest rows that fit
// within maxCols, then spread the items across those rows as evenly as
// possible. The last row comes up short rather than the column count
// dropping to force an even fit — e.g. 7 at a 5-wide max becomes two rows
// of 4, 3 (one empty slot trailing the second row) instead of 5, 2.
function balancedColumns(count, maxCols) {
  if (count <= 1) return 1;
  const rows = Math.ceil(count / maxCols);
  return Math.ceil(count / rows);
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
  const gridRef = useRef(null);
  const open = works.find((w) => w.slug === openSlug) || null;

  // Balance the column count against the current item count and viewport,
  // instead of just auto-filling and leaving an awkward remainder.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    function update() {
      const cols = balancedColumns(works.length, maxColsForWidth(window.innerWidth));
      el.style.setProperty('--work-cols', cols);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [works.length, open]);

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

  // The detail view is a fixed, full-viewport layer (so it can center
  // itself regardless of scroll — see .work-detail) — lock background
  // scroll while it's up, same as the header's nav/search overlays.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
        <div className="works-grid" ref={gridRef}>
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
