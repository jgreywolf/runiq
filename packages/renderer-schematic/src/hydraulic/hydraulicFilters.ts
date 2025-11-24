import { createSymbol } from '../symbol.ts';

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
