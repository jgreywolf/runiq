/**
 * Schematic Renderer for Runiq
 *
 * Converts ElectricalProfile, PneumaticProfile, or HydraulicProfile to SVG diagrams
 * with IEEE-standard and ISO 1219 symbols.
 * Uses automatic routing and placement for clean, professional-looking schematics.
 */

import type {
  ElectricalProfile,
  HydraulicProfile,
  PartAst,
  PneumaticProfile,
} from '@runiq/core';
import { Orientation, PIDLineType } from '@runiq/core';
import { SymbolDefinition } from './symbol.ts';
import { getSymbol } from './symbolRegistry.ts';

// Re-export P&ID symbols, line types, tag system, and renderer
export {
  getLineType,
  getLineTypeStyle,
  pidLineTypes,
  renderDoubleLine,
  renderInsulationMarks,
  renderPIDLine,
  type PIDLineType,
  type PIDLineTypeId,
} from './pid-line-types.js';
export {
  renderPID,
  type PIDRenderOptions,
  type PIDRenderResult,
} from './pid-renderer.js';
export { pidSymbols, type PIDSymbolType } from './pid-symbols.js';
export {
  commonTagCombinations,
  createTag,
  formatTagDisplay,
  generateSequentialTags,
  getLoopNumber,
  getLoopTags,
  getTagCategory,
  isFieldMounted,
  isISACompliant,
  isSameLoop,
  measuredVariables,
  parseTag,
  readoutFunctions,
  suggestTags,
  validateTag,
  type PIDTag,
} from './pid-tags.js';

// Union type for all profile types that can be rendered as schematics
export type RenderableProfile =
  | ElectricalProfile
  | PneumaticProfile
  | HydraulicProfile;

export interface SchematicOptions {
  /** Grid size for component placement (default: 50) */
  gridSize?: number;
  /** Wire color (default: 'black') */
  wireColor?: string;
  /** Component color (default: 'black') */
  componentColor?: string;
  /** Show net labels (default: true) */
  showNetLabels?: boolean;
  /** Show component values (default: true) */
  showValues?: boolean;
  /** Show component references (default: true) */
  showReferences?: boolean;
  /** Orientation (default: Orientation.HORIZONTAL) */
  orientation?: Orientation;
  /** Wire routing mode: 'direct' | 'orthogonal' (default: 'direct') */
  routing?: 'direct' | 'orthogonal';
}

export interface RenderResult {
  svg: string;
  warnings: string[];
}

interface PositionedComponent {
  part: PartAst;
  symbol: SymbolDefinition;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
}

interface NetConnection {
  net: string;
  terminal: { x: number; y: number };
  partRef: string;
}

/**
 * Main schematic rendering function
 * Supports electrical schematics, pneumatic circuits, and hydraulic circuits
 */
export function renderSchematic(
  profile: RenderableProfile,
  options: SchematicOptions = {}
): RenderResult {
  const warnings: string[] = [];
  const {
    gridSize = 50,
    wireColor = '#000000',
    componentColor = '#000000',
    showNetLabels = true,
    showValues = true,
    showReferences = true,
    orientation = Orientation.HORIZONTAL,
    routing = 'direct',
  } = options;

  // Build net connectivity map
  const netMap = buildNetMap(profile);

  // Place components on grid
  const positioned = placeComponents(
    profile.parts,
    gridSize,
    orientation,
    warnings
  );

  // Calculate terminal positions for each component
  const connections = calculateConnections(positioned);

  // Route wires between components (with routing mode)
  const wires = routeWires(netMap, connections, gridSize, routing);

  // Calculate bounds (including space for metadata)
  const bounds = calculateBounds(positioned, wires, profile);

  // Determine CSS class prefix based on profile type
  const classPrefix =
    profile.type === PIDLineType.ELECTRICAL
      ? 'electrical'
      : profile.type === PIDLineType.PNEUMATIC
        ? 'pneumatic'
        : 'hydraulic';

  // Generate SVG
  let svg = generateSvgHeader(bounds, profile.name);
  svg += generateStyles(wireColor, componentColor, classPrefix);
  svg += generateDefs();

  // Render wires (below components)
  svg += renderWires(wires, showNetLabels, classPrefix);

  // Render components
  svg += renderComponents(
    positioned,
    showValues,
    showReferences,
    warnings,
    classPrefix
  );

  // Render ground symbols
  svg += renderGroundSymbols(netMap, connections, gridSize, classPrefix);

  // Render profile metadata (pressure, flow, fluid specs)
  svg += renderProfileMetadata(profile, bounds, classPrefix);

  svg += '</svg>';

  return { svg, warnings };
}

