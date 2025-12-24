const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'docs', 'shapes');
if (!fs.existsSync(dir)) process.exit(0);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
for (const file of files) {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, 'utf8');
  // normalize newlines
  s = s.replace(/\r\n/g, '\n');
  const exampleIdx = s.indexOf('\n## Example');
  if (exampleIdx === -1) continue;
  const before = s.slice(0, exampleIdx);
  const after = s.slice(exampleIdx);
  // remove standalone asterisk artifacts in the description block (anything between first H1 and ## Example)
  // Find first heading after frontmatter
  const h1Idx = before.indexOf('\n# ');
  if (h1Idx === -1) continue;
  const header = before.slice(0, h1Idx + 1);
  let body = before.slice(h1Idx + 1);
  // remove stray '*' characters in body
  body = body
    .replace(/\*{2,}/g, ' ')
    .replace(/\s\*\s/g, ' - ')
    .replace(/\*\s/g, '')
    .replace(/\s\*/g, '');
  // normalize any 'Category:' lines to '**Category:** value'
  body = body.replace(
    /^[ \t]*Category:\s*(.+)$/m,
    (m, p1) => `**Category:** ${p1.trim()}`
  );
  // remove stray list-like lines beginning with '-' in the header block
  body = body
    .split('\n')
    .filter((ln, idx) => {
      // keep blank lines and lines starting with '**' or not starting with '- '
      if (/^\s*-\s+/.test(ln)) return false;
      return true;
    })
    .join('\n');
  const out = header + body + after;
  fs.writeFileSync(p, out.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Sanitized', file);
}
console.log('Done');
