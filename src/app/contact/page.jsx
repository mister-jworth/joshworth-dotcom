import ContactForm from '../../components/ContactForm';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="narrow">
      <h1 className="page-title">Contact</h1>
      <article className="prose">
        <p>
          I&rsquo;m always happy to discuss new projects and provide some free creative
          consultation. Drop me a line using the form below and I&rsquo;ll do my best to get back
          to you in a timely manner.
        </p>
        <ContactForm />
      </article>
    </div>
  );
}