/**
 * Build map of nets to connected parts
 * Works with electrical, pneumatic, and hydraulic profiles
 */
function buildNetMap(profile: RenderableProfile): Map<string, PartAst[]> {
  const netMap = new Map<string, PartAst[]>();

  for (const part of profile.parts) {
    for (const pin of part.pins) {
      const netName = normalizeNetName(pin);
      if (!netMap.has(netName)) {
        netMap.set(netName, []);
      }
      netMap.get(netName)!.push(part);
    }
  }

  return netMap;
}

/**
 * Normalize net names (GND/VSS → ground)
 */
function normalizeNetName(name: string): string {
  const upper = name.toUpperCase();
  if (upper === 'GND' || upper === 'VSS' || upper === '0') {
    return 'GND';
  }
  return name;
}

/**
 * Place components on grid in a linear layout
 */
function placeComponents(
  parts: PartAst[],
  gridSize: number,
  orientation: Orientation,
  warnings: string[]
): PositionedComponent[] {
  const positioned: PositionedComponent[] = [];
  let currentX = gridSize * 2;
  let currentY = gridSize * 2;

  for (const part of parts) {
    const symbol = getSymbol(part.type);
    if (!symbol) {
      warnings.push(`Unknown component type: ${part.type}`);
      continue;
    }

    positioned.push({
      part,
      symbol,
      x: orientation === Orientation.HORIZONTAL ? currentX : gridSize * 2,
      y: orientation === Orientation.HORIZONTAL ? gridSize * 2 : currentY,
      rotation: 0,
    });

    if (orientation === Orientation.HORIZONTAL) {
      currentX += symbol.width + gridSize * 2;
    } else {
      currentY += symbol.height + gridSize * 2;
    }
  }

  return positioned;
}

/**
 * Calculate actual terminal positions for all components
 */
function calculateConnections(
  positioned: PositionedComponent[]
): NetConnection[] {
  const connections: NetConnection[] = [];

  for (const comp of positioned) {
    const { part, symbol, x, y } = comp;

    for (let i = 0; i < part.pins.length && i < symbol.terminals.length; i++) {
      const terminal = symbol.terminals[i];
      const netName = normalizeNetName(part.pins[i]);

      connections.push({
        net: netName,
        terminal: {
          x: x + terminal.x,
          y: y + terminal.y,
        },
        partRef: part.ref,
      });
    }
  }

  return connections;
}

/**
 * Route wires between connected terminals
 */
function routeWires(
  netMap: Map<string, PartAst[]>,
  connections: NetConnection[],
  gridSize: number,
  routing: 'direct' | 'orthogonal' = 'direct'
): {
  net: string;
  points: { x: number; y: number }[];
  junctions?: { x: number; y: number }[];
}[] {
  const wires: {
    net: string;
    points: { x: number; y: number }[];
    junctions?: { x: number; y: number }[];
  }[] = [];

  for (const [netName] of netMap.entries()) {
    if (netName === 'GND') continue; // Ground handled separately

    const terminals = connections.filter((c) => c.net === netName);
    if (terminals.length < 2) continue;

    if (routing === 'orthogonal') {
      // Orthogonal (Manhattan) routing
      const junctions: { x: number; y: number }[] = [];

      // For multiple terminals, create a common bus line
      if (terminals.length > 2) {
        // Find average Y position for horizontal bus
        const avgY =
          terminals.reduce((sum, t) => sum + t.terminal.y, 0) /
          terminals.length;
        const busY = Math.round(avgY / gridSize) * gridSize;

        // Connect each terminal to the bus with orthogonal routing
        for (let i = 0; i < terminals.length; i++) {
          const terminal = terminals[i].terminal;

          // Vertical line from terminal to bus
          if (Math.abs(terminal.y - busY) > 1) {
            wires.push({
              net: netName,
              points: [
                { x: terminal.x, y: terminal.y },
                { x: terminal.x, y: busY },
              ],
            });
            junctions.push({ x: terminal.x, y: busY });
          }

          // Horizontal bus line (connect to next terminal)
          if (i < terminals.length - 1) {
            const nextTerminal = terminals[i + 1].terminal;
            wires.push({
              net: netName,
              points: [
                { x: terminal.x, y: busY },
                { x: nextTerminal.x, y: busY },
              ],
              junctions:
                junctions.length > 0
                  ? [junctions[junctions.length - 1]]
                  : undefined,
            });
          }
        }
      } else {
        // Two terminals: horizontal then vertical routing
        const start = terminals[0].terminal;
        const end = terminals[1].terminal;
        const midX = (start.x + end.x) / 2;

        wires.push({
          net: netName,
          points: [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end],
        });
      }
    } else {
      // Direct (straight line) routing
      for (let i = 0; i < terminals.length - 1; i++) {
        const start = terminals[i].terminal;
        const end = terminals[i + 1].terminal;

        wires.push({
          net: netName,
          points: [start, end],
        });
      }
    }
  }

  return wires;
}

