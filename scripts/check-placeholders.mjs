import fs from 'fs';
import path from 'path';

const PLACEHOLDERS = [
  'WHATSAPP_NUMBER',
  'TESTIMONIO_',
  'FOTO_',
  'TODO',
  'Lorem',
  'PLACEHOLDER',
  'XXXXX',
];

const WHITELIST_PATTERNS = [
  // C12: "labio leporino" terminology page route (doesn't exist yet)
  // Add route patterns here once C12 is live
];

function isWhitelisted(filePath) {
  return WHITELIST_PATTERNS.some(pattern => filePath.includes(pattern));
}

function checkDir(dir) {
  let found = [];
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  
  for (const file of files) {
    if (file.isDirectory()) continue;
    if (file.path.includes('node_modules')) continue;
    
    const fullPath = path.join(file.parentPath, file.name);
    const relPath = path.relative(process.cwd(), fullPath);
    
    if (isWhitelisted(relPath)) continue;
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const placeholder of PLACEHOLDERS) {
        const matches = [...content.matchAll(new RegExp(placeholder, 'g'))];
        if (matches.length > 0) {
          found.push({ file: relPath, placeholder, count: matches.length });
        }
      }
    } catch (e) {
      // Skip binary files
    }
  }
  
  return found;
}

const srcDir = './src';
const issues = checkDir(srcDir);

if (issues.length > 0) {
  console.error('\n❌ Placeholder tokens found in src/:');
  for (const issue of issues) {
    console.error(`  ${issue.file}: "${issue.placeholder}" (${issue.count})`);
  }
  console.error('\nFix with: T4 (WhatsApp), C5/C6 (hide blocks), or add to WHITELIST_PATTERNS\n');
  process.exit(1);
} else {
  console.log('✓ No placeholder tokens found');
}
