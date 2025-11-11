const fs = require('fs');

async function test() {
  const { parse } = await import('./packages/parser-dsl/dist/index.js');
  const { ElkLayoutEngine } = await import('./packages/layout-base/dist/index.js');
  const { createTextMeasurer, shapeRegistry } = await import('./packages/core/dist/index.js');

  // Register basic shapes
  await import('./packages/core/dist/shapes/basic/index.js');
  // Read the test diagram
  const dsl = fs.readFileSync('./examples/test-edge-anchors.runiq', 'utf-8');

  console.log('Parsing diagram...');
  const ast = parse(dsl);

  console.log('\n\nEdges with anchors:');
  const diagram = ast.diagram;
  for (const edge of diagram.edges) {
    if (edge.anchorFrom || edge.anchorTo) {
      console.log(`  ${edge.from} -> ${edge.to}`);
      if (edge.anchorFrom) console.log(`    anchorFrom: ${edge.anchorFrom}`);
      if (edge.anchorTo) console.log(`    anchorTo: ${edge.anchorTo}`);
      if (edge.label) console.log(`    label: ${edge.label}`);
    }
  }

  console.log('\n\nPerforming layout...');
  const layoutEngine = new ElkLayoutEngine();
  const measureText = createTextMeasurer();
  const layout = await layoutEngine.layout(diagram, { measureText });

  console.log('Layout successful!');
  console.log(`Nodes: ${layout.nodes.length}`);
  console.log(`Edges: ${layout.edges.length}`);

  console.log('\nEdge routing points:');
  for (const edge of layout.edges) {
    console.log(`  ${edge.from} -> ${edge.to}: ${edge.points.length} points`);
  }
}

test().catch(console.error);
