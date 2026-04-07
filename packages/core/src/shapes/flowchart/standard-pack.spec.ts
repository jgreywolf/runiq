import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  collateShape,
  extractShape,
  manualOperationShape,
  mergeShape,
  onPageConnectorShape,
  sortShape,
} from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'shape',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontSize: 14,
      fontFamily: 'Arial',
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Standard Pack', () => {
  it('should expose on-page connector', () => {
    expect(onPageConnectorShape.id).toBe('onPageConnector');
    const svg = onPageConnectorShape.render(createMockContext('A'), { x: 0, y: 0 });
    expect(svg).toContain('<circle');
  });

  it('should expose manual operation', () => {
    expect(manualOperationShape.id).toBe('manualOperation');
    const svg = manualOperationShape.render(createMockContext('Manual'), { x: 0, y: 0 });
    expect(svg).toContain('<path');
  });

  it('should expose merge', () => {
    expect(mergeShape.id).toBe('merge');
    const svg = mergeShape.render(createMockContext('Merge'), { x: 0, y: 0 });
    expect(svg).toContain('<polygon');
  });

  it('should expose collate', () => {
    expect(collateShape.id).toBe('collate');
    const svg = collateShape.render(createMockContext('Collate'), { x: 0, y: 0 });
    expect(svg).toContain('<path');
  });

  it('should expose extract', () => {
    expect(extractShape.id).toBe('extract');
    const svg = extractShape.render(createMockContext('Extract'), { x: 0, y: 0 });
    expect(svg).toContain('<polygon');
  });

  it('should render sort with divider line', () => {
    expect(sortShape.id).toBe('sort');
    const svg = sortShape.render(createMockContext('Sort'), { x: 0, y: 0 });
    expect(svg).toContain('<path');
    expect(svg).toContain('<line');
  });
});
