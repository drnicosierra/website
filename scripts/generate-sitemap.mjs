// Generates dist/sitemap.xml at postbuild time — replaces the old hand-maintained
// public/sitemap.xml, which went stale (frozen lastmod dates) because nothing forced
// it to be touched when content changed. See docs/PENDING.md T3 note (2026-08-05).
//
// lastmod comes from `git log` on each route's real source files — Netlify does a
// full (blobless, not shallow) clone, so commit history is available at build time.
// noindex exclusion is read directly from the built HTML's <meta name="robots"> tag,
// not a second hand-maintained list — this is what would have caught the Vidas
// Transformadas hub page silently missing its noindex-driven sitemap exclusion.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://www.drnicosierra.com';
const DIST = new URL('../dist', import.meta.url).pathname;

// changefreq/priority are editorial calls (SEO strategy), not derivable from the
// filesystem — keep them explicit here. sourceFiles drive the lastmod date only.
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0', sourceFiles: ['src/pages/index.astro', 'src/content/homepage/main.json'] },
  { path: '/como-te-ayudamos/', changefreq: 'monthly', priority: '0.7', sourceFiles: ['src/pages/como-te-ayudamos.astro'] },
  { path: '/cirugia-labio-fisurado/', changefreq: 'monthly', priority: '0.9', sourceFiles: ['src/pages/cirugia-labio-fisurado.astro', 'src/content/services/cirugia-labio-fisurado.json'] },
  { path: '/cirugia-paladar-hendido/', changefreq: 'monthly', priority: '0.9', sourceFiles: ['src/pages/cirugia-paladar-hendido.astro', 'src/content/services/cirugia-paladar-hendido.json'] },
  { path: '/cirugia-revision-fisura/', changefreq: 'monthly', priority: '0.9', sourceFiles: ['src/pages/cirugia-revision-fisura.astro', 'src/content/services/cirugia-revision-fisura.json'] },
  { path: '/ortopedia-prequirurgica-nam/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/ortopedia-prequirurgica-nam.astro', 'src/content/services/ortopedia-prequirurgica-nam.json'] },
  { path: '/injerto-oseo-alveolar/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/injerto-oseo-alveolar.astro', 'src/content/services/injerto-oseo-alveolar.json'] },
  { path: '/cirugia-ortognatica-flp/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/cirugia-ortognatica-flp.astro', 'src/content/services/cirugia-ortognatica-flp.json'] },
  { path: '/rinoplastia-flp/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/rinoplastia-flp.astro', 'src/content/services/rinoplastia-flp.json'] },
  { path: '/otros-procedimientos/', changefreq: 'monthly', priority: '0.7', sourceFiles: ['src/pages/otros-procedimientos.astro', 'src/content/services/otros-procedimientos.json'] },
  { path: '/sobre-dr-nico-sierra/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/sobre-dr-nico-sierra.astro', 'src/content/about/main.json'] },
  { path: '/vidas-transformadas/', changefreq: 'monthly', priority: '0.7', sourceFiles: ['src/pages/vidas-transformadas.astro'] },
  { path: '/tu-camino-con-nosotros/', changefreq: 'monthly', priority: '0.6', sourceFiles: ['src/pages/tu-camino-con-nosotros.astro', 'src/content/camino/main.json'] },
  { path: '/cuentanos-tu-historia/', changefreq: 'monthly', priority: '0.8', sourceFiles: ['src/pages/cuentanos-tu-historia.astro'] },
  { path: '/blog-y-articulos/', changefreq: 'weekly', priority: '0.6', sourceFiles: ['src/pages/blog-y-articulos.astro'] },
  { path: '/politica-de-privacidad/', changefreq: 'yearly', priority: '0.3', sourceFiles: ['src/pages/politica-de-privacidad.astro'] },
];

function lastmodFor(sourceFiles) {
  const date = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', ...sourceFiles], {
    cwd: new URL('..', import.meta.url).pathname,
    encoding: 'utf-8',
  }).trim();
  if (!date) throw new Error(`No git history found for: ${sourceFiles.join(', ')}`);
  return date;
}

function isNoindexed(routePath) {
  const htmlPath = join(DIST, routePath, 'index.html');
  if (!existsSync(htmlPath)) throw new Error(`Configured route has no build output: ${routePath} (expected ${htmlPath})`);
  const html = readFileSync(htmlPath, 'utf-8');
  return /<meta\s+name="robots"\s+content="noindex/i.test(html);
}

const entries = [];
for (const route of ROUTES) {
  if (isNoindexed(route.path)) {
    console.log(`sitemap: skipping ${route.path} (noindex)`);
    continue;
  }
  entries.push({ ...route, lastmod: lastmodFor(route.sourceFiles) });
}

// Flag pages that exist in dist/, aren't noindexed, but aren't in ROUTES at all —
// likely a new indexable page that shipped without being added here. Pages that
// are legitimately noindexed (gracias/, nested case pages) are expected to be
// absent from ROUTES, so those are skipped silently. Doesn't fail the build.
const configuredPaths = new Set(ROUTES.map((r) => r.path));
const knownNonPageDirs = new Set(['_astro']);
for (const entry of readdirSync(DIST, { withFileTypes: true })) {
  if (!entry.isDirectory() || knownNonPageDirs.has(entry.name)) continue;
  const routePath = `/${entry.name}/`;
  if (!existsSync(join(DIST, entry.name, 'index.html')) || configuredPaths.has(routePath)) continue;
  if (!isNoindexed(routePath)) {
    console.log(`sitemap: WARNING — ${routePath} exists in dist/, is indexable, but isn't in scripts/generate-sitemap.mjs ROUTES`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${SITE}${e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap: wrote ${entries.length} URLs to dist/sitemap.xml`);
