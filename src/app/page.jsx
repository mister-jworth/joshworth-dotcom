import Link from 'next/link';
import { postsByCategory, projectsByCategory } from '../lib/content';
import { PostGrid, ProjectGrid } from '../components/Cards';
import Hero from '../components/Hero';

export default function Home() {
  const featuredPosts = postsByCategory('featured').slice(0, 12);
  const featuredProjects = projectsByCategory('feature').slice(0, 12);
  const moreStuff = projectsByCategory('group');

  return (
    <>
      <Hero />

      <div className="band">
        <div className="container">
          <h5 className="section-label">
            <Link href="/posts">Posts</Link>
          </h5>
          <PostGrid posts={featuredPosts} cols={3} />
          <Link className="more-link" href="/posts/more">
            More Posts
          </Link>
        </div>
      </div>

      <div className="container">
        <h5 className="section-label">
          <Link href="/projects">Projects</Link>
        </h5>
        <ProjectGrid projects={featuredProjects} cols={2} />
        <Link className="more-link" href="/projects">
          More Projects
        </Link>
      </div>

      <div className="band" style={{ marginTop: '3em' }}>
        <div className="container">
          <h5 className="section-label">More Stuff</h5>
          <ProjectGrid projects={moreStuff} cols={5} mini />
        </div>
      </div>
    </>
  );
}
