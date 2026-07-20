'use client';
import { useEffect, useState, useCallback } from 'react';

/**
 * Global lightbox via event delegation: any <a data-lightbox href="..."> in
 * migrated content opens full-size in an overlay, with prev/next within the
 * same gallery.
 */
export default function Lightbox() {
  const [items, setItems] = useState(null); // array of hrefs
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest('a[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      const scope = a.closest('.gallery') || document;
      const links = Array.from(scope.querySelectorAll('a[data-lightbox]'));
      setItems(links.map((l) => l.getAttribute('href')));
      setIndex(links.indexOf(a));
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const close = useCallback(() => setItems(null), []);
  const step = useCallback(
    (d) => setIndex((i) => (items ? (i + d + items.length) % items.length : 0)),
    [items]
  );

  useEffect(() => {
    if (!items) return;
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [items, close, step]);

  if (!items) return null;
  return (
    <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
      <button className="lightbox-close" onClick={close} aria-label="Close">
        ×
      </button>
      {items.length > 1 && (
        <button className="lightbox-nav lightbox-prev" onClick={() => step(-1)} aria-label="Previous">
          ‹
        </button>
      )}
      <img src={items[index]} alt="" />
      {items.length > 1 && (
        <button className="lightbox-nav lightbox-next" onClick={() => step(1)} aria-label="Next">
          ›
        </button>
      )}
    </div>
  );
}
