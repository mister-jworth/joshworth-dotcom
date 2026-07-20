import { sql, ensureSchema } from '../../../../lib/commentsDb';

export const dynamic = 'force-dynamic';

/** GET /api/comments/counts → { posts: {slug: n}, projects: {slug: n} } */
export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT post_type, slug, count(*)::int AS n FROM comments
      WHERE status = 'approved' GROUP BY post_type, slug;
    `;
    const out = { posts: {}, projects: {} };
    for (const r of rows) {
      (out[r.post_type] ||= {})[r.slug] = r.n;
    }
    return Response.json(out, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return Response.json({ posts: {}, projects: {} });
  }
}
