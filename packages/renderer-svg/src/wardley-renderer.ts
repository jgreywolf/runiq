/**
 * Wardley Map Renderer for Runiq
 *
 * Renders strategic Wardley Maps with:
 * - Evolution axis (X): genesis → custom → product → commodity
 * - Value chain axis (Y): visible → invisible
 * - Components positioned manually by user
 * - Dependencies showing value chain relationships
 * - Evolution movement indicators
 */

import type {
  WardleyProfile,
  WardleyComponent,
  WardleyDependency,
  WardleyAnchor,
  WardleyEvolution,
} from '@runiq/core';

export interface WardleyRenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showEvolutionLabels?: boolean;
  showValueLabels?: boolean;
  componentColor?: string;
  dependencyColor?: string;
  anchorColor?: string;
  title?: string;
}

export interface WardleyRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const DEFAULT_PADDING = 60;
const EVOLUTION_LABELS = ['Genesis', 'Custom Built', 'Product', 'Commodity'];
const VALUE_LABELS = ['Invisible', '', '', 'Visible'];

/**
 * Main Wardley Map rendering function
 */
export function renderWardleyMap(
  profile: WardleyProfile,
  options: WardleyRenderOptions = {}
): WardleyRenderResult {
  const warnings: string[] = [];
  const {
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    padding = DEFAULT_PADDING,
    showGrid = true,
    showEvolutionLabels = true,
    showValueLabels = true,
    componentColor = '#4A90E2',
    dependencyColor = '#666666',
    anchorColor = '#E25D4A',
    title = profile.name,
  } = options;

  // Calculate usable chart area
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const chartX = padding;
  const chartY = padding;

  // Start SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${width}" height="${height}" 
    viewBox="0 0 ${width} ${height}"
    role="img" aria-labelledby="wardley-title">`;

  // Title
  svg += `<title id="wardley-title">${escapeXml(title)}</title>`;

  // Styles
  svg += generateStyles(componentColor, dependencyColor, anchorColor);

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#FFFFFF"/>`;

  // Grid (optional)
  if (showGrid) {
    svg += renderGrid(chartX, chartY, chartWidth, chartHeight);
  }

  // Axes
  svg += renderAxes(chartX, chartY, chartWidth, chartHeight);

  // Evolution labels (X-axis)
  if (showEvolutionLabels) {
    svg += renderEvolutionLabels(
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      padding
    );
  }

  // Value chain labels (Y-axis)
  if (showValueLabels) {
    svg += renderValueLabels(chartX, chartY, chartWidth, chartHeight, padding);
  }

  // Dependencies (render first, so they're behind components)
  if (profile.dependencies && profile.dependencies.length > 0) {
    svg += renderDependencies(
      profile.dependencies,
      profile.components,
      chartX,
      chartY,
      chartWidth,
      chartHeight
    );
  }

  // Evolution movements (arrows showing future evolution)
  if (profile.evolutions && profile.evolutions.length > 0) {
    svg += renderEvolutions(
      profile.evolutions,
      profile.components,
      chartX,
      chartY,
      chartWidth,
      chartHeight
    );
  }

  // Components
  svg += renderComponents(
    profile.components,
    chartX,
    chartY,
    chartWidth,
    chartHeight
  );

  // Anchors (user needs at top)
  if (profile.anchors && profile.anchors.length > 0) {
    svg += renderAnchors(
      profile.anchors,
      chartX,
      chartY,
      chartWidth,
      chartHeight
    );
  }

  svg += '</svg>';

  return { svg, warnings };
}

/**
 * Generate CSS styles for Wardley Map
 */
