import type {
  GitGraphBranch,
  GitGraphCommit,
  GitGraphMerge,
  GitGraphProfile,
} from '@runiq/core';
import { getDiagramTheme } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';

export interface GitGraphRenderOptions {
  width?: number;
  height?: number;
  columnSpacing?: number;
  rowSpacing?: number;
  margin?: number;
}

export interface GitGraphRenderResult {
  svg: string;
  warnings: string[];
}

const BRANCH_PALETTE = [
  '#0f172a',
  '#2563eb',
  '#16a34a',
  '#f97316',
  '#7c3aed',
  '#db2777',
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) {
    return null;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null;
  }
  return { r, g, b };
}

function getContrastColor(background: string, fallback: string): string {
  const rgb = hexToRgb(background);
  if (!rgb) {
    return fallback;
  }
  const luminance =
    (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

function ensureBranches(
  profile: GitGraphProfile
): GitGraphBranch[] {
  const branches = [...profile.branches];
  const existing = new Set(branches.map((b) => b.id));

  for (const commit of profile.commits) {
    if (commit.branch && !existing.has(commit.branch)) {
      branches.push({ id: commit.branch });
      existing.add(commit.branch);
    }
  }

  for (const merge of profile.merges) {
    if (merge.into && !existing.has(merge.into)) {
      branches.push({ id: merge.into });
      existing.add(merge.into);
    }
    if (merge.from && !existing.has(merge.from)) {
      branches.push({ id: merge.from });
      existing.add(merge.from);
    }
  }

  return branches;
}

export function renderGitGraph(
  profile: GitGraphProfile,
  options: GitGraphRenderOptions = {}
): GitGraphRenderResult {
  const warnings: string[] = [];
  const columnSpacing = options.columnSpacing ?? 140;
  const rowSpacing = options.rowSpacing ?? 60;
  const margin = options.margin ?? 40;
  const nodeRadius = 6;
  const orientation = profile.orientation || 'vertical';
  const theme = getDiagramTheme(profile.theme || 'runiq');
  const background = theme?.backgroundColor || '#ffffff';
  const textColor = getContrastColor(background, theme?.textColor || '#0f172a');
  const edgeColor = theme?.edgeColor || '#0f172a';
  const branchDefault = theme?.edgeColor || '#1f2937';

  const branches = ensureBranches(profile);
  const branchIndex = new Map<string, number>();
  const branchColors = new Map<string, string>();

  branches.forEach((branch, index) => {
    branchIndex.set(branch.id, index);
    branchColors.set(branch.id, branch.color || BRANCH_PALETTE[index % BRANCH_PALETTE.length]);
  });

  const entries: Array<
    | { type: 'commit'; data: GitGraphCommit; order: number }
    | { type: 'merge'; data: GitGraphMerge; order: number }
  > = [];

  profile.commits.forEach((commit, index) => {
    entries.push({
      type: 'commit',
      data: commit,
      order: commit.order ?? index,
    });
  });
  profile.merges.forEach((merge, index) => {
    entries.push({
      type: 'merge',
      data: merge,
      order: merge.order ?? profile.commits.length + index,
    });
  });

  entries.sort((a, b) => a.order - b.order);

  if (entries.length === 0) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(profile.name || 'GitGraph')}</title>
  <rect x="0" y="0" width="320" height="180" fill="#ffffff" />
  <text x="20" y="40" font-family="sans-serif" font-size="14" fill="#64748b">No commits defined</text>
</svg>`;
    return { svg, warnings };
  }

  const baseWidth =
    margin * 2 + (branches.length - 1) * columnSpacing + 200;
  const baseHeight =
    margin * 2 + (entries.length - 1) * rowSpacing + 100;
  const svgWidth =
    options.width ?? (orientation === 'vertical' ? baseWidth : baseHeight);
  const svgHeight =
    options.height ?? (orientation === 'vertical' ? baseHeight : baseWidth);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">`;
  svg += `<title id="diagram-title">${escapeXml(profile.name || 'GitGraph')}</title>`;
  svg += `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="${background}" />`;

  // Branch labels
  branches.forEach((branch, index) => {
    const x = margin + index * columnSpacing;
    const labelX = orientation === 'vertical' ? x : margin - 12;
    const labelY = orientation === 'vertical' ? margin - 12 : x;
    const label = branch.label || branch.id;
    const color = branchColors.get(branch.id) || branchDefault;
    svg += `<text x="${labelX}" y="${labelY}" font-family="sans-serif" font-size="12" fill="${color}">${escapeXml(label)}</text>`;
  });

  const lastCommitByBranch = new Map<string, { x: number; y: number }>();

  entries.forEach((entry, entryIndex) => {
    const axis = margin + entryIndex * rowSpacing;
    const branchId =
      entry.type === 'merge' ? entry.data.into : entry.data.branch;
    const index = branchIndex.get(branchId) ?? 0;
    const track = margin + index * columnSpacing;
    const x = orientation === 'vertical' ? track : axis;
    const y = orientation === 'vertical' ? axis : track;
    const branchColor = branchColors.get(branchId) || '#0f172a';

    const labelText =
      entry.type === 'commit'
        ? entry.data.label || entry.data.message || entry.data.id
        : entry.data.label || `Merge ${entry.data.from}`;

    const previous = lastCommitByBranch.get(branchId);
    if (previous) {
      svg += `<line x1="${previous.x}" y1="${previous.y}" x2="${x}" y2="${y}" stroke="${branchColor}" stroke-width="2" />`;
    }

    if (entry.type === 'merge') {
      const sourceBranch = entry.data.from;
      const sourcePoint = lastCommitByBranch.get(sourceBranch);
      const sourceColor = branchColors.get(sourceBranch) || edgeColor;
      if (sourcePoint) {
        svg += `<line x1="${sourcePoint.x}" y1="${sourcePoint.y}" x2="${x}" y2="${y}" stroke="${sourceColor}" stroke-width="2" stroke-dasharray="4,4" />`;
      }
    }

    svg += `<circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="${branchColor}" stroke="#ffffff" stroke-width="1" />`;

    const textX = x + 14;
    const textY = orientation === 'vertical' ? y + 4 : y + 18;
    svg += `<text x="${textX}" y="${textY}" font-family="sans-serif" font-size="12" fill="${textColor}">${escapeXml(labelText)}</text>`;

    const tag =
      entry.type === 'commit' ? entry.data.tag : entry.data.tag;
    if (tag) {
      const tagX = textX + 6 + labelText.length * 6;
      const tagY = orientation === 'vertical' ? y - 10 : y - 26;
      const tagWidth = Math.max(34, tag.length * 7 + 12);
      const tagFill = theme?.nodeColors?.[0] || '#e2e8f0';
      const tagText = getContrastColor(tagFill, textColor);
      svg += `<rect x="${tagX}" y="${tagY}" width="${tagWidth}" height="18" rx="9" ry="9" fill="${tagFill}" stroke="${edgeColor}" />`;
      svg += `<text x="${tagX + 8}" y="${tagY + 13}" font-family="sans-serif" font-size="10" fill="${tagText}">${escapeXml(tag)}</text>`;
    }

    lastCommitByBranch.set(branchId, { x, y });
  });

  svg += '</svg>';
  return { svg, warnings };
}
