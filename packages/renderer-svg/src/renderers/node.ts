import type {
  DiagramAst,
  PositionedNode,
  GraphMetrics,
  DiagramTheme,
} from '@runiq/core';
import {
  shapeRegistry,
  createTextMeasurer,
  type NodeMetrics,
  getThemeNodeColor,
} from '@runiq/core';
import { escapeXml } from './utils.js';
import { renderIcon } from './icons.js';
import { renderLabelWithIcons } from './label-with-icons.js';

const DARK_TEXT = '#0f172a';
const LIGHT_TEXT = '#ffffff';

function resolveTextColor(fill: string | undefined, fallback: string): string {
  if (!fill) {
    return fallback;
  }

  const hex = fill.trim().replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) {
    return fallback;
  }

  const normalized =
    hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return fallback;
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? DARK_TEXT : LIGHT_TEXT;
}

export function renderNode(
  positioned: PositionedNode,
  diagram: DiagramAst,
  strict: boolean,
  warnings: string[],
  graphMetrics: GraphMetrics | null = null,
  theme?: DiagramTheme,
  nodeIndex: number = 0
): string {
  const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
  if (!nodeAst) {
    warnings.push(`Node ${positioned.id} not found in diagram AST`);
    return '';
  }

  const measureText = createTextMeasurer();
  const shapeImpl = shapeRegistry.get(nodeAst.shape);
  if (!shapeImpl) {
    warnings.push(`Unknown shape: ${nodeAst.shape}`);
    return renderFallbackNode(positioned, nodeAst);
  }

  const style: any = nodeAst.style ? diagram.styles?.[nodeAst.style] || {} : {};

  // Apply theme colors as defaults if theme is provided and no explicit colors
  if (theme) {
    if (!style.fill && !nodeAst.data?.fillColor) {
      style.fill = getThemeNodeColor(theme, nodeIndex);
    }
    if (!style.stroke && !nodeAst.data?.strokeColor) {
      style.stroke = theme.edgeColor;
    }
  }

  // Merge inline properties from node.data into style
  if (nodeAst.data) {
    // Pedigree properties
    if ((nodeAst.data as any).affected !== undefined) {
      (style as any).affected = (nodeAst.data as any).affected;
    }
    if ((nodeAst.data as any).carrier !== undefined) {
      (style as any).carrier = (nodeAst.data as any).carrier;
    }
    if ((nodeAst.data as any).deceased !== undefined) {
      (style as any).deceased = (nodeAst.data as any).deceased;
    }
    // Inline styling properties
    if ((nodeAst.data as any).fillColor !== undefined) {
      (style as any).fill = (nodeAst.data as any).fillColor;
    }
    if ((nodeAst.data as any).textColor !== undefined) {
      (style as any).color = (nodeAst.data as any).textColor;
    }
    if ((nodeAst.data as any).strokeColor !== undefined) {
      (style as any).stroke = (nodeAst.data as any).strokeColor;
    }
    if ((nodeAst.data as any).strokeWidth !== undefined) {
      (style as any).strokeWidth = (nodeAst.data as any).strokeWidth;
    }
    if ((nodeAst.data as any).fontSize !== undefined) {
      (style as any).fontSize = (nodeAst.data as any).fontSize;
    }
    if ((nodeAst.data as any).fontFamily !== undefined) {
      (style as any).fontFamily = (nodeAst.data as any).fontFamily;
    }
    if ((nodeAst.data as any).borderRadius !== undefined) {
      (style as any).rx = (nodeAst.data as any).borderRadius;
      (style as any).ry = (nodeAst.data as any).borderRadius;
    }
    if ((nodeAst.data as any).opacity !== undefined) {
      (style as any).opacity = (nodeAst.data as any).opacity;
    }
  }

  if (!style.color && !nodeAst.data?.textColor) {
    const fallbackText = theme?.textColor || DARK_TEXT;
    style.color = resolveTextColor(
      typeof style.fill === 'string' ? style.fill : undefined,
      fallbackText
    );
  }

  // Create label renderer function that supports inline icons
  const renderLabel = (
    label: string,
    x: number,
    y: number,
    labelStyle: {
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      textAnchor?: 'start' | 'middle' | 'end';
      dominantBaseline?: string;
    }
  ) => {
    return renderLabelWithIcons(label, x, y, labelStyle, warnings);
  };

  const renderNodeAst =
    nodeAst.data && typeof nodeAst.data === 'object'
      ? { ...nodeAst, data: { ...nodeAst.data } }
      : { ...nodeAst, data: {} };

  if (theme && nodeAst.shape === 'sankeyChart') {
    (renderNodeAst.data as any).themePalette = theme.nodeColors;
  }

  let nodeMarkup = shapeImpl.render(
    { node: renderNodeAst as any, style, measureText, renderLabel },
    { x: positioned.x, y: positioned.y }
  );

  // Add icon if present
  if ((nodeAst as any).icon) {
    const iconMarkup = renderIcon((nodeAst as any).icon, positioned, warnings);
    if (iconMarkup) {
      nodeMarkup += iconMarkup;
    }
  }

  // Add metric badge if enabled and metrics available
  if (graphMetrics && (nodeAst.data as any)?.showMetrics) {
    const nodeMetrics = graphMetrics.nodes.find(
      (m) => m.nodeId === positioned.id
    );
    if (nodeMetrics) {
      const metricType = (nodeAst.data as any).metricType || 'degree';
      const metricPosition =
        (nodeAst.data as any).metricPosition || 'top-right';
      nodeMarkup += renderMetricBadge(
        nodeMetrics,
        positioned,
        metricType,
        metricPosition
      );
    }
  }

  // Wrap in group with optional link
  let groupAttrs = strict
    ? ''
    : ` data-runiq-node="${nodeAst.id}" data-node-id="${nodeAst.id}" data-node-shape="${nodeAst.shape}"`;

  // Add opacity if specified
  if ((style as any).opacity !== undefined) {
    groupAttrs += ` opacity="${(style as any).opacity}"`;
  }

  if ((nodeAst as any).link && !strict) {
    return `<a xlink:href="${escapeXml((nodeAst as any).link.href)}"${(nodeAst as any).link.target ? ` target="${(nodeAst as any).link.target}"` : ''}>
      <g${groupAttrs}>${nodeMarkup}${(nodeAst as any).tooltip ? `<title>${escapeXml((nodeAst as any).tooltip)}</title>` : ''}</g>
    </a>`;
  }

  return `<g${groupAttrs}>${nodeMarkup}${(nodeAst as any).tooltip ? `<title>${escapeXml((nodeAst as any).tooltip)}</title>` : ''}</g>`;
}

