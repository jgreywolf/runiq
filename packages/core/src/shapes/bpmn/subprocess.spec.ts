import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnSubProcessShape } from './subprocess.js';

function createMockContext(
  label = 'Subprocess',
  data?: Record<string, unknown>
): ShapeRenderContext {
  return {
    node: {
      id: 'subprocess',
      shape: 'bpmnSubProcess',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('BPMN SubProcess', () => {
  it('should have the correct shape id', () => {
    expect(bpmnSubProcessShape.id).toBe('bpmnSubProcess');
  });

  it('should render a rounded rectangle with collapse marker', () => {
    const svg = bpmnSubProcessShape.render(createMockContext('Fulfillment'), { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('<line');
    expect(svg).toContain('Fulfillment');
  });

  it('should render an expanded subprocess without the collapse marker box', () => {
    const svg = bpmnSubProcessShape.render(
      createMockContext('Expanded Review', { expanded: true }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('Expanded Review');
    expect(svg).toContain('stroke-dasharray="4,2"');
    expect(svg).not.toContain('width="12" height="12"');
  });
});
