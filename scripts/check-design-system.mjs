#!/usr/bin/env node
/**
 * Design-system guard.
 *
 * Rule: src/styles/global.css is the ONLY place shared design-system CSS
 * lives (reset, typography, .sh/.eyebrow/.lead, .container/.section, buttons,
 * nav, footer, whatsapp float, reveal animations, the 9-block service-page
 * template classes, and all responsive breakpoints for them).
 *
 * A page may ONLY have an embedded <style> block if it's the tiny 3-line
 * --sc/--sc-soft/--sc-glow accent-color override used by the 8 service
 * pages. Anything bigger means someone pasted in a duplicate copy of the
 * design system again — the exact bug that caused the homepage/nav/footer
 * breakage this was built to prevent.
 *
 * index.astro is a documented, deliberate exception: it runs its own
 * separate ns-* prefixed system and does not share classes with global.css.
 * It is intentionally excluded below, not silently ignored — if you're
 * reading this because it flagged something in index.astro, that's a sign
 * the exception needs revisiting, not a bug in the checker.
 *
 * Run manually:  npm run check:design
 * Runs automatically before every `npm run build` (see package.json prebuild).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_DIR = 'src/pages';
const MAX_OVERRIDE_LINES = 6; // generous ceiling for the --sc override block
const EXCEPTIONS = new Set(['index.astro']); // documented separate design system
// Files where a hoisted script is genuinely intentional (none currently — add
// 'filename.astro:LINE' here only with a comment explaining why, if this ever
// becomes a real, deliberate choice rather than an oversight).
const HOISTING_ALLOWED = new Set([]);

// Any of these appearing inside a page's own <style> block means a chunk of
// the shared design system got pasted back in — these must only ever be
// defined in src/styles/global.css.
const FORBIDDEN_SELECTORS = [
  /(^|[\s,{])\.nav\b/, /\.nav-links/, /\.nav-cta/, /\.nav-burger/, /\.nav-actions/,
  /\.footer\b/, /\.footer-grid/, /\.footer-col/, /\.wa-float/, /\.wa-tip/,
  /(^|[\s,{])\.btn\b/, /\.btn-primary/, /\.btn-ghost/, /\.btn-service/, /\.btn-wa/,
  /(^|[\s,{])\.container\b/, /(^|[\s,{])\.section\b/,
  /(^|[\s,{])h1\s*[,{]/, /(^|[\s,{])h2\s*[,{]/, /\.eyebrow\b/, /(^|[\s,{])\.lead\b/,
  /(^|[\s,{])\.sh\b/, /\.reveal\b/, /\.reveal-scale/,
  /--ns-blue-900/, /--ns-teal-600/, // token redefinition = duplicated :root block
];

function findStyleBlocks(source) {
  const blocks = [];
  const re = /<style>([\s\S]*?)<\/style>/g;
  let m;
  while ((m = re.exec(source))) blocks.push(m[1]);
  return blocks;
}

function checkNestedMedia(source, file, errors) {
  const lines = source.split('\n');
  let depth = 0;
  lines.forEach((line, i) => {
    if (line.includes('@media') && depth > 1) {
      errors.push(
        `${file}:${i + 1} — @media nested inside another rule block (depth ${depth}). ` +
        `This is invalid CSS and gets silently dropped by browsers — this exact bug ` +
        `broke the homepage's mobile credentials grid before.`
      );
    }
    depth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
  });
}

// Any <script> tag with inline JS content (no src=) that lacks is:inline gets
// silently auto-hoisted by Astro into a separate bundled file (dist/_astro/hoisted.*.js).
// That turns a zero-cost inline script into a real new render-blocking network
// request — this exact regression happened once already (July 2026, homepage
// restructure away from Fragment set:html) and cost real LCP time before anyone
// noticed via a live PageSpeed test. This check catches it at build time instead.
function checkScriptHoisting(source, file, errors, allowedSet) {
  // Only scan the actual template section (after frontmatter), not the
  // frontmatter's JS/TS code — which legitimately contains "<script...>"
  // text inside string literals (e.g. JSON-LD schema built as a string and
  // injected later via <Fragment set:html={schemaBlocks} />). Scanning
  // those would be a false positive: they're never real DOM script tags.
  const frontmatterEnd = source.indexOf('---', source.indexOf('---') + 3);
  const templateSource = frontmatterEnd === -1 ? source : source.slice(frontmatterEnd + 3);
  const templateOffset = frontmatterEnd === -1 ? 0 : frontmatterEnd + 3;

  const scriptOpenTagRe = /<script([^>]*)>/g;
  let m;
  while ((m = scriptOpenTagRe.exec(templateSource))) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue; // external script, not hoisted
    if (/\btype\s*=\s*["']application\/ld\+json["']/.test(attrs)) continue; // JSON-LD data, not executable
    if (/\bis:inline\b/.test(attrs)) continue; // correctly marked
    const lineNum = source.slice(0, templateOffset + m.index).split('\n').length;
    if (allowedSet.has(`${file}:${lineNum}`)) continue; // documented exception
    errors.push(
      `${file}:${lineNum} — <script> with inline JS content is missing is:inline. ` +
      `Astro will silently auto-hoist this into a separate bundled file, adding a ` +
      `new render-blocking network request. Add is:inline to keep it as a zero-cost ` +
      `inline script (unless hoisting is genuinely intentional — if so, add this ` +
      `file/line to the HOISTING_ALLOWED set at the top of this script).`
    );
  }
}

function findAstroFilesRecursive(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findAstroFilesRecursive(path));
    else if (entry.name.endsWith('.astro')) results.push(path);
  }
  return results;
}

function main() {
  const errors = [];
  // Recursive: src/pages/ now contains subdirectories (e.g.
  // vidas-transformadas/{slug}.astro for individual case pages) — a plain
  // readdirSync would silently skip everything in them, leaving those files
  // completely unprotected by this guard. Don't repeat that mistake with any
  // future subdirectory either.
  const pageFiles = findAstroFilesRecursive(PAGES_DIR);

  const extraDirs = ['src/layouts', 'src/components'];
  const extraFiles = [];
  for (const dir of extraDirs) {
    try {
      for (const f of readdirSync(dir)) {
        if (f.endsWith('.astro')) extraFiles.push(join(dir, f));
      }
    } catch { /* directory may not exist, that's fine */ }
  }

  const allFiles = [...pageFiles, ...extraFiles];

  for (const path of allFiles) {
    const source = readFileSync(path, 'utf-8');

    checkNestedMedia(source, path, errors);
    checkScriptHoisting(source, path, errors, HOISTING_ALLOWED);

    const file = path.split('/').pop();
    if (EXCEPTIONS.has(file) || !path.startsWith(PAGES_DIR)) continue;

    const blocks = findStyleBlocks(source);
    for (const block of blocks) {
      const lineCount = block.split('\n').filter((l) => l.trim()).length;
      if (lineCount > MAX_OVERRIDE_LINES) {
        errors.push(
          `${path} — embedded <style> block has ${lineCount} lines of CSS. ` +
          `Pages should only override --sc/--sc-soft/--sc-glow (max ~${MAX_OVERRIDE_LINES} lines). ` +
          `Shared styling belongs in src/styles/global.css, not copy-pasted per page.`
        );
      }
      for (const pattern of FORBIDDEN_SELECTORS) {
        if (pattern.test(block)) {
          errors.push(
            `${path} — redefines a shared design-system selector (matched ${pattern}). ` +
            `This belongs only in src/styles/global.css.`
          );
          break; // one report per block is enough, avoid noise
        }
      }
    }
  }

  // global.css itself: still worth checking for invalid nested @media
  try {
    const globalCss = readFileSync('src/styles/global.css', 'utf-8');
    checkNestedMedia(globalCss, 'src/styles/global.css', errors);
  } catch {
    errors.push('src/styles/global.css not found — did the consolidation get reverted?');
  }

  if (errors.length) {
    console.error('\n✖ Design-system check failed:\n');
    errors.forEach((e) => console.error('  - ' + e));
    console.error(`\n${errors.length} issue(s). Fix before building/deploying.\n`);
    process.exit(1);
  }

  console.log(`✓ Design-system check passed (${allFiles.length} files scanned: ${pageFiles.length} pages, ${extraFiles.length} layouts/components).`);
}

main();
