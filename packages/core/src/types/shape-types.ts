/**
 * Shape rendering type definitions
 * ShapeDefinition, ShapeRenderContext, IconProvider, and utility functions
 */

import type { NodeAst, Style } from './diagram-types.js';

export interface ShapeRenderContext {
  node: NodeAst;
  style: Style;
  measureText: (
    text: string,
    style: Style
  ) => { width: number; height: number };
  /**
   * Optional label renderer that supports inline icons.
   * If not provided, shapes should render plain text labels.
   * Injected by renderer-svg package to enable icon syntax like "fa:fa-star Label"
   */
  renderLabel?: (
    label: string,
    x: number,
    y: number,
    style: {
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      textAnchor?: 'start' | 'middle' | 'end';
      dominantBaseline?: string;
    }
  ) => string;
}

/**
 * Helper function to extract a property from node data.
 * Handles the parser's format: { values: [{ property: value }] }
 * Also supports direct format and array format.
 */
export function getDataProperty<T = any>(
  data: Record<string, unknown> | undefined,
  property: string,
  defaultValue?: T
): T | undefined {
  if (!data) return defaultValue;

  const d = data as any;

  // Format from parser: { values: [{ property: value }] }
  if (d.values && Array.isArray(d.values) && d.values[0]) {
    return d.values[0][property] ?? defaultValue;
  }

  // Direct format: { property: value }
  if (d[property] !== undefined) {
    return d[property] ?? defaultValue;
  }

  // Array format: [{ property: value }]
  if (Array.isArray(d) && d[0]) {
    return d[0][property] ?? defaultValue;
  }

  return defaultValue;
}

/**
 * Escape XML special characters to prevent HTML injection
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Options for rendering multi-line SVG text
 */
export interface MultilineTextOptions {
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: string;
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  fontWeight?: string;
  fontStyle?: string;
  className?: string;
}

/**
 * Renders multi-line SVG text by splitting on \n and creating tspan elements.
 * Returns SVG markup for a <text> element with proper line breaks.
 *
 * @param text - The text to render (may contain \n for line breaks)
 * @param x - X coordinate
 * @param y - Y coordinate (baseline of first line)
 * @param options - Text styling options
 * @returns SVG <text> element with <tspan> children for each line
 */
export function renderMultilineText(
  text: string,
  x: number,
  y: number,
  options: MultilineTextOptions = {}
): string {
  const lines = text.split('\n');
  const lineHeight = (options.fontSize || 14) * 1.2; // 1.2 is standard line height multiplier

  // If only one line, render simple text element
  if (lines.length === 1) {
    const attrs = [
      `x="${x}"`,
      `y="${y}"`,
      options.textAnchor ? `text-anchor="${options.textAnchor}"` : '',
      options.dominantBaseline
        ? `dominant-baseline="${options.dominantBaseline}"`
        : '',
      options.fontFamily ? `font-family="${options.fontFamily}"` : '',
      options.fontSize ? `font-size="${options.fontSize}"` : '',
      options.fill ? `fill="${options.fill}"` : '',
      options.fontWeight ? `font-weight="${options.fontWeight}"` : '',
      options.fontStyle ? `font-style="${options.fontStyle}"` : '',
      options.className ? `class="${options.className}"` : '',
    ]
      .filter((a) => a)
      .join(' ');

    return `<text ${attrs}>${escapeXml(text)}</text>`;
  }

  // Multiple lines: use tspan elements
  // Adjust y coordinate based on dominant-baseline
  let startY = y;
  if (options.dominantBaseline === 'middle') {
    // Center the block of text vertically
    startY = y - ((lines.length - 1) * lineHeight) / 2;
  }

  const attrs = [
    options.textAnchor ? `text-anchor="${options.textAnchor}"` : '',
    options.fontFamily ? `font-family="${options.fontFamily}"` : '',
    options.fontSize ? `font-size="${options.fontSize}"` : '',
    options.fill ? `fill="${options.fill}"` : '',
    options.fontWeight ? `font-weight="${options.fontWeight}"` : '',
    options.fontStyle ? `font-style="${options.fontStyle}"` : '',
    options.className ? `class="${options.className}"` : '',
  ]
    .filter((a) => a)
    .join(' ');

  let svg = `<text ${attrs}>`;
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    svg += `<tspan x="${x}" y="${lineY}">${escapeXml(line)}</tspan>`;
  });
  svg += `</text>`;

  return svg;
}

export interface ShapeDefinition {
  id: string;
  bounds(ctx: ShapeRenderContext): { width: number; height: number };
  anchors?(ctx: ShapeRenderContext): { x: number; y: number; name?: string }[];
  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string; // returns SVG <g> inner markup
}

export interface IconProvider {
  id: string; // "fontawesome"
  getPath(name: string): { d: string; viewBox: string } | undefined;
}
