// ============================================================================
// ISO 1219-1 Pneumatic Valve Symbols
// ============================================================================

import { createSymbol } from '../symbol.ts';

/**
 * 2/2-Way Valve (2 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve22Way = createSymbol(
  'VALVE_22',
  40,
  50,
  [
    { x: 15, y: 50, name: 'P' },
    { x: 25, y: 50, name: 'A' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    //const right = cx + 20;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box (normally closed) -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box (open) -->
      <rect x="${cx}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Flow arrows in left position (blocked) -->
      <line x1="${left + 10}" y1="${top + 15}" x2="${left + 10}" y2="${top + 35}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 5}" y1="${top + 40}" x2="${left + 10}" y2="${top + 35}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 15}" y1="${top + 40}" x2="${left + 10}" y2="${top + 35}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Flow arrows in right position (open) -->
      <line x1="${cx + 10}" y1="${top + 10}" x2="${cx + 10}" y2="${bottom - 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx + 10},${bottom - 10} ${cx + 6},${bottom - 16} ${cx + 14},${bottom - 16}"
        fill="currentColor"/>

      <!-- Port P connection -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2"/>
      <circle cx="${left + 5}" cy="${bottom + 5}" r="2" fill="currentColor"/>

      <!-- Port A connection -->
      <line x1="${left + 15}" y1="${bottom}" x2="${left + 15}" y2="${bottom + 5}"
        stroke="currentColor" stroke-width="2"/>
      <circle cx="${left + 15}" cy="${bottom + 5}" r="2" fill="currentColor"/>
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
      <!-- Left position box -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box -->
      <rect x="${cx}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Flow arrows in left position (P->A) -->
      <line x1="${left + 5}" y1="${bottom - 10}" x2="${left + 10}" y2="${top + 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 10},${top + 10} ${left + 8},${top + 15} ${left + 12},${top + 15}"
        fill="currentColor"/>

      <!-- Flow arrows in right position (A->R) -->
      <line x1="${cx + 10}" y1="${top + 10}" x2="${cx + 15}" y2="${bottom - 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${cx + 15},${bottom - 10} ${cx + 13},${bottom - 15} ${cx + 17},${bottom - 15}"
        fill="currentColor"/>

      <!-- Port P connection -->
      <circle cx="${left + 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>

      <!-- Port A connection -->
      <circle cx="${cx}" cy="${bottom + 5}" r="2" fill="currentColor"/>

      <!-- Port R connection -->
      <circle cx="${right - 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 4/2-Way Valve (4 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve42Way = createSymbol(
  'VALVE_42',
  40,
  50,
  [
    { x: 8, y: 50, name: 'P' },
    { x: 16, y: 50, name: 'A' },
    { x: 24, y: 50, name: 'B' },
    { x: 32, y: 50, name: 'R' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const right = cx + 20;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box -->
      <rect x="${cx}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Flow paths in left position (P->A, B->R) -->
      <line x1="${left + 4}" y1="${bottom - 5}" x2="${left + 8}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 8},${top + 5} ${left + 6},${top + 10} ${left + 10},${top + 10}"
        fill="currentColor"/>
      <line x1="${left + 12}" y1="${bottom - 5}" x2="${left + 16}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 16},${top + 5} ${left + 14},${top + 10} ${left + 18},${top + 10}"
        fill="currentColor"/>

      <!-- Flow paths in right position (P->B, A->R) -->
      <line x1="${cx + 4}" y1="${bottom - 5}" x2="${cx + 16}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${bottom - 5}" x2="${cx + 4}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port connections -->
      <circle cx="${left + 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 10}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 18}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${right - 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 5/2-Way Valve (5 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve52Way = createSymbol(
  'VALVE_52',
  50,
  50,
  [
    { x: 8, y: 50, name: 'P' },
    { x: 18, y: 50, name: 'A' },
    { x: 28, y: 50, name: 'B' },
    { x: 38, y: 50, name: 'RA' },
    { x: 48, y: 50, name: 'RB' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box (P->A, B->RB) -->
      <rect x="${left}" y="${top}" width="25" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box (P->B, A->RA) -->
      <rect x="${cx}" y="${top}" width="25" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Flow paths in left position -->
      <line x1="${left + 4}" y1="${bottom - 5}" x2="${left + 10}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 10},${top + 5} ${left + 8},${top + 10} ${left + 12},${top + 10}"
        fill="currentColor"/>
      <line x1="${left + 15}" y1="${bottom - 5}" x2="${left + 21}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 21},${top + 5} ${left + 19},${top + 10} ${left + 23},${top + 10}"
        fill="currentColor"/>

      <!-- Flow paths in right position -->
      <line x1="${cx + 4}" y1="${bottom - 5}" x2="${cx + 16}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 10}" y1="${bottom - 5}" x2="${cx + 4}" y2="${top + 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port connections -->
      <circle cx="${left + 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 12}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 22}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${right - 10}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${right - 2}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 5/3-Way Valve - All Ports Closed Center
 * ISO 1219-1 standard directional control valve
 */
