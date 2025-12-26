const fs = require('fs');
const path = require('path');

const metaPath = path.join(__dirname, '..', 'docs', 'examples', 'metadata.json');
const examplesRoot = path.join(__dirname, '..', 'examples');

if (!fs.existsSync(metaPath)) {
  console.error('metadata.json not found:', metaPath);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const out = [];

for (const entry of meta) {
  const filePath = path.join(process.cwd(), entry.path);
  if (!fs.existsSync(filePath)) {
    // skip missing files
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const base = path.basename(filePath).toLowerCase();

  // Normalize bar-chart variants
  if (base.includes('bar-chart-horizontal') || base.includes('bar-chart-horizontal')) {
    entry.normalizedId = 'bar-chart';
    entry.flipAxes = true;
  } else if (base.includes('bar-chart-vertical') || base.includes('bar-chart-vertical')) {
    entry.normalizedId = 'bar-chart';
    entry.flipAxes = false;
  } else if (base.includes('bar-chart')) {
    entry.normalizedId = 'bar-chart';
    // check if file explicitly sets flipAxes
    entry.flipAxes = /flipAxes\s*[:=]/i.test(content) || false;
  }

  // Annotate venn examples: glyphset vs shape
  if (base.includes('venn') || entry.id.toLowerCase().includes('venn')) {
    if (/glyphset\s*:/i.test(content) || /glyphset\s+[a-zA-Z0-9_-]+/i.test(content)) {
      entry.type = 'glyphset';
    } else {
      entry.type = 'shape';
    }
  }

  out.push(entry);
}

const backup = metaPath + '.bak';
fs.writeFileSync(backup, JSON.stringify(meta, null, 2), 'utf8');
fs.writeFileSync(metaPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Normalized metadata entries:', out.length, 'backup at', backup);
