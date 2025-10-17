import { toVerilog } from '@runiq/export-verilog';
import type { DigitalProfile } from '@runiq/core';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create output directory
const outputDir = join(process.cwd(), 'examples', 'digital', 'verilog-output');
try {
  mkdirSync(outputDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

console.log('🔧 Generating Verilog from digital circuit examples...\n');

// Example 1: 4-bit Counter
const counter: DigitalProfile = {
  type: 'digital',
  name: 'Counter4bit',
  modules: [
    {
      name: 'Counter4bit',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'reset', dir: 'input' },
        { name: 'enable', dir: 'input' },
        { name: 'count', dir: 'output', width: 4 },
      ],
      params: {
        WIDTH: 4,
        INIT: 0,
      },
    },
  ],
  instances: [],
  nets: [
    { name: 'clk' },
    { name: 'reset' },
    { name: 'enable' },
    { name: 'count', width: 4 },
  ],
};

const counterResult = toVerilog(counter);
writeFileSync(join(outputDir, 'counter-4bit.v'), counterResult.verilog);
console.log('✅ Counter4bit generated');
console.log(`   Warnings: ${counterResult.warnings.length}`);

// Example 2: 8-bit Shift Register
const shiftReg: DigitalProfile = {
  type: 'digital',
  name: 'ShiftRegister8bit',
  modules: [
    {
      name: 'ShiftRegister8bit',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'reset', dir: 'input' },
        { name: 'serial_in', dir: 'input' },
        { name: 'shift_enable', dir: 'input' },
        { name: 'serial_out', dir: 'output' },
        { name: 'parallel_out', dir: 'output', width: 8 },
      ],
      params: {
        WIDTH: 8,
      },
    },
  ],
  instances: [],
  nets: [
    { name: 'clk' },
    { name: 'reset' },
    { name: 'serial_in' },
    { name: 'shift_enable' },
    { name: 'serial_out' },
    { name: 'parallel_out', width: 8 },
  ],
};

const shiftRegResult = toVerilog(shiftReg);
writeFileSync(join(outputDir, 'shift-register.v'), shiftRegResult.verilog);
console.log('✅ ShiftRegister8bit generated');
console.log(`   Warnings: ${shiftRegResult.warnings.length}`);

// Example 3: 4-bit ALU (with instances)
const alu: DigitalProfile = {
  type: 'digital',
  name: 'ALU4bit',
  modules: [
    {
      name: 'ALU4bit',
      ports: [
        { name: 'a', dir: 'input', width: 4 },
        { name: 'b', dir: 'input', width: 4 },
        { name: 'op', dir: 'input', width: 2 },
        { name: 'result', dir: 'output', width: 4 },
        { name: 'zero', dir: 'output' },
        { name: 'carry', dir: 'output' },
      ],
    },
  ],
  instances: [
    {
      ref: 'ADDER',
      of: 'Adder4bit',
      portMap: {
        a: 'a',
        b: 'b',
        sum: 'add_result',
        carry_out: 'carry',
      },
    },
    {
      ref: 'SUBTRACTOR',
      of: 'Subtractor4bit',
      portMap: {
        a: 'a',
        b: 'b',
        diff: 'sub_result',
      },
    },
    {
      ref: 'AND_OP',
      of: 'ANDArray4bit',
      portMap: {
        a: 'a',
        b: 'b',
        y: 'and_result',
      },
    },
    {
      ref: 'OR_OP',
      of: 'ORArray4bit',
      portMap: {
        a: 'a',
        b: 'b',
        y: 'or_result',
      },
    },
    {
      ref: 'MUX',
      of: 'Mux4to1',
      paramMap: { WIDTH: 4 },
      portMap: {
        sel: 'op',
        in0: 'add_result',
        in1: 'sub_result',
        in2: 'and_result',
        in3: 'or_result',
        out: 'result',
      },
    },
  ],
  nets: [
    { name: 'a', width: 4 },
    { name: 'b', width: 4 },
    { name: 'op', width: 2 },
    { name: 'result', width: 4 },
    { name: 'zero' },
    { name: 'carry' },
    { name: 'add_result', width: 4 },
    { name: 'sub_result', width: 4 },
    { name: 'and_result', width: 4 },
    { name: 'or_result', width: 4 },
  ],
};

const aluResult = toVerilog(alu);
writeFileSync(join(outputDir, 'alu-4bit.v'), aluResult.verilog);
console.log('✅ ALU4bit generated');
console.log(`   Instances: ${alu.instances.length}`);
console.log(`   Internal wires: ${aluResult.verilog.match(/wire/g)?.length || 0}`);
console.log(`   Warnings: ${aluResult.warnings.length}`);

// Example 4: Traffic Light Controller
const trafficLight: DigitalProfile = {
  type: 'digital',
  name: 'TrafficLightController',
  modules: [
    {
      name: 'TrafficLightController',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'reset', dir: 'input' },
        { name: 'sensor', dir: 'input' },
        { name: 'north_south', dir: 'output', width: 2 },
        { name: 'east_west', dir: 'output', width: 2 },
      ],
    },
  ],
  instances: [],
  nets: [
    { name: 'clk' },
    { name: 'reset' },
    { name: 'sensor' },
    { name: 'north_south', width: 2 },
    { name: 'east_west', width: 2 },
    { name: 'state', width: 3 },
    { name: 'next_state', width: 3 },
    { name: 'timer', width: 8 },
  ],
};

const trafficResult = toVerilog(trafficLight);
writeFileSync(join(outputDir, 'traffic-light.v'), trafficResult.verilog);
console.log('✅ TrafficLightController generated');
console.log(`   Warnings: ${trafficResult.warnings.length}`);

console.log('\n🎉 All Verilog files generated successfully!');
console.log(`\n📁 Output directory: ${outputDir}`);
console.log('\nGenerated files:');
console.log('  - counter-4bit.v');
console.log('  - shift-register.v');
console.log('  - alu-4bit.v');
console.log('  - traffic-light.v');