export const valve53ClosedCenter = createSymbol(
  'VALVE_53_CLOSED',
  60,
  50,
  [
    { x: 10, y: 50, name: 'P' },
    { x: 20, y: 50, name: 'A' },
    { x: 30, y: 50, name: 'B' },
    { x: 40, y: 50, name: 'RA' },
    { x: 50, y: 50, name: 'RB' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Center position box (all closed) -->
      <rect x="${left + 20}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box -->
      <rect x="${left + 40}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- All ports closed in center (X marks) -->
      <line x1="${left + 22}" y1="${top + 20}" x2="${left + 28}" y2="${top + 30}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 28}" y1="${top + 20}" x2="${left + 22}" y2="${top + 30}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 32}" y1="${top + 20}" x2="${left + 38}" y2="${top + 30}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 38}" y1="${top + 20}" x2="${left + 32}" y2="${top + 30}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port connections -->
      <circle cx="${left + 4}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 14}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 24}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 34}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 44}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 5/3-Way Valve - Exhaust Center (A/B exhausted)
 * ISO 1219-1 standard directional control valve
 */
export const valve53ExhaustCenter = createSymbol(
  'VALVE_53_EXHAUST',
  60,
  50,
  [
    { x: 10, y: 50, name: 'P' },
    { x: 20, y: 50, name: 'A' },
    { x: 30, y: 50, name: 'B' },
    { x: 40, y: 50, name: 'RA' },
    { x: 50, y: 50, name: 'RB' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Center position box (A/B to exhaust) -->
      <rect x="${left + 20}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box -->
      <rect x="${left + 40}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Exhaust arrows in center position -->
      <line x1="${left + 25}" y1="${bottom - 10}" x2="${left + 25}" y2="${top + 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 25},${top + 10} ${left + 22},${top + 15} ${left + 28},${top + 15}"
        fill="currentColor"/>
      <line x1="${left + 35}" y1="${bottom - 10}" x2="${left + 35}" y2="${top + 10}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 35},${top + 10} ${left + 32},${top + 15} ${left + 38},${top + 15}"
        fill="currentColor"/>

      <!-- Port connections -->
      <circle cx="${left + 4}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 14}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 24}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 34}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 44}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * 5/3-Way Valve - Pressure Center (All pressurized)
 * ISO 1219-1 standard directional control valve
 */
export const valve53PressureCenter = createSymbol(
  'VALVE_53_PRESSURE',
  60,
  50,
  [
    { x: 10, y: 50, name: 'P' },
    { x: 20, y: 50, name: 'A' },
    { x: 30, y: 50, name: 'B' },
    { x: 40, y: 50, name: 'RA' },
    { x: 50, y: 50, name: 'RB' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Left position box -->
      <rect x="${left}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Center position box (all pressurized) -->
      <rect x="${left + 20}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right position box -->
      <rect x="${left + 40}" y="${top}" width="20" height="50"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Pressure distribution in center -->
      <line x1="${left + 24}" y1="${bottom - 5}" x2="${left + 30}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 30}" y1="${cy}" x2="${left + 36}" y2="${bottom - 5}"
        stroke="currentColor" stroke-width="2"/>
      <polygon points="${left + 30},${cy - 3} ${left + 27},${cy + 2} ${left + 33},${cy + 2}"
        fill="currentColor"/>

      <!-- Port connections -->
      <circle cx="${left + 4}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 14}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 24}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 34}" cy="${bottom + 5}" r="2" fill="currentColor"/>
      <circle cx="${left + 44}" cy="${bottom + 5}" r="2" fill="currentColor"/>
    `;
  }
);
