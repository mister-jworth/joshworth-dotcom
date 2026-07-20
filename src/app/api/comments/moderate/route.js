import { sql, ensureSchema, isAdmin } from '../../../../lib/commentsDb';

export const dynamic = 'force-dynamic';

/** GET — list comments for moderation (auth: Bearer COMMENTS_ADMIN_KEY).
 *  ?status=pending|approved|spam (default pending) */
export async function GET(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const status = new URL(req.url).searchParams.get('status') || 'pending';
  await ensureSchema();
  const { rows } = await sql`
    SELECT id, post_type, slug, parent_id, author, content, status, created_at
    FROM comments WHERE status = ${status}
    ORDER BY created_at DESC LIMIT 200;
  `;
  return Response.json({ comments: rows });
}

/** POST { id, action: approve | spam | pending | delete } */
export async function POST(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, action } = await req.json();
  const cid = Number(id);
  if (!cid) return Response.json({ error: 'Bad id' }, { status: 400 });
  await ensureSchema();
  if (action === 'delete') {
    await sql`DELETE FROM comments WHERE id = ${cid};`;
  } else if (['approve', 'spam', 'pending'].includes(action)) {
    const status = action === 'approve' ? 'approved' : action;
    await sql`UPDATE comments SET status = ${status} WHERE id = ${cid};`;
  } else {
    return Response.json({ error: 'Bad action' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
