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
  console.error('metadata.json not found at', metaPath);
  process.exit(1);
}

const examplesRoot = path.join(__dirname, '..', 'examples');
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

function inferTags(entry, content) {
  const tags = new Set();
  // category-based tag
  if (entry.category) tags.add(entry.category);

  const name = (entry.id || '').toLowerCase();
  const title = (entry.title || '').toLowerCase();
  const text = ((content || '') + ' ' + title + ' ' + name).toLowerCase();

  const keywordMap = {
    sequence: ['sequence'],
    uml: ['class', 'uml', 'lifeline', 'activity'],
    charts: [
      'chart',
      'bar-chart',
      'bar-chart',
      'bar',
      'pie',
      'venn',
      'radar',
      'radarChart',
      'line-chart',
      'lineChart',
    ],
    glyphset: [
      'glyphset',
      'chevron',
      'columnlist',
      'chevronlist',
      'chevron-list',
      'chevronList',
      'cluster',
      'matrix',
      'orgchart',
      'org-chart',
    ],
    pid: ['pid', 'pump', 'tank', 'compressor'],
    quantum: ['quantum', 'qubit', 'teleportation', 'grover'],
    c4: ['c4', 'component', 'container', 'context'],
    bpmn: ['bpmn'],
    wardley: ['wardley'],
    charts_complex: ['sankey', 'radar', 'pie', 'bar-chart', 'line-chart'],
    network: ['network', 'graph'],
    control: [
      'hydraulic',
      'electrical',
      'pneumatic',
      'control',
      'transfer-function',
      'integrator',
    ],
  };

  for (const [tag, keys] of Object.entries(keywordMap)) {
    for (const k of keys) {
      if (text.includes(k.toLowerCase())) {
        tags.add(tag);
        break;
      }
    }
  }

  // title words as tags (few)
  title
    .split(/\W+/)
    .slice(0, 6)
    .forEach((w) => {
      if (w && w.length > 3) tags.add(w);
    });

  return Array.from(tags);
}

function inferDifficulty(content) {
  const lines = (content || '').split(/\r?\n/).length;
  if (lines < 40) return 'easy';
  if (lines < 160) return 'medium';
  return 'hard';
}

const updated = meta.map((entry) => {
  const file = path.join(process.cwd(), entry.path);
  let content = '';
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {}

  const tags = inferTags(entry, content);
  const difficulty = inferDifficulty(content);

  return Object.assign({}, entry, { tags, difficulty });
});

const backup = metaPath + '.annotate.bak';
fs.writeFileSync(backup, JSON.stringify(meta, null, 2), 'utf8');
fs.writeFileSync(metaPath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Annotated', updated.length, 'entries — backup at', backup);
