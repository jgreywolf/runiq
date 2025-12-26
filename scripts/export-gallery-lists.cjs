const fs = require('fs');
const path = require('path');

const metaPath = path.join(
  __dirname,
  '..',
  'docs',
  'examples',
  'metadata.json'
);
if (!fs.existsSync(metaPath)) {
  console.error('metadata.json missing:', metaPath);
  process.exit(1);
}
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const outDir = path.join(__dirname, '..', 'docs', 'examples');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const byProfile = {};
for (const e of meta) {
  const profile = e.profile || 'diagram';
  if (!byProfile[profile]) byProfile[profile] = [];
  const item = {
    id: e.id,
    title: e.title,
    path: e.path,
    tags: e.tags || [],
    difficulty: e.difficulty || 'medium',
  };
  byProfile[profile].push(item);
}

for (const [profile, items] of Object.entries(byProfile)) {
  const outPath = path.join(outDir, `gallery-${profile}.json`);
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
}

// write combined
const all = Object.values(byProfile).flat();
fs.writeFileSync(
  path.join(outDir, 'gallery-all.json'),
  JSON.stringify(all, null, 2),
  'utf8'
);

console.log(
  'Exported gallery lists:',
  Object.keys(byProfile)
    .map((k) => `gallery-${k}.json`)
    .join(', '),
  'and gallery-all.json'
);
