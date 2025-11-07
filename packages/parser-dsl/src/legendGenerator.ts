/**
 * Legend Generation for Data-Driven Diagrams
 *
 * Generates legend components for visualizing style mappings (scales and categories).
 * Supports color gradients, size scales, and categorical mappings.
 *
 * @module legendGenerator
 */

import type { StyleMappingConfig } from './dynamic-shape-generator.js';

/**
 * Position for legend placement
 */
export type LegendPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'
  | 'left-center'
  | 'right-center';

/**
 * Configuration for legend generation
 */
export interface LegendConfig {
  /** Position of the legend */
  position?: LegendPosition;
  /** Title for the legend */
  title?: string;
  /** Width of the legend in pixels */
  width?: number;
  /** Height of the legend in pixels */
  height?: number;
  /** Padding around legend content */
  padding?: number;
  /** Font size for labels */
  fontSize?: number;
  /** Number of steps for scale legends */
  steps?: number;
  /** Show border around legend */
  showBorder?: boolean;
  /** Background color */
  backgroundColor?: string;
}

/**
 * Generated legend entry
 */
export interface LegendEntry {
  label: string;
  value: string | number;
  style: string;
}

/**
 * Generated legend component
 */
export interface Legend {
  type: 'scale' | 'category';
  title?: string;
  entries: LegendEntry[];
  position: LegendPosition;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Generate a scale legend for continuous mappings
 */
export function generateScaleLegend(
  mapping: StyleMappingConfig & { type: 'scale' },
  config: LegendConfig = {}
): Legend {
  if (mapping.type !== 'scale' || !mapping.scale) {
    throw new Error('Scale mapping required for scale legend');
  }

  const {
    position = 'bottom-right',
    title,
    width = 200,
    height = 100,
    steps = 5,
  } = config;

  const { domain, range } = mapping.scale;
  const [minDomain, maxDomain] = domain;
  const [minRange, maxRange] = range;

  // Generate evenly spaced entries
  const entries: LegendEntry[] = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const value = minDomain + ratio * (maxDomain - minDomain);

    // Interpolate style value
    let style: string;
    if (isColorValue(minRange) && isColorValue(maxRange)) {
      style = interpolateColor(minRange, maxRange, ratio);
    } else {
      const numMin = parseFloat(minRange);
      const numMax = parseFloat(maxRange);
      style = (numMin + ratio * (numMax - numMin)).toFixed(2);
    }

    entries.push({
      label: formatValue(value),
      value,
      style,
    });
  }

  return {
    type: 'scale',
    title: title || `${mapping.field} (${mapping.property})`,
    entries,
    position,
    bounds: calculateBounds(position, width, height),
  };
}

/**
 * Generate a category legend for discrete mappings
 */
export function generateCategoryLegend(
  mapping: StyleMappingConfig & { type: 'category' },
  config: LegendConfig = {}
): Legend {
  if (mapping.type !== 'category' || !mapping.categories) {
    throw new Error('Category mapping required for category legend');
  }

  const {
    position = 'bottom-right',
    title,
    width = 200,
    height = 150,
  } = config;

  // Generate entry for each category
  const entries: LegendEntry[] = Object.entries(mapping.categories).map(
    ([value, style]) => ({
      label: value,
      value,
      style,
    })
  );

  return {
    type: 'category',
    title: title || `${mapping.field} (${mapping.property})`,
    entries,
    position,
    bounds: calculateBounds(position, width, height),
  };
}

/**
 * Generate a threshold legend for threshold mappings
 */
export function generateThresholdLegend(
  mapping: StyleMappingConfig & { type: 'threshold' },
  config: LegendConfig = {}
): Legend {
  if (mapping.type !== 'threshold' || !mapping.thresholds) {
    throw new Error('Threshold mapping required for threshold legend');
  }

  const {
    position = 'bottom-right',
    title,
    width = 200,
    height = 150,
  } = config;

  // Sort thresholds descending (highest first)
  const sortedThresholds = [...mapping.thresholds].sort(
    (a, b) => b.value - a.value
  );

  // Generate entry for each threshold range
  const entries: LegendEntry[] = sortedThresholds.map((threshold, index) => {
    const prevThreshold = sortedThresholds[index - 1];
    const label =
      index === 0
        ? `≥ ${formatValue(threshold.value)}`
        : `${formatValue(threshold.value)} - ${formatValue(prevThreshold.value)}`;

    return {
      label,
      value: threshold.value,
      style: threshold.style,
    };
  });

  return {
    type: 'category', // Threshold legends display like category legends
    title: title || `${mapping.field} (${mapping.property})`,
    entries,
    position,
    bounds: calculateBounds(position, width, height),
  };
}

/**
 * Generate multiple legends from style mappings
 */
