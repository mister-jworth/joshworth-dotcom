'use client';
import { useEffect, useRef } from 'react';

// Max rotation in degrees — kept small so the effect reads as a subtle,
// physical response rather than a literal "3D book" gimmick.
const MAX_TILT = { grid: 7, detail: 5 };

/**
 * A book/PDF cover that tilts toward the pointer (or the device's
 * accelerometer, on phones) like a glossy card catching the light —
 * Apple TV top-shelf parallax, dialed way down. All motion is driven by
 * CSS custom properties updated in a rAF loop (not React state), so
 * hovering never triggers a re-render.
 *
 * `name` becomes this cover's view-transition-name, so the browser morphs
 * the same physical cover between the grid and the detail view.
 */
export default function TiltCover({ src, alt, name, variant = 'grid' }) {
  const wrapRef = useRef(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const max = MAX_TILT[variant] || MAX_TILT.grid;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function paint() {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.14;
      c.y += (t.y - c.y) * 0.14;
      el.style.setProperty('--rx', `${c.x.toFixed(3)}deg`);
      el.style.setProperty('--ry', `${c.y.toFixed(3)}deg`);
      el.style.setProperty('--sx', `${(50 - c.y * 2.2).toFixed(2)}%`);
      el.style.setProperty('--sy', `${(50 + c.x * 2.2).toFixed(2)}%`);
      el.style.setProperty('--shx', `${(-c.y * 1.6).toFixed(2)}px`);
      el.style.setProperty('--shy', `${(10 - c.x * 1.6).toFixed(2)}px`);
      raf.current = requestAnimationFrame(paint);
    }
    if (!reduceMotion) raf.current = requestAnimationFrame(paint);

    function onMove(e) {
      hovering.current = true;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.current = { x: (0.5 - py) * max, y: (px - 0.5) * max };
    }
    function onLeave() {
      hovering.current = false;
      target.current = { x: 0, y: 0 };
    }
    // Snap flat immediately on press, so a click never carries a tilted
    // snapshot into the grid→detail view transition.
    function onDown() {
      hovering.current = false;
      target.current = { x: 0, y: 0 };
      current.current = { x: 0, y: 0 };
    }
    function onOrient(e) {
      if (hovering.current || e.beta == null || e.gamma == null) return;
      // ~45deg is a comfortable phone-holding angle; treat it as "level".
      const beta = Math.max(-30, Math.min(30, e.beta - 45));
      const gamma = Math.max(-30, Math.min(30, e.gamma));
      target.current = { x: (beta / 30) * -max, y: (gamma / 30) * max };
    }

    if (!reduceMotion) {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('pointerdown', onDown);
      window.addEventListener('deviceorientation', onOrient);
    }
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, [variant]);

  return (
    <span
      className={`tilt-cover tilt-cover-${variant}`}
      ref={wrapRef}
      style={{ viewTransitionName: name }}
    >
      <img className="tilt-cover-img" src={src} alt={alt} draggable={false} loading="lazy" />
      <span className="tilt-cover-sheen" aria-hidden="true" />
    </span>
  );
}
