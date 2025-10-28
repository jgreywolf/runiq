import { describe, it, expect } from 'vitest';
import {
  transactionShape,
  eventSubProcessShape,
  callActivityShape,
  startNonInterferingShape,
  intermediateNonInterferingShape,
  conversationShape,
  annotationShape,
} from './bpmn-additions.js';
import type { ShapeRenderContext } from '../../types.js';

function createMockContext(label = 'Test'): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontSize: 14,
      fontFamily: 'sans-serif',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('BPMN Additions', () => {
  describe('transactionShape', () => {
    it('should have correct id', () => {
      expect(transactionShape.id).toBe('transaction');
    });

    it('should render rectangle with double rounded border', () => {
      const ctx = createMockContext('Transaction');
      const svg = transactionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx="'); // Rounded corners
      expect(svg).toContain('Transaction');
    });
  });

  describe('eventSubProcessShape', () => {
    it('should have correct id', () => {
      expect(eventSubProcessShape.id).toBe('event-sub-process');
    });

    it('should render rectangle with rounded corners and dashed border', () => {
      const ctx = createMockContext('Event Sub Process');
      const svg = eventSubProcessShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx="'); // Rounded corners
      expect(svg).toContain('stroke-dasharray'); // Dashed border
      expect(svg).toContain('Event Sub Process');
    });
  });

  describe('callActivityShape', () => {
    it('should have correct id', () => {
      expect(callActivityShape.id).toBe('call-activity');
    });

    it('should render rectangle with thick border', () => {
      const ctx = createMockContext('Call Activity');
      const svg = callActivityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx="'); // Rounded corners
      expect(svg).toContain('Call Activity');
    });
  });

  describe('startNonInterferingShape', () => {
    it('should have correct id', () => {
      expect(startNonInterferingShape.id).toBe('start-non-interfering');
    });

    it('should render unfilled circle with dashed stroke', () => {
      const ctx = createMockContext('Start');
      const svg = startNonInterferingShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill="none"'); // Unfilled
      expect(svg).toContain('stroke-dasharray'); // Dashed
      expect(svg).toContain('Start');
    });
  });

  describe('intermediateNonInterferingShape', () => {
    it('should have correct id', () => {
      expect(intermediateNonInterferingShape.id).toBe(
        'intermediate-non-interfering'
      );
    });

    it('should render double unfilled circle with dashed stroke', () => {
      const ctx = createMockContext('Intermediate');
      const svg = intermediateNonInterferingShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill="none"'); // Unfilled
      expect(svg).toContain('stroke-dasharray'); // Dashed
      // Should have two circles for double border
      const circleMatches = svg.match(/<circle/g);
      expect(circleMatches).toBeDefined();
      expect(circleMatches!.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('conversationShape', () => {
    it('should have correct id', () => {
      expect(conversationShape.id).toBe('conversation');
    });

    it('should render hexagon/diamond shape', () => {
      const ctx = createMockContext('Conversation');
      const svg = conversationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('Conversation');
    });
  });

  describe('annotationShape', () => {
    it('should have correct id', () => {
      expect(annotationShape.id).toBe('annotation');
    });

    it('should render text annotation with bracket', () => {
      const ctx = createMockContext('Annotation text');
      const svg = annotationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Bracket shape
      expect(svg).toContain('Annotation text');
    });
  });
});
