import {
  sql,
  ensureSchema,
  signTimestamp,
  verifyToken,
  hashIp,
  dbDiagnostics,
} from '../../../lib/commentsDb';

export const dynamic = 'force-dynamic';

const MAX_CONTENT = 5000;
const MAX_NAME = 80;
const MAX_LINKS = 3;
const MAX_PER_HOUR = 5;

/** GET /api/comments?type=posts&slug=my-post
 *  Returns approved comments plus a signed timestamp token for the form. */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');
  const ts = Date.now();
  const token = signTimestamp(ts);
  if (!type || !slug) {
    return Response.json({ comments: [], ts, token });
  }
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT id, parent_id, author, content, created_at FROM comments
      WHERE post_type = ${type} AND slug = ${slug} AND status = 'approved'
      ORDER BY created_at ASC LIMIT 500;
    `;
    return Response.json({ comments: rows, ts, token });
  } catch {
    // DB not provisioned yet — the form still renders; posting will error clearly
    return Response.json({ comments: [], ts, token });
  }
}

/** POST /api/comments — submit a comment (lands in the moderation queue). */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  const { type, slug, author, content, parentId, ts, token, website } = body || {};

  // Honeypot: the hidden "website" field must stay empty (humans never see it).
  if (website) return Response.json({ ok: true }); // pretend success to the bot

  // Time-trap: signed server timestamp, at least 4 seconds old.
  const tokenErr = verifyToken(ts, token);
  if (tokenErr) return Response.json({ error: 'Please try again.' }, { status: 400 });

  if (!type || !slug || !author?.trim() || !content?.trim()) {
    return Response.json({ error: 'Name and comment are required.' }, { status: 400 });
  }
  if (author.length > MAX_NAME || content.length > MAX_CONTENT) {
    return Response.json({ error: 'Comment is too long.' }, { status: 400 });
  }
  const links = (content.match(/https?:\/\//gi) || []).length;
  if (links > MAX_LINKS) {
    return Response.json({ error: `No more than ${MAX_LINKS} links, please.` }, { status: 400 });
  }

  try {
    await ensureSchema();
    const ip = hashIp(req);

    // Rate limit per IP.
    const { rows: recent } = await sql`
      SELECT count(*)::int AS n FROM comments
      WHERE ip_hash = ${ip} AND created_at > now() - interval '1 hour';
    `;
    if (recent[0].n >= MAX_PER_HOUR) {
      return Response.json({ error: 'Too many comments — try again later.' }, { status: 429 });
    }

    const parent = Number(parentId) || null;
    await sql`
      INSERT INTO comments (post_type, slug, parent_id, author, content, ip_hash)
      VALUES (${type}, ${slug}, ${parent}, ${author.trim().slice(0, MAX_NAME)},
              ${content.trim().slice(0, MAX_CONTENT)}, ${ip});
    `;
    return Response.json({ ok: true });
  } catch (e) {
    console.error('comments db error:', e?.code || '', e?.message, '|', dbDiagnostics());
    return Response.json(
      { error: 'Comments are not set up yet (database missing).' },
      { status: 500 }
    );
  }
}
