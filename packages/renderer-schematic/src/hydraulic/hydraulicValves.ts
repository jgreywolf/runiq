import { createSymbol } from '../symbol.ts';
import { renderConnectionLine, renderCircleBody } from '../symbol-utils.ts';

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
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
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
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 31, bottom, left + 31, bottom - 5, { strokeWidth: 2 })}
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
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(cx, bottom, cx, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 43, bottom, left + 43, bottom - 5, { strokeWidth: 2 })}
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

      <!-- Flow paths in left position (P→A, B→T) -->
      <line x1="${left + 8}" y1="${cy - 4}" x2="${left + 16}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left + 16},${cy - 7} ${left + 16},${cy - 1} ${left + 19},${cy - 4}"
        fill="currentColor"/>
      <line x1="${left + 8}" y1="${cy + 4}" x2="${left + 16}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${left + 16},${cy + 1} ${left + 16},${cy + 7} ${left + 19},${cy + 4}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 18, bottom, left + 18, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 38, bottom, left + 38, bottom - 5, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 51, bottom, left + 51, bottom - 5, { strokeWidth: 2 })}
    `;
  }
);

/**
 * 4/3-Way Valve - Closed Center
 * All ports blocked in center position
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
      <!-- Position boxes -->
      <rect x="${left}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 22}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 44}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Closed center indicator (X symbol) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
    `;
  }
);

/**
 * 4/3-Way Valve - Open Center
 * All ports connected to tank in center position
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
      <!-- Position boxes -->
      <rect x="${left}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 22}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 44}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Open center indicator (flow paths to T) -->
      <line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 12},${cy - 3} ${cx + 12},${cy + 3} ${cx + 15},${cy}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
    `;
  }
);

/**
 * 4/3-Way Valve - Tandem Center
 * Pump to tank, work ports blocked
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
      <!-- Position boxes -->
      <rect x="${left}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 22}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 44}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Tandem center indicator (P→T only) -->
      <line x1="${cx - 8}" y1="${cy - 6}" x2="${cx - 2}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx - 2},${cy - 9} ${cx - 2},${cy - 3} ${cx + 1},${cy - 6}"
        fill="currentColor"/>
      <!-- A and B blocked -->
      <line x1="${cx + 2}" y1="${cy}" x2="${cx + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 5}" y1="${cy - 3}" x2="${cx + 5}" y2="${cy + 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
    `;
  }
);

/**
 * 4/3-Way Valve - Float Center
 * Work ports to tank, pump blocked
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
      <!-- Position boxes -->
      <rect x="${left}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 22}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <rect x="${left + 44}" y="${top + 10}" width="22" height="30"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Float center indicator (A→T, B→T) -->
      <line x1="${cx - 8}" y1="${cy - 4}" x2="${cx - 2}" y2="${cy - 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx - 2},${cy - 7} ${cx - 2},${cy - 1} ${cx + 1},${cy - 4}"
        fill="currentColor"/>
      <line x1="${cx - 8}" y1="${cy + 4}" x2="${cx - 2}" y2="${cy + 4}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx - 2},${cy + 1} ${cx - 2},${cy + 7} ${cx + 1},${cy + 4}"
        fill="currentColor"/>

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
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
      ${renderConnectionLine(cx, top + 2, cx, top - 2, { strokeWidth: 1.5 })}

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
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
      ${renderCircleBody(cx, top + 7, 7, { strokeWidth: 1.5 })}
      <line x1="${cx - 4}" y1="${top + 7}" x2="${cx + 4}" y2="${top + 7}"
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx}" y1="${top + 3}" x2="${cx}" y2="${top + 11}"
        stroke="currentColor" stroke-width="1"/>
      ${renderConnectionLine(cx, top, cx, top - 2, { strokeWidth: 1.5 })}

      <!-- Port connection lines -->
      ${renderConnectionLine(left + 5, bottom, left + 5, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(left + 20, bottom, left + 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 20, bottom, right - 20, bottom - 2, { strokeWidth: 2 })}
      ${renderConnectionLine(right - 5, bottom, right - 5, bottom - 2, { strokeWidth: 2 })}
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
  40,
  [
    { x: 20, y: 40, name: 'in' },
    { x: 20, y: 0, name: 'out' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve body (diamond) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Spring symbol above -->
      <path d="M ${cx - 3},${cy - size - 2} L ${cx + 3},${cy - size - 4} L ${cx - 3},${cy - size - 6} L ${cx + 3},${cy - size - 8}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      ${renderConnectionLine(cx, cy - size - 8, cx, cy - size - 12, { strokeWidth: 1.5 })}

      <!-- Ports -->
      ${renderConnectionLine(cx, cy + size, cx, cy + size + 8)}
      ${renderConnectionLine(cx, cy - size - 12, cx, cy - size - 20)}
    `;
  }
);

/**
 * Pressure Reducing Valve
 * ISO 1219-2 standard pressure regulator
 */
