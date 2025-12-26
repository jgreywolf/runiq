#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const DOCS_EXAMPLES_DIR = join(ROOT, 'docs', 'examples');
const EXAMPLES_DIR = join(ROOT, 'examples');

if (!existsSync(DOCS_EXAMPLES_DIR)) {
  console.error('docs/examples not found');
  process.exit(1);
}

const mdFiles = readdirSync(DOCS_EXAMPLES_DIR).filter((f) => f.endsWith('.md'));

let totalSvgReferences = 0;
const missingRefs = [];

for (const mdFile of mdFiles) {
  const content = readFileSync(join(DOCS_EXAMPLES_DIR, mdFile), 'utf-8');
  const svgMatches = content.match(/!\[.*?\]\(\/examples\/[^)]+\.svg\)/g);
  if (svgMatches) {
    totalSvgReferences += svgMatches.length;
    for (const match of svgMatches) {
      const pathMatch = match.match(/\/examples\/([^)]+\.svg)/);
      if (pathMatch) {
        const svgFile = pathMatch[1];
        const fullPath = join(EXAMPLES_DIR, svgFile);
        if (!existsSync(fullPath)) {
          missingRefs.push({ mdFile, svgFile, fullPath });
        }
      }
    }
  }
}

console.log(`Found ${totalSvgReferences} SVG references in documentation`);
if (missingRefs.length === 0) {
  console.log('No missing SVG files found');
  process.exit(0);
}

console.log(`Missing SVG files (${missingRefs.length}):`);
for (const r of missingRefs) {
  console.log(`- ${r.mdFile}: ${r.svgFile} (expected at ${r.fullPath})`);
}

process.exit(1);
