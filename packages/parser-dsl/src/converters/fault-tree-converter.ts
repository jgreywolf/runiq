import type { FaultTreeEvent, FaultTreeGate, FaultTreeProfile } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

export function convertFaultTreeProfile(
  profile: Langium.FaultTreeProfile
): FaultTreeProfile {
  const faultTree: FaultTreeProfile = {
    type: ProfileType.FAULT_TREE,
    astVersion: '1.0.0',
    title: profile.name.replace(/^"|"$/g, ''),
    events: [],
    gates: [],
  };

  for (const statement of profile.statements) {
    if (Langium.isThemeDeclaration(statement)) {
      faultTree.theme = statement.value;
      continue;
    }

    if (Langium.isFaultTreeTopEventStatement(statement)) {
      const event: FaultTreeEvent = {
        id: unescapeString(statement.id),
        label: statement.label.replace(/^"|"$/g, ''),
        kind: 'topEvent',
      };

      for (const prop of statement.properties) {
        if (Langium.isFaultTreeUnderProperty(prop)) {
          event.under = unescapeString(prop.under);
        } else if (Langium.isFaultTreeProbabilityProperty(prop)) {
          event.probability = Number(prop.probability);
        }
      }

      faultTree.events.push(event);
      continue;
    }

    if (Langium.isFaultTreeEventStatement(statement)) {
      const event: FaultTreeEvent = {
        id: unescapeString(statement.id),
        label: statement.label.replace(/^"|"$/g, ''),
        kind: statement.kind as FaultTreeEvent['kind'],
      };

      for (const prop of statement.properties) {
        if (Langium.isFaultTreeUnderProperty(prop)) {
          event.under = unescapeString(prop.under);
        } else if (Langium.isFaultTreeProbabilityProperty(prop)) {
          event.probability = Number(prop.probability);
        }
      }

      faultTree.events.push(event);
      continue;
    }

    if (Langium.isFaultTreeGateStatement(statement)) {
      const gate: FaultTreeGate = {
        id: unescapeString(statement.id),
        gateType: statement.gateType as FaultTreeGate['gateType'],
        under: unescapeString(statement.under),
      };
      faultTree.gates.push(gate);
    }
  }

  return faultTree;
}
