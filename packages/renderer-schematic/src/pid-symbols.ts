/**
 * P&ID (Piping & Instrumentation Diagram) Symbols
 *
 * Following ISA-5.1 and ISO 14617 standards for process industry diagrams.
 * Symbols for equipment, instrumentation, valves, and piping.
 */

export interface PIDSymbolDefinition {
  id: string;
  width: number;
  height: number;
  terminals: { x: number; y: number; name: string }[]; // Connection points
  render: (x: number, y: number, label?: string) => string; // SVG markup
  category: 'vessel' | 'pump' | 'valve' | 'heatExchanger' | 'instrument' | 'misc';
}

/**
 * Create centered P&ID symbol at position with proper terminals
 */
function createPIDSymbol(
  id: string,
  width: number,
  height: number,
  category: PIDSymbolDefinition['category'],
  terminals: { x: number; y: number; name: string }[],
  render: (cx: number, cy: number, label?: string) => string
): PIDSymbolDefinition {
  return {
    id,
    width,
    height,
    category,
    terminals,
    render: (x: number, y: number, label?: string) => {
      const cx = x + width / 2;
      const cy = y + height / 2;
      return render(cx, cy, label);
    },
  };
}

// ============================================================================
// VESSELS & TANKS
// ============================================================================

/**
 * Vertical Pressure Vessel (ISA standard)
 * Common in distillation, separation, reactors
 */
