import { notFound } from 'next/navigation';
import { postsByCategory, allPostCategories, prettyCategory } from '../../../../lib/content';
import { PostGrid } from '../../../../components/Cards';

export function generateStaticParams() {
  return allPostCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  return { title: `${prettyCategory(category)} – Posts` };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const posts = postsByCategory(category);
  if (posts.length === 0) notFound();
  return (
    <div className="container">
      <h1 className="page-title">{prettyCategory(category)}</h1>
      <p className="page-meta">
        {posts.length} post{posts.length === 1 ? '' : 's'}
      </p>
      <PostGrid posts={posts} cols={3} />
    </div>
  );
}
