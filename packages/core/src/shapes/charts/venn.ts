import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Default color palette for Venn diagram sets
 */
const DEFAULT_COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea'];

/**
 * Unified Venn diagram - automatically determines 2, 3, or 4 circles based on data
 *
 * Data formats:
 * 1. Simple array with labels: data:[values], labels:["Set A", "Set B", ...]
 * 2. Object format: data:[{label: "Set A", value: 100}, ...]
 * 3. Legacy format: data:{labelA, labelB, labelC, labelD, colors:[...]}
 *
 * Intersection labels (optional):
 * - Use intersections:[] property to label overlapping regions
 * - For 2 circles: [AB]
 * - For 3 circles: [AB, AC, BC, ABC]
 * - For 4 circles: [AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD]
 *
 * The number of circles is determined by:
 * - Array length (simple array or object array)
 * - Number of label properties (labelA, labelB, etc.)
 *
 * Supports 2, 3, or 4 circle Venn diagrams
 */

interface VennSet {
  label: string;
  color: string;
  value: number;
  labelColor?: string;
}

type IntersectionLabel = {
  label: string;
  color?: string;
  fontSize?: number;
};

function placeSetLabel(
  center: { x: number; y: number },
  centroid: { x: number; y: number },
  radius: number
): { x: number; y: number } {
  const dx = center.x - centroid.x;
  const dy = center.y - centroid.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  const scale = radius * 0.45;
  return {
    x: center.x + (dx / distance) * scale,
    y: center.y + (dy / distance) * scale,
  };
}

function resolveSetRadii(sets: VennSet[], baseRadius: number): number[] {
  const values = sets.map((set) =>
    typeof set.value === 'number' && Number.isFinite(set.value) ? set.value : 1
  );
  const maxValue = Math.max(...values, 1);
  const minScale = 0.6;
  const maxScale = 1.0;

  return values.map((value) => {
    const ratio = value / maxValue;
    return baseRadius * (minScale + (maxScale - minScale) * ratio);
  });
}

function nudgeFromCentroid(
  point: { x: number; y: number },
  centroid: { x: number; y: number },
  amount: number
): { x: number; y: number } {
  const dx = point.x - centroid.x;
  const dy = point.y - centroid.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: point.x + (dx / distance) * amount,
    y: point.y + (dy / distance) * amount,
  };
}

function getIntersection(
  intersections: unknown[] | undefined,
  index: number
): IntersectionLabel | null {
  if (!intersections || index < 0 || index >= intersections.length) {
    return null;
  }

  const entry = intersections[index];
  if (typeof entry === 'string') {
    return { label: entry };
  }
  if (typeof entry === 'object' && entry !== null) {
    const candidate = entry as {
      label?: unknown;
      color?: unknown;
      fontSize?: unknown;
    };
    if (typeof candidate.label === 'string') {
      return {
        label: candidate.label,
        color: typeof candidate.color === 'string' ? candidate.color : undefined,
        fontSize:
          typeof candidate.fontSize === 'number'
            ? candidate.fontSize
            : undefined,
      };
    }
  }

  return null;
}

/**
 * Normalize data from various formats to consistent VennSet array
 */
