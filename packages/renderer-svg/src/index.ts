import type { DiagramAst, LaidOutDiagram } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';
import { renderContainer } from './renderers/container.js';
import { renderEdge } from './renderers/edge.js';
import { renderNode } from './renderers/node.js';
import { renderDefs } from './renderers/defs.js';
import {
  calculateGraphMetrics,
  getDiagramTheme,
  getContainerMembership,
} from '@runiq/core';

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

// Re-export Kanban renderer
export {
  renderKanban,
  type KanbanRenderOptions,
  type KanbanRenderResult,
} from './kanban-renderer.js';

// Re-export GitGraph renderer
export {
  renderGitGraph,
  type GitGraphRenderOptions,
  type GitGraphRenderResult,
} from './gitgraph-renderer.js';

// Re-export Treemap renderer
export {
  renderTreemap,
  type TreemapRenderOptions,
  type TreemapRenderResult,
} from './treemap-renderer.js';

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

  const membership = getContainerMembership(diagram);
  const nodeIndexById = new Map(
    layout.nodes.map((node, index) => [node.id, index])
  );
  const freeNodes = layout.nodes.filter((node) => !membership.has(node.id));
  const containedNodes = layout.nodes.filter((node) =>
    membership.has(node.id)
  );

  // SVG header
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    width="${layout.size.width}" height="${layout.size.height}" 
    viewBox="0 0 ${layout.size.width} ${layout.size.height}"
    role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">\n`;

  // Add title and description for accessibility
  const title = options.title || diagram.title || 'Diagram';
  svg += `<title id="diagram-title">${escapeXml(title)}</title>`;

  if (options.description) {
    svg += `<desc>${escapeXml(options.description)}</desc>`;
  }

  // Add default styles and patterns
  svg += renderDefs();

  // Render nodes outside containers behind container backgrounds
  for (const node of freeNodes) {
    const nodeIndex = nodeIndexById.get(node.id) ?? 0;
    svg += renderNode(
      node,
      diagram,
      strict,
      warnings,
      graphMetrics,
      theme,
      nodeIndex
    );
  }

  // Render containers (as backgrounds for contained nodes)
  if (layout.containers) {
    for (const container of layout.containers) {
      svg += renderContainer(container, diagram, strict);
    }
  }

  // Render edges (so they appear behind nodes but above containers)
  for (const edge of layout.edges) {
    svg += renderEdge(edge, diagram, strict, warnings, theme);
  }

  // Render contained nodes on top of containers
  for (const node of containedNodes) {
    const nodeIndex = nodeIndexById.get(node.id) ?? 0;
    svg += renderNode(
      node,
      diagram,
      strict,
      warnings,
      graphMetrics,
      theme,
      nodeIndex
    );
  }

  svg += '</svg>';

  return { svg, warnings };
}

// helpers moved into renderers modules
