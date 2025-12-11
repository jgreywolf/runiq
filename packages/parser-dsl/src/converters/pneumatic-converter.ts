import type {
  FlowRateSpec,
  PartAst,
  PneumaticProfile,
  PressureSpec,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';

/**
 * Convert PneumaticProfile from Langium AST to core format
 */
export function convertPneumaticProfile(
  profile: Langium.PneumaticProfile
): PneumaticProfile {
  const pneumaticProfile: PneumaticProfile = {
    type: ProfileType.PNEUMATIC,
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process pneumatic statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net P, A, R
      for (const netName of statement.names) {
        pneumaticProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part CYL1 type:CYL_SA pins:(A,P,EXHAUST)
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
        } else if (Langium.isPartPinsProperty(prop)) {
          part.pins = prop.pins;
        } else if (Langium.isPartGenericProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          // Handle 'doc' property specially
          if (prop.key === 'doc') {
            part.doc = value as string;
          } else {
            if (!part.params) part.params = {};
            part.params[prop.key] = value;
          }
        }
      }

      pneumaticProfile.parts.push(part);
    } else if (Langium.isPressureStatement(statement)) {
      // pressure 6 bar operating
      const pressure: PressureSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as PressureSpec['unit'],
      };
      if (statement.type) {
        pressure.type = statement.type as PressureSpec['type'];
      }
      pneumaticProfile.pressure = pressure;
    } else if (Langium.isFlowRateStatement(statement)) {
      // flowRate 100 L/min
      const flowRate: FlowRateSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as FlowRateSpec['unit'],
      };
      pneumaticProfile.flowRate = flowRate;
    }
  }

  return pneumaticProfile;
}
