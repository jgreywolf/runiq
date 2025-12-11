import type {
  HydraulicProfile,
  PartAst,
  PressureSpec,
  FlowRateSpec,
  FluidSpec,
  TemperatureRange,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';

/**
 * Convert HydraulicProfile from Langium AST to core format
 */
export function convertHydraulicProfile(
  profile: Langium.HydraulicProfile
): HydraulicProfile {
  const hydraulicProfile: HydraulicProfile = {
    type: ProfileType.HYDRAULIC,
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  // Process hydraulic statements
  for (const statement of profile.statements) {
    if (Langium.isNetStatement(statement)) {
      // net P, A, B, T
      for (const netName of statement.names) {
        hydraulicProfile.nets.push({ name: netName });
      }
    } else if (Langium.isPartStatement(statement)) {
      // part PUMP1 type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
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

      hydraulicProfile.parts.push(part);
    } else if (Langium.isPressureStatement(statement)) {
      // pressure 200 bar max
      const pressure: PressureSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as PressureSpec['unit'],
      };
      if (statement.type) {
        pressure.type = statement.type as PressureSpec['type'];
      }
      hydraulicProfile.pressure = pressure;
    } else if (Langium.isFlowRateStatement(statement)) {
      // flowRate 50 L/min
      const flowRate: FlowRateSpec = {
        value: parseFloat(statement.value),
        unit: statement.unit as FlowRateSpec['unit'],
      };
      hydraulicProfile.flowRate = flowRate;
    } else if (Langium.isFluidStatement(statement)) {
      // fluid mineral "ISO VG 46" temp:(10,60,C)
      const fluid: FluidSpec = {
        type: statement.type as FluidSpec['type'],
      };
      if (statement.viscosity) {
        fluid.viscosity = statement.viscosity.replace(/^"|"$/g, '');
      }
      if (
        statement.minTemp !== undefined &&
        statement.maxTemp !== undefined &&
        statement.tempUnit
      ) {
        const temperature: TemperatureRange = {
          min: parseFloat(statement.minTemp),
          max: parseFloat(statement.maxTemp),
          unit: statement.tempUnit as TemperatureRange['unit'],
        };
        fluid.temperature = temperature;
      }
      hydraulicProfile.fluid = fluid;
    }
  }

  return hydraulicProfile;
}
