import { readFileSync } from 'fs';
import { parse } from '@runiq/parser-dsl';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { renderSvg } from '@runiq/renderer-svg';
import { registerDefaultShapes } from '@runiq/core';

// Register shapes
registerDefaultShapes();

// Parse DSL
const content = readFileSync('examples/simple-container.runiq', 'utf-8');
const result = parse(content);

console.log('=== PARSE RESULT ===');
console.log('Success:', result.success);
console.log('Errors:', result.errors?.length || 0);
console.log('Nodes:', result.diagram?.nodes?.length || 0);
console.log('Containers:', result.diagram?.containers?.length || 0);

if (result.diagram?.containers?.[0]) {
  console.log('\n=== CONTAINER INFO ===');
  const container = result.diagram.containers[0];
  console.log('ID:', container.id);
  console.log('Label:', container.label);
  console.log('Children:', container.children);
  console.log('Style:', JSON.stringify(container.containerStyle, null, 2));
}

// Layout
const engine = new ElkLayoutEngine();
const layout = await engine.layout(result.diagram);

console.log('\n=== LAYOUT RESULT ===');
console.log('Nodes:', layout.nodes?.length || 0);
console.log('Edges:', layout.edges?.length || 0);
console.log('Containers:', layout.containers?.length || 0);

if (layout.containers?.[0]) {
  console.log('\n=== POSITIONED CONTAINER ===');
  const pc = layout.containers[0];
  console.log('ID:', pc.id);
  console.log('Position:', `(${pc.x}, ${pc.y})`);
  console.log('Size:', `${pc.width} x ${pc.height}`);
}

// Render
const svg = renderSvg(result.diagram, layout);

console.log('\n=== RENDER RESULT ===');
console.log('SVG length:', svg.svg.length);
console.log('Warnings:', svg.warnings.length);
console.log(
  'Contains container tag:',
  svg.svg.includes('data-runiq-container')
);
