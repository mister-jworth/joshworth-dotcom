import { isAdmin } from '../../../../lib/commentsDb';
import { putFile } from '../../../../lib/github';

export const dynamic = 'force-dynamic';

/** POST { filename, data } — data is base64. Commits the image to
 *  public/uploads/YYYY/MM/ and returns its site path. Keep files < 3 MB. */
export async function POST(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  const { filename, data } = b || {};
  if (!filename || !data) return Response.json({ error: 'Missing file' }, { status: 400 });

  const clean = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!/\.(jpe?g|png|gif|webp|svg)$/.test(clean)) {
    return Response.json({ error: 'Images only (jpg, png, gif, webp, svg).' }, { status: 400 });
  }
  const buf = Buffer.from(data, 'base64');
  if (buf.length > 3.5 * 1024 * 1024) {
    return Response.json({ error: 'Image too large — keep it under 3 MB.' }, { status: 400 });
  }

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const rel = `uploads/${yyyy}/${mm}/${clean}`;

  try {
    await putFile(`public/${rel}`, buf, `Upload image: ${clean} (via /admin/editor)`);
    return Response.json({ ok: true, path: `/${rel}` });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}
