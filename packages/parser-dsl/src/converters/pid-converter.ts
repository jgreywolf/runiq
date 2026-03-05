import type {
  PIDEquipment,
  PIDInstrument,
  PIDLine,
  PIDLoop,
  PIDProfile,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';

/**
 * Convert PIDProfile from Langium AST to core format
 */
export function convertPIDProfile(profile: Langium.PIDProfile): PIDProfile {
  const pidProfile: PIDProfile = {
    type: ProfileType.PID,
    name: profile.name.replace(/^"|"$/g, ''),
    equipment: [],
    instruments: [],
    lines: [],
    loops: [],
  };

  // Process P&ID statements
  for (const statement of profile.statements) {
    if (Langium.isPIDEquipmentStatement(statement)) {
      // equipment TK-101 type:storageTank volume:5000 unit:L material:CS
      const equipment: PIDEquipment = {
        tag: statement.tag,
        type: '', // Will be filled from properties
        properties: {},
      };

      // Extract properties from the properties array
      for (const prop of statement.properties) {
        if (Langium.isPIDEquipmentTypeProperty(prop)) {
          equipment.type = prop.type;
        } else if (Langium.isPIDVolumeProperty(prop)) {
          equipment.properties!.volume = parseFloat(prop.value);
          equipment.properties!.volumeUnit = prop.unit;
        } else if (Langium.isPIDFlowRateProperty(prop)) {
          equipment.properties!.flowRate = parseFloat(prop.value);
          equipment.properties!.flowRateUnit = prop.unit;
        } else if (Langium.isPIDMaterialProperty(prop)) {
          equipment.properties!.material = prop.material;
        } else if (Langium.isPIDRatingProperty(prop)) {
          equipment.properties!.rating = prop.rating;
        } else if (Langium.isPIDDimensionProperty(prop)) {
          equipment.properties!.dimension = parseFloat(prop.value);
          equipment.properties!.dimensionUnit = prop.unit;
        } else if (Langium.isGenericPIDProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          equipment.properties![prop.key] = value;
        }
      }

      pidProfile.equipment.push(equipment);
    } else if (Langium.isPIDInstrumentStatement(statement)) {
      // instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h location:field
      const instrument: PIDInstrument = {
        tag: statement.tag,
        type: '', // Will be filled from properties
        properties: {},
      };

      // Extract properties
      for (const prop of statement.properties) {
        if (Langium.isPIDInstrumentTypeProperty(prop)) {
          instrument.type = prop.type;
        } else if (Langium.isPIDRangeProperty(prop)) {
          instrument.properties!.rangeMin = parseFloat(prop.min);
          instrument.properties!.rangeMax = parseFloat(prop.max);
          if (prop.unit) {
            instrument.properties!.rangeUnit = prop.unit;
          }
        } else if (Langium.isPIDLocationProperty(prop)) {
          instrument.properties!.location = prop.location;
        } else if (Langium.isPIDLoopRefProperty(prop)) {
          instrument.properties!.loop = prop.loopNum;
        } else if (Langium.isPIDAccuracyProperty(prop)) {
          instrument.properties!.accuracy = parseFloat(prop.value);
          if (prop.unit) {
            instrument.properties!.accuracyUnit = prop.unit;
          }
        } else if (Langium.isGenericPIDProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          instrument.properties![prop.key] = value;
        }
      }

      pidProfile.instruments.push(instrument);
    } else if (Langium.isPIDLineStatement(statement)) {
      // line process from:TK-101.outlet to:P-101.inlet size:4 unit:in
      const line: PIDLine = {
        type: '', // Will be filled from properties
        from: { equipment: '' },
        to: { equipment: '' },
        properties: {},
      };

      // Extract properties
      // Note: lineType is directly on the statement, not in properties
      line.type = statement.lineType;

      for (const prop of statement.properties) {
        if (Langium.isPIDLineFromProperty(prop)) {
          line.from.equipment = prop.from.equipment;
          line.from.port = prop.from.port;
        } else if (Langium.isPIDLineToProperty(prop)) {
          line.to.equipment = prop.to.equipment;
          line.to.port = prop.to.port;
        } else if (Langium.isPIDLineSizeProperty(prop)) {
          line.properties!.size = parseFloat(prop.size);
          if (prop.unit) {
            line.properties!.sizeUnit = prop.unit;
          }
        } else if (Langium.isPIDLineScheduleProperty(prop)) {
          line.properties!.schedule = prop.schedule;
        } else if (Langium.isPIDLineMaterialProperty(prop)) {
          line.properties!.material = prop.material;
        } else if (Langium.isPIDLineInsulationProperty(prop)) {
          line.properties!.insulation = prop.type;
        } else if (Langium.isGenericPIDProperty(prop)) {
          let value = prop.value;
          if (
            typeof value === 'string' &&
            value.startsWith('"') &&
            value.endsWith('"')
          ) {
            value = value.slice(1, -1);
          }
          line.properties![prop.key] = value;
        }
      }

      pidProfile.lines.push(line);
    } else if (Langium.isPIDLoopStatement(statement)) {
      // loop 101 controlled_variable:flow setpoint:50 unit:m³/h controller:FIC-101 mode:auto
      const loop: PIDLoop = {
        id: parseInt(statement.loopNum),
        controlledVariable: '', // Will be filled from properties
      };

      // Extract properties
      for (const prop of statement.properties) {
        if (Langium.isPIDControlledVariableProperty(prop)) {
          loop.controlledVariable = prop.variable;
        } else if (Langium.isPIDSetpointProperty(prop)) {
          loop.setpoint = parseFloat(prop.value);
          if (prop.unit) {
            loop.unit = prop.unit;
          }
        } else if (Langium.isPIDControllerProperty(prop)) {
          loop.controller = prop.tag;
        } else if (Langium.isPIDControlModeProperty(prop)) {
          loop.mode = prop.mode;
        } else if (Langium.isGenericPIDProperty(prop)) {
          // Handle any additional properties
        }
      }

      pidProfile.loops.push(loop);
    } else if (Langium.isFluidStatement(statement)) {
      // fluid "Water" or fluid mineral "ISO VG 46"
      if (!pidProfile.processSpecs) {
        pidProfile.processSpecs = {};
      }
      // For P&ID, fluid statement has a type and optional viscosity
      pidProfile.processSpecs.fluid = statement.type;
      if (statement.viscosity) {
        pidProfile.processSpecs.fluid = statement.viscosity.replace(
          /^"|"$/g,
          ''
        );
      }
    } else if (Langium.isPressureStatement(statement)) {
      // pressure 3 bar (note: 'unit' keyword is optional in some contexts)
      if (!pidProfile.processSpecs) {
        pidProfile.processSpecs = {};
      }
      pidProfile.processSpecs.pressure = parseFloat(statement.value);
      if (statement.unit) {
        pidProfile.processSpecs.pressureUnit = statement.unit;
      }
    } else if (Langium.isFlowRateStatement(statement)) {
      // flowRate 60 m³/h
      if (!pidProfile.processSpecs) {
        pidProfile.processSpecs = {};
      }
      pidProfile.processSpecs.flowRate = parseFloat(statement.value);
      pidProfile.processSpecs.flowRateUnit = statement.unit;
    }
  }

  return pidProfile;
}
