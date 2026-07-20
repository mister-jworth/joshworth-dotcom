import { getComments } from '../lib/content';
import CommentSection from './CommentSection';

export default function Comments({ type, slug }) {
  const migrated = getComments(type, slug);
  return (
    <section className="comments narrow">
      <CommentSection type={type} slug={slug} migrated={migrated} />
    </section>
  );
}
