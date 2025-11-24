import { createSymbol } from '../symbol.ts';

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
 * Single Rod Cylinder
 * Standard differential area cylinder with one piston rod
 */
export const cylinderSingleRod = createSymbol(
  'CYL_SINGLE_ROD',
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
        stroke="currentColor" stroke-width="2.5" fill="none"/>

      <!-- Single piston rod (left side only) -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Piston indicator (vertical line in cylinder) -->
      <line x1="${cx - 5}" y1="${top + 2}" x2="${cx - 5}" y2="${bottom - 2}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle (left - rod side) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle (right - cap side) -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * Double Rod Cylinder
 * Equal area both sides with rods on both ends
 */
export const cylinderDoubleRod = createSymbol(
  'CYL_DOUBLE_ROD',
  70,
  30,
  [
    { x: 0, y: 15, name: 'rod_left' },
    { x: 70, y: 15, name: 'rod_right' },
    { x: 25, y: 30, name: 'port_A' },
    { x: 45, y: 30, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 15;
    const bottom = cy + 15;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top}" width="50" height="20"
        stroke="currentColor" stroke-width="2.5" fill="none"/>

      <!-- Left piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Right piston rod -->
      <line x1="${right - 10}" y1="${cy}" x2="${right}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Piston indicator (vertical line in cylinder) -->
      <line x1="${cx}" y1="${top + 2}" x2="${cx}" y2="${bottom - 2}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle (left) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle (right) -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * Telescopic Cylinder
 * Multi-stage long stroke cylinder
 */
export const cylinderTelescopic = createSymbol(
  'CYL_TELESCOPIC',
  70,
  35,
  [
    { x: 0, y: 17, name: 'piston' },
    { x: 30, y: 35, name: 'port_A' },
    { x: 60, y: 35, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const top = cy - 17;
    const bottom = cy + 17;

    return `
      <!-- Main cylinder body (largest stage) -->
      <rect x="${left + 30}" y="${top}" width="40" height="25"
        stroke="currentColor" stroke-width="2.5" fill="none"/>

      <!-- Middle stage -->
      <rect x="${left + 15}" y="${top + 3}" width="15" height="19"
        stroke="currentColor" stroke-width="2"/>

      <!-- Inner stage (smallest) -->
      <rect x="${left + 5}" y="${top + 6}" width="10" height="13"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Extended piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 5}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Port A circle (left) -->
      <circle cx="${cx - 5}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle (right) -->
      <circle cx="${cx + 25}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * Mill Cylinder
 * Heavy duty high force cylinder
 */
export const cylinderMill = createSymbol(
  'CYL_MILL',
  65,
  35,
  [
    { x: 0, y: 17, name: 'piston' },
    { x: 22, y: 35, name: 'port_A' },
    { x: 45, y: 35, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 32;
    const top = cy - 17;
    const bottom = cy + 17;

    return `
      <!-- Heavy cylinder body (thicker walls) -->
      <rect x="${left + 10}" y="${top}" width="45" height="28"
        stroke="currentColor" stroke-width="3.5" fill="none"/>

      <!-- Heavy piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="4"/>

      <!-- Piston (thicker for heavy duty) -->
      <line x1="${cx - 8}" y1="${top + 4}" x2="${cx - 8}" y2="${bottom - 6}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Port A circle (left) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="3" fill="currentColor"/>

      <!-- Port B circle (right) -->
      <circle cx="${cx + 13}" cy="${bottom}" r="3" fill="currentColor"/>
    `;
  }
);

/**
 * Tie-Rod Cylinder
 * Bolt-together economical design
 */
export const cylinderTieRod = createSymbol(
  'CYL_TIE_ROD',
  65,
  35,
  [
    { x: 0, y: 17, name: 'piston' },
    { x: 22, y: 35, name: 'port_A' },
    { x: 45, y: 35, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 32;
    const top = cy - 17;
    const bottom = cy + 17;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top + 3}" width="45" height="22"
        stroke="currentColor" stroke-width="2.5" fill="none"/>

      <!-- Tie rod indicators (top and bottom lines outside body) -->
      <line x1="${left + 12}" y1="${top}" x2="${left + 53}" y2="${top}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 12}" y1="${bottom - 3}" x2="${left + 53}" y2="${bottom - 3}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Tie rod end caps (small circles) -->
      <circle cx="${left + 12}" cy="${top}" r="1.5" fill="currentColor"/>
      <circle cx="${left + 53}" cy="${top}" r="1.5" fill="currentColor"/>
      <circle cx="${left + 12}" cy="${bottom - 3}" r="1.5" fill="currentColor"/>
      <circle cx="${left + 53}" cy="${bottom - 3}" r="1.5" fill="currentColor"/>

      <!-- Piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Port A circle -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle -->
      <circle cx="${cx + 13}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * Welded Cylinder
 * Heavy duty mobile equipment cylinder
 */
export const cylinderWelded = createSymbol(
  'CYL_WELDED',
  60,
  32,
  [
    { x: 0, y: 16, name: 'piston' },
    { x: 20, y: 32, name: 'port_A' },
    { x: 40, y: 32, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 16;
    const bottom = cy + 16;

    return `
      <!-- Welded cylinder body (no tie rods, solid construction) -->
      <rect x="${left + 10}" y="${top}" width="40" height="24"
        stroke="currentColor" stroke-width="3" fill="none"/>

      <!-- Weld indicator marks (small diagonal lines at corners) -->
      <line x1="${left + 10}" y1="${top}" x2="${left + 12}" y2="${top + 2}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 50}" y1="${top}" x2="${left + 48}" y2="${top + 2}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 10}" y1="${bottom - 8}" x2="${left + 12}" y2="${bottom - 10}"
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 50}" y1="${bottom - 8}" x2="${left + 48}" y2="${bottom - 10}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Heavy piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="3"/>

      <!-- Port A circle -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);

/**
 * Position Feedback Cylinder
 * Cylinder with integrated position sensor
 */
export const cylinderFeedback = createSymbol(
  'CYL_FEEDBACK',
  70,
  40,
  [
    { x: 0, y: 20, name: 'piston' },
    { x: 25, y: 40, name: 'port_A' },
    { x: 50, y: 40, name: 'port_B' },
    { x: 60, y: 0, name: 'feedback' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top + 5}" width="50" height="20"
        stroke="currentColor" stroke-width="2.5" fill="none"/>

      <!-- Piston rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2.5"/>

      <!-- Position sensor (rectangular module on top) -->
      <rect x="${cx + 10}" y="${top}" width="16" height="8"
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <text x="${cx + 18}" y="${top + 6}" font-size="5" text-anchor="middle" fill="currentColor">POS</text>

      <!-- Sensor connection line -->
      <line x1="${cx + 18}" y1="${top}" x2="${cx + 18}" y2="${top - 5}"
        stroke="currentColor" stroke-width="1.5"/>

      <!-- Piston indicator -->
      <line x1="${cx}" y1="${top + 7}" x2="${cx}" y2="${bottom - 15}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2.5" fill="currentColor"/>

      <!-- Port B circle -->
      <circle cx="${cx + 15}" cy="${bottom}" r="2.5" fill="currentColor"/>
    `;
  }
);
