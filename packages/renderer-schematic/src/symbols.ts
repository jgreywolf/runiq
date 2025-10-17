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
]);

/**
 * Get symbol for component type
 */
export function getSymbol(type: string): SymbolDefinition | undefined {
  return symbolRegistry.get(type.toUpperCase());
}
