#!/usr/bin/env node

/**
 * Test script to parse Runiq electrical examples and export to SPICE
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from '@runiq/parser-dsl';
import { toSpice } from '@runiq/export-spice';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all .runiq files in examples/electrical
const examplesDir = path.join(__dirname, '..', '..', '..', 'examples', 'electrical');
const outputDir = path.join(__dirname, '..', '..', '..', 'examples', 'electrical', 'spice-output');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🔌 Runiq → SPICE Conversion Test\n');
console.log(`Input:  ${examplesDir}`);
console.log(`Output: ${outputDir}\n`);

const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.runiq'));

let successCount = 0;
let errorCount = 0;

for (const file of files) {
  const inputPath = path.join(examplesDir, file);
  const outputPath = path.join(outputDir, file.replace('.runiq', '.cir'));
  
  try {
    console.log(`📄 Processing: ${file}`);
    
    // Read and parse
    const content = fs.readFileSync(inputPath, 'utf-8');
    const parseResult = parse(content);
    
    if (!parseResult.success || !parseResult.document) {
      console.error(`   ❌ Parse error: ${parseResult.errors.join(', ')}`);
      errorCount++;
      continue;
    }
    
    // Find electrical profile
    const electricalProfile = parseResult.document.profiles.find(
      p => p.type === 'electrical'
    );
    
    if (!electricalProfile) {
      console.error(`   ⚠️  No electrical profile found`);
      errorCount++;
      continue;
    }
    
    // Convert to SPICE
    const spice = toSpice(electricalProfile);
    
    // Write output
    fs.writeFileSync(outputPath, spice, 'utf-8');
    
    console.log(`   ✅ Exported to: ${path.basename(outputPath)}`);
    console.log(`   📊 Stats: ${electricalProfile.parts.length} parts, ${electricalProfile.analyses?.length || 0} analyses`);
    console.log();
    
    successCount++;
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`✨ Conversion complete!`);
console.log(`   ✅ Success: ${successCount}`);
if (errorCount > 0) {
  console.log(`   ❌ Errors:  ${errorCount}`);
}
console.log('='.repeat(60));

if (successCount > 0) {
  console.log('\n💡 Next steps:');
  console.log('   1. Open .cir files in text editor to verify SPICE netlists');
  console.log('   2. Run simulations: ngspice <filename>.cir');
  console.log('   3. Or open in LTspice for graphical simulation');
}

process.exit(errorCount > 0 ? 1 : 0);
