#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const DOCS_EXAMPLES_DIR = join(ROOT, 'docs', 'examples');
const EXAMPLES_DIR = join(ROOT, 'examples');

if (!existsSync(DOCS_EXAMPLES_DIR)) {
  console.error('docs/examples not found');
  process.exit(1);
}

function findFileRecursive(dir, filename) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isFile() && entry.name === filename) return p;
    if (entry.isDirectory()) {
      const found = findFileRecursive(p, filename);
      if (found) return found;
    }
  }
  return null;
}

const mdFiles = readdirSync(DOCS_EXAMPLES_DIR).filter((f) => f.endsWith('.md'));
const copied = [];
const notFound = [];

for (const mdFile of mdFiles) {
  const content = readFileSync(join(DOCS_EXAMPLES_DIR, mdFile), 'utf-8');
  const svgMatches = content.match(/!\[.*?\]\(\/examples\/([^)]+\.svg)\)/g);
  if (!svgMatches) continue;
  for (const m of svgMatches) {
    const pm = m.match(/\/examples\/([^)]+\.svg)/);
    if (!pm) continue;
    const svgFile = pm[1];
    const target = join(EXAMPLES_DIR, svgFile);
    if (existsSync(target)) continue; // already at root

    const found = findFileRecursive(EXAMPLES_DIR, svgFile);
    if (found) {
      try {
        copyFileSync(found, target);
        copied.push({ mdFile, svgFile, from: found, to: target });
      } catch (err) {
        notFound.push({ mdFile, svgFile, error: String(err) });
      }
    } else {
      notFound.push({ mdFile, svgFile });
    }
  }
}

console.log(`Copied ${copied.length} files to ${EXAMPLES_DIR}`);
if (copied.length > 0)
  copied
    .slice(0, 20)
    .forEach((c) => console.log(`- ${c.svgFile}: ${c.from} -> ${c.to}`));
if (notFound.length > 0) {
  console.warn(`Not found: ${notFound.length}`);
  notFound
    .slice(0, 20)
    .forEach((n) => console.warn(`- ${n.mdFile}: ${n.svgFile}`));
}

process.exit(0);
