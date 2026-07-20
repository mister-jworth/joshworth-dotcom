import { getPosts } from '../../../../lib/content';
import { isAdmin } from '../../../../lib/commentsDb';
import { githubConfigured, listDir } from '../../../../lib/github';

export const dynamic = 'force-dynamic';

/** GET — posts for the editor sidebar: the deployed list (titles) merged with
 *  the repo directory listing, so just-committed posts appear immediately
 *  even before the rebuild finishes. */
export async function GET(req) {
  if (!isAdmin(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const deployed = getPosts({ includeDrafts: true }).map((p) => ({
    title: p.title,
    slug: p.slug,
    draft: !!p.draft,
    date: p.date,
  }));
  const known = new Set(deployed.map((p) => p.slug));

  let pendingDeploy = [];
  if (githubConfigured()) {
    try {
      const files = await listDir('content/posts');
      pendingDeploy = files
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''))
        .filter((slug) => !known.has(slug))
        .map((slug) => ({
          title: slug.replace(/-/g, ' '),
          slug,
          draft: true,
          date: new Date().toISOString(),
          pending: true, // committed but not in a finished deployment yet
        }));
    } catch {
      // repo unreachable — deployed list is still fine
    }
  }

  const posts = [...pendingDeploy, ...deployed].sort((a, b) => (a.date < b.date ? 1 : -1));
  return Response.json({ posts, githubConfigured: githubConfigured() });
}
