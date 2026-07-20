# JoshWorth.com

The personal site of Josh Worth — migrated from WordPress/Avada (Bluehost) to a
file-based headless setup: **Next.js + markdown content, hosted on Vercel**.

## Writing a new post (browser editor)

The easiest way: **joshworth.com/admin/editor** — a browser editor with the
post list, markdown writing, live preview, drag-&-drop featured images, and
Save Draft / Publish buttons. It uses the same admin key as comment
moderation, and commits real markdown files to the GitHub repo; Vercel
rebuilds automatically (~1 min to go live).

One-time setup:

1. Push this project to a GitHub repo and connect it to the Vercel project
   (Vercel → Settings → Git). After this, every push deploys automatically.
2. Create a fine-grained personal access token at
   https://github.com/settings/personal-access-tokens — scope it to just this
   repo with **Contents: Read and write**.
3. Add env vars in Vercel: `GITHUB_REPO` (e.g. `joshworth/joshworth.com`),
   `GITHUB_TOKEN` (the PAT), optional `GITHUB_BRANCH` (default `main`).
4. If you also edit locally, run `git pull` before editing so you pick up
   posts written in the browser.

## Writing a new post (by hand)

Create a markdown file in `content/posts/`, e.g. `content/posts/my-new-post.md`:

```markdown
---
title: "My New Post"
slug: "my-new-post"
date: "2026-07-07T12:00:00Z"
excerpt: "One-line teaser shown on the cards."
featuredImage: "/uploads/2026/07/my-image.jpg"
categories:
  - "featured"    # ← include this to feature it on the homepage
  - "humor"
---

Write the post here. Plain HTML works, and so does simple markup:
paragraphs separated by blank lines, <em>emphasis</em>, <a href="...">links</a>,
<img src="/uploads/2026/07/pic.jpg" />, etc.
```

Put any images in `public/uploads/2026/07/` (or wherever) and reference them as
`/uploads/2026/07/...`. Push to git (or run `vercel deploy`) and the site
rebuilds automatically.

Same idea for portfolio pieces in `content/projects/` (use
`projectCategories: ["feature"]` to show on the homepage).

## Directory map

- `content/posts/` — 145 posts (13 drafts marked `draft: true`)
- `content/projects/` — 122 portfolio items
- `content/pages/` — original WordPress pages (reference; About/Contact/Clients render from here or native routes)
- `content/comments/` — 783 migrated comments, shown read-only under posts
- `public/uploads/` — all media (same paths as WordPress `wp-content/uploads`)
- `src/app/` — pages; `src/components/` — UI; `src/app/globals.css` — the whole design system
- `data/image-manifest.json` — remote→local map used by `scripts/download-images.mjs`

## One-time follow-ups

0. **Interactive projects (`/dev`) — IMPORTANT**: several posts link to
   interactive apps hosted on Bluehost *outside* WordPress
   (pixelspace/the solar-system map, wealthgap, mess, mapofdespair, geometwirl,
   stripeytime, lazereyezer, declutter, zap, 78coins, plotchart). Copy the
   entire `dev` folder from the Bluehost server (via FTP or cPanel File
   Manager) into `public/dev/` here. Links in the migrated posts already point
   to `/dev/...`, so they'll work as soon as the folder is in place.
1. **Images**: `npm run download-images` pulls every image from the old host
   into `public/uploads/` (it also runs automatically before each build).
   Run it once locally and commit `public/uploads` to git **before shutting
   down Bluehost**, so the site owns its media forever.
2. **Fonts**: the site uses your Hoefler cloud.typography CSS key. Add the
   Vercel domain(s) in your cloud.typography dashboard so Surveyor/Gotham/
   Idlewild load on the new site. Until then it falls back to Source Serif 4 +
   Montserrat.
3. **New comments (built-in system)**: anonymous commenting with moderation.
   Setup: in Vercel → project → **Storage → Create Database → Postgres (Neon)**
   and connect it (adds `POSTGRES_URL` automatically). Then add env var
   `COMMENTS_ADMIN_KEY` (any long random string) and redeploy.
   - Moderate at **`/admin/comments`** (enter the key once per browser).
   - Spam defenses: honeypot field, 4-second time-trap token, max 3 links,
     5 comments/hour per IP, and nothing publishes without your approval.
   - The old Giscus component (`src/components/Giscus.jsx`) is unused and can
     be deleted along with its env vars.
4. **Contact form**: see instructions at the top of `src/components/ContactForm.jsx`.
5. **Domain**: point joshworth.com at Vercel (Project → Settings → Domains).
   All old URL shapes (`/jpw/...`, `/portfolio-items/...`, date permalinks)
   301-redirect to the new structure — see `next.config.mjs`.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```
