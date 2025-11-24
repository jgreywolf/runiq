import { createSymbol } from '../symbol.ts';

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
