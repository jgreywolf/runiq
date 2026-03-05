/**
 * P&ID Line Types
 * Following ISA-5.1 and ISO 14617 standards for process diagrams
 *
 * Line types represent different kinds of connections in P&IDs:
 * - Process lines: Material flow (liquids, gases, solids)
 * - Instrument signals: Measurement and control signals
 * - Electrical: Power and signal wiring
 * - Pneumatic: Compressed air signals
 * - Hydraulic: Hydraulic fluid signals
 * - Software/Data: Digital communications
 *
 * @module pid-line-types
 */

/**
 * P&ID Line Type Definition
 * Defines appearance and behavior of connection lines
 */
export interface PIDLineType {
  /** Unique identifier for the line type */
  id: string;

  /** Human-readable name */
  name: string;

  /** Category of line */
  category:
    | 'process'
    | 'signal'
    | 'electrical'
    | 'pneumatic'
    | 'hydraulic'
    | 'data';

  /** SVG stroke-dasharray pattern (empty for solid) */
  dashPattern: string;

  /** Line width multiplier (1.0 = normal) */
  widthMultiplier: number;

  /** Default color (can be overridden) */
  defaultColor?: string;

  /** Whether this is a double line (for special cases) */
  isDoubleLine?: boolean;

  /** Description of when to use this line type */
  description: string;
}

/**
 * Generate SVG attributes for a line type
 */
export function getLineTypeStyle(
  lineType: PIDLineType,
  baseWidth: number = 2,
  color?: string
): string {
  const width = baseWidth * lineType.widthMultiplier;
  const strokeColor = color || lineType.defaultColor || 'currentColor';
  const dashArray = lineType.dashPattern
    ? `stroke-dasharray="${lineType.dashPattern}"`
    : '';

  return `stroke="${strokeColor}" stroke-width="${width}" ${dashArray} fill="none"`;
}

/**
 * Render a double line (two parallel lines)
 * Used for pneumatic lines per ISA-5.1
 */
export function renderDoubleLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  separation: number = 4,
  style: string
): string {
  // Calculate perpendicular offset
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return '';

  const perpX = ((-dy / length) * separation) / 2;
  const perpY = ((dx / length) * separation) / 2;

  return `
    <line x1="${x1 + perpX}" y1="${y1 + perpY}" x2="${x2 + perpX}" y2="${y2 + perpY}" ${style}/>
    <line x1="${x1 - perpX}" y1="${y1 - perpY}" x2="${x2 - perpX}" y2="${y2 - perpY}" ${style}/>
  `;
}

// ============================================================================
// PROCESS LINES
// ============================================================================

/**
 * Process Line - Solid
 * Main process piping for liquids, gases, or solids
 * Most common line type in P&IDs
 */
export const processLine: PIDLineType = {
  id: 'PROCESS',
  name: 'Process Line',
  category: 'process',
  dashPattern: '',
  widthMultiplier: 1.5,
  defaultColor: 'black',
  description: 'Main process piping for material flow',
};

/**
 * Process Line - Future/Proposed
 * Dashed line for future or proposed equipment
 */
export const processFuture: PIDLineType = {
  id: 'PROCESS_FUTURE',
  name: 'Future Process Line',
  category: 'process',
  dashPattern: '10,5',
  widthMultiplier: 1.5,
  defaultColor: 'black',
  description: 'Future or proposed process piping',
};

/**
 * Utility Line
 * Service lines (steam, water, air, nitrogen, etc.)
 * Slightly thinner than main process
 */
export const utilityLine: PIDLineType = {
  id: 'UTILITY',
  name: 'Utility Line',
  category: 'process',
  dashPattern: '',
  widthMultiplier: 1.2,
  defaultColor: 'black',
  description: 'Utility service lines (steam, cooling water, etc.)',
};

// ============================================================================
// INSTRUMENT SIGNAL LINES
// ============================================================================

/**
 * Instrument Signal - Pneumatic
 * Dashed line for pneumatic signals (3-15 psi)
 * ISA-5.1 standard for air signals
 */
export const signalPneumatic: PIDLineType = {
  id: 'SIGNAL_PNEUMATIC',
  name: 'Pneumatic Signal',
  category: 'signal',
  dashPattern: '8,4',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Pneumatic instrument signal (3-15 psi air)',
};

/**
 * Instrument Signal - Electronic
 * Dashed line for electronic signals (4-20mA, digital)
 * ISA-5.1 standard for electrical signals
 */
export const signalElectronic: PIDLineType = {
  id: 'SIGNAL_ELECTRONIC',
  name: 'Electronic Signal',
  category: 'signal',
  dashPattern: '8,4',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Electronic instrument signal (4-20mA, digital)',
};

/**
 * Instrument Signal - Hydraulic
 * Dashed line for hydraulic signals
 */
export const signalHydraulic: PIDLineType = {
  id: 'SIGNAL_HYDRAULIC',
  name: 'Hydraulic Signal',
  category: 'signal',
  dashPattern: '8,4',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Hydraulic instrument signal',
};

/**
 * Instrument Signal - Software/Data
 * Dotted line for digital communications (Fieldbus, Ethernet, etc.)
 */
