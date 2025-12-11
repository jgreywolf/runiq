import type { ShapeDefinition } from '../../types/index.js';

/**
 * UML Package shape
 * Displays package as a folder with a tab
 * Used in class diagrams to show package/namespace organization
 */
export const packageShape: ShapeDefinition = {
  id: 'umlPackage',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;

    // Calculate minimum width needed for the tab label
    const labelSize = ctx.measureText(ctx.node.label || '', {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    });
    const minWidthForTab = labelSize.width + padding * 3;

    // For containers, layout engine provides the actual dimensions in data
    const data = ctx.node.data as any;
    if (data?.width && data?.height) {
      // Ensure the package is at least wide enough for the tab label
      const width = Math.max(data.width, minWidthForTab);
      return { width, height: data.height };
    }

    // Fallback for standalone usage (non-container)
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);

    // Package should be wider and taller than just the label
    const width = Math.max(nameSize.width + padding * 3, minWidthForTab, 140);
    const height = Math.max(nameSize.height + padding * 4, 100);

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const padding = ctx.style.padding || 12;
    const tabHeight = 22;

    // Calculate tab width based on label size with generous padding
    const labelSize = ctx.measureText(ctx.node.label || '', {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    });
    const minTabWidth = labelSize.width + padding * 2.5; // Extra padding for comfort
    const maxTabWidth = w * 0.7; // Allow up to 70% of width
    const tabWidth = Math.min(Math.max(minTabWidth, 70), maxTabWidth);

    const fill = ctx.style.fill || '#ffe4b5'; // Moccasin/light orange - very visible!
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="package-shape">`;

    // UML Package shape - folder with tab on top-left
    // Draw as single path for proper folder appearance
    const path = [
      `M ${x} ${y + tabHeight}`, // Start at left side of body, below tab
      `L ${x} ${y}`, // Up to top-left corner of tab
      `L ${x + tabWidth} ${y}`, // Across top of tab
      `L ${x + tabWidth} ${y + tabHeight}`, // Down right side of tab
      `L ${x + w} ${y + tabHeight}`, // Across to right edge
      `L ${x + w} ${y + h}`, // Down to bottom-right
      `L ${x} ${y + h}`, // Across to bottom-left
      `Z`, // Close path back to start
    ].join(' ');

    svg += `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Package name in the tab area
    const textY = y + tabHeight / 2 + (ctx.style.fontSize || 14) / 2;
    const textColor = ctx.style.color || '#000000'; // Use explicit text color or black
    svg += `<text x="${x + padding / 2}" y="${textY}" `;
    svg += `font-size="${(ctx.style.fontSize || 14) - 2}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${textColor}">`;
    svg += `${ctx.node.label || ''}</text>`;

    svg += `</g>`;
    return svg;
  },
};
