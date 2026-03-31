// ============================================================================
// ISO 1219-2 Hydraulic Symbols - Pumps & Accessories
// ============================================================================
// REFACTORED: Now using symbol-utils.ts for common rendering patterns
// Reduction: 714 lines → 433 lines (39% reduction)

import { Position } from '@runiq/core';
import { createSymbol } from '../symbol.ts';
import {
  renderCircleBody,
  renderHorizontalConnectionLines,
  renderClockwiseArrow,
  renderFixedDisplacementIndicator,
  renderVariableDisplacementIndicator,
  renderGearTeeth,
  renderConnectionLine,
  renderRectangleBody,
  renderLabel,
} from '../symbol-utils.ts';

/**
 * Hydraulic Pump - Fixed Displacement
 * ISO 1219-2 standard pump symbol
 */
export const pumpFixed = createSymbol(
  'PUMP_FIXED',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}
      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Variable Displacement
 * ISO 1219-2 standard variable pump symbol
 */
export const pumpVariable = createSymbol(
  'PUMP_VAR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
    { x: 25, y: 0, name: 'control' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}
      ${renderVariableDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
      ${renderConnectionLine(cx, cy - radius, cx, cy - radius - 7, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Hydraulic Pump - Gear Type
 * ISO 1219-2 gear pump with gear teeth indicator
 */
export const pumpGear = createSymbol(
  'PUMP_GEAR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}
      ${renderGearTeeth(cx, cy, radius)}
      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Vane Type
 * ISO 1219-2 vane pump with vane blades indicator
 */
export const pumpVane = createSymbol(
  'PUMP_VANE',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Vane blades (radial lines) -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 7}" y1="${cy - 7}" x2="${cx + 7}" y2="${cy + 7}" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 7}" y1="${cy + 7}" x2="${cx + 7}" y2="${cy - 7}" stroke="currentColor" stroke-width="1.5"/>

      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Axial Piston Type
 * ISO 1219-2 axial piston pump with angled pistons
 */
export const pumpPistonAxial = createSymbol(
  'PUMP_PISTON_AXIAL',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Axial pistons (angled lines representing piston arrangement) -->
      <line x1="${cx - 8}" y1="${cy}" x2="${cx - 2}" y2="${cy - 8}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + 6}" y2="${cy - 6}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy}" x2="${cx + 2}" y2="${cy + 8}" stroke="currentColor" stroke-width="2"/>

      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Radial Piston Type
 * ISO 1219-2 radial piston pump with radial pistons
 */
export const pumpPistonRadial = createSymbol(
  'PUMP_PISTON_RADIAL',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Radial pistons (lines radiating from center) -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 10}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + 10}" y2="${cy}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 10}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx - 10}" y2="${cy}" stroke="currentColor" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/>

      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Screw Type
 * ISO 1219-2 screw pump with helical indicator
 */
export const pumpScrew = createSymbol(
  'PUMP_SCREW',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Helical screw indicator (wavy line) -->
      <path d="M ${cx - 10},${cy - 6} Q ${cx - 5},${cy - 10} ${cx},${cy - 6} Q ${cx + 5},${cy - 2} ${cx + 10},${cy - 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${cx - 10},${cy + 6} Q ${cx - 5},${cy + 2} ${cx},${cy + 6} Q ${cx + 5},${cy + 10} ${cx + 10},${cy + 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Hand Pump
 * ISO 1219-2 manual hand pump with lever
 */
export const pumpHand = createSymbol(
  'PUMP_HAND',
  50,
  60,
  [
    { x: 0, y: 30, name: 'in' },
    { x: 50, y: 30, name: 'out' },
    { x: 25, y: 0, name: 'lever' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Hand lever extending from top -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 12}"
        stroke="currentColor" stroke-width="3"/>
      <line x1="${cx}" y1="${cy - radius - 12}" x2="${cx + 10}" y2="${cy - radius - 12}"
        stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx + 10}" cy="${cy - radius - 12}" r="3" fill="currentColor"/>

      ${renderFixedDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
    `;
  }
);

/**
 * Hydraulic Pump - Variable Piston Type
 * ISO 1219-2 variable displacement piston pump
 */
export const pumpPistonVariable = createSymbol(
  'PUMP_PISTON_VAR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
    { x: 25, y: 0, name: 'control' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderClockwiseArrow(cx, cy)}

      <!-- Axial pistons (angled lines) -->
      <line x1="${cx - 8}" y1="${cy}" x2="${cx - 2}" y2="${cy - 8}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + 6}" y2="${cy - 6}" stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy}" x2="${cx + 2}" y2="${cy + 8}" stroke="currentColor" stroke-width="2"/>

      ${renderVariableDisplacementIndicator(cx, cy, radius, Position.LEFT)}
      ${renderHorizontalConnectionLines(cx, cy, radius)}
      ${renderConnectionLine(cx, cy - radius, cx, cy - radius - 7, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Hydraulic Filter
 * ISO 1219-2 standard filter symbol (thicker lines than pneumatic)
 */
export const filterHydraulic = createSymbol(
  'FILTER_HYD',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Diamond shape (thicker lines) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Mesh pattern (diagonal lines) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1.5"/>

      ${renderConnectionLine(cx - size - 5, cy, cx - size, cy)}
      ${renderConnectionLine(cx + size, cy, cx + size + 5, cy)}
    `;
  }
);

/**
 * Hydraulic Reservoir/Tank
 * ISO 1219-2 standard reservoir symbol
 */
export const reservoir = createSymbol(
  'RESERVOIR',
  50,
  60,
  [
    { x: 10, y: 60, name: 'return' },
    { x: 40, y: 60, name: 'suction' },
    { x: 25, y: 0, name: 'vent' },
  ],
  (cx, cy) => {
    const width = 40;
    const height = 50;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Tank body (rectangle open at top) -->
      ${renderRectangleBody(cx, cy + 2.5, width, height - 5)}

      <!-- fluid level line -->
      <line x1="${left + 5}" y1="${cy}" x2="${left + width - 5}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
      ${renderLabel(cx, cy - 3, 'fluid level')}

      <!-- Vent line at top -->
      ${renderConnectionLine(cx, top + 5, cx, top - 5, { strokeWidth: 2 })}

      <!-- Return connection (left) -->
      ${renderConnectionLine(left + 5, top + height, left + 5, top + height + 5)}

      <!-- Suction connection (right) -->
      ${renderConnectionLine(left + width - 5, top + height, left + width - 5, top + height + 5)}
    `;
  }
);

/**
 * Pressure Gauge (hydraulic)
 * ISO 1219-2 standard gauge symbol
 */
export const pressureGaugeHydraulic = createSymbol(
  'GAUGE_P_HYD',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    const radius = 12;

    return `
      ${renderCircleBody(cx, cy, radius)}

      <!-- P label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">P</text>

      ${renderConnectionLine(cx, cy + radius, cx, cy + radius + 3)}
    `;
  }
);

/**
 * Pressure Compensated Flow Control
 * Maintains constant flow regardless of pressure
 */
export const flowCompensated = createSymbol(
  'FLOW_COMPENSATED',
  45,
  55,
  [
    { x: 22, y: 55, name: 'inlet' },
    { x: 22, y: 0, name: 'outlet' },
  ],
  (cx, cy) => {
    const boxWidth = 28;
    const boxHeight = 28;

    return `
      ${renderRectangleBody(cx, cy, boxWidth, boxHeight)}

      <!-- Fixed orifice (metering) -->
      <line x1="${cx - 4}" y1="${cy + 4}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + 8}" x2="${cx + 4}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Compensator spool -->
      <rect x="${cx - 6}" y="${cy - 8}" width="12" height="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Spring (pressure compensation) -->
      <path d="M ${cx - 3},${cy - 8} L ${cx + 3},${cy - 10} L ${cx - 3},${cy - 12}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - boxHeight / 2 + 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pressure sensing lines (dashed) -->
      <line x1="${cx + 8}" y1="${cy + 6}" x2="${cx + 8}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy + boxHeight / 2, cx, cy + boxHeight / 2 + 8)}
      ${renderConnectionLine(cx, cy - boxHeight / 2, cx, cy - boxHeight / 2 - 8)}
    `;
  }
);

/**
 * Temperature Compensated Flow Control
 * Compensates for viscosity changes with temperature
 */
export const flowTempCompensated = createSymbol(
  'FLOW_TEMP_COMP',
  45,
  60,
  [
    { x: 22, y: 60, name: 'inlet' },
    { x: 22, y: 0, name: 'outlet' },
  ],
  (cx, cy) => {
    const boxWidth = 28;
    const boxHeight = 30;
    const left = cx - boxWidth / 2;

    return `
      ${renderRectangleBody(cx, cy, boxWidth, boxHeight)}

      <!-- Fixed orifice -->
      <line x1="${cx - 4}" y1="${cy + 4}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + 8}" x2="${cx + 4}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Compensator element -->
      <rect x="${cx - 6}" y="${cy - 6}" width="12" height="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Temperature symbol (T in circle) -->
      <circle cx="${left + boxWidth + 8}" cy="${cy}" r="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <text x="${left + boxWidth + 8}" y="${cy + 3}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">T</text>

      <!-- Connection to temp sensor -->
      <line x1="${cx + 6}" y1="${cy - 3}" x2="${left + boxWidth + 2}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy + boxHeight / 2, cx, cy + boxHeight / 2 + 8)}
      ${renderConnectionLine(cx, cy - boxHeight / 2, cx, cy - boxHeight / 2 - 8)}
    `;
  }
);

/**
 * Priority Valve
 * Ensures critical circuit receives flow first
 */
export const priorityValve = createSymbol(
  'PRIORITY_VALVE',
  50,
  55,
  [
    { x: 25, y: 55, name: 'inlet' },
    { x: 0, y: 27, name: 'priority' },
    { x: 50, y: 27, name: 'excess' },
  ],
  (cx, cy) => {
    const boxWidth = 30;
    const boxHeight = 30;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      ${renderRectangleBody(cx, cy, boxWidth, boxHeight)}

      <!-- Priority orifice (left side, always open) -->
      <polygon points="${cx - 8},${cy - 4} ${cx - 4},${cy} ${cx - 8},${cy + 4}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <text x="${cx - 6}" y="${cy - 8}" font-size="7" font-weight="bold"
        text-anchor="middle" fill="currentColor">1</text>

      <!-- Excess flow spool (right side) -->
      <rect x="${cx + 2}" y="${cy - 5}" width="10" height="10"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Spring on excess spool -->
      <line x1="${cx + 7}" y1="${cy + 5}" x2="${cx + 7}" y2="${top + boxHeight - 3}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx + 4},${top + boxHeight - 5} L ${cx + 10},${top + boxHeight - 3}"
        stroke="currentColor" stroke-width="1" fill="none"/>

      ${renderConnectionLine(left, cy, left - 8, cy)}
      ${renderConnectionLine(left + boxWidth, cy, left + boxWidth + 8, cy)}
      ${renderConnectionLine(cx, top + boxHeight, cx, top + boxHeight + 8)}
    `;
  }
);

/**
 * Flow Divider
 * Splits flow equally to multiple circuits
 */
export const flowDivider = createSymbol(
  'FLOW_DIVIDER',
  50,
  55,
  [
    { x: 25, y: 55, name: 'inlet' },
    { x: 0, y: 10, name: 'outlet_a' },
    { x: 50, y: 10, name: 'outlet_b' },
  ],
  (cx, cy) => {
    const boxWidth = 32;
    const boxHeight = 32;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      ${renderRectangleBody(cx, cy, boxWidth, boxHeight)}

      <!-- Divider mechanism (gears symbol) -->
      <circle cx="${cx - 6}" cy="${cy}" r="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <circle cx="${cx + 6}" cy="${cy}" r="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Gear teeth indication -->
      <line x1="${cx - 6}" y1="${cy - 6}" x2="${cx - 6}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 6}" y1="${cy - 6}" x2="${cx + 6}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Connection between gears -->
      <line x1="${cx}" y1="${cy - 3}" x2="${cx}" y2="${cy + 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Flow paths -->
      <line x1="${cx - 6}" y1="${cy - 6}" x2="${cx - 10}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 6}" y1="${cy - 6}" x2="${cx + 10}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2"/>

      ${renderConnectionLine(left, cy - 10, left - 8, cy - 10)}
      ${renderConnectionLine(left + boxWidth, cy - 10, left + boxWidth + 8, cy - 10)}
      ${renderConnectionLine(cx, top + boxHeight, cx, top + boxHeight + 8)}
    `;
  }
);
