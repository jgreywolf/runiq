import { createSymbol } from '../symbol.ts';

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
