import type { AnalysisAst, ElectricalProfile, PartAst } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';

/**
 * Convert ElectricalProfile from Langium AST to core format
 */
export function convertElectricalProfile(
  profile: Langium.ElectricalProfile
): ElectricalProfile {
  const electricalProfile: ElectricalProfile = {
    type: ProfileType.ELECTRICAL,
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process electrical statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net IN, OUT, GND
      for (const netName of statement.names) {
        electricalProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part R1 type:R value:10k pins:(IN,OUT)
      const part: PartAst = {
        ref: statement.ref,
        type: '',
        pins: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isPartTypeProperty(prop)) {
          part.type = prop.type;
        } else if (Langium.isPartValueProperty(prop)) {
          if (!part.params) part.params = {};
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          part.params.value = value;
        } else if (Langium.isPartSourceProperty(prop)) {
          if (!part.params) part.params = {};
          part.params.source = prop.source.replace(/^"|"$/g, '');
        } else if (Langium.isPartPinsProperty(prop)) {
          part.pins = prop.pins;
        } else if (Langium.isPartGenericProperty(prop)) {
          // Handle generic properties like model:"2N2222", w:"10u", l:"1u", ratio:"10:1"
          if (!part.params) part.params = {};
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          part.params[prop.key] = value;
        }
      }

      electricalProfile.parts.push(part);
    } else if (Langium.isAnalysisStatement(statement)) {
      // analysis tran "0 5m"
      if (!electricalProfile.analyses) electricalProfile.analyses = [];
      const analysis: AnalysisAst = {
        kind: statement.kind as AnalysisAst['kind'],
        args: statement.args?.replace(/^"|"$/g, ''),
      };
      electricalProfile.analyses.push(analysis);
    }
  }

  return electricalProfile;
}
