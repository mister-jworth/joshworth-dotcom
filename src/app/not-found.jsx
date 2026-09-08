import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="narrow center" style={{ padding: '80px 24px' }}>
      <h1>You are lost</h1>
      <p>
        The page is not here.
      </p>
      <p>
        <Link className="button" href="/">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
