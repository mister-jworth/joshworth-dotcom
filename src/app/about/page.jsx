import { getPage } from '../../lib/content';
import Lightbox from '../../components/Lightbox';

export const metadata = { title: 'About Me' };

export default function AboutPage() {
  const page = getPage('about');
  return (
    <>
      <article className="prose container">
        <div dangerouslySetInnerHTML={{ __html: page.body }} />
      </article>
      <Lightbox />
    </>
  );
}
