/**
 * IEEE/IEC Standard Electrical Schematic Symbols
 *
 * This module provides SVG path definitions for standard electrical components
 * following IEEE 315 and IEC 60617 standards.
 */

export interface SymbolDefinition {
  id: string;
  width: number;
  height: number;
  terminals: { x: number; y: number; name: string }[]; // Connection points
  render: (x: number, y: number) => string; // SVG markup
}

/**
 * Create centered symbol at position with proper terminals
 */
function createSymbol(
  id: string,
  width: number,
  height: number,
  terminals: { x: number; y: number; name: string }[],
  render: (cx: number, cy: number) => string
): SymbolDefinition {
  return {
    id,
    width,
    height,
    terminals,
    render: (x: number, y: number) => {
      const cx = x + width / 2;
      const cy = y + height / 2;
      return render(cx, cy);
    },
  };
}

/**
 * Resistor (IEEE style - zigzag)
 */
export const resistor = createSymbol(
  'resistor',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => {
    const left = cx - 30;

    return `
      <path d="M ${left},${cy} l 5,0 l 2.5,-5 l 5,10 l 5,-10 l 5,10 l 5,-10 l 5,10 l 2.5,-5 l 5,0" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
    `;
  }
);

/**
 * Capacitor (two parallel plates)
 */
