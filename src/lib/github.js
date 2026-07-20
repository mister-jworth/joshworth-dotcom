/**
 * Minimal GitHub Contents API client for the post editor.
 *
 * Required env vars (Vercel → Settings → Environment Variables):
 *   GITHUB_REPO    e.g. "joshworth/joshworth.com"
 *   GITHUB_TOKEN   fine-grained personal access token with
 *                  "Contents: Read and write" permission on that repo
 *   GITHUB_BRANCH  optional, defaults to "main"
 */
const API = 'https://api.github.com';

function cfg() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!repo || !token) return null;
  return { repo, token, branch };
}

export function githubConfigured() {
  return !!cfg();
}

async function gh(path, init = {}) {
  const c = cfg();
  if (!c) throw new Error('GitHub is not configured (set GITHUB_REPO and GITHUB_TOKEN).');
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
  return res;
}

/** Fetch a file. Returns { text, sha } or null if it doesn't exist. */
export async function getFile(path) {
  const c = cfg();
  const res = await gh(`/repos/${c.repo}/contents/${encodeURI(path)}?ref=${c.branch}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const data = await res.json();
  const text = Buffer.from(data.content, 'base64').toString('utf8');
  return { text, sha: data.sha };
}

/** List filenames in a directory. Returns [] if the directory doesn't exist. */
export async function listDir(path) {
  const c = cfg();
  const res = await gh(`/repos/${c.repo}/contents/${encodeURI(path)}?ref=${c.branch}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data.map((f) => f.name) : [];
}

/** Create or update a file. contentBuffer is a Buffer. Returns new sha. */
export async function putFile(path, contentBuffer, message, sha) {
  const c = cfg();
  const res = await gh(`/repos/${c.repo}/contents/${encodeURI(path)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      branch: c.branch,
      content: contentBuffer.toString('base64'),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content.sha;
}
