#!/usr/bin/env node
/**
 * Generate SVG thumbnails for productivity profile examples.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { parse } from '../packages/parser-dsl/dist/index.js';
import {
  renderKanban,
  renderGitGraph,
  renderTreemap,
} from '../packages/renderer-svg/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = join(__dirname, '..', 'docs', 'public', 'examples');

const THUMBNAILS = [
  {
    input: join(__dirname, '..', 'examples', 'kanban', 'product-roadmap.runiq'),
    output: join(OUTPUT_DIR, 'kanban-product-roadmap.svg'),
  },
  {
    input: join(__dirname, '..', 'examples', 'kanban', 'bug-triage.runiq'),
    output: join(OUTPUT_DIR, 'kanban-bug-triage.svg'),
  },
  {
    input: join(__dirname, '..', 'examples', 'gitgraph', 'release-flow.runiq'),
    output: join(OUTPUT_DIR, 'gitgraph-release-flow.svg'),
  },
  {
    input: join(__dirname, '..', 'examples', 'treemap', 'product-usage.runiq'),
    output: join(OUTPUT_DIR, 'treemap-product-usage.svg'),
  },
];

function renderProfile(profile) {
  switch (profile.type) {
    case 'kanban':
      return renderKanban(profile).svg;
    case 'gitgraph':
      return renderGitGraph(profile).svg;
    case 'treemap':
      return renderTreemap(profile).svg;
    default:
      throw new Error(`Unsupported profile type: ${profile.type}`);
  }
}

function ensureOutputDir() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function main() {
  ensureOutputDir();

  for (const entry of THUMBNAILS) {
    const content = readFileSync(entry.input, 'utf-8');
    const result = parse(content);

    if (!result.success || !result.document?.profiles?.length) {
      throw new Error(`Failed to parse ${entry.input}`);
    }

    const profile = result.document.profiles[0];
    const svg = renderProfile(profile);
    writeFileSync(entry.output, svg, 'utf-8');
    console.log(`Generated ${entry.output}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
