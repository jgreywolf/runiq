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
  [
    { x: 15, y: 0, name: 'terminal' },
  ],
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
  [
    { x: 4, y: 4, name: 'center' },
  ],
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

/**
 * Symbol registry
 */
export const symbolRegistry = new Map<string, SymbolDefinition>([
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
]);

/**
 * Get symbol for component type
 */
export function getSymbol(type: string): SymbolDefinition | undefined {
  return symbolRegistry.get(type.toUpperCase());
}