function renderFallbackNode(positioned: PositionedNode, node: any): string {
  const { x, y, width, height } = positioned;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="#f0f0f0" stroke="#333" stroke-width="1" rx="4" />
    <text x="${x + width / 2}" y="${y + height / 2}" 
          text-anchor="middle" dominant-baseline="middle" class="runiq-node-text">
      ${escapeXml(node.label || node.id)}
    </text>
  `;
}

/**
 * Render metric badge for a node
 * @param metrics - Node metrics to display
 * @param positioned - Node position and dimensions
 * @param metricType - Which metric to display (degree, betweenness, closeness, clustering)
 * @param position - Badge position (top-right, top-left, bottom-right, bottom-left)
 * @returns SVG markup for metric badge
 */
export function renderMetricBadge(
  metrics: NodeMetrics,
  positioned: PositionedNode,
  metricType: 'degree' | 'betweenness' | 'closeness' | 'clustering' = 'degree',
  position:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left' = 'top-right'
): string {
  const { x, y, width, height } = positioned;

  // Determine which metric value to display
  let value: string;
  let label: string;
  switch (metricType) {
    case 'degree':
      value = metrics.degree.toString();
      label = 'D';
      break;
    case 'betweenness':
      value = metrics.betweenness.toFixed(2);
      label = 'B';
      break;
    case 'closeness':
      value = metrics.closeness.toFixed(2);
      label = 'C';
      break;
    case 'clustering':
      value = metrics.clustering.toFixed(2);
      label = 'CC';
      break;
  }

  // Badge dimensions
  const badgeWidth = 32;
  const badgeHeight = 18;
  const fontSize = 10;
  const offset = 4;

  // Calculate badge position
  let badgeX: number;
  let badgeY: number;

  switch (position) {
    case 'top-right':
      badgeX = x + width - badgeWidth + offset;
      badgeY = y - offset;
      break;
    case 'top-left':
      badgeX = x - offset;
      badgeY = y - offset;
      break;
    case 'bottom-right':
      badgeX = x + width - badgeWidth + offset;
      badgeY = y + height - badgeHeight + offset;
      break;
    case 'bottom-left':
      badgeX = x - offset;
      badgeY = y + height - badgeHeight + offset;
      break;
  }

  const textX = badgeX + badgeWidth / 2;
  const textY = badgeY + badgeHeight / 2;

  return `
    <g class="runiq-metric-badge">
      <rect x="${badgeX}" y="${badgeY}" 
            width="${badgeWidth}" height="${badgeHeight}" 
            fill="#ffffff" stroke="#2196f3" stroke-width="1.5" 
            rx="3" opacity="0.95" />
      <text x="${textX}" y="${textY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="sans-serif" font-size="${fontSize}" 
            font-weight="600" fill="#2196f3">
        ${label}:${value}
      </text>
    </g>
  `;
}
