import type { DiagramAst, DiagramTheme, RoutedEdge } from '@runiq/core';
import { ArrowType, LineStyle } from '@runiq/core';
import { escapeXml, renderMultilineText } from './utils.js';

export function renderEdge(
  routed: RoutedEdge,
  diagram: DiagramAst,
  strict: boolean,
  warnings: string[],
  theme?: DiagramTheme
): string {
  // Use edgeIndex if available to handle multiple edges between same nodes
  const edgeAst =
    routed.edgeIndex !== undefined
      ? diagram.edges[routed.edgeIndex]
      : diagram.edges.find((e) => e.from === routed.from && e.to === routed.to);

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
  // Inline properties override style properties
  // Check routed edge data first (set by layout algorithms), then edgeAst data, then style, then theme, then default
  const defaultStroke = theme?.edgeColor || '#333';
  const stroke =
    (edgeAst as any).strokeColor || (style as any).stroke || defaultStroke;
  const strokeWidth =
    (routed as any).data?.strokeWidth ||
    (edgeAst.data as any)?.strokeWidth ||
    (edgeAst as any).strokeWidth ||
    (style as any).strokeWidth ||
    1;

  // Determine line style
  const lineStyle = (edgeAst as any).lineStyle || LineStyle.SOLID;
  let strokeDasharray = '';
  let isDoubleLine = false;

  if (lineStyle === LineStyle.DASHED) {
    strokeDasharray = ' stroke-dasharray="5,3"';
  } else if (lineStyle === LineStyle.DOTTED) {
    strokeDasharray = ' stroke-dasharray="2,2"';
  } else if (lineStyle === LineStyle.DOUBLE) {
    // Double line for consanguineous marriages
    isDoubleLine = true;
  }

  // Create path
  const start = points[0];
  let pathData = `M ${start.x} ${start.y}`;

  // If we have exactly 3 points, treat the middle one as a Bezier control point
  if (points.length === 3) {
    const control = points[1];
    const end = points[2];
    pathData += ` Q ${control.x} ${control.y} ${end.x} ${end.y}`;
  } else {
    // Otherwise, use straight line segments
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  const edgeId =
    routed.edgeIndex !== undefined
      ? `${routed.from}-${routed.to}-${routed.edgeIndex}`
      : `${routed.from}-${routed.to}`;
  const groupAttrs = strict
    ? ''
    : ` data-runiq-edge="${edgeId}" data-edge-id="${edgeId}" data-edge-from="${routed.from}" data-edge-to="${routed.to}"`;
  let edgeMarkup = `<g${groupAttrs}>`;

  // Determine arrow type and bidirectionality
  const arrowType = (edgeAst as any).arrowType || ArrowType.STANDARD;
  const edgeType = (edgeAst as any).edgeType; // UML relationship type
  const isBidirectional = !!(edgeAst as any).bidirectional;
  const navigability = (edgeAst as any).navigability; // UML navigability direction
  const arrowId = `arrow-${edgeType || arrowType}-${routed.from}-${routed.to}`;
  const arrowIdStart = `arrow-start-${edgeType || arrowType}-${routed.from}-${routed.to}`;
  const navArrowId = `nav-arrow-${routed.from}-${routed.to}`;
  const navArrowIdStart = `nav-arrow-start-${routed.from}-${routed.to}`;

  // Define arrow marker based on type
  // For UML relationships, use edgeType to determine marker
  let useMarkerStart = false; // Diamonds go on the source (start) end
  let useMarkerEnd = false; // Standard arrows go on the target (end) end
  let useNavMarkerStart = false; // Navigability arrows at source
  let useNavMarkerEnd = false; // Navigability arrows at target

  // Handle navigability arrows (small open arrows indicating navigation direction)
  if (navigability) {
    if (navigability === 'source') {
      useNavMarkerStart = true;
    } else if (navigability === 'target') {
      useNavMarkerEnd = true;
    } else if (navigability === 'bidirectional') {
      useNavMarkerStart = true;
      useNavMarkerEnd = true;
    }
    // 'none' means no navigability arrows
  }

  if (
    edgeType === 'aggregation' ||
    edgeType === 'composition' ||
    arrowType !== ArrowType.NONE
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
    } else if (arrowType === ArrowType.STANDARD) {
      // Filled triangle (association, standard arrow)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="${stroke}" />
      </marker>`;
      useMarkerEnd = true;

      // For bidirectional arrows, create a reversed marker for the start
      if (isBidirectional) {
        edgeMarkup += `
      <marker id="${arrowIdStart}" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="9,0 9,6 0,3" fill="${stroke}" />
      </marker>`;
        useMarkerStart = true;
      }
    } else if (arrowType === ArrowType.HOLLOW) {
      // Hollow triangle (generalization/inheritance)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="12" markerHeight="12" refX="11" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="white" stroke="${stroke}" stroke-width="1" />
      </marker>`;
      useMarkerEnd = true;

      // For bidirectional arrows, create a reversed marker for the start
      if (isBidirectional) {
        edgeMarkup += `
      <marker id="${arrowIdStart}" markerWidth="12" markerHeight="12" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="9,0 9,6 0,3" fill="white" stroke="${stroke}" stroke-width="1" />
      </marker>`;
        useMarkerStart = true;
      }
    } else if (arrowType === ArrowType.OPEN) {
      // Open arrow (dependency)
      edgeMarkup += `
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polyline points="0,0 9,3 0,6" fill="none" stroke="${stroke}" stroke-width="1" />
      </marker>`;
      useMarkerEnd = true;

      // For bidirectional arrows, create a reversed marker for the start
      if (isBidirectional) {
        edgeMarkup += `
      <marker id="${arrowIdStart}" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
        <polyline points="9,0 0,3 9,6" fill="none" stroke="${stroke}" stroke-width="1" />
      </marker>`;
        useMarkerStart = true;
      }
    }

    edgeMarkup += `</defs>`;
  }

  // Add navigability arrow markers if needed (small open arrows)
  if (useNavMarkerStart || useNavMarkerEnd) {
    edgeMarkup += `<defs>`;
    if (useNavMarkerEnd) {
      edgeMarkup += `
      <marker id="${navArrowId}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
        <polyline points="0,0 6,3 0,6" fill="none" stroke="${stroke}" stroke-width="1.5" />
      </marker>`;
    }
    if (useNavMarkerStart) {
      edgeMarkup += `
      <marker id="${navArrowIdStart}" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto">
        <polyline points="6,0 0,3 6,6" fill="none" stroke="${stroke}" stroke-width="1.5" />
      </marker>`;
    }
    edgeMarkup += `</defs>`;
  }

  // Edge line with optional markers
  const markerStartAttr = useMarkerStart
    ? ` marker-start="url(#${isBidirectional ? arrowIdStart : arrowId})"`
    : useNavMarkerStart
      ? ` marker-start="url(#${navArrowIdStart})"`
      : '';
  const markerEndAttr = useMarkerEnd
    ? ` marker-end="url(#${arrowId})"`
    : useNavMarkerEnd
      ? ` marker-end="url(#${navArrowId})"`
      : '';
  const markerAttr = markerStartAttr + markerEndAttr;

  // Add invisible wider path for better click/hover detection
  const hitAreaWidth = 20; // Wider hit area for easier selection (increased from 12)
  edgeMarkup += `<path d="${pathData}" fill="none" stroke="transparent" stroke-width="${hitAreaWidth}" pointer-events="stroke" class="edge-hit-area" />`;

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
      edgeMarkup += `<path d="${offsetPath1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} pointer-events="none" />`;
      edgeMarkup += `<path d="${offsetPath2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} pointer-events="none" />`;
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
      edgeMarkup += `<path d="${offsetPath1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} pointer-events="none" />`;
      edgeMarkup += `<path d="${offsetPath2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} pointer-events="none" />`;
    }
  } else {
    // Single line (standard)
    edgeMarkup += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDasharray}${markerAttr} pointer-events="none" />`;
  }

  // Calculate midpoint for labels
  // For edges with few points (straight lines), use geometric midpoint
  // For edges with many points (orthogonal routing), use middle point
  let midPoint: { x: number; y: number };

  if (points.length === 2) {
    // Straight line: calculate geometric midpoint between start and end
    midPoint = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
  } else {
    // Multiple points: use middle point from routing
    const midIndex = Math.floor(points.length / 2);
    midPoint = points[midIndex];
  }

  // Stereotype text (rendered above the line in guillemets)
  if ((edgeAst as any).stereotype) {
    const stereotypeText = `<<${(edgeAst as any).stereotype}>>`;
    edgeMarkup += `<text x="${midPoint.x}" y="${midPoint.y - 15}" text-anchor="middle" font-size="11" font-style="italic" class="runiq-edge-stereotype">${escapeXml(stereotypeText)}</text>`;
  }

  // State machine transition label: event [guard] / effect
  // Build UML transition label if event, guard, or effect are present
  let transitionLabel = '';
  const event = (edgeAst as any).event;
  const guard = (edgeAst as any).guard;
  const effect = (edgeAst as any).effect;

  if (event || guard || effect) {
    if (event) {
      transitionLabel += event;
    }
    if (guard) {
      transitionLabel += ` ${guard}`;
    }
    if (effect) {
      // Add slash prefix if not already present
      const effectText = effect.startsWith('/') ? effect : `/ ${effect}`;
      transitionLabel += ` ${effectText}`;
    }
  }

  // Edge label (rendered centered on edge, or below stereotype if both exist)
  // Use transition label if present, otherwise use explicit label
  const displayLabel = transitionLabel || (edgeAst as any).label;
  if (displayLabel) {
    const labelY = (edgeAst as any).stereotype
      ? midPoint.y + 10 // Below stereotype
      : midPoint.y; // Centered on edge
    edgeMarkup += renderMultilineText(displayLabel, midPoint.x, labelY, {
      textAnchor: 'middle',
      dominantBaseline: 'middle',
      className: 'runiq-edge-text',
    });
  }

  // UML Constraints (rendered below the label/edge in braces)
  if ((edgeAst as any).constraints && (edgeAst as any).constraints.length > 0) {
    const constraints = (edgeAst as any).constraints as string[];
    const constraintText = `{${constraints.join(', ')}}`;
    const constraintY = displayLabel
      ? midPoint.y + 15 // Below label (whether it's a transition label or explicit label)
      : (edgeAst as any).stereotype
        ? midPoint.y + 25 // Below stereotype
        : midPoint.y + 10; // Below edge
    edgeMarkup += `<text x="${midPoint.x}" y="${constraintY}" text-anchor="middle" font-size="10" font-style="italic" class="runiq-edge-constraint">${escapeXml(constraintText)}</text>`;
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
