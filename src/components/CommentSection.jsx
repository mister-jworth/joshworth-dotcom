'use client';
import { useEffect, useState } from 'react';

/**
 * Comments: migrated WordPress comments (passed in as props) + live comments
 * from the database + anonymous submission form.
 * Spam defenses: hidden honeypot field, server-signed time-trap token
 * (form must be open ≥4s), link cap, per-IP rate limiting — plus every
 * comment is held for approval at /admin/comments.
 */
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function MigratedComment({ c }) {
  return (
    <div className="comment">
      <span className="c-author">{c.author}</span>
      <span className="c-date">{fmtDate(c.date)}</span>
      <div className="c-body" dangerouslySetInnerHTML={{ __html: c.content }} />
      {c.replies?.length > 0 && (
        <div className="replies">
          {c.replies.map((r) => (
            <MigratedComment key={r.id} c={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function LiveBody({ text }) {
  return (
    <div className="c-body">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>
          {para.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function CommentSection({ type, slug, migrated = [] }) {
  const [data, setData] = useState({ comments: [], ts: null, token: null });
  const [form, setForm] = useState({ author: '', content: '', website: '' });
  const [replyTo, setReplyTo] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/comments?type=${type}&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [type, slug]);

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          slug,
          parentId: replyTo,
          ...form,
          ts: data.ts,
          token: data.token,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Something went wrong.');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  const migratedTotal = migrated.reduce((n, c) => n + 1 + (c.replies?.length || 0), 0);
  const total = migratedTotal + data.comments.length;
  const roots = data.comments.filter((c) => !c.parent_id);
  const repliesFor = (id) => data.comments.filter((c) => c.parent_id === id);

  return (
    <div className="live-comments">
      {total > 0 && (
        <div className="comments-label">
          {total} Comment{total === 1 ? '' : 's'}
        </div>
      )}

      {migrated.map((c) => (
        <MigratedComment key={c.id} c={c} />
      ))}

      {roots.map((c) => (
        <div className="comment" key={c.id}>
          <span className="c-author">{c.author}</span>
          <span className="c-date">{fmtDate(c.created_at)}</span>
          <LiveBody text={c.content} />
          <button className="c-reply" onClick={() => setReplyTo(c.id)}>
            Reply
          </button>
          {repliesFor(c.id).length > 0 && (
            <div className="replies">
              {repliesFor(c.id).map((r) => (
                <div className="comment" key={r.id}>
                  <span className="c-author">{r.author}</span>
                  <span className="c-date">{fmtDate(r.created_at)}</span>
                  <LiveBody text={r.content} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {status === 'sent' ? (
        <p className="comment-thanks">
          <strong>Thanks!</strong> Your comment is awaiting moderation and will appear once
          approved.
        </p>
      ) : (
        <form className="comment-form" onSubmit={submit}>
          <div className="comments-label" style={{ marginTop: '2em' }}>
            Leave a comment
          </div>
          {replyTo && (
            <p className="replying-note">
              Replying to {data.comments.find((c) => c.id === replyTo)?.author || 'comment'}{' '}
              <button type="button" onClick={() => setReplyTo(null)}>
                (cancel)
              </button>
            </p>
          )}
          <label>
            Name
            <input
              required
              maxLength={80}
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </label>
          <label className="hp-field" aria-hidden="true" tabIndex={-1}>
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>
          <label>
            Comment
            <textarea
              required
              rows={6}
              maxLength={5000}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>
          <button className="button" type="submit" disabled={status === 'sending' || !data.token}>
            {status === 'sending' ? 'Sending…' : 'Post Comment'}
          </button>
          {status === 'error' && <p className="comment-error">{error}</p>}
        </form>
      )}
    </div>
  );
}
