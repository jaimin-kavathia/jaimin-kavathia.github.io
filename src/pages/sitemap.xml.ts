import type { APIRoute } from 'astro';
import { appLinks } from '../data/apps';
import { hirePath } from '../data/hire';
import { packageLinks } from '../data/packages';

/** Every indexable page, stamped with the build date. */
export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const paths = ['/', hirePath, ...packageLinks.map((link) => link.path), ...appLinks.map((link) => link.path)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${new URL(path, site).href}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
