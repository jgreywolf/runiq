import { describe, it, expect } from 'vitest';
import { matrixGlyphSet } from './matrix';

describe('Matrix', () => {
  it('generates 2x2 matrix with 4 quadrants', () => {
    const result = matrixGlyphSet.generator({
      quadrants: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    });

    // Matrix now uses a single composite node with data
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].shape).toBe('matrix');
    expect(result.nodes?.[0].data).toHaveProperty('quadrants');

    const quadrants = result.nodes?.[0].data?.quadrants as any[];
    expect(quadrants).toHaveLength(4);
    expect(quadrants[0].label).toBe('Strengths');
    expect(quadrants[1].label).toBe('Weaknesses');
    expect(quadrants[2].label).toBe('Opportunities');
    expect(quadrants[3].label).toBe('Threats');
  });

  it('requires exactly 4 quadrants', () => {
    expect(() => {
      matrixGlyphSet.generator({ quadrants: ['A', 'B', 'C'] });
    }).toThrow('exactly 4 quadrants');
  });

  it('applies distinct colors to each quadrant', () => {
    const result = matrixGlyphSet.generator({
      quadrants: ['Q1', 'Q2', 'Q3', 'Q4'],
    });

    const quadrants = result.nodes?.[0].data?.quadrants as any[];
    const colors = quadrants?.map((q) => q.color);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(4); // Each quadrant has unique color
  });

  it('supports axis labels', () => {
    const result = matrixGlyphSet.generator({
      quadrants: ['Q1', 'Q2', 'Q3', 'Q4'],
      horizontalAxis: 'Urgency',
      verticalAxis: 'Importance',
    });

    // Axis labels are now stored in the data, not as separate nodes
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes?.[0].data?.horizontalAxis).toBe('Urgency');
    expect(result.nodes?.[0].data?.verticalAxis).toBe('Importance');
  });
});
