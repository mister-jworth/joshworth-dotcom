import { getPosts } from '../../lib/content';
import { PostGrid } from '../../components/Cards';

export const metadata = { title: 'Posts' };

export default function PostsPage() {
  const posts = getPosts();
  return (
    <div className="container">
      <h1 className="page-title">Posts</h1>
      <p className="page-meta">
        {posts.length} dispatches from the world of design, art and ideas
      </p>
      <PostGrid posts={posts} cols={3} />
    </div>
  );
}
