import type {
  DigitalProfile,
  InstanceAst,
  ModuleAst,
  NetAst,
  PortAst,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

/**
 * Convert DigitalProfile from Langium AST to core format
 */
export function convertDigitalProfile(
  profile: Langium.DigitalProfile
): DigitalProfile {
  const digitalProfile: DigitalProfile = {
    type: ProfileType.DIGITAL,
    name: profile.name.replace(/^"|"$/g, ''),
    instances: [],
    nets: [],
  };

  // Process digital statements
  for (const statement of profile.statements) {
    if (Langium.isModuleStatement(statement)) {
      // module Counter ports:(clk,reset,count[7:0])
      if (!digitalProfile.modules) digitalProfile.modules = [];
      const module: ModuleAst = {
        name: unescapeString(statement.name),
        ports: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isModulePortsProperty(prop)) {
          for (const portDecl of prop.ports) {
            const port: PortAst = {
              name: unescapeString(portDecl.name),
              dir: 'input', // Default, would need grammar enhancement for dir
            };
            if (portDecl.width) {
              // Parse bus width [msb:lsb]
              port.width =
                parseInt(portDecl.width.msb) - parseInt(portDecl.width.lsb) + 1;
            }
            module.ports.push(port);
          }
        } else if (Langium.isModuleParamsProperty(prop)) {
          if (!module.params) module.params = {};
          for (const paramDecl of prop.params) {
            let value = paramDecl.value;
            if (
              typeof value === 'string' &&
              value.startsWith('"') &&
              value.endsWith('"')
            ) {
              value = value.slice(1, -1);
            }
            module.params[unescapeString(paramDecl.name)] = value;
          }
        }
      }

      digitalProfile.modules.push(module);
    } else if (Langium.isInstStatement(statement)) {
      // inst U1 of:Counter map:(clk:clk, reset:reset)
      const instance: InstanceAst = {
        ref: unescapeString(statement.ref),
        of: '',
        portMap: {},
      };

      for (const prop of statement.properties) {
        if (Langium.isInstOfProperty(prop)) {
          instance.of = unescapeString(prop.module);
        } else if (Langium.isInstMapProperty(prop)) {
          for (const conn of prop.connections) {
            instance.portMap[unescapeString(conn.port)] = unescapeString(conn.net);
          }
        } else if (Langium.isInstParamsProperty(prop)) {
          if (!instance.paramMap) instance.paramMap = {};
          for (const param of prop.params) {
            let value = param.value;
            if (
              typeof value === 'string' &&
              value.startsWith('"') &&
              value.endsWith('"')
            ) {
              value = value.slice(1, -1);
            }
            instance.paramMap[unescapeString(param.param)] = value;
          }
        }
      }

      digitalProfile.instances.push(instance);
    } else if (Langium.isDigitalNetStatement(statement)) {
      // net clk, reset, count[7:0]
      for (const netDecl of statement.names) {
        const net: NetAst = {
          name: unescapeString(netDecl.name),
        };
        if (netDecl.width) {
          net.width =
            parseInt(netDecl.width.msb) - parseInt(netDecl.width.lsb) + 1;
        }
        digitalProfile.nets.push(net);
      }
    }
  }

  return digitalProfile;
}
