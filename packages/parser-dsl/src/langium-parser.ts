import type { DiagramAst, RailroadExpression, RailroadProfile, RuniqDocument } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import { EmptyFileSystem } from 'langium';
import {
  convertDiagramProfile,
  convertDigitalProfile,
  convertElectricalProfile,
  convertHydraulicProfile,
  convertPIDProfile,
  convertPneumaticProfile,
  convertRailroadProfile,
  convertSequenceProfile,
  convertTimelineProfile,
  convertWardleyProfile,
} from './converters/index.js';
import * as Langium from './generated/ast.js';
import { expandGlyphSet, isGlyphSetProfile } from './glyphset-expander.js';
import { createRuniqServices } from './langium-module.js';
import { extractNodeLocations } from './utils/index.js';

/**
 * Parse result type
 */
export interface ParseResult {
  success: boolean;
  document?: RuniqDocument;
  diagram?: DiagramAst; // Backwards compatibility - points to first diagram profile
  warnings: string[];
  errors: string[];
  nodeLocations?: Map<
    string,
    import('./utils/location-tracker.js').NodeLocation
  >;
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

    return { success: false, errors, warnings: [] };
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
    warnings: collectParseWarnings(runiqDocument),
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
    } else if (Langium.isElectricalProfile(profile)) {
      runiqDoc.profiles.push(convertElectricalProfile(profile));
    } else if (Langium.isDigitalProfile(profile)) {
      runiqDoc.profiles.push(convertDigitalProfile(profile));
    } else if (Langium.isWardleyProfile(profile)) {
      runiqDoc.profiles.push(convertWardleyProfile(profile));
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