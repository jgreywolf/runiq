import { describe, expect, it } from 'vitest';
import { renderKanban } from './kanban-renderer.js';
import type { KanbanProfile } from '@runiq/core';

describe('renderKanban', () => {
  it('renders empty state when there are no columns', () => {
    const profile: KanbanProfile = {
      type: 'kanban',
      name: 'Empty Kanban',
      columns: [],
    };

    const result = renderKanban(profile);

    expect(result.svg).toContain('No columns defined');
    expect(result.warnings).toHaveLength(0);
  });

  it('renders cards with priority, meta, and overflow stack', () => {
    const profile: KanbanProfile = {
      type: 'kanban',
      name: 'Product Roadmap',
      swimlane: { label: 'Q1 Focus' },
      columns: [
        {
          id: 'backlog',
          label: 'Backlog',
          wipLimit: 2,
          overflow: 'stack',
          maxCards: 1,
          cards: [
            {
              id: 'K1',
              label: 'Customer interviews',
              description: 'Talk to 5 teams about needs',
              priority: 'high',
              assignee: 'Avery',
              estimate: '5d',
              tags: ['research'],
            },
            { id: 'K2', label: 'Design refresh' },
          ],
        },
      ],
    };

    const result = renderKanban(profile);

    expect(result.svg).toContain('Q1 Focus');
    expect(result.svg).toContain('Backlog (2)');
    expect(result.svg).toContain('+1 more');
    expect(result.svg).toContain('fill="#ef4444"');
    expect(result.svg).toContain('Avery | 5d | research');
  });

  it('renders ellipsis overflow when configured', () => {
    const profile: KanbanProfile = {
      type: 'kanban',
      name: 'Overflow',
      columns: [
        {
          id: 'progress',
          label: 'In Progress',
          overflow: 'ellipsis',
          maxCards: 0,
          cards: [{ id: 'K3', label: 'Onboarding update' }],
        },
      ],
    };

    const result = renderKanban(profile);

    expect(result.svg).toContain('+1 more');
  });
});
