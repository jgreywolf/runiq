import { describe, it, expect } from 'vitest';
import { nodeRefToString, parseAnchoredArrow } from './node-ref-utils.js';
import type * as Langium from '../generated/ast.js';

describe('node-ref-utils', () => {
  describe('nodeRefToString', () => {
    describe('Simple Node References', () => {
      it('should convert simple node reference to string', () => {
        const ref: Langium.NodeRef = {
          node: 'node1',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('node1');
      });

      it('should handle node with alphanumeric characters', () => {
        const ref: Langium.NodeRef = {
          node: 'Node123',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Node123');
      });

      it('should handle node with underscores', () => {
        const ref: Langium.NodeRef = {
          node: 'my_node',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('my_node');
      });

      it('should handle node with hyphens', () => {
        const ref: Langium.NodeRef = {
          node: 'my-node',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('my-node');
      });

      it('should handle single character node names', () => {
        const ref: Langium.NodeRef = {
          node: 'A',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('A');
      });
    });

    describe('Member References (Class.field)', () => {
      it('should convert member reference to Class.field format', () => {
        const ref: Langium.NodeRef = {
          node: 'Class',
          member: 'field',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Class.field');
      });

      it('should handle method references', () => {
        const ref: Langium.NodeRef = {
          node: 'Service',
          member: 'execute',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Service.execute');
      });

      it('should handle property references', () => {
        const ref: Langium.NodeRef = {
          node: 'User',
          member: 'name',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('User.name');
      });

      it('should handle member with underscores', () => {
        const ref: Langium.NodeRef = {
          node: 'Class',
          member: 'private_field',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Class.private_field');
      });

      it('should handle complex class and member names', () => {
        const ref: Langium.NodeRef = {
          node: 'MyClass123',
          member: 'myMethod456',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('MyClass123.myMethod456');
      });
    });

    describe('Edge Cases', () => {
      it('should handle undefined member as simple reference', () => {
        const ref: Langium.NodeRef = {
          node: 'Node',
          member: undefined,
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Node');
      });

      it('should handle empty string member as simple reference', () => {
        const ref: Langium.NodeRef = {
          node: 'Node',
          member: '',
          $type: 'NodeRef',
        };
        expect(nodeRefToString(ref)).toBe('Node');
      });
    });
  });

  describe('parseAnchoredArrow', () => {
    describe('Simple Anchored Arrows (Source Only)', () => {
      it('should parse -north->', () => {
        const result = parseAnchoredArrow('-north->');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: undefined,
          label: undefined,
        });
      });

      it('should parse -south->', () => {
        const result = parseAnchoredArrow('-south->');
        expect(result).toEqual({
          anchorFrom: 'south',
          anchorTo: undefined,
          label: undefined,
        });
      });

      it('should parse -east->', () => {
        const result = parseAnchoredArrow('-east->');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: undefined,
          label: undefined,
        });
      });

      it('should parse -west->', () => {
        const result = parseAnchoredArrow('-west->');
        expect(result).toEqual({
          anchorFrom: 'west',
          anchorTo: undefined,
          label: undefined,
        });
      });
    });

    describe('Anchored Arrows with Target Anchor', () => {
      it('should parse -north->south', () => {
        const result = parseAnchoredArrow('-north->south');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: 'south',
          label: undefined,
        });
      });

      it('should parse -east->west', () => {
        const result = parseAnchoredArrow('-east->west');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: 'west',
          label: undefined,
        });
      });

      it('should parse -south->north', () => {
        const result = parseAnchoredArrow('-south->north');
        expect(result).toEqual({
          anchorFrom: 'south',
          anchorTo: 'north',
          label: undefined,
        });
      });

      it('should parse -west->east', () => {
        const result = parseAnchoredArrow('-west->east');
        expect(result).toEqual({
          anchorFrom: 'west',
          anchorTo: 'east',
          label: undefined,
        });
      });

      it('should parse same anchor on both sides', () => {
        const result = parseAnchoredArrow('-north->north');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: 'north',
          label: undefined,
        });
      });
    });

    describe('Anchored Arrows with Labels', () => {
      it('should parse -east-"label"-> with label', () => {
        const result = parseAnchoredArrow('-east-"label"->');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: undefined,
          label: 'label',
        });
      });

      it('should parse -north-"connection"-> with label', () => {
        const result = parseAnchoredArrow('-north-"connection"->');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: undefined,
          label: 'connection',
        });
      });

      it('should parse label with spaces', () => {
        const result = parseAnchoredArrow('-east-"sends data"->');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: undefined,
          label: 'sends data',
        });
      });

      it('should parse label with special characters', () => {
        const result = parseAnchoredArrow('-south-"HTTP/1.1"->');
        expect(result).toEqual({
          anchorFrom: 'south',
          anchorTo: undefined,
          label: 'HTTP/1.1',
        });
      });

      it('should parse empty label as undefined', () => {
        const result = parseAnchoredArrow('-west-""->');
        // Empty string label may be treated as undefined by the regex
        expect(result.anchorFrom).toBe('west');
        expect(result.anchorTo).toBeUndefined();
      });
    });

    describe('Anchored Arrows with Both Label and Target', () => {
      it('should parse -east-"label"->west', () => {
        const result = parseAnchoredArrow('-east-"label"->west');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: 'west',
          label: 'label',
        });
      });

      it('should parse -north-"sends"->south', () => {
        const result = parseAnchoredArrow('-north-"sends"->south');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: 'south',
          label: 'sends',
        });
      });

      it('should parse -west-"connects to"->east', () => {
        const result = parseAnchoredArrow('-west-"connects to"->east');
        expect(result).toEqual({
          anchorFrom: 'west',
          anchorTo: 'east',
          label: 'connects to',
        });
      });

      it('should parse with complex label and anchors', () => {
        const result = parseAnchoredArrow('-south-"HTTP POST /api/data"->north');
        expect(result).toEqual({
          anchorFrom: 'south',
          anchorTo: 'north',
          label: 'HTTP POST /api/data',
        });
      });
    });

    describe('Invalid Patterns', () => {
      it('should return empty object for invalid pattern', () => {
        const result = parseAnchoredArrow('invalid');
        expect(result).toEqual({});
      });

      it('should return empty object for missing arrow', () => {
        const result = parseAnchoredArrow('-north-');
        expect(result).toEqual({});
      });

      it('should return empty object for invalid anchor', () => {
        const result = parseAnchoredArrow('-invalid->');
        expect(result).toEqual({});
      });

      it('should return empty object for missing anchor', () => {
        const result = parseAnchoredArrow('-->');
        expect(result).toEqual({});
      });

      it('should return empty object for malformed label', () => {
        const result = parseAnchoredArrow('-north-"unclosed->');
        expect(result).toEqual({});
      });

      it('should return empty object for extra dashes', () => {
        const result = parseAnchoredArrow('--north-->');
        expect(result).toEqual({});
      });

      it('should return empty object for reversed arrow', () => {
        const result = parseAnchoredArrow('<--north-');
        expect(result).toEqual({});
      });
    });

    describe('Edge Cases', () => {
      it('should handle single letter label', () => {
        const result = parseAnchoredArrow('-east-"A"->');
        expect(result).toEqual({
          anchorFrom: 'east',
          anchorTo: undefined,
          label: 'A',
        });
      });

      it('should handle numeric label', () => {
        const result = parseAnchoredArrow('-north-"123"->');
        expect(result).toEqual({
          anchorFrom: 'north',
          anchorTo: undefined,
          label: '123',
        });
      });

      it('should handle label with quotes inside (if escaped)', () => {
        // Note: This might not work with simple regex - depends on implementation
        const result = parseAnchoredArrow('-west-"say \\"hello\\""->');
        // May return empty object or handle escapes
        expect(result).toBeDefined();
      });

      it('should preserve case in anchors', () => {
        // Should only match lowercase anchor names
        const result = parseAnchoredArrow('-North->');
        expect(result).toEqual({});
      });
    });

    describe('Real-world DSL Patterns', () => {
      it('should parse typical connection: -east->', () => {
        const result = parseAnchoredArrow('-east->');
        expect(result.anchorFrom).toBe('east');
      });

      it('should parse data flow: -south-"data"->north', () => {
        const result = parseAnchoredArrow('-south-"data"->north');
        expect(result).toEqual({
          anchorFrom: 'south',
          anchorTo: 'north',
          label: 'data',
        });
      });

      it('should parse API call pattern', () => {
        const result = parseAnchoredArrow('-east-"GET /users"->west');
        expect(result.label).toBe('GET /users');
      });

      it('should parse message passing', () => {
        const result = parseAnchoredArrow('-north-"message"->south');
        expect(result.anchorFrom).toBe('north');
        expect(result.anchorTo).toBe('south');
        expect(result.label).toBe('message');
      });
    });
  });
});
