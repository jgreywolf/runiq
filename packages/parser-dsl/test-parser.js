import { parse } from './dist/index.js';

const dsl = `
  diagram "flowchart"
  direction LR
  
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
`;

const result = parse(dsl);

console.log('Success:', result.success);
if (!result.success) {
  console.log('Errors:', JSON.stringify(result.errors, null, 2));
} else {
  console.log('Diagram:', JSON.stringify(result.diagram, null, 2));
}
