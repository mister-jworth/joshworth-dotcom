'use client';
import { Children, useEffect, useState } from 'react';

/**
 * Masonry with row-major (left-to-right, newest-first) reading order.
 * Cards are dealt round-robin into N flex columns: 1,2,3 / 4,5,6 / ...
 * so each row reads chronologically while columns still pack tightly.
 */
export default function MasonryGrid({ children, cols = 3 }) {
  const [n, setN] = useState(cols);

  useEffect(() => {
    const mqSmall = window.matchMedia('(max-width: 640px)');
    const mqMed = window.matchMedia('(max-width: 980px)');
    const update = () =>
      setN(mqSmall.matches ? 1 : mqMed.matches ? Math.min(2, cols) : cols);
    update();
    mqSmall.addEventListener('change', update);
    mqMed.addEventListener('change', update);
    return () => {
      mqSmall.removeEventListener('change', update);
      mqMed.removeEventListener('change', update);
    };
  }, [cols]);

  const kids = Children.toArray(children);
  const columns = Array.from({ length: n }, (_, i) => kids.filter((_, j) => j % n === i));

  return (
    <div className="masonry-flex">
      {columns.map((col, i) => (
        <div className="masonry-col" key={i}>
          {col}
        </div>
      ))}
    </div>
  );
}
