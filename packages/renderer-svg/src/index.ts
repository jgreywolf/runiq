import type { DiagramAst, LaidOutDiagram } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';
import { renderContainer } from './renderers/container.js';
import { renderEdge } from './renderers/edge.js';
import { renderNode } from './renderers/node.js';
import { renderDefs } from './renderers/defs.js';
import { calculateGraphMetrics, getDiagramTheme } from '@runiq/core';

// Re-export Wardley renderer
export {
  renderWardleyMap,
  type WardleyRenderOptions,
  type WardleyRenderResult,
} from './wardley-renderer.js';

// Re-export Sequence renderer
export {
  renderSequenceDiagram,
  type SequenceRenderOptions,
  type SequenceRenderResult,
} from './sequence-renderer.js';

// Re-export Timeline renderer
export {
  renderTimeline,
  type TimelineRenderOptions,
  type TimelineRenderResult,
} from './timeline-renderer.js';

// Re-export label utilities for inline icons
export {
  parseLabelWithIcons,
  renderLabelWithIcons,
  measureLabelWithIcons,
  type LabelSegment,
} from './renderers/label-with-icons.js';

export interface RenderOptions {
  strict?: boolean; // strict SVG mode (no enhanced features)
  title?: string;
  description?: string;
  theme?: string; // Theme name (defaults to 'professional')
}

export interface RenderResult {
  svg: string;
  warnings: string[];
}

export function renderSvg(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options: RenderOptions = {}
): RenderResult {
  const warnings: string[] = [];
  const { strict = false } = options;

  // Apply theme: prioritize diagram.theme, then options.theme, then default to 'runiq'
  const themeId = diagram.theme || options.theme || 'runiq';
  const theme = getDiagramTheme(themeId);

  // Calculate graph metrics if diagram has edges (network analysis)
  const graphMetrics =
    diagram.edges.length > 0 ? calculateGraphMetrics(diagram) : null;

  // SVG header
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    width="${layout.size.width}" height="${layout.size.height}" 
    viewBox="0 0 ${layout.size.width} ${layout.size.height}"
    role="img" aria-labelledby="diagram-title">`;

  // Add title and description for accessibility
  const title = options.title || diagram.title || 'Diagram';
  svg += `<title id="diagram-title">${escapeXml(title)}</title>`;

  if (options.description) {
    svg += `<desc>${escapeXml(options.description)}</desc>`;
  }

  // Add default styles and patterns
  svg += renderDefs();

  // Render containers first (as backgrounds)
  if (layout.containers) {
    for (const container of layout.containers) {
      svg += renderContainer(container, diagram, strict);
    }
  }

  // Render edges (so they appear behind nodes but above containers)
  for (const edge of layout.edges) {
    svg += renderEdge(edge, diagram, strict, warnings, theme);
  }

  // Render nodes (on top of everything)
  for (let i = 0; i < layout.nodes.length; i++) {
    const node = layout.nodes[i];
    svg += renderNode(node, diagram, strict, warnings, graphMetrics, theme, i);
  }

  svg += '</svg>';

  return { svg, warnings };
}

// helpers moved into renderers modules
