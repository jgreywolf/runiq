// ============================================================================
// ISO 1219-1 Pneumatic Symbols
// ============================================================================

import { createSymbol } from './symbol.ts';

/**
 * Single-Acting Cylinder (spring return)
 * ISO 1219-1 standard pneumatic cylinder
 */
export const cylinderSingleActing = createSymbol(
  'CYL_SA',
  60,
  30,
  [
    { x: 0, y: 15, name: 'piston' },
    { x: 30, y: 30, name: 'port_A' },
    { x: 50, y: 30, name: 'exhaust' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 15;
    const bottom = cy + 15;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top}" width="40" height="20" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      
      <!-- piston rod line -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Port A circle -->
      <circle cx="${cx}" cy="${bottom}" r="2" fill="currentColor"/>
      
      <!-- Exhaust port circle -->
      <circle cx="${cx + 20}" cy="${bottom}" r="2" fill="currentColor"/>
      
      <!-- spring return indicator (zigzag) -->
      <path d="M ${left + 45},${top + 5} l 2,-2 l 2,4 l 2,-4 l 2,4 l 2,-4 l 2,2" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx}" y="${cy - 5}" font-size="8" text-anchor="middle" fill="currentColor">spring</text>
    `;
  }
);

/**
 * Double-Acting Cylinder (no spring)
 * ISO 1219-1 standard pneumatic cylinder
 */
export const cylinderDoubleActing = createSymbol(
  'CYL_DA',
  60,
  30,
  [
    { x: 0, y: 15, name: 'piston' },
    { x: 20, y: 30, name: 'port_A' },
    { x: 40, y: 30, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 15;
    const bottom = cy + 15;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top}" width="40" height="20" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      
      <!-- piston rod line -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Port A circle (left) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2" fill="currentColor"/>
      
      <!-- Port B circle (right) -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 3/2-Way Valve (3 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve32Way = createSymbol(
  'VALVE_32',
  40,
  50,
  [
    { x: 10, y: 50, name: 'P' },
    { x: 20, y: 50, name: 'A' },
    { x: 30, y: 50, name: 'R' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const right = cx + 20;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 10}" width="18" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 2 box (right) -->
      <rect x="${left + 18}" y="${top + 10}" width="18" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Flow arrows in position 1 -->
      <path d="M ${left + 5},${cy} L ${left + 13},${cy}" 
        stroke="currentColor" stroke-width="1.5" marker-end="url(#arrow)"/>
      
      <!-- Port connections -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 5}" y1="${bottom}" x2="${right - 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * 5/2-Way Valve (5 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve52Way = createSymbol(
  'VALVE_52',
  60,
  50,
  [
    { x: 15, y: 50, name: 'P' },
    { x: 25, y: 50, name: 'A' },
    { x: 35, y: 50, name: 'B' },
    { x: 45, y: 50, name: 'R' },
    { x: 55, y: 50, name: 'S' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 10}" width="28" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 2 box (right) -->
      <rect x="${left + 28}" y="${top + 10}" width="28" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Flow arrows in position 1 -->
      <path d="M ${left + 8},${cy} L ${left + 20},${cy}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 15}" y1="${bottom}" x2="${left + 15}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 15}" y1="${bottom}" x2="${right - 15}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 5}" y1="${bottom}" x2="${right - 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * Air Source (compressed air supply)
 * ISO 1219-1 standard pressure source symbol
 */
export const airSource = createSymbol(
  'AIR_SOURCE',
  40,
  40,
  [{ x: 20, y: 40, name: 'out' }],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- pressure triangle (pointing down) -->
      <polygon points="${cx},${cy - 5} ${cx - 6},${cy + 5} ${cx + 6},${cy + 5}" 
        fill="currentColor"/>
      
      <!-- Output connection -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 5}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pressure Regulator (adjustable)
 * ISO 1219-1 standard pressure control
 */
export const pressureRegulator = createSymbol(
  'REGULATOR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;

    return `
      <!-- Flow path -->
      <line x1="${left}" y1="${cy}" x2="${left + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right - 15}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Valve body -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- spring adjustment symbol (zigzag above) -->
      <path d="M ${cx},${cy - 10} l 0,-5 l -2,-2 l 4,-2 l -4,-2 l 4,-2 l -2,-2 l 0,-3" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx}" y="${cy - 28}" font-size="7" text-anchor="middle" fill="currentColor">spring</text>
      
      <!-- Adjustment arrow -->
      <path d="M ${cx - 5},${cy - 23} L ${cx},${cy - 25} L ${cx + 5},${cy - 23}" 
        stroke="currentColor" stroke-width="1" fill="none"/>
    `;
  }
);

/**
 * Pneumatic Filter
 * ISO 1219-1 standard filter symbol
 */
export const filterPneumatic = createSymbol(
  'FILTER',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Diamond shape -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Mesh pattern (diagonal lines) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="1"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Lubricator (adds oil mist to air)
 * ISO 1219-1 standard lubricator symbol
 */
export const lubricator = createSymbol(
  'LUBRICATOR',
  40,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 40, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Reservoir circle -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Oil droplet indicator (small circle with tube) -->
      <line x1="${cx}" y1="${cy - radius + 3}" x2="${cx}" y2="${cy - 3}" 
        stroke="currentColor" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy - radius + 1}" r="2" fill="currentColor"/>
      <text x="${cx}" y="${cy - radius - 5}" font-size="7" text-anchor="middle" fill="currentColor">droplet</text>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 8}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Flow Control Valve (adjustable restriction)
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
    const size = 15;

    return `
      <!-- Diamond shape -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Adjustable arrow through center -->
      <path d="M ${cx - 10},${cy} L ${cx + 10},${cy}" 
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx + 7},${cy - 3} L ${cx + 10},${cy} L ${cx + 7},${cy + 3}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Adjustment indicator (diagonal line) -->
      <line x1="${cx - 5}" y1="${cy - size - 5}" x2="${cx + 5}" y2="${cy - size + 5}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Check Valve (one-way valve)
 * ISO 1219-1 standard check valve
 */
export const checkValvePneumatic = createSymbol(
  'CHECK_VALVE',
  40,
  30,
  [
    { x: 0, y: 15, name: 'in' },
    { x: 40, y: 15, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Ball (small circle inside) -->
      <circle cx="${cx - 3}" cy="${cy}" r="4" fill="currentColor"/>
      
      <!-- Seat (triangle) -->
      <polygon points="${cx + 3},${cy - 6} ${cx + 8},${cy} ${cx + 3},${cy + 6}" 
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 8}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Exhaust (to atmosphere)
 * ISO 1219-1 standard exhaust symbol
 */
export const exhaustPneumatic = createSymbol(
  'EXHAUST',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    return `
      <!-- Triangle pointing outward -->
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
