// ============================================================================
// ISO 1219-1 Pneumatic Vacuum Components
// ============================================================================

import { createSymbol } from '../symbol.ts';

/**
 * Venturi Vacuum Generator - Creates vacuum from compressed air
 * ISO 1219-1 standard component
 */
export const vacuumGenerator = createSymbol(
  'VACUUM_GENERATOR',
  50,
  40,
  [
    { x: 10, y: 20, name: 'AIR_IN' },
    { x: 50, y: 20, name: 'EXHAUST' },
    { x: 25, y: 0, name: 'VACUUM_OUT' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 25;

    return `
      <!-- Venturi body (hourglass shape) -->
      <path d="M ${cx - width / 2},${cy - height / 2}
               L ${cx - 5},${cy}
               L ${cx - width / 2},${cy + height / 2}
               L ${cx + width / 2},${cy + height / 2}
               L ${cx + 5},${cy}
               L ${cx + width / 2},${cy - height / 2}
               Z"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum port (top) -->
      <rect x="${cx - 3}" y="${cy - height / 2 - 8}" width="6" height="8"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <line x1="${cx}" y1="${cy - height / 2 - 8}" x2="${cx}" y2="${cy - height / 2 - 13}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Air inlet -->
      <line x1="${cx - width / 2 - 5}" y1="${cy}" x2="${cx - width / 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Exhaust outlet -->
      <line x1="${cx + width / 2}" y1="${cy}" x2="${cx + width / 2 + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy + height / 2 + 12}" font-size="7" text-anchor="middle" fill="currentColor">VENTURI</text>
    `;
  }
);

/**
 * Vacuum Pump - Electric vacuum pump
 * ISO 1219-1 standard component
 */
export const vacuumPump = createSymbol(
  'VACUUM_PUMP',
  50,
  50,
  [{ x: 50, y: 25, name: 'VACUUM_OUT' }],
  (cx, cy) => {
    const radius = 20;

    return `
      <!-- Pump body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- V label -->
      <text x="${cx}" y="${cy + 6}" font-size="14" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>

      <!-- Vacuum indicator (minus sign) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Output line -->
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy + radius + 12}" font-size="7" text-anchor="middle" fill="currentColor">PUMP</text>
    `;
  }
);

/**
 * Vacuum Reservoir - Stores vacuum
 * ISO 1219-1 standard component
 */
export const vacuumReservoir = createSymbol(
  'VACUUM_RESERVOIR',
  40,
  50,
  [
    { x: 20, y: 0, name: 'IN' },
    { x: 20, y: 50, name: 'OUT' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;

    return `
      <!-- Tank body (rounded rectangle) -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}" rx="5"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum indicator (minus signs) -->
      <line x1="${cx - 8}" y1="${cy - 5}" x2="${cx + 8}" y2="${cy - 5}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 8}" y1="${cy + 5}" x2="${cx + 8}" y2="${cy + 5}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 5}" font-size="7" text-anchor="middle" fill="currentColor">VAC TANK</text>
    `;
  }
);

/**
 * Suction Cup - Vacuum gripper pad
 * ISO 1219-1 standard component
 */
export const suctionCup = createSymbol(
  'SUCTION_CUP',
  40,
  40,
  [{ x: 20, y: 0, name: 'vacuum_port' }],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Suction cup body (inverted dome) -->
      <path d="M ${cx - radius},${cy}
               Q ${cx - radius},${cy + radius} ${cx},${cy + radius}
               Q ${cx + radius},${cy + radius} ${cx + radius},${cy}
               L ${cx + radius - 5},${cy - 5}
               Q ${cx},${cy + radius - 10} ${cx - radius + 5},${cy - 5}
               Z"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum connection pipe -->
      <rect x="${cx - 3}" y="${cy - radius - 10}" width="6" height="10"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum indicator (V) -->
      <text x="${cx}" y="${cy + 6}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy - radius - 10}" x2="${cx}" y2="${cy - radius - 15}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Vacuum Filter - Protects generator from particles
 * ISO 1219-1 standard component
 */
export const vacuumFilter = createSymbol(
  'VACUUM_FILTER',
  40,
  50,
  [
    { x: 20, y: 0, name: 'IN' },
    { x: 20, y: 50, name: 'OUT' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;

    return `
      <!-- Filter housing -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Filter element (mesh pattern) -->
      <path d="M ${cx - 10},${cy - 10} L ${cx},${cy - 7} L ${cx - 10},${cy - 4}
               L ${cx},${cy} L ${cx - 10},${cy + 4} L ${cx},${cy + 7} L ${cx - 10},${cy + 10}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${cx + 10},${cy - 10} L ${cx},${cy - 7} L ${cx + 10},${cy - 4}
               L ${cx},${cy} L ${cx + 10},${cy + 4} L ${cx},${cy + 7} L ${cx + 10},${cy + 10}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Vacuum indicator (minus sign) -->
      <line x1="${cx - 6}" y1="${cy + height / 2 - 5}" x2="${cx + 6}" y2="${cy + height / 2 - 5}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 5}" font-size="7" text-anchor="middle" fill="currentColor">VAC FILTER</text>
    `;
  }
);

/**
 * Vacuum Switch - Confirms sufficient vacuum
 * ISO 1219-1 standard component
 */
export const vacuumSwitch = createSymbol(
  'VACUUM_SWITCH',
  30,
  40,
  [
    { x: 15, y: 40, name: 'IN' },
    { x: 15, y: 0, name: 'SIGNAL' },
  ],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Switch symbol (lever) -->
      <line x1="${cx - 6}" y1="${cy}" x2="${cx + 2}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="2"/>
      <circle cx="${cx + 2}" cy="${cy - 6}" r="2" fill="currentColor"/>

      <!-- V label with minus -->
      <text x="${cx}" y="${cy + 10}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>
      <line x1="${cx - 4}" y1="${cy - 6}" x2="${cx + 4}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Connections -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 8}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 8}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
    `;
  }
);

/**
 * Blow-Off Valve - Releases vacuum quickly
 * ISO 1219-1 standard component
 */
export const blowOffValve = createSymbol(
  'BLOW_OFF',
  40,
  50,
  [
    { x: 20, y: 0, name: 'VACUUM' },
    { x: 20, y: 50, name: 'EXHAUST' },
  ],
  (cx, cy) => {
    const width = 25;
    const height = 40;

    return `
      <!-- Valve body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Valve poppet (closed position) -->
      <circle cx="${cx}" cy="${cy - 5}" r="5"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Blow-off indicator (burst arrows) -->
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx - 12}" y2="${cy + 12}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 12},${cy + 12} ${cx - 10},${cy + 10} ${cx - 14},${cy + 10}"
        fill="currentColor"/>
      <line x1="${cx + 8}" y1="${cy + 8}" x2="${cx + 12}" y2="${cy + 12}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx + 12},${cy + 12} ${cx + 10},${cy + 10} ${cx + 14},${cy + 10}"
        fill="currentColor"/>

      <!-- Connections -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy - height / 2}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 8}" font-size="7" text-anchor="middle" fill="currentColor">BLOW-OFF</text>
    `;
  }
);
