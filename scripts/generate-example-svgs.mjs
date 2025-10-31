#!/usr/bin/env node
/**
 * Generate SVG outputs for all example .runiq files
 * This helps visualize examples in documentation
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

// Import from built packages using relative paths
import { parse } from '../packages/parser-dsl/dist/index.js';
import { ElkLayoutEngine } from '../packages/layout-base/dist/index.js';
import { renderSvg } from '../packages/renderer-svg/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXAMPLES_DIR = join(__dirname, '..', 'examples');
const SKIP_DIRS = ['output', 'electrical', 'digital', 'verilog-output']; // Skip circuit examples (they have their own renderers)

function findRuniqFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const dirName = basename(fullPath);
      if (!SKIP_DIRS.includes(dirName)) {
        findRuniqFiles(fullPath, files);
      }
    } else if (entry.endsWith('.runiq')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function generateSVG(runiqPath) {
  try {
    console.log(`\nProcessing: ${runiqPath}`);

    // Read the .runiq file
    const dslContent = readFileSync(runiqPath, 'utf-8');

    // Parse DSL
    const parseResult = await parse(dslContent);

    if (!parseResult.success) {
      console.error(`  ❌ Parse failed`);
      if (parseResult.errors && parseResult.errors.length > 0) {
        parseResult.errors.forEach((err) => {
          const msg = err?.message || err?.toString() || 'Unknown error';
          console.error(`     ${msg}`);
        });
      }
      return false;
    }

    if (!parseResult.document) {
      console.error(`  ❌ No diagram generated`);
      return false;
    }

    // Layout
    const layoutEngine = new ElkLayoutEngine();
    const laidOut = await layoutEngine.layout(parseResult.document, {
      direction: parseResult.document.direction || 'TB',
      spacing: 80,
    });

    // Render SVG
    const result = renderSvg(laidOut, {
      title: parseResult.document.title || 'Diagram',
    });
    const svg = result.svg;

    // Write SVG file
    const svgPath = runiqPath.replace('.runiq', '.svg');
    writeFileSync(svgPath, svg, 'utf-8');

    console.log(`  ✅ Generated: ${basename(svgPath)}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎨 Generating SVG outputs for all examples...\n');
  console.log(`📁 Examples directory: ${EXAMPLES_DIR}`);
  console.log(`🚫 Skipping directories: ${SKIP_DIRS.join(', ')}\n`);

  // Find all .runiq files
  const runiqFiles = findRuniqFiles(EXAMPLES_DIR);
  console.log(`📄 Found ${runiqFiles.length} .runiq files\n`);

  let success = 0;
  let failed = 0;

  // Generate SVG for each
  for (const file of runiqFiles) {
    const result = await generateSVG(file);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${runiqFiles.length}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
