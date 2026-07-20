'use client';
import { useEffect, useRef } from 'react';

/**
 * New comments via Giscus (GitHub Discussions).
 *
 * SETUP (one-time, ~5 minutes):
 *   1. Push this project to a public GitHub repo.
 *   2. Enable "Discussions" in the repo settings.
 *   3. Install the giscus app: https://github.com/apps/giscus
 *   4. Visit https://giscus.app, pick your repo, and copy the generated
 *      data-repo-id and data-category-id values.
 *   5. Set these as environment variables in Vercel (Project → Settings →
 *      Environment Variables), then redeploy:
 *        NEXT_PUBLIC_GISCUS_REPO        e.g. "joshworth/joshworth.com"
 *        NEXT_PUBLIC_GISCUS_REPO_ID
 *        NEXT_PUBLIC_GISCUS_CATEGORY_ID
 *
 * Until configured, this component renders a quiet "comments closed" note.
 */
const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export default function Giscus() {
  const ref = useRef(null);

  useEffect(() => {
    if (!REPO || !REPO_ID || !ref.current || ref.current.hasChildNodes()) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    Object.entries({
      'data-repo': REPO,
      'data-repo-id': REPO_ID,
      'data-category': 'Comments',
      'data-category-id': CATEGORY_ID,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': 'light',
      'data-lang': 'en',
    }).forEach(([k, v]) => s.setAttribute(k, v ?? ''));
    ref.current.appendChild(s);
  }, []);

  if (!REPO || !REPO_ID) {
    return <p className="comments-closed-note">Comments are closed for now.</p>;
  }
  return <div ref={ref} />;
}
