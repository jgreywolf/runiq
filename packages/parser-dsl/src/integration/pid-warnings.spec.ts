import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';

describe('P&ID warning checks', () => {
  it('warns when instrument loop does not match tag', () => {
    const text = `
      pid "Loop Mismatch" {
        instrument FT-101 type:flowTransmitter range:(0,100) unit:kg/h loop:202
      }
    `;

    const result = parse(text);

    expect(result.success).toBe(true);
    expect(result.warnings.some((w) => w.includes('PID loop mismatch'))).toBe(
      true
    );
    expect(result.warningDetails?.length).toBeGreaterThan(0);
  });

  it('warns when loop controller tag does not match loop number', () => {
    const text = `
      pid "Loop Mismatch" {
        loop 101 controlled_variable:flow setpoint:10 unit:kg/h controller:FIC-202
      }
    `;

    const result = parse(text);

    expect(result.success).toBe(true);
    expect(result.warnings.some((w) => w.includes('PID loop mismatch'))).toBe(
      true
    );
  });

  it('does not warn when tags and loops align', () => {
    const text = `
      pid "Loop Match" {
        instrument FT-101 type:flowTransmitter range:(0,100) unit:kg/h loop:101
        loop 101 controlled_variable:flow setpoint:10 unit:kg/h controller:FIC-101
      }
    `;

    const result = parse(text);

    expect(result.success).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });
});
