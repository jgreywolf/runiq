const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, '..', 'examples');
const outDir = path.join(__dirname, '..', 'docs', 'examples');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of list) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) results.push(...walk(p));
    else if (d.isFile() && d.name.endsWith('.runiq')) results.push(p);
  }
  return results;
}

function extractTitle(content) {
  // look for top-level declarations with a quoted title
  const m = content.match(
    /^(?:\s*)(?:diagram|glyphset|sequence|timeline|pid|wardley)\s+\"([^\"]+)\"/im
  );
  if (m) return m[1];
  // fallback: first non-empty line
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines[0].slice(0, 120) : '';
}

function inferCategory(filePath) {
  const rel = path.relative(examplesDir, filePath);
  const parts = rel.split(path.sep);
  if (parts.length > 1) return parts[0];
  return 'general';
}

const files = walk(examplesDir);
const metadata = files.map((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const title = extractTitle(content) || path.basename(f, '.runiq');
  return {
    id: path.relative(examplesDir, f).replace(/\\/g, '/').replace(/\/.+$/, '')
      .length
      ? path.basename(f, '.runiq')
      : path.basename(f, '.runiq'),
    title,
    path: path.relative(process.cwd(), f).replace(/\\/g, '/'),
    category: inferCategory(f),
  };
});

const outFile = path.join(outDir, 'metadata.json');
fs.writeFileSync(outFile, JSON.stringify(metadata, null, 2), 'utf8');
console.log('Wrote', outFile, 'entries:', metadata.length);
