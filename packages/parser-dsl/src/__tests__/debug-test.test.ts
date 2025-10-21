import { describe, it } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Debug Failing Test', () => {
  it('should show parsing errors', () => {
    const dsl = `
      diagram "flowchart" {
        direction: LR
        
        style default fill: "#f0f0f0" stroke: "#333"
        style highlight fill: "#ffeb3b" stroke: "#f57c00"
        
        shape Start as @rounded label: "Start" style: highlight
        shape Process as @rounded label: "Process"
        shape End as @rounded label: "End"
        
        Start -> Process
        Process -> End
        
        group "Main Flow" {
          Start -> End
        }
      }
    `;
    const result = parse(dsl);

    console.log('Success:', result.success);
    console.log('Errors:', result.errors);
    if (result.diagram) {
      console.log('Nodes:', result.diagram.nodes.length);
      console.log('Edges:', result.diagram.edges.length);
    }
  });
});
