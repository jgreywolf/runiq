const fs = require('fs');
const path = require('path');

const metaPath = path.join(__dirname, '..', 'docs', 'examples', 'metadata.json');
if (!fs.existsSync(metaPath)) {
  console.error('metadata.json not found at', metaPath);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

function mapTag(t) {
  if (!t) return null;
  const s = t.toLowerCase();
  if (/bar|chart/.test(s)) return 'charts';
  if (/chevron|glyphset|columnlist|column-list|cluster|matrix|orgchart|org-chart/.test(s)) return 'glyphset';
  if (/venn/.test(s)) return 'venn';
  if (/sequence/.test(s)) return 'sequence';
  if (/\b(class|uml|lifeline|activity)\b/.test(s)) return 'uml';
  if (/\b(c4|component|container|context)\b/.test(s)) return 'c4-architecture';
  if (/bpmn/.test(s)) return 'bpmn';
  if (/pid\b|pump|tank|compressor/.test(s)) return 'pid';
  if (/quantum|qubit|grover|teleportation/.test(s)) return 'quantum';
  if (/wardley/.test(s)) return 'wardley';
  if (/network|graph/.test(s)) return 'network';
  if (/hydraulic|electrical|pneumatic|control|transfer-function|integrator/.test(s)) return 'control-diagrams';
  if (s === 'general') return 'general';
  // fallback: keep short descriptive words
  if (/^[a-z0-9-]{3,30}$/.test(s)) return s;
  return null;
}

function titleTags(title) {
  if (!title) return [];
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3)
    .slice(0, 3);
}

const whitelist = new Set([
  'charts','glyphset','venn','sequence','uml','c4-architecture','bpmn','pid','quantum','wardley','network','control-diagrams','general'
]);

const updated = meta.map((entry) => {
  const tags = entry.tags || [];
  const mapped = new Set();
  for (const t of tags) {
    const m = mapTag(t);
    if (m && whitelist.has(m)) mapped.add(m);
  }
  // add category as tag if it maps
  if (entry.category) {
    const mc = mapTag(entry.category);
    if (mc && whitelist.has(mc)) mapped.add(mc);
  }
  // allow up to 2 title-derived tags if they are not in whitelist
  const extras = titleTags(entry.title || '').filter((w) => !mapped.has(w)).slice(0, 2);
  const finalTags = [...mapped, ...extras];
  return Object.assign({}, entry, { tags: finalTags });
});

const backup = metaPath + '.whitelist.bak';
fs.writeFileSync(backup, JSON.stringify(meta, null, 2), 'utf8');
fs.writeFileSync(metaPath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Normalized tags for', updated.length, 'entries — backup at', backup);
