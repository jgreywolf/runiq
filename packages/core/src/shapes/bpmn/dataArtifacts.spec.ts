import { describe, expect, it } from 'vitest';
import {
  bpmnDataInputShape,
  bpmnDataOutputShape,
  bpmnDataStoreShape,
} from './dataArtifacts.js';
import type { ShapeRenderContext } from '../../types/index.js';

function createMockContext(label = 'Data'): ShapeRenderContext {
  return {
    node: {
      id: 'artifact',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#333',
      strokeWidth: 1.5,
      fontSize: 14,
      fontFamily: 'sans-serif',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('BPMN Data Artifacts', () => {
  it('should expose the expected ids', () => {
    expect(bpmnDataStoreShape.id).toBe('bpmnDataStore');
    expect(bpmnDataInputShape.id).toBe('bpmnDataInput');
    expect(bpmnDataOutputShape.id).toBe('bpmnDataOutput');
  });

  it('should render a data store with cylinder-like geometry', () => {
    const svg = bpmnDataStoreShape.render(createMockContext('Customer DB'), { x: 0, y: 0 });

    expect(svg).toContain('<ellipse');
    expect(svg).toContain('A ');
    expect(svg).toContain('Customer DB');
  });

  it('should render a data input with an inbound arrow marker', () => {
    const svg = bpmnDataInputShape.render(createMockContext('Order Form'), { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('Order Form');
    expect(svg).toContain('stroke-linejoin="round"');
  });

  it('should render a data output with an outbound arrow marker', () => {
    const svg = bpmnDataOutputShape.render(createMockContext('Invoice'), { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('Invoice');
    expect(svg).toContain('stroke-linejoin="round"');
  });
});
