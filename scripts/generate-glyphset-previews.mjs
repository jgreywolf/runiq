import { mkdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { glyphsetRegistry } from '../packages/glyphsets/dist/index.js';

const outputDir = 'docs/public/examples/glyphsets';
const sourceDir = 'docs/examples/glyphset-catalog-sources';
mkdirSync(outputDir, { recursive: true });
mkdirSync(sourceDir, { recursive: true });

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='middle' font-size='20' fill='%23999'%3EIMG%3C/text%3E%3C/svg%3E";
const wordPool = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
  'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
];

const sampleWords = (count, prefix = 'Item') => {
  const words = wordPool.slice(0, count);
  return words.length >= count
    ? words
    : Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);
};

const makeImageItems = (count, labelPrefix = 'Item') =>
  Array.from({ length: count }, (_, i) => ({
    image: placeholderImage,
    label: `${labelPrefix} ${i + 1}`,
    description: `Detail ${i + 1}`,
  }));

const orgStructure = [
  {
    name: 'CEO',
    role: 'Executive',
    reports: [
      { name: 'VP Engineering', reports: [{ name: 'Dev Lead' }, { name: 'QA Lead' }] },
      { name: 'VP Sales', reports: [{ name: 'Account Lead' }] },
    ],
  },
];

const categoryOrder = ['process', 'list', 'hierarchy', 'comparison', 'visualization', 'relationship'];
const glyphsets = glyphsetRegistry.list().sort((a, b) => {
  const aIdx = categoryOrder.indexOf(a.category);
  const bIdx = categoryOrder.indexOf(b.category);
  if (aIdx !== bIdx) return aIdx - bIdx;
  return a.id.localeCompare(b.id);
});