function normalizeData(
  data: unknown,
  customLabels?: string[],
  customColors?: string[],
  customLabelColors?: string[]
): VennSet[] {
  // Handle DSL parser wrapping: data may be wrapped in a values array
  let actualData = data;
  if (typeof data === 'object' && data !== null && 'values' in data) {
    const dataObj = data as { values?: unknown };
    if (Array.isArray(dataObj.values)) {
      actualData = dataObj.values;
    }
  }

  // Format 1: Simple array of numbers [30, 20, 50] or [1, 1, 1, 1]
  if (Array.isArray(actualData)) {
    return actualData
      .map((item: unknown, i: number) => {
        if (typeof item === 'number' || typeof item === 'string') {
          return {
            label: customLabels?.[i] || `Set ${String.fromCharCode(65 + i)}`, // A, B, C, D
            color:
              customColors?.[i] || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
            value: typeof item === 'number' ? item : Number(item) || 1,
            labelColor: customLabelColors?.[i],
          };
        }
        if (typeof item === 'object' && item !== null && 'label' in item) {
          const objItem = item as {
            label?: string;
            value?: unknown;
            color?: unknown;
            labelColor?: unknown;
          };
          return {
            label:
              objItem.label ||
              customLabels?.[i] ||
              `Set ${String.fromCharCode(65 + i)}`,
            color:
              (typeof objItem.color === 'string' && objItem.color) ||
              customColors?.[i] ||
              DEFAULT_COLORS[i % DEFAULT_COLORS.length],
            value:
              typeof objItem.value === 'number'
                ? objItem.value
                : Number(objItem.value) || 1,
            labelColor:
              typeof objItem.labelColor === 'string'
                ? objItem.labelColor
                : customLabelColors?.[i],
          };
        }
        return {
          label: `Set ${String.fromCharCode(65 + i)}`,
          color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          value: 1,
          labelColor: customLabelColors?.[i],
        };
      })
      .slice(0, 4); // Max 4 sets
  }

  // Format 2: Legacy object with labelA, labelB, etc.
  if (typeof actualData === 'object' && actualData !== null) {
    const dataObj = actualData as Record<string, unknown>;
    const sets: VennSet[] = [];
    const labels = ['labelA', 'labelB', 'labelC', 'labelD'];
    const colors = Array.isArray(dataObj.colors)
      ? (dataObj.colors as string[])
      : customColors || DEFAULT_COLORS;

    for (let i = 0; i < labels.length; i++) {
      const labelKey = labels[i];
      if (labelKey in dataObj && typeof dataObj[labelKey] === 'string') {
        sets.push({
          label: dataObj[labelKey] as string,
          color: colors[i] || DEFAULT_COLORS[i],
          value: 1,
          labelColor: customLabelColors?.[i],
        });
      } else if (i === 0) {
        // Always have at least 2 sets for venn diagram
        sets.push({
          label: customLabels?.[i] || `Set ${String.fromCharCode(65 + i)}`,
          color: colors[i] || DEFAULT_COLORS[i],
          value: 1,
          labelColor: customLabelColors?.[i],
        });
      } else {
        break; // Stop when we run out of labels
      }
    }

    // Ensure we have at least 2 sets, max 4
    if (sets.length < 2) {
      sets.push({
        label: customLabels?.[1] || 'Set B',
        color: colors[1] || DEFAULT_COLORS[1],
        value: 1,
        labelColor: customLabelColors?.[1],
      });
    }

    return sets;
  }

  // Default: 2 sets
  return [
    {
      label: 'Set A',
      color: DEFAULT_COLORS[0],
      value: 1,
      labelColor: customLabelColors?.[0],
    },
    {
      label: 'Set B',
      color: DEFAULT_COLORS[1],
      value: 1,
      labelColor: customLabelColors?.[1],
    },
  ];
}

/**
 * Render 2-circle Venn diagram
 */
function render2Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext,
  intersections?: unknown[]
): string {
  const baseRadius = 80;
  const radii = resolveSetRadii(sets, baseRadius);
  const maxRadius = Math.max(...radii, baseRadius * 0.6);
  const overlapDistance = maxRadius * 0.75;

  const centerY = bounds.height / 2;
  const circleAX = maxRadius;
  const circleBX = maxRadius + overlapDistance;

  const centroid = {
    x: (circleAX + circleBX) / 2,
    y: centerY,
  };
  const labelPosA = placeSetLabel(
    { x: circleAX, y: centerY },
    centroid,
    radii[0] ?? maxRadius
  );
  const labelPosB = placeSetLabel(
    { x: circleBX, y: centerY },
    centroid,
    radii[1] ?? maxRadius
  );
  labelPosA.y -= maxRadius * 0.2;
  labelPosB.y += maxRadius * 0.2;

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily =
    typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.5;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (left)
  svg += `<circle cx="${circleAX}" cy="${centerY}" r="${radii[0] ?? maxRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (right)
  svg += `<circle cx="${circleBX}" cy="${centerY}" r="${radii[1] ?? maxRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (left circle, non-overlapping region)
  const labelStyleA = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[0].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyleA },
    sets[0].label,
    labelPosA.x,
    labelPosA.y
  );

  // Label B (right circle, non-overlapping region)
  const labelStyleB = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[1].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyleB },
    sets[1].label,
    labelPosB.x,
    labelPosB.y
  );

  // Intersection label AB (center of overlap)
  const intersection0 = getIntersection(intersections, 0);
  if (intersection0) {
    const overlapCenterX = (circleAX + circleBX) / 2;
    const intersectStyle = {
      ...ctx.style,
      fontSize: intersection0.fontSize ?? fontSize - 1,
      color: intersection0.color ?? stroke,
    };
    svg += renderShapeLabel(
      { ...ctx, style: intersectStyle },
      intersection0.label,
      overlapCenterX,
      centerY
    );
  }

  svg += `</g>`;
  return svg;
}

