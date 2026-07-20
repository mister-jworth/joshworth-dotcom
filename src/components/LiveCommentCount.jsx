'use client';
import { useEffect, useState } from 'react';

// One shared fetch per page load: /api/comments/counts returns every
// approved-comment count from the database in a single small JSON.
let countsPromise;
function getCounts() {
  countsPromise ||= fetch('/api/comments/counts')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return countsPromise;
}

/** Renders migrated count + live approved comments from the new system. */
export default function LiveCommentCount({ type, slug, base = 0 }) {
  const [n, setN] = useState(base);
  useEffect(() => {
    let on = true;
    getCounts().then((c) => {
      if (on) setN(base + (c?.[type]?.[slug] || 0));
    });
    return () => {
      on = false;
    };
  }, [type, slug, base]);
  return <>{n}</>;
}

export function CommentIcon() {
  return (
    <svg
      className="comment-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 3C5.9 3 3 5.6 3 8.8c0 1.2.4 2.3 1.1 3.2.2.3.3.7.1 1l-.9 2.3 2.9-1.1c.3-.1.6-.1.9 0 .8.2 1.6.4 2.4.4 3.6 0 6.5-2.6 6.5-5.8S13.1 3 9.5 3z" />
      <path d="M16.8 9.3c2.4.5 4.2 2.4 4.2 4.7 0 1-.3 1.9-.9 2.6-.2.3-.3.7-.1 1l.7 1.9-2.4-.9c-.3-.1-.6-.1-.9 0-.6.2-1.3.3-2 .3-2.3 0-4.3-1.1-5.2-2.8" />
    </svg>
  );
}