function generateStyles(
  componentColor: string,
  dependencyColor: string,
  anchorColor: string
): string {
  return `
  <style>
    .wardley-component {
      fill: ${componentColor};
      stroke: #2C5F8D;
      stroke-width: 2;
      cursor: pointer;
    }
    .wardley-component:hover {
      fill: #5AA5ED;
    }
    .wardley-component-inertia {
      fill: ${componentColor};
      stroke: #2C5F8D;
      stroke-width: 3;
      stroke-dasharray: 5,5;
    }
    .wardley-component-label {
      font-family: Arial, sans-serif;
      font-size: 12px;
      fill: #333;
      text-anchor: middle;
      pointer-events: none;
    }
    .wardley-dependency {
      stroke: ${dependencyColor};
      stroke-width: 1.5;
      fill: none;
      marker-end: url(#wardley-arrow);
    }
    .wardley-evolution-arrow {
      stroke: #E28D4A;
      stroke-width: 2;
      fill: none;
      stroke-dasharray: 5,3;
      marker-end: url(#wardley-evolution-arrow);
    }
    .wardley-anchor {
      fill: ${anchorColor};
      stroke: #A53D2C;
      stroke-width: 2;
    }
    .wardley-anchor-label {
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: bold;
      fill: #333;
      text-anchor: middle;
    }
    .wardley-axis {
      stroke: #333;
      stroke-width: 2;
      fill: none;
    }
    .wardley-grid {
      stroke: #E0E0E0;
      stroke-width: 0.5;
      fill: none;
    }
    .wardley-axis-label {
      font-family: Arial, sans-serif;
      font-size: 11px;
      fill: #666;
      text-anchor: middle;
    }
    .wardley-evolution-label {
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: bold;
      fill: #333;
      text-anchor: middle;
    }
  </style>
  <defs>
    <marker id="wardley-arrow" markerWidth="10" markerHeight="10" 
            refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="${dependencyColor}" />
    </marker>
    <marker id="wardley-evolution-arrow" markerWidth="10" markerHeight="10" 
            refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#E28D4A" />
    </marker>
  </defs>
  `;
}

/**
 * Render grid lines
 */
