import { createSymbol } from '../symbol.ts';

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
