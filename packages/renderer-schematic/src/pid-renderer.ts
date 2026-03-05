/**
 * P&ID Renderer - ISA-5.1 Compliant Rendering
 * Renders Process & Instrumentation Diagrams with proper symbols and line routing
 */

import type {
  PIDEquipment,
  PIDInstrument,
  PIDLine,
  PIDLoop,
  PIDProfile,
} from '@runiq/core';
import { PIDLineType } from '@runiq/core';
import { pidSymbols, type PIDSymbolDefinition } from './pid-symbols.js';

export interface PIDRenderOptions {
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  showTags?: boolean;
  showProperties?: boolean;
  spacing?: number;
}

export interface PIDRenderResult {
  svg: string;
  warnings: string[];
}

interface EquipmentLayout {
  equipment: PIDEquipment;
  x: number;
  y: number;
  symbol: PIDSymbolDefinition;
}

interface InstrumentLayout {
  instrument: PIDInstrument;
  x: number;
  y: number;
  radius: number;
}

/**
 * Render a P&ID profile to SVG
 */
export function renderPID(
  profile: PIDProfile,
  options: PIDRenderOptions = {}
): PIDRenderResult {
  const {
    width = 1200,
    height = 800,
    gridSize = 50,
    showGrid = false,
    showTags = true,
    showProperties = true,
    spacing = 150,
  } = options;

  const warnings: string[] = [];
  let svgContent = '';

  // Calculate layout for equipment and instruments
  const { equipmentLayouts, instrumentLayouts, actualHeight } = calculateLayout(
    profile,
    width,
    height,
    spacing,
    warnings
  );

  // Use calculated height if it's larger than specified
  const finalHeight = Math.max(height, actualHeight + 100); // Add 100px padding

  // Render grid if enabled
  if (showGrid) {
    svgContent += renderGrid(width, finalHeight, gridSize);
  }

  // Render process lines first (behind equipment)
  svgContent += renderLines(
    profile.lines || [],
    equipmentLayouts,
    instrumentLayouts,
    warnings
  );

  // Render equipment symbols
  svgContent += renderEquipment(equipmentLayouts, showTags, showProperties);

  // Render instrument bubbles
  svgContent += renderInstruments(instrumentLayouts, showTags);

  // Render control loop annotations
  if (profile.loops && profile.loops.length > 0) {
    svgContent += renderLoops(profile.loops, instrumentLayouts);
  }

  // Build final SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${finalHeight}" viewBox="0 0 ${width} ${finalHeight}">
		<defs>
			<style>
				.pid-equipment { stroke: #000; stroke-width: 2; fill: none; }
				.pid-equipment-filled { stroke: #000; stroke-width: 2; fill: #fff; }
				.pid-line { stroke: #000; stroke-width: 2; fill: none; }
				.pid-line-signal { stroke: #000; stroke-width: 1.5; fill: none; stroke-dasharray: 5,5; }
				.pid-line-electrical { stroke: #000; stroke-width: 2; fill: none; stroke-dasharray: 2,2; }
				.pid-line-utility { stroke: #0066cc; stroke-width: 2; fill: none; }
				.pid-line-pneumatic { stroke: #000; stroke-width: 1.5; fill: none; stroke-dasharray: 8,4; }
				.pid-line-hydraulic { stroke: #000; stroke-width: 3; fill: none; }
				.pid-line-data { stroke: #000; stroke-width: 1.5; fill: none; stroke-dasharray: 2,3; }
				.pid-instrument { stroke: #000; stroke-width: 2; fill: #fff; }
				.pid-tag { font-family: Arial, sans-serif; font-size: 12px; fill: #000; text-anchor: middle; }
				.pid-property { font-family: Arial, sans-serif; font-size: 10px; fill: #666; text-anchor: middle; }
				.pid-loop { font-family: Arial, sans-serif; font-size: 10px; fill: #0066cc; text-anchor: middle; }
			</style>
		</defs>
		<rect width="${width}" height="${finalHeight}" fill="#fff"/>
		${svgContent}
	</svg>`;

  return { svg, warnings };
}

/**
 * Calculate layout positions for equipment and instruments
 */
function calculateLayout(
  profile: PIDProfile,
  width: number,
  _height: number,
  spacing: number,
  warnings: string[]
): {
  equipmentLayouts: EquipmentLayout[];
  instrumentLayouts: InstrumentLayout[];
  actualHeight: number;
} {
  const equipmentLayouts: EquipmentLayout[] = [];
  const instrumentLayouts: InstrumentLayout[] = [];

  // Simple flow-based layout: left to right, top to bottom
  const margin = 100;
  const itemsPerRow = Math.floor((width - 2 * margin) / spacing);

  // Layout equipment
  let equipmentIndex = 0;
  for (const equipment of profile.equipment || []) {
    const symbol = pidSymbols[equipment.type as keyof typeof pidSymbols];
    if (!symbol) {
      warnings.push(`Unknown equipment type: ${equipment.type}`);
      continue;
    }

    const row = Math.floor(equipmentIndex / itemsPerRow);
    const col = equipmentIndex % itemsPerRow;

    equipmentLayouts.push({
      equipment,
      x: margin + col * spacing,
      y: margin + row * spacing,
      symbol,
    });

    equipmentIndex++;
  }

  // Layout instruments below equipment
  const instrumentStartY =
    margin +
    Math.ceil(equipmentLayouts.length / itemsPerRow) * spacing +
    spacing;
  let instrumentIndex = 0;

  for (const instrument of profile.instruments || []) {
    const row = Math.floor(instrumentIndex / itemsPerRow);
    const col = instrumentIndex % itemsPerRow;

    instrumentLayouts.push({
      instrument,
      x: margin + col * spacing,
      y: instrumentStartY + row * spacing,
      radius: 25,
    });

    instrumentIndex++;
  }

  // Calculate actual height needed
  let maxY = margin;

  // Check equipment positions
  for (const layout of equipmentLayouts) {
    maxY = Math.max(maxY, layout.y + 80); // 80px for symbol + tag + properties
  }

  // Check instrument positions (they include loop annotations below)
  for (const layout of instrumentLayouts) {
    maxY = Math.max(maxY, layout.y + layout.radius + 70); // radius + tag + loop info
  }

  return { equipmentLayouts, instrumentLayouts, actualHeight: maxY };
}

/**
 * Render background grid
 */
function renderGrid(width: number, height: number, gridSize: number): string {
  let grid = '<g class="pid-grid" opacity="0.1">';

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#000" stroke-width="0.5"/>`;
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    grid += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#000" stroke-width="0.5"/>`;
  }

  grid += '</g>';
  return grid;
}

/**
 * Render equipment symbols
 */
function renderEquipment(
  layouts: EquipmentLayout[],
  showTags: boolean,
  showProperties: boolean
): string {
  let svg = '<g class="pid-equipment-group">';

  for (const layout of layouts) {
    const { equipment, x, y, symbol } = layout;

    // Render symbol
    svg += `<g transform="translate(${x},${y})">`;
    svg += symbol.render(0, 0, equipment.tag);

    // Render tag
    if (showTags) {
      svg += `<text class="pid-tag" x="0" y="-35">${equipment.tag}</text>`;
    }

    // Render key properties
    if (showProperties && equipment.properties) {
      const props = [];
      if (typeof equipment.properties.volume === 'number') {
        const unit = String(equipment.properties.volumeUnit || 'L');
        props.push(`${equipment.properties.volume}${unit}`);
      }
      if (typeof equipment.properties.flowRate === 'number') {
        const unit = String(equipment.properties.flowRateUnit || 'm³/h');
        props.push(`${equipment.properties.flowRate}${unit}`);
      }
      if (typeof equipment.properties.material === 'string') {
        props.push(equipment.properties.material);
      }

      if (props.length > 0) {
        svg += `<text class="pid-property" x="0" y="45">${props.join(', ')}</text>`;
      }
    }

    svg += '</g>';
  }

  svg += '</g>';
  return svg;
}

/**
 * Render instrument bubbles (ISA-5.1 standard circles)
 */
function renderInstruments(
  layouts: InstrumentLayout[],
  showTags: boolean
): string {
  let svg = '<g class="pid-instruments-group">';

  for (const layout of layouts) {
    const { instrument, x, y, radius } = layout;

    svg += `<g transform="translate(${x},${y})">`;

    // Instrument bubble (circle)
    svg += `<circle cx="0" cy="0" r="${radius}" class="pid-instrument"/>`;

    // Tag inside bubble
    if (showTags) {
      svg += `<text class="pid-tag" x="0" y="4">${instrument.tag}</text>`;
    }

    // Location indicator (field = solid circle, panel = dashed, local = empty)
    const location = instrument.properties?.location as string | undefined;
    if (location === 'panel') {
      svg += `<circle cx="0" cy="0" r="${radius + 3}" class="pid-instrument" stroke-dasharray="3,3" fill="none"/>`;
    } else if (location === 'field') {
      // Field mounted - add mounting symbol
      svg += `<line x1="-5" y1="${radius + 5}" x2="5" y2="${radius + 5}" stroke="#000" stroke-width="2"/>`;
    }

    svg += '</g>';
  }

  svg += '</g>';
  return svg;
}

/**
 * Render lines connecting equipment and instruments
 */
function renderLines(
  lines: PIDLine[],
  equipmentLayouts: EquipmentLayout[],
  instrumentLayouts: InstrumentLayout[],
  warnings: string[]
): string {
  let svg = '<g class="pid-lines-group">';

  // Build lookup maps
  const equipmentMap = new Map<string, EquipmentLayout>();
  for (const layout of equipmentLayouts) {
    equipmentMap.set(layout.equipment.tag, layout);
  }

  const instrumentMap = new Map<string, InstrumentLayout>();
  for (const layout of instrumentLayouts) {
    instrumentMap.set(layout.instrument.tag, layout);
  }

  for (const line of lines) {
    const fromEquip = line.from ? equipmentMap.get(line.from.equipment) : null;
    const fromInst = line.from ? instrumentMap.get(line.from.equipment) : null;
    const toEquip = line.to ? equipmentMap.get(line.to.equipment) : null;
    const toInst = line.to ? instrumentMap.get(line.to.equipment) : null;

    const from = fromEquip || fromInst;
    const to = toEquip || toInst;

    if (!from || !to) {
      warnings.push(
        `Could not find equipment/instrument for line: ${line.from?.equipment} -> ${line.to?.equipment}`
      );
      continue;
    }

    // Get line class based on type
    const lineClass =
      line.type === PIDLineType.SIGNAL
        ? 'pid-line-signal'
        : line.type === PIDLineType.ELECTRICAL
          ? 'pid-line-electrical'
          : line.type === PIDLineType.UTILITY
            ? 'pid-line-utility'
            : line.type === PIDLineType.PNEUMATIC
              ? 'pid-line-pneumatic'
              : line.type === PIDLineType.HYDRAULIC
                ? 'pid-line-hydraulic'
                : line.type === PIDLineType.DATA
                  ? 'pid-line-data'
                  : 'pid-line';

    // Simple straight line for now (can be enhanced with orthogonal routing)
    svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" class="${lineClass}"/>`;

    // Add line size annotation for process lines
    if (
      line.type === PIDLineType.PROCESS &&
      typeof line.properties?.size === 'number'
    ) {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      svg += `<text class="pid-property" x="${midX}" y="${midY - 5}">${line.properties.size}"</text>`;
    }
  }

  svg += '</g>';
  return svg;
}

/**
 * Render control loop annotations
 */
function renderLoops(
  loops: PIDLoop[],
  instrumentLayouts: InstrumentLayout[]
): string {
  let svg = '<g class="pid-loops-group">';

  // Build instrument map
  const instrumentMap = new Map<string, InstrumentLayout>();
  for (const layout of instrumentLayouts) {
    instrumentMap.set(layout.instrument.tag, layout);
  }

  for (const loop of loops) {
    const controller = loop.controller
      ? instrumentMap.get(loop.controller)
      : undefined;
    if (controller) {
      svg += `<text class="pid-loop" x="${controller.x}" y="${controller.y + 40}">Loop ${loop.id}</text>`;
      svg += `<text class="pid-property" x="${controller.x}" y="${controller.y + 52}">${loop.controlledVariable}: ${loop.setpoint} ${loop.unit || ''}</text>`;
    }
  }

  svg += '</g>';
  return svg;
}
