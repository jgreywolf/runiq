import type {
  DigitalProfile,
  ModuleAst,
  PortAst,
  InstanceAst,
  NetAst,
} from '@runiq/core';

/**
 * Result of Verilog generation
 */
export interface VerilogResult {
  verilog: string;
  warnings: string[];
}

/**
 * Convert a digital profile to Verilog HDL
 */
export function toVerilog(profile: DigitalProfile): VerilogResult {
  const warnings: string[] = [];
  const lines: string[] = [];

  // Get the main module (first module or create from profile name)
  const mainModule = profile.modules?.[0] || {
    name: profile.name,
    ports: [],
  };

  // Generate module header with parameters
  lines.push(...generateModuleHeader(mainModule));

  // Generate port declarations
  if (mainModule.ports.length > 0) {
    lines.push('(');
    const portDecls = mainModule.ports.map((port, idx) => {
      const isLast = idx === mainModule.ports.length - 1;
      return generatePortDeclaration(port, isLast);
    });
    lines.push(...portDecls);
    lines.push(');');
  } else {
    lines.push('();');
  }
  lines.push('');

  // Generate wire declarations for internal nets
  const portNames = new Set(mainModule.ports.map((p) => p.name));
  const internalNets = profile.nets.filter((net) => !portNames.has(net.name));

  if (internalNets.length > 0) {
    lines.push('  // Internal wires');
    for (const net of internalNets) {
      lines.push(generateWireDeclaration(net));
    }
    lines.push('');
  }

  // Validate net usage in instances
  const declaredNets = new Set(profile.nets.map((n) => n.name));
  for (const instance of profile.instances) {
    for (const [port, net] of Object.entries(instance.portMap)) {
      if (!declaredNets.has(net)) {
        warnings.push(
          `Net '${net}' used in instance '${instance.ref}' port '${port}' is not declared in nets list`
        );
      }
    }
  }

  // Generate module instances
  if (profile.instances.length > 0) {
    lines.push('  // Module instances');
    for (const instance of profile.instances) {
      lines.push(...generateInstance(instance));
    }
    lines.push('');
  }

  lines.push('endmodule');

  return {
    verilog: lines.join('\n'),
    warnings,
  };
}

/**
 * Generate module header with parameters
 */
function generateModuleHeader(module: ModuleAst): string[] {
  const lines: string[] = [];

  lines.push(`module ${module.name}`);

  // Add parameters if present
  if (module.params && Object.keys(module.params).length > 0) {
    lines.push('#(');
    const paramEntries = Object.entries(module.params);
    paramEntries.forEach(([name, value], idx) => {
      const isLast = idx === paramEntries.length - 1;
      const comma = isLast ? '' : ',';
      lines.push(`  parameter ${name} = ${value}${comma}`);
    });
    lines.push(')');
  }

  return lines;
}

/**
 * Generate port declaration
 */
function generatePortDeclaration(port: PortAst, isLast: boolean): string {
  const comma = isLast ? '' : ',';
  let decl = `  ${port.dir}`;

  if (port.width && port.width > 1) {
    decl += ` [${port.width - 1}:0]`;
  }

  decl += ` ${port.name}${comma}`;
  return decl;
}

/**
 * Generate wire declaration for internal net
 */
function generateWireDeclaration(net: NetAst): string {
  let decl = '  wire';

  if (net.width && net.width > 1) {
    decl += ` [${net.width - 1}:0]`;
  }

  decl += ` ${net.name};`;
  return decl;
}

/**
 * Generate module instance
 */
function generateInstance(instance: InstanceAst): string[] {
  const lines: string[] = [];

  // Module name and parameters
  let instLine = `  ${instance.of}`;

  if (instance.paramMap && Object.keys(instance.paramMap).length > 0) {
    instLine += ' #(';
    lines.push(instLine);

    const paramEntries = Object.entries(instance.paramMap);
    paramEntries.forEach(([name, value], idx) => {
      const isLast = idx === paramEntries.length - 1;
      const comma = isLast ? '' : ',';
      lines.push(`    .${name}(${value})${comma}`);
    });

    lines.push(`  ) ${instance.ref} (`);
  } else {
    instLine += ` ${instance.ref} (`;
    lines.push(instLine);
  }

  // Port mappings
  const portEntries = Object.entries(instance.portMap);
  portEntries.forEach(([port, net], idx) => {
    const isLast = idx === portEntries.length - 1;
    const comma = isLast ? '' : ',';
    lines.push(`    .${port}(${net})${comma}`);
  });

  lines.push('  );');

  return lines;
}
