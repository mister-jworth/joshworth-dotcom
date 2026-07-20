import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { isAdmin } from '../../../../lib/commentsDb';
import { getFile, putFile } from '../../../../lib/github';

export const dynamic = 'force-dynamic';

const postPath = (slug) => `content/posts/${slug}.md`;

/** GET ?slug= — load a post (from GitHub, the live source of truth). */
export async function GET(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 });

  try {
    let raw, sha = null;
    const fromGh = await getFile(postPath(slug)).catch((e) => {
      throw e;
    });
    if (fromGh) {
      raw = fromGh.text;
      sha = fromGh.sha;
    } else {
      // fall back to the file baked into this deployment
      const local = path.join(process.cwd(), 'content/posts', `${slug}.md`);
      if (!fs.existsSync(local)) return Response.json({ error: 'Not found' }, { status: 404 });
      raw = fs.readFileSync(local, 'utf8');
    }
    const { data, content } = matter(raw);
    return Response.json({ frontmatter: data, body: content.trim(), sha });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}

function yamlEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildFile({ title, slug, date, excerpt, featuredImage, categories, draft, format, body }) {
  const lines = ['---'];
  lines.push(`title: "${yamlEscape(title)}"`);
  lines.push(`slug: "${yamlEscape(slug)}"`);
  lines.push(`date: "${date}"`);
  if (excerpt) lines.push(`excerpt: "${yamlEscape(excerpt)}"`);
  if (featuredImage) lines.push(`featuredImage: "${yamlEscape(featuredImage)}"`);
  if (categories?.length) {
    lines.push('categories:');
    for (const c of categories) lines.push(`  - "${yamlEscape(c)}"`);
  }
  if (draft) lines.push('draft: true');
  if (format) lines.push(`format: "${format}"`);
  lines.push('---');
  return lines.join('\n') + '\n\n' + (body || '').trim() + '\n';
}

/** PUT — save (commit) a post. draft:true = save draft, draft:false = publish. */
export async function PUT(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  const { title, slug, excerpt, featuredImage, categories, draft, body, sha, format } = b || {};
  if (!title?.trim() || !slug?.trim()) {
    return Response.json({ error: 'Title and slug are required.' }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: 'Slug may only contain lowercase letters, numbers, and dashes.' }, { status: 400 });
  }
  const date = b.date || new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const cats = (Array.isArray(categories) ? categories : String(categories || '').split(','))
    .map((c) => c.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean);

  const file = buildFile({
    title: title.trim(),
    slug: slug.trim(),
    date,
    excerpt: excerpt?.trim(),
    featuredImage: featuredImage?.trim(),
    categories: cats,
    draft: !!draft,
    format: format || 'markdown',
    body,
  });

  try {
    // fetch current sha if the caller didn't have one (handles create-vs-update)
    let currentSha = sha;
    if (!currentSha) {
      const existing = await getFile(postPath(slug));
      currentSha = existing?.sha || undefined;
    }
    const newSha = await putFile(
      postPath(slug),
      Buffer.from(file, 'utf8'),
      `${draft ? 'Draft' : 'Publish'}: ${title.trim()} (via /admin/editor)`,
      currentSha
    );
    return Response.json({ ok: true, sha: newSha, draft: !!draft });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}
