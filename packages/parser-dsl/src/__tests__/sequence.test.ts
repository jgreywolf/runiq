/**
 * Tests for Sequence Profile Parsing
 * Following TDD principles - these tests verify the parser correctly
 * transforms Langium AST to SequenceProfile TypeScript types
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../index.js';
import type { SequenceProfile, SequenceParticipant, SequenceMessage, SequenceNote, SequenceFragment } from '@runiq/core';

describe('Sequence Profile Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse a minimal sequence diagram with participants', () => {
      const source = `
        sequence "Test Diagram" {
          participant "User" as actor
          participant "System" as entity
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.document!.profiles).toHaveLength(1);

      const profile = result.document!.profiles[0] as SequenceProfile;
      expect(profile.type).toBe('sequence');
      expect(profile.title).toBe('Test Diagram');
      expect(profile.participants).toHaveLength(2);
    });

    it('should report errors for invalid syntax', () => {
      const source = `
        sequence "Test" {
          invalid syntax here
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Participant Parsing', () => {
    it('should parse participant with actor type', () => {
      const source = `
        sequence "Test" {
          participant "User" as actor
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const participant = profile.participants[0];

      expect(participant.id).toBe('user');
      expect(participant.name).toBe('User');
      expect(participant.type).toBe('actor');
    });

    it('should parse participant with entity type (default)', () => {
      const source = `
        sequence "Test" {
          participant "Web Server"
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const participant = profile.participants[0];

      expect(participant.id).toBe('web_server');
      expect(participant.name).toBe('Web Server');
      expect(participant.type).toBe('entity');
    });

    it('should parse all participant types', () => {
      const source = `
        sequence "Test" {
          participant "Actor" as actor
          participant "Entity" as entity
          participant "Boundary" as boundary
          participant "Control" as control
          participant "Database" as database
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;

      expect(profile.participants).toHaveLength(5);
      expect(profile.participants[0].type).toBe('actor');
      expect(profile.participants[1].type).toBe('entity');
      expect(profile.participants[2].type).toBe('boundary');
      expect(profile.participants[3].type).toBe('control');
      expect(profile.participants[4].type).toBe('database');
    });

    it('should generate IDs from names correctly', () => {
      const source = `
        sequence "Test" {
          participant "User Account Service"
          participant "API-Gateway"
          participant "db_primary"
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;

      expect(profile.participants[0].id).toBe('user_account_service');
      expect(profile.participants[1].id).toBe('api-gateway');
      expect(profile.participants[2].id).toBe('db_primary');
    });
  });

  describe('Message Parsing', () => {
    it('should parse synchronous message', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"A" to:"B" label:"Request" type:sync
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.from).toBe('a');
      expect(message.to).toBe('b');
      expect(message.label).toBe('Request');
      expect(message.type).toBe('sync');
    });

    it('should parse async message', () => {
      const source = `
        sequence "Test" {
          participant "Pub"
          participant "Sub"
          message from:"Pub" to:"Sub" label:"Event" type:async
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.type).toBe('async');
    });

    it('should parse return message', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"B" to:"A" label:"Result" type:return
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.type).toBe('return');
    });

    it('should parse create message', () => {
      const source = `
        sequence "Test" {
          participant "Factory"
          participant "Object"
          message from:"Factory" to:"Object" label:"<<create>>" type:create
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.type).toBe('create');
    });

    it('should parse destroy message', () => {
      const source = `
        sequence "Test" {
          participant "Manager"
          participant "Resource"
          message from:"Manager" to:"Resource" label:"<<destroy>>" type:destroy
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.type).toBe('destroy');
    });

    it('should parse message with activation', () => {
      const source = `
        sequence "Test" {
          participant "Client"
          participant "Server"
          message from:"Client" to:"Server" label:"Request" type:sync activate:true
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.activate).toBe(true);
    });

    it('should default to sync type when not specified', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"A" to:"B" label:"Call"
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const message = profile.messages[0];

      expect(message.type).toBe('sync');
    });
  });

  describe('Note Parsing', () => {
    it('should parse note with left position', () => {
      const source = `
        sequence "Test" {
          participant "A"
          note "This is a note" position:left participants:("A")
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const note = profile.notes![0];

      expect(note.text).toBe('This is a note');
      expect(note.position).toBe('left');
      expect(note.participants).toEqual(['a']);
    });

    it('should parse note with right position', () => {
      const source = `
        sequence "Test" {
          participant "Server"
          note "Note text" position:right participants:("Server")
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const note = profile.notes![0];

      expect(note.position).toBe('right');
    });

    it('should parse note with over position', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          note "Spanning note" position:over participants:("A","B")
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const note = profile.notes![0];

      expect(note.position).toBe('over');
      expect(note.participants).toEqual(['a', 'b']);
    });

    it('should handle notes with multiple participants', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          participant "C"
          note "Multi-participant note" position:over participants:("A","B","C")
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const note = profile.notes![0];

      expect(note.participants).toHaveLength(3);
      expect(note.participants).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Fragment Parsing', () => {
    it('should parse loop fragment', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"A" to:"B" label:"M1" type:sync
          fragment loop "Retry logic" from:0 to:2
          message from:"B" to:"A" label:"M2" type:return
        }
      `;

      const result = parse(source);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const fragment = profile.fragments![0];

      expect(fragment.type).toBe('loop');
      expect(fragment.label).toBe('Retry logic');
      expect(fragment.startAfterMessage).toBe(0);
      expect(fragment.endAfterMessage).toBe(2);
    });

    it('should parse all fragment types', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"A" to:"B" label:"M1" type:sync
          message from:"B" to:"A" label:"M2" type:return
          fragment loop "Loop" from:0 to:1
          fragment alt "Alt" from:0 to:1 alternatives:("A":0..0,"B":1..1)
          fragment opt "Opt" from:0 to:1
          fragment par "Par" from:0 to:1
          fragment critical "Critical" from:0 to:1
          fragment break "Break" from:0 to:1
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(true);
      const profile = result.document!.profiles[0] as SequenceProfile;

      expect(profile.fragments).toHaveLength(6);
      expect(profile.fragments![0].type).toBe('loop');
      expect(profile.fragments![1].type).toBe('alt');
      expect(profile.fragments![2].type).toBe('opt');
      expect(profile.fragments![3].type).toBe('par');
      expect(profile.fragments![4].type).toBe('critical');
      expect(profile.fragments![5].type).toBe('break');
    });

    it('should parse alt fragment with alternatives', () => {
      const source = `
        sequence "Test" {
          participant "A"
          participant "B"
          message from:"A" to:"B" label:"M1" type:sync
          message from:"B" to:"A" label:"Success" type:return
          message from:"B" to:"A" label:"Failure" type:return
          fragment alt "Check result" from:0 to:2 alternatives:("Success":0..1,"Failure":1..2)
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(true);
      const profile = result.document!.profiles[0] as SequenceProfile;
      const fragment = profile.fragments![0];

      expect(fragment.alternatives).toBeDefined();
      expect(fragment.alternatives).toHaveLength(2);
      expect(fragment.alternatives![0].label).toBe('Success');
      expect(fragment.alternatives![0].startAfterMessage).toBe(0);
      expect(fragment.alternatives![0].endAfterMessage).toBe(1);
      expect(fragment.alternatives![1].label).toBe('Failure');
    });
  });

  describe('Complex Scenarios', () => {
    it('should parse complete authentication flow', () => {
      const source = `
        sequence "Authentication" {
          participant "User" as actor
          participant "App" as boundary
          participant "Auth" as control
          participant "DB" as database

          message from:"User" to:"App" label:"Login" type:sync
          message from:"App" to:"Auth" label:"Validate" type:sync activate:true
          message from:"Auth" to:"DB" label:"Query" type:sync
          message from:"DB" to:"Auth" label:"User data" type:return
          message from:"Auth" to:"App" label:"Token" type:return
          message from:"App" to:"User" label:"Success" type:return

          note "Session stored" position:right participants:("App")
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(true);

      const profile = result.document!.profiles[0] as SequenceProfile;
      expect(profile.participants).toHaveLength(4);
      expect(profile.messages).toHaveLength(6);
      expect(profile.notes).toHaveLength(1);
      
      // Verify participant types
      expect(profile.participants[0].type).toBe('actor');
      expect(profile.participants[1].type).toBe('boundary');
      expect(profile.participants[2].type).toBe('control');
      expect(profile.participants[3].type).toBe('database');

      // Verify activation
      expect(profile.messages[1].activate).toBe(true);
    });

    it('should parse diagram with mixed fragments', () => {
      const source = `
        sequence "Complex Flow" {
          participant "Client"
          participant "Server"

          fragment loop "Retry" from:0 to:2
          message from:"Client" to:"Server" label:"Request" type:sync
          message from:"Server" to:"Client" label:"Response" type:return

          fragment opt "Cache" from:3 to:4
          message from:"Server" to:"Server" label:"Check cache" type:sync

          note "Implementation notes" position:over participants:("Client","Server")
        }
      `;

      const result = parse(source);
      expect(result.success).toBe(true);

      const profile = result.document!.profiles[0] as SequenceProfile;
      expect(profile.messages).toHaveLength(3);
      expect(profile.fragments).toHaveLength(2);
      expect(profile.notes).toHaveLength(1);
    });
  });
});
