import { createPool } from '@vercel/postgres';
import crypto from 'node:crypto';

// The Neon marketplace integration provides DATABASE_URL (sometimes with a
// custom prefix chosen at connect time); the old Vercel Postgres provided
// POSTGRES_URL. Find whichever pooled postgres:// URL is available.
export function connectionString() {
  const direct = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (direct) return direct;
  for (const [k, v] of Object.entries(process.env)) {
    if (
      /URL/i.test(k) &&
      /^postgres(ql)?:\/\//.test(v || '') &&
      !/UNPOOLED|NON_POOLING|NO_SSL/i.test(k)
    ) {
      return v;
    }
  }
  return undefined;
}

export function dbDiagnostics() {
  const names = Object.keys(process.env).filter((k) =>
    /POSTGRES|DATABASE|NEON|PG_|^PG|STORAGE/i.test(k)
  );
  return `db env candidates: [${names.join(', ') || 'none'}]`;
}

let pool;
export function sql(strings, ...values) {
  pool ||= createPool({ connectionString: connectionString() });
  return pool.sql(strings, ...values);
}

/**
 * Comment storage (Vercel Postgres / Neon).
 *
 * SETUP (one-time): in Vercel → your project → Storage → Create Database →
 * Postgres (Neon). Connecting it to the project auto-adds POSTGRES_URL.
 * Also add env var COMMENTS_ADMIN_KEY (any long random string) — it protects
 * the moderation page at /admin/comments. Then redeploy.
 */

let schemaReady;
export function ensureSchema() {
  schemaReady ||= sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_type TEXT NOT NULL,
      slug TEXT NOT NULL,
      parent_id INTEGER,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      ip_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `.then(() => sql`
    CREATE INDEX IF NOT EXISTS comments_lookup
    ON comments (post_type, slug, status);
  `);
  return schemaReady;
}

export function secret() {
  return (
    process.env.COMMENTS_ADMIN_KEY ||
    crypto
      .createHash('sha256')
      .update(connectionString() || 'dev')
      .digest('hex')
  );
}

export function signTimestamp(ts) {
  return crypto.createHmac('sha256', secret()).update(String(ts)).digest('hex');
}

export function verifyToken(ts, token) {
  const t = Number(ts);
  if (!t || !token) return 'missing token';
  const age = Date.now() - t;
  if (age < 4000) return 'too fast';           // form filled in under 4s → bot
  if (age > 2 * 60 * 60 * 1000) return 'expired';
  const expected = signTimestamp(t);
  const a = Buffer.from(String(token));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'bad token';
  return null;
}

export function hashIp(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return crypto.createHash('sha256').update(ip + secret()).digest('hex').slice(0, 32);
}

export function isAdmin(req) {
  const key = process.env.COMMENTS_ADMIN_KEY;
  if (!key) return false; // moderation disabled until the env var is set
  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
