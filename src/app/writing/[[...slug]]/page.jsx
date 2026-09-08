import { notFound } from 'next/navigation';
import { getWork, getWorks } from '../../../lib/content';
import WorksGallery from '../../../components/WorksGallery';

// Optional catch-all so /writing and /writing/[slug] share one component —
// the interesting bit is that they're really the same client-rendered
// gallery, just opened straight to a work when a slug is present.
export function generateStaticParams() {
  return [{ slug: [] }, ...getWorks().map((w) => ({ slug: [w.slug] }))];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const activeSlug = slug?.[0];
  if (!activeSlug) {
    return {
      title: 'Writing',
      description: 'Plays and other written work by Josh Worth.',
    };
  }
  const work = getWork(activeSlug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.synopsis || work.excerpt || undefined,
    openGraph: work.coverArt ? { images: [work.coverArt] } : undefined,
  };
}

export default async function WritingPage({ params }) {
  const { slug } = await params;
  const activeSlug = slug?.[0];
  if (activeSlug && !getWork(activeSlug)) notFound();
  const works = getWorks();
  return (
    <div className="works-page">
      <WorksGallery works={works} initialSlug={activeSlug || null} />
    </div>
  );
}
