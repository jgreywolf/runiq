import type { ElectricalProfile, PartAst, AnalysisAst } from '@runiq/core';

/**
 * Export a ElectricalProfile to SPICE netlist format
 *
 * @param profile - The schematic profile to export
 * @param options - Export options (flavor: ngspice, pspice, ltspice)
 * @returns SPICE netlist as a string
 *
 * @example
 * ```typescript
 * const profile: ElectricalProfile = {
 *   type: 'electrical',
 *   name: 'RC Filter',
 *   nets: [{ name: 'IN' }, { name: 'OUT' }, { name: 'GND' }],
 *   parts: [
 *     { ref: 'V1', type: 'V', params: { source: 'SIN(0 1 1k)' }, pins: ['IN', 'GND'] },
 *     { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['IN', 'OUT'] },
 *     { ref: 'C1', type: 'C', params: { value: '1n' }, pins: ['OUT', 'GND'] }
 *   ],
 *   analyses: [{ kind: 'tran', args: '0 5m' }]
 * };
 *
 * const spice = toSpice(profile);
 * // Output:
 * // * RC Filter
 * // V1 IN 0 SIN(0 1 1k)
 * // R1 IN OUT 10k
 * // C1 OUT 0 1n
 * // .tran 0 5m
 * // .end
 * ```
 */
export function toSpice(
  profile: ElectricalProfile,
  _options?: { flavor?: 'ngspice' | 'pspice' | 'ltspice' }
): string {
  const lines: string[] = [];

  // Title comment
  lines.push(`* ${profile.name}`);

  // Export parts (components)
  if (profile.parts && profile.parts.length > 0) {
    for (const part of profile.parts) {
      const line = partToSpice(part);
      if (line) {
        lines.push(line);
      }
    }
  }

  // Export analyses
  if (profile.analyses && profile.analyses.length > 0) {
    for (const analysis of profile.analyses) {
      const line = analysisToSpice(analysis);
      if (line) {
        lines.push(line);
      }
    }
  }

  // End statement
  lines.push('.end');

  return lines.join('\n');
}

/**
 * Convert a PartAst to SPICE device line
 * Format: <ref> <node1> <node2> [...] <value>
 */
function partToSpice(part: PartAst): string {
  // Normalize pin names (GND -> 0)
  const pins = part.pins.map(normalizeNetName);

  // Build base line: ref + pins
  const baseLine = `${part.ref} ${pins.join(' ')}`;

  // Get value/source parameter
  let valueStr = '';
  if (part.params) {
    // For voltage/current sources, prefer 'source' over 'value'
    if (part.params.source) {
      valueStr = String(part.params.source);
    } else if (part.params.value) {
      valueStr = String(part.params.value);
    }
  }

  // Return complete line
  if (valueStr) {
    return `${baseLine} ${valueStr}`;
  }
  return baseLine;
}

/**
 * Convert an AnalysisAst to SPICE analysis directive
 * Format: .<kind> [args]
 */
function analysisToSpice(analysis: AnalysisAst): string {
  const directive = `.${analysis.kind}`;

  if (analysis.args) {
    return `${directive} ${analysis.args}`;
  }

  return directive;
}

/**
 * Normalize net names for SPICE
 * GND, gnd, Gnd -> 0
 * VSS, vss -> 0 (optional, common ground convention)
 */
function normalizeNetName(name: string): string {
  const upper = name.toUpperCase();

  if (upper === 'GND' || upper === 'VSS') {
    return '0';
  }

  return name;
}
