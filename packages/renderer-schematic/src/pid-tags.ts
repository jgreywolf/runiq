/**
 * P&ID Tag Numbering System
 * Following ISA-5.1 (ANSI/ISA-5.1-2009) standard for instrumentation symbols and identification
 *
 * Tag format: [Function][Loop][Suffix]
 * - Function: 1-4 letter code (e.g., FT, TIC, PAHH)
 * - Loop: Numeric identifier (e.g., 101, 205)
 * - Suffix: Optional letter (A, B, C for parallel instruments)
 *
 * Examples:
 * - FT-101: Flow Transmitter, Loop 101
 * - TIC-205: Temperature Indicator Controller, Loop 205
 * - PAHH-310A: Pressure Alarm High High, Loop 310, Instrument A
 *
 * @module pid-tags
 */

// ============================================================================
// ISA-5.1 FUNCTION CODE DEFINITIONS
// ============================================================================

/**
 * First letter: Measured/Initiating variable
 * Defines what is being measured
 */
export const measuredVariables = {
  A: 'Analysis (composition, concentration, etc.)',
  B: 'Burner, Combustion',
  C: 'Conductivity (electrical)',
  D: 'Density or Specific Gravity',
  E: 'Voltage (EMF)',
  F: 'Flow Rate',
  G: 'Gauging (dimensional)',
  H: 'Hand (manually initiated)',
  I: 'Current (electrical)',
  J: 'Power',
  K: 'Time or Time Schedule',
  L: 'Level',
  M: 'Moisture or Humidity',
  N: 'User-defined',
  O: 'User-defined',
  P: 'Pressure or Vacuum',
  Q: 'Quantity or Event',
  R: 'Radiation',
  S: 'Speed or Frequency',
  T: 'Temperature',
  U: 'Multivariable',
  V: 'Vibration or Mechanical Analysis',
  W: 'Weight or Force',
  X: 'Unclassified',
  Y: 'Event, State, or Presence',
  Z: 'Position or Dimension',
} as const;

/**
 * Subsequent letters: Readout/Passive function
 * Modifies or clarifies the function
 */
export const readoutFunctions = {
  A: 'Alarm',
  B: 'User-defined',
  C: 'Control',
  D: 'Differential',
  E: 'Element (primary)',
  F: 'Ratio (fraction)',
  G: 'Glass, Gauge, or Viewing Device',
  H: 'High',
  I: 'Indicate',
  J: 'Scan',
  K: 'Time Rate of Change',
  L: 'Low',
  M: 'Middle or Intermediate',
  N: 'User-defined',
  O: 'Orifice or Restriction',
  P: 'Point (test connection)',
  Q: 'Integrate or Totalize',
  R: 'Record',
  S: 'Switch',
  T: 'Transmit',
  U: 'Multifunction',
  V: 'Valve, Damper, or Louver',
  W: 'Well',
  X: 'Unclassified',
  Y: 'Relay, Compute, or Convert',
  Z: 'Driver, Actuator, or Final Control Element',
} as const;

/**
 * Common ISA-5.1 tag combinations
 * Pre-defined for validation and auto-completion
 */
