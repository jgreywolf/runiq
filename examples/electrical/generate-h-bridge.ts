import { parseCircuit } from '@runiq/parser-dsl';
import { renderSchematic } from '@runiq/renderer-schematic';
import { toSPICE } from '@runiq/export-spice';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const examplePath = join(
  process.cwd(),
  'examples',
  'electrical',
  'h-bridge-motor.runiq'
);
const source = readFileSync(examplePath, 'utf-8');

console.log('🔧 Parsing H-Bridge Motor Driver circuit...');
const parseResult = parseCircuit(source);

if (parseResult.errors.length > 0) {
  console.error('❌ Parse errors:', parseResult.errors);
  process.exit(1);
}

if (!parseResult.value) {
  console.error('❌ No circuit parsed');
  process.exit(1);
}

const profile = parseResult.value;

// Render schematic with orthogonal routing
console.log('📐 Rendering schematic with orthogonal routing...');
const schematicResult = renderSchematic(profile, {
  routing: 'orthogonal', // New feature!
  showValues: true,
  showReferences: true,
  showNetLabels: true,
});

if (schematicResult.warnings.length > 0) {
  console.log('⚠️  Warnings:');
  schematicResult.warnings.forEach((w) => console.log('   ', w));
}

// Save schematic
const schematicPath = join(
  process.cwd(),
  'examples',
  'electrical',
  'h-bridge-motor-schematic.svg'
);
writeFileSync(schematicPath, schematicResult.svg);
console.log(`✅ Schematic saved to: ${schematicPath}`);
console.log(
  `   - Components with rotation: ${schematicResult.svg.match(/transform="rotate/g)?.length || 0}`
);
console.log(
  `   - Junction dots: ${schematicResult.svg.match(/schematic-junction/g)?.length || 0}`
);

// Generate SPICE netlist
console.log('⚡ Generating SPICE netlist...');
const spiceResult = toSPICE(profile);

if (spiceResult.warnings.length > 0) {
  console.log('⚠️  SPICE Warnings:');
  spiceResult.warnings.forEach((w) => console.log('   ', w));
}

const spicePath = join(
  process.cwd(),
  'examples',
  'electrical',
  'h-bridge-motor.cir'
);
writeFileSync(spicePath, spiceResult.netlist);
console.log(`✅ SPICE netlist saved to: ${spicePath}`);

console.log('\n🎉 H-Bridge Motor Driver generated successfully!');
console.log('   Features demonstrated:');
console.log('   ✓ Component rotation (90° and 270°)');
console.log('   ✓ Orthogonal wire routing');
console.log('   ✓ Junction dots at wire intersections');
console.log('   ✓ MOSFET symbols (PMOS and NMOS)');
console.log('   ✓ H-Bridge topology');
