import type {
  DiagramAst,
  LaidOutDiagram,
  PositionedNode,
  PositionedContainer,
  RoutedEdge,
  IconRef,
} from '@runiq/core';
import { shapeRegistry, iconRegistry, createTextMeasurer } from '@runiq/core';

export interface RenderOptions {
  strict?: boolean; // strict SVG mode (no enhanced features)
  title?: string;
  description?: string;
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

  const measureText = createTextMeasurer();

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

  // Add default styles
  svg += '<defs><style type="text/css"><![CDATA[';
  svg += '.runiq-node-text { font-family: sans-serif; font-size: 14px; }';
  svg += '.runiq-edge-text { font-family: sans-serif; font-size: 12px; }';
  svg +=
    '.runiq-container-label { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #666; }';
  svg += ']]></style>';

  // Add pedigree chart pattern for carrier shading
  svg +=
    '<pattern id="pedigree-half-fill" width="40" height="40" patternUnits="userSpaceOnUse">';
  svg += '<rect x="0" y="0" width="20" height="40" fill="#000"/>';
  svg += '<rect x="20" y="0" width="20" height="40" fill="#fff"/>';
  svg += '</pattern>';

  svg += '</defs>';

  // Render containers first (as backgrounds)
  if (layout.containers) {
    for (const container of layout.containers) {
      svg += renderContainer(container, diagram, strict);
    }
  }

  // Render edges (so they appear behind nodes but above containers)
  for (const edge of layout.edges) {
    svg += renderEdge(edge, diagram, strict, warnings);
  }

  // Render nodes (on top of everything)
  for (const node of layout.nodes) {
    svg += renderNode(node, diagram, measureText, strict, warnings);
  }

  svg += '</svg>';

  return { svg, warnings };
}

function renderNode(
  positioned: PositionedNode,
  diagram: DiagramAst,
  measureText: ReturnType<typeof createTextMeasurer>,
  strict: boolean,
  warnings: string[]
): string {
  const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
  if (!nodeAst) {
    warnings.push(`Node ${positioned.id} not found in diagram AST`);
    return '';
  }

  const shapeImpl = shapeRegistry.get(nodeAst.shape);
  if (!shapeImpl) {
    warnings.push(`Unknown shape: ${nodeAst.shape}`);
    return renderFallbackNode(positioned, nodeAst);
  }

  const style = nodeAst.style ? diagram.styles?.[nodeAst.style] || {} : {};

  // Merge inline pedigree properties from node.data into style
  if (nodeAst.data) {
    if (nodeAst.data.affected !== undefined) {
      style.affected = nodeAst.data.affected;
    }
    if (nodeAst.data.carrier !== undefined) {
      style.carrier = nodeAst.data.carrier;
    }
    if (nodeAst.data.deceased !== undefined) {
      style.deceased = nodeAst.data.deceased;
    }
  }

  let nodeMarkup = shapeImpl.render(
    { node: nodeAst, style, measureText },
    { x: positioned.x, y: positioned.y }
  );

  // Add icon if present
  if (nodeAst.icon) {
    const iconMarkup = renderIcon(nodeAst.icon, positioned, warnings);
    if (iconMarkup) {
      nodeMarkup += iconMarkup;
    }
  }

  // Wrap in group with optional link
  const groupAttrs = strict ? '' : ` data-runiq-node="${nodeAst.id}"`;

  if (nodeAst.link && !strict) {
    return `<a xlink:href="${escapeXml(nodeAst.link.href)}"${nodeAst.link.target ? ` target="${nodeAst.link.target}"` : ''}>
      <g${groupAttrs}>${nodeMarkup}${nodeAst.tooltip ? `<title>${escapeXml(nodeAst.tooltip)}</title>` : ''}</g>
    </a>`;
  }

  return `<g${groupAttrs}>${nodeMarkup}${nodeAst.tooltip ? `<title>${escapeXml(nodeAst.tooltip)}</title>` : ''}</g>`;
}

function renderContainer(
  container: PositionedContainer,
  diagram: DiagramAst,
  strict: boolean
): string {
  const { x, y, width, height, label, id } = container;

  // Find container declaration in AST for styling
  const containerAst = findContainerInAst(diagram.containers, id);
  const style = containerAst?.containerStyle || {};

  // Map ContainerStyle properties to SVG attributes
  const fill = style.backgroundColor || '#f9f9f9';
  const stroke = style.borderColor || '#ddd';
  const strokeWidth = style.borderWidth || 2;
  const rx = style.rx || 8;

  const groupAttrs = strict ? '' : ` data-runiq-container="${id}"`;

  let markup = `<g${groupAttrs}>`;

  // Container background
  markup += `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
    fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" />`;

  // Container label (top-left)
  if (label) {
    const labelX = x + 10;
    const labelY = y + 20;
    markup += `<text x="${labelX}" y="${labelY}" class="runiq-container-label">${escapeXml(label)}</text>`;
  }

  // Recursively render nested containers
  if (container.containers) {
    for (const nested of container.containers) {
      markup += renderContainer(nested, diagram, strict);
    }
  }

  markup += '</g>';

  return markup;
}

