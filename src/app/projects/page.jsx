import { getProjects, projectsByCategory } from '../../lib/content';
import { ProjectGrid } from '../../components/Cards';

export const metadata = { title: 'Projects' };

export default function ProjectsPage() {
  const groups = projectsByCategory('group');
  const groupSlugs = new Set(groups.map((g) => g.slug));
  // Feature the highlighted work first, then everything else (newest first),
  // leaving out the "More Stuff" group covers which get their own strip below.
  const all = getProjects()
    .filter((p) => !groupSlugs.has(p.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const featured = all.filter((p) => (p.projectCategories || []).includes('feature'));
  const rest = all.filter((p) => !(p.projectCategories || []).includes('feature'));

  return (
    <div className="container">
      <h1 className="page-title">Projects</h1>
      <p className="page-meta">Selected work — interactive, print, identity, and beyond</p>
      <ProjectGrid projects={featured} cols={2} />
      <ProjectGrid projects={rest} cols={4} mini />
      <h5 className="section-label">More Stuff</h5>
      <ProjectGrid projects={groups} cols={5} mini />
    </div>
  );
}
