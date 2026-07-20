import { getPosts, getProjects } from '../../lib/content';
import { PostGrid, ProjectGrid } from '../../components/Cards';

export const metadata = { title: 'Search' };

function strip(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').toLowerCase();
}

function matches(item, q) {
  const inTitle = item.title?.toLowerCase().includes(q);
  const inExcerpt = item.excerpt?.toLowerCase().includes(q);
  const inBody = strip(item.body).includes(q);
  const inCats = [...(item.categories || []), ...(item.projectCategories || [])]
    .join(' ')
    .toLowerCase()
    .includes(q);
  if (inTitle) return 3;
  if (inExcerpt || inCats) return 2;
  if (inBody) return 1;
  return 0;
}

export default async function SearchPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase();

  let posts = [];
  let projects = [];
  if (query) {
    posts = getPosts()
      .map((p) => ({ p, score: matches(p, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
    projects = getProjects()
      .map((p) => ({ p, score: matches(p, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }

  const total = posts.length + projects.length;

  return (
    <div className="container">
      <h1 className="page-title">Search</h1>
      <p className="page-meta">
        {query
          ? `${total} result${total === 1 ? '' : 's'} for “${q.trim()}”`
          : 'Type something in the search box to explore the site.'}
      </p>
      {posts.length > 0 && (
        <>
          <h5 className="section-label">Posts</h5>
          <PostGrid posts={posts} cols={3} />
        </>
      )}
      {projects.length > 0 && (
        <>
          <h5 className="section-label">Projects</h5>
          <ProjectGrid projects={projects} cols={4} mini />
        </>
      )}
      {query && total === 0 && (
        <p className="center" style={{ marginBottom: '4em' }}>
          Nothing turned up. The thing you seek may be out beyond Pluto somewhere.
        </p>
      )}
    </div>
  );
}
