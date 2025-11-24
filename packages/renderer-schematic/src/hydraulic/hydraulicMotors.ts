// ============================================================================
// ISO 1219-2 Hydraulic Symbols
// ============================================================================

import { createSymbol } from '../symbol.ts';

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
 * Gear Motor (fixed displacement)
 * ISO 1219-2 motor with gear teeth indicators
 */
export const motorGear = createSymbol(
  'MOTOR_GEAR',
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

      <!-- Gear teeth around edge (4 cardinal directions) -->
      <path d="M ${cx},${cy - radius - 3} l 2,3 l -2,0 l -2,0 l 2,-3" fill="currentColor"/>
      <path d="M ${cx + radius + 3},${cy} l -3,2 l 0,-2 l 0,-2 l 3,2" fill="currentColor"/>
      <path d="M ${cx},${cy + radius + 3} l 2,-3 l -2,0 l -2,0 l 2,3" fill="currentColor"/>
      <path d="M ${cx - radius - 3},${cy} l 3,2 l 0,-2 l 0,-2 l -3,2" fill="currentColor"/>

      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Vane Motor
 * ISO 1219-2 motor with radial vane indicator
 */
export const motorVane = createSymbol(
  'MOTOR_VANE',
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

      <!-- Vane indicator (4 radial lines intersecting at center) -->
      <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Axial Piston Motor
 * ISO 1219-2 motor with axial piston indicator (angled lines)
 */
export const motorPistonAxial = createSymbol(
  'MOTOR_PISTON_AXIAL',
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

      <!-- Axial piston indicator (3 angled parallel lines) -->
      <line x1="${cx - 6}" y1="${cy - 8}" x2="${cx - 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 6}" y1="${cy - 8}" x2="${cx + 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Radial Piston Motor
 * ISO 1219-2 motor with radial piston indicator
 */
export const motorPistonRadial = createSymbol(
  'MOTOR_PISTON_RADIAL',
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

      <!-- Radial piston indicator (4 lines radiating from center + center dot) -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy}" x2="${cx - 10}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="2" fill="currentColor"/>

      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Orbit Motor (Gerotor)
 * ISO 1219-2 motor with orbital/gerotor indicator
 */
export const motorOrbit = createSymbol(
  'MOTOR_ORBIT',
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

      <!-- Gerotor indicator (offset small circle inside) -->
      <circle cx="${cx + 3}" cy="${cy}" r="8"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
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
 * 2/2-Way Valve (2 ports, 2 positions)
 * ISO 1219-2 standard on/off valve
 */
export const valve22Way = createSymbol(
  'VALVE_22',
  40,
  40,
  [
    { x: 10, y: 40, name: 'P' },
    { x: 30, y: 40, name: 'A' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- Position 1 box (left - blocked) -->
      <rect x="${left}" y="${top + 5}" width="18" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Position 2 box (right - flow) -->
      <rect x="${left + 18}" y="${top + 5}" width="18" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Flow path in right position -->
      <line x1="${left + 22}" y1="${cy}" x2="${left + 32}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left + 32},${cy - 3} ${left + 32},${cy + 3} ${left + 35},${cy}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 31}" y1="${bottom}" x2="${left + 31}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 3/2-Way Valve (3 ports, 2 positions)
 * ISO 1219-2 standard control valve
 */
export const valve32Way = createSymbol(
  'VALVE_32',
  50,
  40,
  [
    { x: 10, y: 40, name: 'P' },
    { x: 25, y: 40, name: 'A' },
    { x: 40, y: 40, name: 'T' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 5}" width="24" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Position 2 box (right) -->
      <rect x="${left + 24}" y="${top + 5}" width="24" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Flow indicators in left position (P→A) -->
      <line x1="${left + 8}" y1="${cy}" x2="${left + 16}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left + 16},${cy - 3} ${left + 16},${cy + 3} ${left + 19},${cy}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 43}" y1="${bottom}" x2="${left + 43}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 4/2-Way Valve (4 ports, 2 positions)
 * ISO 1219-2 standard reversing valve
 */
export const valve42Way = createSymbol(
  'VALVE_42',
  60,
  40,
  [
    { x: 10, y: 40, name: 'P' },
    { x: 25, y: 40, name: 'A' },
    { x: 40, y: 40, name: 'B' },
    { x: 55, y: 40, name: 'T' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 5}" width="28" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Position 2 box (right) -->
      <rect x="${left + 28}" y="${top + 5}" width="28" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Flow indicators in left position (P→A, B→T) -->
      <line x1="${left + 8}" y1="${cy - 5}" x2="${left + 18}" y2="${cy - 5}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left + 18},${cy - 8} ${left + 18},${cy - 2} ${left + 21},${cy - 5}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 20}" y1="${bottom}" x2="${left + 20}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 38}" y1="${bottom}" x2="${left + 38}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 53}" y1="${bottom}" x2="${left + 53}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 4/3-Way Valve - Closed Center (all ports blocked)
 * ISO 1219-2 standard with closed center position
 */
export const valve43ClosedCenter = createSymbol(
  'VALVE_43_CLOSED',
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

      <!-- Closed center indicator (X symbol) -->
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
 * 4/3-Way Valve - Open Center (P→T in center)
 * ISO 1219-2 standard with open center position
 */
export const valve43OpenCenter = createSymbol(
  'VALVE_43_OPEN',
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

      <!-- Open center indicator (P→T flow path) -->
      <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 10},${cy - 3} ${cx + 10},${cy + 3} ${cx + 13},${cy}"
        fill="currentColor"/>

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
 * 4/3-Way Valve - Tandem Center (P→T, A/B blocked)
 * ISO 1219-2 standard with tandem center position
 */
export const valve43TandemCenter = createSymbol(
  'VALVE_43_TANDEM',
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

      <!-- Tandem center indicator (P→T open, A/B blocked) -->
      <line x1="${cx - 10}" y1="${cy - 6}" x2="${cx + 10}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 10},${cy - 9} ${cx + 10},${cy - 3} ${cx + 13},${cy - 6}"
        fill="currentColor"/>
      <line x1="${cx - 5}" y1="${cy + 6}" x2="${cx + 5}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="3"/>

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
 * 4/3-Way Valve - Float Center (A/B→T, P blocked)
 * ISO 1219-2 standard with float center position
 */
export const valve43FloatCenter = createSymbol(
  'VALVE_43_FLOAT',
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

      <!-- Float center indicator (A/B→T open, P blocked) -->
      <line x1="${cx - 10}" y1="${cy + 6}" x2="${cx + 10}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 10},${cy + 3} ${cx + 10},${cy + 9} ${cx + 13},${cy + 6}"
        fill="currentColor"/>
      <line x1="${cx - 5}" y1="${cy - 6}" x2="${cx + 5}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="3"/>

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
 * Proportional Valve
 * Electronic variable flow control valve
 */
export const valveProportional = createSymbol(
  'VALVE_PROPORTIONAL',
  70,
  60,
  [
    { x: 15, y: 60, name: 'P' },
    { x: 30, y: 60, name: 'A' },
    { x: 45, y: 60, name: 'B' },
    { x: 60, y: 60, name: 'T' },
    { x: 35, y: 0, name: 'control' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Main valve body (single position with variable opening) -->
      <rect x="${left}" y="${top + 15}" width="70" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Variable flow indicator (partial opening symbol) -->
      <line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 12},${cy - 3} ${cx + 12},${cy + 3} ${cx + 15},${cy}"
        fill="currentColor"/>

      <!-- Electronic control symbol (solenoid with resistor) -->
      <rect x="${cx - 8}" y="${top + 2}" width="16" height="10"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="${cx}" y1="${top + 2}" x2="${cx}" y2="${top - 2}"
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
 * Servo Valve
 * High precision control valve with torque motor
 */
export const valveServo = createSymbol(
  'VALVE_SERVO',
  70,
  60,
  [
    { x: 15, y: 60, name: 'P' },
    { x: 30, y: 60, name: 'A' },
    { x: 45, y: 60, name: 'B' },
    { x: 60, y: 60, name: 'T' },
    { x: 35, y: 0, name: 'control' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Main valve body (precision spool) -->
      <rect x="${left}" y="${top + 15}" width="70" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Precision flow indicator -->
      <line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 12},${cy - 3} ${cx + 12},${cy + 3} ${cx + 15},${cy}"
        fill="currentColor"/>

      <!-- Torque motor symbol (circle with coil lines) -->
      <circle cx="${cx}" cy="${top + 7}" r="7"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="${cx - 4}" y1="${top + 7}" x2="${cx + 4}" y2="${top + 7}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${top + 3}" x2="${cx}" y2="${top + 11}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 2}"
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

// ============================================================================
// PHASE 2: Pressure Control Valves
// ============================================================================

/**
 * Direct-Acting Relief Valve
 * ISO 1219-2 standard relief valve symbol
 */
export const reliefValveDirect = createSymbol(
  'RELIEF_DIRECT',
  40,
  55,
  [
    { x: 20, y: 55, name: 'inlet' },
    { x: 20, y: 0, name: 'tank' },
  ],
  (cx, cy) => {
    const boxWidth = 28;
    const boxHeight = 28;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body square -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Ball seat (circle) -->
      <circle cx="${cx}" cy="${cy + 6}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Poppet (arrow pointing down) -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 2}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 4},${cy + 2} ${cx + 4},${cy + 2} ${cx},${cy + 8}"
        fill="currentColor"/>

      <!-- Spring (direct acting) -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx - 3},${top - 7} L ${cx + 3},${top - 5} L ${cx - 3},${top - 3} L ${cx + 3},${top - 1}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Adjustment screw -->
      <line x1="${cx}" y1="${top - 8}" x2="${cx}" y2="${top - 12}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 5}" y1="${top - 12}" x2="${cx + 5}" y2="${top - 12}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Tank port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left}" y1="${top}" x2="${left + boxWidth}" y2="${top}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pilot-Operated Relief Valve
 * ISO 1219-2 standard pilot relief valve
 */
export const reliefValvePilot = createSymbol(
  'RELIEF_PILOT',
  55,
  60,
  [
    { x: 27, y: 60, name: 'inlet' },
    { x: 27, y: 0, name: 'tank' },
  ],
  (cx, cy) => {
    const mainBoxWidth = 28;
    const mainBoxHeight = 28;
    const pilotBoxSize = 16;
    const left = cx - mainBoxWidth / 2;
    const top = cy - mainBoxHeight / 2;

    return `
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${mainBoxWidth}" height="${mainBoxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Main poppet -->
      <circle cx="${cx}" cy="${cy + 6}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy + 2}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 4},${cy + 2} ${cx + 4},${cy + 2} ${cx},${cy + 8}"
        fill="currentColor"/>

      <!-- Pilot valve (small box offset to right) -->
      <rect x="${left + mainBoxWidth + 2}" y="${top - 6}" width="${pilotBoxSize}" height="${pilotBoxSize}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Pilot spring -->
      <line x1="${left + mainBoxWidth + 10}" y1="${top - 6}" x2="${left + mainBoxWidth + 10}" y2="${top - 10}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left + mainBoxWidth + 7},${top - 9} L ${left + mainBoxWidth + 13},${top - 8}"
        stroke="currentColor" stroke-width="1" fill="none"/>

      <!-- Pilot connection line -->
      <line x1="${cx}" y1="${cy - 8}" x2="${left + mainBoxWidth + 2}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Ports -->
      <line x1="${cx}" y1="${top + mainBoxHeight}" x2="${cx}" y2="${top + mainBoxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left}" y1="${top}" x2="${left + mainBoxWidth}" y2="${top}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Unloading Valve
 * Vents pump to tank at low pressure
 */
export const unloadingValve = createSymbol(
  'UNLOADING_VALVE',
  45,
  55,
  [
    { x: 22, y: 55, name: 'pump' },
    { x: 22, y: 0, name: 'tank' },
    { x: 45, y: 27, name: 'pilot' },
  ],
  (cx, cy) => {
    const boxWidth = 28;
    const boxHeight = 28;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Poppet normally closed -->
      <circle cx="${cx}" cy="${cy - 6}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${cy - 2}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 4},${cy - 6} ${cx + 4},${cy - 6} ${cx},${cy - 12}"
        fill="currentColor"/>

      <!-- Spring (keeps closed) -->
      <line x1="${cx}" y1="${cy + 8}" x2="${cx}" y2="${top + boxHeight + 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx - 3},${top + boxHeight + 2} L ${cx + 3},${top + boxHeight + 4}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Pilot port (right side) -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Pilot chamber (shown by dashed line) -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${cx + 4}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Pump port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Tank port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left}" y1="${top}" x2="${left + boxWidth}" y2="${top}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Sequence Valve
 * Enables secondary circuit at pressure setpoint
 */
export const sequenceValve = createSymbol(
  'SEQUENCE_VALVE',
  45,
  55,
  [
    { x: 22, y: 55, name: 'inlet' },
    { x: 0, y: 27, name: 'outlet' },
    { x: 22, y: 0, name: 'sense' },
  ],
  (cx, cy) => {
    const boxWidth = 28;
    const boxHeight = 28;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Poppet normally closed -->
      <circle cx="${cx}" cy="${cy}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 8}" y1="${cy}" x2="${cx - 4}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 4},${cy - 4} ${cx - 4},${cy + 4} ${cx + 2},${cy}"
        fill="currentColor"/>

      <!-- Spring on top -->
      <line x1="${cx}" y1="${cy - 4}" x2="${cx}" y2="${top - 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx - 3},${top - 5} L ${cx + 3},${top - 3} L ${cx - 3},${top - 1}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Adjustment screw -->
      <line x1="${cx}" y1="${top - 6}" x2="${cx}" y2="${top - 10}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 4}" y1="${top - 10}" x2="${cx + 4}" y2="${top - 10}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Pressure sensing line (dashed from inlet) -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port (left) -->
      <line x1="${left}" y1="${cy}" x2="${left - 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Sense port (top) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Counterbalance Valve
 * Holds vertical loads, pilot to open
 */
export const counterbalanceValve = createSymbol(
  'COUNTERBALANCE_VALVE',
  50,
  55,
  [
    { x: 25, y: 55, name: 'load' },
    { x: 25, y: 0, name: 'directional' },
    { x: 50, y: 27, name: 'pilot' },
  ],
  (cx, cy) => {
    const boxWidth = 30;
    const boxHeight = 30;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Check valve (allows free flow down) -->
      <polygon points="${cx - 6},${cy + 8} ${cx + 6},${cy + 8} ${cx},${cy + 2}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 6}" y1="${cy + 10}" x2="${cx + 6}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pilot-operated poppet (for upward flow) -->
      <circle cx="${cx}" cy="${cy - 4}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy - 14}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Spring (holds load) -->
      <path d="M ${cx + 8},${cy - 12} L ${cx + 10},${cy - 10} L ${cx + 8},${cy - 8} L ${cx + 10},${cy - 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="${cx + 8}" y1="${cy - 12}" x2="${cx}" y2="${cy - 12}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pilot control line -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left + boxWidth}" y1="${cy}" x2="${cx + 4}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Load port (bottom) -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Directional valve port (top) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Brake Valve (Overcenter Valve)
 * Prevents hydraulic motor overspeed
 */
export const brakeValve = createSymbol(
  'BRAKE_VALVE',
  55,
  60,
  [
    { x: 27, y: 60, name: 'motor_a' },
    { x: 27, y: 0, name: 'valve_a' },
    { x: 55, y: 30, name: 'pilot_b' },
  ],
  (cx, cy) => {
    const boxWidth = 30;
    const boxHeight = 30;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Check valve portion (free flow upward) -->
      <polygon points="${cx - 6},${cy - 8} ${cx + 6},${cy - 8} ${cx},${cy - 2}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 6}" y1="${cy - 10}" x2="${cx + 6}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pilot-operated poppet (prevents overspeed) -->
      <circle cx="${cx}" cy="${cy + 4}" r="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx - 4},${cy + 8} ${cx + 4},${cy + 8} ${cx},${cy + 14}"
        fill="currentColor"/>

      <!-- Spring (brake pressure setting) -->
      <line x1="${cx}" y1="${cy - 2}" x2="${cx}" y2="${top - 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx - 3},${top - 5} L ${cx + 3},${top - 3} L ${cx - 3},${top - 1}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Pilot line from opposite port -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left + boxWidth}" y1="${cy}" x2="${cx + 4}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Motor port (bottom) -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Valve port (top) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 2: Flow Control Valves
// ============================================================================

/**
 * Throttle Valve (Fixed Orifice)
 * ISO 1219-2 standard throttle valve
 */
export const throttleValve = createSymbol(
  'THROTTLE_VALVE',
  40,
  50,
  [
    { x: 20, y: 50, name: 'inlet' },
    { x: 20, y: 0, name: 'outlet' },
  ],
  (cx, cy) => {
    const boxWidth = 26;
    const boxHeight = 26;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Flow restriction (narrow passage) -->
      <line x1="${cx - 6}" y1="${cy - 8}" x2="${cx - 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 2}" y1="${cy}" x2="${cx + 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 2}" y1="${cy}" x2="${cx + 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Orifice sides -->
      <line x1="${cx - 8}" y1="${cy - 10}" x2="${cx - 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy + 10}" x2="${cx + 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 7}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 7}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Needle Valve (Fine Adjustment)
 * ISO 1219-2 adjustable throttle
 */
export const needleValve = createSymbol(
  'NEEDLE_VALVE',
  40,
  55,
  [
    { x: 20, y: 55, name: 'inlet' },
    { x: 20, y: 0, name: 'outlet' },
  ],
  (cx, cy) => {
    const boxWidth = 26;
    const boxHeight = 26;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Variable orifice (adjustable) -->
      <line x1="${cx - 6}" y1="${cy - 8}" x2="${cx - 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 2}" y1="${cy}" x2="${cx + 2}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 2}" y1="${cy}" x2="${cx + 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Needle taper -->
      <polygon points="${cx},${cy - 12} ${cx - 3},${cy} ${cx + 3},${cy}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Adjustment mechanism (diagonal arrow) -->
      <line x1="${cx - 10}" y1="${cy - 10}" x2="${cx - 6}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="2" marker-end="url(#arrowhead)"/>
      <polygon points="${cx - 6},${cy - 6} ${cx - 8},${cy - 8} ${cx - 4},${cy - 8}"
        fill="currentColor"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
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
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

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
      <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${top + 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pressure sensing lines (dashed) -->
      <line x1="${cx + 8}" y1="${cy + 6}" x2="${cx + 8}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Ports -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
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
    const top = cy - boxHeight / 2;

    return `
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

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
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
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
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

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

      <!-- Priority port (left) -->
      <line x1="${left}" y1="${cy}" x2="${left - 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Excess port (right) -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
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
      <!-- Main valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

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

      <!-- Outlet A (left) -->
      <line x1="${left}" y1="${cy - 10}" x2="${left - 8}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet B (right) -->
      <line x1="${left + boxWidth}" y1="${cy - 10}" x2="${left + boxWidth + 8}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 2: Check Valves (Advanced)
// ============================================================================

/**
 * Pilot-Operated Check Valve
 * Locks flow until pilot signal releases
 */
export const checkValvePilot = createSymbol(
  'CHECK_PILOT',
  50,
  55,
  [
    { x: 25, y: 55, name: 'inlet' },
    { x: 25, y: 0, name: 'outlet' },
    { x: 50, y: 27, name: 'pilot' },
  ],
  (cx, cy) => {
    const boxWidth = 30;
    const boxHeight = 30;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Check valve (one-way flow) -->
      <polygon points="${cx - 6},${cy + 6} ${cx + 6},${cy + 6} ${cx},${cy}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 6}" y1="${cy + 8}" x2="${cx + 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pilot piston (can open reverse) -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="2"/>
      <rect x="${cx - 4}" y="${cy - 10}" width="8" height="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Pilot port and connection -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left + boxWidth}" y1="${cy}" x2="${cx + 4}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Shuttle Valve (OR Valve)
 * Higher pressure input passes through
 */
export const shuttleValve = createSymbol(
  'SHUTTLE_VALVE',
  55,
  50,
  [
    { x: 0, y: 15, name: 'inlet_a' },
    { x: 0, y: 35, name: 'inlet_b' },
    { x: 55, y: 25, name: 'outlet' },
  ],
  (cx, cy) => {
    const bodyWidth = 32;
    const bodyHeight = 28;
    const left = cx - bodyWidth / 2;
    const top = cy - bodyHeight / 2;

    return `
      <!-- Valve body (diamond shape) -->
      <polygon points="${left},${cy} ${cx},${top} ${left + bodyWidth},${cy} ${cx},${top + bodyHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Shuttle ball (movable element) -->
      <circle cx="${cx - 2}" cy="${cy}" r="5"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Inlet A (top left) -->
      <line x1="${left}" y1="${cy - 10}" x2="${left - 8}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Inlet B (bottom left) -->
      <line x1="${left}" y1="${cy + 10}" x2="${left - 8}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet (right) -->
      <line x1="${left + bodyWidth}" y1="${cy}" x2="${left + bodyWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Flow indicator arrows -->
      <polygon points="${cx + 8},${cy} ${cx + 5},${cy - 3} ${cx + 5},${cy + 3}"
        fill="currentColor"/>
    `;
  }
);

/**
 * Pilot-to-Open Check Valve
 * Opens in reverse direction with pilot signal
 */
export const checkValvePilotOpen = createSymbol(
  'CHECK_PILOT_OPEN',
  50,
  60,
  [
    { x: 25, y: 60, name: 'inlet' },
    { x: 25, y: 0, name: 'outlet' },
    { x: 50, y: 30, name: 'pilot' },
  ],
  (cx, cy) => {
    const boxWidth = 30;
    const boxHeight = 32;
    const left = cx - boxWidth / 2;
    const top = cy - boxHeight / 2;

    return `
      <!-- Valve body -->
      <rect x="${left}" y="${top}" width="${boxWidth}" height="${boxHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Check valve (normal forward flow) -->
      <polygon points="${cx - 6},${cy + 4} ${cx + 6},${cy + 4} ${cx},${cy - 2}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 6}" y1="${cy + 6}" x2="${cx + 6}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Reverse check valve (opens with pilot) -->
      <polygon points="${cx - 5},${cy - 6} ${cx + 5},${cy - 6} ${cx},${cy - 12}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx - 5}" y1="${cy - 8}" x2="${cx + 5}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pilot piston mechanism -->
      <line x1="${cx}" y1="${cy - 12}" x2="${cx + 6}" y2="${cy - 12}"
        stroke="currentColor" stroke-width="1.5"/>
      <rect x="${cx + 4}" y="${cy - 14}" width="8" height="4"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Pilot port -->
      <line x1="${left + boxWidth}" y1="${cy}" x2="${left + boxWidth + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left + boxWidth}" y1="${cy}" x2="${cx + 12}" y2="${cy - 12}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Inlet port -->
      <line x1="${cx}" y1="${top + boxHeight}" x2="${cx}" y2="${top + boxHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 2: Rotary Actuators
// ============================================================================

/**
 * Vane Rotary Actuator
 * Limited rotation, compact design
 */
export const rotaryActuatorVane = createSymbol(
  'ROTARY_VANE',
  55,
  50,
  [
    { x: 10, y: 25, name: 'port_a' },
    { x: 45, y: 25, name: 'port_b' },
    { x: 27, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 20;

    return `
      <!-- Circular body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Vane (rotating element) -->
      <rect x="${cx - 3}" y="${cy - 15}" width="6" height="15"
        stroke="currentColor" stroke-width="2" fill="currentColor"/>

      <!-- Rotation arc indicator -->
      <path d="M ${cx - 12},${cy - 8} A 14 14 0 0 1 ${cx + 12},${cy - 8}"
        stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>

      <!-- Rotation arrow -->
      <polygon points="${cx + 10},${cy - 10} ${cx + 12},${cy - 8} ${cx + 14},${cy - 10}"
        fill="currentColor"/>

      <!-- Output shaft -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 5}"
        stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy - radius - 8}" r="3"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Port A (left) -->
      <line x1="${cx - radius}" y1="${cy}" x2="${cx - radius - 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Port B (right) -->
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Piston Rotary Actuator
 * High torque, precise control
 */
export const rotaryActuatorPiston = createSymbol(
  'ROTARY_PISTON',
  55,
  55,
  [
    { x: 10, y: 27, name: 'port_a' },
    { x: 45, y: 27, name: 'port_b' },
    { x: 27, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 22;

    return `
      <!-- Circular body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Piston mechanism (radial pistons) -->
      <line x1="${cx - 10}" y1="${cy}" x2="${cx - 14}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <rect x="${cx - 18}" y="${cy - 3}" width="4" height="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <line x1="${cx + 10}" y1="${cy}" x2="${cx + 14}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <rect x="${cx + 14}" y="${cy - 3}" width="4" height="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Central shaft/cam -->
      <circle cx="${cx}" cy="${cy}" r="6"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Rotation indicator -->
      <path d="M ${cx - 14},${cy - 10} A 16 16 0 0 1 ${cx + 14},${cy - 10}"
        stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
      <polygon points="${cx + 12},${cy - 12} ${cx + 14},${cy - 10} ${cx + 16},${cy - 12}"
        fill="currentColor"/>

      <!-- Output shaft -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 5}"
        stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy - radius - 8}" r="3"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Ports -->
      <line x1="${cx - radius}" y1="${cy}" x2="${cx - radius - 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Rack and Pinion Actuator
 * Converts linear motion to rotary
 */
export const rackPinionActuator = createSymbol(
  'RACK_PINION',
  60,
  50,
  [
    { x: 0, y: 35, name: 'port_a' },
    { x: 60, y: 35, name: 'port_b' },
    { x: 30, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const rackWidth = 40;
    const rackHeight = 10;
    const pinionRadius = 12;

    return `
      <!-- Rack (linear motion) -->
      <rect x="${cx - rackWidth / 2}" y="${cy + 8}" width="${rackWidth}" height="${rackHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Rack teeth -->
      <line x1="${cx - 15}" y1="${cy + 8}" x2="${cx - 15}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 5}" y1="${cy + 8}" x2="${cx - 5}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 5}" y1="${cy + 8}" x2="${cx + 5}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 15}" y1="${cy + 8}" x2="${cx + 15}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Pinion gear -->
      <circle cx="${cx}" cy="${cy - 4}" r="${pinionRadius}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Gear teeth on pinion -->
      <circle cx="${cx}" cy="${cy - 4}" r="${pinionRadius - 2}"
        stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,3"/>

      <!-- Output shaft -->
      <line x1="${cx}" y1="${cy - 4 - pinionRadius}" x2="${cx}" y2="${cy - 4 - pinionRadius - 6}"
        stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy - 4 - pinionRadius - 9}" r="3"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Linear actuator ports -->
      <line x1="${cx - rackWidth / 2}" y1="${cy + 13}" x2="${cx - rackWidth / 2 - 8}" y2="${cy + 13}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + rackWidth / 2}" y1="${cy + 13}" x2="${cx + rackWidth / 2 + 8}" y2="${cy + 13}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Motion arrow -->
      <polygon points="${cx - 25},${cy + 13} ${cx - 28},${cy + 11} ${cx - 28},${cy + 15}"
        fill="currentColor"/>
    `;
  }
);

/**
 * Helical Actuator
 * Smooth rotation, high torque
 */
export const helicalActuator = createSymbol(
  'HELICAL_ACTUATOR',
  55,
  60,
  [
    { x: 27, y: 60, name: 'port_in' },
    { x: 27, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const bodyWidth = 32;
    const bodyHeight = 40;
    const left = cx - bodyWidth / 2;
    const top = cy - bodyHeight / 2;

    return `
      <!-- Cylindrical body -->
      <rect x="${left}" y="${top}" width="${bodyWidth}" height="${bodyHeight}"
        stroke="currentColor" stroke-width="2.5" fill="white" rx="4"/>

      <!-- Helical thread pattern (simplified) -->
      <path d="M ${left + 8},${top + 8} Q ${cx},${top + 12} ${left + bodyWidth - 8},${top + 16}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${left + 8},${top + 16} Q ${cx},${top + 20} ${left + bodyWidth - 8},${top + 24}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M ${left + 8},${top + 24} Q ${cx},${top + 28} ${left + bodyWidth - 8},${top + 32}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Rotating nut/screw -->
      <rect x="${cx - 8}" y="${cy - 6}" width="16" height="12"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Rotation indicator -->
      <circle cx="${cx}" cy="${cy}" r="10"
        stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="2,2"/>
      <polygon points="${cx + 8},${cy - 4} ${cx + 10},${cy - 2} ${cx + 8},${cy}"
        fill="currentColor"/>

      <!-- Output shaft (top) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx}" cy="${top - 11}" r="3"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Inlet port (bottom) -->
      <line x1="${cx}" y1="${top + bodyHeight}" x2="${cx}" y2="${top + bodyHeight + 8}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 2: Accumulators (Specialized Types)
// ============================================================================

/**
 * Bladder Accumulator
 * Fast response, gas-charged with bladder separator
 */
export const accumulatorBladder = createSymbol(
  'ACCUMULATOR_BLADDER',
  40,
  55,
  [{ x: 20, y: 55, name: 'port' }],
  (cx, cy) => {
    const width = 32;
    const height = 42;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Cylindrical body -->
      <rect x="${left}" y="${top}" width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2.5" fill="white" rx="3"/>

      <!-- Bladder (curved separator) -->
      <path d="M ${left + 4},${cy - 8} Q ${cx},${cy - 2} ${left + width - 4},${cy - 8}"
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${left + 4},${cy - 8} Q ${cx},${cy - 14} ${left + width - 4},${cy - 8}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Gas symbol (N2) above bladder -->
      <text x="${cx}" y="${cy - 14}" font-size="9" font-weight="bold"
        text-anchor="middle" fill="currentColor">N2</text>

      <!-- Gas valve (top) -->
      <circle cx="${cx}" cy="${top - 2}" r="3"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 5}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Fluid region (below bladder) -->
      <line x1="${left + 6}" y1="${cy + 4}" x2="${left + width - 6}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Connection port -->
      <line x1="${cx}" y1="${top + height}" x2="${cx}" y2="${top + height + 5}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Piston Accumulator
 * Large volume, heavy duty
 */
export const accumulatorPiston = createSymbol(
  'ACCUMULATOR_PISTON',
  40,
  60,
  [{ x: 20, y: 60, name: 'port' }],
  (cx, cy) => {
    const width = 32;
    const height = 48;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Cylindrical body -->
      <rect x="${left}" y="${top}" width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2.5" fill="white" rx="2"/>

      <!-- Piston (horizontal divider) -->
      <rect x="${left}" y="${cy - 4}" width="${width}" height="8"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Piston seal rings -->
      <line x1="${left}" y1="${cy - 2}" x2="${left + width}" y2="${cy - 2}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left}" y1="${cy + 2}" x2="${left + width}" y2="${cy + 2}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Gas chamber (top) -->
      <text x="${cx}" y="${cy - 12}" font-size="9" font-weight="bold"
        text-anchor="middle" fill="currentColor">N2</text>

      <!-- Gas valve (top) -->
      <circle cx="${cx}" cy="${top - 2}" r="3"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 5}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Fluid chamber (bottom) -->
      <line x1="${left + 6}" y1="${cy + 10}" x2="${left + width - 6}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Connection port -->
      <line x1="${cx}" y1="${top + height}" x2="${cx}" y2="${top + height + 5}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Diaphragm Accumulator
 * Small volume, fast response
 */
export const accumulatorDiaphragm = createSymbol(
  'ACCUMULATOR_DIAPHRAGM',
  38,
  50,
  [{ x: 19, y: 50, name: 'port' }],
  (cx, cy) => {
    const radius = 18;

    return `
      <!-- Spherical body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Diaphragm (thin flexible separator) -->
      <path d="M ${cx - 14},${cy} Q ${cx},${cy + 6} ${cx + 14},${cy}"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Gas side (top hemisphere) -->
      <text x="${cx}" y="${cy - 6}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">N2</text>

      <!-- Gas valve -->
      <circle cx="${cx}" cy="${cy - radius - 2}" r="2.5"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 4}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Fluid side indicator -->
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Connection port -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 5}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Weight-Loaded Accumulator
 * Constant pressure, simple design
 */
export const accumulatorWeight = createSymbol(
  'ACCUMULATOR_WEIGHT',
  45,
  65,
  [{ x: 22, y: 65, name: 'port' }],
  (cx, cy) => {
    const width = 28;
    const height = 50;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Vertical cylinder -->
      <rect x="${left}" y="${top}" width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2.5" fill="white" rx="2"/>

      <!-- Weight/piston rod (vertical shaft) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 8}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Weight mass (rectangular block on top) -->
      <rect x="${cx - 12}" y="${top - 16}" width="24" height="8"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Weight indicator lines (mass symbol) -->
      <line x1="${cx - 8}" y1="${top - 14}" x2="${cx + 8}" y2="${top - 14}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 6}" y1="${top - 11}" x2="${cx + 6}" y2="${top - 11}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Piston inside cylinder -->
      <rect x="${left + 2}" y="${cy - 6}" width="${width - 4}" height="8"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Fluid chamber (below piston) -->
      <line x1="${left + 6}" y1="${cy + 8}" x2="${left + width - 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Weight force arrow -->
      <line x1="${cx + 16}" y1="${top - 12}" x2="${cx + 16}" y2="${cy - 2}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
      <polygon points="${cx + 16},${cy - 2} ${cx + 14},${cy - 6} ${cx + 18},${cy - 6}"
        fill="currentColor"/>
      <text x="${cx + 20}" y="${cy - 8}" font-size="8" font-weight="bold"
        text-anchor="start" fill="currentColor">W</text>

      <!-- Connection port -->
      <line x1="${cx}" y1="${top + height}" x2="${cx}" y2="${top + height + 5}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 3: HYDRAULIC SUPPORT EQUIPMENT - FILTERS
// ============================================================================

/**
 * Suction Filter (ISO 1219-2)
 * Coarse filter installed on pump intake
 */
export const filterSuction = createSymbol(
  'FILTER_SUCTION',
  50,
  45,
  [
    { x: 0, y: 22.5, name: 'INLET' },
    { x: 50, y: 22.5, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 22.5;
    const bottom = cy + 22.5;

    return `
      <!-- Filter housing -->
      <rect x="${left}" y="${top}" width="50" height="45"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Filter element (diamond pattern for coarse) -->
      <path d="M ${cx},${top + 10} L ${cx + 12},${cy} L ${cx},${bottom - 10} L ${cx - 12},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Coarse mesh indicator (wider spacing) -->
      <line x1="${cx - 8}" y1="${cy - 6}" x2="${cx - 8}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 8}" y1="${cy - 6}" x2="${cx + 8}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Suction indicator (S) -->
      <text x="${cx}" y="${bottom + 12}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">S</text>
    `;
  }
);

/**
 * Pressure Filter (ISO 1219-2)
 * Fine filter on pressure side after pump
 */
export const filterPressure = createSymbol(
  'FILTER_PRESSURE',
  50,
  45,
  [
    { x: 0, y: 22.5, name: 'INLET' },
    { x: 50, y: 22.5, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 22.5;
    const bottom = cy + 22.5;

    return `
      <!-- Filter housing -->
      <rect x="${left}" y="${top}" width="50" height="45"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Filter element (diamond pattern) -->
      <path d="M ${cx},${top + 10} L ${cx + 12},${cy} L ${cx},${bottom - 10} L ${cx - 12},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Fine mesh indicator (many lines for fine filtration) -->
      <line x1="${cx - 10}" y1="${cy - 6}" x2="${cx - 10}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 6}" y1="${cy - 8}" x2="${cx - 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 2}" y1="${cy - 9}" x2="${cx - 2}" y2="${cy + 9}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 2}" y1="${cy - 9}" x2="${cx + 2}" y2="${cy + 9}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 6}" y1="${cy - 8}" x2="${cx + 6}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 10}" y1="${cy - 6}" x2="${cx + 10}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Pressure indicator (P) -->
      <text x="${cx}" y="${bottom + 12}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">P</text>
    `;
  }
);

/**
 * Return Filter (ISO 1219-2)
 * Filter on return line to tank
 */
export const filterReturn = createSymbol(
  'FILTER_RETURN',
  50,
  50,
  [
    { x: 0, y: 25, name: 'INLET' },
    { x: 50, y: 25, name: 'TANK' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Filter housing -->
      <rect x="${left}" y="${top}" width="50" height="45"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Filter element (diamond pattern) -->
      <path d="M ${cx},${top + 10} L ${cx + 12},${cy} L ${cx},${top + 35} L ${cx - 12},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Medium mesh indicator -->
      <line x1="${cx - 8}" y1="${cy - 6}" x2="${cx - 8}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 3}" y1="${cy - 8}" x2="${cx - 3}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 3}" y1="${cy - 8}" x2="${cx + 3}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 8}" y1="${cy - 6}" x2="${cx + 8}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Tank connection (inverted triangle) -->
      <path d="M ${right - 8},${bottom} L ${right + 8},${bottom} L ${right},${bottom + 10} Z"
        fill="currentColor"/>
      <line x1="${right}" y1="${top + 45}" x2="${right}" y2="${bottom}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Return indicator (R) -->
      <text x="${cx}" y="${bottom + 12}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">R</text>
    `;
  }
);

/**
 * Offline Filter (ISO 1219-2)
 * Kidney-loop continuous filtration system
 */
export const filterOffline = createSymbol(
  'FILTER_OFFLINE',
  55,
  50,
  [
    { x: 0, y: 25, name: 'INLET' },
    { x: 55, y: 25, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 27.5;
    const right = cx + 27.5;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Filter housing -->
      <rect x="${left + 5}" y="${top}" width="45" height="50"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Filter element (diamond pattern) -->
      <path d="M ${cx},${top + 10} L ${cx + 12},${cy} L ${cx},${bottom - 10} L ${cx - 12},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Fine mesh indicator -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx - 8}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 4}" y1="${cy - 9}" x2="${cx - 4}" y2="${cy + 9}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 4}" y1="${cy - 9}" x2="${cx + 4}" y2="${cy + 9}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Circulation arrows (kidney loop indicator) -->
      <path d="M ${left},${cy - 8} Q ${left - 8},${cy} ${left},${cy + 8}"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left},${cy + 8} ${left - 3},${cy + 5} ${left + 2},${cy + 6}"
        fill="currentColor"/>

      <path d="M ${right},${cy + 8} Q ${right + 8},${cy} ${right},${cy - 8}"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${right},${cy - 8} ${right + 3},${cy - 5} ${right - 2},${cy - 6}"
        fill="currentColor"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right - 5}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Breather Filter (ISO 1219-2)
 * Reservoir air breather with filter
 */
export const filterBreather = createSymbol(
  'FILTER_BREATHER',
  35,
  40,
  [{ x: 17.5, y: 40, name: 'TANK' }],
  (cx, cy) => {
    const left = cx - 17.5;
    //const right = cx + 17.5;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- Filter housing (smaller) -->
      <rect x="${left}" y="${top}" width="35" height="30"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Filter element (diamond pattern) -->
      <path d="M ${cx},${top + 6} L ${cx + 8},${top + 15} L ${cx},${top + 24} L ${cx - 8},${top + 15} Z"
        fill="none" stroke="currentColor" stroke-width="1.5"/>

      <!-- Fine mesh -->
      <line x1="${cx - 5}" y1="${top + 12}" x2="${cx - 5}" y2="${top + 18}"
        stroke="currentColor" stroke-width="0.8"/>
      <line x1="${cx}" y1="${top + 10}" x2="${cx}" y2="${top + 20}"
        stroke="currentColor" stroke-width="0.8"/>
      <line x1="${cx + 5}" y1="${top + 12}" x2="${cx + 5}" y2="${top + 18}"
        stroke="currentColor" stroke-width="0.8"/>

      <!-- Atmosphere symbol (wavy lines at top) -->
      <path d="M ${left + 5},${top - 5} Q ${left + 9},${top - 8} ${left + 12},${top - 5} T ${left + 18},${top - 5} T ${left + 25},${top - 5} T ${left + 30},${top - 5}"
        fill="none" stroke="currentColor" stroke-width="1.5"/>

      <!-- Tank connection -->
      <line x1="${cx}" y1="${top + 30}" x2="${cx}" y2="${bottom}"
        stroke="currentColor" stroke-width="2.5"/>
      <path d="M ${cx - 8},${bottom} L ${cx + 8},${bottom} L ${cx},${bottom + 10} Z"
        fill="currentColor"/>
    `;
  }
);

/**
 * Spin-On Filter (ISO 1219-2)
 * Threaded cartridge filter
 */
export const filterSpinOn = createSymbol(
  'FILTER_SPIN_ON',
  45,
  55,
  [
    { x: 0, y: 27.5, name: 'INLET' },
    { x: 45, y: 27.5, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 22.5;
    const right = cx + 22.5;
    const top = cy - 27.5;
    const bottom = cy + 27.5;

    return `
      <!-- Filter canister (cylindrical) -->
      <ellipse cx="${cx}" cy="${top + 5}" rx="18" ry="5"
        fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 4.5}" y1="${top + 5}" x2="${left + 4.5}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right - 4.5}" y1="${top + 5}" x2="${right - 4.5}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${bottom - 5}" rx="18" ry="5"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Thread indicator (multiple lines at top) -->
      <line x1="${left + 8}" y1="${top + 8}" x2="${right - 8}" y2="${top + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 8}" y1="${top + 11}" x2="${right - 8}" y2="${top + 11}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 8}" y1="${top + 14}" x2="${right - 8}" y2="${top + 14}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Filter element inside -->
      <path d="M ${cx},${top + 18} L ${cx + 10},${cy} L ${cx},${bottom - 12} L ${cx - 10},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="1.5"/>

      <!-- Mesh lines -->
      <line x1="${cx - 6}" y1="${cy - 6}" x2="${cx - 6}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 6}" y1="${cy - 6}" x2="${cx + 6}" y2="${cy + 6}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left + 4.5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right - 4.5}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 3: HYDRAULIC SUPPORT EQUIPMENT - HEAT EXCHANGERS (COOLERS)
// ============================================================================

/**
 * Air Cooler (ISO 1219-2)
 * Air-cooled heat exchanger
 */
export const coolerAir = createSymbol(
  'COOLER_AIR',
  55,
  50,
  [
    { x: 0, y: 25, name: 'INLET' },
    { x: 55, y: 25, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 27.5;
    const right = cx + 27.5;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Cooler housing (hexagon) -->
      <path d="M ${left + 10},${top} L ${right - 10},${top} L ${right},${cy} L ${right - 10},${bottom} L ${left + 10},${bottom} L ${left},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Cooling fins (vertical lines) -->
      <line x1="${cx - 15}" y1="${top + 8}" x2="${cx - 15}" y2="${bottom - 8}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 10}" y1="${top + 5}" x2="${cx - 10}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 5}" y1="${top + 3}" x2="${cx - 5}" y2="${bottom - 3}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${top + 2}" x2="${cx}" y2="${bottom - 2}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 5}" y1="${top + 3}" x2="${cx + 5}" y2="${bottom - 3}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 10}" y1="${top + 5}" x2="${cx + 10}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx + 15}" y1="${top + 8}" x2="${cx + 15}" y2="${bottom - 8}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Air flow arrows (above cooler) -->
      <path d="M ${cx - 12},${top - 8} L ${cx - 12},${top - 15}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx - 12},${top - 15} ${cx - 14},${top - 12} ${cx - 10},${top - 12}"
        fill="currentColor"/>

      <path d="M ${cx},${top - 8} L ${cx},${top - 15}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx},${top - 15} ${cx - 2},${top - 12} ${cx + 2},${top - 12}"
        fill="currentColor"/>

      <path d="M ${cx + 12},${top - 8} L ${cx + 12},${top - 15}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 12},${top - 15} ${cx + 10},${top - 12} ${cx + 14},${top - 12}"
        fill="currentColor"/>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Water Cooler (ISO 1219-2)
 * Water-cooled heat exchanger
 */
export const coolerWater = createSymbol(
  'COOLER_WATER',
  60,
  55,
  [
    { x: 0, y: 27.5, name: 'OIL_IN' },
    { x: 60, y: 27.5, name: 'OIL_OUT' },
    { x: 30, y: 0, name: 'WATER_IN' },
    { x: 30, y: 55, name: 'WATER_OUT' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 27.5;
    const bottom = cy + 27.5;

    return `
      <!-- Cooler housing (hexagon) -->
      <path d="M ${left + 12},${top + 5} L ${right - 12},${top + 5} L ${right - 5},${cy} L ${right - 12},${bottom - 5} L ${left + 12},${bottom - 5} L ${left + 5},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Heat transfer tubes (horizontal lines for oil flow) -->
      <line x1="${left + 15}" y1="${cy - 10}" x2="${right - 15}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 15}" y1="${cy - 5}" x2="${right - 15}" y2="${cy - 5}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 15}" y1="${cy}" x2="${right - 15}" y2="${cy}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 15}" y1="${cy + 5}" x2="${right - 15}" y2="${cy + 5}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 15}" y1="${cy + 10}" x2="${right - 15}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Water flow path (vertical) -->
      <line x1="${cx}" y1="${top - 5}" x2="${cx}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${bottom - 5}" x2="${cx}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Water flow arrows -->
      <polygon points="${cx},${top + 12} ${cx - 3},${top + 8} ${cx + 3},${top + 8}"
        fill="currentColor"/>
      <polygon points="${cx},${bottom - 12} ${cx - 3},${bottom - 8} ${cx + 3},${bottom - 8}"
        fill="currentColor"/>

      <!-- Oil inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Oil outlet port -->
      <line x1="${right - 5}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Oil-to-Air Cooler (ISO 1219-2)
 * Compact oil-to-air heat exchanger
 */
export const coolerOilAir = createSymbol(
  'COOLER_OIL_AIR',
  50,
  48,
  [
    { x: 0, y: 24, name: 'INLET' },
    { x: 50, y: 24, name: 'OUTLET' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 24;
    const bottom = cy + 24;

    return `
      <!-- Cooler housing (hexagon) -->
      <path d="M ${left + 8},${top + 3} L ${right - 8},${top + 3} L ${right - 3},${cy} L ${right - 8},${bottom - 3} L ${left + 8},${bottom - 3} L ${left + 3},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Diagonal cooling pattern (oil-air interface) -->
      <line x1="${left + 12}" y1="${top + 8}" x2="${left + 18}" y2="${top + 14}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 18}" y1="${top + 8}" x2="${left + 24}" y2="${top + 14}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 24}" y1="${top + 8}" x2="${left + 30}" y2="${top + 14}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 30}" y1="${top + 8}" x2="${left + 36}" y2="${top + 14}"
        stroke="currentColor" stroke-width="1"/>

      <line x1="${left + 12}" y1="${top + 18}" x2="${left + 18}" y2="${top + 24}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 18}" y1="${top + 18}" x2="${left + 24}" y2="${top + 24}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 24}" y1="${top + 18}" x2="${left + 30}" y2="${top + 24}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 30}" y1="${top + 18}" x2="${left + 36}" y2="${top + 24}"
        stroke="currentColor" stroke-width="1"/>

      <line x1="${left + 12}" y1="${top + 28}" x2="${left + 18}" y2="${top + 34}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 18}" y1="${top + 28}" x2="${left + 24}" y2="${top + 34}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 24}" y1="${top + 28}" x2="${left + 30}" y2="${top + 34}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 30}" y1="${top + 28}" x2="${left + 36}" y2="${top + 34}"
        stroke="currentColor" stroke-width="1"/>

      <!-- Air symbol -->
      <text x="${cx}" y="${top - 3}" font-size="9" font-weight="bold"
        text-anchor="middle" fill="currentColor">AIR</text>

      <!-- Inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left + 3}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Outlet port -->
      <line x1="${right - 3}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Oil-to-Water Cooler (ISO 1219-2)
 * Shell and tube heat exchanger
 */
export const coolerOilWater = createSymbol(
  'COOLER_OIL_WATER',
  65,
  50,
  [
    { x: 0, y: 25, name: 'OIL_IN' },
    { x: 65, y: 25, name: 'OIL_OUT' },
    { x: 32.5, y: 0, name: 'WATER_IN' },
    { x: 32.5, y: 50, name: 'WATER_OUT' },
  ],
  (cx, cy) => {
    const left = cx - 32.5;
    const right = cx + 32.5;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Outer shell (hexagon) -->
      <path d="M ${left + 12},${top} L ${right - 12},${top} L ${right},${cy} L ${right - 12},${bottom} L ${left + 12},${bottom} L ${left},${cy} Z"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Inner tubes (circles representing tube bundle) -->
      <circle cx="${cx - 12}" cy="${cy - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx + 12}" cy="${cy - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>

      <circle cx="${cx - 12}" cy="${cy}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx + 12}" cy="${cy}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>

      <circle cx="${cx - 12}" cy="${cy + 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy + 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="${cx + 12}" cy="${cy + 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1"/>

      <!-- Water ports (vertical) -->
      <line x1="${cx}" y1="${top - 5}" x2="${cx}" y2="${top}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Water flow indicator -->
      <text x="${cx - 18}" y="${top + 5}" font-size="7" font-weight="bold"
        text-anchor="middle" fill="currentColor">H₂O</text>

      <!-- Oil inlet port -->
      <line x1="${left - 5}" y1="${cy}" x2="${left}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Oil outlet port -->
      <line x1="${right}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// ============================================================================
// PHASE 3: HYDRAULIC SUPPORT EQUIPMENT - MANIFOLDS
// ============================================================================

/**
 * Sandwich Manifold (ISO 1219-2)
 * Valve mounting between components
 */
export const manifoldSandwich = createSymbol(
  'MANIFOLD_SANDWICH',
  60,
  45,
  [
    { x: 0, y: 22.5, name: 'P_IN' },
    { x: 60, y: 22.5, name: 'P_OUT' },
    { x: 30, y: 0, name: 'PORT_A' },
    { x: 30, y: 45, name: 'PORT_B' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 22.5;
    const bottom = cy + 22.5;

    return `
      <!-- Manifold body (layered rectangles) -->
      <rect x="${left + 5}" y="${top}" width="50" height="45"
        fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="${left + 8}" y="${top + 3}" width="44" height="39"
        fill="none" stroke="currentColor" stroke-width="1.5"/>

      <!-- Internal passages (horizontal) -->
      <line x1="${left + 12}" y1="${cy}" x2="${right - 12}" y2="${cy}"
        stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/>

      <!-- Vertical ports -->
      <line x1="${cx}" y1="${top + 8}" x2="${cx}" y2="${top - 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${top + 8}" r="2.5"
        fill="currentColor"/>

      <line x1="${cx}" y1="${bottom - 8}" x2="${cx}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${bottom - 8}" r="2.5"
        fill="currentColor"/>

      <!-- Through ports (horizontal) -->
      <line x1="${left - 5}" y1="${cy}" x2="${left + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${left + 12}" cy="${cy}" r="2.5"
        fill="currentColor"/>

      <line x1="${right - 5}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${right - 12}" cy="${cy}" r="2.5"
        fill="currentColor"/>

      <!-- Layer indicator lines -->
      <line x1="${left + 5}" y1="${top + 12}" x2="${right - 5}" y2="${top + 12}"
        stroke="currentColor" stroke-width="0.8"/>
      <line x1="${left + 5}" y1="${bottom - 12}" x2="${right - 5}" y2="${bottom - 12}"
        stroke="currentColor" stroke-width="0.8"/>
    `;
  }
);

/**
 * Monoblock Manifold (ISO 1219-2)
 * Single-piece machined manifold
 */
export const manifoldMonoblock = createSymbol(
  'MANIFOLD_MONOBLOCK',
  70,
  50,
  [
    { x: 10, y: 50, name: 'P' },
    { x: 25, y: 50, name: 'A' },
    { x: 45, y: 50, name: 'B' },
    { x: 60, y: 50, name: 'T' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Solid manifold body -->
      <rect x="${left}" y="${top}" width="70" height="45"
        fill="none" stroke="currentColor" stroke-width="2.5"/>

      <!-- Mounting holes -->
      <circle cx="${left + 8}" cy="${top + 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="${right - 8}" cy="${top + 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>

      <!-- Internal passages (cross-drilled) -->
      <line x1="${left + 10}" y1="${bottom - 8}" x2="${right - 10}" y2="${bottom - 8}"
        stroke="currentColor" stroke-width="2" stroke-dasharray="3,2"/>

      <!-- Vertical drilled ports -->
      <circle cx="${left + 10}" cy="${bottom - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 10}" y1="${bottom - 5}" x2="${left + 10}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <text x="${left + 10}" y="${bottom + 15}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">P</text>

      <circle cx="${left + 25}" cy="${bottom - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 25}" y1="${bottom - 5}" x2="${left + 25}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <text x="${left + 25}" y="${bottom + 15}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">A</text>

      <circle cx="${left + 45}" cy="${bottom - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 45}" y1="${bottom - 5}" x2="${left + 45}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <text x="${left + 45}" y="${bottom + 15}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">B</text>

      <circle cx="${right - 10}" cy="${bottom - 8}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 10}" y1="${bottom - 5}" x2="${right - 10}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>
      <text x="${right - 10}" y="${bottom + 15}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">T</text>

      <!-- Cross-section indicator -->
      <line x1="${left + 15}" y1="${top + 15}" x2="${left + 22}" y2="${top + 22}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${left + 22}" y1="${top + 15}" x2="${left + 15}" y2="${top + 22}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
    `;
  }
);

/**
 * Modular Manifold (ISO 1219-2)
 * Stackable modular sections
 */
export const manifoldModular = createSymbol(
  'MANIFOLD_MODULAR',
  65,
  55,
  [
    { x: 10, y: 55, name: 'PORT_1' },
    { x: 32.5, y: 55, name: 'PORT_2' },
    { x: 55, y: 55, name: 'PORT_3' },
  ],
  (cx, cy) => {
    const left = cx - 32.5;
    const right = cx + 32.5;
    const top = cy - 27.5;
    const bottom = cy + 27.5;

    return `
      <!-- Module sections (stacked blocks) -->
      <rect x="${left}" y="${top}" width="20" height="50"
        fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="${left + 22}" y="${top}" width="20" height="50"
        fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="${left + 44}" y="${top}" width="20" height="50"
        fill="none" stroke="currentColor" stroke-width="2"/>

      <!-- Module separation lines -->
      <line x1="${left + 20}" y1="${top}" x2="${left + 20}" y2="${top + 50}"
        stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/>
      <line x1="${left + 42}" y1="${top}" x2="${left + 42}" y2="${top + 50}"
        stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/>

      <!-- Internal passages through modules -->
      <line x1="${left + 5}" y1="${bottom - 10}" x2="${right - 5}" y2="${bottom - 10}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,2"/>

      <!-- Connection ports (bottom of each module) -->
      <circle cx="${left + 10}" cy="${bottom - 10}" r="2.5"
        fill="currentColor"/>
      <line x1="${left + 10}" y1="${bottom - 5}" x2="${left + 10}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>

      <circle cx="${cx}" cy="${bottom - 10}" r="2.5"
        fill="currentColor"/>
      <line x1="${cx}" y1="${bottom - 5}" x2="${cx}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>

      <circle cx="${right - 10}" cy="${bottom - 10}" r="2.5"
        fill="currentColor"/>
      <line x1="${right - 10}" y1="${bottom - 5}" x2="${right - 10}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Module numbers -->
      <text x="${left + 10}" y="${top + 12}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">1</text>
      <text x="${cx}" y="${top + 12}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">2</text>
      <text x="${right - 10}" y="${top + 12}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">3</text>
    `;
  }
);

/**
 * Cartridge Manifold (ISO 1219-2)
 * Cavity for cartridge valve insertion
 */
export const manifoldCartridge = createSymbol(
  'MANIFOLD_CARTRIDGE',
  55,
  60,
  [
    { x: 27.5, y: 0, name: 'PORT_A' },
    { x: 0, y: 30, name: 'PORT_P' },
    { x: 55, y: 30, name: 'PORT_T' },
    { x: 27.5, y: 60, name: 'PORT_B' },
  ],
  (cx, cy) => {
    const left = cx - 27.5;
    const right = cx + 27.5;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Manifold body with cartridge cavity -->
      <rect x="${left}" y="${top + 10}" width="55" height="40"
        fill="none" stroke="currentColor" stroke-width="2.5"/>

      <!-- Cartridge cavity (circular bore) -->
      <circle cx="${cx}" cy="${cy}" r="15"
        fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5,3"/>
      <circle cx="${cx}" cy="${cy}" r="12"
        fill="none" stroke="currentColor" stroke-width="1"/>

      <!-- Threaded cavity indicator -->
      <path d="M ${cx - 10},${cy - 10} Q ${cx - 8},${cy - 12} ${cx - 6},${cy - 10}"
        fill="none" stroke="currentColor" stroke-width="0.8"/>
      <path d="M ${cx - 10},${cy - 6} Q ${cx - 8},${cy - 8} ${cx - 6},${cy - 6}"
        fill="none" stroke="currentColor" stroke-width="0.8"/>
      <path d="M ${cx - 10},${cy - 2} Q ${cx - 8},${cy - 4} ${cx - 6},${cy - 2}"
        fill="none" stroke="currentColor" stroke-width="0.8"/>

      <!-- Port A (top) -->
      <circle cx="${cx}" cy="${top + 10}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${top - 5}" x2="${cx}" y2="${top + 7}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${top + 13}" x2="${cx}" y2="${cy - 15}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Port P (left) -->
      <circle cx="${left}" cy="${cy}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left - 5}" y1="${cy}" x2="${left - 3}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${left + 3}" y1="${cy}" x2="${cx - 15}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Port T (right) -->
      <circle cx="${right}" cy="${cy}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right + 3}" y1="${cy}" x2="${right + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${right - 3}" y1="${cy}" x2="${cx + 15}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Port B (bottom) -->
      <circle cx="${cx}" cy="${bottom - 10}" r="3"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${bottom + 5}" x2="${cx}" y2="${bottom - 7}"
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${bottom - 13}" x2="${cx}" y2="${cy + 15}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>

      <!-- Cavity label -->
      <text x="${cx + 18}" y="${cy + 5}" font-size="7" font-weight="bold"
        text-anchor="start" fill="currentColor">CV</text>
    `;
  }
);
