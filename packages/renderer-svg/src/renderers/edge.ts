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
  const parallelOffset = getParallelEdgeOffset(routed, diagram);
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

  const points =
    parallelOffset === 0
      ? routed.points
      : applyParallelOffsetToPoints(routed.points, parallelOffset);
  if (points.length < 2) {
    warnings.push(
      `Edge ${routed.from} -> ${routed.to} has insufficient points`
    );
    return '';
  }

  const style = edgeAst.style
    ? { ...(diagram.styles?.[edgeAst.style] || {}) }
    : {};
  const styleExtensions = (style as any).extensions as
    | Record<string, unknown>
    | undefined;
  const styleStroke =
    (style as any).stroke ?? (style as any).strokeColor ?? (style as any).color;
  // Inline properties override style properties
  // Check routed edge data first (set by layout algorithms), then edgeAst data, then style, then theme, then default
  const defaultStroke = theme?.edgeColor || '#333';
  const stroke =
    (edgeAst as any).strokeColor ||
    (edgeAst as any).color ||
    styleStroke ||
    defaultStroke;
  const strokeWidth =
    (routed as any).data?.strokeWidth ||
    (edgeAst.data as any)?.strokeWidth ||
    (edgeAst as any).strokeWidth ||
    (style as any).strokeWidth ||
    1;

  // Determine line style
  const styleLineStyle = (style as any).lineStyle as string | undefined;
  const lineStyle = (edgeAst as any).lineStyle || styleLineStyle || LineStyle.SOLID;
  let strokeDasharray = '';
  let isDoubleLine = false;
  const isBlockLine = lineStyle === LineStyle.BLOCK || lineStyle === 'block';
  const effectiveStrokeWidth = isBlockLine
    ? Math.max(Number(strokeWidth) || 1, 8)
    : strokeWidth;

  if (lineStyle === LineStyle.DASHED) {
    strokeDasharray = ' stroke-dasharray="5,3"';
  } else if (lineStyle === LineStyle.DOTTED) {
    strokeDasharray = ' stroke-dasharray="2,2"';
  } else if (lineStyle === LineStyle.DOUBLE) {
    // Double line for consanguineous marriages
    isDoubleLine = true;
  } else {
    const styleDasharray =
      (style as any).strokeDasharray ??
      (typeof styleExtensions?.strokeDasharray === 'string'
        ? styleExtensions.strokeDasharray
        : undefined);
    if (typeof styleDasharray === 'string' && styleDasharray !== 'none') {
      strokeDasharray = ` stroke-dasharray="${styleDasharray}"`;
    }
  }

  // Create path
  const start = points[0];
  let pathData = `M ${start.x} ${start.y}`;

  // If we have exactly 3 points, only treat as a Bezier when it is not an
  // orthogonal elbow. Orthogonal elbows must stay polyline so arrowheads
  // follow the final segment direction into the target anchor.
  if (points.length === 3 && !isOrthogonalElbow(points)) {
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
  const edgeType = (edgeAst as any).edgeType; // UML relationship type
  const arrowType =
    edgeType === 'generalization' || edgeType === 'realization'
      ? ArrowType.HOLLOW
      : edgeType === 'dependency'
        ? ArrowType.OPEN
        : isBlockLine
          ? ArrowType.STANDARD
        : (edgeAst as any).arrowType || ArrowType.STANDARD;
  const isBidirectional = !!(edgeAst as any).bidirectional;
  const navigability = (edgeAst as any).navigability; // UML navigability direction
  const edgeSuffix =
    routed.edgeIndex !== undefined ? `-${routed.edgeIndex}` : '';
  const arrowId = `arrow-${edgeType || arrowType}-${routed.from}-${routed.to}${edgeSuffix}`;
  const arrowIdStart = `arrow-start-${edgeType || arrowType}-${routed.from}-${routed.to}${edgeSuffix}`;
  const navArrowId = `nav-arrow-${routed.from}-${routed.to}${edgeSuffix}`;
  const navArrowIdStart = `nav-arrow-start-${routed.from}-${routed.to}${edgeSuffix}`;

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
      edgeMarkup += isBlockLine
        ? `
      <marker id="${arrowId}" markerWidth="14" markerHeight="14" refX="12" refY="5" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,10 12,5" fill="${stroke}" />
      </marker>`
        : `
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="${stroke}" />
      </marker>`;
      useMarkerEnd = true;

      // For bidirectional arrows, create a reversed marker for the start
      if (isBidirectional) {
        edgeMarkup += isBlockLine
          ? `
      <marker id="${arrowIdStart}" markerWidth="14" markerHeight="14" refX="0" refY="5" orient="auto" markerUnits="strokeWidth">
        <polygon points="12,0 12,10 0,5" fill="${stroke}" />
      </marker>`
          : `
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
    edgeMarkup += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${effectiveStrokeWidth}"${strokeDasharray}${markerAttr}${isBlockLine ? ' stroke-linecap="square" stroke-linejoin="miter"' : ''} pointer-events="none" />`;
  }

  // Calculate midpoint for labels along the routed path length
  const midPoint = getEdgeLabelPoint(points);

  // Stereotype text (rendered above the line in guillemets)
  if ((edgeAst as any).stereotype) {
    const stereotypeText = formatStereotypeText(
      String((edgeAst as any).stereotype)
    );
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

function getEdgeLabelPoint(
  points: { x: number; y: number }[]
): { x: number; y: number } {
  if (points.length === 2) {
    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
  }

  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segmentLengths.push(length);
    total += length;
  }

  const target = total / 2;
  let walked = 0;
  for (let i = 1; i < points.length; i++) {
    const segmentLength = segmentLengths[i - 1];
    if (walked + segmentLength >= target) {
      const remaining = target - walked;
      const t = segmentLength > 0 ? remaining / segmentLength : 0;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      };
    }
    walked += segmentLength;
  }

  return points[Math.floor(points.length / 2)];
}

