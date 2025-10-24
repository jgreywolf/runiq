import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { bpmnTaskShape } from './task.js';
import { bpmnEventShape } from './event.js';
import { bpmnGatewayShape } from './gateway.js';
import { bpmnDataObjectShape } from './dataObject.js';
import { bpmnMessageShape } from './message.js';
import { bpmnPoolShape } from './pool.js';

function createMockContext(
  label: string = '',
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
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('BPMN Shapes', () => {
  describe('bpmnTask', () => {
    it('should have correct shape id', () => {
      expect(bpmnTaskShape.id).toBe('bpmnTask');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Process Order');
      const bounds = bpmnTaskShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Task');
      const anchors = bpmnTaskShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
      expect(anchors![0].name).toBe('top');
      expect(anchors![1].name).toBe('right');
      expect(anchors![2].name).toBe('bottom');
      expect(anchors![3].name).toBe('left');
    });

    it('should render rounded rectangle', () => {
      const ctx = createMockContext('Send Email');
      const svg = bpmnTaskShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx="8"'); // BPMN standard rounded corners
      expect(svg).toContain('Send Email');
    });

    it('should support task type markers', () => {
      const ctx = createMockContext('User Task', { taskType: 'user' });
      const svg = bpmnTaskShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('User Task');
    });
  });

  describe('bpmnEvent', () => {
    it('should have correct shape id', () => {
      expect(bpmnEventShape.id).toBe('bpmnEvent');
    });

    it('should calculate bounds for event', () => {
      const ctx = createMockContext('Start');
      const bounds = bpmnEventShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBe(bounds.height); // Should be circular
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = bpmnEventShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
    });

    it('should render start event (single circle)', () => {
      const ctx = createMockContext('Start', { eventType: 'start' });
      const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
    });

    it('should render end event (thick circle)', () => {
      const ctx = createMockContext('End', { eventType: 'end' });
      const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke-width="5"'); // Thick border for end events
    });

    it('should render intermediate event (double circle)', () => {
      const ctx = createMockContext('', { eventType: 'intermediate' });
      const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

      // Should have two circles for intermediate events
      const circleMatches = svg.match(/<circle/g);
      expect(circleMatches).toBeTruthy();
      expect(circleMatches!.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('bpmnGateway', () => {
    it('should have correct shape id', () => {
      expect(bpmnGatewayShape.id).toBe('bpmnGateway');
    });

    it('should calculate bounds for gateway', () => {
      const ctx = createMockContext('');
      const bounds = bpmnGatewayShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBe(bounds.height); // Should be square (rotated = diamond)
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = bpmnGatewayShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
    });

    it('should render diamond shape', () => {
      const ctx = createMockContext('');
      const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
    });

    it('should render exclusive gateway with X marker', () => {
      const ctx = createMockContext('', { gatewayType: 'exclusive' });
      const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Diamond
      // Should have X marker
    });

    it('should render parallel gateway with + marker', () => {
      const ctx = createMockContext('', { gatewayType: 'parallel' });
      const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Diamond
      // Should have + marker
    });
  });

  describe('bpmnDataObject', () => {
    it('should have correct shape id', () => {
      expect(bpmnDataObjectShape.id).toBe('bpmnDataObject');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Customer Data');
      const bounds = bpmnDataObjectShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Data');
      const anchors = bpmnDataObjectShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
    });

    it('should render document with folded corner', () => {
      const ctx = createMockContext('Invoice');
      const svg = bpmnDataObjectShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Document shape with fold
      expect(svg).toContain('Invoice');
    });
  });

  describe('bpmnMessage', () => {
    it('should have correct shape id', () => {
      expect(bpmnMessageShape.id).toBe('bpmnMessage');
    });

    it('should calculate bounds for message', () => {
      const ctx = createMockContext('Email');
      const bounds = bpmnMessageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = bpmnMessageShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
    });

    it('should render envelope shape', () => {
      const ctx = createMockContext('Notification');
      const svg = bpmnMessageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect'); // Envelope body
      expect(svg).toContain('<path'); // Envelope flap
    });
  });

  describe('bpmnPool', () => {
    it('should have correct shape id', () => {
      expect(bpmnPoolShape.id).toBe('bpmnPool');
    });

    it('should calculate bounds for pool/lane', () => {
      const ctx = createMockContext('Customer', { width: 800, height: 200 });
      const bounds = bpmnPoolShape.bounds(ctx);

      expect(bounds.width).toBe(800);
      expect(bounds.height).toBe(200);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Lane');
      const anchors = bpmnPoolShape.anchors?.(ctx);

      expect(anchors).toBeDefined();
      expect(anchors!).toHaveLength(4);
    });

    it('should render horizontal lane with label', () => {
      const ctx = createMockContext('Sales Department', {
        width: 600,
        height: 150,
      });
      const svg = bpmnPoolShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('Sales Department');
    });
  });
});
