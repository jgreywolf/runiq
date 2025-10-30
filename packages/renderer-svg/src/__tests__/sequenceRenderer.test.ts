/**
 * Tests for Sequence Diagram SVG Renderer
 * Following TDD principles - verify SVG rendering correctness
 */

import { describe, it, expect } from 'vitest';
import { renderSequenceDiagram } from '../sequence-renderer.js';
import type { SequenceProfile } from '@runiq/core';

describe('Sequence Diagram Renderer', () => {
  describe('Basic Rendering', () => {
    it('should render minimal sequence diagram with participants', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'Alice', type: 'actor' },
          { id: 'b', name: 'Bob', type: 'entity' },
        ],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.svg).toContain('Alice');
      expect(result.svg).toContain('Bob');
      expect(result.warnings).toHaveLength(0);
    });

    it('should return warning for profile with no participants', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Empty',
        participants: [],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('No participants');
    });

    it('should include title in SVG', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Authentication Flow',
        participants: [{ id: 'user', name: 'User', type: 'actor' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Authentication Flow');
      expect(result.svg).toContain('<title');
    });
  });

  describe('Participant Rendering', () => {
    it('should render all participant types', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'actor', name: 'Actor', type: 'actor' },
          { id: 'entity', name: 'Entity', type: 'entity' },
          { id: 'boundary', name: 'Boundary', type: 'boundary' },
          { id: 'control', name: 'Control', type: 'control' },
          { id: 'database', name: 'Database', type: 'database' },
        ],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Actor');
      expect(result.svg).toContain('Entity');
      expect(result.svg).toContain('Boundary');
      expect(result.svg).toContain('Control');
      expect(result.svg).toContain('Database');
    });

    it('should render participant boxes with correct styling', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A', type: 'actor' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('class="participant-box"');
      expect(result.svg).toContain('class="participant-text"');
    });
  });

  describe('Lifeline Rendering', () => {
    it('should render lifelines for all participants', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      // Should have 2 lifelines (dashed lines)
      const lifelineMatches = result.svg.match(/class="lifeline"/g);
      expect(lifelineMatches).toHaveLength(2);
    });

    it('should render lifelines as dashed lines', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('stroke-dasharray: 5,5');
    });
  });

  describe('Message Rendering', () => {
    it('should render synchronous message with solid arrow', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'Request', type: 'sync' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Request');
      expect(result.svg).toContain('class="message-line"');
      expect(result.svg).toContain('class="message-arrow"');
      // Should NOT have stroke-dasharray for sync
      expect(result.svg).toContain('stroke-dasharray=""');
    });

    it('should render async message with dashed arrow', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'Event', type: 'async' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Event');
      expect(result.svg).toContain('stroke-dasharray="5,5"');
    });

    it('should render return message with dashed line and open arrow', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'b', to: 'a', label: 'Response', type: 'return' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Response');
      expect(result.svg).toContain('stroke-dasharray="5,5"');
      expect(result.svg).toContain('<polyline'); // Open arrow uses polyline
    });

    it('should render create message', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: '<<create>>', type: 'create' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('&lt;&lt;create&gt;&gt;'); // Escaped
    });

    it('should render destroy message', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: '<<destroy>>', type: 'destroy' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('&lt;&lt;destroy&gt;&gt;');
      expect(result.svg).toContain('stroke-dasharray="5,5"');
    });

    it('should render message labels correctly', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'Login Request' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Login Request');
      expect(result.svg).toContain('class="message-text"');
    });

    it('should handle invalid participant references in messages', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [
          { from: 'a', to: 'unknown', label: 'Invalid' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('<!-- Warning: Invalid participant reference');
    });
  });

  describe('Activation Box Rendering', () => {
    it('should render activation box when activate is true', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'Request', activate: true },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('class="activation-box"');
    });

    it('should not render activation box when activate is false', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'Request', activate: false },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).not.toContain('class="activation-box"');
    });
  });

  describe('Note Rendering', () => {
    it('should render note with left position', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
        notes: [
          { text: 'Important note', position: 'left', participants: ['a'] },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Important note');
      expect(result.svg).toContain('class="note-box"');
    });

    it('should render note with right position', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
        notes: [
          { text: 'Side note', position: 'right', participants: ['a'] },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Side note');
    });

    it('should render note spanning multiple participants', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [],
        notes: [
          { text: 'Spanning note', position: 'over', participants: ['a', 'b'] },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('Spanning note');
    });

    it('should handle invalid participant in note', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
        notes: [
          { text: 'Invalid', position: 'left', participants: ['unknown'] },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('<!-- Warning: Invalid participant reference');
    });

    it('should render folded corner on notes', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
        notes: [
          { text: 'Note', position: 'left', participants: ['a'] },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('<polyline'); // Folded corner
    });
  });

  describe('Fragment Rendering', () => {
    it('should render loop fragment', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'M1' },
          { from: 'b', to: 'a', label: 'M2' },
        ],
        fragments: [
          { type: 'loop', label: 'Retry', startAfterMessage: 0, endAfterMessage: 1 },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('class="fragment-box"');
      expect(result.svg).toContain('loop');
      expect(result.svg).toContain('Retry');
    });

    it('should render all fragment types', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'M' },
        ],
        fragments: [
          { type: 'loop', startAfterMessage: 0, endAfterMessage: 0 },
          { type: 'alt', startAfterMessage: 0, endAfterMessage: 0 },
          { type: 'opt', startAfterMessage: 0, endAfterMessage: 0 },
          { type: 'par', startAfterMessage: 0, endAfterMessage: 0 },
          { type: 'critical', startAfterMessage: 0, endAfterMessage: 0 },
          { type: 'break', startAfterMessage: 0, endAfterMessage: 0 },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('loop');
      expect(result.svg).toContain('alt');
      expect(result.svg).toContain('opt');
      expect(result.svg).toContain('par');
      expect(result.svg).toContain('critical');
      expect(result.svg).toContain('break');
    });

    it('should render alt fragment with alternatives', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [
          { from: 'a', to: 'b', label: 'M1' },
          { from: 'b', to: 'a', label: 'Success' },
          { from: 'b', to: 'a', label: 'Failure' },
        ],
        fragments: [
          {
            type: 'alt',
            label: 'Check result',
            startAfterMessage: 0,
            endAfterMessage: 2,
            alternatives: [
              { label: 'Success', startAfterMessage: 0, endAfterMessage: 1 },
              { label: 'Failure', startAfterMessage: 1, endAfterMessage: 2 },
            ],
          },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('alt');
      expect(result.svg).toContain('Success');
      expect(result.svg).toContain('Failure');
      expect(result.svg).toContain('stroke-dasharray="3,3"'); // Alternative divider
    });

    it('should render fragment label tab', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
        messages: [{ from: 'a', to: 'b', label: 'M' }],
        fragments: [
          { type: 'loop', label: 'Test Label', startAfterMessage: 0, endAfterMessage: 0 },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('class="fragment-label-bg"');
      expect(result.svg).toContain('class="fragment-label-text"');
      expect(result.svg).toContain('Test Label');
    });
  });

  describe('Rendering Options', () => {
    it('should respect custom width option', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile, { width: 1200 });
      
      expect(result.svg).toContain('width="1200"');
    });

    it('should respect custom colors', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile, { 
        participantColor: '#FF0000',
        messageColor: '#00FF00',
      });
      
      expect(result.svg).toContain('#FF0000');
      expect(result.svg).toContain('#00FF00');
    });

    it('should use custom title from options', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Default Title',
        participants: [{ id: 'a', name: 'A' }],
        messages: [],
      };

      const result = renderSequenceDiagram(profile, { title: 'Custom Title' });
      
      expect(result.svg).toContain('Custom Title');
    });
  });

  describe('XML Escaping', () => {
    it('should escape XML special characters in labels', () => {
      const profile: SequenceProfile = {
        type: 'sequence',
        astVersion: '1.0',
        title: 'Test <>&"\'',
        participants: [
          { id: 'a', name: 'A&B' },
        ],
        messages: [
          { from: 'a', to: 'a', label: '<script>alert("xss")</script>' },
        ],
      };

      const result = renderSequenceDiagram(profile);
      
      expect(result.svg).toContain('&lt;');
      expect(result.svg).toContain('&gt;');
      expect(result.svg).toContain('&amp;');
      expect(result.svg).toContain('&quot;');
      expect(result.svg).not.toContain('<script>');
    });
  });

  describe('Advanced Features', () => {
    describe('Self Messages', () => {
      it('should render self-message (participant messaging itself)', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Self Message Test',
          participants: [
            { id: 'obj', name: 'Object', type: 'entity' },
          ],
          messages: [
            { from: 'obj', to: 'obj', label: 'self()', type: 'sync' },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('self()');
        // Self-message should have a loop back to same participant
        expect(result.svg).toContain('class="message-line"');
      });
    });

    describe('Lost and Found Messages', () => {
      it('should render lost message (message to nowhere)', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Lost Message Test',
          participants: [
            { id: 'client', name: 'Client', type: 'actor' },
          ],
          messages: [
            { from: 'client', to: 'lost', label: 'broadcast()', type: 'async' },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('broadcast()');
        // Lost message should have a filled circle at the end
        expect(result.svg).toContain('class="lost-message-end"');
      });

      it('should render found message (message from nowhere)', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Found Message Test',
          participants: [
            { id: 'server', name: 'Server', type: 'entity' },
          ],
          messages: [
            { from: 'found', to: 'server', label: 'interrupt', type: 'async' },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('interrupt');
        // Found message should have a filled circle at the start
        expect(result.svg).toContain('class="found-message-start"');
      });
    });

    describe('Guards and Constraints', () => {
      it('should render message with guard condition', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Guard Test',
          participants: [
            { id: 'a', name: 'A', type: 'entity' },
            { id: 'b', name: 'B', type: 'entity' },
          ],
          messages: [
            { 
              from: 'a', 
              to: 'b', 
              label: 'execute', 
              type: 'sync',
              guard: 'x > 0'
            },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('execute');
        expect(result.svg).toContain('[x &gt; 0]');
        expect(result.svg).toContain('class="message-guard"');
      });

      it('should render message with timing constraint', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Timing Test',
          participants: [
            { id: 'a', name: 'A', type: 'entity' },
            { id: 'b', name: 'B', type: 'entity' },
          ],
          messages: [
            { 
              from: 'a', 
              to: 'b', 
              label: 'request', 
              type: 'sync',
              timing: 't < 5s'
            },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('request');
        expect(result.svg).toContain('{t &lt; 5s}');
        expect(result.svg).toContain('class="message-timing"');
      });

      it('should render message with both guard and timing', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Guard + Timing Test',
          participants: [
            { id: 'a', name: 'A', type: 'entity' },
            { id: 'b', name: 'B', type: 'entity' },
          ],
          messages: [
            { 
              from: 'a', 
              to: 'b', 
              label: 'criticalOp', 
              type: 'sync',
              guard: 'authorized',
              timing: 'deadline = 100ms'
            },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('criticalOp');
        expect(result.svg).toContain('[authorized]');
        expect(result.svg).toContain('{deadline = 100ms}');
      });
    });

    describe('Complex Scenarios', () => {
      it('should handle all advanced features together', () => {
        const profile: SequenceProfile = {
          type: 'sequence',
          astVersion: '1.0',
          title: 'Complex Sequence',
          participants: [
            { id: 'client', name: 'Client', type: 'actor' },
            { id: 'server', name: 'Server', type: 'entity' },
          ],
          messages: [
            { from: 'client', to: 'server', label: 'login', guard: 'credentials valid' },
            { from: 'server', to: 'server', label: 'validate()' },
            { from: 'server', to: 'lost', label: 'audit log', type: 'async' },
            { from: 'found', to: 'client', label: 'timeout' },
          ],
          fragments: [
            { type: 'opt', label: 'authentication', startAfterMessage: 0, endAfterMessage: 1 },
          ],
          notes: [
            { text: 'Security check', position: 'right', participants: ['server'] },
          ],
        };

        const result = renderSequenceDiagram(profile);
        
        expect(result.svg).toContain('login');
        expect(result.svg).toContain('[credentials valid]');
        expect(result.svg).toContain('validate()');
        expect(result.svg).toContain('audit log');
        expect(result.svg).toContain('timeout');
        expect(result.svg).toContain('opt');
        expect(result.svg).toContain('Security check');
      });
    });
  });
});
