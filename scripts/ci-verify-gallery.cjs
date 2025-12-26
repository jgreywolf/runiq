const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'examples');
const files = [
  'gallery-all.json',
  'gallery-diagram.json',
  'gallery-charts.json',
  'gallery-schematic.json',
  'gallery-glyphset.json',
  'gallery-sequence.json',
];

let ok = true;
for (const f of files) {
  const p = path.join(outDir, f);
  if (!fs.existsSync(p)) {
    console.error('MISSING:', f);
    ok = false;
    continue;
  }
  let raw;
  try {
    raw = fs.readFileSync(p, 'utf8');
  } catch (e) {
    console.error('READ ERROR:', f, e.message);
    ok = false;
    continue;
  }
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      console.error('INVALID FORMAT (not array):', f);
      ok = false;
      continue;
    }
    if (data.length === 0) {
      console.error('EMPTY LIST:', f);
      ok = false;
      continue;
    }
    console.log(`${f}: OK (${data.length} items)`);
  } catch (e) {
    console.error('PARSE ERROR:', f, e.message);
    ok = false;
  }
}

if (!ok) {
  console.error(
    '\nGallery verification failed. Ensure generated files are committed.'
  );
  process.exit(1);
}

console.log('\nGallery verification passed.');
