// ============================================================================
// ISO 1219-2 Hydraulic Symbols
// ============================================================================

import { createSymbol } from './symbol.ts';

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
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Solid triangle (fixed displacement indicator) -->
      <polygon points="${cx - radius + 3},${cy - 12} ${cx - radius + 3},${cy + 12} ${cx - radius - 5},${cy}" 
        fill="currentColor"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
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
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Diagonal line (variable displacement indicator) -->
      <line x1="${cx - radius + 3}" y1="${cy + 10}" x2="${cx - radius - 5}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Hydraulic Motor
 * ISO 1219-2 standard motor symbol
 */
export const motorHydraulic = createSymbol(
  'MOTOR_HYD',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
    { x: 25, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}" 
        stroke="currentColor" stroke-width="3"/>
      <text x="${cx + 12}" y="${cy - radius - 5}" font-size="7" fill="currentColor">shaft</text>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Hydraulic Cylinder (double-acting)
 * ISO 1219-2 standard cylinder symbol (thicker lines than pneumatic)
 */
export const cylinderHydraulic = createSymbol(
  'CYL_HYD',
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
      <!-- Cylinder body (thicker lines for hydraulic) -->
      <rect x="${left + 10}" y="${top}" width="40" height="20" 
        stroke="currentColor" stroke-width="2.5" fill="none"/>
      
      <!-- piston rod line -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      
      <!-- Port A circle (left) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>
      
      <!-- Port B circle (right) -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * 4/3-Way Valve (4 ports, 3 positions)
 * ISO 1219-2 standard directional control valve
 */
export const valve43Way = createSymbol(
  'VALVE_43',
  70,
  50,
  [
    { x: 15, y: 50, name: 'P' },
    { x: 30, y: 50, name: 'A' },
    { x: 45, y: 50, name: 'B' },
    { x: 60, y: 50, name: 'T' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 10}" width="22" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 2 box (center) -->
      <rect x="${left + 22}" y="${top + 10}" width="22" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 3 box (right) -->
      <rect x="${left + 44}" y="${top + 10}" width="22" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Flow indicators in center position (closed center shown) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 20}" y1="${bottom}" x2="${left + 20}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right - 20}" y1="${bottom}" x2="${right - 20}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right - 5}" y1="${bottom}" x2="${right - 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pressure Relief Valve
 * ISO 1219-2 standard safety valve
 */
export const pressureReliefValve = createSymbol(
  'RELIEF_VALVE',
  40,
  50,
  [
    { x: 20, y: 50, name: 'in' },
    { x: 20, y: 0, name: 'tank' },
  ],
  (cx, cy) => {
    return `
      <!-- Valve body (angled line with ball) -->
      <line x1="${cx - 8}" y1="${cy + 10}" x2="${cx + 8}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${cx - 5}" cy="${cy + 5}" r="3" fill="currentColor"/>
      
      <!-- spring above -->
      <path d="M ${cx},${cy - 10} l 0,-3 l -2,-2 l 4,-2 l -4,-2 l 4,-2 l -2,-2 l 0,-3" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx - 12}" y="${cy - 18}" font-size="7" fill="currentColor">spring</text>
      
      <!-- Flow path to tank -->
      <path d="M ${cx + 8},${cy - 10} L ${cx + 8},${cy - 20} L ${cx},${cy - 20}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Connection lines -->
      <line x1="${cx}" y1="${cy + 15}" x2="${cx}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${cy - 25}" x2="${cx}" y2="${cy - 20}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Pressure Reducing Valve
 * ISO 1219-2 standard reducing valve
 */
export const pressureReducingValve = createSymbol(
  'REDUCING_VALVE',
  40,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 40, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    return `
      <!-- Valve body -->
      <line x1="${cx - 10}" y1="${cy + 10}" x2="${cx + 10}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${cx - 5}" cy="${cy + 5}" r="3" fill="currentColor"/>
      
      <!-- spring with pilot line -->
      <path d="M ${cx + 5},${cy - 5} l 3,-3 l -1,-2 l 2,-2 l -2,-2 l 2,-2 l -1,-2 l 0,-2" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx + 10}" y="${cy - 16}" font-size="7" fill="currentColor">spring</text>
      
      <!-- pilot control line -->
      <line x1="${cx + 10}" y1="${cy - 5}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="${cx + 13}" y="${cy + 8}" font-size="6" fill="currentColor">pilot</text>
      
      <!-- Connection lines -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - 10}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + 10}" y1="${cy - 10}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Flow Control Valve (hydraulic)
 * ISO 1219-2 standard flow control
 */
export const flowControlHydraulic = createSymbol(
  'FLOW_CONTROL_HYD',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Square body (hydraulic uses square instead of diamond) -->
      <rect x="${cx - size}" y="${cy - size}" width="${size * 2}" height="${size * 2}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Adjustable arrow through center -->
      <path d="M ${cx - 10},${cy} L ${cx + 10},${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${cx + 7},${cy - 3} L ${cx + 10},${cy} L ${cx + 7},${cy + 3}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      
      <!-- Adjustment indicator -->
      <line x1="${cx - 8}" y1="${cy - size - 5}" x2="${cx + 8}" y2="${cy - size + 5}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Check Valve (hydraulic with spring preload)
 * ISO 1219-2 standard check valve
 */
export const checkValveHydraulic = createSymbol(
  'CHECK_VALVE_HYD',
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
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Ball (small circle inside) -->
      <circle cx="${cx - 3}" cy="${cy}" r="4" fill="currentColor"/>
      
      <!-- Seat (triangle) -->
      <polygon points="${cx + 3},${cy - 6} ${cx + 8},${cy} ${cx + 3},${cy + 6}" 
        fill="none" stroke="currentColor" stroke-width="2"/>
      
      <!-- spring preload indicator -->
      <path d="M ${cx - 7},${cy} l -2,0 l -1,-1 l 2,-1 l -2,-1 l 1,-1 l 2,0" 
        stroke="currentColor" stroke-width="1" fill="none"/>
      <text x="${cx - 12}" y="${cy - 8}" font-size="6" fill="currentColor">spring</text>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 8}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
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
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
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
      <rect x="${left}" y="${top + 5}" width="${width}" height="${height - 5}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- fluid level line -->
      <line x1="${left + 5}" y1="${cy}" x2="${left + width - 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="${cx}" y="${cy - 3}" font-size="7" text-anchor="middle" fill="currentColor">fluid level</text>
      
      <!-- Vent line at top -->
      <line x1="${cx}" y1="${top + 5}" x2="${cx}" y2="${top - 5}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Return connection (left) -->
      <line x1="${left + 5}" y1="${top + height}" x2="${left + 5}" y2="${top + height + 5}" 
        stroke="currentColor" stroke-width="2.5"/>
      
      <!-- Suction connection (right) -->
      <line x1="${left + width - 5}" y1="${top + height}" x2="${left + width - 5}" y2="${top + height + 5}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Accumulator (gas-charged)
 * ISO 1219-2 standard accumulator symbol
 */
export const accumulator = createSymbol(
  'ACCUMULATOR',
  40,
  50,
  [{ x: 20, y: 50, name: 'in' }],
  (cx, cy) => {
    const width = 30;
    const height = 40;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Cylinder body -->
      <rect x="${left}" y="${top}" width="${width}" height="${height}" 
        stroke="currentColor" stroke-width="2.5" fill="white" rx="3"/>
      
      <!-- Dividing line (piston or bladder) -->
      <line x1="${left}" y1="${cy}" x2="${left + width}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Gas symbol above line (N2) -->
      <text x="${cx}" y="${cy - 8}" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="currentColor">N2</text>
      
      <!-- Connection at bottom -->
      <line x1="${cx}" y1="${top + height}" x2="${cx}" y2="${top + height + 5}" 
        stroke="currentColor" stroke-width="2.5"/>
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
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- P label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="currentColor">P</text>
      
      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 3}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);
