import Link from 'next/link';
import { commentCount } from '../lib/content';
import LiveCommentCount, { CommentIcon } from './LiveCommentCount';
import MasonryGrid from './MasonryGrid';

export function PostCard({ post }) {
  const base = commentCount('posts', post.slug);
  return (
    <Link className="card" href={`/posts/${post.slug}`}>
      {post.featuredImage && <img className="thumb" src={post.featuredImage} alt="" loading="lazy" />}
      <div className="card-body">
        <h3>{post.title}</h3>
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
        <p className="meta">
          <CommentIcon />
          <LiveCommentCount type="posts" slug={post.slug} base={base} />
        </p>
      </div>
    </Link>
  );
}

export function ProjectCard({ project, mini = false }) {
  return (
    <Link className={`pcard${mini ? ' mini' : ''}`} href={`/projects/${project.slug}`}>
      {project.featuredImage && <img className="thumb" src={project.featuredImage} alt="" loading="lazy" />}
      <h3>{project.title}</h3>
      {!mini && project.excerpt && <p className="excerpt">{project.excerpt}</p>}
    </Link>
  );
}

/** Masonry with newest-first row-major order (see MasonryGrid). */
export function PostGrid({ posts, cols = 3 }) {
  return (
    <MasonryGrid cols={cols}>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </MasonryGrid>
  );
}

export function ProjectGrid({ projects, cols = 2, mini = false }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} mini={mini} />
      ))}
    </div>
  );
}
