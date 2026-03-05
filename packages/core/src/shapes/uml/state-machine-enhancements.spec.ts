import { describe, it, expect } from 'vitest';
import { stateShape } from './state.js';
import { historyShallowShape, historyDeepShape } from './history-states.js';
import {
  junctionShape,
  entryPointShape,
  exitPointShape,
  terminateShape,
} from './state-pseudostates.js';
import type { RenderContext } from '../../types/index.js';

// Mock context helper
function createMockContext(
  label: string,
  data?: Record<string, unknown>,
  nodeProps?: Partial<{
    entry: string;
    exit: string;
    doActivity: string;
  }>
): RenderContext {
  return {
    node: {
      id: 'test',
      shape: 'state',
      label,
      ...nodeProps,
      data,
    },
    style: {
      fontSize: 14,
      fontFamily: 'Arial',
      padding: 12,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 14,
    }),
  } as RenderContext;
}

describe('State Machine Enhancements', () => {
  describe('stateShape with entry/exit/doActivity', () => {
    it('should have correct id', () => {
      expect(stateShape.id).toBe('state');
    });

    it('should render state with entry action', () => {
      const ctx = createMockContext('Processing', undefined, {
        entry: 'startProcess()',
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Processing');
      expect(svg).toContain('entry / startProcess()');
    });

    it('should render state with exit action', () => {
      const ctx = createMockContext('Processing', undefined, {
        exit: 'cleanup()',
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Processing');
      expect(svg).toContain('exit / cleanup()');
    });

    it('should render state with doActivity', () => {
      const ctx = createMockContext('Processing', undefined, {
        doActivity: 'processData()',
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Processing');
      expect(svg).toContain('do / processData()');
    });

    it('should render state with all behaviors', () => {
      const ctx = createMockContext('Processing', undefined, {
        entry: 'startProcess()',
        doActivity: 'processData()',
        exit: 'cleanup()',
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Processing');
      expect(svg).toContain('entry / startProcess()');
      expect(svg).toContain('do / processData()');
      expect(svg).toContain('exit / cleanup()');
    });

    it('should calculate bounds with behaviors', () => {
      const ctx = createMockContext('Processing', undefined, {
        entry: 'startProcess()',
        doActivity: 'processData()',
        exit: 'cleanup()',
      });
      const bounds = stateShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(50);
      // Should be taller due to behaviors
      expect(bounds.height).toBeGreaterThan(100);
    });

    it('should fallback to legacy data.activities', () => {
      const ctx = createMockContext('Processing', {
        activities: ['entry / oldStyle()', 'do / legacy()'],
      });
      const svg = stateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('entry / oldStyle()');
      expect(svg).toContain('do / legacy()');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Processing');
      const anchors = stateShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });
  });

  describe('historyShallowShape', () => {
    it('should have correct id', () => {
      expect(historyShallowShape.id).toBe('historyShallow');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext('');
      const bounds = historyShallowShape.bounds(ctx);

      expect(bounds.width).toBe(30);
      expect(bounds.height).toBe(30);
    });

    it('should render circle with H', () => {
      const ctx = createMockContext('');
      const svg = historyShallowShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('>H</text>');
      expect(svg).toContain('class="historyShallow-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = historyShallowShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });
  });

  describe('historyDeepShape', () => {
    it('should have correct id', () => {
      expect(historyDeepShape.id).toBe('historyDeep');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext('');
      const bounds = historyDeepShape.bounds(ctx);

      expect(bounds.width).toBe(30);
      expect(bounds.height).toBe(30);
    });

    it('should render circle with H*', () => {
      const ctx = createMockContext('');
      const svg = historyDeepShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('>H*</text>');
      expect(svg).toContain('class="historyDeep-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = historyDeepShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });
  });

  describe('junctionShape', () => {
    it('should have correct id', () => {
      expect(junctionShape.id).toBe('junction');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext('');
      const bounds = junctionShape.bounds(ctx);

      expect(bounds.width).toBe(16);
      expect(bounds.height).toBe(16);
    });

    it('should render filled circle', () => {
      const ctx = createMockContext('');
      const svg = junctionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill='); // Junction uses style fill (defaults to white in test, black in real usage)
      expect(svg).toContain('class="junction-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = junctionShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });
  });

  describe('entryPointShape', () => {
    it('should have correct id', () => {
      expect(entryPointShape.id).toBe('entryPoint');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext();
      const bounds = entryPointShape.bounds(ctx);

      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should render small circle', () => {
      const ctx = createMockContext('');
      const svg = entryPointShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('class="entryPoint-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = entryPointShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });
  });

  describe('exitPointShape', () => {
    it('should have correct id', () => {
      expect(exitPointShape.id).toBe('exitPoint');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext();
      const bounds = exitPointShape.bounds(ctx);

      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should render circle with X', () => {
      const ctx = createMockContext('');
      const svg = exitPointShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<line'); // X mark
      expect(svg).toContain('class="exitPoint-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = exitPointShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });
  });

  describe('terminateShape', () => {
    it('should have correct id', () => {
      expect(terminateShape.id).toBe('terminate');
    });

    it('should calculate fixed bounds', () => {
      const ctx = createMockContext('');
      const bounds = terminateShape.bounds(ctx);

      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should render circle with X', () => {
      const ctx = createMockContext('');
      const svg = terminateShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<line'); // X mark
      expect(svg).toContain('class="terminate-shape"');
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('');
      const anchors = terminateShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });
  });
});