function renderGrid(
  x: number,
  y: number,
  width: number,
  height: number
): string {
  let svg = '<g class="wardley-grid-group">\n';

  // Vertical grid lines (evolution stages)
  for (let i = 0; i <= 4; i++) {
    const gridX = x + (i * width) / 4;
    svg += `  <line class="wardley-grid" x1="${gridX}" y1="${y}" x2="${gridX}" y2="${y + height}" />\n`;
  }

  // Horizontal grid lines (value chain)
  for (let i = 0; i <= 4; i++) {
    const gridY = y + (i * height) / 4;
    svg += `  <line class="wardley-grid" x1="${x}" y1="${gridY}" x2="${x + width}" y2="${gridY}" />\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render axes (evolution and value chain)
 */
function renderAxes(
  x: number,
  y: number,
  width: number,
  height: number
): string {
  return `
  <g class="wardley-axes">
    <!-- Value chain axis (Y) -->
    <line class="wardley-axis" x1="${x}" y1="${y}" x2="${x}" y2="${y + height}" />
    <!-- Evolution axis (X) -->
    <line class="wardley-axis" x1="${x}" y1="${y + height}" x2="${x + width}" y2="${y + height}" />
  </g>
  `;
}

/**
 * Render evolution stage labels
 */
function renderEvolutionLabels(
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number
): string {
  let svg = '<g class="wardley-evolution-labels">\n';

  for (let i = 0; i < EVOLUTION_LABELS.length; i++) {
    const labelX = x + ((i + 0.5) * width) / 4;
    const labelY = y + height + padding / 2;
    svg += `  <text class="wardley-evolution-label" x="${labelX}" y="${labelY}">${escapeXml(EVOLUTION_LABELS[i])}</text>\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render value chain labels
 */
function renderValueLabels(
  x: number,
  y: number,
  _width: number,
  height: number,
  padding: number
): string {
  let svg = '<g class="wardley-value-labels">\n';

  for (let i = 0; i < VALUE_LABELS.length; i++) {
    if (!VALUE_LABELS[i]) continue; // Skip empty labels
    const labelX = x - padding / 2;
    const labelY = y + height - (i * height) / 3;
    svg += `  <text class="wardley-axis-label" x="${labelX}" y="${labelY}" transform="rotate(-90 ${labelX} ${labelY})">${escapeXml(VALUE_LABELS[i])}</text>\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render components (circles positioned on the map)
 */
function renderComponents(
  components: WardleyComponent[],
  chartX: number,
  chartY: number,
  chartWidth: number,
  chartHeight: number
): string {
  let svg = '<g class="wardley-components">\n';

  for (const component of components) {
    const cx = chartX + component.evolution * chartWidth;
    const cy = chartY + (1 - component.value) * chartHeight; // Invert Y (0 at bottom, 1 at top)
    const r = 8;

    const cssClass = component.inertia
      ? 'wardley-component-inertia'
      : 'wardley-component';
    const label = component.label || component.name;

    svg += `  <circle class="${cssClass}" cx="${cx}" cy="${cy}" r="${r}" />\n`;
    svg += `  <text class="wardley-component-label" x="${cx}" y="${cy - r - 5}">${escapeXml(label)}</text>\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render dependencies (lines connecting components)
 */
function renderDependencies(
  dependencies: WardleyDependency[],
  components: WardleyComponent[],
  chartX: number,
  chartY: number,
  chartWidth: number,
  chartHeight: number
): string {
  let svg = '<g class="wardley-dependencies">\n';

  // Build component map for quick lookup
  const componentMap = new Map<string, WardleyComponent>();
  for (const comp of components) {
    componentMap.set(comp.name, comp);
  }

  for (const dep of dependencies) {
    const from = componentMap.get(dep.from);
    const to = componentMap.get(dep.to);

    if (!from || !to) continue;

    const x1 = chartX + from.evolution * chartWidth;
    const y1 = chartY + (1 - from.value) * chartHeight;
    const x2 = chartX + to.evolution * chartWidth;
    const y2 = chartY + (1 - to.value) * chartHeight;

    svg += `  <line class="wardley-dependency" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render anchors (user needs)
 */
function renderAnchors(
  anchors: WardleyAnchor[],
  chartX: number,
  chartY: number,
  chartWidth: number,
  chartHeight: number
): string {
  let svg = '<g class="wardley-anchors">\n';

  for (const anchor of anchors) {
    const evolution = anchor.evolution !== undefined ? anchor.evolution : 0.5;
    const cx = chartX + evolution * chartWidth;
    const cy = chartY + (1 - anchor.value) * chartHeight;

    // Draw as star/flag shape
    svg += renderAnchorStar(cx, cy);
    svg += `  <text class="wardley-anchor-label" x="${cx}" y="${cy - 15}">${escapeXml(anchor.name)}</text>\n`;
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render star shape for anchors
 */
function renderAnchorStar(cx: number, cy: number): string {
  const r = 10;
  const points: string[] = [];

  // Create 5-pointed star
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return `  <polygon class="wardley-anchor" points="${points.join(' ')}" />\n`;
}

/**
 * Render evolution movements (arrows showing future evolution)
 */
function renderEvolutions(
  evolutions: WardleyEvolution[],
  components: WardleyComponent[],
  chartX: number,
  chartY: number,
  chartWidth: number,
  chartHeight: number
): string {
  let svg = '<g class="wardley-evolutions">\n';

  // Build component map for quick lookup
  const componentMap = new Map<string, WardleyComponent>();
  for (const comp of components) {
    componentMap.set(comp.name, comp);
  }

  for (const evolution of evolutions) {
    const comp = componentMap.get(evolution.component);
    if (!comp) continue;

    const x1 = chartX + comp.evolution * chartWidth;
    const y1 = chartY + (1 - comp.value) * chartHeight;
    const x2 = chartX + evolution.toEvolution * chartWidth;
    const y2 = y1; // Same value chain position

    svg += `  <line class="wardley-evolution-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />\n`;
  }

  svg += '</g>\n';
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
