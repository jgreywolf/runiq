const fs = require('fs');
const path = require('path');

const shapesDir = path.join(
  __dirname,
  '..',
  'packages',
  'core',
  'src',
  'shapes'
);
const outDir = path.join(__dirname, '..', 'docs', 'shapes');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(p));
    } else if (file.endsWith('.ts')) {
      results.push(p);
    }
  });
  return results;
}

function extractShapeInfo(content) {
  const idMatch = content.match(/id:\s*['"]([a-z0-9-_.]+)['"]/i);
  const nameMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
  const desc = nameMatch
    ? nameMatch[1]
        .trim()
        .split('\n')
        .map((s) => s.trim())
        .join(' ')
    : '';
  return {
    id: idMatch ? idMatch[1] : null,
    description: desc,
  };
}

if (!fs.existsSync(shapesDir)) {
  console.error('Shapes source directory not found:', shapesDir);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = walk(shapesDir);
let count = 0;
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const info = extractShapeInfo(content);
    // debug
    // console.log('Processing', path.relative(shapesDir, file), '->', info.id);
    if (!info.id) continue;
    const rel = path.relative(shapesDir, file);
    const category = rel.split(path.sep)[0] || 'general';

    const title = info.id
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
    const lines = [];
    lines.push('---');
    lines.push(`title: ${title}`);
    lines.push('---');
    lines.push('');
    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`**Category:** ${category}`);
    lines.push('');
    if (info.description) {
      lines.push(info.description);
      lines.push('');
    }
    lines.push('## Example');
    lines.push('');
    lines.push('```runiq');
    lines.push(`shape node1 as @${info.id} label:"Example ${title}"`);
    lines.push('```');
    lines.push('');
    lines.push('## Preview');
    lines.push('');
    lines.push(
      'Render this example in the online editor: https://editor.runiq.org'
    );
    const md = lines.join('\n');

    const outFile = path.join(outDir, `${info.id}.md`);
    fs.writeFileSync(outFile, md, 'utf8');
    count++;
  } catch (e) {
    console.error('Error processing', file, e.message);
  }
}
console.log('Generated', count, 'shape docs in', outDir);
