import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="narrow center" style={{ padding: '80px 24px' }}>
      <h1>Lost in space</h1>
      <p>
        This page drifted off somewhere between the Earth and the Moon.
        <br />
        (And that&rsquo;s a <Link href="/projects/if-the-moon-were-only-1-pixel">tediously long way</Link>.)
      </p>
      <p>
        <Link className="button" href="/">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