const makeParams = (glyphset) => {
  const minItems = glyphset.minItems ?? 3;
  const count = Math.max(minItems, 3);
  const items = sampleWords(count);
  const params = {};

  const paramNames = new Set(glyphset.parameters.map((p) => p.name));

  if (paramNames.has('steps')) params.steps = items;
  if (paramNames.has('items')) params.items = items;
  if (paramNames.has('levels')) params.levels = items.map((label, idx) => `Level ${idx + 1}: ${label}`);
  if (paramNames.has('quadrants')) params.quadrants = sampleWords(minItems, 'Quadrant');
  if (paramNames.has('segments')) params.segments = ['Segment A', 'Segment B'];
  if (paramNames.has('columnHeaders')) params.columnHeaders = ['Column A', 'Column B'];
  if (paramNames.has('rowHeaders')) params.rowHeaders = ['Row 1', 'Row 2'];
  if (paramNames.has('circles')) params.circles = sampleWords(Math.max(minItems, 3), 'Set');
  if (paramNames.has('events')) params.events = sampleWords(count, 'Event');
  if (paramNames.has('stages')) params.stages = sampleWords(count, 'Stage');
  if (paramNames.has('images')) params.images = makeImageItems(Math.max(minItems, 2));
  if (paramNames.has('image')) params.image = placeholderImage;
  if (paramNames.has('callouts')) params.callouts = sampleWords(Math.max(minItems, 2), 'Callout');
  if (paramNames.has('groups')) {
    params.groups = [
      { name: 'Design', items: ['Wireframes', 'Prototypes'] },
      { name: 'Build', items: ['API', 'Frontend', 'Database'] },
    ];
  }
  if (paramNames.has('mergePoint')) params.mergePoint = 'Launch';
  if (paramNames.has('target')) params.target = 'Goal';
  if (paramNames.has('source')) params.source = 'Source';
  if (paramNames.has('center')) params.center = 'Center';
  if (paramNames.has('centerLabel')) params.centerLabel = 'Core';
  if (paramNames.has('structure')) params.structure = orgStructure;
  if (paramNames.has('teams')) params.teams = ['Team Alpha', 'Team Beta'];
  if (paramNames.has('members')) params.members = ['Alex', 'Blake', 'Casey', 'Devon'];
  if (paramNames.has('leaders')) params.leaders = ['Avery', 'Jordan'];
  if (paramNames.has('sides')) params.sides = ['Option A', 'Option B'];
  if (paramNames.has('inputs')) params.inputs = ['Input A', 'Input B'];
  if (paramNames.has('outputs')) params.outputs = ['Output'];

  // Glyphsets with implicit params not declared in parameters list
  switch (glyphset.id) {
    case 'circleHierarchy':
      params.roots = ['Root'];
      params.children = ['Alpha', 'Beta', 'Gamma', 'Delta'];
      break;
    case 'labeledHierarchy':
      params.roots = ['Root:Owns'];
      params.children = ['Alpha:Leads', 'Beta:Supports', 'Gamma:Reports'];
      break;
    case 'tableHierarchy':
      params.levels = ['Leadership:Executive', 'Operations:Execution', 'Support:Enable'];
      break;
    case 'teamHierarchy':
      params.teams = ['Team Alpha', 'Team Beta'];
      params.members = ['Alex', 'Blake', 'Casey', 'Devon'];
      params.leaders = ['Avery', 'Jordan'];
      break;
    case 'pyramidList':
      params.levels = [
        { label: 'Level 1', items: ['Item A', 'Item B'] },
        { label: 'Level 2', items: ['Item C', 'Item D'] },
        { label: 'Level 3', items: ['Item E'] },
      ];
      break;
    case 'segmentedPyramid':
      params.levels = [
        { label: 'Level 1', segments: ['A', 'B'] },
        { label: 'Level 2', segments: ['C', 'D'] },
        { label: 'Level 3', segments: ['E'] },
      ];
      break;
    case 'detailedProcess':
      params.items = [
        'Design | Wireframes | Prototypes',
        'Build | Frontend | Backend',
        'Test | Unit Tests | QA',
      ];
      break;
    case 'nestedList':
      params.levels = [
        { label: 'Core', items: ['Alpha', 'Beta'] },
        { label: 'Advanced', items: ['Gamma', 'Delta'] },
      ];
      break;
    case 'equation':
      params.inputs = ['Input A', 'Input B'];
      params.outputs = ['Output'];
      break;
    case 'counterBalance':
      params.sides = ['Left', 'Right'];
      params.leftWeight = 60;
      params.rightWeight = 40;
      break;
    case 'hub':
      params.centers = ['Hub'];
      params.spokes = ['Spoke 1', 'Spoke 2', 'Spoke 3'];
      break;
    case 'interconnected':
      params.items = sampleWords(4, 'Node');
      break;
    case 'converging':
      params.items = ['Input A', 'Input B', 'Input C'];
      params.target = 'Target';
      break;
    case 'diverging':
      params.source = 'Source';
      params.items = ['Output A', 'Output B', 'Output C'];
      break;
    case 'cluster':
      params.center = 'Core';
      params.items = ['Edge A', 'Edge B', 'Edge C'];
      break;
    case 'steppedVenn':
      params.circles = ['Set A', 'Set B', 'Set C'];
      break;
    case 'linearVenn':
      params.circles = ['Set A', 'Set B', 'Set C'];
      params.overlap = 0.35;
      break;
    case 'venn':
      params.circles = ['Set A', 'Set B', 'Set C'];
      break;
    case 'pictureBlocks':
      params.items = makeImageItems(Math.max(minItems, 2), 'Feature');
      break;
    case 'pictureList':
      params.images = makeImageItems(Math.max(minItems, 2), 'Member');
      break;
    case 'framedPicture':
      params.images = makeImageItems(Math.max(minItems, 2), 'Gallery');
      break;
    case 'pictureGrid':
      params.images = makeImageItems(Math.max(minItems, 2), 'Image');
      params.columns = 3;
      break;
    case 'pictureCallout':
      params.image = placeholderImage;
      params.callouts = ['Feature A', 'Feature B', 'Feature C'];
      break;
    case 'events':
      params.events = ['Kickoff', 'Milestone', 'Launch'];
      break;
    case 'funnel':
      params.stages = ['Awareness', 'Interest', 'Decision'];
      break;
    default:
      break;
  }

  return params;
};

for (const glyphset of glyphsets) {
  const params = makeParams(glyphset);
  const diagram = glyphset.generator(params);
  const jsonPath = `${sourceDir}/${glyphset.id}.json`;
  const svgPath = `${outputDir}/${glyphset.id}.svg`;

  writeFileSync(jsonPath, JSON.stringify(diagram, null, 2));

  execFileSync('node', [
    'packages/cli/dist/cli.js',
    'render',
    jsonPath,
    '--output',
    svgPath,
  ], { stdio: 'ignore' });
}

console.log(`Generated ${glyphsets.length} glyphset previews.`);