export const vesselVertical = createPIDSymbol(
  'VESSEL_V',
  60,
  100,
  'vessel',
  [
    { x: 30, y: 0, name: 'top' },
    { x: 30, y: 100, name: 'bottom' },
    { x: 0, y: 50, name: 'left' },
    { x: 60, y: 50, name: 'right' },
  ],
  (cx, cy, label) => {
    const w = 60;
    const h = 100;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <rect x="${left}" y="${top}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      ${label ? `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="12" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Horizontal Pressure Vessel
 * Used for separators, knockout drums
 */
export const vesselHorizontal = createPIDSymbol(
  'VESSEL_H',
  100,
  60,
  'vessel',
  [
    { x: 0, y: 30, name: 'left' },
    { x: 100, y: 30, name: 'right' },
    { x: 50, y: 0, name: 'top' },
    { x: 50, y: 60, name: 'bottom' },
  ],
  (cx, cy, label) => {
    const w = 100;
    const h = 60;
    const left = cx - w / 2;
    const top = cy - h / 2;

    // Elliptical ends (ISA standard for horizontal vessels)
    return `
      <ellipse cx="${left}" cy="${cy}" rx="10" ry="${h / 2}" 
        stroke="currentColor" stroke-width="3" fill="none"/>
      <line x1="${left}" y1="${top}" x2="${left + w}" y2="${top}" 
        stroke="currentColor" stroke-width="3"/>
      <line x1="${left}" y1="${cy + h / 2}" x2="${left + w}" y2="${cy + h / 2}" 
        stroke="currentColor" stroke-width="3"/>
      <ellipse cx="${left + w}" cy="${cy}" rx="10" ry="${h / 2}" 
        stroke="currentColor" stroke-width="3" fill="none"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Storage Tank (atmospheric)
 * Flat bottom, dished roof
 */
export const storageTank = createPIDSymbol(
  'TANK_STORAGE',
  70,
  90,
  'vessel',
  [
    { x: 35, y: 0, name: 'top' },
    { x: 35, y: 90, name: 'bottom' },
    { x: 0, y: 50, name: 'left' },
    { x: 70, y: 50, name: 'right' },
  ],
  (cx, cy, label) => {
    const w = 70;
    const h = 90;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Tank body -->
      <line x1="${left}" y1="${top + 10}" x2="${left}" y2="${cy + h / 2}" 
        stroke="currentColor" stroke-width="3"/>
      <line x1="${left + w}" y1="${top + 10}" x2="${left + w}" y2="${cy + h / 2}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Flat bottom -->
      <line x1="${left}" y1="${cy + h / 2}" x2="${left + w}" y2="${cy + h / 2}" 
        stroke="currentColor" stroke-width="3"/>
      <!-- Dished roof -->
      <path d="M ${left},${top + 10} Q ${cx},${top - 5} ${left + w},${top + 10}" 
        stroke="currentColor" stroke-width="3" fill="none"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// ROTATING EQUIPMENT - PUMPS
// ============================================================================

/**
 * Centrifugal Pump (most common type)
 * Circle with inlet and outlet
 */
export const pumpCentrifugal = createPIDSymbol(
  'PUMP_CENT',
  50,
  50,
  'pump',
  [
    { x: 0, y: 25, name: 'inlet' },
    { x: 50, y: 25, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 20;

    return `
      <!-- Pump body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Impeller indicator -->
      <circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/>
      <!-- Inlet line -->
      <line x1="${cx - 25}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 25}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 15}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Positive Displacement Pump
 * Circle with filled segment indicating displacement
 */
export const pumpPositiveDisplacement = createPIDSymbol(
  'PUMP_PD',
  50,
  50,
  'pump',
  [
    { x: 0, y: 25, name: 'inlet' },
    { x: 50, y: 25, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 20;

    return `
      <!-- Pump body -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- PD indicator (filled semicircle) -->
      <path d="M ${cx},${cy - r} A ${r},${r} 0 0,1 ${cx},${cy + r} Z" 
        fill="currentColor"/>
      <!-- Inlet/outlet lines -->
      <line x1="${cx - 25}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 25}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 15}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// VALVES (ISA-5.1 Standard)
// ============================================================================

/**
 * Gate Valve (most common isolation valve)
 * Triangle pointing down
 */
export const valveGate = createPIDSymbol(
  'VALVE_GATE',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const size = 12;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - size / 2}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Gate valve body (triangle) -->
      <path d="M ${cx - size / 2},${cy} L ${cx + size / 2},${cy} L ${cx},${cy - size} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Outlet line -->
      <line x1="${cx + size / 2}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Globe Valve (throttling valve)
 * Circle with S-shaped flow path
 */
export const valveGlobe = createPIDSymbol(
  'VALVE_GLOBE',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 10;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Globe body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- S-path indicator -->
      <path d="M ${cx - r},${cy} Q ${cx},${cy - r / 2} ${cx + r},${cy}" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 12}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Ball Valve (quarter-turn valve)
 * Circle with perpendicular line (ball indicator)
 */
export const valveBall = createPIDSymbol(
  'VALVE_BALL',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 10;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Ball valve body -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Ball indicator (perpendicular line) -->
      <line x1="${cx}" y1="${cy - r + 2}" x2="${cx}" y2="${cy + r - 2}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 12}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Check Valve (non-return valve)
 * Triangle with ball/flap indicator
 */
export const valveCheck = createPIDSymbol(
  'VALVE_CHECK',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const size = 12;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - size / 2}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Check valve body (triangle) -->
      <path d="M ${cx - size / 2},${cy - size / 2} L ${cx - size / 2},${cy + size / 2} L ${cx + size / 2},${cy} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Flap indicator (small circle) -->
      <circle cx="${cx - size / 4}" cy="${cy}" r="2" fill="currentColor"/>
      <!-- Outlet line -->
      <line x1="${cx + size / 2}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Control Valve (actuated valve for flow control)
 * Globe valve with actuator on top
 */
export const valveControl = createPIDSymbol(
  'VALVE_CONTROL',
  30,
  50,
  'valve',
  [
    { x: 0, y: 35, name: 'inlet' },
    { x: 30, y: 35, name: 'outlet' },
    { x: 15, y: 0, name: 'actuator' }, // Signal connection
  ],
  (cx, cy, label) => {
    const r = 10;
    const valveY = cy + 10; // Valve body lower in symbol

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${valveY}" x2="${cx - r}" y2="${valveY}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Valve body -->
      <circle cx="${cx}" cy="${valveY}" r="${r}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Actuator (diamond on top) -->
      <path d="M ${cx},${cy - 15} L ${cx + 8},${cy - 5} L ${cx},${cy + 5} L ${cx - 8},${cy - 5} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Stem connecting actuator to valve -->
      <line x1="${cx}" y1="${cy + 5}" x2="${cx}" y2="${valveY - r}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${valveY}" x2="${cx + 15}" y2="${valveY}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${valveY + r + 12}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Safety Relief Valve (pressure protection)
 * Spring-loaded valve symbol
 */
export const valveSafetyRelief = createPIDSymbol(
  'VALVE_PSV',
  30,
  40,
  'valve',
  [
    { x: 0, y: 30, name: 'inlet' },
    { x: 30, y: 20, name: 'outlet' }, // Outlet at angle
  ],
  (cx, cy, label) => {
    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy + 10}" x2="${cx - 6}" y2="${cy + 10}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Valve body (angled triangle) -->
      <path d="M ${cx - 6},${cy + 10} L ${cx + 6},${cy + 10} L ${cx},${cy} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Spring indicator -->
      <path d="M ${cx},${cy - 2} L ${cx - 3},${cy - 6} L ${cx + 3},${cy - 10} L ${cx - 3},${cy - 14} L ${cx},${cy - 18}" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"/>
      <!-- Outlet line (angled up) -->
      <line x1="${cx}" y1="${cy}" x2="${cx + 15}" y2="${cy - 10}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + 25}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// HEAT EXCHANGERS
// ============================================================================

/**
 * Shell & Tube Heat Exchanger (most common type)
 * Rectangle with tube indication
 */
export const heatExchangerShellTube = createPIDSymbol(
  'HX_SHELL_TUBE',
  80,
  50,
  'heatExchanger',
  [
    { x: 0, y: 15, name: 'shellIn' },
    { x: 80, y: 15, name: 'shellOut' },
    { x: 20, y: 0, name: 'tubeIn' },
    { x: 60, y: 50, name: 'tubeOut' },
  ],
  (cx, cy, label) => {
    const w = 80;
    const h = 50;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Shell (outer rectangle) -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Tube pass indicators (circles at ends) -->
      <circle cx="${left + 15}" cy="${cy}" r="8" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <circle cx="${left + w - 15}" cy="${cy}" r="8" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Shell nozzles -->
      <line x1="${left - 5}" y1="${top + 15}" x2="${left}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + w}" y1="${top + 15}" x2="${left + w + 5}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Tube nozzles -->
      <line x1="${left + 20}" y1="${top}" x2="${left + 20}" y2="${top - 5}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${left + 60}" y1="${top + h}" x2="${left + 60}" y2="${top + h + 5}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="11" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Air Cooler (forced draft)
 * Rectangle with fan symbol on top
 */
export const airCooler = createPIDSymbol(
  'COOLER_AIR',
  70,
  60,
  'heatExchanger',
  [
    { x: 0, y: 45, name: 'inlet' },
    { x: 70, y: 45, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const w = 70;
    const h = 30;
    const left = cx - w / 2;
    const bottom = cy + h / 2;

    return `
      <!-- Heat exchanger bundle -->
      <rect x="${left}" y="${bottom - h}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Diagonal lines indicating fins -->
      <line x1="${left}" y1="${bottom - h}" x2="${left + w}" y2="${bottom}" 
        stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="${left}" y1="${bottom}" x2="${left + w}" y2="${bottom - h}" 
        stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <!-- Fan (circle on top) -->
      <circle cx="${cx}" cy="${bottom - h - 15}" r="10" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Fan blades -->
      <line x1="${cx}" y1="${bottom - h - 25}" x2="${cx}" y2="${bottom - h - 5}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx - 7}" y1="${bottom - h - 22}" x2="${cx + 7}" y2="${bottom - h - 8}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${bottom + 15}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// INSTRUMENTATION (ISA-5.1 Standard)
// ============================================================================

/**
 * Generic Instrument Bubble (base for all instruments)
 * Circle with tag text inside
 */
function instrumentBubble(
  cx: number,
  cy: number,
  tag: string,
  isFieldMounted: boolean = true
): string {
  const r = 18;
  // Field mounted = single circle, Panel mounted = double circle
  const circleStyle = isFieldMounted
    ? `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="currentColor" stroke-width="2" fill="white"/>`
    : `
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="currentColor" stroke-width="2" fill="white"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 3}" stroke="currentColor" stroke-width="1" fill="none"/>
    `;

  return `
    ${circleStyle}
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">${tag}</text>
  `;
}

/**
 * Flow Transmitter (FT)
 */
export const flowTransmitter = createPIDSymbol(
  'FT',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'FT';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Temperature Transmitter (TT)
 */
export const temperatureTransmitter = createPIDSymbol(
  'TT',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'TT';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Pressure Transmitter (PT)
 */
export const pressureTransmitter = createPIDSymbol(
  'PT',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'PT';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Level Transmitter (LT)
 */
export const levelTransmitter = createPIDSymbol(
  'LT',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'LT';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Flow Indicator Controller (FIC)
 * Panel mounted (double circle)
 */
export const flowIndicatorController = createPIDSymbol(
  'FIC',
  40,
  40,
  'instrument',
  [
    { x: 20, y: 40, name: 'process' },
    { x: 20, y: 0, name: 'output' },
  ],
  (cx, cy, label) => {
    const tag = label || 'FIC';
    return instrumentBubble(cx, cy, tag, false); // Panel mounted
  }
);

// ============================================================================
// MORE VESSELS & EQUIPMENT
// ============================================================================

/**
 * Reactor Vessel (with agitator)
 * Chemical reactor with mixing
 */
export const reactor = createPIDSymbol(
  'REACTOR',
  70,
  110,
  'vessel',
  [
    { x: 35, y: 0, name: 'top' },
    { x: 35, y: 110, name: 'bottom' },
    { x: 0, y: 60, name: 'left' },
    { x: 70, y: 60, name: 'right' },
  ],
  (cx, cy, label) => {
    const w = 70;
    const h = 110;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Reactor body -->
      <rect x="${left}" y="${top + 15}" width="${w}" height="${h - 20}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Dished bottom -->
      <path d="M ${left},${top + h - 5} Q ${cx},${top + h + 5} ${left + w},${top + h - 5}" 
        stroke="currentColor" stroke-width="3" fill="none"/>
      <!-- Agitator shaft (from top) -->
      <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top + 15}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx}" y1="${top + 15}" x2="${cx}" y2="${cy + 20}" 
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/>
      <!-- Impeller -->
      <line x1="${cx - 15}" y1="${cy + 20}" x2="${cx + 15}" y2="${cy + 20}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="11" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Knockout Drum (vertical separator)
 * Removes liquid droplets from gas
 */
export const knockoutDrum = createPIDSymbol(
  'KNOCKOUT_DRUM',
  60,
  100,
  'vessel',
  [
    { x: 30, y: 0, name: 'gasOut' },
    { x: 30, y: 100, name: 'liquidOut' },
    { x: 50, y: 30, name: 'feedIn' },
  ],
  (cx, cy, label) => {
    const w = 60;
    const h = 100;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Drum body -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Mist eliminator (zigzag at top) -->
      <path d="M ${left + 10},${top + 15} l 10,-5 l 10,10 l 10,-10 l 10,5" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="11" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// ROTATING EQUIPMENT - COMPRESSORS
// ============================================================================

/**
 * Centrifugal Compressor
 * Similar to pump but for gas compression
 */
export const compressorCentrifugal = createPIDSymbol(
  'COMP_CENT',
  60,
  50,
  'pump',
  [
    { x: 0, y: 25, name: 'inlet' },
    { x: 60, y: 25, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 22;

    return `
      <!-- Compressor body (circle) -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Impeller with direction arrow -->
      <circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/>
      <path d="M ${cx + 3},${cy} l 8,0 l -3,-3 M ${cx + 11},${cy} l -3,3" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Inlet/outlet lines -->
      <line x1="${cx - 30}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 30}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 15}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Reciprocating Compressor
 * Piston-type compressor
 */
export const compressorReciprocating = createPIDSymbol(
  'COMP_RECIP',
  60,
  50,
  'pump',
  [
    { x: 0, y: 25, name: 'inlet' },
    { x: 60, y: 25, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const w = 44;
    const h = 30;

    return `
      <!-- Compressor body (rectangle) -->
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Piston indicator (line inside) -->
      <line x1="${cx - 10}" y1="${cy - h / 2 + 5}" x2="${cx - 10}" y2="${cy + h / 2 - 5}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Inlet/outlet lines -->
      <line x1="${cx - 30}" y1="${cy}" x2="${cx - w / 2}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <line x1="${cx + w / 2}" y1="${cy}" x2="${cx + 30}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + h / 2 + 15}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// MORE VALVES
// ============================================================================

/**
 * Butterfly Valve
 * Disc rotates to control flow
 */
export const valveButterfly = createPIDSymbol(
  'VALVE_BUTTERFLY',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 10;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Butterfly valve body (circle with ellipse disc) -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Disc (ellipse at angle) -->
      <ellipse cx="${cx}" cy="${cy}" rx="9" ry="2" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 12}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Three-Way Valve
 * Diverts flow between two outlets
 */
export const valveThreeWay = createPIDSymbol(
  'VALVE_3WAY',
  40,
  40,
  'valve',
  [
    { x: 0, y: 20, name: 'inlet' },
    { x: 40, y: 20, name: 'outlet1' },
    { x: 20, y: 40, name: 'outlet2' },
  ],
  (cx, cy, label) => {
    const size = 14;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 20}" y1="${cy}" x2="${cx - size / 2}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Valve body (triangle with base at inlet) -->
      <path d="M ${cx - size / 2},${cy} L ${cx + size / 2},${cy - size / 2} L ${cx + size / 2},${cy + size / 2} Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Outlet 1 (right) -->
      <line x1="${cx + size / 2}" y1="${cy}" x2="${cx + 20}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Outlet 2 (down) -->
      <line x1="${cx}" y1="${cy + size / 2}" x2="${cx}" y2="${cy + 20}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx + 20}" y="${cy - 10}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Needle Valve (fine control)
 */
export const valveNeedle = createPIDSymbol(
  'VALVE_NEEDLE',
  30,
  30,
  'valve',
  [
    { x: 0, y: 15, name: 'inlet' },
    { x: 30, y: 15, name: 'outlet' },
  ],
  (cx, cy, label) => {
    const r = 10;

    return `
      <!-- Inlet line -->
      <line x1="${cx - 15}" y1="${cy}" x2="${cx - r}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      <!-- Valve body (small circle) -->
      <circle cx="${cx}" cy="${cy}" r="${r}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="white"/>
      <!-- Needle indicator (small arrow from top) -->
      <line x1="${cx}" y1="${cy - r - 5}" x2="${cx}" y2="${cy - r}" 
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M ${cx},${cy - 3} L ${cx - 2},${cy - 6} L ${cx + 2},${cy - 6} Z" 
        fill="currentColor"/>
      <!-- Outlet line -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + 15}" y2="${cy}" 
        stroke="currentColor" stroke-width="2"/>
      ${label ? `<text x="${cx}" y="${cy + r + 12}" text-anchor="middle" font-size="9" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// MORE HEAT EXCHANGERS
// ============================================================================

/**
 * Plate Heat Exchanger
 * Compact design with plates
 */
export const heatExchangerPlate = createPIDSymbol(
  'HX_PLATE',
  60,
  70,
  'heatExchanger',
  [
    { x: 0, y: 20, name: 'hot_in' },
    { x: 60, y: 20, name: 'hot_out' },
    { x: 0, y: 50, name: 'cold_in' },
    { x: 60, y: 50, name: 'cold_out' },
  ],
  (cx, cy, label) => {
    const w = 60;
    const h = 70;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Outer rectangle -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Plates (vertical lines) -->
      <line x1="${left + 15}" y1="${top + 5}" x2="${left + 15}" y2="${top + h - 5}" 
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 25}" y1="${top + 5}" x2="${left + 25}" y2="${top + h - 5}" 
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 35}" y1="${top + 5}" x2="${left + 35}" y2="${top + h - 5}" 
        stroke="currentColor" stroke-width="1"/>
      <line x1="${left + 45}" y1="${top + 5}" x2="${left + 45}" y2="${top + h - 5}" 
        stroke="currentColor" stroke-width="1"/>
      ${label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

/**
 * Fired Heater / Furnace
 * Heating with combustion
 */
export const firedHeater = createPIDSymbol(
  'HEATER_FIRED',
  70,
  80,
  'heatExchanger',
  [
    { x: 10, y: 10, name: 'inlet' },
    { x: 60, y: 10, name: 'outlet' },
    { x: 35, y: 80, name: 'fuel' },
  ],
  (cx, cy, label) => {
    const w = 70;
    const h = 80;
    const left = cx - w / 2;
    const top = cy - h / 2;

    return `
      <!-- Heater box -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" 
        stroke="currentColor" 
        stroke-width="3" 
        fill="none"/>
      <!-- Tube coils (wavy lines) -->
      <path d="M ${left + 10},${top + 15} Q ${left + 20},${top + 10} ${left + 30},${top + 15} Q ${left + 40},${top + 20} ${left + 50},${top + 15}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <path d="M ${left + 10},${top + 30} Q ${left + 20},${top + 25} ${left + 30},${top + 30} Q ${left + 40},${top + 35} ${left + 50},${top + 30}" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"/>
      <!-- Flame symbols (triangles at bottom) -->
      <path d="M ${left + 20},${top + h - 15} L ${left + 25},${top + h - 5} L ${left + 15},${top + h - 5} Z" 
        fill="orange" stroke="currentColor" stroke-width="1"/>
      <path d="M ${left + 35},${top + h - 15} L ${left + 40},${top + h - 5} L ${left + 30},${top + h - 5} Z" 
        fill="orange" stroke="currentColor" stroke-width="1"/>
      <path d="M ${left + 50},${top + h - 15} L ${left + 55},${top + h - 5} L ${left + 45},${top + h - 5} Z" 
        fill="orange" stroke="currentColor" stroke-width="1"/>
      ${label ? `<text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="10" fill="currentColor">${label}</text>` : ''}
    `;
  }
);

// ============================================================================
// MORE INSTRUMENTATION
// ============================================================================

/**
 * Analyzer Transmitter (AT)
 */
export const analyzerTransmitter = createPIDSymbol(
  'AT',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'AT';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Pressure Indicator (PI)
 */
export const pressureIndicator = createPIDSymbol(
  'PI',
  40,
  40,
  'instrument',
  [{ x: 20, y: 40, name: 'process' }],
  (cx, cy, label) => {
    const tag = label || 'PI';
    return instrumentBubble(cx, cy, tag, true);
  }
);

/**
 * Temperature Indicator Controller (TIC)
 */
export const temperatureIndicatorController = createPIDSymbol(
  'TIC',
  40,
  40,
  'instrument',
  [
    { x: 20, y: 40, name: 'process' },
    { x: 20, y: 0, name: 'output' },
  ],
  (cx, cy, label) => {
    const tag = label || 'TIC';
    return instrumentBubble(cx, cy, tag, false); // Panel mounted
  }
);

/**
 * Level Indicator Controller (LIC)
 */
export const levelIndicatorController = createPIDSymbol(
  'LIC',
  40,
  40,
  'instrument',
  [
    { x: 20, y: 40, name: 'process' },
    { x: 20, y: 0, name: 'output' },
  ],
  (cx, cy, label) => {
    const tag = label || 'LIC';
    return instrumentBubble(cx, cy, tag, false); // Panel mounted
  }
);

/**
 * Pressure Indicator Controller (PIC)
 */
export const pressureIndicatorController = createPIDSymbol(
  'PIC',
  40,
  40,
  'instrument',
  [
    { x: 20, y: 40, name: 'process' },
    { x: 20, y: 0, name: 'output' },
  ],
  (cx, cy, label) => {
    const tag = label || 'PIC';
    return instrumentBubble(cx, cy, tag, false); // Panel mounted
  }
);

// ============================================================================
// EXPORT ALL SYMBOLS
// ============================================================================

export const pidSymbols = {
  // Vessels & Tanks
  vesselVertical,
  vesselHorizontal,
  storageTank,
  reactor,
  knockoutDrum,
  
  // Pumps & Compressors
  pumpCentrifugal,
  pumpPositiveDisplacement,
  compressorCentrifugal,
  compressorReciprocating,
  
  // Valves
  valveGate,
  valveGlobe,
  valveBall,
  valveCheck,
  valveControl,
  valveSafetyRelief,
  valveButterfly,
  valveThreeWay,
  valveNeedle,
  
  // Heat Exchangers
  heatExchangerShellTube,
  airCooler,
  heatExchangerPlate,
  firedHeater,
  
  // Instrumentation
  flowTransmitter,
  temperatureTransmitter,
  pressureTransmitter,
  levelTransmitter,
  flowIndicatorController,
  analyzerTransmitter,
  pressureIndicator,
  temperatureIndicatorController,
  levelIndicatorController,
  pressureIndicatorController,
};

export type PIDSymbolType = keyof typeof pidSymbols;
