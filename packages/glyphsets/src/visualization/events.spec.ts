import { describe, it, expect } from 'vitest';
import { eventsGlyphSet } from './events';

describe('Events', () => {
  it('generates horizontal event sequence', () => {
    const result = eventsGlyphSet.generator({
      events: ['Q1', 'Q2', 'Q3', 'Q4'],
    });

    expect(result.direction).toBe('LR');
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);
  });

  it('respects showConnections parameter', () => {
    const result = eventsGlyphSet.generator({
      events: ['Event 1', 'Event 2', 'Event 3'],
      showConnections: false,
    });

    expect(result.edges).toHaveLength(0);
  });

  it('validates minimum events', () => {
    expect(() => {
      eventsGlyphSet.generator({ events: ['Only One'] });
    }).toThrow('at least 2 events');
  });

  it('handles maximum events', () => {
    const events = Array.from({ length: 10 }, (_, i) => `Event ${i + 1}`);
    const result = eventsGlyphSet.generator({ events });

    expect(result.nodes).toHaveLength(10);
  });
});
