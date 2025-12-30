#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SHAPES_DIR = join(ROOT, 'packages', 'core', 'src', 'shapes');
const OUT_DIR = join(ROOT, 'docs', 'shapes');

if (!existsSync(SHAPES_DIR)) {
  console.error('shapes directory not found:', SHAPES_DIR);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SHAPES_DIR).filter(
  (f) => f.endsWith('.ts') || f.endsWith('.js')
);
let written = 0;
for (const f of files) {
  const id = f.replace(/\.(ts|js)x?$/, '');
  const title = id.replace(/[-_]/g, ' ');
  const md = `# ${title}\n\n- id: \`${id}\`\n\n## Example\n\n\n\`\`\`runiq\nshape example as @${id} label:"Example ${id}"\n\`\`\`\n\n## Preview\n\n![](/examples/${id}.svg)\n`;
  writeFileSync(join(OUT_DIR, `${id}.md`), md, 'utf8');
  console.log('Wrote', id);
  written++;
}

console.log(`Done — wrote ${written} shape docs to ${OUT_DIR}`);
