#!/usr/bin/env node
/**
 * Performance-regression guard.
 *
 * Checks the actual built dist/ output (not source) for known regression
 * signatures that only become visible after a build — things the design-
 * system guard can't see because they're about compiled output, not source
 * patterns. Each check here corresponds to a real regression that shipped
 * to production at least once during the July 2026 performance work and
 * had to be found via a live PageSpeed test.
 *
 * Run manually:  npm run check:perf
 * Runs automatically after every `npm run build` (see package.json postbuild).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = 'dist';
const ASTRO_DIR = join(DIST_DIR, '_astro');

// Total JS shipped to the browser across the whole build, in KB. This is a
// budget, not a hard science — if a real feature genuinely needs to raise
// it, raise it deliberately and note why, don't just delete the check.
const MAX_TOTAL_JS_KB = 400;

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(path));
    else if (entry.name.endsWith('.html')) results.push(path);
  }
  return results;
}

function main() {
  const errors = [];
  const warnings = [];

  let htmlFiles;
  try {
    htmlFiles = findHtmlFiles(DIST_DIR);
  } catch {
    errors.push(`${DIST_DIR}/ not found — run "astro build" before this check.`);
    report(errors, warnings);
    return;
  }

  // 1. No Astro-hoisted scripts. This project deliberately marks every real
  // inline script `is:inline` so it stays inline instead of becoming a
  // separate bundled network request. If a hoisted.*.js file exists at all,
  // something lost its is:inline attribute — see check-design-system.mjs
  // for the source-level version of this same check, which should normally
  // catch this first. This is the safety net in case that check is ever
  // bypassed or a hoisted file slips in some other way.
  let astroFiles = [];
  try {
    astroFiles = readdirSync(ASTRO_DIR);
  } catch { /* no _astro dir is fine, e.g. nothing was built yet */ }
  const hoistedFiles = astroFiles.filter((f) => f.startsWith('hoisted'));
  if (hoistedFiles.length) {
    errors.push(
      `Found ${hoistedFiles.length} Astro-hoisted script file(s) in dist/_astro/ ` +
      `(${hoistedFiles.join(', ')}). This means a <script> tag somewhere lost its ` +
      `is:inline attribute and Astro auto-bundled it into a new render-blocking ` +
      `request. Find the offending tag with: grep -rn "<script" src/pages src/layouts ` +
      `src/components | grep -v "is:inline" | grep -v "src="`
    );
  }

  // 2. No external Google Fonts requests. Fonts are self-hosted via
  // @fontsource specifically to avoid an external CDN round-trip.
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8');
    if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
      errors.push(
        `${file} — references fonts.googleapis.com or fonts.gstatic.com. ` +
        `Fonts should be self-hosted via @fontsource, not loaded from Google's CDN ` +
        `(this was a real ~750ms regression fixed earlier — don't reintroduce it).`
      );
    }
  }

  // 3. No external <link rel="stylesheet"> tags. build.inlineStylesheets:
  // 'always' in astro.config.mjs should mean every page's CSS is inlined
  // directly into the HTML, not linked as a separate render-blocking request.
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8');
    if (/<link[^>]+rel=["']stylesheet["']/.test(html)) {
      warnings.push(
        `${file} — has an external <link rel="stylesheet">. If this is unexpected, ` +
        `check that build.inlineStylesheets: 'always' is still set in astro.config.mjs ` +
        `— removing it silently reintroduces render-blocking CSS on every page.`
      );
    }
  }

  // 4. Total JS budget. Not a precise science, just a tripwire so a large
  // new dependency doesn't slip in unnoticed.
  let totalJsBytes = 0;
  for (const f of astroFiles) {
    if (f.endsWith('.js')) {
      totalJsBytes += statSync(join(ASTRO_DIR, f)).size;
    }
  }
  const totalJsKb = Math.round(totalJsBytes / 1024);
  if (totalJsKb > MAX_TOTAL_JS_KB) {
    warnings.push(
      `Total first-party JS in dist/_astro/ is ${totalJsKb}KB, over the ${MAX_TOTAL_JS_KB}KB ` +
      `budget in this script. Not necessarily wrong, but worth a quick look at what grew: ` +
      `ls -la dist/_astro/*.js`
    );
  }

  report(errors, warnings, htmlFiles.length, totalJsKb);
}

function report(errors, warnings, pageCount, totalJsKb) {
  if (warnings.length) {
    console.warn('\n⚠ Performance regression warnings (non-blocking):\n');
    warnings.forEach((w) => console.warn('  - ' + w));
    console.warn('');
  }
  if (errors.length) {
    console.error('\n✖ Performance regression check failed:\n');
    errors.forEach((e) => console.error('  - ' + e));
    console.error(`\n${errors.length} issue(s). Fix before deploying.\n`);
    process.exit(1);
  }
  console.log(
    `✓ Performance regression check passed` +
    (pageCount ? ` (${pageCount} pages, ${totalJsKb}KB first-party JS).` : '.')
  );
}

main();
