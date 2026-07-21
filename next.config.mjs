import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // public/dev contains old interactive apps with their own package.json files;
  // pin the workspace root so the bundler doesn't get confused by them.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // Preserve old WordPress URL structure with permanent redirects
  async redirects() {
    return [
      { source: '/jpw', destination: '/', permanent: true },
      { source: '/jpw/posts', destination: '/posts', permanent: true },
      { source: '/jpw/posts-2', destination: '/posts', permanent: true },
      { source: '/jpw/blog', destination: '/posts', permanent: true },
      { source: '/jpw/projects', destination: '/projects', permanent: true },
      { source: '/jpw/projects2', destination: '/projects', permanent: true },
      { source: '/jpw/about', destination: '/about', permanent: true },
      { source: '/jpw/contact-2', destination: '/contact', permanent: true },
      { source: '/jpw/clientlist', destination: '/clients', permanent: true },
      { source: '/jpw/portfolio-items/:slug', destination: '/projects/:slug', permanent: true },
      { source: '/jpw/wp-content/uploads/:path*', destination: '/uploads/:path*', permanent: true },
      { source: '/jpw/:slug', destination: '/posts/:slug', permanent: true },
      // pre-2019 permalinks (site lived at the domain root before /jpw)
      { source: '/portfolio-items/:slug', destination: '/projects/:slug', permanent: true },
      // very old date-based permalinks
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
      {
        source: '/jpw/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
    ];
  },
  // public/dev/<project>/ sketches are static index.html files, but Next's
  // public-folder serving matches exact paths only — it won't resolve a
  // directory URL to that directory's index.html the way a plain static
  // host does. This runs only when no real file/page matched the path.
  async rewrites() {
    return [
      { source: '/dev/:project', destination: '/dev/:project/index.html' },
    ];
  },
};

export default nextConfig;
