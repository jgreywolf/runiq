import { describe, it, expect } from 'vitest';
import { renderTimeline } from './timeline-renderer';
import type { TimelineProfile } from '@runiq/core';

describe('Timeline Renderer', () => {
  describe('Basic Rendering', () => {
    it('should render horizontal timeline with events', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Test Timeline',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Event 1',
          },
          {
            id: 'E2',
            date: '2024-02-01',
            label: 'Event 2',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.svg).toContain('Test Timeline');
      expect(result.svg).toContain('Event 1');
      expect(result.svg).toContain('Event 2');
      expect(result.svg).toContain('runiq-timeline-axis');
      expect(result.svg).toContain('runiq-timeline-event');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render vertical timeline with events', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Vertical Timeline',
        orientation: 'vertical',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'First',
          },
          {
            id: 'E2',
            date: '2024-06-01',
            label: 'Last',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Vertical Timeline');
      expect(result.svg).toContain('First');
      expect(result.svg).toContain('Last');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render timeline with periods', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Timeline with Periods',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Start',
          },
          {
            id: 'E2',
            date: '2024-06-01',
            label: 'End',
          },
        ],
        periods: [
          {
            id: 'P1',
            startDate: '2024-01-15',
            endDate: '2024-03-15',
            label: 'Phase 1',
          },
          {
            id: 'P2',
            startDate: '2024-03-15',
            endDate: '2024-06-01',
            label: 'Phase 2',
            fillColor: '#DBEAFE',
            opacity: 0.5,
          },
        ],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('Phase 1');
      expect(result.svg).toContain('Phase 2');
      expect(result.svg).toContain('runiq-timeline-period');
      expect(result.svg).toContain('#DBEAFE');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render events with descriptions', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Timeline with Descriptions',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Launch',
            description: 'Product launch event',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('Launch');
      expect(result.svg).toContain('Product launch event');
      expect(result.svg).toContain('runiq-timeline-event-description');
    });

    it('should render events with custom colors', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Colored Timeline',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Green Event',
            fillColor: '#10B981',
          },
          {
            id: 'E2',
            date: '2024-02-01',
            label: 'Blue Event',
            fillColor: '#3B82F6',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('#10B981');
      expect(result.svg).toContain('#3B82F6');
    });

    it('should handle empty events with warning', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Empty Timeline',
        orientation: 'horizontal',
        events: [],
        periods: [],
      };

      const result = renderTimeline(profile);

      expect(result.warnings).toContain('Timeline has no events');
      expect(result.warnings).toContain(
        'Cannot render timeline with no events'
      );
      expect(result.svg).toBe('');
    });

    it('should sort events by date', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Unsorted Timeline',
        orientation: 'horizontal',
        events: [
          {
            id: 'E3',
            date: '2024-03-01',
            label: 'Third',
          },
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'First',
          },
          {
            id: 'E2',
            date: '2024-02-01',
            label: 'Second',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile);

      // Events should be rendered in chronological order
      const firstPos = result.svg.indexOf('First');
      const secondPos = result.svg.indexOf('Second');
      const thirdPos = result.svg.indexOf('Third');

      expect(firstPos).toBeLessThan(secondPos);
      expect(secondPos).toBeLessThan(thirdPos);
    });
  });

  describe('Gantt Rendering', () => {
    it('should render tasks and milestones in lanes', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Gantt Plan',
        orientation: 'horizontal',
        events: [],
        periods: [
          {
            id: 'phase1',
            startDate: '2024-01-01',
            endDate: '2024-03-01',
            label: 'Phase 1',
          },
        ],
        lanes: [
          { id: 'platform', label: 'Platform' },
        ],
        tasks: [
          {
            id: 'build',
            startDate: '2024-01-05',
            endDate: '2024-02-10',
            label: 'Build',
            lane: 'platform',
          },
        ],
        milestones: [
          {
            id: 'beta',
            date: '2024-02-15',
            label: 'Beta',
            lane: 'platform',
          },
        ],
        dependencies: [
          { from: 'build', to: 'beta' },
        ],
      };

      const result = renderTimeline(profile);

      expect(result.svg).toContain('runiq-timeline-task');
      expect(result.svg).toContain('runiq-timeline-milestone');
      expect(result.svg).toContain('runiq-timeline-dependency');
      expect(result.svg).toContain('Platform');
      expect(result.svg).toContain('Build');
      expect(result.svg).toContain('Beta');
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn when tasks are missing dates', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Invalid Gantt',
        orientation: 'horizontal',
        events: [],
        tasks: [
          {
            id: 'broken',
            startDate: 'invalid',
            endDate: '2024-02-10',
            label: 'Broken',
          },
        ],
        milestones: [],
      };

      const result = renderTimeline(profile);

      expect(result.warnings.some((warning) => warning.includes('Invalid date'))).toBe(true);
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Date Format Test',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Event',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile, { showDates: true });

      // Check that date is displayed (may be off by timezone)
      expect(result.svg).toMatch(/2024-01-(14|15)/);
    });

    it('should hide dates when showDates is false', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'No Dates',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Event',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile, { showDates: false });

      // Should not contain actual date text element (CSS class is OK)
      const hasDateText =
        result.svg.includes('<text') && result.svg.match(/2024-01-\d{2}/);
      expect(hasDateText).toBeFalsy();
    });
  });

  describe('Custom Options', () => {
    it('should apply custom dimensions', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Custom Size',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Event',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile, { width: 800, height: 300 });

      expect(result.svg).toContain('width="800"');
      expect(result.svg).toContain('height="300"');
    });

    it('should apply custom title', () => {
      const profile: TimelineProfile = {
        type: 'timeline',
        astVersion: '1.0.0',
        title: 'Original Title',
        orientation: 'horizontal',
        events: [
          {
            id: 'E1',
            date: '2024-01-15',
            label: 'Event',
          },
        ],
        periods: [],
      };

      const result = renderTimeline(profile, { title: 'Custom Title' });

      expect(result.svg).toContain('Custom Title');
      expect(result.svg).not.toContain('Original Title');
    });
  });
});
