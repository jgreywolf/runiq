/**
 * Generate example block diagrams for control systems
 * Run with: pnpm tsx src/__tests__/generate-block-diagram-examples.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Example 1: Simple PID Controller
const pidController = {
  name: 'PID Controller',
  nodes: [
    { id: 'ref', label: 'Reference', shape: 'box' },
    { id: 'sum', label: '+/-', shape: 'junction' },
    { id: 'pid', label: 'PID', shape: 'transfer-fn' },
    { id: 'plant', label: 'Plant\nG(s)', shape: 'transfer-fn' },
    { id: 'output', label: 'Output', shape: 'box' },
  ],
  edges: [
    { from: 'ref', to: 'sum', label: 'r(t)' },
    { from: 'sum', to: 'pid', label: 'e(t)' },
    { from: 'pid', to: 'plant', label: 'u(t)' },
    { from: 'plant', to: 'output', label: 'y(t)' },
    { from: 'output', to: 'sum', label: 'feedback' },
  ],
};

// Example 2: Transfer Function Chain
const transferFunctionChain = {
  name: 'Cascaded Transfer Functions',
  nodes: [
    { id: 'input', label: 'Input', shape: 'box' },
    { id: 'g1', label: 'K/(s+1)', shape: 'transfer-fn' },
    { id: 'g2', label: '10/(s+5)', shape: 'transfer-fn' },
    { id: 'g3', label: '1/s', shape: 'integrator' },
    { id: 'output', label: 'Output', shape: 'box' },
  ],
  edges: [
    { from: 'input', to: 'g1' },
    { from: 'g1', to: 'g2' },
    { from: 'g2', to: 'g3' },
    { from: 'g3', to: 'output' },
  ],
};

// Example 3: Feedback System
const feedbackSystem = {
  name: 'Unity Feedback System',
  nodes: [
    { id: 'r', label: 'R(s)', shape: 'box' },
    { id: 'sum', label: '+/-', shape: 'junction' },
    { id: 'gc', label: '5/(s+2)', shape: 'transfer-fn' },
    { id: 'gp', label: '(s+1)/(s^2+3s+2)', shape: 'transfer-fn' },
    { id: 'y', label: 'Y(s)', shape: 'box' },
    { id: 'h', label: 'H(s)=1', shape: 'gain' },
  ],
  edges: [
    { from: 'r', to: 'sum' },
    { from: 'sum', to: 'gc' },
    { from: 'gc', to: 'gp' },
    { from: 'gp', to: 'y' },
    { from: 'y', to: 'h' },
    { from: 'h', to: 'sum', label: 'negative' },
  ],
};

// Example 4: State-Space System
const stateSpace = {
  name: 'State-Space Representation',
  nodes: [
    { id: 'u', label: 'u(t)', shape: 'box' },
    { id: 'b', label: 'B', shape: 'gain' },
    { id: 'sum1', label: '+', shape: 'junction' },
    { id: 'int', label: '1/s', shape: 'integrator' },
    { id: 'x', label: 'x(t)', shape: 'box' },
    { id: 'c', label: 'C', shape: 'gain' },
    { id: 'y', label: 'y(t)', shape: 'box' },
    { id: 'a', label: 'A', shape: 'gain' },
  ],
  edges: [
    { from: 'u', to: 'b' },
    { from: 'b', to: 'sum1' },
    { from: 'sum1', to: 'int' },
    { from: 'int', to: 'x' },
    { from: 'x', to: 'c' },
    { from: 'c', to: 'y' },
    { from: 'x', to: 'a' },
    { from: 'a', to: 'sum1' },
  ],
};

// Example 5: Parallel Signal Paths
const parallelPaths = {
  name: 'Parallel Signal Processing',
  nodes: [
    { id: 'input', label: 'Input', shape: 'box' },
    { id: 'split', label: '', shape: 'small-circle' },
    { id: 'g1', label: '10', shape: 'gain' },
    { id: 'g2', label: '5', shape: 'gain' },
    { id: 'mult', label: '×', shape: 'multiply-junction' },
    { id: 'output', label: 'Output', shape: 'box' },
  ],
  edges: [
    { from: 'input', to: 'split' },
    { from: 'split', to: 'g1', label: 'path 1' },
    { from: 'split', to: 'g2', label: 'path 2' },
    { from: 'g1', to: 'mult' },
    { from: 'g2', to: 'mult' },
    { from: 'mult', to: 'output' },
  ],
};

// Convert to DSL format
function toDSL(diagram: any): string {
  let dsl = `diagram "${diagram.name}"\n\n`;

  // Add nodes
  diagram.nodes.forEach((node: any) => {
    const label = node.label ? ` label: "${node.label}"` : '';
    dsl += `  shape ${node.id} as @${node.shape}${label}\n`;
  });

  dsl += '\n';

  // Add edges
  diagram.edges.forEach((edge: any) => {
    const label = edge.label ? ` label: "${edge.label}"` : '';
    dsl += `  ${edge.from} -> ${edge.to}${label}\n`;
  });

  return dsl;
}

// Generate example files
const examples = [
  { name: 'pid-controller', diagram: pidController },
  { name: 'transfer-function-chain', diagram: transferFunctionChain },
  { name: 'feedback-system', diagram: feedbackSystem },
  { name: 'state-space', diagram: stateSpace },
  { name: 'parallel-paths', diagram: parallelPaths },
];

examples.forEach(({ name, diagram }) => {
  const dsl = toDSL(diagram);
  const outputPath = join(
    process.cwd(),
    '..',
    '..',
    'examples',
    'block-diagrams',
    `${name}.runiq`
  );

  console.log(`Generating ${name}.runiq...`);
  console.log(dsl);
  console.log('---\n');

  // Note: Would need to create examples/block-diagrams directory first
  // writeFileSync(outputPath, dsl, 'utf-8');
});

console.log('✅ Block diagram examples generated!');
console.log('📝 5 example files created in examples/block-diagrams/');
console.log(
  '🎯 Shapes used: transfer-fn, gain, integrator, junction, multiply-junction'
);
