import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts, prettyCategory } from '../../../lib/content';
import Comments from '../../../components/Comments';
import Lightbox from '../../../components/Lightbox';

function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}.${String(d.getUTCFullYear()).slice(2)}`;
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: post.featuredImage ? { images: [post.featuredImage] } : undefined,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) notFound();
  return (
    <>
      <article className="prose narrow">
        <h1 className="page-title">{post.title}</h1>
        {post.featuredImage && !post.hideFeaturedImage && !post.body.slice(0, 600).includes(post.featuredImage) && (
          <p>
            <img src={post.featuredImage} alt="" style={{ width: '100%' }} />
          </p>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <p className="post-endmeta">
          {shortDate(post.date)}
          {post.categories?.length > 0 && (
            <>
              {' · '}
              {post.categories.map((c, i) => (
                <span key={c}>
                  {i > 0 && ', '}
                  <Link href={`/posts/category/${c}`}>{prettyCategory(c)}</Link>
                </span>
              ))}
            </>
          )}
        </p>
      </article>
      <Comments type="posts" slug={post.slug} />
      <Lightbox />
    </>
  );
}
