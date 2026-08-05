// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver —
// Google does not consume this protocol). Run after pushing/deploying, never before:
// the key file must already be live at KEY_LOCATION, and this reads the *deployed*
// sitemap.xml (not a local file) so it only ever submits what's actually live —
// sitemap.xml is generated fresh at build time by scripts/generate-sitemap.mjs.
const HOST = 'www.drnicosierra.com';
const KEY = '61c62153f914cb922f3af73dbf5592bf';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

const sitemapRes = await fetch(SITEMAP_URL);
if (!sitemapRes.ok) throw new Error(`Could not fetch ${SITEMAP_URL} — ${sitemapRes.status} ${sitemapRes.statusText}`);
const sitemap = await sitemapRes.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  throw new Error(`No URLs found in ${SITEMAP_URL} — aborting.`);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs — ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}
