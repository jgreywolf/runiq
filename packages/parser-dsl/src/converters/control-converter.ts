import type { ControlProfile, PartAst } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

/**
 * Convert ControlProfile from Langium AST to core format
 */
export function convertControlProfile(
  profile: Langium.ControlProfile
): ControlProfile {
  const controlProfile: ControlProfile = {
    type: ProfileType.CONTROL,
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  for (const statement of profile.statements) {
    if (Langium.isControlVariantStatement(statement)) {
      controlProfile.variant = statement.variant as ControlProfile['variant'];
      continue;
    }

    if (Langium.isNetStatement(statement)) {
      for (const netName of statement.names) {
        controlProfile.nets.push({ name: unescapeString(netName) });
      }
      continue;
    }

    if (Langium.isPartStatement(statement)) {
      const part: PartAst = {
        ref: unescapeString(statement.ref),
        type: '',
        pins: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isPartTypeProperty(prop)) {
          part.type = unescapeString(prop.type);
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
          part.pins = prop.pins.map((pin) => unescapeString(pin));
        } else if (Langium.isPartGenericProperty(prop)) {
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

      controlProfile.parts.push(part);
    }
  }

  return controlProfile;
}
