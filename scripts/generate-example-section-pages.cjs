const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, '..', 'docs', 'examples');
const byProfilePath = path.join(examplesDir, 'by-profile.json');
const metaPath = path.join(examplesDir, 'metadata.json');

if (!fs.existsSync(byProfilePath)) {
  console.error('Missing by-profile.json at', byProfilePath);
  process.exit(1);
}
const byProfile = JSON.parse(fs.readFileSync(byProfilePath, 'utf8'));
const meta = fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  : [];

if (!fs.existsSync(examplesDir)) fs.mkdirSync(examplesDir, { recursive: true });

function writeProfilePage(profile, items) {
  const title = profile.charAt(0).toUpperCase() + profile.slice(1);
  const lines = [];
  lines.push('---');
  lines.push(`title: ${title} Examples`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${title} Examples`);
  lines.push('');
  lines.push(`Found ${items.length} examples.`);
  lines.push('');
  for (const it of items) {
    const m = meta.find((e) => e.id === it.id) || {};
    const tags = (m.tags || []).join(', ');
    lines.push(
      `- **${it.title}** — [${it.path}](${it.path})` +
        (tags ? ` — _${tags}_` : '')
    );
  }
  const outPath = path.join(examplesDir, `${profile}.md`);
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
}

// Generate pages and filtered JSONs
for (const [profile, items] of Object.entries(byProfile)) {
  writeProfilePage(profile, items);
  const jsonOut = path.join(examplesDir, `filter-${profile}.json`);
  fs.writeFileSync(jsonOut, JSON.stringify(items, null, 2), 'utf8');
}

console.log(
  'Generated',
  Object.keys(byProfile).length,
  'profile pages in',
  examplesDir
);
