import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Sankey node shape - rectangular block representing a step in a flow
 * The chart itself handles rendering flows between nodes with variable widths
 */
export const sankeyNode: ShapeDefinition = {
  id: 'sankeyNode',

  bounds(ctx: ShapeRenderContext) {
    const textSize = ctx.measureText
      ? ctx.measureText(ctx.node.label || ctx.node.id, ctx.style)
      : { width: 80, height: 20 };
    const padding = (ctx.style && ctx.style.padding) || 16;

    return {
      width: Math.max(textSize.width + padding * 2, 120),
      height: Math.max(textSize.height + padding * 2, 80),
    };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'n' },
      { x: bounds.width, y: bounds.height / 2, name: 'e' },
      { x: bounds.width / 2, y: bounds.height, name: 's' },
      { x: 0, y: bounds.height / 2, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill =
      (ctx.style && typeof ctx.style.fill === 'string' && ctx.style.fill) ||
      '#4a90e2';
    const stroke =
      (ctx.style && typeof ctx.style.stroke === 'string' && ctx.style.stroke) ||
      '#2c5aa0';
    const strokeWidth =
      (ctx.style &&
        typeof ctx.style.strokeWidth === 'number' &&
        ctx.style.strokeWidth) ||
      2;
    const opacity =
      (ctx.style &&
        typeof ctx.style.opacity === 'number' &&
        ctx.style.opacity) ||
      0.8;
    const fontFamily =
      (ctx.style &&
        typeof ctx.style.fontFamily === 'string' &&
        ctx.style.fontFamily) ||
      'sans-serif';
    const fontSize =
      (ctx.style &&
        typeof ctx.style.fontSize === 'number' &&
        ctx.style.fontSize) ||
      14;

    // Sankey nodes are typically rectangles with rounded corners
    const rx = 4;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" 
            rx="${rx}" opacity="${opacity}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${fontFamily}" 
            font-size="${fontSize}"
            fill="#fff" font-weight="600">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Full Sankey diagram shape - renders complete diagram with nodes and flows
 * Data format:
 * {
 *   nodes: [{ id: 'A', label: 'Source A' }, ...],
 *   links: [{ source: 'A', target: 'B', value: 100 }, ...]
 * }
 */
export const sankeyChart: ShapeDefinition = {
  id: 'sankeyChart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    // Normalize data access - handle both direct and nested formats
    let sankeyData = ctx.node.data;

    // If data is wrapped with shape ID key (from data panel), unwrap it
    if (sankeyData && typeof sankeyData === 'object') {
      const keys = Object.keys(sankeyData);
      if (keys.length === 1 && !sankeyData.nodes && !sankeyData.links) {
        const potentialData = sankeyData[keys[0]];
        if (
          potentialData &&
          typeof potentialData === 'object' &&
          ('nodes' in potentialData || 'links' in potentialData)
        ) {
          sankeyData = potentialData;
        }
      }
    }

    // Fixed dimensions for Sankey chart
    const width = (sankeyData?.width as number) || 800;
    const height = (sankeyData?.height as number) || 600;
    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'n' },
      { x: bounds.width, y: bounds.height / 2, name: 'e' },
      { x: bounds.width / 2, y: bounds.height, name: 's' },
      { x: 0, y: bounds.height / 2, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    // Normalize data access - handle both direct and nested formats
    let sankeyData = ctx.node.data;

    // If data is wrapped with shape ID key (from data panel), unwrap it
    if (sankeyData && typeof sankeyData === 'object') {
      // Check if this is a wrapped format: { shapeId: { nodes: [...], links: [...] } }
      const keys = Object.keys(sankeyData);
      if (keys.length === 1 && !sankeyData.nodes && !sankeyData.links) {
        const potentialData = sankeyData[keys[0]];
        if (
          potentialData &&
          typeof potentialData === 'object' &&
          ('nodes' in potentialData || 'links' in potentialData)
        ) {
          sankeyData = potentialData;
        }
      }
    }

    const nodes = sankeyData?.nodes as
      | Array<{ id: string; label?: string; color?: string }>
      | undefined;
    const links = sankeyData?.links as
      | Array<{ source: string; target: string; value: number; color?: string }>
      | undefined;

    if (!nodes || nodes.length === 0) {
      return `<text x="${position.x}" y="${position.y}" fill="#6b7280" font-size="14">No Sankey data</text>`;
    }

    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const width = bounds.width;
    const height = bounds.height;

    // If no links, just render nodes in a single column
    if (!links || links.length === 0) {
      const nodePositions = new Map<
        string,
        { x: number; y: number; width: number; height: number }
      >();
      const nodeWidth = 20;
      const nodeHeight = 80;
      const nodePadding = 20;

      let currentY = (height - nodes.length * (nodeHeight + nodePadding)) / 2;
      for (const node of nodes) {
        nodePositions.set(node.id, {
          x: width / 2 - nodeWidth / 2,
          y: currentY,
          width: nodeWidth,
          height: nodeHeight,
        });
        currentY += nodeHeight + nodePadding;
      }

      const nodeValues = new Map<string, number>();
      for (const node of nodes) {
        nodeValues.set(node.id, 0);
      }

      const nodeElements = renderNodes(nodes, nodePositions, nodeValues, x, y);
      return `<g>${nodeElements}</g>`;
    }

    // Calculate node layers (columns) using topological sort
    const nodeLayers = calculateNodeLayers(nodes, links);
    const numLayers = Math.max(...Array.from(nodeLayers.values())) + 1;

    // Calculate node values (sum of incoming/outgoing flows)
    const nodeValues = calculateNodeValues(nodes, links);

    // Position nodes in layers
    const nodePositions = calculateNodePositions(
      nodes,
      nodeLayers,
      nodeValues,
      numLayers,
      width,
      height
    );

    // Render flows (links) first so they appear behind nodes
    const flows = renderFlows(links, nodePositions, x, y);

    // Render nodes
    const nodeElements = renderNodes(nodes, nodePositions, nodeValues, x, y);

    return `<g>${flows}${nodeElements}</g>`;
  },
};

/**
 * Calculate which layer (column) each node belongs to using topological sort
 */
function calculateNodeLayers(
  nodes: Array<{ id: string; label?: string }>,
  links: Array<{ source: string; target: string; value: number }>
): Map<string, number> {
  const layers = new Map<string, number>();
  const incomingCount = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  // Initialize
  for (const node of nodes) {
    incomingCount.set(node.id, 0);
    outgoing.set(node.id, []);
  }

  // Build graph
  for (const link of links) {
    incomingCount.set(link.target, (incomingCount.get(link.target) || 0) + 1);
    const targets = outgoing.get(link.source) || [];
    targets.push(link.target);
    outgoing.set(link.source, targets);
  }

  // Find source nodes (no incoming edges)
  const queue: Array<{ id: string; layer: number }> = [];
  for (const node of nodes) {
    if (incomingCount.get(node.id) === 0) {
      queue.push({ id: node.id, layer: 0 });
      layers.set(node.id, 0);
    }
  }

  // BFS to assign layers
  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextLayer = current.layer + 1;

    for (const target of outgoing.get(current.id) || []) {
      const count = incomingCount.get(target)! - 1;
      incomingCount.set(target, count);

      if (count === 0) {
        layers.set(target, nextLayer);
        queue.push({ id: target, layer: nextLayer });
      }
    }
  }

  // Assign remaining nodes (cycles) to last layer
  for (const node of nodes) {
    if (!layers.has(node.id)) {
      const maxLayer = Math.max(...Array.from(layers.values()));
      layers.set(node.id, maxLayer + 1);
    }
  }

  return layers;
}

