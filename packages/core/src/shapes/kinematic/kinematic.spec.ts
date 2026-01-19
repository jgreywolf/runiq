import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  camShape,
  camFollowerShape,
  gripperAngularShape,
  gripperParallelShape,
  gripperVacuumShape,
  leverShape,
  pulleyShape,
  toolChangerShape,
  toolMountShape,
} from './index.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'shape', label, data },
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

describe('Kinematic Shapes', () => {
  it('should render parallel gripper', () => {
    const ctx = createMockContext('Gripper');
    const svg = gripperParallelShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<rect');
    expect(svg).toContain('Gripper');
  });

  it('should render angular gripper', () => {
    const ctx = createMockContext('Gripper');
    const svg = gripperAngularShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<line');
  });

  it('should render tool mount', () => {
    const ctx = createMockContext('Tool');
    const svg = toolMountShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<circle');
  });

  it('should render cam', () => {
    const ctx = createMockContext('Cam');
    const svg = camShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<circle');
  });

  it('should render vacuum gripper', () => {
    const ctx = createMockContext('Vacuum');
    const svg = gripperVacuumShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<circle');
  });

  it('should render tool changer', () => {
    const ctx = createMockContext('Changer');
    const svg = toolChangerShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<rect');
  });

  it('should render cam follower', () => {
    const ctx = createMockContext('Follower');
    const svg = camFollowerShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<circle');
  });

  it('should render pulley', () => {
    const ctx = createMockContext('Pulley');
    const svg = pulleyShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<line');
  });

  it('should render lever', () => {
    const ctx = createMockContext('Lever');
    const svg = leverShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('<line');
  });
});
