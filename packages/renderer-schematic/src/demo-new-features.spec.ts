import { describe, it, expect } from 'vitest';
import { renderSchematic } from './index.js';
import type { ElectricalProfile } from '@runiq/core';
import { writeFileSync } from 'fs';
import { join } from 'path';

describe('Demo: New Features (Rotation + Orthogonal Routing)', () => {
  it('should generate H-Bridge motor driver with rotation and orthogonal routing', () => {
    const profile: ElectricalProfile = {
      type: 'electrical',
      name: 'H-Bridge Motor Driver',
      nets: [
        { name: 'VCC' },
        { name: 'CTRL_A' },
        { name: 'CTRL_B' },
        { name: 'MOTOR_P' },
        { name: 'MOTOR_N' },
        { name: 'GND' },
      ],
      parts: [
        // Power supply
        { ref: 'V1', type: 'V', params: { value: '12' }, pins: ['VCC', 'GND'] },

        // Control signals
        {
          ref: 'V2',
          type: 'V',
          params: { source: 'PULSE(0 5 0 1n 1n 100u 200u)' },
          pins: ['CTRL_A', 'GND'],
        },
        {
          ref: 'V3',
          type: 'V',
          params: { source: 'PULSE(0 5 100u 1n 1n 100u 200u)' },
          pins: ['CTRL_B', 'GND'],
        },

        // H-Bridge: High-side MOSFETs (PMOS) - rotated 90°
        {
          ref: 'M1',
          type: 'M_PMOS',
          params: { model: 'IRF9530', w: '50u', l: '2u', rotation: 90 },
          pins: ['MOTOR_P', 'CTRL_A', 'VCC', 'VCC'],
        },
        {
          ref: 'M2',
          type: 'M_PMOS',
          params: { model: 'IRF9530', w: '50u', l: '2u', rotation: 90 },
          pins: ['MOTOR_N', 'CTRL_B', 'VCC', 'VCC'],
        },

        // H-Bridge: Low-side MOSFETs (NMOS) - rotated 270°
        {
          ref: 'M3',
          type: 'M_NMOS',
          params: { model: 'IRF530', w: '100u', l: '2u', rotation: 270 },
          pins: ['MOTOR_P', 'CTRL_A', 'GND', 'GND'],
        },
        {
          ref: 'M4',
          type: 'M_NMOS',
          params: { model: 'IRF530', w: '100u', l: '2u', rotation: 270 },
          pins: ['MOTOR_N', 'CTRL_B', 'GND', 'GND'],
        },

        // Motor (inductor + resistor) - rotated 90°
        {
          ref: 'L1',
          type: 'L',
          params: { value: '10m', rotation: 90 },
          pins: ['MOTOR_P', 'MOTOR_N'],
        },
        {
          ref: 'R1',
          type: 'R',
          params: { value: '5', rotation: 90 },
          pins: ['MOTOR_P', 'MOTOR_N'],
        },
      ],
      analyses: [{ kind: 'tran', args: '0 500u' }],
    };

    // Render with orthogonal routing
    const result = renderSchematic(profile, {
      routing: 'orthogonal', // NEW FEATURE!
      showValues: true,
      showReferences: true,
      showNetLabels: true,
    });

    // Verify SVG generated
    expect(result.svg).toBeTruthy();
    expect(result.svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    // Verify rotation applied (should have 6 rotated components: 4 MOSFETs + L + R)
    const rotations = result.svg.match(/transform="rotate\(/g) || [];
    expect(rotations.length).toBeGreaterThanOrEqual(6);

    // Verify junction dots present (orthogonal routing creates junctions)
    expect(result.svg).toContain('electrical-junction');

    // Verify MOSFETs rendered
    expect(result.svg).toContain('M1');
    expect(result.svg).toContain('M2');
    expect(result.svg).toContain('M3');
    expect(result.svg).toContain('M4');

    // Save to file for visual inspection
    const outputPath = join(
      process.cwd(),
      'src',
      '__tests__',
      'output-h-bridge-demo.svg'
    );
    try {
      writeFileSync(outputPath, result.svg);
      console.log(`\n✅ H-Bridge schematic saved to: ${outputPath}`);
      console.log(`   Features demonstrated:`);
      console.log(`   - Components with rotation: ${rotations.length}`);
      console.log(
        `   - Junction dots: ${(result.svg.match(/electrical-junction/g) || []).length}`
      );
      console.log(`   - MOSFETs: 4 (2 PMOS + 2 NMOS)`);
      console.log(`   - Orthogonal routing: enabled`);
    } catch (err) {
      // Ignore file write errors in CI
    }
  });

  it('should generate voltage regulator with mixed rotations', () => {
    const profile: ElectricalProfile = {
      type: 'electrical',
      name: 'Voltage Regulator Demo',
      nets: [{ name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
      parts: [
        { ref: 'V1', type: 'V', params: { value: '12' }, pins: ['VIN', 'GND'] },
        {
          ref: 'C1',
          type: 'C',
          params: { value: '100u', rotation: 0 },
          pins: ['VIN', 'GND'],
        },
        {
          ref: 'R1',
          type: 'R',
          params: { value: '100', rotation: 90 },
          pins: ['VIN', 'VOUT'],
        },
        {
          ref: 'D1',
          type: 'D',
          params: { model: '1N4148', rotation: 180 },
          pins: ['VOUT', 'GND'],
        },
        {
          ref: 'C2',
          type: 'C',
          params: { value: '10u', rotation: 270 },
          pins: ['VOUT', 'GND'],
        },
      ],
      analyses: [{ kind: 'dc', args: 'V1 0 15 0.1' }],
    };

    // Render with orthogonal routing
    const result = renderSchematic(profile, {
      routing: 'orthogonal',
      showValues: true,
    });

    // Verify all 4 rotation angles used
    expect(result.svg).toContain('transform="rotate(90'); // R1
    expect(result.svg).toContain('transform="rotate(180'); // D1
    expect(result.svg).toContain('transform="rotate(270'); // C2

    // C1 has 0° rotation (default), no transform needed
    const rotations = result.svg.match(/transform="rotate\(/g) || [];
    expect(rotations.length).toBe(3); // Only non-zero rotations get transforms

    console.log(`\n✅ Voltage regulator with mixed rotations:`);
    console.log(`   - 0° rotation: C1 (default)`);
    console.log(`   - 90° rotation: R1`);
    console.log(`   - 180° rotation: D1`);
    console.log(`   - 270° rotation: C2`);
  });
});
