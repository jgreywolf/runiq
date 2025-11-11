const fs = require('fs');

async function test() {
  const { parse } = await import('./packages/parser-dsl/dist/index.js');
  const { ElkLayoutEngine } = await import('./packages/layout-base/dist/index.js');
  const { createTextMeasurer } = await import('./packages/core/dist/index.js');

  const dsl = `diagram "Debug Ports" {
  direction LR

  shape A as @rounded label:"A"
  shape B as @rounded label:"B"

  A -east->west B
}`;

  console.log('Testing with LR (left-to-right) direction...\n');
  const ast = parse(dsl);
  const diagram = ast.diagram;

  console.log('Edge anchor specification:');
  console.log(`  ${diagram.edges[0].from} -> ${diagram.edges[0].to}`);
  console.log(`  anchorFrom: ${diagram.edges[0].anchorFrom}`);
  console.log(`  anchorTo: ${diagram.edges[0].anchorTo}`);

  const layoutEngine = new ElkLayoutEngine();
  const measureText = createTextMeasurer();
  const layout = await layoutEngine.layout(diagram, { measureText });

  console.log('\nLayout result:');
  console.log('Nodes:');
  layout.nodes.forEach(n => {
    console.log(`  ${n.id}: x=${n.x.toFixed(1)}, y=${n.y.toFixed(1)}, w=${n.width.toFixed(1)}, h=${n.height.toFixed(1)}`);
  });

  console.log('\nEdge routing:');
  const edge = layout.edges[0];
  console.log(`  ${edge.from} -> ${edge.to}`);
  console.log(`  Points: ${edge.points.length}`);
  edge.points.forEach((p, i) => {
    console.log(`    [${i}] x=${p.x.toFixed(1)}, y=${p.y.toFixed(1)}`);
  });

  // Check if first point is on east side of A
  const nodeA = layout.nodes.find(n => n.id === 'A');
  const eastX = nodeA.x + nodeA.width;
  const centerY = nodeA.y + nodeA.height / 2;

  const firstPoint = edge.points[0];
  console.log(`\nExpected start (east of A): x=${eastX.toFixed(1)}, y=${centerY.toFixed(1)}`);
  console.log(`Actual start: x=${firstPoint.x.toFixed(1)}, y=${firstPoint.y.toFixed(1)}`);
  console.log(`Match: ${Math.abs(firstPoint.x - eastX) < 1 && Math.abs(firstPoint.y - centerY) < 1 ? 'YES ✓' : 'NO ✗'}`);
}

test().catch(console.error);
