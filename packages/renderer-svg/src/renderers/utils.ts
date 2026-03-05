export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  options: {
    textAnchor?: 'start' | 'middle' | 'end';
    dominantBaseline?: string;
    fontFamily?: string;
    fontSize?: number;
    fill?: string;
    fontWeight?: string;
    fontStyle?: string;
    className?: string;
  } = {}
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
