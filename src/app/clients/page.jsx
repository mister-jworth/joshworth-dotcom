import { getPage } from '../../lib/content';
import Lightbox from '../../components/Lightbox';

export const metadata = { title: 'Client List' };

export default function ClientsPage() {
  const page = getPage('clientlist');
  return (
    <>
      <article className="prose container">
        <h1 className="page-title">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.body }} />
      </article>
      <Lightbox />
    </>
  );
}
