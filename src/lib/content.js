import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT = path.join(process.cwd(), 'content');

function loadDir(dir) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), 'utf8'));
      let body = content.trim();
      // Posts written in the browser editor are plain markdown; migrated
      // WordPress posts are already HTML and skip this.
      if (data.format === 'markdown') {
        body = marked.parse(body);
      }
      return { ...data, body };
    });
}

let _posts, _projects, _pages;

export function getPosts({ includeDrafts = false } = {}) {
  _posts ||= loadDir('posts').sort((a, b) => (a.date < b.date ? 1 : -1));
  return includeDrafts ? _posts : _posts.filter((p) => !p.draft);
}

export function getProjects({ includeDrafts = false } = {}) {
  _projects ||= loadDir('projects');
  return includeDrafts ? _projects : _projects.filter((p) => !p.draft);
}

export function getPages() {
  _pages ||= loadDir('pages');
  return _pages;
}

export function getPost(slug) {
  return getPosts({ includeDrafts: true }).find((p) => p.slug === slug);
}

export function getProject(slug) {
  return getProjects({ includeDrafts: true }).find((p) => p.slug === slug);
}

export function getPage(slug) {
  return getPages().find((p) => p.slug === slug);
}

export function postsByCategory(cat) {
  return getPosts().filter((p) => (p.categories || []).includes(cat));
}

export function projectsByCategory(cat) {
  return getProjects().filter((p) => (p.projectCategories || []).includes(cat));
}

export function getComments(type, slug) {
  const f = path.join(CONTENT, 'comments', `${type}--${slug}.json`);
  if (!fs.existsSync(f)) return [];
  const flat = JSON.parse(fs.readFileSync(f, 'utf8'));
  // thread: top-level comments with nested replies
  const byId = new Map(flat.map((c) => [c.id, { ...c, replies: [] }]));
  const roots = [];
  for (const c of byId.values()) {
    if (c.parent !== '0' && byId.has(c.parent)) byId.get(c.parent).replies.push(c);
    else roots.push(c);
  }
  return roots;
}

export function commentCount(type, slug) {
  const f = path.join(CONTENT, 'comments', `${type}--${slug}.json`);
  if (!fs.existsSync(f)) return 0;
  return JSON.parse(fs.readFileSync(f, 'utf8')).length;
}

/**
 * Bodies converted from WordPress may contain dynamic listing markers left by
 * Avada widgets, e.g. <!-- dynamic:fusion_portfolio cat=collage -->.
 * splitDynamic() breaks a body into segments so pages can interleave native
 * components where the widgets used to be.
 */
export function splitDynamic(body) {
  const re = /<!-- dynamic:(\w+) cat=([\w,-]*) -->/g;
  const segments = [];
  let last = 0, m;
  while ((m = re.exec(body))) {
    if (m.index > last) segments.push({ html: body.slice(last, m.index) });
    segments.push({ widget: m[1], cat: m[2] });
    last = re.lastIndex;
  }
  if (last < body.length) segments.push({ html: body.slice(last) });
  return segments;
}

export function prettyCategory(slug) {
  const special = { thefuture: 'The Future', 'f-a-q-s': 'FAQs' };
  if (special[slug]) return special[slug];
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function allPostCategories() {
  const s = new Set();
  for (const p of getPosts()) for (const c of p.categories || []) s.add(c);
  return [...s];
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