/**
 * Calculate total value flowing through each node
 */
function calculateNodeValues(
  nodes: Array<{ id: string }>,
  links: Array<{ source: string; target: string; value: number }>
): Map<string, number> {
  const values = new Map<string, number>();

  for (const node of nodes) {
    values.set(node.id, 0);
  }

  for (const link of links) {
    // Use maximum of incoming and outgoing flows
    const sourceVal = values.get(link.source) || 0;
    const targetVal = values.get(link.target) || 0;
    values.set(link.source, Math.max(sourceVal, link.value));
    values.set(link.target, Math.max(targetVal, link.value));
  }

  return values;
}

/**
 * Position nodes within their assigned layers
 */
function calculateNodePositions(
  nodes: Array<{ id: string }>,
  layers: Map<string, number>,
  values: Map<string, number>,
  numLayers: number,
  width: number,
  height: number
): Map<string, { x: number; y: number; width: number; height: number }> {
  const positions = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();
  const nodeWidth = 20;
  const nodePadding = 20;
  const layerWidth = (width - nodeWidth) / (numLayers - 1 || 1);

  // Group nodes by layer
  const nodesByLayer = new Map<number, string[]>();
  for (const node of nodes) {
    const layer = layers.get(node.id) || 0;
    const layerNodes = nodesByLayer.get(layer) || [];
    layerNodes.push(node.id);
    nodesByLayer.set(layer, layerNodes);
  }

  // Calculate maximum value in each layer for height scaling
  const maxValue = Math.max(...Array.from(values.values()));

  // Position nodes vertically within each layer
  for (let layer = 0; layer < numLayers; layer++) {
    const layerNodes = nodesByLayer.get(layer) || [];
    const totalHeight = layerNodes.length * nodePadding;

    let currentY = (height - totalHeight) / 2;

    for (const nodeId of layerNodes) {
      const nodeValue = values.get(nodeId) || 0;
      const nodeHeight = Math.max((nodeValue / maxValue) * (height * 0.6), 30);

      positions.set(nodeId, {
        x: layer * layerWidth,
        y: currentY,
        width: nodeWidth,
        height: nodeHeight,
      });

      currentY += nodeHeight + nodePadding;
    }
  }

  return positions;
}

