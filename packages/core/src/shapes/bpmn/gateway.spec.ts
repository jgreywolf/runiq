import { describe, it, expect } from 'vitest';
import { bpmnGatewayShape } from './gateway.js';
import type { ShapeRenderContext } from '../../types/index.js';

// Mock context helper
function createMockContext(gatewayType?: string): ShapeRenderContext {
  return {
    node: {
      id: 'gateway1',
      shape: 'bpmnGateway',
      label: 'Gateway',
      data: gatewayType ? { gatewayType } : undefined,
    },
    style: {
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 14,
    }),
  } as ShapeRenderContext;
}

describe('BPMN Gateway Shape - Markers', () => {
  it('should have correct id', () => {
    expect(bpmnGatewayShape.id).toBe('bpmnGateway');
  });

  it('should render exclusive gateway with X marker', () => {
    const ctx = createMockContext('exclusive');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    expect(svg).toContain('stroke-linecap="round"'); // X marker lines
    // X marker should have two diagonal lines
    expect(
      (svg.match(/stroke-linecap="round"/g) || []).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('should render XOR gateway (alias for exclusive)', () => {
    const ctx = createMockContext('xor');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('stroke-linecap="round"');
  });

  it('should render parallel gateway with + marker', () => {
    const ctx = createMockContext('parallel');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    expect(svg).toContain('stroke-linecap="round"'); // + marker lines
  });

  it('should render AND gateway (alias for parallel)', () => {
    const ctx = createMockContext('and');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('stroke-linecap="round"');
  });

  it('should render inclusive gateway with circle marker', () => {
    const ctx = createMockContext('inclusive');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    expect(svg).toContain('<circle'); // Circle marker
    expect(svg).toContain('fill="none"'); // Unfilled circle
  });

  it('should render OR gateway (alias for inclusive)', () => {
    const ctx = createMockContext('or');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('<circle');
  });

  it('should render event-based gateway with pentagon and circle', () => {
    const ctx = createMockContext('eventBased');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    expect(svg).toContain('<circle'); // Outer circle
    expect(svg).toContain('<polygon'); // Pentagon marker
  });

  it('should render event gateway (alias for eventBased)', () => {
    const ctx = createMockContext('event');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('<circle');
    expect(svg).toContain('<polygon');
  });

  it('should render complex gateway with asterisk marker', () => {
    const ctx = createMockContext('complex');
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    // Asterisk should have 4 lines (vertical, horizontal, and two diagonals)
    expect(svg).toContain('stroke-linecap="round"');
  });

  it('should render gateway with default exclusive marker when type not specified', () => {
    const ctx = createMockContext();
    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Diamond shape
    // Should default to exclusive (X marker)
    expect(svg).toContain('stroke-linecap="round"');
  });

  it('should calculate correct bounds', () => {
    const ctx = createMockContext('parallel');
    const bounds = bpmnGatewayShape.bounds(ctx);

    expect(bounds.width).toBe(50);
    expect(bounds.height).toBe(50);
  });

  it('should provide correct anchors for diamond shape', () => {
    const ctx = createMockContext('inclusive');
    const anchors = bpmnGatewayShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors[0].name).toBe('top');
    expect(anchors[1].name).toBe('right');
    expect(anchors[2].name).toBe('bottom');
    expect(anchors[3].name).toBe('left');

    // Check that anchors are at midpoints
    expect(anchors[0].x).toBe(25); // Center horizontally
    expect(anchors[0].y).toBe(0); // Top edge
    expect(anchors[2].x).toBe(25); // Center horizontally
    expect(anchors[2].y).toBe(50); // Bottom edge
  });

  it('should apply custom fill and stroke colors', () => {
    const ctx = createMockContext('parallel');
    ctx.style.fill = '#ffcc00';
    ctx.style.stroke = '#ff0000';

    const svg = bpmnGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('fill="#ffcc00"');
    expect(svg).toContain('stroke="#ff0000"');
  });
});
