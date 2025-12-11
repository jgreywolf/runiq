import { describe, expect, it } from 'vitest';
import { parseTimelineProfile } from './test-utils/profile-helpers.js';

describe('Timeline Profile Tests', () => {
  describe('Basic Timeline Parsing', () => {
    it('should parse timeline with events', () => {
      const dsl = `
        timeline "Project Launch" {
          event E1 date:"2024-01-15" label:"Kickoff"
          event E2 date:"2024-02-01" label:"Requirements"
        }
      `;

      const profile = parseTimelineProfile(dsl);
      expect(profile.title).toBe('Project Launch');

      if (profile) {
        expect(profile.events).toHaveLength(2);
        expect(profile.events[0]).toMatchObject({
          id: 'E1',
          date: '2024-01-15',
          label: 'Kickoff',
        });
        expect(profile.events[1]).toMatchObject({
          id: 'E2',
          date: '2024-02-01',
          label: 'Requirements',
        });
      }
    });

    it('should parse timeline with full event properties', () => {
      const dsl = `
        timeline "Complete Timeline" {
          event E1
            date:"2024-01-15"
            label:"Launch"
            description:"Product launch event"
            icon:"rocket"
            textColor:"#10b981"
            position:top
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.events[0]).toMatchObject({
          id: 'E1',
          date: '2024-01-15',
          label: 'Launch',
          description: 'Product launch event',
          icon: 'rocket',
          fillColor: '#10b981',
          position: 'top',
        });
      }
    });

    it('should parse timeline with periods', () => {
      const dsl = `
        timeline "Project Phases" {
          period P1 
            startDate:"2024-01-01" 
            endDate:"2024-03-01" 
            label:"Planning"
          period P2
            startDate:"2024-03-01"
            endDate:"2024-06-01"
            label:"Development"
            textColor:"#dbeafe"
            opacity:0.5
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.periods).toHaveLength(2);
        expect(profile.periods![0]).toMatchObject({
          id: 'P1',
          startDate: '2024-01-01',
          endDate: '2024-03-01',
          label: 'Planning',
        });
        expect(profile.periods![1]).toMatchObject({
          id: 'P2',
          startDate: '2024-03-01',
          endDate: '2024-06-01',
          label: 'Development',
          fillColor: '#dbeafe',
          opacity: 0.5,
        });
      }
    });

    it('should parse timeline with both events and periods', () => {
      const dsl = `
        timeline "Full Timeline" {
          event E1 date:"2024-01-15" label:"Start"
          event E2 date:"2024-06-01" label:"End"
          
          period P1 startDate:"2024-01-15" endDate:"2024-06-01" label:"Duration"
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.events).toHaveLength(2);
        expect(profile.periods).toHaveLength(1);
      }
    });

    it('should parse timeline with orientation', () => {
      const dsl = `
        timeline "Vertical Timeline" {
          orientation vertical
          event E1 date:"2024-01-15" label:"Event 1"
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.orientation).toBe('vertical');
        expect(profile.events).toHaveLength(1);
      }
    });

    it('should default to horizontal orientation', () => {
      const dsl = `
        timeline "Default Timeline" {
          event E1 date:"2024-01-15" label:"Event 1"
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.orientation).toBe('horizontal');
      }
    });
  });

  describe('Timeline Validation', () => {
    it('should parse complex timeline example', () => {
      const dsl = `
        timeline "Software Project Launch" {
          event kickoff date:"2024-01-15" label:"Project Kickoff" description:"Initial team meeting" icon:"flag"
          event requirements date:"2024-02-01" label:"Requirements Complete"
          event design date:"2024-02-20" label:"Design Approved" textColor:"#3b82f6"
          event devStart date:"2024-03-01" label:"Development Starts"
          event alpha date:"2024-04-15" label:"Alpha Release" textColor:"#f59e0b"
          event beta date:"2024-05-01" label:"Beta Release" textColor:"#f59e0b"
          event launch date:"2024-06-01" label:"Product Launch" icon:"rocket" textColor:"#10b981"

          period planning startDate:"2024-01-15" endDate:"2024-02-28" label:"Planning Phase" textColor:"#e0e7ff"
          period development startDate:"2024-03-01" endDate:"2024-05-31" label:"Development Phase" textColor:"#dbeafe"
          period testing startDate:"2024-04-15" endDate:"2024-05-31" label:"Testing Period" textColor:"#fef3c7"
          
          orientation horizontal
        }
      `;

      const profile = parseTimelineProfile(dsl);
      if (profile) {
        expect(profile.title).toBe('Software Project Launch');
        expect(profile.events).toHaveLength(7);
        expect(profile.periods).toHaveLength(3);
        expect(profile.orientation).toBe('horizontal');
      }
    });
  });
});
