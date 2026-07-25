'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';

/**
 * Post editor — /admin/editor
 * Uses the same admin key as comment moderation (COMMENTS_ADMIN_KEY).
 * Saves commit markdown files to GitHub; Vercel rebuilds automatically,
 * so changes appear on the site ~a minute after publishing.
 */
const emptyPost = () => ({
  title: '',
  slug: '',
  excerpt: '',
  categories: '',
  featuredImage: '',
  hideFeaturedImage: false,
  date: '',
  body: '',
  sha: null,
  draft: true,
  isNew: true,
});

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function EditorPage() {
  const [key, setKey] = useState('');
  const [entered, setEntered] = useState(false);
  const [posts, setPosts] = useState([]);
  const [ghReady, setGhReady] = useState(true);
  const [post, setPost] = useState(emptyPost());
  const [tab, setTab] = useState('write'); // write | preview
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [filter, setFilter] = useState('');

  const auth = useMemo(() => ({ Authorization: `Bearer ${key}` }), [key]);

  useEffect(() => {
    const saved = window.localStorage.getItem('jw-admin-key');
    if (saved) {
      setKey(saved);
      setEntered(true);
    }
  }, []);

  const loadList = useCallback(
    async (k) => {
      const res = await fetch('/api/editor/posts', { headers: { Authorization: `Bearer ${k}` } });
      if (res.status === 401) {
        setEntered(false);
        window.localStorage.removeItem('jw-admin-key');
        return;
      }
      const out = await res.json();
      setPosts(out.posts || []);
      setGhReady(out.githubConfigured);
    },
    []
  );

  useEffect(() => {
    if (entered && key) loadList(key);
  }, [entered, key, loadList]);

  async function openPost(slug) {
    setBusy(true);
    setStatus('Loading…');
    const res = await fetch(`/api/editor/post?slug=${encodeURIComponent(slug)}`, { headers: auth });
    const out = await res.json();
    setBusy(false);
    if (!res.ok) {
      setStatus(out.error || 'Failed to load');
      return;
    }
    const f = out.frontmatter || {};
    setPost({
      title: f.title || '',
      slug: f.slug || slug,
      excerpt: f.excerpt || '',
      categories: (f.categories || []).join(', '),
      featuredImage: f.featuredImage || '',
      hideFeaturedImage: !!f.hideFeaturedImage,
      date: f.date || '',
      body: out.body || '',
      sha: out.sha,
      draft: !!f.draft,
      format: f.format,
      isNew: false,
    });
    setTab('write');
    setStatus('');
  }

  async function save(draft) {
    if (!post.title.trim()) {
      setStatus('Give it a title first.');
      return;
    }
    setBusy(true);
    setStatus(draft ? 'Saving draft…' : 'Publishing…');
    const res = await fetch('/api/editor/post', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({
        title: post.title,
        slug: post.slug || kebab(post.title),
        excerpt: post.excerpt,
        categories: post.categories,
        featuredImage: post.featuredImage,
        hideFeaturedImage: post.hideFeaturedImage,
        date: post.date || undefined,
        body: post.body,
        sha: post.sha,
        draft,
        format: post.format || 'markdown',
      }),
    });
    const out = await res.json();
    setBusy(false);
    if (!res.ok) {
      setStatus(`Error: ${out.error}`);
      return;
    }
    setPost((p) => ({ ...p, sha: out.sha, draft, isNew: false, slug: p.slug || kebab(p.title) }));
    setStatus(
      draft
        ? 'Draft saved to the repo.'
        : 'Published! The site rebuilds automatically — live in about a minute.'
    );
    loadList(key);
  }

  async function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Drop an image file.');
      return;
    }
    setBusy(true);
    setStatus('Uploading image…');
    const data = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1]);
      r.readAsDataURL(file);
    });
    const res = await fetch('/api/editor/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ filename: file.name, data }),
    });
    const out = await res.json();
    setBusy(false);
    if (!res.ok) {
      setStatus(`Upload error: ${out.error}`);
      return;
    }
    setPost((p) => ({ ...p, featuredImage: out.path }));
    setStatus('Image uploaded. It appears on the site after the next publish/deploy.');
  }

  if (!entered) {
    return (
      <div className="narrow" style={{ padding: '60px 24px' }}>
        <h1>Post editor</h1>
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
      </div>
    );
  }

  const visiblePosts = posts.filter(
    (p) => !filter || p.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="editor-shell">
      <aside className="editor-side">
        <button
          className="button button-solid"
          style={{ width: '100%', marginBottom: 12 }}
          onClick={() => {
            setPost(emptyPost());
            setTab('write');
            setStatus('');
          }}
        >
          + New Post
        </button>
        <input
          className="editor-filter"
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="editor-list">
          {visiblePosts.map((p) => (
            <button
              key={p.slug}
              className={`editor-item${post.slug === p.slug ? ' active' : ''}`}
              onClick={() => openPost(p.slug)}
            >
              {p.title}
              {p.draft && <span className="draft-tag"> · draft</span>}
              {p.pending && <span className="draft-tag"> · deploying</span>}
            </button>
          ))}
        </div>
      </aside>

      <main className="editor-main">
        {!ghReady && (
          <p className="editor-warn">
            GitHub isn&rsquo;t configured yet — set GITHUB_REPO and GITHUB_TOKEN in Vercel.
            You can write, but saving will fail.
          </p>
        )}

        <div className="editor-toolbar">
          <div className="editor-tabs">
            <button className={tab === 'write' ? 'active' : ''} onClick={() => setTab('write')}>
              Write
            </button>
            <button className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>
              Preview
            </button>
          </div>
          <div className="editor-actions">
            <button className="button" disabled={busy} onClick={() => save(true)}>
              Save Draft
            </button>
            <button className="button button-solid" disabled={busy} onClick={() => save(false)}>
              Publish
            </button>
          </div>
        </div>

        {tab === 'write' ? (
          <>
            <input
              className="editor-title"
              placeholder="Post title"
              value={post.title}
              onChange={(e) =>
                setPost((p) => ({
                  ...p,
                  title: e.target.value,
                  slug: p.isNew ? kebab(e.target.value) : p.slug,
                }))
              }
            />
            <div className="editor-fields">
              <label>
                Slug
                <input
                  value={post.slug}
                  disabled={!post.isNew}
                  onChange={(e) => setPost((p) => ({ ...p, slug: kebab(e.target.value) }))}
                />
              </label>
              <label>
                Excerpt
                <input
                  placeholder="One-line teaser for the cards"
                  value={post.excerpt}
                  onChange={(e) => setPost((p) => ({ ...p, excerpt: e.target.value }))}
                />
              </label>
              <label>
                Categories
                <input
                  placeholder='Comma-separated — include "featured" for the homepage'
                  value={post.categories}
                  onChange={(e) => setPost((p) => ({ ...p, categories: e.target.value }))}
                />
              </label>
            </div>

            <div
              className={`editor-dropzone${dragging ? ' drag' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              {post.featuredImage ? (
                <>
                  <img src={post.featuredImage} alt="" />
                  <span>
                    Featured image: {post.featuredImage}
                    <button onClick={() => setPost((p) => ({ ...p, featuredImage: '' }))}>
                      remove
                    </button>
                  </span>
                </>
              ) : (
                <span>Drag &amp; drop a featured image here</span>
              )}
            </div>

            {post.featuredImage && (
              <label className="editor-checkbox">
                <input
                  type="checkbox"
                  checked={post.hideFeaturedImage}
                  onChange={(e) => setPost((p) => ({ ...p, hideFeaturedImage: e.target.checked }))}
                />
                Don&rsquo;t show the featured image at the top of the post
              </label>
            )}

            <textarea
              className="editor-body"
              placeholder={'Write in markdown…\n\n# Heading\n\nParagraphs, **bold**, *italic*, [links](https://…), images, plain HTML — all welcome.'}
              value={post.body}
              onChange={(e) => setPost((p) => ({ ...p, body: e.target.value }))}
            />
          </>
        ) : (
          <article className="prose editor-preview">
            <h1 className="page-title">{post.title || 'Untitled'}</h1>
            {post.featuredImage && !post.hideFeaturedImage && <p><img src={post.featuredImage} alt="" style={{ width: '100%' }} /></p>}
            <div
              dangerouslySetInnerHTML={{
                __html:
                  post.format && post.format !== 'markdown'
                    ? post.body
                    : marked.parse(post.body || '*Nothing here yet.*'),
              }}
            />
          </article>
        )}

        {status && <p className="editor-status">{status}</p>}
      </main>
    </div>
  );
}
