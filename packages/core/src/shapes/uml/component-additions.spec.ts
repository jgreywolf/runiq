import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import {
  portShape,
  moduleShape,
  templateShape,
  sendSignalShape,
  receiveSignalShape,
  historyShape,
  pinShape,
  assemblyShape,
  providedInterfaceShape,
  requiredInterfaceShape,
  frameShape,
  collaborationShape,
  submachineShape,
  loopShape,
  verticalForkShape,
} from './component-additions.js';

// Mock render context helper
function createMockContext(
  label: string = 'Test',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('UML Component Additions', () => {
  describe('portShape', () => {
    it('should have correct id', () => {
      expect(portShape.id).toBe('port');
    });

    it('should render small square for port connection point', () => {
      const ctx = createMockContext('P1');
      const svg = portShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<text');
    });
  });

  describe('moduleShape', () => {
    it('should have correct id', () => {
      expect(moduleShape.id).toBe('module');
    });

    it('should render rectangle with «module» stereotype', () => {
      const ctx = createMockContext('Database');
      const svg = moduleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('«module»');
      expect(svg).toContain('<text');
    });
  });

  describe('templateShape', () => {
    it('should have correct id', () => {
      expect(templateShape.id).toBe('template');
    });

    it('should render rectangle with dashed corner indicating template parameter', () => {
      const ctx = createMockContext('Collection<T>');
      const svg = templateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<path'); // Dashed corner
      expect(svg).toContain('<text');
    });
  });

  describe('sendSignalShape', () => {
    it('should have correct id', () => {
      expect(sendSignalShape.id).toBe('send-signal');
    });

    it('should render pentagon pointing right', () => {
      const ctx = createMockContext('Send');
      const svg = sendSignalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('<text');
    });
  });

  describe('receiveSignalShape', () => {
    it('should have correct id', () => {
      expect(receiveSignalShape.id).toBe('receive-signal');
    });

    it('should render concave pentagon pointing left', () => {
      const ctx = createMockContext('Receive');
      const svg = receiveSignalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('<text');
    });
  });

  describe('historyShape', () => {
    it('should have correct id', () => {
      expect(historyShape.id).toBe('history');
    });

    it('should render circle with H inside', () => {
      const ctx = createMockContext();
      const svg = historyShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('H');
    });
  });

  describe('pinShape', () => {
    it('should have correct id', () => {
      expect(pinShape.id).toBe('pin');
    });

    it('should render small square for pin', () => {
      const ctx = createMockContext('pin1');
      const svg = pinShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<text');
    });
  });

  describe('assemblyShape', () => {
    it('should have correct id', () => {
      expect(assemblyShape.id).toBe('assembly');
    });

    it('should render connector symbol', () => {
      const ctx = createMockContext('Asm');
      const svg = assemblyShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<text');
    });
  });

  describe('providedInterfaceShape', () => {
    it('should have correct id', () => {
      expect(providedInterfaceShape.id).toBe('providedInterface');
    });

    it('should render lollipop symbol (circle on stick)', () => {
      const ctx = createMockContext('IService');
      const svg = providedInterfaceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<line');
      expect(svg).toContain('<text');
    });
  });

  describe('requiredInterfaceShape', () => {
    it('should have correct id', () => {
      expect(requiredInterfaceShape.id).toBe('requiredInterface');
    });

    it('should render socket symbol (semicircle)', () => {
      const ctx = createMockContext('IService');
      const svg = requiredInterfaceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('<line');
      expect(svg).toContain('<text');
    });
  });

  describe('frameShape', () => {
    it('should have correct id', () => {
      expect(frameShape.id).toBe('frame');
    });

    it('should render large rectangle with name tag', () => {
      const ctx = createMockContext('Sequence Diagram');
      const svg = frameShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<path'); // Name tag
      expect(svg).toContain('<text');
    });
  });

  describe('collaborationShape', () => {
    it('should have correct id', () => {
      expect(collaborationShape.id).toBe('collaboration');
    });

    it('should render dashed ellipse', () => {
      const ctx = createMockContext('Collaboration');
      const svg = collaborationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<ellipse');
      expect(svg).toContain('stroke-dasharray');
      expect(svg).toContain('<text');
    });
  });

  describe('submachineShape', () => {
    it('should have correct id', () => {
      expect(submachineShape.id).toBe('submachine');
    });

    it('should render rounded rectangle with submachine icon', () => {
      const ctx = createMockContext('SubState');
      const svg = submachineShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<circle'); // Submachine icon
      expect(svg).toContain('<text');
    });
  });

  describe('loopShape', () => {
    it('should have correct id', () => {
      expect(loopShape.id).toBe('loop');
    });

    it('should render rectangle with loop label', () => {
      const ctx = createMockContext('[condition]');
      const svg = loopShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('loop');
      expect(svg).toContain('<text');
    });
  });

  describe('verticalForkShape', () => {
    it('should have correct id', () => {
      expect(verticalForkShape.id).toBe('vertical-fork');
    });

    it('should render vertical thick line for fork/join', () => {
      const ctx = createMockContext();
      const svg = verticalForkShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect'); // Vertical bar
    });
  });
});
