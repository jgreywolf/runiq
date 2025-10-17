/**
 * Generate example schematics demonstrating MUX and decoder components
 */

import fs from 'fs';
import path from 'path';
import { renderSchematic } from '../index.js';
import type { ElectricalProfile } from '@runiq/core';

const OUTPUT_DIR = path.join(
  import.meta.dirname || __dirname,
  '..',
  '..',
  'examples',
  'digital',
  'schematics',
  'mux-decoder'
);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Example 1: Simple 4-to-1 ALU using MUX
 */
const aluWith4to1Mux: ElectricalProfile = {
  type: 'electrical',
  name: '4-to-1 ALU Data Path',
  nets: [
    { name: 'ADD' },
    { name: 'SUB' },
    { name: 'AND' },
    { name: 'OR' },
    { name: 'OP0' },
    { name: 'OP1' },
    { name: 'RESULT' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'MUX41',
      params: {},
      pins: ['ADD', 'SUB', 'AND', 'OR', 'OP0', 'OP1', 'RESULT'],
    },
  ],
};

/**
 * Example 2: 8-to-1 data selector
 */
const dataSelector8to1: ElectricalProfile = {
  type: 'electrical',
  name: '8-to-1 Data Selector',
  nets: [
    { name: 'IN0' },
    { name: 'IN1' },
    { name: 'IN2' },
    { name: 'IN3' },
    { name: 'IN4' },
    { name: 'IN5' },
    { name: 'IN6' },
    { name: 'IN7' },
    { name: 'SEL0' },
    { name: 'SEL1' },
    { name: 'SEL2' },
    { name: 'DATA_OUT' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'MUX81',
      params: {},
      pins: ['IN0', 'IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'SEL0', 'SEL1', 'SEL2', 'DATA_OUT'],
    },
  ],
};

/**
 * Example 3: Memory address decoder (3-to-8)
 */
const memoryDecoder: ElectricalProfile = {
  type: 'electrical',
  name: 'Memory Address Decoder',
  nets: [
    { name: 'A0' },
    { name: 'A1' },
    { name: 'A2' },
    { name: 'CS' },
    { name: 'MEM_BANK_0' },
    { name: 'MEM_BANK_1' },
    { name: 'MEM_BANK_2' },
    { name: 'MEM_BANK_3' },
    { name: 'MEM_BANK_4' },
    { name: 'MEM_BANK_5' },
    { name: 'MEM_BANK_6' },
    { name: 'MEM_BANK_7' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'DEC38',
      params: {},
      pins: ['A0', 'A1', 'A2', 'CS', 'MEM_BANK_0', 'MEM_BANK_1', 'MEM_BANK_2', 'MEM_BANK_3', 
             'MEM_BANK_4', 'MEM_BANK_5', 'MEM_BANK_6', 'MEM_BANK_7'],
    },
  ],
};

/**
 * Example 4: Demultiplexer (1-to-4) using 2-to-4 decoder
 */
const demux1to4: ElectricalProfile = {
  type: 'electrical',
  name: '1-to-4 Demultiplexer',
  nets: [
    { name: 'SEL0' },
    { name: 'SEL1' },
    { name: 'DATA_IN' },
    { name: 'OUT0' },
    { name: 'OUT1' },
    { name: 'OUT2' },
    { name: 'OUT3' },
  ],
  parts: [
    {
      ref: 'U1',
      type: 'DEC24',
      params: {},
      pins: ['SEL0', 'SEL1', 'DATA_IN', 'OUT0', 'OUT1', 'OUT2', 'OUT3'],
    },
  ],
};

/**
 * Example 5: 2-bit barrel shifter using MUXes
 */
const barrelShifter: ElectricalProfile = {
  type: 'electrical',
  name: '2-bit Barrel Shifter',
  nets: [
    { name: 'IN0' },
    { name: 'IN1' },
    { name: 'IN2' },
    { name: 'IN3' },
    { name: 'SHIFT0' },
    { name: 'SHIFT1' },
    { name: 'OUT0' },
    { name: 'OUT1' },
    { name: 'MID0' },
    { name: 'MID1' },
    { name: 'MID2' },
    { name: 'MID3' },
  ],
  parts: [
    // First stage MUXes (shift by 0 or 1)
    {
      ref: 'U1',
      type: 'MUX41',
      params: {},
      pins: ['IN0', 'IN1', 'IN2', 'IN3', 'SHIFT0', 'SHIFT0', 'MID0'],
    },
    {
      ref: 'U2',
      type: 'MUX41',
      params: {},
      pins: ['IN1', 'IN2', 'IN3', 'IN0', 'SHIFT0', 'SHIFT0', 'MID1'],
    },
    // Second stage MUXes (shift by 0 or 2)
    {
      ref: 'U3',
      type: 'MUX41',
      params: {},
      pins: ['MID0', 'MID1', 'MID0', 'MID1', 'SHIFT1', 'SHIFT1', 'OUT0'],
    },
    {
      ref: 'U4',
      type: 'MUX41',
      params: {},
      pins: ['MID1', 'MID0', 'MID1', 'MID0', 'SHIFT1', 'SHIFT1', 'OUT1'],
    },
  ],
};

/**
 * Example 6: Priority encoder using decoder and gates
 */
const priorityEncoder: ElectricalProfile = {
  type: 'electrical',
  name: 'Priority Encoder with Decoder',
  nets: [
    { name: 'REQ0' },
    { name: 'REQ1' },
    { name: 'REQ2' },
    { name: 'REQ3' },
    { name: 'GND' },
    { name: 'GRANT0' },
    { name: 'GRANT1' },
    { name: 'GRANT2' },
    { name: 'GRANT3' },
    { name: 'HIGH' },
    { name: 'ENC0' },
    { name: 'ENC1' },
  ],
  parts: [
    // 2-to-4 decoder for priority encoding
    {
      ref: 'U1',
      type: 'DEC24',
      params: {},
      pins: ['ENC0', 'ENC1', 'HIGH', 'GRANT0', 'GRANT1', 'GRANT2', 'GRANT3'],
    },
  ],
};

// Generate all examples
const examples = [
  { name: 'alu-4to1-mux', profile: aluWith4to1Mux },
  { name: 'data-selector-8to1', profile: dataSelector8to1 },
  { name: 'memory-decoder-3to8', profile: memoryDecoder },
  { name: 'demux-1to4', profile: demux1to4 },
  { name: 'barrel-shifter-2bit', profile: barrelShifter },
  { name: 'priority-encoder', profile: priorityEncoder },
];

console.log('\n🔧 Generating MUX and Decoder example schematics...\n');

for (const example of examples) {
  const result = renderSchematic(example.profile);
  const filename = `${example.name}.svg`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, result.svg, 'utf-8');
  console.log(`✅ ${example.profile.name} schematic generated: ${filename}`);
  
  if (result.warnings.length > 0) {
    console.log(`   ⚠️  Warnings: ${result.warnings.join(', ')}`);
  }
}

console.log(`\n📁 All examples saved to: ${OUTPUT_DIR}\n`);
console.log('📊 Summary:');
console.log(`   - 4-to-1 MUX examples: 3`);
console.log(`   - 8-to-1 MUX examples: 1`);
console.log(`   - 2-to-4 Decoder examples: 2`);
console.log(`   - 3-to-8 Decoder examples: 1`);
console.log(`   - Total circuits: ${examples.length}\n`);
