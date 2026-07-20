import { getPosts, postsByCategory } from '../../../lib/content';
import { PostGrid } from '../../../components/Cards';

export const metadata = { title: 'More Posts' };

/** Everything that is NOT already featured on the homepage. */
export default function MorePostsPage() {
  const featured = new Set(
    postsByCategory('featured')
      .slice(0, 12)
      .map((p) => p.slug)
  );
  const posts = getPosts().filter((p) => !featured.has(p.slug));
  return (
    <div className="container">
      <h1 className="page-title">More Posts</h1>
      <p className="page-meta">The rest of the archive, beyond the homepage picks</p>
      <PostGrid posts={posts} cols={3} />
    </div>
  );
}
