const fs = require('fs');

async function test() {
  const { parse } = await import('./packages/parser-dsl/dist/index.js');
  const { ElkLayoutEngine } = await import('./packages/layout-base/dist/index.js');
  const { createTextMeasurer } = await import('./packages/core/dist/index.js');
  await import('./packages/core/dist/shapes/basic/index.js');

  const dsl = `diagram "Port Diagnostic" {
  direction TB

  shape A as @rounded label:"A"
  shape B as @rounded label:"B"

  A -east->west B
}`;

  console.log('Testing east->west connection with TB layout\n');
  const ast = parse(dsl);
  const diagram = ast.diagram;

  const layoutEngine = new ElkLayoutEngine();
  const measureText = createTextMeasurer();
  const layout = await layoutEngine.layout(diagram, { measureText });

  const nodeA = layout.nodes.find(n => n.id === 'A');
  const nodeB = layout.nodes.find(n => n.id === 'B');
  const edge = layout.edges[0];

  console.log('Node A:');
  console.log(`  Position: (${nodeA.x}, ${nodeA.y})`);
  console.log(`  Size: ${nodeA.width} x ${nodeA.height}`);
  console.log(`  East port (expected): (${nodeA.x + nodeA.width}, ${nodeA.y + nodeA.height/2})`);

  console.log('\nNode B:');
  console.log(`  Position: (${nodeB.x}, ${nodeB.y})`);
  console.log(`  Size: ${nodeB.width} x ${nodeB.height}`);
  console.log(`  West port (expected): (${nodeB.x}, ${nodeB.y + nodeB.height/2})`);

  console.log('\nEdge routing:');
  console.log(`  Start point: (${edge.points[0].x}, ${edge.points[0].y})`);
  console.log(`  End point: (${edge.points[edge.points.length-1].x}, ${edge.points[edge.points.length-1].y})`);
  console.log(`  Total waypoints: ${edge.points.length}`);

  // Check if start point matches east port of A
  const eastX = nodeA.x + nodeA.width;
  const centerYA = nodeA.y + nodeA.height / 2;
  const startMatches = Math.abs(edge.points[0].x - eastX) < 1 && Math.abs(edge.points[0].y - centerYA) < 1;

  // Check if end point matches west port of B
  const westX = nodeB.x;
  const centerYB = nodeB.y + nodeB.height / 2;
  const endMatches = Math.abs(edge.points[edge.points.length-1].x - westX) < 1 &&
                     Math.abs(edge.points[edge.points.length-1].y - centerYB) < 1;

  console.log('\nPort matching:');
  console.log(`  Start at east of A: ${startMatches ? '✓ YES' : '✗ NO'}`);
  console.log(`  End at west of B: ${endMatches ? '✓ YES' : '✗ NO'}`);

  if (!startMatches || !endMatches) {
    console.log('\n⚠ ISSUE: Ports are not being used correctly!');
    console.log('This suggests ELK is ignoring the port constraints.');
  } else {
    console.log('\n✓ SUCCESS: Ports are being used correctly!');
  }
}

test().catch(console.error);