function findContainerInAst(
  containers: any[] | undefined,
  id: string
): any | undefined {
  if (!containers) return undefined;

  for (const container of containers) {
    if (container.id === id) return container;
    if (container.containers) {
      const found = findContainerInAst(container.containers, id);
      if (found) return found;
    }
  }
  return undefined;
}

function renderEdge(
  routed: RoutedEdge,
  diagram: DiagramAst,
  strict: boolean,
  warnings: string[]
): string {
  const edgeAst = diagram.edges.find(
    (e) => e.from === routed.from && e.to === routed.to
  );
  if (!edgeAst) {
    warnings.push(
      `Edge ${routed.from} -> ${routed.to} not found in diagram AST`
    );
    return '';
  }

  const points = routed.points;
  if (points.length < 2) {
    warnings.push(
      `Edge ${routed.from} -> ${routed.to} has insufficient points`
    );
    return '';
  }

  const style = edgeAst.style ? diagram.styles?.[edgeAst.style] || {} : {};
  const stroke = style.stroke || '#333';
  const strokeWidth = style.strokeWidth || 1;

  // Determine line style
  const lineStyle = edgeAst.lineStyle || 'solid';
  let strokeDasharray = '';
  let isDoubleLine = false;

  if (lineStyle === 'dashed') {
    strokeDasharray = ' stroke-dasharray="5,3"';
  } else if (lineStyle === 'dotted') {
    strokeDasharray = ' stroke-dasharray="2,2"';
  } else if (lineStyle === 'double') {
    // Double line for consanguineous marriages
    isDoubleLine = true;
  }

  // Create path
  const start = points[0];
  let pathData = `M ${start.x} ${start.y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  const groupAttrs = strict
    ? ''
    : ` data-runiq-edge="${routed.from}-${routed.to}"`;

  let edgeMarkup = `<g${groupAttrs}>`;

  // Determine arrow type
  const arrowType = edgeAst.arrowType || 'standard';
  const edgeType = edgeAst.edgeType; // UML relationship type (aggregation, composition, etc.)
  const arrowId = `arrow-${edgeType || arrowType}-${routed.from}-${routed.to}`;

  // Define arrow marker based on type
  // For UML relationships, use edgeType to determine marker
  let useMarkerStart = false; // Diamonds go on the source (start) end

  if (
    edgeType === 'aggregation' ||
    edgeType === 'composition' ||
    arrowType !== 'none'
  ) {
    edgeMarkup += `<defs>`;

    if (edgeType === 'aggregation') {
      // Hollow diamond (shared aggregation)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="12" markerHeight="12" refX="0" refY="6" orient="auto" markerUnits="strokeWidth">
        <polygon points="6,0 12,6 6,12 0,6" fill="white" stroke="${stroke}" stroke-width="1" />
      </marker>`;
      useMarkerStart = true;
    } else if (edgeType === 'composition') {
      // Filled diamond (composite aggregation)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="12" markerHeight="12" refX="0" refY="6" orient="auto" markerUnits="strokeWidth">
        <polygon points="6,0 12,6 6,12 0,6" fill="${stroke}" />
      </marker>`;
      useMarkerStart = true;
    } else if (arrowType === 'standard') {
      // Filled triangle (association, standard arrow)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="${stroke}" />
      </marker>`;
    } else if (arrowType === 'hollow') {
      // Hollow triangle (generalization/inheritance)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="12" markerHeight="12" refX="11" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="white" stroke="${stroke}" stroke-width="1" />
      </marker>`;
    } else if (arrowType === 'open') {
      // Open arrow (dependency)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polyline points="0,0 9,3 0,6" fill="none" stroke="${stroke}" stroke-width="1" />
      </marker>`;
    }

    edgeMarkup += `</defs>`;
  }

  // Edge line with optional marker
  const markerAttr = useMarkerStart
    ? ` marker-start="url(#${arrowId})"` // Diamond on source end
    : edgeType !== 'aggregation' &&
        edgeType !== 'composition' &&
        arrowType !== 'none'
      ? ` marker-end="url(#${arrowId})"` // Arrow on target end
      : '';

  // Render double line for consanguineous marriages
  if (isDoubleLine) {
    // Parallel lines with small offset (3px apart)
    const offset = 3;

    // Calculate perpendicular offset for parallel lines
    // For simplicity, offset vertically for horizontal lines, horizontally for vertical lines
    const isHorizontal =
      Math.abs(points[points.length - 1].y - points[0].y) <
      Math.abs(points[points.length - 1].x - points[0].x);

    if (isHorizontal) {
      // Offset vertically for horizontal lines
      const offsetPath1 =
        `M ${start.x} ${start.y - offset}` +
        points
          .slice(1)
          .map((p) => ` L ${p.x} ${p.y - offset}`)
          .join('');
      const offsetPath2 =
        `M ${start.x} ${start.y + offset}` +
        points
          .slice(1)
          .map((p) => ` L ${p.x} ${p.y + offset}`)
          .join('');
      edgeMarkup += `<path d="${offsetPath1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} />`;
      edgeMarkup += `<path d="${offsetPath2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} />`;
    } else {
      // Offset horizontally for vertical lines
      const offsetPath1 =
        `M ${start.x - offset} ${start.y}` +
        points
          .slice(1)
          .map((p) => ` L ${p.x - offset} ${p.y}`)
          .join('');
      const offsetPath2 =
        `M ${start.x + offset} ${start.y}` +
        points
          .slice(1)
          .map((p) => ` L ${p.x + offset} ${p.y}`)
          .join('');
      edgeMarkup += `<path d="${offsetPath1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} />`;
      edgeMarkup += `<path d="${offsetPath2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} />`;
    }
  } else {
    // Single line (standard)
    edgeMarkup += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} />`;
  }

  // Calculate midpoint for labels
  const midIndex = Math.floor(points.length / 2);
  const midPoint = points[midIndex];

  // Stereotype text (rendered above the line in guillemets)
  if (edgeAst.stereotype) {
    const stereotypeText = `<<${edgeAst.stereotype}>>`;
    edgeMarkup += `<text x="${midPoint.x}" y="${midPoint.y - 15}" text-anchor="middle" font-size="11" font-style="italic" class="runiq-edge-stereotype">${escapeXml(stereotypeText)}</text>`;
  }

  // Edge label (rendered below stereotype if both exist)
  if (edgeAst.label) {
    const labelY = edgeAst.stereotype ? midPoint.y - 5 : midPoint.y - 5;
    edgeMarkup += `<text x="${midPoint.x}" y="${labelY}" text-anchor="middle" class="runiq-edge-text">${escapeXml(edgeAst.label)}</text>`;
  }

  // UML Multiplicity labels (at endpoints)
  if (edgeAst.multiplicitySource || edgeAst.roleSource) {
    // Position near source endpoint (15% along the edge)
    const from = points[0];
    const to = points[points.length - 1];
    const sourcePoint = {
      x: from.x + (to.x - from.x) * 0.15,
      y: from.y + (to.y - from.y) * 0.15,
    };

    if (edgeAst.multiplicitySource) {
      edgeMarkup += `<text x="${sourcePoint.x}" y="${sourcePoint.y - 8}" text-anchor="middle" font-size="11" class="runiq-edge-multiplicity">${escapeXml(edgeAst.multiplicitySource)}</text>`;
    }

    if (edgeAst.roleSource) {
      const roleY = edgeAst.multiplicitySource
        ? sourcePoint.y + 5
        : sourcePoint.y - 8;
      edgeMarkup += `<text x="${sourcePoint.x}" y="${roleY}" text-anchor="middle" font-size="10" font-style="italic" class="runiq-edge-role">${escapeXml(edgeAst.roleSource)}</text>`;
    }
  }

  if (edgeAst.multiplicityTarget || edgeAst.roleTarget) {
    // Position near target endpoint (85% along the edge)
    const from = points[0];
    const to = points[points.length - 1];
    const targetPoint = {
      x: from.x + (to.x - from.x) * 0.85,
      y: from.y + (to.y - from.y) * 0.85,
    };

    if (edgeAst.multiplicityTarget) {
      edgeMarkup += `<text x="${targetPoint.x}" y="${targetPoint.y - 8}" text-anchor="middle" font-size="11" class="runiq-edge-multiplicity">${escapeXml(edgeAst.multiplicityTarget)}</text>`;
    }

    if (edgeAst.roleTarget) {
      const roleY = edgeAst.multiplicityTarget
        ? targetPoint.y + 5
        : targetPoint.y - 8;
      edgeMarkup += `<text x="${targetPoint.x}" y="${roleY}" text-anchor="middle" font-size="10" font-style="italic" class="runiq-edge-role">${escapeXml(edgeAst.roleTarget)}</text>`;
    }
  }

  // Tooltip
  if (edgeAst.tooltip) {
    edgeMarkup += `<title>${escapeXml(edgeAst.tooltip)}</title>`;
  }

  edgeMarkup += '</g>';

  // Wrap in link if present
  if (edgeAst.link && !strict) {
    return `<a xlink:href="${escapeXml(edgeAst.link.href)}"${edgeAst.link.target ? ` target="${edgeAst.link.target}"` : ''}>${edgeMarkup}</a>`;
  }

  return edgeMarkup;
}

function renderIcon(
  icon: IconRef,
  positioned: PositionedNode,
  warnings: string[]
): string {
  const iconData = iconRegistry.getIcon(icon.provider, icon.name);
  if (!iconData) {
    warnings.push(`Icon ${icon.provider}/${icon.name} not found`);
    return '';
  }

  const iconSize = 16;
  const iconX = positioned.x + positioned.width - iconSize - 5;
  const iconY = positioned.y + 5;

  return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
    <path d="${iconData.d}" fill="currentColor" />
  </svg>`;
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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
