import type { DiagramAst, RailroadExpression, RailroadProfile, RuniqDocument } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import { EmptyFileSystem, type AstNode } from 'langium';
import {
  convertDiagramProfile,
  convertControlProfile,
  convertDigitalProfile,
  convertElectricalProfile,
  convertGitGraphProfile,
  convertHvacProfile,
  convertHydraulicProfile,
  convertKanbanProfile,
  convertPIDProfile,
  convertPneumaticProfile,
  convertRailroadProfile,
  convertSequenceProfile,
  convertTimelineProfile,
  convertTreemapProfile,
  convertWardleyProfile,
} from './converters/index.js';
import * as Langium from './generated/ast.js';
import { expandGlyphSet, isGlyphSetProfile } from './glyphset-expander.js';
import { createRuniqServices } from './langium-module.js';
import { extractNodeLocations, unescapeString } from './utils/index.js';

/**
 * Parse result type
 */
export interface ParseResult {
  success: boolean;
  document?: RuniqDocument;
  diagram?: DiagramAst; // Backwards compatibility - points to first diagram profile
  warnings: string[];
  warningDetails?: WarningDetail[];
  errors: string[];
  nodeLocations?: Map<
    string,
    import('./utils/location-tracker.js').NodeLocation
  >;
}

export interface WarningDetail {
  message: string;
  range: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

/**
 * Create parser services (singleton)
 */
const services = createRuniqServices(EmptyFileSystem);
const parser = services.Runiq.parser.LangiumParser;

/**
 * Parse Runiq DSL text into RuniqDocument or DiagramAst (legacy)
 * @param text - The Runiq DSL source code
 * @returns ParseResult with document/diagram or errors
 */
export function parse(text: string): ParseResult {
  // Parse using Langium
  const parseResult = parser.parse(text);

  // Check for parse errors
  if (
    parseResult.lexerErrors.length > 0 ||
    parseResult.parserErrors.length > 0
  ) {
    const errors: string[] = [];

    parseResult.lexerErrors.forEach((err) => {
      const location =
        err.line !== undefined && err.column !== undefined
          ? ` at line ${err.line}, column ${err.column}`
          : '';
      errors.push(`Lexer error${location}: ${err.message}`);
    });

    parseResult.parserErrors.forEach((err) => {
      const token = err.token;
      const location =
        token &&
        token.startLine !== undefined &&
        token.startColumn !== undefined
          ? ` at line ${token.startLine}, column ${token.startColumn}`
          : '';
      errors.push(`Parser error${location}: ${err.message}`);
    });

    return { success: false, errors, warnings: [], warningDetails: [] };
  }

  // Convert Langium AST to Runiq Document
  const document = parseResult.value as Langium.Document;
  const runiqDocument = convertToRuniqDocument(document);

  // Extract node locations from CST
  const nodeLocations = extractNodeLocations(document);

  // Backwards compatibility: expose first diagram profile as 'diagram'
  const firstDiagramProfile = runiqDocument.profiles.find(
    (p) => p.type === ProfileType.DIAGRAM
  );

  let diagram: DiagramAst | undefined;
  if (firstDiagramProfile && firstDiagramProfile.type === ProfileType.DIAGRAM) {
    // Convert DiagramProfile to DiagramAst for backwards compatibility
    const { type, name, ...rest } = firstDiagramProfile;
    diagram = {
      ...rest,
      astVersion: runiqDocument.astVersion,
      title: name, // Map 'name' to 'title'
    };
  }

  return {
    success: true,
    document: runiqDocument,
    diagram, // Backwards compatibility
    warnings: mergeWarnings(
      collectParseWarnings(runiqDocument),
      collectParseWarningsFromLangium(document)
    ),
    warningDetails: collectParseWarningDetails(document),
    errors: [],
    nodeLocations,
  };
}

/**
 * Convert Langium Document to RuniqDocument with profiles
 */
function convertToRuniqDocument(document: Langium.Document): RuniqDocument {
  const runiqDoc: RuniqDocument = {
    astVersion: '1.0',
    profiles: [],
  };

  // Convert each profile
  for (const profile of document.profiles) {
    if (Langium.isDiagramProfile(profile)) {
      runiqDoc.profiles.push(convertDiagramProfile(profile));
    } else if (Langium.isControlProfile(profile)) {
      runiqDoc.profiles.push(convertControlProfile(profile));
    } else if (Langium.isElectricalProfile(profile)) {
      runiqDoc.profiles.push(convertElectricalProfile(profile));
    } else if (Langium.isDigitalProfile(profile)) {
      runiqDoc.profiles.push(convertDigitalProfile(profile));
    } else if (Langium.isWardleyProfile(profile)) {
      runiqDoc.profiles.push(convertWardleyProfile(profile));
    } else if (Langium.isHvacProfile(profile)) {
      runiqDoc.profiles.push(convertHvacProfile(profile));
    } else if (Langium.isRailroadProfile(profile)) {
      runiqDoc.profiles.push(convertRailroadProfile(profile));
    } else if (Langium.isSequenceProfile(profile)) {
      runiqDoc.profiles.push(convertSequenceProfile(profile));
    } else if (Langium.isPneumaticProfile(profile)) {
      runiqDoc.profiles.push(convertPneumaticProfile(profile));
    } else if (Langium.isHydraulicProfile(profile)) {
      runiqDoc.profiles.push(convertHydraulicProfile(profile));
    } else if (Langium.isPIDProfile(profile)) {
      runiqDoc.profiles.push(convertPIDProfile(profile));
    } else if (Langium.isTimelineProfile(profile)) {
      runiqDoc.profiles.push(convertTimelineProfile(profile));
    } else if (Langium.isKanbanProfile(profile)) {
      runiqDoc.profiles.push(convertKanbanProfile(profile));
    } else if (Langium.isGitGraphProfile(profile)) {
      runiqDoc.profiles.push(convertGitGraphProfile(profile));
    } else if (Langium.isTreemapProfile(profile)) {
      runiqDoc.profiles.push(convertTreemapProfile(profile));
    } else if (isGlyphSetProfile(profile)) {
      // Expand glyphset to diagram profile
      const expandedDiagram = expandGlyphSet(profile);
      runiqDoc.profiles.push({
        type: ProfileType.DIAGRAM,
        name: profile.name.replace(/^"|"$/g, ''),
        ...expandedDiagram,
      });
    }
  }

  return runiqDoc;
}

function collectParseWarnings(document: RuniqDocument): string[] {
  const warnings: string[] = [];

  for (const profile of document.profiles) {
    if (profile.type === ProfileType.RAILROAD) {
      warnings.push(...collectRailroadWarnings(profile));
    }
  }

  return warnings;
}

function collectParseWarningsFromLangium(
  document: Langium.Document
): string[] {
  const warnings: string[] = [];

  for (const profile of document.profiles) {
    if (Langium.isHvacProfile(profile)) {
      warnings.push(...collectHvacWarnings(profile));
    } else if (Langium.isPIDProfile(profile)) {
      warnings.push(...collectPidWarnings(profile));
    }
  }

  return warnings;
}

function mergeWarnings(...groups: string[][]): string[] {
  const merged = new Set<string>();
  groups.flat().forEach((warning) => merged.add(warning));
  return Array.from(merged);
}

function collectRailroadWarnings(profile: RailroadProfile): string[] {
  const diagrams = profile.diagrams || [];
  if (diagrams.length === 0) return [];

  const defined = new Set(diagrams.map((diagram) => diagram.name));
  const missing = new Set<string>();

  const walk = (expr: RailroadExpression) => {
    switch (expr.type) {
      case 'reference':
        if (!defined.has(expr.name)) {
          missing.add(expr.name);
        }
        return;
      case 'sequence':
        expr.items.forEach(walk);
        return;
      case 'choice':
        expr.options.forEach(walk);
        return;
      case 'optional':
      case 'oneOrMore':
      case 'zeroOrMore':
        walk(expr.expression);
        return;
      default:
        return;
    }
  };

  diagrams.forEach((diagram) => walk(diagram.expression));

  if (missing.size === 0) {
    return [];
  }

  return [
    `Missing railroad diagram references: ${Array.from(missing).sort().join(', ')}`,
  ];
}

function collectParseWarningDetails(
  document: Langium.Document
): WarningDetail[] {
  const warnings: WarningDetail[] = [];

  for (const profile of document.profiles) {
    if (Langium.isRailroadProfile(profile)) {
      warnings.push(...collectRailroadWarningDetails(profile));
    } else if (Langium.isHvacProfile(profile)) {
      warnings.push(...collectHvacWarningDetails(profile));
    } else if (Langium.isPIDProfile(profile)) {
      warnings.push(...collectPidWarningDetails(profile));
    }
  }

  return warnings;
}

function collectRailroadWarningDetails(
  profile: Langium.RailroadProfile
): WarningDetail[] {
  const diagrams = profile.statements.filter((statement) =>
    Langium.isRailroadDiagramStatement(statement)
  );
  if (diagrams.length === 0) return [];

  const defined = new Set(diagrams.map((diagram) => diagram.name));
  const warningDetails: WarningDetail[] = [];

  const addWarning = (message: string, node?: AstNode) => {
    const range = node?.$cstNode?.range;
    if (!range) return;

    warningDetails.push({
      message,
      range: {
        startLine: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLine: range.end.line + 1,
        endColumn: range.end.character + 1,
      },
    });
  };

  function walkExpression(expression: Langium.RailroadExpression) {
    if (Langium.isRailroadChoice(expression)) {
      walkSequence(expression.first);
      expression.rest.forEach(walkSequence);
    }
  }

  function walkPrimary(primary: Langium.RailroadPrimary) {
    if (primary.ref && !defined.has(primary.ref)) {
      addWarning(`Missing railroad diagram reference: ${primary.ref}`, primary);
      return;
    }

    if (primary.expression) {
      walkExpression(primary.expression);
    }
  }

  function walkUnary(unary: Langium.RailroadUnary) {
    walkPrimary(unary.primary);
  }

  function walkSequence(sequence: Langium.RailroadSequence) {
    sequence.items.forEach(walkUnary);
  }

  diagrams.forEach((diagram) => {
    walkExpression(diagram.expression);
  });

  return warningDetails;
}

const DEFAULT_HVAC_PORTS = ['in', 'out'] as const;

const HVAC_PORTS: Record<string, string[]> = {
  'diffuser-supply': ['in'],
  'diffuser-return': ['in'],
  thermostat: ['sense'],
  'temperature-sensor': ['sense'],
  'pressure-sensor': ['sense'],
};

function getHvacPorts(type: string): string[] {
  return HVAC_PORTS[type] ?? [...DEFAULT_HVAC_PORTS];
}

function collectHvacWarnings(profile: Langium.HvacProfile): string[] {
  const equipmentTypes = new Map<string, string>();
  const ducts = new Set<string>();

  for (const statement of profile.statements) {
    if (Langium.isHvacEquipmentStatement(statement)) {
      const id = unescapeString(statement.id);
      let equipmentType = 'air-handling-unit';
      for (const prop of statement.properties) {
        if (Langium.isHvacEquipmentTypeProperty(prop)) {
          equipmentType = prop.type;
        }
      }
      equipmentTypes.set(id, equipmentType);
    } else if (Langium.isHvacDuctStatement(statement)) {
      ducts.add(unescapeString(statement.id));
    }
  }

  const missingRefs = new Set<string>();
  const invalidPorts = new Set<string>();

  for (const statement of profile.statements) {
    if (!Langium.isHvacConnectStatement(statement)) continue;

    for (const endpoint of statement.path) {
      const ref = unescapeString(endpoint.ref);
      const isEquipment = equipmentTypes.has(ref);
      const isDuct = ducts.has(ref);

      if (!isEquipment && !isDuct) {
        missingRefs.add(ref);
        continue;
      }

      if (endpoint.port) {
        const port = unescapeString(endpoint.port);
        const ports = isEquipment
          ? getHvacPorts(equipmentTypes.get(ref) ?? 'air-handling-unit')
          : [...DEFAULT_HVAC_PORTS];
        if (!ports.includes(port)) {
          invalidPorts.add(`${ref}.${port}`);
        }
      }
    }
  }

  const warnings: string[] = [];
  if (missingRefs.size > 0) {
    warnings.push(
      `Missing HVAC references: ${Array.from(missingRefs).sort().join(', ')}`
    );
  }
  if (invalidPorts.size > 0) {
    warnings.push(
      `Invalid HVAC ports: ${Array.from(invalidPorts).sort().join(', ')}`
    );
  }

  return warnings;
}

function collectHvacWarningDetails(
  profile: Langium.HvacProfile
): WarningDetail[] {
  const warningDetails: WarningDetail[] = [];
  const equipmentTypes = new Map<string, string>();
  const ducts = new Set<string>();

  for (const statement of profile.statements) {
    if (Langium.isHvacEquipmentStatement(statement)) {
      const id = unescapeString(statement.id);
      let equipmentType = 'air-handling-unit';
      for (const prop of statement.properties) {
        if (Langium.isHvacEquipmentTypeProperty(prop)) {
          equipmentType = prop.type;
        }
      }
      equipmentTypes.set(id, equipmentType);
    } else if (Langium.isHvacDuctStatement(statement)) {
      ducts.add(unescapeString(statement.id));
    }
  }

  const addWarning = (message: string, node?: AstNode) => {
    const range = node?.$cstNode?.range;
    if (!range) return;

    warningDetails.push({
      message,
      range: {
        startLine: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLine: range.end.line + 1,
        endColumn: range.end.character + 1,
      },
    });
  };

  for (const statement of profile.statements) {
    if (!Langium.isHvacConnectStatement(statement)) continue;

    for (const endpoint of statement.path) {
      const ref = unescapeString(endpoint.ref);
      const isEquipment = equipmentTypes.has(ref);
      const isDuct = ducts.has(ref);

      if (!isEquipment && !isDuct) {
        addWarning(`Missing HVAC reference: ${ref}`, endpoint);
        continue;
      }

      if (endpoint.port) {
        const port = unescapeString(endpoint.port);
        const ports = isEquipment
          ? getHvacPorts(equipmentTypes.get(ref) ?? 'air-handling-unit')
          : [...DEFAULT_HVAC_PORTS];
        if (!ports.includes(port)) {
          addWarning(`Invalid HVAC port: ${ref}.${port}`, endpoint);
        }
      }
    }
  }

  return warningDetails;
}

function getPidLoopNumber(tag: string): number | undefined {
  const match = tag.match(/-(\d{1,4})[A-Z]?$/);
  if (!match) {
    return undefined;
  }
  return Number(match[1]);
}

function collectPidWarnings(profile: Langium.PIDProfile): string[] {
  const warnings: string[] = [];

  for (const statement of profile.statements) {
    if (Langium.isPIDInstrumentStatement(statement)) {
      const loopProp = statement.properties.find((prop) =>
        Langium.isPIDLoopRefProperty(prop)
      );
      if (loopProp) {
        const tagLoop = getPidLoopNumber(statement.tag);
        const loopNum = Number(loopProp.loopNum);
        if (
          tagLoop !== undefined &&
          !Number.isNaN(loopNum) &&
          tagLoop !== loopNum
        ) {
          warnings.push(
            `PID loop mismatch: ${statement.tag} uses loop ${loopProp.loopNum} but tag implies ${tagLoop}`
          );
        }
      }
    } else if (Langium.isPIDLoopStatement(statement)) {
      const controllerProp = statement.properties.find((prop) =>
        Langium.isPIDControllerProperty(prop)
      );
      if (controllerProp) {
        const controllerLoop = getPidLoopNumber(controllerProp.tag);
        const loopNum = Number(statement.loopNum);
        if (
          controllerLoop !== undefined &&
          !Number.isNaN(loopNum) &&
          controllerLoop !== loopNum
        ) {
          warnings.push(
            `PID loop mismatch: loop ${statement.loopNum} references ${controllerProp.tag} (${controllerLoop})`
          );
        }
      }
    }
  }

  return warnings;
}

function collectPidWarningDetails(
  profile: Langium.PIDProfile
): WarningDetail[] {
  const warningDetails: WarningDetail[] = [];

  const addWarning = (message: string, node?: AstNode) => {
    const range = node?.$cstNode?.range;
    if (!range) return;

    warningDetails.push({
      message,
      range: {
        startLine: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLine: range.end.line + 1,
        endColumn: range.end.character + 1,
      },
    });
  };

  for (const statement of profile.statements) {
    if (Langium.isPIDInstrumentStatement(statement)) {
      const loopProp = statement.properties.find((prop) =>
        Langium.isPIDLoopRefProperty(prop)
      );
      if (!loopProp) continue;

      const tagLoop = getPidLoopNumber(statement.tag);
      const loopNum = Number(loopProp.loopNum);
      if (
        tagLoop !== undefined &&
        !Number.isNaN(loopNum) &&
        tagLoop !== loopNum
      ) {
        addWarning(
          `PID loop mismatch: ${statement.tag} uses loop ${loopProp.loopNum} but tag implies ${tagLoop}`,
          loopProp
        );
      }
    } else if (Langium.isPIDLoopStatement(statement)) {
      const controllerProp = statement.properties.find((prop) =>
        Langium.isPIDControllerProperty(prop)
      );
      if (!controllerProp) continue;

      const controllerLoop = getPidLoopNumber(controllerProp.tag);
      const loopNum = Number(statement.loopNum);
      if (
        controllerLoop !== undefined &&
        !Number.isNaN(loopNum) &&
        controllerLoop !== loopNum
      ) {
        addWarning(
          `PID loop mismatch: loop ${statement.loopNum} references ${controllerProp.tag} (${controllerLoop})`,
          controllerProp
        );
      }
    }
  }

  return warningDetails;
}
