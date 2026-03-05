import type { HvacProfile, PartAst } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

const DEFAULT_PORTS = ['in', 'out'] as const;

const HVAC_PORTS: Record<string, string[]> = {
  'diffuser-supply': ['in'],
  'diffuser-return': ['in'],
  'thermostat': ['sense'],
  'temperature-sensor': ['sense'],
  'pressure-sensor': ['sense'],
};

function toSymbolId(type: string): string {
  return type.toUpperCase().replace(/-/g, '_');
}

function getPorts(type: string): string[] {
  return HVAC_PORTS[type] ?? [...DEFAULT_PORTS];
}

type HvacPartRecord = {
  part: PartAst;
  ports: string[];
};

/**
 * Convert HVAC profile into schematic-style parts and nets.
 */
export function convertHvacProfile(
  profile: Langium.HvacProfile
): HvacProfile {
  const hvacProfile: HvacProfile = {
    type: ProfileType.HVAC,
    name: profile.name.replace(/^"|"$/g, ''),
    nets: [],
    parts: [],
  };

  const parts = new Map<string, HvacPartRecord>();
  const ductIds = new Set<string>();
  const connectStatements: Langium.HvacConnectStatement[] = [];
  let netCounter = 1;

  for (const statement of profile.statements) {
    if (Langium.isHvacEquipmentStatement(statement)) {
      const id = unescapeString(statement.id);
      let equipmentType = 'air-handling-unit';
      const params: Record<string, string | number> = {};

      for (const prop of statement.properties) {
        if (Langium.isHvacEquipmentTypeProperty(prop)) {
          equipmentType = prop.type;
        } else if (Langium.isHvacEquipmentMetaProperty(prop)) {
          const key = unescapeString(prop.key);
          let value: string | number = prop.value;
          if (typeof value === 'string') {
            value = unescapeString(value);
          }
          params[key] = value;
        }
      }

      const ports = getPorts(equipmentType);
      const part: PartAst = {
        ref: id,
        type: toSymbolId(equipmentType),
        pins: new Array(ports.length).fill(''),
        params: Object.keys(params).length > 0 ? params : undefined,
      };

      parts.set(id, { part, ports });
    } else if (Langium.isHvacDuctStatement(statement)) {
      const id = unescapeString(statement.id);
      let ductType = 'supply';
      const params: Record<string, string | number> = {};

      for (const prop of statement.properties) {
        if (Langium.isHvacDuctTypeProperty(prop)) {
          ductType = prop.type;
        } else if (Langium.isHvacDuctSizeProperty(prop)) {
          params.size = unescapeString(prop.value);
        } else if (Langium.isHvacEquipmentMetaProperty(prop)) {
          const key = unescapeString(prop.key);
          let value: string | number = prop.value;
          if (typeof value === 'string') {
            value = unescapeString(value);
          }
          params[key] = value;
        }
      }

      ductIds.add(id);
      const ports = [...DEFAULT_PORTS];
      const part: PartAst = {
        ref: id,
        type: `DUCT_${ductType.toUpperCase()}`,
        pins: new Array(ports.length).fill(''),
        params: Object.keys(params).length > 0 ? params : undefined,
      };
      parts.set(id, { part, ports });
    } else if (Langium.isHvacConnectStatement(statement)) {
      connectStatements.push(statement);
    }
  }

  const netSet = new Set<string>();

  for (const statement of connectStatements) {
    const chain = statement.path;
    const ductInChain = chain.find((item) =>
      ductIds.has(unescapeString(item.ref))
    );
    const netName = ductInChain
      ? unescapeString(ductInChain.ref)
      : `NET_${netCounter++}`;

    netSet.add(netName);

    for (const endpoint of chain) {
      const refId = unescapeString(endpoint.ref);
      const record = parts.get(refId);
      if (!record) continue;

      const portName = endpoint.port
        ? unescapeString(endpoint.port)
        : undefined;
      let portIndex = 0;
      if (portName) {
        portIndex = record.ports.indexOf(portName);
        if (portIndex === -1) {
          portIndex = 0;
        }
      } else {
        const emptyIndex = record.part.pins.findIndex((pin) => pin === '');
        portIndex = emptyIndex === -1 ? 0 : emptyIndex;
      }

      record.part.pins[portIndex] = netName;
    }
  }

  hvacProfile.nets = Array.from(netSet).map((name) => ({ name }));
  hvacProfile.parts = Array.from(parts.values()).map((record) => record.part);

  return hvacProfile;
}