export const commonTagCombinations = {
  // Flow
  FE: 'Flow Element',
  FI: 'Flow Indicator',
  FIC: 'Flow Indicator Controller',
  FIT: 'Flow Indicating Transmitter',
  FT: 'Flow Transmitter',
  FV: 'Flow Valve (control)',
  FY: 'Flow Relay/Computer',

  // Temperature
  TE: 'Temperature Element',
  TI: 'Temperature Indicator',
  TIC: 'Temperature Indicator Controller',
  TIT: 'Temperature Indicating Transmitter',
  TT: 'Temperature Transmitter',
  TV: 'Temperature Valve (control)',
  TW: 'Temperature Well',
  TY: 'Temperature Relay/Computer',

  // Pressure
  PE: 'Pressure Element',
  PI: 'Pressure Indicator',
  PIC: 'Pressure Indicator Controller',
  PIT: 'Pressure Indicating Transmitter',
  PT: 'Pressure Transmitter',
  PV: 'Pressure Valve (control)',
  PY: 'Pressure Relay/Computer',

  // Level
  LE: 'Level Element',
  LI: 'Level Indicator',
  LIC: 'Level Indicator Controller',
  LIT: 'Level Indicating Transmitter',
  LT: 'Level Transmitter',
  LG: 'Level Gauge/Glass',
  LV: 'Level Valve (control)',
  LY: 'Level Relay/Computer',

  // Analysis
  AI: 'Analysis Indicator',
  AIC: 'Analysis Indicator Controller',
  AIT: 'Analysis Indicating Transmitter',
  AT: 'Analysis Transmitter',
  AY: 'Analysis Relay/Computer',

  // Alarms and Switches
  PAH: 'Pressure Alarm High',
  PAHH: 'Pressure Alarm High High',
  PAL: 'Pressure Alarm Low',
  PALL: 'Pressure Alarm Low Low',
  PSH: 'Pressure Switch High',
  PSL: 'Pressure Switch Low',
  TAH: 'Temperature Alarm High',
  TAL: 'Temperature Alarm Low',
  TSH: 'Temperature Switch High',
  TSL: 'Temperature Switch Low',
  LAH: 'Level Alarm High',
  LAL: 'Level Alarm Low',
  LSH: 'Level Switch High',
  LSL: 'Level Switch Low',
  FAH: 'Flow Alarm High',
  FAL: 'Flow Alarm Low',
  FSH: 'Flow Switch High',
  FSL: 'Flow Switch Low',

  // Control valves
  FCV: 'Flow Control Valve',
  TCV: 'Temperature Control Valve',
  PCV: 'Pressure Control Valve',
  LCV: 'Level Control Valve',

  // Hand/Manual
  HV: 'Hand Valve',
  HIC: 'Hand Indicator Controller',

  // Special
  XV: 'Solenoid Valve (on-off)',
  ZSH: 'Position Switch High',
  ZSL: 'Position Switch Low',
  SV: 'Speed Control Valve',
  SI: 'Speed Indicator',
} as const;

// ============================================================================
// TAG STRUCTURE AND PARSING
// ============================================================================

/**
 * P&ID Tag structure
 */
export interface PIDTag {
  /** Full tag string (e.g., "FT-101A") */
  fullTag: string;

  /** Function code (e.g., "FT") */
  functionCode: string;

  /** Loop number (e.g., "101") */
  loopNumber: string;

  /** Optional suffix (e.g., "A") */
  suffix?: string;

  /** Measured variable (first letter) */
  measuredVariable: string;

  /** Readout function (subsequent letters) */
  readoutFunction: string;

  /** Human-readable description */
  description?: string;

  /** Location/area code (optional) */
  location?: string;

  /** Whether tag is field-mounted */
  fieldMounted?: boolean;
}

/**
 * Parse a P&ID tag string into components
 * Examples: "FT-101", "TIC-205", "PAHH-310A"
 */
export function parseTag(tagString: string): PIDTag | null {
  // Remove whitespace and convert to uppercase
  const tag = tagString.trim().toUpperCase();

  // Pattern: [Letters]-[Numbers][OptionalLetter]
  // Examples: FT-101, TIC-205, PAHH-310A
  const pattern = /^([A-Z]{1,4})-(\d{1,4})([A-Z])?$/;
  const match = tag.match(pattern);

  if (!match) {
    return null;
  }

  const functionCode = match[1];
  const loopNumber = match[2];
  const suffix = match[3];

  // Extract measured variable (first letter)
  const measuredVariable = functionCode[0];

  // Extract readout function (remaining letters)
  const readoutFunction = functionCode.slice(1);

  // Get description if it's a common tag
  const description =
    commonTagCombinations[functionCode as keyof typeof commonTagCombinations];

  return {
    fullTag: tag,
    functionCode,
    loopNumber,
    suffix,
    measuredVariable,
    readoutFunction,
    description,
  };
}

/**
 * Validate a P&ID tag
 * Returns validation errors or empty array if valid
 */
export function validateTag(tagString: string): string[] {
  const errors: string[] = [];

  const parsed = parseTag(tagString);
  if (!parsed) {
    errors.push(
      'Invalid tag format. Expected format: [Function]-[Loop][Suffix] (e.g., FT-101, TIC-205A)'
    );
    return errors;
  }

  // Validate measured variable (first letter)
  if (!(parsed.measuredVariable in measuredVariables)) {
    errors.push(
      `Invalid measured variable: ${parsed.measuredVariable}. See ISA-5.1 Table 1.`
    );
  }

  // Validate readout function letters
  for (const letter of parsed.readoutFunction) {
    if (!(letter in readoutFunctions)) {
      errors.push(
        `Invalid readout function letter: ${letter}. See ISA-5.1 Table 1.`
      );
    }
  }

  // Validate function code length
  if (parsed.functionCode.length > 4) {
    errors.push('Function code too long. Maximum 4 letters per ISA-5.1.');
  }

  // Validate loop number
  const loopNum = parseInt(parsed.loopNumber, 10);
  if (isNaN(loopNum) || loopNum < 1 || loopNum > 9999) {
    errors.push('Loop number must be between 1 and 9999.');
  }

  // Validate suffix (single letter only)
  if (parsed.suffix && parsed.suffix.length !== 1) {
    errors.push('Suffix must be a single letter (A-Z).');
  }

  return errors;
}

