import { createSymbol } from '../symbol.ts';

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