/**
 * Calculate diagram bounds
 */
function calculateBounds(
  positioned: PositionedComponent[],
  wires: { net: string; points: { x: number; y: number }[] }[],
  profile: RenderableProfile
): { width: number; height: number; minX: number; minY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const comp of positioned) {
    minX = Math.min(minX, comp.x);
    minY = Math.min(minY, comp.y);
    maxX = Math.max(maxX, comp.x + comp.symbol.width);
    maxY = Math.max(maxY, comp.y + comp.symbol.height);
  }

  for (const wire of wires) {
    for (const point of wire.points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }

  // Calculate metadata height (for hydraulic/pneumatic profiles)
  let metadataHeight = 0;
  if ('pressure' in profile && profile.pressure) metadataHeight += 18;
  if ('flowRate' in profile && profile.flowRate) metadataHeight += 18;
  if ('fluid' in profile && profile.fluid) {
    metadataHeight += 18; // Fluid type line
    if (profile.fluid.temperature) metadataHeight += 18; // Temperature line
  }

  const padding = 40;
  return {
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2 + metadataHeight + 20, // Add metadata space + margin
    minX: minX - padding,
    minY: minY - padding,
  };
}

/**
 * Generate SVG header
 */
function generateSvgHeader(
  bounds: { width: number; height: number; minX: number; minY: number },
  title?: string
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${bounds.width}" 
    height="${bounds.height}" 
    viewBox="${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}"
    role="img" 
    aria-labelledby="schematic-title">
  <title id="schematic-title">${escapeXml(title || 'Electrical Schematic')}</title>
`;
}

/**
 * Generate CSS styles
 */
function generateStyles(
  wireColor: string,
  componentColor: string,
  classPrefix: string
): string {
  return `
  <defs>
    <style type="text/css"><![CDATA[
      .${classPrefix}-wire { stroke: ${wireColor}; stroke-width: 2; fill: none; }
      .${classPrefix}-component { color: ${componentColor}; }
      .${classPrefix}-label { font-family: sans-serif; font-size: 12px; fill: ${componentColor}; }
      .${classPrefix}-value { font-family: sans-serif; font-size: 10px; fill: ${componentColor}; }
      .${classPrefix}-net-label { font-family: sans-serif; font-size: 10px; fill: #0066cc; }
    ]]></style>
  </defs>
`;
}

/**
 * Generate defs (markers, etc.)
 */
function generateDefs(): string {
  return '';
}

/**
 * Render wires
 */
function renderWires(
  wires: {
    net: string;
    points: { x: number; y: number }[];
    junctions?: { x: number; y: number }[];
  }[],
  showNetLabels: boolean,
  classPrefix: string
): string {
  let svg = `<g class="${classPrefix}-wires">\n`;

  // Collect all junctions
  const allJunctions = new Map<string, { x: number; y: number }>();

  for (const wire of wires) {
    if (wire.points.length < 2) continue;

    const pathData = wire.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
      .join(' ');

    svg += `  <path d="${pathData}" class="${classPrefix}-wire"/>\n`;

    // Add net label at midpoint
    if (showNetLabels && wire.net !== 'GND') {
      const midIdx = Math.floor(wire.points.length / 2);
      const midPoint = wire.points[midIdx];
      svg += `  <text x="${midPoint.x + 5}" y="${midPoint.y - 5}" class="${classPrefix}-net-label">${escapeXml(wire.net)}</text>\n`;
    }

    // Collect junctions from this wire
    if (wire.junctions) {
      for (const junction of wire.junctions) {
        const key = `${junction.x},${junction.y}`;
        allJunctions.set(key, junction);
      }
    }
  }

  // Render junction dots
  if (allJunctions.size > 0) {
    svg += `  <g class="${classPrefix}-junctions">\n`;
    for (const junction of allJunctions.values()) {
      svg += `    <circle cx="${junction.x}" cy="${junction.y}" r="3" class="${classPrefix}-junction" fill="currentColor"/>\n`;
    }
    svg += '  </g>\n';
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render components
 */
function renderComponents(
  positioned: PositionedComponent[],
  showValues: boolean,
  showReferences: boolean,
  warnings: string[],
  classPrefix: string
): string {
  let svg = `<g class="${classPrefix}-components">\n`;

  for (const comp of positioned) {
    // Get rotation angle (default to 0)
    const rotation = comp.part.params?.rotation
      ? Number(comp.part.params.rotation)
      : 0;

    // Validate rotation (must be 0, 90, 180, or 270)
    const validRotations = [0, 90, 180, 270];
    if (rotation !== 0 && !validRotations.includes(rotation)) {
      warnings.push(
        `Invalid rotation angle ${rotation} for ${comp.part.ref}. Must be 0, 90, 180, or 270. Using 0.`
      );
    }

    const actualRotation = validRotations.includes(rotation) ? rotation : 0;

    // Calculate center point for rotation
    const centerX = comp.x + comp.symbol.width / 2;
    const centerY = comp.y + comp.symbol.height / 2;

    // Apply rotation transform if needed
    const transformAttr =
      actualRotation !== 0
        ? ` transform="rotate(${actualRotation} ${centerX} ${centerY})"`
        : '';

    svg += `  <g class="${classPrefix}-component" data-ref="${escapeXml(comp.part.ref)}"${transformAttr}>\n`;
    svg += comp.symbol.render(comp.x, comp.y);

    // Component reference (above)
    if (showReferences) {
      const labelX = comp.x + comp.symbol.width / 2;
      const labelY = comp.y - 8;
      svg += `    <text x="${labelX}" y="${labelY}" 
        class="${classPrefix}-label" 
        text-anchor="middle">${escapeXml(comp.part.ref)}</text>\n`;
    }

    // Component value (below)
    if (showValues && comp.part.params) {
      const value =
        comp.part.params.value ||
        comp.part.params.source ||
        comp.part.params.model ||
        comp.part.params.ratio ||
        '';
      if (value) {
        const valueX = comp.x + comp.symbol.width / 2;
        const valueY = comp.y + comp.symbol.height + 15;
        svg += `    <text x="${valueX}" y="${valueY}" 
          class="${classPrefix}-value" 
          text-anchor="middle">${escapeXml(String(value))}</text>\n`;
      }
    }

    svg += '  </g>\n';
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render ground symbols
 */
function renderGroundSymbols(
  _netMap: Map<string, PartAst[]>,
  connections: NetConnection[],
  _gridSize: number,
  classPrefix: string
): string {
  let svg = `<g class="${classPrefix}-grounds">\n`;

  const groundConnections = connections.filter((c) => c.net === 'GND');

  for (const conn of groundConnections) {
    const gndSymbol = getSymbol('GND');
    if (!gndSymbol) continue;

    const x = conn.terminal.x - gndSymbol.width / 2;
    const y = conn.terminal.y + 5;

    svg += gndSymbol.render(x, y);
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Render profile-specific metadata (pressure, flow rate, fluid specs)
 */
function renderProfileMetadata(
  profile: RenderableProfile,
  bounds: { width: number; height: number; minX: number; minY: number },
  classPrefix: string
): string {
  let svg = '<g class="profile-metadata">\n';

  const startY = bounds.minY + bounds.height + 20;
  const startX = bounds.minX + 10;
  let currentY = startY;

  // Render pressure specification
  if ('pressure' in profile && profile.pressure) {
    const { value, unit, type } = profile.pressure;
    const typeStr = type ? ` (${type})` : '';
    svg += `  <text x="${startX}" y="${currentY}" class="${classPrefix}-label">Pressure: ${value} ${unit}${typeStr}</text>\n`;
    currentY += 18;
  }

  // Render flow rate specification
  if ('flowRate' in profile && profile.flowRate) {
    const { value, unit } = profile.flowRate;
    svg += `  <text x="${startX}" y="${currentY}" class="${classPrefix}-label">Flow Rate: ${value} ${unit}</text>\n`;
    currentY += 18;
  }

  // Render fluid specification (hydraulic only)
  if ('fluid' in profile && profile.fluid) {
    const { type, viscosity, temperature } = profile.fluid;
    svg += `  <text x="${startX}" y="${currentY}" class="${classPrefix}-label">Fluid: ${type}`;
    if (viscosity) {
      svg += ` (${escapeXml(viscosity)})`;
    }
    svg += '</text>\n';
    currentY += 18;

    if (temperature) {
      svg += `  <text x="${startX}" y="${currentY}" class="${classPrefix}-label">`;
      svg += `Temp: ${temperature.min}°${temperature.unit} to ${temperature.max}°${temperature.unit}`;
      svg += '</text>\n';
    }
  }

  svg += '</g>\n';
  return svg;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
