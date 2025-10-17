#!/usr/bin/env node
/**
 * Generate SVG outputs for all example .runiq files
 * This helps visualize examples in documentation
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { parseRuniqDSL } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';
import { renderSVG } from '@runiq/renderer-svg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXAMPLES_DIR = join(__dirname, 'examples');
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
    const parseResult = await parseRuniqDSL(dslContent);
    
    if (parseResult.errors && parseResult.errors.length > 0) {
      console.error(`  ❌ Parse errors:`);
      parseResult.errors.forEach(err => console.error(`     ${err.message}`));
      return false;
    }
    
    if (!parseResult.ast) {
      console.error(`  ❌ No AST generated`);
      return false;
    }
    
    // Layout
    const laidOut = await layoutDiagram(parseResult.ast, {
      direction: parseResult.ast.direction || 'TB',
      spacing: 80
    });
    
    // Render SVG
    const svg = renderSVG(laidOut, {
      title: parseResult.ast.title || 'Diagram',
      padding: 20
    });
    
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
