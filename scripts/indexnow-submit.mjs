// Submits every URL in public/sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver —
// Google does not consume this protocol). Run after pushing/deploying, never before:
// the key file below must already be live at KEY_LOCATION or search engines reject the ping.
import { readFileSync } from 'node:fs';

const HOST = 'www.drnicosierra.com';
const KEY = '61c62153f914cb922f3af73dbf5592bf';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf-8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  throw new Error('No URLs found in public/sitemap.xml — aborting.');
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
