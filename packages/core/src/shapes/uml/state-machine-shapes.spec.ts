import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { stateShape } from './state.js';
import { initialStateShape } from './initialState.js';
import { finalStateShape } from './finalState.js';
import { choiceShape } from './choice.js';
import { forkShape } from './fork.js';
import { joinShape } from './join.js';

// Mock render context helper
function createMockContext(label: string = '', data: Record<string, unknown> = {}): ShapeRenderContext {
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

describe('UML State Machine Shapes', () => {
  describe('stateShape', () => {
    it('should have correct id', () => {
      expect(stateShape.id).toBe('state');
    });

    it('should calculate bounds with rounded corners', () => {
      const ctx = createMockContext('Idle');
      const bounds = stateShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(60);
      expect(bounds.height).toBeGreaterThan(30);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Processing');
      const anchors = stateShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
      expect(anchors[1].name).toBe('right');
      expect(anchors[2].name).toBe('bottom');
      expect(anchors[3].name).toBe('left');
    });

    it('should render rounded rectangle with state name', () => {
      const ctx = createMockContext('Active');
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx=');
      expect(svg).toContain('Active');
    });

    it('should support internal activities', () => {
      const ctx = createMockContext('Processing', {
        activities: ['entry / startTimer()', 'do / process()', 'exit / stopTimer()'],
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('entry / startTimer()');
      expect(svg).toContain('do / process()');
      expect(svg).toContain('exit / stopTimer()');
    });
  });

  describe('initialStateShape', () => {
    it('should have correct id', () => {
      expect(initialStateShape.id).toBe('initialState');
    });

    it('should calculate bounds as small filled circle', () => {
      const ctx = createMockContext();
      const bounds = initialStateShape.bounds(ctx);

      // Initial state is typically 16-20px diameter
      expect(bounds.width).toBeLessThan(25);
      expect(bounds.height).toBeLessThan(25);
      expect(bounds.width).toBe(bounds.height); // Should be circular
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = initialStateShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render filled circle', () => {
      const ctx = createMockContext();
      const svg = initialStateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill="#000000"') || expect(svg).toContain('fill="black"');
    });
  });

  describe('finalStateShape', () => {
    it('should have correct id', () => {
      expect(finalStateShape.id).toBe('finalState');
    });

    it('should calculate bounds as bullseye', () => {
      const ctx = createMockContext();
      const bounds = finalStateShape.bounds(ctx);

      // Final state is typically 20-24px diameter
      expect(bounds.width).toBeLessThan(30);
      expect(bounds.height).toBeLessThan(30);
      expect(bounds.width).toBe(bounds.height); // Should be circular
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = finalStateShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render bullseye (outer circle with inner filled circle)', () => {
      const ctx = createMockContext();
      const svg = finalStateShape.render(ctx, { x: 0, y: 0 });

      // Should have 2 circles
      const circleCount = (svg.match(/<circle/g) || []).length;
      expect(circleCount).toBe(2);
      expect(svg).toContain('fill="#000000"') || expect(svg).toContain('fill="black"');
    });
  });

  describe('choiceShape', () => {
    it('should have correct id', () => {
      expect(choiceShape.id).toBe('choice');
    });

    it('should calculate bounds as diamond', () => {
      const ctx = createMockContext();
      const bounds = choiceShape.bounds(ctx);

      // Choice is a small diamond, typically 20-30px
      expect(bounds.width).toBeLessThan(40);
      expect(bounds.height).toBeLessThan(40);
      expect(bounds.width).toBe(bounds.height); // Should be square diamond
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = choiceShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render diamond shape', () => {
      const ctx = createMockContext();
      const svg = choiceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path') || expect(svg).toContain('<polygon');
      expect(svg).toContain('M') || expect(svg).toContain('points');
    });

    it('should support guard conditions', () => {
      const ctx = createMockContext('[x > 0]');
      const svg = choiceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('[x > 0]');
    });
  });

  describe('forkShape', () => {
    it('should have correct id', () => {
      expect(forkShape.id).toBe('fork');
    });

    it('should calculate bounds as horizontal bar', () => {
      const ctx = createMockContext();
      const bounds = forkShape.bounds(ctx);

      // Fork is a thick horizontal bar
      expect(bounds.width).toBeGreaterThan(bounds.height);
      expect(bounds.height).toBeLessThan(15); // Thick bar, but not too tall
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = forkShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render thick horizontal bar', () => {
      const ctx = createMockContext();
      const svg = forkShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('fill="#000000"') || expect(svg).toContain('fill="black"');
    });

    it('should support custom width', () => {
      const ctx = createMockContext('', { width: 150 });
      const bounds = forkShape.bounds(ctx);

      expect(bounds.width).toBe(150);
    });
  });

  describe('joinShape', () => {
    it('should have correct id', () => {
      expect(joinShape.id).toBe('join');
    });

    it('should calculate bounds as horizontal bar', () => {
      const ctx = createMockContext();
      const bounds = joinShape.bounds(ctx);

      // Join is identical to fork - thick horizontal bar
      expect(bounds.width).toBeGreaterThan(bounds.height);
      expect(bounds.height).toBeLessThan(15);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = joinShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render thick horizontal bar', () => {
      const ctx = createMockContext();
      const svg = joinShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('fill="#000000"') || expect(svg).toContain('fill="black"');
    });

    it('should support custom width', () => {
      const ctx = createMockContext('', { width: 150 });
      const bounds = joinShape.bounds(ctx);

      expect(bounds.width).toBe(150);
    });
  });
});
