import { notFound } from 'next/navigation';
import {
  getProject,
  getProjects,
  splitDynamic,
  projectsByCategory,
  postsByCategory,
  getPosts,
} from '../../../lib/content';
import { ProjectGrid, PostGrid } from '../../../components/Cards';
import Comments from '../../../components/Comments';
import Lightbox from '../../../components/Lightbox';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt || undefined,
    openGraph: p.featuredImage ? { images: [p.featuredImage] } : undefined,
  };
}

function DynamicWidget({ widget, cat }) {
  const cats = (cat || '').split(',').filter(Boolean);
  if (widget === 'fusion_portfolio') {
    let items = cats.length
      ? [...new Map(cats.flatMap((c) => projectsByCategory(c)).map((p) => [p.slug, p])).values()]
      : getProjects();
    return <ProjectGrid projects={items} cols={3} mini />;
  }
  if (widget === 'fusion_blog') {
    const posts = cats.length
      ? [...new Map(cats.flatMap((c) => postsByCategory(c)).map((p) => [p.slug, p])).values()]
      : getPosts();
    return <PostGrid posts={posts} cols={3} />;
  }
  return null;
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.draft) notFound();
  const segments = splitDynamic(project.body);
  return (
    <>
      <article className="prose container">
        <h1 className="page-title">{project.title}</h1>
        {project.excerpt && <p className="page-meta">{project.excerpt}</p>}
        {segments.map((seg, i) =>
          seg.html ? (
            <div key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />
          ) : (
            <DynamicWidget key={i} widget={seg.widget} cat={seg.cat} />
          )
        )}
      </article>
      <Comments type="projects" slug={project.slug} />
      <Lightbox />
    </>
  );
}