/**
 * Generate a P&ID tag from components
 */
export function createTag(
  functionCode: string,
  loopNumber: number | string,
  suffix?: string,
  location?: string
): string {
  const func = functionCode.toUpperCase();
  const loop =
    typeof loopNumber === 'number'
      ? loopNumber.toString().padStart(3, '0')
      : loopNumber;
  const suf = suffix ? suffix.toUpperCase() : '';
  const loc = location ? `(${location})` : '';

  return `${func}-${loop}${suf}${loc}`;
}

/**
 * Check if a tag represents a field-mounted instrument
 * Field-mounted: Transmitter, Element, Indicator (without Controller)
 * Panel-mounted: Controller, Recorder, Indicator Controller
 */
export function isFieldMounted(tag: PIDTag): boolean {
  const func = tag.functionCode;

  // Field-mounted indicators
  const fieldFunctions = ['T', 'E', 'I'];

  // Panel-mounted functions
  const panelFunctions = ['C', 'R'];

  // Check if it contains any panel function
  for (const letter of func) {
    if (panelFunctions.includes(letter)) {
      return false;
    }
  }

  // Check if it contains field function
  for (const letter of func) {
    if (fieldFunctions.includes(letter)) {
      return true;
    }
  }

  // Default to field-mounted for transmitters
  return func.includes('T');
}

/**
 * Get tag category for grouping/organizing
 */
export function getTagCategory(tag: PIDTag): string {
  const var1 = tag.measuredVariable;

  const categories: Record<string, string> = {
    F: 'Flow',
    T: 'Temperature',
    P: 'Pressure',
    L: 'Level',
    A: 'Analysis',
    S: 'Speed',
    V: 'Vibration',
    W: 'Weight',
    H: 'Manual',
    X: 'Special',
    Y: 'Event',
    Z: 'Position',
  };

  return categories[var1] || 'Other';
}

/**
 * Generate a sequential tag
 * Useful for creating multiple similar tags
 */
export function generateSequentialTags(
  functionCode: string,
  startLoop: number,
  count: number,
  suffix?: string
): string[] {
  const tags: string[] = [];

  for (let i = 0; i < count; i++) {
    tags.push(createTag(functionCode, startLoop + i, suffix));
  }

  return tags;
}

/**
 * Extract loop number from tag
 */
export function getLoopNumber(tagString: string): number | null {
  const parsed = parseTag(tagString);
  if (!parsed) return null;

  return parseInt(parsed.loopNumber, 10);
}

/**
 * Check if two tags are in the same control loop
 * Tags are in same loop if they share the same measured variable and loop number
 */
export function isSameLoop(tag1: string, tag2: string): boolean {
  const p1 = parseTag(tag1);
  const p2 = parseTag(tag2);

  if (!p1 || !p2) return false;

  return (
    p1.measuredVariable === p2.measuredVariable &&
    p1.loopNumber === p2.loopNumber
  );
}

/**
 * Get all tags in a control loop
 * Returns array of tags that share the same measured variable and loop number
 */
export function getLoopTags(tags: string[], referenceTag: string): string[] {
  return tags.filter((tag) => isSameLoop(tag, referenceTag));
}

/**
 * Format tag for display with optional description
 */
export function formatTagDisplay(
  tagString: string,
  showDescription = true
): string {
  const parsed = parseTag(tagString);
  if (!parsed) return tagString;

  if (showDescription && parsed.description) {
    return `${parsed.fullTag} (${parsed.description})`;
  }

  return parsed.fullTag;
}

/**
 * Suggest tag completions based on partial input
 * Useful for auto-complete in editors
 */
export function suggestTags(partial: string): string[] {
  const upper = partial.toUpperCase();
  const suggestions: string[] = [];

  // Match against common combinations
  for (const [code, description] of Object.entries(commonTagCombinations)) {
    if (code.startsWith(upper)) {
      suggestions.push(`${code} - ${description}`);
    }
  }

  return suggestions.slice(0, 10); // Limit to 10 suggestions
}

/**
 * Check if a tag follows ISA-5.1 naming conventions
 */
export function isISACompliant(tagString: string): boolean {
  const errors = validateTag(tagString);
  return errors.length === 0;
}
