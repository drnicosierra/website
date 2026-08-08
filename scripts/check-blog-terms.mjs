// Hard-stop terminology guard for src/content/blog/*.md.
//
// The other collections (services, about, camino, homepage, cases) are
// type:'data' JSON, so their whole body passes through the Zod .refine()
// checks in src/content/config.ts. The blog collection is type:'content'
// (markdown) — Zod only ever sees the frontmatter there, never the article
// body, so the same hard stops need a separate raw-text guard here.
import fs from 'fs';
import path from 'path';

const BLOG_DIR = './src/content/blog';

// C12 (seo-aeo-brief.md § "Labio leporino" Policy [F]): the one approved
// terminology page is allowed to use the term — its whole purpose is
// explaining why it's avoided elsewhere. Mirrors check-placeholders.mjs's
// WHITELIST_PATTERNS convention, which already anticipated this file.
const LABIO_LEPORINO_ALLOWED_FILES = [
  'fisura-labiopalatina-labio-leporino.md',
];

function paragraphs(text) {
  return text.split(/\n\s*\n/);
}

function checkFile(filePath, fileName) {
  const issues = [];
  const content = fs.readFileSync(filePath, 'utf8');

  if (!LABIO_LEPORINO_ALLOWED_FILES.includes(fileName) && content.toLowerCase().includes('labio leporino')) {
    issues.push('"labio leporino" is forbidden — use "labio fisurado" per clinical terminology rules.');
  }

  for (const para of paragraphs(content)) {
    if (para.includes('Operation Smile') && para.includes('Smile Train')) {
      issues.push('Operation Smile and Smile Train appear in the same paragraph — must never co-occur (per project rule).');
      break;
    }
  }

  return issues;
}

if (!fs.existsSync(BLOG_DIR)) {
  console.log('✓ No blog collection yet — skipping blog terminology check');
  process.exit(0);
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
let hadIssues = false;

for (const file of files) {
  const fullPath = path.join(BLOG_DIR, file);
  const issues = checkFile(fullPath, file);
  if (issues.length > 0) {
    hadIssues = true;
    console.error(`\n❌ ${fullPath}:`);
    issues.forEach((i) => console.error(`  ${i}`));
  }
}

if (hadIssues) {
  console.error('');
  process.exit(1);
} else {
  console.log(`✓ Blog terminology guard passed (${files.length} file${files.length === 1 ? '' : 's'})`);
}
