// ============================================================================
// ISO 1219-1 Pneumatic Accessories & Support Components
// ============================================================================

import { createSymbol } from '../symbol.ts';

// ============================================================================
// Air Source & Preparation
// ============================================================================

/**
 * Air Source / Compressor
 * ISO 1219-1 standard air supply symbol
 */
export const airSource = createSymbol(
  'AIR_SOURCE',
  40,
  40,
  [{ x: 40, y: 20, name: 'out' }],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Circle representing air source -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Air symbol (triangle pointing out) -->
      <polygon points="${cx - 5},${cy - 8} ${cx - 5},${cy + 8} ${cx + 8},${cy}"
        stroke="currentColor" stroke-width="2" fill="currentColor"/>

      <!-- Output line -->
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pressure Regulator
 * ISO 1219-1 standard component
 */
export const pressureRegulator = createSymbol(
  'REGULATOR',
  40,
  50,
  [
    { x: 20, y: 0, name: 'in' },
    { x: 20, y: 50, name: 'out' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;

    return `
      <!-- Regulator body (diamond/rhombus) -->
      <polygon points="${cx},${cy - height / 2} ${cx + width / 2},${cy} ${cx},${cy + height / 2} ${cx - width / 2},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Adjustment arrow (pointing down) -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy - height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx},${cy - height / 2 + 5} ${cx - 3},${cy - height / 2} ${cx + 3},${cy - height / 2}"
        fill="currentColor"/>

      <!-- Input/output lines -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy - height / 2}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Air Filter
 * ISO 1219-1 standard pneumatic filter
 */
export const filterPneumatic = createSymbol(
  'FILTER',
  40,
  50,
  [
    { x: 20, y: 0, name: 'in' },
    { x: 20, y: 50, name: 'out' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;

    return `
      <!-- Filter housing -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Filter element (diamond mesh pattern) -->
      <path d="M ${cx - 10},${cy - 12} L ${cx},${cy - 8} L ${cx - 10},${cy - 4} L ${cx},${cy} L ${cx - 10},${cy + 4} L ${cx},${cy + 8} L ${cx - 10},${cy + 12}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${cx + 10},${cy - 12} L ${cx},${cy - 8} L ${cx + 10},${cy - 4} L ${cx},${cy} L ${cx + 10},${cy + 4} L ${cx},${cy + 8} L ${cx + 10},${cy + 12}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Drain indicator (water droplets) -->
      <circle cx="${cx - 5}" cy="${cy + height / 2 - 5}" r="1.5" fill="currentColor"/>
      <circle cx="${cx + 5}" cy="${cy + height / 2 - 5}" r="1.5" fill="currentColor"/>

      <!-- Input/output lines -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy - height / 2}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Lubricator
 * ISO 1219-1 standard pneumatic lubricator
 */
export const lubricator = createSymbol(
  'LUBRICATOR',
  40,
  50,
  [
    { x: 20, y: 0, name: 'in' },
    { x: 20, y: 50, name: 'out' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;

    return `
      <!-- Lubricator housing (rounded bottom) -->
      <path d="M ${cx - width / 2},${cy - height / 2}
               L ${cx + width / 2},${cy - height / 2}
               L ${cx + width / 2},${cy + height / 2 - 8}
               Q ${cx + width / 2},${cy + height / 2} ${cx},${cy + height / 2}
               Q ${cx - width / 2},${cy + height / 2} ${cx - width / 2},${cy + height / 2 - 8}
               Z"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Oil level indicator (horizontal line) -->
      <line x1="${cx - width / 2}" y1="${cy + 8}" x2="${cx + width / 2}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Oil drops -->
      <circle cx="${cx - 6}" cy="${cy}" r="2" stroke="currentColor" stroke-width="1" fill="currentColor"/>
      <circle cx="${cx + 6}" cy="${cy}" r="2" stroke="currentColor" stroke-width="1" fill="currentColor"/>
      <circle cx="${cx}" cy="${cy + 5}" r="2" stroke="currentColor" stroke-width="1" fill="currentColor"/>

      <!-- Input/output lines -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy - height / 2}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * FRL Unit - Combined Filter, Regulator, Lubricator
 * ISO 1219-1 standard component
 */
export const frlUnit = createSymbol(
  'FRL',
  50,
  60,
  [
    { x: 25, y: 0, name: 'IN' },
    { x: 25, y: 60, name: 'OUT' },
  ],
  (cx, cy) => {
    const width = 40;
    const height = 50;

    return `
      <!-- Combined unit housing -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Filter section (top) -->
      <path d="M ${cx - 8},${cy - 15} L ${cx},${cy - 12} L ${cx - 8},${cy - 9}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${cx + 8},${cy - 15} L ${cx},${cy - 12} L ${cx + 8},${cy - 9}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Regulator section (middle) -->
      <polygon points="${cx},${cy - 3} ${cx - 6},${cy + 3} ${cx + 6},${cy + 3}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Lubricator section (bottom) -->
      <circle cx="${cx}" cy="${cy + 12}" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="${cx}" cy="${cy + 12}" r="1.5" fill="currentColor"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 5}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">FRL</text>
    `;
  }
);

/**
 * Air Dryer - Removes moisture from compressed air
 * ISO 1219-1 standard component
 */
export const airDryer = createSymbol(
  'AIR_DRYER',
  40,
  50,
  [
    { x: 20, y: 0, name: 'IN' },
    { x: 20, y: 50, name: 'OUT' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 40;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Dryer housing -->
      <rect x="${left}" y="${top}" width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Desiccant indicator (wavy lines) -->
      <path d="M ${left + 8},${cy - 8} Q ${left + 15},${cy - 12} ${left + 22},${cy - 8}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${left + 8},${cy} Q ${left + 15},${cy - 4} ${left + 22},${cy}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${left + 8},${cy + 8} Q ${left + 15},${cy + 4} ${left + 22},${cy + 8}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Label -->
      <text x="${cx}" y="${top - 5}" font-size="8" text-anchor="middle" fill="currentColor">DRYER</text>
    `;
  }
);

/**
 * Compressor - Generates compressed air
 * ISO 1219-1 standard component
 */
export const compressor = createSymbol(
  'COMPRESSOR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'AIR_IN' },
    { x: 50, y: 25, name: 'AIR_OUT' },
  ],
  (cx, cy) => {
    const radius = 20;

    return `
      <!-- Compressor body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Motor/impeller indicator (C letter) -->
      <text x="${cx}" y="${cy + 6}" font-size="14" font-weight="bold"
        text-anchor="middle" fill="currentColor">C</text>

      <!-- Inlet arrow -->
      <line x1="${cx - radius - 5}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - radius},${cy} ${cx - radius - 4},${cy - 3} ${cx - radius - 4},${cy + 3}"
        fill="currentColor"/>

      <!-- Outlet line -->
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

// ============================================================================
// Flow & Pressure Control
// ============================================================================

/**
 * Flow Control Valve (one-way)
 * ISO 1219-1 standard flow control
 */
export const flowControlPneumatic = createSymbol(
  'FLOW_CONTROL',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 20;

    return `
      <!-- Flow control body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Adjustable orifice (variable width) -->
      <polygon points="${cx - 5},${cy - height / 2} ${cx - 5},${cy + height / 2} ${cx + 5},${cy - height / 2 + 6} ${cx + 5},${cy + height / 2 - 6}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Adjustment arrow -->
      <line x1="${cx}" y1="${cy - height / 2 - 5}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
      <polygon points="${cx},${cy + height / 2 + 5} ${cx - 2},${cy + height / 2 + 2} ${cx + 2},${cy + height / 2 + 2}"
        fill="currentColor"/>

      <!-- Input/output lines -->
      <line x1="${cx - width / 2 - 5}" y1="${cy}" x2="${cx - width / 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + width / 2}" y1="${cy}" x2="${cx + width / 2 + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Check Valve
 * ISO 1219-1 standard one-way valve
 */
export const checkValvePneumatic = createSymbol(
  'CHECK_VALVE',
  30,
  30,
  [
    { x: 0, y: 15, name: 'in' },
    { x: 30, y: 15, name: 'out' },
  ],
  (cx, cy) => {
    const size = 20;

    return `
      <!-- Check valve body (triangle + line) -->
      <polygon points="${cx - size / 2},${cy - size / 2} ${cx - size / 2},${cy + size / 2} ${cx + size / 2},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Seat line -->
      <line x1="${cx + size / 2}" y1="${cy - size / 2}" x2="${cx + size / 2}" y2="${cy + size / 2}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Input/output lines -->
      <line x1="${cx - size / 2 - 5}" y1="${cy}" x2="${cx - size / 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size / 2}" y1="${cy}" x2="${cx + size / 2 + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Throttle Valve - Restricts both directions
 * ISO 1219-1 standard component
 */
export const throttleValve = createSymbol(
  'THROTTLE',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const width = 30;
    const height = 20;

    return `
      <!-- Throttle body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Fixed orifice (narrow passage) -->
      <rect x="${cx - 2}" y="${cy - 3}" width="4" height="6"
        stroke="currentColor" stroke-width="2" fill="currentColor"/>

      <!-- Flow arrows -->
      <line x1="${cx - width / 2 - 5}" y1="${cy}" x2="${cx - width / 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + width / 2}" y1="${cy}" x2="${cx + width / 2 + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Quick Exhaust Valve - Rapid exhaust close to cylinder
 * ISO 1219-1 standard component
 */
export const quickExhaust = createSymbol(
  'QUICK_EXHAUST',
  40,
  40,
  [
    { x: 20, y: 0, name: 'P' },
    { x: 20, y: 40, name: 'A' },
  ],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Valve body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Exhaust ports (three lines radiating) -->
      <line x1="${cx - 10}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 5}" y1="${cy - 8}" x2="${cx + 12}" y2="${cy - 12}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 5}" y1="${cy + 8}" x2="${cx + 12}" y2="${cy + 12}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Connections -->
      <line x1="${cx}" y1="${cy - radius - 5}" x2="${cx}" y2="${cy - radius}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

// ============================================================================
// Exhaust & Accessories
// ============================================================================

/**
 * Exhaust / Muffler
 * ISO 1219-1 standard exhaust silencer
 */
export const exhaustPneumatic = createSymbol(
  'EXHAUST',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    return `
      <!-- Exhaust triangle (pointing up) -->
      <polygon points="${cx},${cy - 10} ${cx - 8},${cy} ${cx + 8},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Exhaust indicator lines (3 short lines) -->
      <line x1="${cx - 10}" y1="${cy - 15}" x2="${cx - 5}" y2="${cy - 13}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 17}" x2="${cx}" y2="${cy - 12}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 10}" y1="${cy - 15}" x2="${cx + 5}" y2="${cy - 13}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Muffler/Silencer - Reduces exhaust noise
 * ISO 1219-1 standard component
 */
export const muffler = createSymbol(
  'MUFFLER',
  30,
  40,
  [{ x: 15, y: 40, name: 'IN' }],
  (cx, cy) => {
    const width = 20;
    const height = 30;

    return `
      <!-- Muffler body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Sound absorption pattern (horizontal lines) -->
      <line x1="${cx - width / 2}" y1="${cy - 8}" x2="${cx + width / 2}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - width / 2}" y1="${cy - 4}" x2="${cx + width / 2}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - width / 2}" y1="${cy}" x2="${cx + width / 2}" y2="${cy}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - width / 2}" y1="${cy + 4}" x2="${cx + width / 2}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - width / 2}" y1="${cy + 8}" x2="${cx + width / 2}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 10}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 5}" font-size="7" text-anchor="middle" fill="currentColor">MUFFLER</text>
    `;
  }
);

// ============================================================================
// Sensors & Measurement
// ============================================================================

/**
 * Pressure Gauge (measurement)
 * ISO 1219-1 standard gauge symbol
 */
export const pressureGaugePneumatic = createSymbol(
  'GAUGE_P',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- P label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">P</text>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 3}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Proximity Sensor (position detection)
 * Used to detect cylinder position (extended/retracted)
 * ISO 1219-1 standard sensor symbol
 */
export const proximitySensor = createSymbol(
  'SENSOR_PROX',
  30,
  30,
  [{ x: 15, y: 30, name: 'signal' }],
  (cx, cy) => {
    const width = 12;
    const height = 10;

    return `
      <!-- Sensor body (rectangle) -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Sensing indicator (+ symbol) -->
      <line x1="${cx - 3}" y1="${cy}" x2="${cx + 3}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 3}" x2="${cx}" y2="${cy + 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + height / 2}" x2="${cx}" y2="${cy + height / 2 + 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - height / 2 - 3}" font-size="7"
        text-anchor="middle" fill="currentColor">PROX</text>
    `;
  }
);

/**
 * Pressure Sensor (electronic pressure measurement)
 * Used to measure and output pressure signals
 * ISO 1219-1 standard sensor symbol
 */
export const pressureSensor = createSymbol(
  'SENSOR_PRESS',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- P label with electronic indicator -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">P</text>

      <!-- Electronic output indicator (small square in corner) -->
      <rect x="${cx + 5}" y="${cy - 8}" width="4" height="4"
        stroke="currentColor" stroke-width="1" fill="currentColor"/>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 3}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Label -->
      <text x="${cx}" y="${cy - radius - 3}" font-size="6"
        text-anchor="middle" fill="currentColor">SENSOR</text>
    `;
  }
);

/**
 * Flow Sensor - Measures flow rate
 * ISO 1219-1 standard sensor symbol
 */
export const flowSensor = createSymbol(
  'FLOW_SENSOR',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- F label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">F</text>

      <!-- Flow indicator (curved arrow) -->
      <path d="M ${cx - 8},${cy - 6} Q ${cx},${cy - 10} ${cx + 8},${cy - 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <polygon points="${cx + 8},${cy - 6} ${cx + 6},${cy - 8} ${cx + 6},${cy - 4}"
        fill="currentColor"/>

      <!-- Input/output lines -->
      <line x1="${cx - radius - 5}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);