export const capacitor = createSymbol(
  'capacitor',
  40,
  30,
  [
    { x: 0, y: 15, name: 'left' },
    { x: 40, y: 15, name: 'right' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const right = cx + 20;
    const plateLeft = cx - 3;
    const plateRight = cx + 3;

    return `
      <line x1="${left}" y1="${cy}" x2="${plateLeft}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${plateLeft}" y1="${cy - 10}" x2="${plateLeft}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${plateRight}" y1="${cy - 10}" x2="${plateRight}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${plateRight}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Inductor (coil)
 */
export const inductor = createSymbol(
  'inductor',
  60,
  24,
  [
    { x: 0, y: 12, name: 'left' },
    { x: 60, y: 12, name: 'right' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const arcRadius = 6;

    // Four semicircular arcs forming a coil
    return `
      <path d="M ${left},${cy} 
        a ${arcRadius},${arcRadius} 0 0,1 ${arcRadius * 2},0
        a ${arcRadius},${arcRadius} 0 0,1 ${arcRadius * 2},0
        a ${arcRadius},${arcRadius} 0 0,1 ${arcRadius * 2},0
        a ${arcRadius},${arcRadius} 0 0,1 ${arcRadius * 2},0
        l ${right - (left + arcRadius * 8)},0"
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
    `;
  }
);

/**
 * Voltage Source (circle with + and -)
 */
export const voltageSource = createSymbol(
  'voltage-source',
  40,
  40,
  [
    { x: 0, y: 20, name: 'negative' },
    { x: 40, y: 20, name: 'positive' },
  ],
  (cx, cy) => {
    const radius = 15;
    const left = cx - 20;
    const right = cx + 20;

    return `
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <line x1="${left}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <text x="${cx - 6}" y="${cy + 4}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">+</text>
      <line x1="${cx - radius + 10}" y1="${cy}" x2="${cx - radius + 4}" y2="${cy}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * Current Source (circle with arrow)
 */
export const currentSource = createSymbol(
  'current-source',
  40,
  40,
  [
    { x: 0, y: 20, name: 'negative' },
    { x: 40, y: 20, name: 'positive' },
  ],
  (cx, cy) => {
    const radius = 15;
    const left = cx - 20;
    const right = cx + 20;

    return `
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <line x1="${left}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx},${cy - 8} l -3,3 l 6,0 z" 
        fill="currentColor"/>
    `;
  }
);

/**
 * Ground symbol (IEEE style)
 */
export const ground = createSymbol(
  'ground',
  30,
  25,
  [{ x: 15, y: 0, name: 'terminal' }],
  (cx, cy) => {
    return `
      <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 6}" y1="${cy + 4}" x2="${cx + 6}" y2="${cy + 4}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 3}" y1="${cy + 8}" x2="${cx + 3}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Diode (IEEE style)
 */
export const diode = createSymbol(
  'diode',
  40,
  30,
  [
    { x: 0, y: 15, name: 'anode' },
    { x: 40, y: 15, name: 'cathode' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const right = cx + 20;

    return `
      <line x1="${left}" y1="${cy}" x2="${cx - 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${cx - 8},${cy - 8} l 0,16 l 16,-8 z" 
        fill="currentColor" 
        stroke="currentColor" 
        stroke-width="1"/>
      <line x1="${cx + 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * LED (Light Emitting Diode)
 */
export const led = createSymbol(
  'led',
  40,
  40,
  [
    { x: 0, y: 20, name: 'anode' },
    { x: 40, y: 20, name: 'cathode' },
  ],
  (cx, cy) => {
    const left = cx - 20;
    const right = cx + 20;

    return `
      <line x1="${left}" y1="${cy}" x2="${cx - 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${cx - 8},${cy - 8} l 0,16 l 16,-8 z" 
        fill="white" 
        stroke="currentColor" 
        stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + 8}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Light rays -->
      <path d="M ${cx + 5},${cy - 12} l 3,-3" stroke="currentColor" stroke-width="1"/>
      <path d="M ${cx + 8},${cy - 12} l 3,-4" stroke="currentColor" stroke-width="1"/>
      <path d="M ${cx + 5},${cy - 15} l 3,-3" stroke="currentColor" stroke-width="1"/>
      <path d="M ${cx + 8},${cy - 15} l 3,-4" stroke="currentColor" stroke-width="1"/>
    `;
  }
);

/**
 * Wire junction (connection dot)
 */
export const junction = createSymbol(
  'junction',
  8,
  8,
  [{ x: 4, y: 4, name: 'center' }],
  (cx, cy) => {
    return `<circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/>`;
  }
);

/**
 * NPN Bipolar Junction Transistor (IEEE style)
 * Pins: collector, base, emitter
 */
export const npnTransistor = createSymbol(
  'npn',
  50,
  60,
  [
    { x: 25, y: 0, name: 'collector' },
    { x: 0, y: 30, name: 'base' },
    { x: 25, y: 60, name: 'emitter' },
  ],
  (cx, cy) => {
    const baseX = cx - 25;
    const verticalLine = cx - 10;

    return `
      <!-- Base connection -->
      <line x1="${baseX}" y1="${cy}" x2="${verticalLine}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Vertical base line -->
      <line x1="${verticalLine}" y1="${cy - 15}" x2="${verticalLine}" y2="${cy + 15}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Collector -->
      <line x1="${verticalLine}" y1="${cy - 10}" x2="${cx}" y2="${cy - 30}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy - 30}" x2="${cx}" y2="${cy - 30}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Emitter with arrow -->
      <line x1="${verticalLine}" y1="${cy + 10}" x2="${cx}" y2="${cy + 30}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${cx - 3},${cy + 25} l 3,5 l -6,0 z" 
        fill="currentColor"/>
    `;
  }
);

/**
 * PNP Bipolar Junction Transistor (IEEE style)
 * Pins: collector, base, emitter
 */
export const pnpTransistor = createSymbol(
  'pnp',
  50,
  60,
  [
    { x: 25, y: 60, name: 'collector' },
    { x: 0, y: 30, name: 'base' },
    { x: 25, y: 0, name: 'emitter' },
  ],
  (cx, cy) => {
    const baseX = cx - 25;
    const verticalLine = cx - 10;

    return `
      <!-- Base connection -->
      <line x1="${baseX}" y1="${cy}" x2="${verticalLine}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Vertical base line -->
      <line x1="${verticalLine}" y1="${cy - 15}" x2="${verticalLine}" y2="${cy + 15}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Emitter with arrow (pointing inward for PNP) -->
      <line x1="${cx}" y1="${cy - 30}" x2="${verticalLine}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${verticalLine - 3},${cy - 15} l 0,6 l 6,-3 z" 
        fill="currentColor"/>
      <!-- Collector -->
      <line x1="${verticalLine}" y1="${cy + 10}" x2="${cx}" y2="${cy + 30}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${cy + 30}" x2="${cx}" y2="${cy + 30}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * NMOS Transistor (enhancement mode)
 * Pins: drain, gate, source, bulk
 */
export const nmosTransistor = createSymbol(
  'nmos',
  50,
  60,
  [
    { x: 35, y: 0, name: 'drain' },
    { x: 0, y: 30, name: 'gate' },
    { x: 35, y: 60, name: 'source' },
    { x: 50, y: 30, name: 'bulk' },
  ],
  (cx, cy) => {
    const gateX = cx - 25;
    const channelX = cx - 15;
    const drainSourceX = cx + 10;

    return `
      <!-- Gate -->
      <line x1="${gateX}" y1="${cy}" x2="${channelX}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Gate oxide (vertical line) -->
      <line x1="${channelX}" y1="${cy - 20}" x2="${channelX}" y2="${cy + 20}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Channel segments (broken for enhancement mode) -->
      <line x1="${channelX + 5}" y1="${cy - 18}" x2="${channelX + 5}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${channelX + 5}" y1="${cy - 4}" x2="${channelX + 5}" y2="${cy + 4}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${channelX + 5}" y1="${cy + 8}" x2="${channelX + 5}" y2="${cy + 18}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Drain connection -->
      <line x1="${channelX + 5}" y1="${cy - 15}" x2="${drainSourceX}" y2="${cy - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${drainSourceX}" y1="${cy - 15}" x2="${drainSourceX}" y2="${cy - 30}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Source connection with arrow -->
      <line x1="${channelX + 5}" y1="${cy + 15}" x2="${drainSourceX}" y2="${cy + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${drainSourceX}" y1="${cy + 15}" x2="${drainSourceX}" y2="${cy + 30}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${channelX + 5},${cy + 12} l 0,6 l 6,-3 z" 
        fill="currentColor"/>
      <!-- Bulk connection -->
      <line x1="${drainSourceX}" y1="${cy}" x2="${cx + 25}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * PMOS Transistor (enhancement mode)
 * Pins: drain, gate, source, bulk
 */
export const pmosTransistor = createSymbol(
  'pmos',
  50,
  60,
  [
    { x: 35, y: 60, name: 'drain' },
    { x: 0, y: 30, name: 'gate' },
    { x: 35, y: 0, name: 'source' },
    { x: 50, y: 30, name: 'bulk' },
  ],
  (cx, cy) => {
    const gateX = cx - 25;
    const channelX = cx - 15;
    const drainSourceX = cx + 10;

    return `
      <!-- Gate with bubble (PMOS indicator) -->
      <line x1="${gateX}" y1="${cy}" x2="${channelX - 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <circle cx="${channelX - 2}" cy="${cy}" r="3" 
        stroke="currentColor" stroke-width="1.5" fill="white"/>
      <!-- Gate oxide (vertical line) -->
      <line x1="${channelX}" y1="${cy - 20}" x2="${channelX}" y2="${cy + 20}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Channel segments (broken for enhancement mode) -->
      <line x1="${channelX + 5}" y1="${cy - 18}" x2="${channelX + 5}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${channelX + 5}" y1="${cy - 4}" x2="${channelX + 5}" y2="${cy + 4}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${channelX + 5}" y1="${cy + 8}" x2="${channelX + 5}" y2="${cy + 18}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Source connection with arrow (pointing inward for PMOS) -->
      <line x1="${channelX + 5}" y1="${cy - 15}" x2="${drainSourceX}" y2="${cy - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${drainSourceX}" y1="${cy - 15}" x2="${drainSourceX}" y2="${cy - 30}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${channelX + 8},${cy - 18} l 0,6 l -6,-3 z" 
        fill="currentColor"/>
      <!-- Drain connection -->
      <line x1="${channelX + 5}" y1="${cy + 15}" x2="${drainSourceX}" y2="${cy + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${drainSourceX}" y1="${cy + 15}" x2="${drainSourceX}" y2="${cy + 30}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Bulk connection -->
      <line x1="${drainSourceX}" y1="${cy}" x2="${cx + 25}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Operational Amplifier (IEEE style)
 * Pins: +input, -input, output, V+, V-
 */
export const opamp = createSymbol(
  'opamp',
  60,
  60,
  [
    { x: 0, y: 15, name: 'noninverting' },
    { x: 0, y: 45, name: 'inverting' },
    { x: 60, y: 30, name: 'output' },
    { x: 30, y: 0, name: 'vplus' },
    { x: 30, y: 60, name: 'vminus' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Triangle body -->
      <path d="M ${left},${top + 15} L ${left},${bottom - 15} L ${right},${cy} Z" 
        fill="white" 
        stroke="currentColor" 
        stroke-width="2"/>
      <!-- + input -->
      <line x1="${left + 8}" y1="${top + 15}" x2="${left + 14}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 11}" y1="${top + 12}" x2="${left + 11}" y2="${top + 18}" 
        stroke="currentColor" stroke-width="1.5"/>
      <!-- - input -->
      <line x1="${left + 8}" y1="${bottom - 15}" x2="${left + 14}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="1.5"/>
      <!-- Power supply markers (optional) -->
      <text x="${cx}" y="${top - 2}" font-size="10" text-anchor="middle" fill="currentColor">+</text>
      <text x="${cx}" y="${bottom + 8}" font-size="10" text-anchor="middle" fill="currentColor">−</text>
    `;
  }
);

/**
 * Transformer (two coupled inductors)
 * Pins: primary+, primary-, secondary+, secondary-
 */
export const transformer = createSymbol(
  'transformer',
  80,
  60,
  [
    { x: 20, y: 0, name: 'pri_plus' },
    { x: 20, y: 60, name: 'pri_minus' },
    { x: 60, y: 0, name: 'sec_plus' },
    { x: 60, y: 60, name: 'sec_minus' },
  ],
  (cx, cy) => {
    const pri = cx - 20;
    const sec = cx + 20;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Primary coil -->
      <line x1="${pri}" y1="${top}" x2="${pri}" y2="${top + 5}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${pri - 8},${top + 5} A 8,8 0 0,0 ${pri + 8},${top + 5}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${pri - 8},${top + 13} A 8,8 0 0,0 ${pri + 8},${top + 13}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${pri - 8},${top + 21} A 8,8 0 0,0 ${pri + 8},${top + 21}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${pri - 8},${top + 29} A 8,8 0 0,0 ${pri + 8},${top + 29}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="${pri}" y1="${top + 37}" x2="${pri}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Secondary coil -->
      <line x1="${sec}" y1="${top}" x2="${sec}" y2="${top + 5}" 
        stroke="currentColor" stroke-width="2"/>
      <path d="M ${sec - 8},${top + 5} A 8,8 0 0,0 ${sec + 8},${top + 5}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${sec - 8},${top + 13} A 8,8 0 0,0 ${sec + 8},${top + 13}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${sec - 8},${top + 21} A 8,8 0 0,0 ${sec + 8},${top + 21}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M ${sec - 8},${top + 29} A 8,8 0 0,0 ${sec + 8},${top + 29}" 
        stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="${sec}" y1="${top + 37}" x2="${sec}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Core lines -->
      <line x1="${cx - 8}" y1="${top + 10}" x2="${cx - 8}" y2="${bottom - 10}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 5}" y1="${top + 10}" x2="${cx - 5}" y2="${bottom - 10}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

// ============================================================================
// Digital Logic Gates (IEEE/ANSI standard symbols)
// ============================================================================

/**
 * 2-input AND gate (IEEE distinctive shape)
 */
export const andGate = createSymbol(
  'and',
  60,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 60, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- AND gate body -->
      <path d="M ${left},${top} L ${cx},${top} A 20,20 0 0,1 ${cx},${bottom} L ${left},${bottom} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 12}" x2="${left}" y2="${top + 12}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 12}" x2="${left}" y2="${bottom - 12}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 20}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 2-input OR gate (IEEE distinctive shape)
 */
export const orGate = createSymbol(
  'or',
  60,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 60, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- OR gate body -->
      <path d="M ${left},${top} Q ${left + 10},${cy} ${left},${bottom} Q ${cx},${bottom} ${cx + 20},${cy} Q ${cx},${top} ${left},${top}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 12}" x2="${left}" y2="${top + 12}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 12}" x2="${left}" y2="${bottom - 12}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 20}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * NOT gate (Inverter - triangle with bubble)
 */
export const notGate = createSymbol(
  'not',
  50,
  30,
  [
    { x: 0, y: 15, name: 'A' },
    { x: 50, y: 15, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 15;
    const bottom = cy + 15;
    const bubbleX = cx + 18;

    return `
      <!-- Inverter triangle -->
      <path d="M ${left},${top} L ${left},${bottom} L ${cx + 15},${cy} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input line -->
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 2-input XOR gate (OR gate with additional input line)
 */
export const xorGate = createSymbol(
  'xor',
  65,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 65, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 32.5;
    const right = cx + 32.5;
    const top = cy - 20;
    const bottom = cy + 20;

    return `
      <!-- XOR gate body (OR shape) -->
      <path d="M ${left + 5},${top} Q ${left + 15},${cy} ${left + 5},${bottom} Q ${cx + 5},${bottom} ${cx + 25},${cy} Q ${cx + 5},${top} ${left + 5},${top}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Additional input line for XOR -->
      <path d="M ${left},${top} Q ${left + 10},${cy} ${left},${bottom}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 12}" x2="${left + 5}" y2="${top + 12}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 12}" x2="${left + 5}" y2="${bottom - 12}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 25}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 2-input NAND gate (AND gate with output bubble)
 */
export const nandGate = createSymbol(
  'nand',
  65,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 65, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 32.5;
    const right = cx + 32.5;
    const top = cy - 20;
    const bottom = cy + 20;
    const bubbleX = cx + 23;

    return `
      <!-- NAND gate body (AND shape) -->
      <path d="M ${left},${top} L ${cx + 5},${top} A 20,20 0 0,1 ${cx + 5},${bottom} L ${left},${bottom} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 12}" x2="${left}" y2="${top + 12}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 12}" x2="${left}" y2="${bottom - 12}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 2-input NOR gate (OR gate with output bubble)
 */
export const norGate = createSymbol(
  'nor',
  65,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 65, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 32.5;
    const right = cx + 32.5;
    const top = cy - 20;
    const bottom = cy + 20;
    const bubbleX = cx + 23;

    return `
      <!-- NOR gate body (OR shape) -->
      <path d="M ${left},${top} Q ${left + 10},${cy} ${left},${bottom} Q ${cx + 5},${bottom} ${cx + 25},${cy} Q ${cx + 5},${top} ${left},${top}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 12}" x2="${left}" y2="${top + 12}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 12}" x2="${left}" y2="${bottom - 12}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Buffer gate (triangle without bubble)
 */
export const bufferGate = createSymbol(
  'buffer',
  50,
  30,
  [
    { x: 0, y: 15, name: 'A' },
    { x: 50, y: 15, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;
    const top = cy - 15;
    const bottom = cy + 15;

    return `
      <!-- Buffer triangle -->
      <path d="M ${left},${top} L ${left},${bottom} L ${cx + 15},${cy} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input line -->
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 15}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * XNOR gate (2-input)
 * IEEE distinctive shape: XOR with output inverter bubble
 */
export const xnorGate = createSymbol(
  'xnor',
  70,
  40,
  [
    { x: 0, y: 12, name: 'A' },
    { x: 0, y: 28, name: 'B' },
    { x: 70, y: 20, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 20;
    const bottom = cy + 20;
    const bubbleX = cx + 29;

    return `
      <!-- Additional input curve (XOR distinctive feature) -->
      <path d="M ${left - 5},${top} Q ${left},${cy} ${left - 5},${bottom}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Main OR-style body -->
      <path d="M ${left},${top} Q ${cx - 10},${cy} ${left},${bottom} M ${left},${top} Q ${cx + 10},${top} ${cx + 26},${cy} Q ${cx + 10},${bottom} ${left},${bottom}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Output inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 15}" y1="${top + 8}" x2="${left - 5}" y2="${top + 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 15}" y1="${bottom - 8}" x2="${left - 5}" y2="${bottom - 8}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * AND3 gate (3-input)
 * IEEE distinctive shape: flat left, semicircular right, 3 inputs
 */
export const and3Gate = createSymbol(
  'and3',
  80,
  50,
  [
    { x: 0, y: 10, name: 'A' },
    { x: 0, y: 25, name: 'B' },
    { x: 0, y: 40, name: 'C' },
    { x: 80, y: 25, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 40;
    const right = cx + 40;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- AND gate body -->
      <path d="M ${left},${top} L ${cx},${top} A 25,25 0 0,1 ${cx},${bottom} L ${left},${bottom} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 25}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * OR3 gate (3-input)
 * IEEE distinctive shape: curved sides, 3 inputs
 */
export const or3Gate = createSymbol(
  'or3',
  80,
  50,
  [
    { x: 0, y: 10, name: 'A' },
    { x: 0, y: 25, name: 'B' },
    { x: 0, y: 40, name: 'C' },
    { x: 80, y: 25, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 40;
    const right = cx + 40;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- OR gate body -->
      <path d="M ${left},${top} Q ${cx - 10},${cy} ${left},${bottom} M ${left},${top} Q ${cx + 10},${top} ${cx + 25},${cy} Q ${cx + 10},${bottom} ${left},${bottom}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${cx + 25}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * NAND3 gate (3-input)
 * IEEE distinctive shape: AND with output bubble, 3 inputs
 */
export const nand3Gate = createSymbol(
  'nand3',
  85,
  50,
  [
    { x: 0, y: 10, name: 'A' },
    { x: 0, y: 25, name: 'B' },
    { x: 0, y: 40, name: 'C' },
    { x: 85, y: 25, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 42.5;
    const right = cx + 42.5;
    const top = cy - 25;
    const bottom = cy + 25;
    const bubbleX = cx + 28;

    return `
      <!-- AND gate body -->
      <path d="M ${left},${top} L ${cx},${top} A 25,25 0 0,1 ${cx},${bottom} L ${left},${bottom} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Output inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * NOR3 gate (3-input)
 * IEEE distinctive shape: OR with output bubble, 3 inputs
 */
export const nor3Gate = createSymbol(
  'nor3',
  85,
  50,
  [
    { x: 0, y: 10, name: 'A' },
    { x: 0, y: 25, name: 'B' },
    { x: 0, y: 40, name: 'C' },
    { x: 85, y: 25, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 42.5;
    const right = cx + 42.5;
    const top = cy - 25;
    const bottom = cy + 25;
    const bubbleX = cx + 28;

    return `
      <!-- OR gate body -->
      <path d="M ${left},${top} Q ${cx - 10},${cy} ${left},${bottom} M ${left},${top} Q ${cx + 10},${top} ${cx + 25},${cy} Q ${cx + 10},${bottom} ${left},${bottom}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Output inverter bubble -->
      <circle cx="${bubbleX}" cy="${cy}" r="3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output line -->
      <line x1="${bubbleX + 3}" y1="${cy}" x2="${right + 10}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * D Flip-Flop
 * IEEE rectangular symbol with clock triangle
 */
export const dFlipFlop = createSymbol(
  'dff',
  80,
  60,
  [
    { x: 0, y: 15, name: 'D' },
    { x: 0, y: 45, name: 'CLK' },
    { x: 80, y: 15, name: 'Q' },
    { x: 80, y: 45, name: 'QN' },
  ],
  (cx, cy) => {
    const left = cx - 40;
    const right = cx + 40;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Rectangular body -->
      <rect x="${left}" y="${top}" width="80" height="60" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Clock triangle -->
      <path d="M ${left},${bottom - 20} L ${left + 8},${bottom - 15} L ${left},${bottom - 10}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Labels -->
      <text x="${cx - 20}" y="${top + 20}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">D</text>
      <text x="${cx + 10}" y="${top + 20}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q</text>
      <text x="${cx + 10}" y="${bottom - 5}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q̄</text>
      <!-- Input/output lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 15}" x2="${right + 10}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${bottom - 15}" x2="${right + 10}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * JK Flip-Flop
 * IEEE rectangular symbol with clock triangle
 */
export const jkFlipFlop = createSymbol(
  'jkff',
  80,
  70,
  [
    { x: 0, y: 10, name: 'J' },
    { x: 0, y: 35, name: 'CLK' },
    { x: 0, y: 60, name: 'K' },
    { x: 80, y: 20, name: 'Q' },
    { x: 80, y: 50, name: 'QN' },
  ],
  (cx, cy) => {
    const left = cx - 40;
    const right = cx + 40;
    const top = cy - 35;
    const bottom = cy + 35;

    return `
      <!-- Rectangular body -->
      <rect x="${left}" y="${top}" width="80" height="70" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Clock triangle -->
      <path d="M ${left},${cy - 5} L ${left + 8},${cy} L ${left},${cy + 5}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Labels -->
      <text x="${cx - 20}" y="${top + 15}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">J</text>
      <text x="${cx - 20}" y="${bottom - 5}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">K</text>
      <text x="${cx + 10}" y="${top + 25}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q</text>
      <text x="${cx + 10}" y="${bottom - 15}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q̄</text>
      <!-- Input/output lines -->
      <line x1="${left - 10}" y1="${top + 10}" x2="${left}" y2="${top + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${cy}" x2="${left}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 10}" x2="${left}" y2="${bottom - 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 20}" x2="${right + 10}" y2="${top + 20}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${bottom - 20}" x2="${right + 10}" y2="${bottom - 20}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * T Flip-Flop
 * IEEE rectangular symbol with clock triangle
 */
export const tFlipFlop = createSymbol(
  'tff',
  80,
  60,
  [
    { x: 0, y: 15, name: 'T' },
    { x: 0, y: 45, name: 'CLK' },
    { x: 80, y: 15, name: 'Q' },
    { x: 80, y: 45, name: 'QN' },
  ],
  (cx, cy) => {
    const left = cx - 40;
    const right = cx + 40;
    const top = cy - 30;
    const bottom = cy + 30;

    return `
      <!-- Rectangular body -->
      <rect x="${left}" y="${top}" width="80" height="60" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Clock triangle -->
      <path d="M ${left},${bottom - 20} L ${left + 8},${bottom - 15} L ${left},${bottom - 10}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Labels -->
      <text x="${cx - 20}" y="${top + 20}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">T</text>
      <text x="${cx + 10}" y="${top + 20}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q</text>
      <text x="${cx + 10}" y="${bottom - 5}" 
        font-family="sans-serif" 
        font-size="12" 
        fill="currentColor">Q̄</text>
      <!-- Input/output lines -->
      <line x1="${left - 10}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${bottom - 15}" x2="${left}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 15}" x2="${right + 10}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${bottom - 15}" x2="${right + 10}" y2="${bottom - 15}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 4-bit Register
 * Rectangular symbol with data inputs, clock, enable
 */
export const register4 = createSymbol(
  'reg4',
  100,
  80,
  [
    { x: 0, y: 10, name: 'D0' },
    { x: 0, y: 25, name: 'D1' },
    { x: 0, y: 40, name: 'D2' },
    { x: 0, y: 55, name: 'D3' },
    { x: 20, y: 80, name: 'CLK' },
    { x: 50, y: 80, name: 'EN' },
    { x: 100, y: 10, name: 'Q0' },
    { x: 100, y: 25, name: 'Q1' },
    { x: 100, y: 40, name: 'Q2' },
    { x: 100, y: 55, name: 'Q3' },
  ],
  (cx, cy) => {
    const left = cx - 50;
    const right = cx + 50;
    const top = cy - 40;
    const bottom = cy + 40;

    return `
      <!-- Rectangular body -->
      <rect x="${left}" y="${top}" width="100" height="80" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Label -->
      <text x="${cx - 15}" y="${cy + 5}" 
        font-family="sans-serif" 
        font-size="14" 
        font-weight="bold"
        fill="currentColor">REG</text>
      <text x="${cx - 10}" y="${cy + 18}" 
        font-family="sans-serif" 
        font-size="10" 
        fill="currentColor">4-bit</text>
      <!-- Clock triangle -->
      <path d="M ${left + 20},${bottom} L ${left + 20},${bottom - 8} L ${left + 28},${bottom - 4} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input/output lines (left side) -->
      <line x1="${left - 10}" y1="${top + 10}" x2="${left}" y2="${top + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 25}" x2="${left}" y2="${top + 25}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 40}" x2="${left}" y2="${top + 40}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 55}" x2="${left}" y2="${top + 55}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Clock and enable lines (bottom) -->
      <line x1="${left + 20}" y1="${bottom + 10}" x2="${left + 20}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${bottom + 10}" x2="${cx}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output lines (right side) -->
      <line x1="${right}" y1="${top + 10}" x2="${right + 10}" y2="${top + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 25}" x2="${right + 10}" y2="${top + 25}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 40}" x2="${right + 10}" y2="${top + 40}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 55}" x2="${right + 10}" y2="${top + 55}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 8-bit Register
 * Larger rectangular symbol with 8 data inputs/outputs
 */
export const register8 = createSymbol(
  'reg8',
  120,
  100,
  [
    { x: 0, y: 8, name: 'D0' },
    { x: 0, y: 20, name: 'D1' },
    { x: 0, y: 32, name: 'D2' },
    { x: 0, y: 44, name: 'D3' },
    { x: 0, y: 56, name: 'D4' },
    { x: 0, y: 68, name: 'D5' },
    { x: 0, y: 80, name: 'D6' },
    { x: 0, y: 92, name: 'D7' },
    { x: 30, y: 100, name: 'CLK' },
    { x: 60, y: 100, name: 'EN' },
    { x: 120, y: 8, name: 'Q0' },
    { x: 120, y: 20, name: 'Q1' },
    { x: 120, y: 32, name: 'Q2' },
    { x: 120, y: 44, name: 'Q3' },
    { x: 120, y: 56, name: 'Q4' },
    { x: 120, y: 68, name: 'Q5' },
    { x: 120, y: 80, name: 'Q6' },
    { x: 120, y: 92, name: 'Q7' },
  ],
  (cx, cy) => {
    const left = cx - 60;
    const right = cx + 60;
    const top = cy - 50;
    const bottom = cy + 50;

    return `
      <!-- Rectangular body -->
      <rect x="${left}" y="${top}" width="120" height="100" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Label -->
      <text x="${cx - 15}" y="${cy + 5}" 
        font-family="sans-serif" 
        font-size="14" 
        font-weight="bold"
        fill="currentColor">REG</text>
      <text x="${cx - 10}" y="${cy + 18}" 
        font-family="sans-serif" 
        font-size="10" 
        fill="currentColor">8-bit</text>
      <!-- Clock triangle -->
      <path d="M ${left + 30},${bottom} L ${left + 30},${bottom - 8} L ${left + 38},${bottom - 4} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Input lines (left side) -->
      <line x1="${left - 10}" y1="${top + 8}" x2="${left}" y2="${top + 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 20}" x2="${left}" y2="${top + 20}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 32}" x2="${left}" y2="${top + 32}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 44}" x2="${left}" y2="${top + 44}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 56}" x2="${left}" y2="${top + 56}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 68}" x2="${left}" y2="${top + 68}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 80}" x2="${left}" y2="${top + 80}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left - 10}" y1="${top + 92}" x2="${left}" y2="${top + 92}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Clock and enable lines (bottom) -->
      <line x1="${left + 30}" y1="${bottom + 10}" x2="${left + 30}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${bottom + 10}" x2="${cx}" y2="${bottom}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Output lines (right side) -->
      <line x1="${right}" y1="${top + 8}" x2="${right + 10}" y2="${top + 8}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 20}" x2="${right + 10}" y2="${top + 20}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 32}" x2="${right + 10}" y2="${top + 32}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 44}" x2="${right + 10}" y2="${top + 44}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 56}" x2="${right + 10}" y2="${top + 56}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 68}" x2="${right + 10}" y2="${top + 68}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 80}" x2="${right + 10}" y2="${top + 80}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right}" y1="${top + 92}" x2="${right + 10}" y2="${top + 92}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * 4-to-1 Multiplexer
 * IEEE standard trapezoidal symbol
 * 4 data inputs, 2 select inputs, 1 output
 */
export const mux4to1 = createSymbol(
  'mux41',
  60,
  80,
  [
    { x: 0, y: 15, name: 'D0' },
    { x: 0, y: 30, name: 'D1' },
    { x: 0, y: 50, name: 'D2' },
    { x: 0, y: 65, name: 'D3' },
    { x: 15, y: 80, name: 'S0' },
    { x: 35, y: 80, name: 'S1' },
    { x: 60, y: 40, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 40;
    const bottom = cy + 40;
    const trapLeft = left + 5;
    const trapRight = right - 5;

    return `
      <!-- Trapezoidal body (narrow left, wide right) -->
      <path d="M ${trapLeft},${top} L ${trapRight - 10},${top} L ${trapRight},${cy} L ${trapRight - 10},${bottom} L ${trapLeft},${bottom} Z"
        fill="white" stroke="currentColor" stroke-width="2"/>
      
      <!-- MUX label -->
      <text x="${cx - 8}" y="${cy + 5}" 
        font-family="Arial, sans-serif" font-size="12" fill="currentColor" text-anchor="middle">
        MUX
      </text>
      
      <!-- Select inputs with small triangles at bottom -->
      <path d="M ${left + 15},${bottom} L ${left + 15},${bottom - 5}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left + 35},${bottom} L ${left + 35},${bottom - 5}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Data input lines -->
      <path d="M ${left},${top + 15} L ${trapLeft},${top + 15}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 30} L ${trapLeft},${top + 30}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 50} L ${trapLeft},${top + 50}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 65} L ${trapLeft},${top + 65}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Output line -->
      <path d="M ${trapRight},${cy} L ${right},${cy}" stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * 8-to-1 Multiplexer
 * IEEE standard trapezoidal symbol
 * 8 data inputs, 3 select inputs, 1 output
 */
export const mux8to1 = createSymbol(
  'mux81',
  70,
  120,
  [
    { x: 0, y: 12, name: 'D0' },
    { x: 0, y: 24, name: 'D1' },
    { x: 0, y: 36, name: 'D2' },
    { x: 0, y: 48, name: 'D3' },
    { x: 0, y: 72, name: 'D4' },
    { x: 0, y: 84, name: 'D5' },
    { x: 0, y: 96, name: 'D6' },
    { x: 0, y: 108, name: 'D7' },
    { x: 15, y: 120, name: 'S0' },
    { x: 30, y: 120, name: 'S1' },
    { x: 45, y: 120, name: 'S2' },
    { x: 70, y: 60, name: 'Y' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 60;
    const bottom = cy + 60;
    const trapLeft = left + 5;
    const trapRight = right - 5;

    return `
      <!-- Trapezoidal body (narrow left, wide right) -->
      <path d="M ${trapLeft},${top} L ${trapRight - 12},${top} L ${trapRight},${cy} L ${trapRight - 12},${bottom} L ${trapLeft},${bottom} Z"
        fill="white" stroke="currentColor" stroke-width="2"/>
      
      <!-- MUX label -->
      <text x="${cx - 10}" y="${cy + 5}" 
        font-family="Arial, sans-serif" font-size="12" fill="currentColor" text-anchor="middle">
        MUX
      </text>
      
      <!-- 8:1 indicator -->
      <text x="${cx - 10}" y="${cy + 18}" 
        font-family="Arial, sans-serif" font-size="9" fill="currentColor" text-anchor="middle">
        8:1
      </text>
      
      <!-- Select inputs -->
      <path d="M ${left + 15},${bottom} L ${left + 15},${bottom - 5}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left + 30},${bottom} L ${left + 30},${bottom - 5}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left + 45},${bottom} L ${left + 45},${bottom - 5}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Data input lines (8 inputs) -->
      <path d="M ${left},${top + 12} L ${trapLeft},${top + 12}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 24} L ${trapLeft},${top + 24}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 36} L ${trapLeft},${top + 36}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 48} L ${trapLeft},${top + 48}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 72} L ${trapLeft},${top + 72}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 84} L ${trapLeft},${top + 84}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 96} L ${trapLeft},${top + 96}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 108} L ${trapLeft},${top + 108}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Output line -->
      <path d="M ${trapRight},${cy} L ${right},${cy}" stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * 2-to-4 Decoder
 * IEEE standard inverted trapezoidal symbol
 * 2 address inputs, optional enable, 4 outputs
 */
export const decoder2to4 = createSymbol(
  'dec24',
  60,
  70,
  [
    { x: 0, y: 25, name: 'A0' },
    { x: 0, y: 45, name: 'A1' },
    { x: 20, y: 0, name: 'EN' },
    { x: 60, y: 15, name: 'Y0' },
    { x: 60, y: 28, name: 'Y1' },
    { x: 60, y: 42, name: 'Y2' },
    { x: 60, y: 55, name: 'Y3' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 35;
    const bottom = cy + 35;
    const trapLeft = left + 5;
    const trapRight = right - 5;

    return `
      <!-- Inverted trapezoidal body (wide left, narrow right) -->
      <path d="M ${trapLeft},${top + 10} L ${trapRight - 10},${top} L ${trapRight - 10},${bottom} L ${trapLeft},${bottom - 10} Z"
        fill="white" stroke="currentColor" stroke-width="2"/>
      
      <!-- DEC label -->
      <text x="${cx - 5}" y="${cy + 5}" 
        font-family="Arial, sans-serif" font-size="11" fill="currentColor" text-anchor="middle">
        DEC
      </text>
      
      <!-- 2:4 indicator -->
      <text x="${cx - 5}" y="${cy + 16}" 
        font-family="Arial, sans-serif" font-size="9" fill="currentColor" text-anchor="middle">
        2:4
      </text>
      
      <!-- Enable input at top -->
      <path d="M ${left + 20},${top} L ${left + 20},${top + 10}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Address input lines -->
      <path d="M ${left},${top + 25} L ${trapLeft},${top + 25}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 45} L ${trapLeft},${top + 45}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Output lines (4 outputs) -->
      <path d="M ${trapRight - 10},${top + 15} L ${right},${top + 15}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 10},${top + 28} L ${right},${top + 28}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 10},${top + 42} L ${right},${top + 42}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 10},${top + 55} L ${right},${top + 55}" stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * 3-to-8 Decoder
 * IEEE standard inverted trapezoidal symbol
 * 3 address inputs, optional enable, 8 outputs
 */
export const decoder3to8 = createSymbol(
  'dec38',
  70,
  110,
  [
    { x: 0, y: 35, name: 'A0' },
    { x: 0, y: 55, name: 'A1' },
    { x: 0, y: 75, name: 'A2' },
    { x: 25, y: 0, name: 'EN' },
    { x: 70, y: 15, name: 'Y0' },
    { x: 70, y: 27, name: 'Y1' },
    { x: 70, y: 39, name: 'Y2' },
    { x: 70, y: 51, name: 'Y3' },
    { x: 70, y: 63, name: 'Y4' },
    { x: 70, y: 75, name: 'Y5' },
    { x: 70, y: 87, name: 'Y6' },
    { x: 70, y: 99, name: 'Y7' },
  ],
  (cx, cy) => {
    const left = cx - 35;
    const right = cx + 35;
    const top = cy - 55;
    const bottom = cy + 55;
    const trapLeft = left + 5;
    const trapRight = right - 5;

    return `
      <!-- Inverted trapezoidal body (wide left, narrow right) -->
      <path d="M ${trapLeft},${top + 10} L ${trapRight - 12},${top} L ${trapRight - 12},${bottom} L ${trapLeft},${bottom - 10} Z"
        fill="white" stroke="currentColor" stroke-width="2"/>
      
      <!-- DEC label -->
      <text x="${cx - 8}" y="${cy + 5}" 
        font-family="Arial, sans-serif" font-size="11" fill="currentColor" text-anchor="middle">
        DEC
      </text>
      
      <!-- 3:8 indicator -->
      <text x="${cx - 8}" y="${cy + 18}" 
        font-family="Arial, sans-serif" font-size="9" fill="currentColor" text-anchor="middle">
        3:8
      </text>
      
      <!-- Enable input at top -->
      <path d="M ${left + 25},${top} L ${left + 25},${top + 10}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Address input lines (3 inputs) -->
      <path d="M ${left},${top + 35} L ${trapLeft},${top + 35}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 55} L ${trapLeft},${top + 55}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${left},${top + 75} L ${trapLeft},${top + 75}" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Output lines (8 outputs) -->
      <path d="M ${trapRight - 12},${top + 15} L ${right},${top + 15}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 27} L ${right},${top + 27}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 39} L ${right},${top + 39}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 51} L ${right},${top + 51}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 63} L ${right},${top + 63}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 75} L ${right},${top + 75}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 87} L ${right},${top + 87}" stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${trapRight - 12},${top + 99} L ${right},${top + 99}" stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * Symbol registry
 */
export const symbolRegistry = new Map<string, SymbolDefinition>([
  // Electrical components
  ['R', resistor],
  ['C', capacitor],
  ['L', inductor],
  ['V', voltageSource],
  ['I', currentSource],
  ['D', diode],
  ['LED', led],
  ['GND', ground],
  ['JUNCTION', junction],
  ['Q_NPN', npnTransistor],
  ['Q_PNP', pnpTransistor],
  ['M_NMOS', nmosTransistor],
  ['M_PMOS', pmosTransistor],
  ['OPAMP', opamp],
  ['XFMR', transformer],
  // Digital logic gates
  ['AND', andGate],
  ['OR', orGate],
  ['NOT', notGate],
  ['XOR', xorGate],
  ['NAND', nandGate],
  ['NOR', norGate],
  ['BUFFER', bufferGate],
  ['XNOR', xnorGate],
  ['AND3', and3Gate],
  ['OR3', or3Gate],
  ['NAND3', nand3Gate],
  ['NOR3', nor3Gate],
  // Flip-flops
  ['DFF', dFlipFlop],
  ['JKFF', jkFlipFlop],
  ['TFF', tFlipFlop],
  // Registers
  ['REG4', register4],
  ['REG8', register8],
  // Multiplexers
  ['MUX41', mux4to1],
  ['MUX81', mux8to1],
  // Decoders
  ['DEC24', decoder2to4],
  ['DEC38', decoder3to8],
]);

// ============================================================================
// ISO 1219-1 Pneumatic Symbols
// ============================================================================

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
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 10}" width="18" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 2 box (right) -->
      <rect x="${left + 18}" y="${top + 10}" width="18" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Flow arrows in position 1 -->
      <path d="M ${left + 5},${cy} L ${left + 13},${cy}" 
        stroke="currentColor" stroke-width="1.5" marker-end="url(#arrow)"/>
      
      <!-- Port connections -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 5}" y1="${bottom}" x2="${right - 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * 5/2-Way Valve (5 ports, 2 positions)
 * ISO 1219-1 standard directional control valve
 */
export const valve52Way = createSymbol(
  'VALVE_52',
  60,
  50,
  [
    { x: 15, y: 50, name: 'P' },
    { x: 25, y: 50, name: 'A' },
    { x: 35, y: 50, name: 'B' },
    { x: 45, y: 50, name: 'R' },
    { x: 55, y: 50, name: 'S' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const top = cy - 25;
    const bottom = cy + 25;

    return `
      <!-- Position 1 box (left) -->
      <rect x="${left}" y="${top + 10}" width="28" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Position 2 box (right) -->
      <rect x="${left + 28}" y="${top + 10}" width="28" height="30" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Flow arrows in position 1 -->
      <path d="M ${left + 8},${cy} L ${left + 20},${cy}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Port connection lines -->
      <line x1="${left + 5}" y1="${bottom}" x2="${left + 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${left + 15}" y1="${bottom}" x2="${left + 15}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${bottom}" x2="${cx}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 15}" y1="${bottom}" x2="${right - 15}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${right - 5}" y1="${bottom}" x2="${right - 5}" y2="${bottom - 2}" 
        stroke="currentColor" stroke-width="1.5"/>
    `;
  }
);

/**
 * Air Source (compressed air supply)
 * ISO 1219-1 standard pressure source symbol
 */
export const airSource = createSymbol(
  'AIR_SOURCE',
  40,
  40,
  [{ x: 20, y: 40, name: 'out' }],
  (cx, cy) => {
    const radius = 15;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- pressure triangle (pointing down) -->
      <polygon points="${cx},${cy - 5} ${cx - 6},${cy + 5} ${cx + 6},${cy + 5}" 
        fill="currentColor"/>
      
      <!-- Output connection -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 5}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pressure Regulator (adjustable)
 * ISO 1219-1 standard pressure control
 */
export const pressureRegulator = createSymbol(
  'REGULATOR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const left = cx - 25;
    const right = cx + 25;

    return `
      <!-- Flow path -->
      <line x1="${left}" y1="${cy}" x2="${left + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${right - 15}" y1="${cy}" x2="${right}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Valve body -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- spring adjustment symbol (zigzag above) -->
      <path d="M ${cx},${cy - 10} l 0,-5 l -2,-2 l 4,-2 l -4,-2 l 4,-2 l -2,-2 l 0,-3" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="${cx}" y="${cy - 28}" font-size="7" text-anchor="middle" fill="currentColor">spring</text>
      
      <!-- Adjustment arrow -->
      <path d="M ${cx - 5},${cy - 23} L ${cx},${cy - 25} L ${cx + 5},${cy - 23}" 
        stroke="currentColor" stroke-width="1" fill="none"/>
    `;
  }
);

/**
 * Pneumatic Filter
 * ISO 1219-1 standard filter symbol
 */
export const filterPneumatic = createSymbol(
  'FILTER',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Diamond shape -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Mesh pattern (diagonal lines) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="1"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="1"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Lubricator (adds oil mist to air)
 * ISO 1219-1 standard lubricator symbol
 */
export const lubricator = createSymbol(
  'LUBRICATOR',
  40,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 40, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Reservoir circle -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Oil droplet indicator (small circle with tube) -->
      <line x1="${cx}" y1="${cy - radius + 3}" x2="${cx}" y2="${cy - 3}" 
        stroke="currentColor" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy - radius + 1}" r="2" fill="currentColor"/>
      <text x="${cx}" y="${cy - radius - 5}" font-size="7" text-anchor="middle" fill="currentColor">droplet</text>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 8}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Flow Control Valve (adjustable restriction)
 * ISO 1219-1 standard flow control
 */
export const flowControlPneumatic = createSymbol(
  'FLOW_CONTROL',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Diamond shape -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Adjustable arrow through center -->
      <path d="M ${cx - 10},${cy} L ${cx + 10},${cy}" 
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx + 7},${cy - 3} L ${cx + 10},${cy} L ${cx + 7},${cy + 3}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Adjustment indicator (diagonal line) -->
      <line x1="${cx - 5}" y1="${cy - size - 5}" x2="${cx + 5}" y2="${cy - size + 5}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Check Valve (one-way valve)
 * ISO 1219-1 standard check valve
 */
export const checkValvePneumatic = createSymbol(
  'CHECK_VALVE',
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
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Ball (small circle inside) -->
      <circle cx="${cx - 3}" cy="${cy}" r="4" fill="currentColor"/>
      
      <!-- Seat (triangle) -->
      <polygon points="${cx + 3},${cy - 6} ${cx + 8},${cy} ${cx + 3},${cy + 6}" 
        fill="none" stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 8}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 8}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Exhaust (to atmosphere)
 * ISO 1219-1 standard exhaust symbol
 */
export const exhaustPneumatic = createSymbol(
  'EXHAUST',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    return `
      <!-- Triangle pointing outward -->
      <polygon points="${cx},${cy - 10} ${cx - 8},${cy} ${cx + 8},${cy}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- Exhaust indicator lines (3 short lines) -->
      <line x1="${cx - 10}" y1="${cy - 15}" x2="${cx - 5}" y2="${cy - 13}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy - 17}" x2="${cx}" y2="${cy - 12}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx + 10}" y1="${cy - 15}" x2="${cx + 5}" y2="${cy - 13}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection line -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 5}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Pressure Gauge (measurement)
 * ISO 1219-1 standard gauge symbol
 */
export const pressureGaugePneumatic = createSymbol(
  'GAUGE_P',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2" fill="white"/>
      
      <!-- P label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="currentColor">P</text>
      
      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 3}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

// ============================================================================
// ISO 1219-2 Hydraulic Symbols
// ============================================================================

/**
 * Hydraulic Pump - Fixed Displacement
 * ISO 1219-2 standard pump symbol
 */
export const pumpFixed = createSymbol(
  'PUMP_FIXED',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Solid triangle (fixed displacement indicator) -->
      <polygon points="${cx - radius + 3},${cy - 12} ${cx - radius + 3},${cy + 12} ${cx - radius - 5},${cy}" 
        fill="currentColor"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Hydraulic Pump - Variable Displacement
 * ISO 1219-2 standard variable pump symbol
 */
export const pumpVariable = createSymbol(
  'PUMP_VAR',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
    { x: 25, y: 0, name: 'control' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- Diagonal line (variable displacement indicator) -->
      <line x1="${cx - radius + 3}" y1="${cy + 10}" x2="${cx - radius - 5}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}" 
        stroke="currentColor" stroke-width="2"/>
    `;
  }
);

/**
 * Hydraulic Motor
 * ISO 1219-2 standard motor symbol
 */
export const motorHydraulic = createSymbol(
  'MOTOR_HYD',
  50,
  50,
  [
    { x: 0, y: 25, name: 'in' },
    { x: 50, y: 25, name: 'out' },
    { x: 25, y: 0, name: 'shaft' },
  ],
  (cx, cy) => {
    const radius = 18;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Arrow (clockwise) -->
      <path d="M ${cx - 8},${cy - 5} L ${cx + 3},${cy - 5} L ${cx + 3},${cy - 10} L ${cx + 10},${cy} L ${cx + 3},${cy + 10} L ${cx + 3},${cy + 5} L ${cx - 8},${cy + 5}" 
        stroke="currentColor" stroke-width="1.5" fill="none"/>
      
      <!-- shaft line extending from center -->
      <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - 7}" 
        stroke="currentColor" stroke-width="3"/>
      <text x="${cx + 12}" y="${cy - radius - 5}" font-size="7" fill="currentColor">shaft</text>
      
      <!-- Connection lines -->
      <line x1="${cx - radius - 7}" y1="${cy}" x2="${cx - radius}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + 7}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

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
 * Hydraulic Filter
 * ISO 1219-2 standard filter symbol (thicker lines than pneumatic)
 */
export const filterHydraulic = createSymbol(
  'FILTER_HYD',
  40,
  40,
  [
    { x: 0, y: 20, name: 'in' },
    { x: 40, y: 20, name: 'out' },
  ],
  (cx, cy) => {
    const size = 15;

    return `
      <!-- Diamond shape (thicker lines) -->
      <polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- Mesh pattern (diagonal lines) -->
      <line x1="${cx - 8}" y1="${cy - 8}" x2="${cx + 8}" y2="${cy + 8}" 
        stroke="currentColor" stroke-width="1.5"/>
      <line x1="${cx - 8}" y1="${cy + 8}" x2="${cx + 8}" y2="${cy - 8}" 
        stroke="currentColor" stroke-width="1.5"/>
      
      <!-- Connection lines -->
      <line x1="${cx - size - 5}" y1="${cy}" x2="${cx - size}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
      <line x1="${cx + size}" y1="${cy}" x2="${cx + size + 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

/**
 * Hydraulic Reservoir/Tank
 * ISO 1219-2 standard reservoir symbol
 */
export const reservoir = createSymbol(
  'RESERVOIR',
  50,
  60,
  [
    { x: 10, y: 60, name: 'return' },
    { x: 40, y: 60, name: 'suction' },
    { x: 25, y: 0, name: 'vent' },
  ],
  (cx, cy) => {
    const width = 40;
    const height = 50;
    const left = cx - width / 2;
    const top = cy - height / 2;

    return `
      <!-- Tank body (rectangle open at top) -->
      <rect x="${left}" y="${top + 5}" width="${width}" height="${height - 5}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- fluid level line -->
      <line x1="${left + 5}" y1="${cy}" x2="${left + width - 5}" y2="${cy}" 
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="${cx}" y="${cy - 3}" font-size="7" text-anchor="middle" fill="currentColor">fluid level</text>
      
      <!-- Vent line at top -->
      <line x1="${cx}" y1="${top + 5}" x2="${cx}" y2="${top - 5}" 
        stroke="currentColor" stroke-width="2"/>
      
      <!-- Return connection (left) -->
      <line x1="${left + 5}" y1="${top + height}" x2="${left + 5}" y2="${top + height + 5}" 
        stroke="currentColor" stroke-width="2.5"/>
      
      <!-- Suction connection (right) -->
      <line x1="${left + width - 5}" y1="${top + height}" x2="${left + width - 5}" y2="${top + height + 5}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

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
 * Pressure Gauge (hydraulic)
 * ISO 1219-2 standard gauge symbol
 */
export const pressureGaugeHydraulic = createSymbol(
  'GAUGE_P_HYD',
  30,
  30,
  [{ x: 15, y: 30, name: 'in' }],
  (cx, cy) => {
    const radius = 12;

    return `
      <!-- Circle body -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" 
        stroke="currentColor" stroke-width="2.5" fill="white"/>
      
      <!-- P label -->
      <text x="${cx}" y="${cy + 4}" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="currentColor">P</text>
      
      <!-- Connection line -->
      <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + 3}" 
        stroke="currentColor" stroke-width="2.5"/>
    `;
  }
);

// Add pneumatic and hydraulic symbols to registry
symbolRegistry.set('CYL_SA', cylinderSingleActing);
symbolRegistry.set('CYL_DA', cylinderDoubleActing);
symbolRegistry.set('VALVE_32', valve32Way);
symbolRegistry.set('VALVE_52', valve52Way);
symbolRegistry.set('AIR_SOURCE', airSource);
symbolRegistry.set('REGULATOR', pressureRegulator);
symbolRegistry.set('FILTER', filterPneumatic);
symbolRegistry.set('LUBRICATOR', lubricator);
symbolRegistry.set('FLOW_CONTROL', flowControlPneumatic);
symbolRegistry.set('CHECK_VALVE', checkValvePneumatic);
symbolRegistry.set('EXHAUST', exhaustPneumatic);
symbolRegistry.set('GAUGE_P', pressureGaugePneumatic);

symbolRegistry.set('PUMP_FIXED', pumpFixed);
symbolRegistry.set('PUMP_VAR', pumpVariable);
symbolRegistry.set('MOTOR_HYD', motorHydraulic);
symbolRegistry.set('CYL_HYD', cylinderHydraulic);
symbolRegistry.set('VALVE_43', valve43Way);
symbolRegistry.set('RELIEF_VALVE', pressureReliefValve);
symbolRegistry.set('REDUCING_VALVE', pressureReducingValve);
symbolRegistry.set('FLOW_CONTROL_HYD', flowControlHydraulic);
symbolRegistry.set('CHECK_VALVE_HYD', checkValveHydraulic);
symbolRegistry.set('FILTER_HYD', filterHydraulic);
symbolRegistry.set('RESERVOIR', reservoir);
symbolRegistry.set('ACCUMULATOR', accumulator);
symbolRegistry.set('GAUGE_P_HYD', pressureGaugeHydraulic);

/**
 * Get symbol for component type
 */
export function getSymbol(type: string): SymbolDefinition | undefined {
  return symbolRegistry.get(type.toUpperCase());
}
