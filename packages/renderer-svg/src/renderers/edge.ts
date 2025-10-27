import type { DiagramAst, RoutedEdge } from '@runiq/core';
import { escapeXml } from './utils.js';

export function renderEdge(
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
  const stroke = (style as any).stroke || '#333';
  const strokeWidth = (style as any).strokeWidth || 1;

  // Determine line style
  const lineStyle = (edgeAst as any).lineStyle || 'solid';
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
  const arrowType = (edgeAst as any).arrowType || 'standard';
  const edgeType = (edgeAst as any).edgeType; // UML relationship type
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
    ? ` marker-start="url(#${arrowId})"`
    : edgeType !== 'aggregation' &&
        edgeType !== 'composition' &&
        arrowType !== 'none'
      ? ` marker-end="url(#${arrowId})"`
      : '';

  // Render double line for consanguineous marriages
  if (isDoubleLine) {
    // Parallel lines with small offset (3px apart)
    const offset = 3;

    // Calculate perpendicular offset for parallel lines (simple heuristic)
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
  if ((edgeAst as any).stereotype) {
    const stereotypeText = `<<${(edgeAst as any).stereotype}>>`;
    edgeMarkup += `<text x="${midPoint.x}" y="${midPoint.y - 15}" text-anchor="middle" font-size="11" font-style="italic" class="runiq-edge-stereotype">${escapeXml(stereotypeText)}</text>`;
  }

  // Edge label (rendered below stereotype if both exist)
  if ((edgeAst as any).label) {
    const labelY = (edgeAst as any).stereotype
      ? midPoint.y - 5
      : midPoint.y - 5;
    edgeMarkup += `<text x="${midPoint.x}" y="${labelY}" text-anchor="middle" class="runiq-edge-text">${escapeXml((edgeAst as any).label)}</text>`;
  }

  // UML Multiplicity labels (at endpoints)
  if ((edgeAst as any).multiplicitySource || (edgeAst as any).roleSource) {
    // Position near source endpoint (15% along the edge)
    const from = points[0];
    const to = points[points.length - 1];
    const sourcePoint = {
      x: from.x + (to.x - from.x) * 0.15,
      y: from.y + (to.y - from.y) * 0.15,
    };

    if ((edgeAst as any).multiplicitySource) {
      edgeMarkup += `<text x="${sourcePoint.x}" y="${sourcePoint.y - 8}" text-anchor="middle" font-size="11" class="runiq-edge-multiplicity">${escapeXml((edgeAst as any).multiplicitySource)}</text>`;
    }

    if ((edgeAst as any).roleSource) {
      const roleY = (edgeAst as any).multiplicitySource
        ? sourcePoint.y + 5
        : sourcePoint.y - 8;
      edgeMarkup += `<text x="${sourcePoint.x}" y="${roleY}" text-anchor="middle" font-size="10" font-style="italic" class="runiq-edge-role">${escapeXml((edgeAst as any).roleSource)}</text>`;
    }
  }

  if ((edgeAst as any).multiplicityTarget || (edgeAst as any).roleTarget) {
    // Position near target endpoint (85% along the edge)
    const from = points[0];
    const to = points[points.length - 1];
    const targetPoint = {
      x: from.x + (to.x - from.x) * 0.85,
      y: from.y + (to.y - from.y) * 0.85,
    };

    if ((edgeAst as any).multiplicityTarget) {
      edgeMarkup += `<text x="${targetPoint.x}" y="${targetPoint.y - 8}" text-anchor="middle" font-size="11" class="runiq-edge-multiplicity">${escapeXml((edgeAst as any).multiplicityTarget)}</text>`;
    }

    if ((edgeAst as any).roleTarget) {
      const roleY = (edgeAst as any).multiplicityTarget
        ? targetPoint.y + 5
        : targetPoint.y - 8;
      edgeMarkup += `<text x="${targetPoint.x}" y="${roleY}" text-anchor="middle" font-size="10" font-style="italic" class="runiq-edge-role">${escapeXml((edgeAst as any).roleTarget)}</text>`;
    }
  }

  // Tooltip
  if ((edgeAst as any).tooltip) {
    edgeMarkup += `<title>${escapeXml((edgeAst as any).tooltip)}</title>`;
  }

  edgeMarkup += '</g>';

  // Wrap in link if present
  if ((edgeAst as any).link && !strict) {
    return `<a xlink:href="${escapeXml((edgeAst as any).link.href)}"${(edgeAst as any).link.target ? ` target="${(edgeAst as any).link.target}"` : ''}>${edgeMarkup}</a>`;
  }

  return edgeMarkup;
}