function formatStereotypeText(stereotype: string): string {
  const trimmed = stereotype.trim();
  if (trimmed.startsWith('«') && trimmed.endsWith('»')) {
    return trimmed;
  }
  if (trimmed.startsWith('<<') && trimmed.endsWith('>>')) {
    return `«${trimmed.slice(2, -2).trim()}»`;
  }
  return `«${trimmed}»`;
}

function isOrthogonalElbow(points: { x: number; y: number }[]): boolean {
  if (points.length !== 3) return false;
  const [p0, p1, p2] = points;
  const firstOrthogonal = p0.x === p1.x || p0.y === p1.y;
  const secondOrthogonal = p1.x === p2.x || p1.y === p2.y;
  return firstOrthogonal && secondOrthogonal;
}

function getParallelEdgeOffset(routed: RoutedEdge, diagram: DiagramAst): number {
  const matching = diagram.edges
    .map((edge, index) => ({ edge, index }))
    .filter(({ edge }) => edge.from === routed.from && edge.to === routed.to);

  if (matching.length <= 1) return 0;

  const currentIndex =
    routed.edgeIndex !== undefined
      ? matching.findIndex(({ index }) => index === routed.edgeIndex)
      : 0;
  if (currentIndex < 0) return 0;

  const spread = 12;
  const centeredRank = currentIndex - (matching.length - 1) / 2;
  return centeredRank * spread;
}

function applyParallelOffsetToPoints(
  points: { x: number; y: number }[],
  offset: number
): { x: number; y: number }[] {
  if (points.length < 2 || offset === 0) return points;

  const start = points[0];
  const end = points[points.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return points;

  const nx = -dy / length;
  const ny = dx / length;

  return points.map((point) => ({
    x: point.x + nx * offset,
    y: point.y + ny * offset,
  }));
}