/**
 * Render 3-circle Venn diagram
 */
function render3Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext,
  intersections?: unknown[]
): string {
  const baseRadius = 70;
  const radii = resolveSetRadii(sets, baseRadius);
  const maxRadius = Math.max(...radii, baseRadius * 0.6);
  const spacing = maxRadius * 1.15;
  const padding = Math.max(20, maxRadius * 0.25);

  // Triangular arrangement
  const circleAX = bounds.width / 2 - spacing / 2;
  const circleAY = maxRadius + padding / 2;
  const circleBX = bounds.width / 2 + spacing / 2;
  const circleBY = maxRadius + padding / 2;
  const circleCX = bounds.width / 2;
  const circleCY = maxRadius + padding / 2 + spacing;

  const centroid = {
    x: (circleAX + circleBX + circleCX) / 3,
    y: (circleAY + circleBY + circleCY) / 3,
  };
  const labelPosA = placeSetLabel(
    { x: circleAX, y: circleAY },
    centroid,
    radii[0] ?? maxRadius
  );
  const labelPosB = placeSetLabel(
    { x: circleBX, y: circleBY },
    centroid,
    radii[1] ?? maxRadius
  );
  const labelPosC = placeSetLabel(
    { x: circleCX, y: circleCY },
    centroid,
    radii[2] ?? maxRadius
  );

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily =
    typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.4;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (top left)
  svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${radii[0] ?? maxRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (top right)
  svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${radii[1] ?? maxRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle C (bottom center)
  svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${radii[2] ?? maxRadius}" `;
  svg += `fill="${sets[2].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (top-left, pushed left)
  const labelStyle3A = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[0].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle3A },
    sets[0].label,
    labelPosA.x,
    labelPosA.y
  );

  // Label B (top-right, pushed right)
  const labelStyle3B = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[1].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle3B },
    sets[1].label,
    labelPosB.x,
    labelPosB.y
  );

  // Label C (bottom, pushed down)
  const labelStyle3C = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[2].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle3C },
    sets[2].label,
    labelPosC.x,
    labelPosC.y
  );

  // Intersection labels: [AB, AC, BC, ABC]
  // Position them in the lens-shaped regions, offset from the triple intersection
  if (intersections) {
    const centerX = centroid.x;
    const centerY = centroid.y;

    const pairBias = 0.35;

    // AB intersection (between top-left and top-right circles)
    const intersection0 = getIntersection(intersections, 0);
    if (intersection0) {
      const midX = (circleAX + circleBX) / 2;
      const midY = (circleAY + circleBY) / 2;
      const abX = midX + (midX - centerX) * pairBias;
      const abY = midY + (midY - centerY) * pairBias;
      const intersectStyle3 = {
        ...ctx.style,
        fontSize: intersection0.fontSize ?? fontSize - 1,
        color: intersection0.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle3 },
        intersection0.label,
        abX,
        abY
      );
    }

    // AC intersection (between top-left and bottom center)
    const intersection1 = getIntersection(intersections, 1);
    if (intersection1) {
      const midX = (circleAX + circleCX) / 2;
      const midY = (circleAY + circleCY) / 2;
      const acX = midX + (midX - centerX) * pairBias;
      const acY = midY + (midY - centerY) * pairBias;
      const intersectStyle3AC = {
        ...ctx.style,
        fontSize: intersection1.fontSize ?? fontSize - 1,
        color: intersection1.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle3AC },
        intersection1.label,
        acX,
        acY
      );
    }

    // BC intersection (between top-right and bottom center)
    const intersection2 = getIntersection(intersections, 2);
    if (intersection2) {
      const midX = (circleBX + circleCX) / 2;
      const midY = (circleBY + circleCY) / 2;
      const bcX = midX + (midX - centerX) * pairBias;
      const bcY = midY + (midY - centerY) * pairBias;
      const intersectStyle3BC = {
        ...ctx.style,
        fontSize: intersection2.fontSize ?? fontSize - 1,
        color: intersection2.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle3BC },
        intersection2.label,
        bcX,
        bcY
      );
    }

    // ABC intersection (center where all three meet)
    const intersection3 = getIntersection(intersections, 3);
    if (intersection3) {
      const intersectStyle3ABC = {
        ...ctx.style,
        fontSize: intersection3.fontSize ?? fontSize - 1,
        color: intersection3.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle3ABC },
        intersection3.label,
        centerX,
        centerY
      );
    }
  }

  svg += `</g>`;
  return svg;
}

/**
 * Render 4-circle Venn diagram
 */
function render4Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext,
  intersections?: unknown[]
): string {
  const baseRadius = 75;
  const radii = resolveSetRadii(sets, baseRadius);
  const maxRadius = Math.max(...radii, baseRadius * 0.6);
  const spacing = maxRadius * 0.95;

  // 2x2 grid arrangement
  const circleAX = bounds.width / 2 - spacing / 2;
  const circleAY = bounds.height / 2 - spacing / 2;
  const circleBX = bounds.width / 2 + spacing / 2;
  const circleBY = bounds.height / 2 - spacing / 2;
  const circleCX = bounds.width / 2 - spacing / 2;
  const circleCY = bounds.height / 2 + spacing / 2;
  const circleDX = bounds.width / 2 + spacing / 2;
  const circleDY = bounds.height / 2 + spacing / 2;

  const centroid = {
    x: (circleAX + circleBX + circleCX + circleDX) / 4,
    y: (circleAY + circleBY + circleCY + circleDY) / 4,
  };
  const labelPosA = placeSetLabel(
    { x: circleAX, y: circleAY },
    centroid,
    radii[0] ?? maxRadius
  );
  const labelPosB = placeSetLabel(
    { x: circleBX, y: circleBY },
    centroid,
    radii[1] ?? maxRadius
  );
  const labelPosC = placeSetLabel(
    { x: circleCX, y: circleCY },
    centroid,
    radii[2] ?? maxRadius
  );
  const labelPosD = placeSetLabel(
    { x: circleDX, y: circleDY },
    centroid,
    radii[3] ?? maxRadius
  );

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 13;
  const fontFamily =
    typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.35;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (top-left)
  svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${radii[0] ?? maxRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (top-right)
  svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${radii[1] ?? maxRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle C (bottom-left)
  svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${radii[2] ?? maxRadius}" `;
  svg += `fill="${sets[2].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle D (bottom-right)
  svg += `<circle cx="${circleDX}" cy="${circleDY}" r="${radii[3] ?? maxRadius}" `;
  svg += `fill="${sets[3].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (top-left, pushed up-left)
  const labelStyle4A = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[0].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle4A },
    sets[0].label,
    labelPosA.x,
    labelPosA.y
  );

  // Label B (top-right, pushed up-right)
  const labelStyle4B = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[1].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle4B },
    sets[1].label,
    labelPosB.x,
    labelPosB.y
  );

  // Label C (bottom-left, pushed down-left)
  const labelStyle4C = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[2].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle4C },
    sets[2].label,
    labelPosC.x,
    labelPosC.y
  );

  // Label D (bottom-right, pushed down-right)
  const labelStyle4D = {
    ...ctx.style,
    fontSize,
    fontWeight: 'bold',
    color: sets[3].labelColor ?? stroke,
  };
  svg += renderShapeLabel(
    { ...ctx, style: labelStyle4D },
    sets[3].label,
    labelPosD.x,
    labelPosD.y
  );

  // Intersection labels: [AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD]
  if (intersections) {
    const smallFontSize = fontSize - 2;
    const pairOffset = maxRadius * 0.12;
    const tripleOffset = -maxRadius * 0.08;
    const quadOffset = -maxRadius * 0.03;

    // Pairwise intersections (6 total)
    // AB (top-left ∩ top-right)
    const intersection0 = getIntersection(intersections, 0);
    if (intersection0) {
      const abX = (circleAX + circleBX) / 2;
      const abY = (circleAY + circleBY) / 2;
      const abPoint = nudgeFromCentroid(
        { x: abX, y: abY },
        centroid,
        pairOffset
      );
      const intersectStyle4 = {
        ...ctx.style,
        fontSize: intersection0.fontSize ?? smallFontSize,
        color: intersection0.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4 },
        intersection0.label,
        abPoint.x,
        abPoint.y
      );
    }

    // AC (top-left ∩ bottom-left)
    const intersection1 = getIntersection(intersections, 1);
    if (intersection1) {
      const acX = (circleAX + circleCX) / 2;
      const acY = (circleAY + circleCY) / 2;
      const acPoint = nudgeFromCentroid(
        { x: acX, y: acY },
        centroid,
        pairOffset
      );
      const intersectStyle4AC = {
        ...ctx.style,
        fontSize: intersection1.fontSize ?? smallFontSize,
        color: intersection1.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4AC },
        intersection1.label,
        acPoint.x,
        acPoint.y
      );
    }

    // AD (top-left ∩ bottom-right - diagonal)
    const intersection2 = getIntersection(intersections, 2);
    if (intersection2) {
      const adX = (circleAX + circleDX) / 2;
      const adY = (circleAY + circleDY) / 2;
      const adPoint = nudgeFromCentroid(
        { x: adX, y: adY },
        centroid,
        pairOffset
      );
      const intersectStyle4AD = {
        ...ctx.style,
        fontSize: intersection2.fontSize ?? smallFontSize,
        color: intersection2.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4AD },
        intersection2.label,
        adPoint.x,
        adPoint.y
      );
    }

    // BC (top-right ∩ bottom-left - diagonal)
    const intersection3 = getIntersection(intersections, 3);
    if (intersection3) {
      const bcX = (circleBX + circleCX) / 2;
      const bcY = (circleBY + circleCY) / 2;
      const bcPoint = nudgeFromCentroid(
        { x: bcX, y: bcY },
        centroid,
        pairOffset
      );
      const intersectStyle4BC = {
        ...ctx.style,
        fontSize: intersection3.fontSize ?? smallFontSize,
        color: intersection3.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4BC },
        intersection3.label,
        bcPoint.x,
        bcPoint.y
      );
    }

    // BD (top-right ∩ bottom-right)
    const intersection4 = getIntersection(intersections, 4);
    if (intersection4) {
      const bdX = (circleBX + circleDX) / 2;
      const bdY = (circleBY + circleDY) / 2;
      const bdPoint = nudgeFromCentroid(
        { x: bdX, y: bdY },
        centroid,
        pairOffset
      );
      const intersectStyle4BD = {
        ...ctx.style,
        fontSize: intersection4.fontSize ?? smallFontSize,
        color: intersection4.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4BD },
        intersection4.label,
        bdPoint.x,
        bdPoint.y
      );
    }

    // CD (bottom-left ∩ bottom-right)
    const intersection5 = getIntersection(intersections, 5);
    if (intersection5) {
      const cdX = (circleCX + circleDX) / 2;
      const cdY = (circleCY + circleDY) / 2;
      const cdPoint = nudgeFromCentroid(
        { x: cdX, y: cdY },
        centroid,
        pairOffset
      );
      const intersectStyle4CD = {
        ...ctx.style,
        fontSize: intersection5.fontSize ?? smallFontSize,
        color: intersection5.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4CD },
        intersection5.label,
        cdPoint.x,
        cdPoint.y
      );
    }

    // Triple intersections (4 total)
    // ABC (top-left ∩ top-right ∩ bottom-left)
    const intersection6 = getIntersection(intersections, 6);
    if (intersection6) {
      const abcX = (circleAX + circleBX + circleCX) / 3;
      const abcY = (circleAY + circleBY + circleCY) / 3;
      const abcPoint = nudgeFromCentroid(
        { x: abcX, y: abcY },
        centroid,
        tripleOffset
      );
      const intersectStyle4ABC = {
        ...ctx.style,
        fontSize: intersection6.fontSize ?? smallFontSize,
        color: intersection6.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4ABC },
        intersection6.label,
        abcPoint.x,
        abcPoint.y
      );
    }

    // ABD (top-left ∩ top-right ∩ bottom-right)
    const intersection7 = getIntersection(intersections, 7);
    if (intersection7) {
      const abdX = (circleAX + circleBX + circleDX) / 3;
      const abdY = (circleAY + circleBY + circleDY) / 3;
      const abdPoint = nudgeFromCentroid(
        { x: abdX, y: abdY },
        centroid,
        tripleOffset
      );
      const intersectStyle4ABD = {
        ...ctx.style,
        fontSize: intersection7.fontSize ?? smallFontSize,
        color: intersection7.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4ABD },
        intersection7.label,
        abdPoint.x,
        abdPoint.y
      );
    }

    // ACD (top-left ∩ bottom-left ∩ bottom-right)
    const intersection8 = getIntersection(intersections, 8);
    if (intersection8) {
      const acdX = (circleAX + circleCX + circleDX) / 3;
      const acdY = (circleAY + circleCY + circleDY) / 3;
      const acdPoint = nudgeFromCentroid(
        { x: acdX, y: acdY },
        centroid,
        tripleOffset
      );
      const intersectStyle4ACD = {
        ...ctx.style,
        fontSize: intersection8.fontSize ?? smallFontSize,
        color: intersection8.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4ACD },
        intersection8.label,
        acdPoint.x,
        acdPoint.y
      );
    }

    // BCD (top-right ∩ bottom-left ∩ bottom-right)
    const intersection9 = getIntersection(intersections, 9);
    if (intersection9) {
      const bcdX = (circleBX + circleCX + circleDX) / 3;
      const bcdY = (circleBY + circleCY + circleDY) / 3;
      const bcdPoint = nudgeFromCentroid(
        { x: bcdX, y: bcdY },
        centroid,
        tripleOffset
      );
      const intersectStyle4BCD = {
        ...ctx.style,
        fontSize: intersection9.fontSize ?? smallFontSize,
        color: intersection9.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4BCD },
        intersection9.label,
        bcdPoint.x,
        bcdPoint.y
      );
    }

    // Quadruple intersection (1 total)
    // ABCD (all four circles meet)
    const intersection10 = getIntersection(intersections, 10);
    if (intersection10) {
      const abcdX = (circleAX + circleBX + circleCX + circleDX) / 4;
      const abcdY = (circleAY + circleBY + circleCY + circleDY) / 4;
      const abcdPoint = nudgeFromCentroid(
        { x: abcdX, y: abcdY },
        centroid,
        quadOffset
      );
      const intersectStyle4ABCD = {
        ...ctx.style,
        fontSize: intersection10.fontSize ?? smallFontSize,
        color: intersection10.color ?? stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: intersectStyle4ABCD },
        intersection10.label,
        abcdPoint.x,
        abcdPoint.y
      );
    }
  }

  svg += `</g>`;
  return svg;
}

