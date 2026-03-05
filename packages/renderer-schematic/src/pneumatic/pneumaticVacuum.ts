// ============================================================================
// ISO 1219-1 Pneumatic Vacuum Components
// ============================================================================

import { createSymbol } from '../symbol.ts';
import { renderCircleBody, renderConnectionLine } from '../symbol-utils.ts';

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
      ${renderConnectionLine(cx, cy - height / 2 - 8, cx, cy - height / 2 - 13, { strokeWidth: 2 })}

      <!-- Air inlet -->
      ${renderConnectionLine(cx - width / 2 - 5, cy, cx - width / 2, cy, { strokeWidth: 2 })}

      <!-- Exhaust outlet -->
      ${renderConnectionLine(cx + width / 2, cy, cx + width / 2 + 5, cy, { strokeWidth: 2 })}

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
      ${renderCircleBody(cx, cy, radius, { strokeWidth: 2 })}

      <!-- V label -->
      <text x="${cx}" y="${cy + 6}" font-size="14" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>

      <!-- Vacuum indicator (minus sign) -->
      ${renderConnectionLine(cx - 8, cy - 8, cx + 8, cy - 8, { strokeWidth: 2 })}

      <!-- Output line -->
      ${renderConnectionLine(cx + radius, cy, cx + radius + 5, cy, { strokeWidth: 2 })}

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
      ${renderConnectionLine(cx - 8, cy - 5, cx + 8, cy - 5, { strokeWidth: 1.5 })}
      ${renderConnectionLine(cx - 8, cy + 5, cx + 8, cy + 5, { strokeWidth: 1.5 })}

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
      ${renderConnectionLine(cx, cy - radius - 10, cx, cy - radius - 15, { strokeWidth: 2 })}
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
      ${renderConnectionLine(cx - 6, cy + height / 2 - 5, cx + 6, cy + height / 2 - 5, { strokeWidth: 1.5 })}

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
      ${renderCircleBody(cx, cy, radius, { strokeWidth: 2 })}

      <!-- Switch symbol (lever) -->
      ${renderConnectionLine(cx - 6, cy, cx + 2, cy - 6, { strokeWidth: 2 })}
      <circle cx="${cx + 2}" cy="${cy - 6}" r="2" fill="currentColor"/>

      <!-- V label with minus -->
      <text x="${cx}" y="${cy + 10}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>
      ${renderConnectionLine(cx - 4, cy - 6, cx + 4, cy - 6, { strokeWidth: 1 })}

      <!-- Connections -->
      ${renderConnectionLine(cx, cy + radius, cx, cy + radius + 8, { strokeWidth: 2 })}
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
      ${renderCircleBody(cx, cy - 5, 5, { strokeWidth: 2 })}

      <!-- Blow-off indicator (burst arrows) -->
      ${renderConnectionLine(cx - 8, cy + 8, cx - 12, cy + 12, { strokeWidth: 2 })}
      <polygon points="${cx - 12},${cy + 12} ${cx - 10},${cy + 10} ${cx - 14},${cy + 10}"
        fill="currentColor"/>
      ${renderConnectionLine(cx + 8, cy + 8, cx + 12, cy + 12, { strokeWidth: 2 })}
      <polygon points="${cx + 12},${cy + 12} ${cx + 10},${cy + 10} ${cx + 14},${cy + 10}"
        fill="currentColor"/>

      <!-- Connections -->
      ${renderConnectionLine(cx, cy - height / 2 - 5, cx, cy - height / 2, { strokeWidth: 2 })}
      ${renderConnectionLine(cx, cy + height / 2, cx, cy + height / 2 + 5, { strokeWidth: 2 })}

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 8}" font-size="7" text-anchor="middle" fill="currentColor">BLOW-OFF</text>
    `;
  }
);
