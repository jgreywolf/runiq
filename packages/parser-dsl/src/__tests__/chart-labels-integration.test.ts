import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from '../langium-parser';

describe('Chart Labels Integration', () => {
  it('should parse chart labels from test file', () => {
    const testFile = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'test-chart-labels-e2e.runiq'
    );
    const input = readFileSync(testFile, 'utf-8');

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.diagram).toBeDefined();

    // Test radar chart with labels
    const skillsNode = result.diagram?.nodes.find((n) => n.id === 'skills');
    expect(skillsNode).toBeDefined();
    expect(skillsNode?.data?.labels).toEqual([
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Testing',
    ]);
    expect(skillsNode?.data).toEqual([85, 72, 90, 78, 82]);

    // Test line chart with labels
    const salesNode = result.diagram?.nodes.find((n) => n.id === 'sales');
    expect(salesNode).toBeDefined();
    expect(salesNode?.data?.labels).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
    ]);
    expect(salesNode?.data).toEqual([45000, 52000, 48000, 61000, 58000, 67000]);

    // Test chart with all properties
    const perfNode = result.diagram?.nodes.find((n) => n.id === 'performance');
    expect(perfNode).toBeDefined();
    expect(perfNode?.data?.labels).toEqual([
      'Quality',
      'Speed',
      'Reliability',
      'Security',
    ]);
    expect(perfNode?.data).toEqual([88, 92, 85, 90]);
    expect(perfNode?.data?.colors).toEqual([
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
    ]);
    expect(perfNode?.data?.showLegend).toBe(true);
  });
});
