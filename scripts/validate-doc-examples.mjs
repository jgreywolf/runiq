import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parse } from '../packages/parser-dsl/dist/index.js';

const docsRoot = join(process.cwd(), 'docs', 'examples');

function extractRuniqBlocks(markdown) {
  const blocks = [];
  const fence = /```(?:runiq|diagram)\s*([\s\S]*?)```/gi;
  let match;
  while ((match = fence.exec(markdown)) !== null) {
    const content = match[1].trim();
    if (content) {
      blocks.push(content);
    }
  }
  return blocks;
}

function isFullDiagramBlock(block) {
  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));

  if (lines.length === 0) return false;

  const first = lines[0].split(/\s+/)[0];
  const starters = new Set([
    'diagram',
    'sequence',
    'electrical',
    'digital',
    'wardley',
    'pneumatic',
    'hydraulic',
    'pid',
    'glyphset',
    'timeline',
  ]);

  return starters.has(first);
}

function collectMarkdownFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = collectMarkdownFiles(docsRoot);
const failures = [];
const verbose = process.argv.includes('--verbose');

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const blocks = extractRuniqBlocks(content);

  blocks.forEach((block, index) => {
    if (!isFullDiagramBlock(block)) {
      return;
    }

    try {
      const result = parse(block);
      if (!result.success) {
        failures.push({
          file,
          index: index + 1,
          errors: result.errors,
        });
      }
    } catch (error) {
      failures.push({
        file,
        index: index + 1,
        errors: [
          error instanceof Error ? error.message : 'Unknown parse error',
        ],
      });
    }
  });
}

if (failures.length === 0) {
  console.log(`OK: Parsed ${files.length} docs/examples markdown files.`);
  process.exit(0);
}

const counts = new Map();
for (const failure of failures) {
  counts.set(failure.file, (counts.get(failure.file) || 0) + 1);
}

console.log(`Found ${failures.length} invalid code block(s) across ${counts.size} files:`);
for (const [file, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`- ${file}: ${count}`);
}

if (verbose) {
  console.log('\nDetails:');
  for (const failure of failures) {
    console.log(`- ${failure.file} (block ${failure.index})`);
    failure.errors.forEach((err) => console.log(`  ${err}`));
  }
}

process.exit(1);
