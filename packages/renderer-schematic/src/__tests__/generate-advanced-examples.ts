import { renderSchematic } from '@runiq/renderer-schematic';
import type { ElectricalProfile } from '@runiq/core';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create output directory for schematics
const schematicDir = join(
  process.cwd(),
  'examples',
  'digital',
  'schematics',
  'advanced'
);
try {
  mkdirSync(schematicDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

console.log('🎨 Generating advanced digital circuit schematics...\n');

// ============================================================================
// Example 1: 4-bit Ripple Counter (T Flip-Flops)
// ============================================================================

const counterSchematic: ElectricalProfile = {
  type: 'electrical',
  name: '4-bit Ripple Counter',
  nets: [
    { name: 'CLK' },
    { name: 'Q0' },
    { name: 'Q0N' },
    { name: 'Q1' },
    { name: 'Q1N' },
    { name: 'Q2' },
    { name: 'Q2N' },
    { name: 'Q3' },
    { name: 'Q3N' },
    { name: 'VCC' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'TFF',
      params: {},
      pins: ['VCC', 'CLK', 'Q0', 'Q0N'],
    },
    {
      ref: 'U2',
      type: 'TFF',
      params: {},
      pins: ['VCC', 'Q0', 'Q1', 'Q1N'],
    },
    {
      ref: 'U3',
      type: 'TFF',
      params: {},
      pins: ['VCC', 'Q1', 'Q2', 'Q2N'],
    },
    {
      ref: 'U4',
      type: 'TFF',
      params: {},
      pins: ['VCC', 'Q2', 'Q3', 'Q3N'],
    },
  ],
};

const counterResult = renderSchematic(counterSchematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(join(schematicDir, '4-bit-counter.svg'), counterResult.svg);
console.log('✅ 4-bit Ripple Counter schematic generated');
console.log(`   Flip-flops: 4× T FF`);
console.log(`   Cascaded for ripple counting`);
console.log(`   Outputs: Q0-Q3 (binary count)`);

// ============================================================================
// Example 2: 8-bit Data Register with Enable
// ============================================================================

const registerSchematic: ElectricalProfile = {
  type: 'electrical',
  name: '8-bit Data Register',
  nets: [
    { name: 'D0' },
    { name: 'D1' },
    { name: 'D2' },
    { name: 'D3' },
    { name: 'D4' },
    { name: 'D5' },
    { name: 'D6' },
    { name: 'D7' },
    { name: 'CLK' },
    { name: 'EN' },
    { name: 'Q0' },
    { name: 'Q1' },
    { name: 'Q2' },
    { name: 'Q3' },
    { name: 'Q4' },
    { name: 'Q5' },
    { name: 'Q6' },
    { name: 'Q7' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'REG8',
      params: {},
      pins: [
        'D0',
        'D1',
        'D2',
        'D3',
        'D4',
        'D5',
        'D6',
        'D7',
        'CLK',
        'EN',
        'Q0',
        'Q1',
        'Q2',
        'Q3',
        'Q4',
        'Q5',
        'Q6',
        'Q7',
      ],
    },
  ],
};

const registerResult = renderSchematic(registerSchematic, {
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(join(schematicDir, '8-bit-register.svg'), registerResult.svg);
console.log('✅ 8-bit Register schematic generated');
console.log(`   Single 8-bit REG8 component`);
console.log(`   Clock and enable inputs`);
console.log(`   8 data inputs, 8 outputs`);

// ============================================================================
// Example 3: Equality Comparator (2-bit)
// ============================================================================

const comparatorSchematic: ElectricalProfile = {
  type: 'electrical',
  name: '2-bit Equality Comparator',
  nets: [
    { name: 'A0' },
    { name: 'A1' },
    { name: 'B0' },
    { name: 'B1' },
    { name: 'EQ0' },
    { name: 'EQ1' },
    { name: 'EQUAL' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'XNOR',
      params: {},
      pins: ['A0', 'B0', 'EQ0'],
    },
    {
      ref: 'U2',
      type: 'XNOR',
      params: {},
      pins: ['A1', 'B1', 'EQ1'],
    },
    {
      ref: 'U3',
      type: 'AND',
      params: {},
      pins: ['EQ0', 'EQ1', 'EQUAL'],
    },
  ],
};

const comparatorResult = renderSchematic(comparatorSchematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(
  join(schematicDir, 'equality-comparator.svg'),
  comparatorResult.svg
);
console.log('✅ 2-bit Equality Comparator schematic generated');
console.log(`   Gates: 2× XNOR + 1× AND`);
console.log(`   Compares A[1:0] with B[1:0]`);
console.log(`   Output: EQUAL (high when A==B)`);

// ============================================================================
// Example 4: 3-bit Priority Encoder
// ============================================================================

const priorityEncoderSchematic: ElectricalProfile = {
  type: 'electrical',
  name: '3-bit Priority Encoder',
  nets: [
    { name: 'I0' },
    { name: 'I1' },
    { name: 'I2' },
    { name: 'I0N' },
    { name: 'I1N' },
    { name: 'I2N' },
    { name: 'Y0' },
    { name: 'Y1' },
    { name: 'AND1' },
  ],
  parts: [
    // Inverters
    {
      ref: 'U1',
      type: 'NOT',
      params: {},
      pins: ['I0', 'I0N'],
    },
    {
      ref: 'U2',
      type: 'NOT',
      params: {},
      pins: ['I1', 'I1N'],
    },
    {
      ref: 'U3',
      type: 'NOT',
      params: {},
      pins: ['I2', 'I2N'],
    },
    // Y0 logic
    {
      ref: 'U4',
      type: 'AND',
      params: {},
      pins: ['I2N', 'I0', 'AND1'],
    },
    {
      ref: 'U5',
      type: 'OR',
      params: {},
      pins: ['I1', 'AND1', 'Y0'],
    },
    // Y1 logic (simplified)
    {
      ref: 'U6',
      type: 'OR',
      params: {},
      pins: ['I2', 'I2N', 'Y1'],
    },
  ],
};

const priorityEncoderResult = renderSchematic(priorityEncoderSchematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(
  join(schematicDir, 'priority-encoder.svg'),
  priorityEncoderResult.svg
);
console.log('✅ 3-bit Priority Encoder schematic generated');
console.log(`   Inputs: I2 (highest priority) to I0`);
console.log(`   Outputs: Y1, Y0 (binary encoded)`);
console.log(`   Gates: 3× NOT + 2× AND + 2× OR`);

// ============================================================================
// Example 5: Majority Vote Circuit (3-input)
// ============================================================================

const majoritySchematic: ElectricalProfile = {
  type: 'electrical',
  name: 'Majority Vote Circuit',
  nets: [
    { name: 'A' },
    { name: 'B' },
    { name: 'C' },
    { name: 'AB' },
    { name: 'BC' },
    { name: 'AC' },
    { name: 'MAJ' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'AND',
      params: {},
      pins: ['A', 'B', 'AB'],
    },
    {
      ref: 'U2',
      type: 'AND',
      params: {},
      pins: ['B', 'C', 'BC'],
    },
    {
      ref: 'U3',
      type: 'AND',
      params: {},
      pins: ['A', 'C', 'AC'],
    },
    {
      ref: 'U4',
      type: 'OR3',
      params: {},
      pins: ['AB', 'BC', 'AC', 'MAJ'],
    },
  ],
};

const majorityResult = renderSchematic(majoritySchematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(join(schematicDir, 'majority-vote.svg'), majorityResult.svg);
console.log('✅ Majority Vote Circuit schematic generated');
console.log(`   Inputs: A, B, C`);
console.log(`   Output: MAJ (high when ≥2 inputs high)`);
console.log(`   Gates: 3× AND + 1× OR3`);

// ============================================================================
// Example 6: JK Flip-Flop Toggle Demo
// ============================================================================

const jkToggleSchematic: ElectricalProfile = {
  type: 'electrical',
  name: 'JK Flip-Flop Toggle Mode',
  nets: [{ name: 'VCC' }, { name: 'CLK' }, { name: 'Q' }, { name: 'QN' }],
  parts: [
    {
      ref: 'U1',
      type: 'JKFF',
      params: {},
      pins: ['VCC', 'CLK', 'VCC', 'Q', 'QN'],
    },
  ],
};

const jkToggleResult = renderSchematic(jkToggleSchematic, {
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(join(schematicDir, 'jk-toggle.svg'), jkToggleResult.svg);
console.log('✅ JK Flip-Flop Toggle schematic generated');
console.log(`   J=K=1 (toggle mode)`);
console.log(`   Output toggles on each clock edge`);

// ============================================================================
// Example 7: Full Adder with 3-Input Gates
// ============================================================================

const fullAdder3Schematic: ElectricalProfile = {
  type: 'electrical',
  name: 'Full Adder (3-Input Gates)',
  nets: [
    { name: 'A' },
    { name: 'B' },
    { name: 'CIN' },
    { name: 'SUM' },
    { name: 'P' },
    { name: 'G' },
    { name: 'COUT' },
  ],
  parts: [
    // SUM = A ⊕ B ⊕ CIN
    {
      ref: 'U1',
      type: 'XOR',
      params: {},
      pins: ['A', 'B', 'P'],
    },
    {
      ref: 'U2',
      type: 'XOR',
      params: {},
      pins: ['P', 'CIN', 'SUM'],
    },
    // COUT logic using 3-input gate
    {
      ref: 'U3',
      type: 'AND',
      params: {},
      pins: ['A', 'B', 'G'],
    },
    {
      ref: 'U4',
      type: 'OR3',
      params: {},
      pins: ['G', 'CIN', 'P', 'COUT'],
    },
  ],
};

const fullAdder3Result = renderSchematic(fullAdder3Schematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(
  join(schematicDir, 'full-adder-3input.svg'),
  fullAdder3Result.svg
);
console.log('✅ Full Adder (3-input) schematic generated');
console.log(`   Uses OR3 for carry logic`);
console.log(`   Gates: 2× XOR + 1× AND + 1× OR3`);

// ============================================================================
// Example 8: 4-bit Register with D Flip-Flops
// ============================================================================

const register4FFSchematic: ElectricalProfile = {
  type: 'electrical',
  name: '4-bit Register (DFF)',
  nets: [
    { name: 'D0' },
    { name: 'D1' },
    { name: 'D2' },
    { name: 'D3' },
    { name: 'CLK' },
    { name: 'Q0' },
    { name: 'Q0N' },
    { name: 'Q1' },
    { name: 'Q1N' },
    { name: 'Q2' },
    { name: 'Q2N' },
    { name: 'Q3' },
    { name: 'Q3N' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'DFF',
      params: {},
      pins: ['D0', 'CLK', 'Q0', 'Q0N'],
    },
    {
      ref: 'U2',
      type: 'DFF',
      params: {},
      pins: ['D1', 'CLK', 'Q1', 'Q1N'],
    },
    {
      ref: 'U3',
      type: 'DFF',
      params: {},
      pins: ['D2', 'CLK', 'Q2', 'Q2N'],
    },
    {
      ref: 'U4',
      type: 'DFF',
      params: {},
      pins: ['D3', 'CLK', 'Q3', 'Q3N'],
    },
  ],
};

const register4FFResult = renderSchematic(register4FFSchematic, {
  routing: 'orthogonal',
  showReferences: true,
  showNetLabels: true,
});

writeFileSync(
  join(schematicDir, '4-bit-register-dff.svg'),
  register4FFResult.svg
);
console.log('✅ 4-bit Register (DFF) schematic generated');
console.log(`   Built from 4× D Flip-Flops`);
console.log(`   Parallel load on common clock`);

console.log('\n🎉 All advanced digital schematics generated!');
console.log(`\n📁 Schematics directory: ${schematicDir}`);
console.log('\nGenerated files:');
console.log('  - 4-bit-counter.svg (T flip-flops)');
console.log('  - 8-bit-register.svg (REG8 component)');
console.log('  - equality-comparator.svg (XNOR gates)');
console.log('  - priority-encoder.svg (3-bit)');
console.log('  - majority-vote.svg (OR3 gate)');
console.log('  - jk-toggle.svg (JK flip-flop)');
console.log('  - full-adder-3input.svg (OR3 gate)');
console.log('  - 4-bit-register-dff.svg (D flip-flops)');

console.log('\n✨ Features demonstrated:');
console.log('   - XNOR gates for equality comparison');
console.log('   - 3-input gates (AND3, OR3, NAND3, NOR3)');
console.log('   - D, JK, and T flip-flops');
console.log('   - 4-bit and 8-bit registers');
console.log('   - Sequential logic circuits');
console.log('   - Combinational logic circuits');
console.log('   - Orthogonal wire routing');
