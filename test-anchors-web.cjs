const fs = require('fs');

async function test() {
  const { renderRuniqToSvg } = await import('./packages/web/dist/index.js');

  const dsl = fs.readFileSync('./examples/test-edge-anchors.runiq', 'utf-8');

  console.log('Rendering diagram with edge anchors...');
  const result = await renderRuniqToSvg(dsl);

  if (result.success) {
    console.log('✓ Render successful!');

    // Save SVG to file
    fs.writeFileSync('./test-anchors-output.svg', result.svg);
    console.log('✓ SVG saved to test-anchors-output.svg');

    // Check for anchor usage in the output
    const hasEastPort = result.svg.includes('east');
    const hasWestPort = result.svg.includes('west');
    const hasNorthPort = result.svg.includes('north');
    const hasSouthPort = result.svg.includes('south');

    console.log('\nPort usage in SVG:');
    console.log(`  North: ${hasNorthPort ? '✓' : '✗'}`);
    console.log(`  South: ${hasSouthPort ? '✓' : '✗'}`);
    console.log(`  East: ${hasEastPort ? '✓' : '✗'}`);
    console.log(`  West: ${hasWestPort ? '✓' : '✗'}`);
  } else {
    console.error('✗ Render failed:', result.errors);
  }
}

test().catch(console.error);