export function generateLegendsFromMappings(
  mappings: StyleMappingConfig[],
  config: LegendConfig = {}
): Legend[] {
  const legends: Legend[] = [];

  // Position legends in a grid
  const positions: LegendPosition[] = [
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left',
  ];

  mappings.forEach((mapping, index) => {
    const position = config.position || positions[index % positions.length];
    const legendConfig = { ...config, position };

    if (mapping.type === 'scale') {
      legends.push(
        generateScaleLegend(
          mapping as StyleMappingConfig & { type: 'scale' },
          legendConfig
        )
      );
    } else if (mapping.type === 'category') {
      legends.push(
        generateCategoryLegend(
          mapping as StyleMappingConfig & { type: 'category' },
          legendConfig
        )
      );
    } else if (mapping.type === 'threshold') {
      legends.push(
        generateThresholdLegend(
          mapping as StyleMappingConfig & { type: 'threshold' },
          legendConfig
        )
      );
    }
  });

  return legends;
}

/**
 * Calculate legend bounds based on position
 */
function calculateBounds(
  position: LegendPosition,
  width: number,
  height: number,
  diagramWidth = 1000,
  diagramHeight = 800,
  margin = 20
): { x: number; y: number; width: number; height: number } {
  let x = 0;
  let y = 0;

  switch (position) {
    case 'top-left':
      x = margin;
      y = margin;
      break;
    case 'top-right':
      x = diagramWidth - width - margin;
      y = margin;
      break;
    case 'bottom-left':
      x = margin;
      y = diagramHeight - height - margin;
      break;
    case 'bottom-right':
      x = diagramWidth - width - margin;
      y = diagramHeight - height - margin;
      break;
    case 'top-center':
      x = (diagramWidth - width) / 2;
      y = margin;
      break;
    case 'bottom-center':
      x = (diagramWidth - width) / 2;
      y = diagramHeight - height - margin;
      break;
    case 'left-center':
      x = margin;
      y = (diagramHeight - height) / 2;
      break;
    case 'right-center':
      x = diagramWidth - width - margin;
      y = (diagramHeight - height) / 2;
      break;
  }

  return { x, y, width, height };
}

/**
 * Check if a value is a color (hex format)
 */
function isColorValue(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  // Parse hex colors
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Interpolate each component
  const r = Math.round(r1 + ratio * (r2 - r1));
  const g = Math.round(g1 + ratio * (g2 - g1));
  const b = Math.round(b1 + ratio * (b2 - b1));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Format a numeric value for display
 */
function formatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Show up to 2 decimal places, remove trailing zeros
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Render legend as SVG string
 */
export function renderLegendSVG(
  legend: Legend,
  config: LegendConfig = {}
): string {
  const {
    padding = 10,
    fontSize = 12,
    showBorder = true,
    backgroundColor = 'white',
  } = config;

  const { bounds, title, entries, type } = legend;
  const { x, y, width, height } = bounds;

  const entryHeight = 20;
  const titleHeight = title ? 20 : 0;
  const swatchSize = 15;
  const swatchSpacing = 5;

  let svg = `<g class="legend" transform="translate(${x}, ${y})">`;

  // Background
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}" `;
  if (showBorder) {
    svg += `stroke="black" stroke-width="1" `;
  }
  svg += `rx="3" />`;

  // Title
  if (title) {
    svg += `<text x="${width / 2}" y="${padding + fontSize}" `;
    svg += `font-size="${fontSize + 2}" font-weight="bold" text-anchor="middle">`;
    svg += escapeXml(title);
    svg += `</text>`;
  }

  // Entries
  entries.forEach((entry, index) => {
    const entryY = padding + titleHeight + index * entryHeight;

    if (type === 'scale') {
      // Gradient bar for scale legends
      const barY = entryY + 2;
      const barHeight = swatchSize;
      const barWidth = width - 2 * padding;

      if (isColorValue(entry.style)) {
        svg += `<rect x="${padding}" y="${barY}" width="${barWidth}" height="${barHeight}" `;
        svg += `fill="${entry.style}" stroke="black" stroke-width="0.5" />`;
      } else {
        // Non-color properties (opacity, size, etc)
        svg += `<rect x="${padding}" y="${barY}" width="${barWidth}" height="${barHeight}" `;
        svg += `fill="gray" opacity="${entry.style}" stroke="black" stroke-width="0.5" />`;
      }

      // Label below
      svg += `<text x="${padding}" y="${barY + barHeight + fontSize}" font-size="${fontSize}">`;
      svg += escapeXml(entry.label);
      svg += `</text>`;
    } else {
      // Swatch + label for category legends
      const swatchX = padding;
      const swatchY = entryY;

      if (isColorValue(entry.style)) {
        svg += `<rect x="${swatchX}" y="${swatchY}" width="${swatchSize}" height="${swatchSize}" `;
        svg += `fill="${entry.style}" stroke="black" stroke-width="0.5" />`;
      } else {
        // Non-color properties
        svg += `<rect x="${swatchX}" y="${swatchY}" width="${swatchSize}" height="${swatchSize}" `;
        svg += `fill="gray" opacity="${entry.style}" stroke="black" stroke-width="0.5" />`;
      }

      svg += `<text x="${swatchX + swatchSize + swatchSpacing}" y="${swatchY + swatchSize - 2}" `;
      svg += `font-size="${fontSize}">`;
      svg += escapeXml(entry.label);
      svg += `</text>`;
    }
  });

  svg += `</g>`;

  return svg;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