/**
 * Unified Venn diagram shape definition
 */
export const vennShape: ShapeDefinition = {
  id: 'venn',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    // Get custom labels and colors if provided
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : Array.isArray((ctx.node.data as any)?.themePalette)
        ? ((ctx.node.data as any).themePalette as string[])
        : undefined;
    const customLabelColors = Array.isArray((ctx.node.data as any)?.labelColors)
      ? ((ctx.node.data as any).labelColors as string[])
      : undefined;

    const sets = normalizeData(
      ctx.node.data,
      customLabels,
      customColors,
      customLabelColors
    );
    const numSets = sets.length;

    if (numSets === 2) {
      const baseRadius = 80;
      const radii = resolveSetRadii(sets, baseRadius);
      const maxRadius = Math.max(...radii, baseRadius * 0.6);
      const overlapDistance = maxRadius * 0.75;
      return {
        width: maxRadius * 2 + overlapDistance,
        height: maxRadius * 2,
      };
    } else if (numSets === 3) {
      const baseRadius = 70;
      const radii = resolveSetRadii(sets, baseRadius);
      const maxRadius = Math.max(...radii, baseRadius * 0.6);
      const spacing = maxRadius * 1.15;
      const padding = Math.max(20, maxRadius * 0.25);
      return {
        width: maxRadius * 2 + spacing + padding,
        height: maxRadius * 2 + spacing + padding,
      };
    } else {
      // 4 sets (or fallback)
      const baseRadius = 75;
      const radii = resolveSetRadii(sets, baseRadius);
      const maxRadius = Math.max(...radii, baseRadius * 0.6);
      const spacing = maxRadius * 0.95;
      const padding = Math.max(30, maxRadius * 0.3);
      return {
        width: maxRadius * 2 + spacing + padding,
        height: maxRadius * 2 + spacing + padding,
      };
    }
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    // Get custom labels and colors if provided
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : Array.isArray((ctx.node.data as any)?.themePalette)
        ? ((ctx.node.data as any).themePalette as string[])
        : undefined;
    const customLabelColors = Array.isArray((ctx.node.data as any)?.labelColors)
      ? ((ctx.node.data as any).labelColors as string[])
      : undefined;

    // Get intersection labels if provided
    const intersections = Array.isArray(ctx.node.data?.intersections)
      ? (ctx.node.data.intersections as unknown[])
      : undefined;

    const sets = normalizeData(
      ctx.node.data,
      customLabels,
      customColors,
      customLabelColors
    );
    const numSets = sets.length;
    const bounds = this.bounds(ctx);

    if (numSets === 2) {
      return render2Circles(sets, position, bounds, ctx, intersections);
    } else if (numSets === 3) {
      return render3Circles(sets, position, bounds, ctx, intersections);
    } else {
      // 4 sets (or fallback to 4 if more than 4)
      return render4Circles(
        sets.slice(0, 4),
        position,
        bounds,
        ctx,
        intersections
      );
    }
  },
};
