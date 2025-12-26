const fs = require('fs');
const path = require('path');

const metaPath = path.join(
  __dirname,
  '..',
  'docs',
  'examples',
  'metadata.json'
);
const examplesRoot = path.join(__dirname, '..', 'examples');

if (!fs.existsSync(metaPath)) {
  console.error('metadata.json not found:', metaPath);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const byProfile = {};

function detectProfile(content) {
  if (!content) return 'unknown';
  const txt = content.slice(0, 400).toLowerCase();
  if (/^\s*sequence\b/.test(txt)) return 'sequence';
  if (/^\s*timeline\b/.test(txt)) return 'timeline';
  if (/^\s*pid\b/.test(txt)) return 'pid';
  if (/^\s*wardley\b/.test(txt)) return 'wardley';
  if (/^\s*(hydraulic|pneumatic|electrical)\b/.test(txt)) return 'schematic';
  if (/^\s*glyphset\b/.test(txt) || /glyphset\s*:/.test(txt)) return 'glyphset';
  if (/^\s*diagram\b/.test(txt)) return 'diagram';
  // charts are often 'diagram' but include chart keywords
  if (
    /\b(bar-chart|bar chart|pie chart|line chart|radar chart|sankey)\b/.test(
      txt
    )
  )
    return 'charts';
  return 'diagram';
}

for (const entry of meta) {
  const file = path.join(process.cwd(), entry.path || '');
  let content = '';
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {
    content = '';
  }
  const profile = detectProfile(content);
  entry.profile = profile;
  if (!byProfile[profile]) byProfile[profile] = [];
  byProfile[profile].push({
    id: entry.id,
    path: entry.path,
    title: entry.title,
  });
}

// write updated metadata (backup first)
fs.writeFileSync(
  metaPath + '.profile.bak',
  JSON.stringify(meta, null, 2),
  'utf8'
);
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');

const outPath = path.join(
  __dirname,
  '..',
  'docs',
  'examples',
  'by-profile.json'
);
fs.writeFileSync(outPath, JSON.stringify(byProfile, null, 2), 'utf8');

// print summary
const summary = Object.entries(byProfile)
  .map(([k, v]) => `${k}: ${v.length}`)
  .join(', ');
console.log('Profiles mapped —', summary);
console.log('Wrote', outPath);