/**
 * Render flow paths between nodes with variable widths
 */
function renderFlows(
  links: Array<{
    source: string;
    target: string;
    value: number;
    color?: string;
  }>,
  positions: Map<
    string,
    { x: number; y: number; width: number; height: number }
  >,
  offsetX: number,
  offsetY: number
): string {
  const maxValue = Math.max(...links.map((l) => l.value));

  return links
    .map((link) => {
      const source = positions.get(link.source);
      const target = positions.get(link.target);

      if (!source || !target) return '';

      const flowWidth = Math.max((link.value / maxValue) * 80, 2);

      // Source point (right edge of source node)
      const x1 = offsetX + source.x + source.width;
      const y1 = offsetY + source.y + source.height / 2;

      // Target point (left edge of target node)
      const x2 = offsetX + target.x;
      const y2 = offsetY + target.y + target.height / 2;

      // Control points for curved path
      const cx1 = x1 + (x2 - x1) * 0.5;
      const cx2 = x1 + (x2 - x1) * 0.5;

      // Create gradient path with variable width
      const topPath = `M ${x1} ${y1 - flowWidth / 2} C ${cx1} ${y1 - flowWidth / 2}, ${cx2} ${y2 - flowWidth / 2}, ${x2} ${y2 - flowWidth / 2}`;
      const bottomPath = `L ${x2} ${y2 + flowWidth / 2} C ${cx2} ${y2 + flowWidth / 2}, ${cx1} ${y1 + flowWidth / 2}, ${x1} ${y1 + flowWidth / 2} Z`;

      const color = link.color || '#4a90e2';
      const opacity = 0.4;

      return `<path d="${topPath} ${bottomPath}" fill="${color}" opacity="${opacity}" stroke="none" />`;
    })
    .join('\n');
}

/**
 * Render node rectangles
 */
function renderNodes(
  nodes: Array<{ id: string; label?: string; color?: string }>,
  positions: Map<
    string,
    { x: number; y: number; width: number; height: number }
  >,
  values: Map<string, number>,
  offsetX: number,
  offsetY: number
): string {
  return nodes
    .map((node) => {
      const pos = positions.get(node.id);
      if (!pos) return '';

      const x = offsetX + pos.x;
      const y = offsetY + pos.y;
      const color = node.color || '#4a90e2';
      const label = node.label || node.id;
      const value = values.get(node.id) || 0;

      return `
        <rect x="${x}" y="${y}" width="${pos.width}" height="${pos.height}"
              fill="${color}" stroke="#333" stroke-width="1" rx="2" />
        
        <text x="${x + pos.width + 8}" y="${y + pos.height / 2}" 
              text-anchor="start" dominant-baseline="middle"
              font-size="12" fill="#333" font-weight="500">
          ${label}
        </text>
        
        <text x="${x + pos.width + 8}" y="${y + pos.height / 2 + 14}" 
              text-anchor="start" dominant-baseline="middle"
              font-size="10" fill="#666">
          ${value.toFixed(0)}
        </text>
      `;
    })
    .join('\n');
}
