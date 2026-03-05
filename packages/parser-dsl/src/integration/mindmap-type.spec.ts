import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Mindmap Type Tests', () => {
  it('should parse mindmap with type:mindmap and no explicit shapes', () => {
    const dsl = `
      diagram "Test Mindmap" {
        container "Ideas" type:mindmap algorithm:radial spacing:80 {
          shape central label:"Main Idea"
          shape branch1 label:"Branch 1"
          shape branch2 label:"Branch 2"
          
          central -> branch1
          central -> branch2
        }
      }
    `;

    const result = parse(dsl);

    console.log('Parse result:', JSON.stringify(result, null, 2));

    expect(result.success).toBe(true);
    expect(result.diagram?.containers).toHaveLength(1);
    expect(result.diagram?.nodes).toHaveLength(3);

    // First node should be circ (central)
    const centralNode = result.diagram?.nodes.find((n) => n.id === 'central');
    expect(centralNode?.shape).toBe('circ');

    // Other nodes should be rounded (branches)
    const branch1 = result.diagram?.nodes.find((n) => n.id === 'branch1');
    expect(branch1?.shape).toBe('rounded');

    const branch2 = result.diagram?.nodes.find((n) => n.id === 'branch2');
    expect(branch2?.shape).toBe('rounded');
  });

  it('should allow explicit shapes to override mindmap defaults', () => {
    const dsl = `
      diagram "Test Mindmap" {
        container "Ideas" type:mindmap algorithm:radial spacing:80 {
          shape central as @hexagon label:"Main Idea"
          shape branch1 label:"Branch 1"
          
          central -> branch1
        }
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);

    // Explicitly specified shape should override default
    const centralNode = result.diagram?.nodes.find((n) => n.id === 'central');
    expect(centralNode?.shape).toBe('hexagon');

    // Second node still gets default
    const branch1 = result.diagram?.nodes.find((n) => n.id === 'branch1');
    expect(branch1?.shape).toBe('rounded');
  });
});
