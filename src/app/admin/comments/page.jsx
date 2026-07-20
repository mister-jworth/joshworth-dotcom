'use client';
import { useEffect, useState, useCallback } from 'react';

/**
 * Private moderation page. Visit /admin/comments and enter the value of the
 * COMMENTS_ADMIN_KEY environment variable (set it in Vercel → Settings →
 * Environment Variables). The key is remembered in this browser.
 */
export default function ModerationPage() {
  const [key, setKey] = useState('');
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState('pending');
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('jw-admin-key');
    if (saved) {
      setKey(saved);
      setEntered(true);
    }
  }, []);

  const load = useCallback(
    async (k, status) => {
      const res = await fetch(`/api/comments/moderate?status=${status}`, {
        headers: { Authorization: `Bearer ${k}` },
      });
      if (res.status === 401) {
        setMsg('Wrong key (or COMMENTS_ADMIN_KEY is not set on the server).');
        setEntered(false);
        window.localStorage.removeItem('jw-admin-key');
        return;
      }
      const out = await res.json();
      setComments(out.comments || []);
      setMsg('');
    },
    []
  );

  useEffect(() => {
    if (entered && key) load(key, tab);
  }, [entered, key, tab, load]);

  async function act(id, action) {
    await fetch('/api/comments/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ id, action }),
    });
    load(key, tab);
  }

  if (!entered) {
    return (
      <div className="narrow" style={{ padding: '60px 24px' }}>
        <h1>Comment moderation</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.localStorage.setItem('jw-admin-key', key);
            setEntered(true);
          }}
          style={{ display: 'flex', gap: 12 }}
        >
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--line)' }}
          />
          <button className="button button-solid" type="submit">
            Enter
          </button>
        </form>
        {msg && <p style={{ color: '#b04343' }}>{msg}</p>}
      </div>
    );
  }

  return (
    <div className="narrow" style={{ padding: '40px 24px' }}>
      <h1>Comment moderation</h1>
      <div style={{ display: 'flex', gap: 10, margin: '1.5em 0' }}>
        {['pending', 'approved', 'spam'].map((t) => (
          <button
            key={t}
            className={`button${tab === t ? ' button-solid' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {comments.length === 0 && <p>Nothing in “{tab}”. 🎉</p>}
      {comments.map((c) => (
        <div key={c.id} className="comment" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1em' }}>
          <span className="c-author">{c.author}</span>
          <span className="c-date">
            {new Date(c.created_at).toLocaleString()} · on{' '}
            <a href={`/${c.post_type}/${c.slug}`} target="_blank" rel="noreferrer">
              {c.slug}
            </a>
          </span>
          <div className="c-body" style={{ whiteSpace: 'pre-wrap' }}>{c.content}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {tab !== 'approved' && (
              <button className="button" onClick={() => act(c.id, 'approve')}>
                Approve
              </button>
            )}
            {tab !== 'spam' && (
              <button className="button" onClick={() => act(c.id, 'spam')}>
                Spam
              </button>
            )}
            <button className="button" onClick={() => act(c.id, 'delete')}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
