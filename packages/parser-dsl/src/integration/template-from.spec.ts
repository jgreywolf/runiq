import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Template DSL - from source', () => {
  it.skip('parses template with from:"path"', () => {
    const dsl = `
      diagram "D" {
        template "users" from:"data/users.json" {
          label:"Users"
        }
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const diagram = result.diagram!;
    expect(diagram.templates).toBeDefined();
    expect(diagram.templates!.length).toBe(1);
    const t = diagram.templates![0] as any;
    expect(t.id).toBe('users');
    // Allow either direct property or nested based on parser mapping step
    expect(t.from || t.dataSource?.source).toBe('data/users.json');
  });
});
