import type { ShapeDefinition } from '../types.js';

/**
 * Pedigree Chart Shapes
 *
 * Standard medical/genetics notation:
 * - Square = Male
 * - Circle = Female
 * - Diamond = Unknown/Unspecified sex
 *
 * Shading patterns:
 * - Filled (black) = Affected by condition
 * - Half-filled = Carrier
 * - Empty (white) = Unaffected/Normal
 * - Diagonal line = Deceased
 *
 * Usage: Set style properties to indicate status
 * - affected: true = black fill
 * - carrier: true = half-filled pattern
 * - deceased: true = diagonal line overlay
 */

const SIZE = 40;
const STROKE_WIDTH = 2;

/**
 * Male individual (square)
 * Aliases: pedigree-male
 */
export const pedigreeMaleShape: ShapeDefinition = {
  id: 'pedigree-male',

  bounds() {
    return { width: SIZE, height: SIZE };
  },

  anchors() {
    return [
      { x: SIZE / 2, y: 0, name: 'top' },
      { x: SIZE, y: SIZE / 2, name: 'right' },
      { x: SIZE / 2, y: SIZE, name: 'bottom' },
      { x: 0, y: SIZE / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#fff';
    const stroke = ctx.style?.stroke || '#000';
    const strokeWidth = ctx.style?.strokeWidth || STROKE_WIDTH;
    const affected = ctx.style?.affected === true;
    const carrier = ctx.style?.carrier === true;
    const deceased = ctx.style?.deceased === true;

    let fillColor = fill;
    if (affected) {
      fillColor = '#000';
    } else if (carrier) {
      fillColor = 'url(#pedigree-half-fill)';
    }

    let svg = `<rect x="${x}" y="${y}" width="${SIZE}" height="${SIZE}"
                fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Deceased indicator (diagonal line)
    if (deceased) {
      svg += `<line x1="${x}" y1="${y}" x2="${x + SIZE}" y2="${y + SIZE}"
                   stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }

    // Label (name/ID)
    const label = ctx.node.label || ctx.node.id;
    const fontSize = ctx.style?.fontSize || 12;
    const font = ctx.style?.font || 'sans-serif';
    svg += `<text x="${x + SIZE / 2}" y="${y + SIZE + 15}"
                 text-anchor="middle" font-size="${fontSize}" font-family="${font}">${label}</text>`;

    return svg;
  },
};

/**
 * Female individual (circle)
 * Aliases: pedigree-female
 */
export const pedigreeFemaleShape: ShapeDefinition = {
  id: 'pedigree-female',

  bounds() {
    return { width: SIZE, height: SIZE };
  },

  anchors() {
    const radius = SIZE / 2;
    return [
      { x: radius, y: 0, name: 'top' },
      { x: SIZE, y: radius, name: 'right' },
      { x: radius, y: SIZE, name: 'bottom' },
      { x: 0, y: radius, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + SIZE / 2;
    const cy = y + SIZE / 2;
    const radius = SIZE / 2;
    const fill = ctx.style?.fill || '#fff';
    const stroke = ctx.style?.stroke || '#000';
    const strokeWidth = ctx.style?.strokeWidth || STROKE_WIDTH;
    const affected = ctx.style?.affected === true;
    const carrier = ctx.style?.carrier === true;
    const deceased = ctx.style?.deceased === true;

    let fillColor = fill;
    if (affected) {
      fillColor = '#000';
    } else if (carrier) {
      fillColor = 'url(#pedigree-half-fill)';
    }

    let svg = `<circle cx="${cx}" cy="${cy}" r="${radius - strokeWidth / 2}"
                fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Deceased indicator (diagonal line)
    if (deceased) {
      svg += `<line x1="${x}" y1="${y}" x2="${x + SIZE}" y2="${y + SIZE}"
                   stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }

    // Label (name/ID)
    const label = ctx.node.label || ctx.node.id;
    const fontSize = ctx.style?.fontSize || 12;
    const font = ctx.style?.font || 'sans-serif';
    svg += `<text x="${cx}" y="${y + SIZE + 15}"
                 text-anchor="middle" font-size="${fontSize}" font-family="${font}">${label}</text>`;

    return svg;
  },
};

/**
 * Unknown/unspecified sex individual (diamond)
 * Aliases: pedigree-unknown
 */
export const pedigreeUnknownShape: ShapeDefinition = {
  id: 'pedigree-unknown',

  bounds() {
    return { width: SIZE, height: SIZE };
  },

  anchors() {
    return [
      { x: SIZE / 2, y: 0, name: 'top' },
      { x: SIZE, y: SIZE / 2, name: 'right' },
      { x: SIZE / 2, y: SIZE, name: 'bottom' },
      { x: 0, y: SIZE / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + SIZE / 2;
    const cy = y + SIZE / 2;
    const fill = ctx.style?.fill || '#fff';
    const stroke = ctx.style?.stroke || '#000';
    const strokeWidth = ctx.style?.strokeWidth || STROKE_WIDTH;
    const affected = ctx.style?.affected === true;
    const carrier = ctx.style?.carrier === true;
    const deceased = ctx.style?.deceased === true;

    let fillColor = fill;
    if (affected) {
      fillColor = '#000';
    } else if (carrier) {
      fillColor = 'url(#pedigree-half-fill)';
    }

    // Diamond points
    const points = `${cx},${y} ${x + SIZE},${cy} ${cx},${y + SIZE} ${x},${cy}`;

    let svg = `<polygon points="${points}"
                fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Deceased indicator (diagonal line through diamond)
    if (deceased) {
      svg += `<line x1="${x}" y1="${cy}" x2="${x + SIZE}" y2="${cy}"
                   stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }

    // Label (name/ID)
    const label = ctx.node.label || ctx.node.id;
    const fontSize = ctx.style?.fontSize || 12;
    const font = ctx.style?.font || 'sans-serif';
    svg += `<text x="${cx}" y="${y + SIZE + 15}"
                 text-anchor="middle" font-size="${fontSize}" font-family="${font}">${label}</text>`;

    return svg;
  },
};

/**
 * SVG pattern definition for half-filled (carrier) shading
 * This should be added to the SVG <defs> section once per diagram
 */
export const pedigreeHalfFillPattern = `
<pattern id="pedigree-half-fill" width="40" height="40" patternUnits="userSpaceOnUse">
  <rect x="0" y="0" width="20" height="40" fill="#000"/>
  <rect x="20" y="0" width="20" height="40" fill="#fff"/>
</pattern>
`;
