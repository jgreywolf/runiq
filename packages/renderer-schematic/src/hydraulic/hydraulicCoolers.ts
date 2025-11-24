import { createSymbol } from '../symbol.ts';

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
