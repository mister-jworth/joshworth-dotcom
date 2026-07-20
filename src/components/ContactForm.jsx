'use client';
import { useState } from 'react';

/**
 * Contact form. The old site used Contact Form 7 + reCAPTCHA, which needs a
 * server. This version posts to Formspree (free tier: 50 messages/month,
 * includes spam filtering).
 *
 * SETUP (one-time, ~2 minutes):
 *   1. Create a free form at https://formspree.io (verify josh@comingle.us).
 *   2. Copy the form ID (looks like "mqkvabcd").
 *   3. In Vercel → Project → Settings → Environment Variables, set:
 *        NEXT_PUBLIC_FORMSPREE_ID = mqkvabcd
 *      then redeploy.
 *
 * Until configured, the form falls back to opening the visitor's mail app.
 */
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  async function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    if (!FORM_ID) {
      const subject = encodeURIComponent('Hello from joshworth.com');
      const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`);
      window.location.href = `mailto:josh@joshworth.com?subject=${subject}&body=${body}`;
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <p><strong>Thanks! Your message is on its way.</strong></p>;
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, maxWidth: 540 }}>
      <label>
        Your name
        <input name="name" required style={inputStyle} />
      </label>
      <label>
        Your email
        <input name="email" type="email" required style={inputStyle} />
      </label>
      <label>
        Message
        <textarea name="message" rows={7} required style={inputStyle} />
      </label>
      <button className="button button-solid" type="submit" disabled={status === 'sending'} style={{ justifySelf: 'start', cursor: 'pointer' }}>
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p style={{ color: '#b04343' }}>
          Something went wrong — you can also email me directly at josh@comingle.us
        </p>
      )}
    </form>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '10px 12px',
  border: '1px solid var(--line)',
  borderRadius: 3,
  font: 'inherit',
  color: 'inherit',
};
