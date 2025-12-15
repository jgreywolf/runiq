import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Edge Routing Preferences', () => {
  it('should parse diagram-level routing declaration', () => {
    const input = `
      diagram "Test" {
        routing orthogonal
        shape A
        shape B
        A -> B
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBe('orthogonal');
  });

  it('should support straight routing', () => {
    const input = `
      diagram "Test" {
        routing straight
        shape A
        shape B
        A -> B
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBe('straight');
  });

  it('should support polyline routing', () => {
    const input = `
      diagram "Test" {
        routing polyline
        shape A
        shape B
        A -> B
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBe('polyline');
  });

  it('should support splines routing', () => {
    const input = `
      diagram "Test" {
        routing splines
        shape A
        shape B
        A -> B
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBe('splines');
  });

  it('should parse per-edge routing property', () => {
    const input = `
      diagram "Test" {
        shape A
        shape B
        shape C
        A -> B routing:straight
        B -> C routing:orthogonal
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(2);
    expect(result.diagram?.edges[0].routing).toBe('straight');
    expect(result.diagram?.edges[1].routing).toBe('orthogonal');
  });

  it('should default to undefined when no routing is specified', () => {
    const input = `
      diagram "Test" {
        shape A
        shape B
        A -> B
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBeUndefined();
    expect(result.diagram?.edges[0].routing).toBeUndefined();
  });

  it('should allow mixed diagram and edge-level routing', () => {
    const input = `
      diagram "Test" {
        routing orthogonal
        shape A
        shape B
        shape C
        A -> B
        B -> C routing:straight
      }
    `;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.diagram?.routing).toBe('orthogonal');
    expect(result.diagram?.edges[0].routing).toBeUndefined(); // Uses diagram default
    expect(result.diagram?.edges[1].routing).toBe('straight'); // Override
  });
});