export const pressureReducingValve = createSymbol(
  'REDUCING_VALVE',
  40,
  40,
  [
    { x: 20, y: 40, name: 'in' },
    { x: 20, y: 0, name: 'out' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve body (diamond) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Spring symbol below (pressure sense) -->
      <path d="M ${cx - 3},${cy + size + 2} L ${cx + 3},${cy + size + 4} L ${cx - 3},${cy + size + 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      ${renderConnectionLine(cx, cy + size + 6, cx, cy + size + 8, { strokeWidth: 1.5 })}

      <!-- Ports -->
      ${renderConnectionLine(cx, cy - size, cx, cy - size - 8)}
      ${renderConnectionLine(cx, cy + size + 8, cx, cy + size + 12)}
    `;
  }
);

/**
 * Flow Control Valve (Hydraulic)
 * Variable flow restrictor
 */
export const flowControlHydraulic = createSymbol(
  'FLOW_CONTROL_HYD',
  40,
  40,
  [
    { x: 20, y: 40, name: 'in' },
    { x: 20, y: 0, name: 'out' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve body (diamond with variable orifice) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Variable orifice symbol (arrow through center) -->
      <line x1="${cx - 6}" y1="${cy + 6}" x2="${cx + 6}" y2="${cy - 6}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 6},${cy - 6} ${cx + 3},${cy - 4} ${cx + 4},${cy - 3}"
        fill="currentColor"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy - size, cx, cy - size - 8)}
      ${renderConnectionLine(cx, cy + size, cx, cy + size + 8)}
    `;
  }
);

/**
 * Check Valve (Hydraulic)
 * One-way flow valve
 */
export const checkValveHydraulic = createSymbol(
  'CHECK_VALVE_HYD',
  40,
  40,
  [
    { x: 20, y: 40, name: 'in' },
    { x: 20, y: 0, name: 'out' },
  ],
  (cx, cy) => {
    const size = 10;

    return `
      <!-- Ball seat (circle) -->
      ${renderCircleBody(cx, cy, size / 2, { strokeWidth: 2 })}

      <!-- Check valve triangle -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy + size} ${cx - size},${cy + size}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Seat line -->
      <line x1="${cx - size - 2}" y1="${cy + size}" x2="${cx + size + 2}" y2="${cy + size}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy - size - 5, cx, cy - size - 13)}
      ${renderConnectionLine(cx, cy + size + 8, cx, cy + size + 13)}
    `;
  }
);

/**
 * Direct-acting Relief Valve
 * Simple spring-loaded safety valve
 */
export const reliefValveDirect = createSymbol(
  'RELIEF_DIRECT',
  45,
  55,
  [
    { x: 22, y: 55, name: 'inlet' },
    { x: 22, y: 0, name: 'tank' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve seat (diamond) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Ball/poppet indicator -->
      ${renderCircleBody(cx, cy - 3, 4, { strokeWidth: 1.5 })}

      <!-- Adjustment screw at top -->
      <rect x="${cx - 4}" y="${cy - size - 12}" width="8" height="8"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      ${renderConnectionLine(cx, cy - size - 12, cx, cy - size - 4, { strokeWidth: 1.5 })}

      <!-- Spring -->
      <path d="M ${cx - 3},${cy - size} L ${cx + 3},${cy - size - 2} L ${cx - 3},${cy - size - 4} L ${cx + 3},${cy - size - 6} L ${cx - 3},${cy - size - 8} L ${cx},${cy - size - 10}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Drain to tank symbol -->
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size + 8}" y1="${cy}" x2="${cx + size + 8}" y2="${cy - 15}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Tank symbol (triangle) -->
      <polygon points="${cx + size + 8},${cy - 15} ${cx + size + 4},${cy - 20} ${cx + size + 12},${cy - 20}"
        fill="currentColor"/>

      <!-- Inlet port -->
      ${renderConnectionLine(cx, cy + size, cx, cy + size + 10, { strokeWidth: 2 })}
    `;
  }
);

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
 * Pilot-operated Relief Valve
 * Two-stage pressure relief
 */
export const reliefValvePilot = createSymbol(
  'RELIEF_PILOT',
  60,
  65,
  [
    { x: 20, y: 65, name: 'inlet' },
    { x: 40, y: 0, name: 'tank' },
  ],
  (cx, cy) => {
    const mainSize = 12;
    const pilotSize = 8;

    return `
      <!-- Main stage (diamond) -->
      <polygon points="${cx - 10},${cy - mainSize} ${cx - 10 + mainSize},${cy} ${cx - 10},${cy + mainSize} ${cx - 10 - mainSize},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Pilot stage (small diamond, offset) -->
      <polygon points="${cx + 15},${cy - pilotSize - 10} ${cx + 15 + pilotSize},${cy - 10} ${cx + 15},${cy + pilotSize - 10} ${cx + 15 - pilotSize},${cy - 10}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Pilot spring -->
      <path d="M ${cx + 12},${cy - pilotSize - 12} L ${cx + 18},${cy - pilotSize - 14} L ${cx + 12},${cy - pilotSize - 16}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      ${renderConnectionLine(cx + 15, cy - pilotSize - 16, cx + 15, cy - pilotSize - 20, { strokeWidth: 1.5 })}

      <!-- Pilot line (dashed) connecting to main valve -->
      <line x1="${cx + 15}" y1="${cy - 10 + pilotSize}" x2="${cx + 15}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${cx + 15}" y1="${cy}" x2="${cx - 10 + mainSize}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Tank connection -->
      <line x1="${cx + 15 + pilotSize}" y1="${cy - 10}" x2="${cx + 15 + pilotSize + 8}" y2="${cy - 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx + 23 + pilotSize},${cy - 10} ${cx + 19 + pilotSize},${cy - 15} ${cx + 27 + pilotSize},${cy - 15}"
        fill="currentColor"/>

      <!-- Inlet port -->
      ${renderConnectionLine(cx - 10, cy + mainSize, cx - 10, cy + mainSize + 10, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Unloading Valve
 * Pump unload to tank at low pressure
 */
export const unloadingValve = createSymbol(
  'UNLOADING_VALVE',
  50,
  60,
  [
    { x: 15, y: 60, name: 'pump' },
    { x: 35, y: 60, name: 'tank' },
    { x: 40, y: 0, name: 'pilot' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Main valve body (diamond) -->
      <polygon points="${cx - 10},${cy - size} ${cx - 10 + size},${cy} ${cx - 10},${cy + size} ${cx - 10 - size},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Spring (normally closed) -->
      <path d="M ${cx - 13},${cy - size - 2} L ${cx - 7},${cy - size - 4} L ${cx - 13},${cy - size - 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      ${renderConnectionLine(cx - 10, cy - size - 6, cx - 10, cy - size - 10, { strokeWidth: 1.5 })}

      <!-- Pilot pressure input (right side) -->
      ${renderCircleBody(cx + 10, cy, 6, { strokeWidth: 1.5 })}
      <polygon points="${cx + 10},${cy} ${cx + 7},${cy - 3} ${cx + 7},${cy + 3}"
        fill="currentColor"/>

      <!-- Pilot line connection -->
      ${renderConnectionLine(cx + 10, cy - 6, cx + 10, cy - 20, { strokeWidth: 1, strokeColor: 'currentColor' })}

      <!-- Ports -->
      ${renderConnectionLine(cx - 10, cy + size, cx - 10, cy + size + 10, { strokeWidth: 2 })}
      ${renderConnectionLine(cx + 10, cy, cx + 10, cy + 10, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Sequence Valve
 * Opens when upstream pressure reaches set point
 */
export const sequenceValve = createSymbol(
  'SEQUENCE_VALVE',
  50,
  60,
  [
    { x: 15, y: 60, name: 'primary' },
    { x: 35, y: 60, name: 'secondary' },
    { x: 10, y: 0, name: 'drain' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve body (diamond) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Spring (pressure setting) -->
      <path d="M ${cx - 3},${cy - size - 2} L ${cx + 3},${cy - size - 4} L ${cx - 3},${cy - size - 6} L ${cx + 3},${cy - size - 8}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>

      <!-- Adjustment screw -->
      <rect x="${cx - 3}" y="${cy - size - 14}" width="6" height="6"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      ${renderConnectionLine(cx, cy - size - 14, cx, cy - size - 8, { strokeWidth: 1.5 })}

      <!-- Internal drain indicator -->
      <line x1="${cx - size}" y1="${cy}" x2="${cx - size - 8}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
      <polygon points="${cx - size - 8},${cy} ${cx - size - 12},${cy - 4} ${cx - size - 12},${cy + 4}"
        fill="currentColor"/>

      <!-- Pressure sense line (from inlet) -->
      <line x1="${cx}" y1="${cy + size}" x2="${cx + size + 4}" y2="${cy + size}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${cx + size + 4}" y1="${cy + size}" x2="${cx + size + 4}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy + size, cx, cy + size + 10, { strokeWidth: 2 })}
      ${renderConnectionLine(cx, cy - size, cx, cy - size - 10, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Counterbalance Valve
 * Load holding and overrunning load control
 */
export const counterbalanceValve = createSymbol(
  'COUNTERBALANCE_VALVE',
  55,
  60,
  [
    { x: 15, y: 60, name: 'cylinder' },
    { x: 40, y: 60, name: 'valve' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Check valve (free flow direction) -->
      ${renderCircleBody(cx - 10, cy + 6, 4, { strokeWidth: 1.5 })}
      <polygon points="${cx - 10},${cy + 2} ${cx - 6},${cy + 10} ${cx - 14},${cy + 10}"
        stroke="currentColor" stroke-width="1.5" fill="white"/>

      <!-- Pressure relief (controlled direction) -->
      <polygon points="${cx + 8},${cy - size} ${cx + 8 + size},${cy} ${cx + 8},${cy + size} ${cx + 8 - size},${cy}"
        stroke="currentColor" stroke-width="2.5" fill="white"/>

      <!-- Spring -->
      <path d="M ${cx + 5},${cy - size - 2} L ${cx + 11},${cy - size - 4} L ${cx + 5},${cy - size - 6}"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      ${renderConnectionLine(cx + 8, cy - size - 6, cx + 8, cy - size - 10, { strokeWidth: 1.5 })}

      <!-- Pilot line from opposite end (dashed) -->
      <line x1="${cx - 10}" y1="${cy - 10}" x2="${cx + 8 + size}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Common line connections -->
      <line x1="${cx - 10}" y1="${cy + 10}" x2="${cx - 10}" y2="${cy + 18}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy + size}" x2="${cx + 8}" y2="${cy + 18}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 10}" y1="${cy + 18}" x2="${cx + 8}" y2="${cy + 18}"
        stroke="currentColor" stroke-width="2"/>
      ${renderConnectionLine(cx - 1, cy + 18, cx - 1, cy + 20, { strokeWidth: 2 })}

      <!-- Ports -->
      ${renderConnectionLine(cx - 10, cy - 10, cx - 10, cy - 20, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Brake Valve
 * Load lock and motion control
 */
export const brakeValve = createSymbol(
  'BRAKE_VALVE',
  50,
  60,
  [
    { x: 15, y: 60, name: 'port_A' },
    { x: 35, y: 60, name: 'port_B' },
  ],
  (cx, cy) => {
    const size = 10;

    return `
      <!-- Two check valves (pilot-operated) -->
      ${renderCircleBody(cx - 10, cy, size / 2, { strokeWidth: 1.5 })}
      <polygon points="${cx - 10},${cy - size} ${cx - 10 + size},${cy + size} ${cx - 10 - size},${cy + size}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      ${renderCircleBody(cx + 10, cy, size / 2, { strokeWidth: 1.5 })}
      <polygon points="${cx + 10},${cy - size} ${cx + 10 + size},${cy + size} ${cx + 10 - size},${cy + size}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Seat lines -->
      <line x1="${cx - 10 - size - 2}" y1="${cy + size}" x2="${cx - 10 + size + 2}" y2="${cy + size}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 10 - size - 2}" y1="${cy + size}" x2="${cx + 10 + size + 2}" y2="${cy + size}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Pilot lines (cross-piloted) -->
      <line x1="${cx - 10}" y1="${cy + size + 8}" x2="${cx - 10}" y2="${cy + size + 12}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${cx - 10}" y1="${cy + size + 12}" x2="${cx + 10 + size}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <line x1="${cx + 10}" y1="${cy + size + 8}" x2="${cx + 10}" y2="${cy + size + 12}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${cx + 10}" y1="${cy + size + 12}" x2="${cx - 10 - size}" y2="${cy}"
        stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Ports -->
      ${renderConnectionLine(cx - 10, cy - size - 5, cx - 10, cy - size - 15, { strokeWidth: 2 })}
      ${renderConnectionLine(cx + 10, cy - size - 5, cx + 10, cy - size - 15, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Shuttle Valve
 * OR valve - passes higher of two pressures
 */
export const shuttleValve = createSymbol(
  'SHUTTLE_VALVE',
  50,
  40,
  [
    { x: 0, y: 20, name: 'inlet_A' },
    { x: 50, y: 20, name: 'inlet_B' },
    { x: 25, y: 40, name: 'outlet' },
  ],
  (cx, cy) => {
    const size = 12;

    return `
      <!-- Valve body (circle) -->
      ${renderCircleBody(cx, cy, size, { strokeWidth: 2.5 })}

      <!-- Shuttle (movable ball/piston) -->
      ${renderCircleBody(cx - 3, cy, 4, { strokeWidth: 1.5 })}

      <!-- Ports -->
      ${renderConnectionLine(cx - size, cy, cx - size - 7, cy, { strokeWidth: 2 })}
      ${renderConnectionLine(cx + size, cy, cx + size + 7, cy, { strokeWidth: 2 })}
      ${renderConnectionLine(cx, cy + size, cx, cy + size + 8, { strokeWidth: 2 })}
    `;
  }
);

/**
 * Throttle Valve
 * Adjustable flow restrictor
 */
export const throttleValve = createSymbol(
  'THROTTLE_VALVE',
  40,
  40,
  [
    { x: 20, y: 40, name: 'in' },
    { x: 20, y: 0, name: 'out' },
  ],
  (cx, cy) => {
    return `
      <!-- Orifice symbol (two triangles) -->
      <polygon points="${cx - 12},${cy - 6} ${cx},${cy} ${cx - 12},${cy + 6}"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <polygon points="${cx + 12},${cy - 6} ${cx},${cy} ${cx + 12},${cy + 6}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Adjustment arrow -->
      <line x1="${cx + 8}" y1="${cy - 10}" x2="${cx + 8}" y2="${cy + 10}"
        stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${cx + 8},${cy - 10} ${cx + 5},${cy - 6} ${cx + 11},${cy - 6}"
        fill="currentColor"/>
      <polygon points="${cx + 8},${cy + 10} ${cx + 5},${cy + 6} ${cx + 11},${cy + 6}"
        fill="currentColor"/>

      <!-- Ports -->
      ${renderConnectionLine(cx, cy - 12, cx, cy - 20)}
      ${renderConnectionLine(cx, cy + 12, cx, cy + 20)}
    `;
  }
);
