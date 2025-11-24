// ============================================================================
// ISO 1219-1 Pneumatic Actuator Symbols
// ============================================================================

import { createSymbol } from '../symbol.ts';

/**
 * Single-Acting Cylinder (spring return)
 * ISO 1219-1 standard pneumatic cylinder
 */
export const cylinderSingleActing = createSymbol(
  'CYL_SA',
  60,
  30,
  [
    { x: 0, y: 15, name: 'piston' },
    { x: 30, y: 30, name: 'port_A' },
    { x: 50, y: 30, name: 'exhaust' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const top = cy - 15;
    const bottom = cy + 15;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 10}" y="${top}" width="40" height="20"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- piston rod line -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle -->
      <circle cx="${cx}" cy="${bottom}" r="2" fill="currentColor"/>

      <!-- Exhaust port circle -->
      <circle cx="${cx + 20}" cy="${bottom}" r="2" fill="currentColor"/>

      <!-- spring return indicator (zigzag) -->
      <path d="M ${left + 45},${top + 5} l 2,-2 l 2,4 l 2,-4 l 2,4 l 2,-4 l 2,2"
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx}" y="${cy - 5}" font-size="8" text-anchor="middle" fill="currentColor">spring</text>
    `;
  }
);

/**
 * Double-Acting Cylinder (no spring)
 * ISO 1219-1 standard pneumatic cylinder
 */
export const cylinderDoubleActing = createSymbol(
  'CYL_DA',
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
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- piston rod line -->
      <line x1="${left}" y1="${cy}" x2="${left + 10}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle (left) -->
      <circle cx="${cx - 10}" cy="${bottom}" r="2" fill="currentColor"/>

      <!-- Port B circle (right) -->
      <circle cx="${cx + 10}" cy="${bottom}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Rodless Cylinder - Magnetic or cable coupling
 * ISO 1219-1 standard pneumatic actuator
 */
export const cylinderRodless = createSymbol(
  'CYL_RODLESS',
  70,
  35,
  [
    { x: 20, y: 35, name: 'port_A' },
    { x: 50, y: 35, name: 'port_B' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const top = cy - 17.5;
    const bottom = cy + 17.5;

    return `
      <!-- Cylinder body -->
      <rect x="${left + 5}" y="${top + 5}" width="60" height="15"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Carriage/slide block (on top) -->
      <rect x="${cx - 8}" y="${top - 2}" width="16" height="10"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Magnetic coupling indicator (M) -->
      <text x="${cx}" y="${top + 4}" font-size="8" font-weight="bold"
        text-anchor="middle" fill="currentColor">M</text>

      <!-- Port A circle -->
      <circle cx="${cx - 15}" cy="${bottom}" r="2" fill="currentColor"/>

      <!-- Port B circle -->
      <circle cx="${cx + 15}" cy="${bottom}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Telescopic Cylinder - Multi-stage for compact installation
 * ISO 1219-1 standard pneumatic actuator
 */
export const cylinderTelescopic = createSymbol(
  'CYL_TELESCOPIC',
  70,
  35,
  [
    { x: 0, y: 17.5, name: 'rod_end' },
    { x: 35, y: 35, name: 'port_A' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const top = cy - 17.5;
    const bottom = cy + 17.5;

    return `
      <!-- Outer cylinder stage -->
      <rect x="${left + 15}" y="${top}" width="50" height="25"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Middle stage -->
      <rect x="${left + 5}" y="${top + 5}" width="40" height="15"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Inner rod -->
      <line x1="${left}" y1="${cy}" x2="${left + 15}" y2="${cy}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port A circle -->
      <circle cx="${cx}" cy="${bottom}" r="2" fill="currentColor"/>

      <!-- Label -->
      <text x="${cx + 10}" y="${cy - 10}" font-size="7" text-anchor="middle" fill="currentColor">TELE</text>
    `;
  }
);

/**
 * Rotary Actuator - Limited rotation (vane type)
 * ISO 1219-1 standard pneumatic actuator
 */
export const rotaryActuator = createSymbol(
  'ROTARY_ACTUATOR',
  50,
  50,
  [
    { x: 10, y: 50, name: 'port_A' },
    { x: 40, y: 50, name: 'port_B' },
    { x: 25, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 20;

    return `
      <!-- Rotary actuator body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vane indicator (partial circle arc) -->
      <path d="M ${cx - 10},${cy} A 10,10 0 0 1 ${cx + 10},${cy}"
        stroke="currentColor" stroke-width="2" fill="none"/>

      <!-- Rotation indicator (arc with arrows) -->
      <path d="M ${cx - 15},${cy - 5} A 16,16 0 0 1 ${cx + 15},${cy - 5}"
        stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
      <polygon points="${cx - 15},${cy - 5} ${cx - 12},${cy - 8} ${cx - 12},${cy - 2}"
        fill="currentColor"/>
      <polygon points="${cx + 15},${cy - 5} ${cx + 12},${cy - 2} ${cx + 12},${cy - 8}"
        fill="currentColor"/>

      <!-- Output shaft -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port connections -->
      <circle cx="${cx - 15}" cy="${cy + radius + 5}" r="2" fill="currentColor"/>
      <circle cx="${cx + 15}" cy="${cy + radius + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Pneumatic Motor - Continuous rotation
 * ISO 1219-1 standard pneumatic actuator
 */
export const motorPneumatic = createSymbol(
  'MOTOR_PNEUMATIC',
  50,
  50,
  [
    { x: 10, y: 50, name: 'port_A' },
    { x: 40, y: 50, name: 'port_B' },
    { x: 25, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 20;

    return `
      <!-- Motor body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${radius}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- M label -->
      <text x="${cx}" y="${cy + 6}" font-size="16" font-weight="bold"
        text-anchor="middle" fill="currentColor">M</text>

      <!-- Rotation arrows (full circle) -->
      <path d="M ${cx + radius - 5},${cy} A ${radius - 5},${radius - 5} 0 1 1 ${cx + radius - 5},${cy - 0.1}"
        stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
      <polygon points="${cx + radius - 5},${cy} ${cx + radius - 8},${cy - 3} ${cx + radius - 8},${cy + 3}"
        fill="currentColor"/>

      <!-- Output shaft -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 5}"
        stroke="currentColor" stroke-width="2"/>

      <!-- Port connections -->
      <circle cx="${cx - 15}" cy="${cy + radius + 5}" r="2" fill="currentColor"/>
      <circle cx="${cx + 15}" cy="${cy + radius + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Parallel Gripper - Two-jaw parallel grip
 * ISO 1219-1 standard pneumatic end effector
 */
export const gripperParallel = createSymbol(
  'GRIPPER_PARALLEL',
  50,
  40,
  [{ x: 25, y: 40, name: 'port' }],
  (cx, cy) => {
    const width = 40;
    const height = 30;

    return `
      <!-- Gripper body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height / 2}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Left jaw -->
      <rect x="${cx - width / 2 - 5}" y="${cy - height / 2}"
        width="5" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <polygon points="${cx - width / 2 - 5},${cy - height / 2}
                       ${cx - width / 2 - 10},${cy - height / 2 - 5}
                       ${cx - width / 2 - 10},${cy + height / 2 + 5}
                       ${cx - width / 2 - 5},${cy + height / 2}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right jaw -->
      <rect x="${cx + width / 2}" y="${cy - height / 2}"
        width="5" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <polygon points="${cx + width / 2 + 5},${cy - height / 2}
                       ${cx + width / 2 + 10},${cy - height / 2 - 5}
                       ${cx + width / 2 + 10},${cy + height / 2 + 5}
                       ${cx + width / 2 + 5},${cy + height / 2}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Movement arrows -->
      <line x1="${cx - 12}" y1="${cy}" x2="${cx - 8}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
      <polygon points="${cx - 8},${cy} ${cx - 11},${cy - 2} ${cx - 11},${cy + 2}"
        fill="currentColor"/>
      <line x1="${cx + 12}" y1="${cy}" x2="${cx + 8}" y2="${cy}"
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
      <polygon points="${cx + 8},${cy} ${cx + 11},${cy - 2} ${cx + 11},${cy + 2}"
        fill="currentColor"/>

      <!-- Port connection -->
      <circle cx="${cx}" cy="${cy + height / 2 + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Angular Gripper - Pivoting jaw grip
 * ISO 1219-1 standard pneumatic end effector
 */
export const gripperAngular = createSymbol(
  'GRIPPER_ANGULAR',
  50,
  40,
  [{ x: 25, y: 40, name: 'port' }],
  (cx, cy) => {
    const width = 40;
    const height = 30;

    return `
      <!-- Gripper body -->
      <rect x="${cx - width / 2}" y="${cy - height / 2}"
        width="${width}" height="${height / 2}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Left jaw (angled) -->
      <line x1="${cx - width / 2}" y1="${cy - height / 4}"
            x2="${cx - width / 2 - 10}" y2="${cy + height / 2}"
        stroke="currentColor" stroke-width="3"/>
      <polygon points="${cx - width / 2 - 10},${cy + height / 2}
                       ${cx - width / 2 - 15},${cy + height / 2 - 5}
                       ${cx - width / 2 - 12},${cy + height / 2 + 3}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Right jaw (angled) -->
      <line x1="${cx + width / 2}" y1="${cy - height / 4}"
            x2="${cx + width / 2 + 10}" y2="${cy + height / 2}"
        stroke="currentColor" stroke-width="3"/>
      <polygon points="${cx + width / 2 + 10},${cy + height / 2}
                       ${cx + width / 2 + 15},${cy + height / 2 - 5}
                       ${cx + width / 2 + 12},${cy + height / 2 + 3}"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Pivot points -->
      <circle cx="${cx - width / 2}" cy="${cy - height / 4}" r="2" fill="currentColor"/>
      <circle cx="${cx + width / 2}" cy="${cy - height / 4}" r="2" fill="currentColor"/>

      <!-- Port connection -->
      <circle cx="${cx}" cy="${cy + height / 2 + 5}" r="2" fill="currentColor"/>
    `;
  }
);

/**
 * Vacuum Gripper - Suction cup handling
 * ISO 1219-1 standard pneumatic end effector
 */
export const gripperVacuum = createSymbol(
  'GRIPPER_VACUUM',
  40,
  40,
  [{ x: 20, y: 0, name: 'vacuum_port' }],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Suction cup body (inverted dome) -->
      <path d="M ${cx - radius},${cy}
               Q ${cx - radius},${cy + radius} ${cx},${cy + radius}
               Q ${cx + radius},${cy + radius} ${cx + radius},${cy}
               L ${cx + radius - 5},${cy - 5}
               Q ${cx},${cy + radius - 10} ${cx - radius + 5},${cy - 5}
               Z"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum connection pipe -->
      <rect x="${cx - 3}" y="${cy - radius - 10}" width="6" height="10"
        stroke="currentColor" stroke-width="2" fill="white"/>

      <!-- Vacuum indicator (V) -->
      <text x="${cx}" y="${cy + 6}" font-size="10" font-weight="bold"
        text-anchor="middle" fill="currentColor">V</text>

      <!-- Connection line -->
      <line x1="${cx}" y1="${cy - radius - 10}" x2="${cx}" y2="${cy - radius - 15}"
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);
