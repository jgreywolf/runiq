import type { TreemapNode, TreemapProfile } from '@runiq/core';
import { getDiagramTheme } from '@runiq/core';
import { escapeXml, renderMultilineText } from './renderers/utils.js';

export interface TreemapRenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  gap?: number;
  showValues?: boolean;
  showLegend?: boolean;
}

export interface TreemapRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULTS = {
  width: 900,
  height: 560,
  padding: 8,
  gap: 6,
};

const DEPTH_COLORS = ['#dbeafe', '#fee2e2', '#dcfce7', '#fde68a', '#e9d5ff'];

function getNodeValue(node: TreemapNode): number {
  if (node.value !== undefined) {
    return node.value;
  }
  if (node.children && node.children.length > 0) {
    return node.children.reduce((sum, child) => sum + getNodeValue(child), 0);
  }
  return 1;
}

function layoutChildren(
  nodes: TreemapNode[],
  x: number,
  y: number,
  width: number,
  height: number,
  layout: TreemapProfile['layout'],
  depth: number,
  padding: number,
  gap: number,
  results: Array<{ node: TreemapNode; x: number; y: number; width: number; height: number; depth: number }>
): void {
  if (nodes.length === 0) {
    return;
  }

  const total = nodes.reduce((sum, node) => sum + getNodeValue(node), 0);
  const innerX = x + padding;
  const innerY = y + padding;
  const innerWidth = Math.max(0, width - padding * 2);
  const innerHeight = Math.max(0, height - padding * 2);

  const sliceVertically =
    layout === 'slice-dice'
      ? depth % 2 === 0
      : innerWidth >= innerHeight;

  let cursorX = innerX;
  let cursorY = innerY;

  nodes.forEach((node, index) => {
    const ratio = total > 0 ? getNodeValue(node) / total : 0;
    const nodeWidth = sliceVertically ? innerWidth * ratio : innerWidth;
    const nodeHeight = sliceVertically ? innerHeight : innerHeight * ratio;

    const rectWidth = Math.max(0, nodeWidth - (index < nodes.length - 1 ? gap : 0));
    const rectHeight = Math.max(0, nodeHeight - (index < nodes.length - 1 ? gap : 0));

    results.push({ node, x: cursorX, y: cursorY, width: rectWidth, height: rectHeight, depth });

    if (node.children && node.children.length > 0) {
      layoutChildren(
        node.children,
        cursorX,
        cursorY,
        rectWidth,
        rectHeight,
        layout,
        depth + 1,
        padding,
        gap,
        results
      );
    }

    if (sliceVertically) {
      cursorX += nodeWidth + gap;
    } else {
      cursorY += nodeHeight + gap;
    }
  });
}

export function renderTreemap(
  profile: TreemapProfile,
  options: TreemapRenderOptions = {}
): TreemapRenderResult {
  const warnings: string[] = [];
  const width = options.width ?? DEFAULTS.width;
  const height = options.height ?? DEFAULTS.height;
  const padding = options.padding ?? profile.padding ?? DEFAULTS.padding;
  const gap = options.gap ?? profile.gap ?? DEFAULTS.gap;
  const layout = profile.layout ?? 'slice-dice';
  const theme = getDiagramTheme(profile.theme || 'runiq');
  const background = theme?.backgroundColor || '#ffffff';
  const textColor = theme?.textColor || '#0f172a';
  const showValues = options.showValues ?? profile.showValues ?? false;
  const showLegend = options.showLegend ?? profile.showLegend ?? false;

  if (!profile.nodes || profile.nodes.length === 0) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(profile.name || 'Treemap')}</title>
  <rect x="0" y="0" width="320" height="180" fill="#ffffff" />
  <text x="20" y="40" font-family="sans-serif" font-size="14" fill="#64748b">No treemap nodes defined</text>
</svg>`;
    return { svg, warnings };
  }

  const results: Array<{ node: TreemapNode; x: number; y: number; width: number; height: number; depth: number }> = [];
  layoutChildren(profile.nodes, 20, 20, width - 40, height - 40, layout, 0, padding, gap, results);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">`;
  svg += `<title id="diagram-title">${escapeXml(profile.name || 'Treemap')}</title>`;
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${background}" />`;

  results.forEach(({ node, x, y, width: rectWidth, height: rectHeight, depth }) => {
    const fill =
      node.color ||
      theme?.nodeColors?.[depth % (theme?.nodeColors?.length || 1)] ||
      DEPTH_COLORS[depth % DEPTH_COLORS.length];
    svg += `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${fill}" stroke="#ffffff" />`;

    const label = node.label;
    if (label && rectWidth > 40 && rectHeight > 24) {
      const textX = x + 6;
      const textY = y + 14;
      const valueText = showValues && node.value !== undefined ? ` (${node.value})` : '';
      const fullLabel = `${label}${valueText}`;
      const clipped = fullLabel.length > 28 ? `${fullLabel.slice(0, 25)}...` : fullLabel;
      svg += renderMultilineText(clipped, textX, textY, {
        textAnchor: 'start',
        dominantBaseline: 'hanging',
        fontFamily: 'sans-serif',
        fontSize: 12,
        fill: textColor,
      });
    }
  });

  if (showLegend) {
    const legendX = 20;
    let legendY = height - 20;
    const legendItems: Array<{ label: string; color: string }> = [];
    for (const node of profile.nodes) {
      const color =
        node.color ||
        theme?.nodeColors?.[legendItems.length % (theme?.nodeColors?.length || 1)] ||
        DEPTH_COLORS[legendItems.length % DEPTH_COLORS.length];
      legendItems.push({ label: node.label, color });
    }

    const maxItems = Math.min(legendItems.length, 6);
    for (let i = 0; i < maxItems; i++) {
      const item = legendItems[i];
      const itemY = legendY - i * 18;
      svg += `<rect x="${legendX}" y="${itemY - 10}" width="10" height="10" fill="${item.color}" stroke="#ffffff" />`;
      svg += `<text x="${legendX + 16}" y="${itemY}" font-family="sans-serif" font-size="11" fill="${textColor}">${escapeXml(item.label)}</text>`;
    }
  }

  svg += '</svg>';
  return { svg, warnings };
}