export const signalSoftware: PIDLineType = {
  id: 'SIGNAL_SOFTWARE',
  name: 'Software/Data Link',
  category: 'data',
  dashPattern: '2,3',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Digital communication link (Fieldbus, Ethernet, wireless)',
};

// ============================================================================
// ELECTRICAL LINES
// ============================================================================

/**
 * Electrical Power
 * Solid line for electrical power wiring
 */
export const electrical: PIDLineType = {
  id: 'ELECTRICAL',
  name: 'Electrical Power',
  category: 'electrical',
  dashPattern: '',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Electrical power wiring',
};

/**
 * Electrical Signal
 * Dash-dot line for electrical signal wiring
 */
export const electricalSignal: PIDLineType = {
  id: 'ELECTRICAL_SIGNAL',
  name: 'Electrical Signal',
  category: 'electrical',
  dashPattern: '10,3,2,3',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Electrical signal wiring',
};

// ============================================================================
// PNEUMATIC/HYDRAULIC SUPPLY LINES
// ============================================================================

/**
 * Pneumatic Supply
 * Double line for pneumatic supply (air, nitrogen)
 * ISA-5.1 uses double lines for pneumatic supplies
 */
export const pneumaticSupply: PIDLineType = {
  id: 'PNEUMATIC_SUPPLY',
  name: 'Pneumatic Supply',
  category: 'pneumatic',
  dashPattern: '',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  isDoubleLine: true,
  description: 'Pneumatic supply line (compressed air or gas)',
};

/**
 * Hydraulic Supply
 * Thick solid line for hydraulic supply
 */
export const hydraulicSupply: PIDLineType = {
  id: 'HYDRAULIC_SUPPLY',
  name: 'Hydraulic Supply',
  category: 'hydraulic',
  dashPattern: '',
  widthMultiplier: 2.0,
  defaultColor: 'black',
  description: 'Hydraulic supply line',
};

// ============================================================================
// SPECIAL PURPOSE LINES
// ============================================================================

/**
 * Mechanical Link
 * Dash-dot-dot line for mechanical connections
 */
export const mechanicalLink: PIDLineType = {
  id: 'MECHANICAL',
  name: 'Mechanical Link',
  category: 'process',
  dashPattern: '10,3,2,3,2,3',
  widthMultiplier: 1.0,
  defaultColor: 'black',
  description: 'Mechanical connection or linkage',
};

/**
 * Insulated Line
 * Process line with insulation indicator
 * Note: Typically shown with parallel dashes outside main line
 */
export const insulatedLine: PIDLineType = {
  id: 'INSULATED',
  name: 'Insulated Line',
  category: 'process',
  dashPattern: '',
  widthMultiplier: 1.5,
  defaultColor: 'black',
  description: 'Insulated process line (show with parallel marks)',
};

/**
 * Jacketed/Traced Line
 * Process line with heating/cooling jacket
 */
export const jacketedLine: PIDLineType = {
  id: 'JACKETED',
  name: 'Jacketed Line',
  category: 'process',
  dashPattern: '',
  widthMultiplier: 1.5,
  defaultColor: 'black',
  description: 'Jacketed or heat-traced line (show with double line)',
};

// ============================================================================
// EXPORT ALL LINE TYPES
// ============================================================================

export const pidLineTypes = {
  // Process Lines
  processLine,
  processFuture,
  utilityLine,

  // Instrument Signals
  signalPneumatic,
  signalElectronic,
  signalHydraulic,
  signalSoftware,

  // Electrical
  electrical,
  electricalSignal,

  // Pneumatic/Hydraulic Supply
  pneumaticSupply,
  hydraulicSupply,

  // Special Purpose
  mechanicalLink,
  insulatedLine,
  jacketedLine,
};

export type PIDLineTypeId = keyof typeof pidLineTypes;

/**
 * Get a line type by ID
 */
export function getLineType(id: PIDLineTypeId): PIDLineType {
  return pidLineTypes[id];
}

/**
 * Render a line with the specified type
 * Handles both single and double lines
 */
export function renderPIDLine(
  lineType: PIDLineType,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  baseWidth: number = 2,
  color?: string
): string {
  const style = getLineTypeStyle(lineType, baseWidth, color);

  if (lineType.isDoubleLine) {
    return renderDoubleLine(x1, y1, x2, y2, 4, style);
  }

  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${style}/>`;
}

/**
 * Helper to render insulation marks on a line
 * Adds small perpendicular marks along the line
 */
export function renderInsulationMarks(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  spacing: number = 20,
  markLength: number = 8
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return '';

  const perpX = ((-dy / length) * markLength) / 2;
  const perpY = ((dx / length) * markLength) / 2;

  let marks = '';
  const numMarks = Math.floor(length / spacing);

  for (let i = 1; i <= numMarks; i++) {
    const t = i / (numMarks + 1);
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    marks += `<line x1="${x + perpX}" y1="${y + perpY}" x2="${x - perpX}" y2="${y - perpY}" stroke="currentColor" stroke-width="1"/>`;
  }

  return marks;
}
