import type {
  RailroadExpression,
  RailroadProfile as CoreRailroadProfile,
  RailroadOptions as CoreRailroadOptions,
} from '@runiq/core';
import * as Langium from '../generated/ast.js';

function stripQuotes(value: string): string {
  return value.replace(/^"|"$/g, '');
}

function convertPrimary(primary: Langium.RailroadPrimary): RailroadExpression {
  if (primary.token) {
    return { type: 'token', value: stripQuotes(primary.token) };
  }

  if (primary.ref) {
    return { type: 'reference', name: primary.ref };
  }

  if (primary.expression) {
    return convertChoice(primary.expression);
  }

  return { type: 'token', value: '' };
}

function convertUnary(unary: Langium.RailroadUnary): RailroadExpression {
  const base = convertPrimary(unary.primary);

  switch (unary.op) {
    case '?':
      return { type: 'optional', expression: base };
    case '*':
      return { type: 'zeroOrMore', expression: base };
    case '+':
      return { type: 'oneOrMore', expression: base };
    default:
      return base;
  }
}

function convertSequence(sequence: Langium.RailroadSequence): RailroadExpression {
  const items = sequence.items.map(convertUnary);
  if (items.length === 1) {
    return items[0];
  }
  return { type: 'sequence', items };
}

function convertChoice(choice: Langium.RailroadChoice): RailroadExpression {
  const options = [choice.first, ...choice.rest].map(convertSequence);
  if (options.length === 1) {
    return options[0];
  }
  return { type: 'choice', options };
}

/**
 * Convert RailroadProfile from Langium AST to core format
 */
export function convertRailroadProfile(
  profile: Langium.RailroadProfile
): CoreRailroadProfile {
  let theme: string | undefined;
  const options: CoreRailroadOptions = {};
  const diagrams = profile.statements.filter(
    (statement): statement is Langium.RailroadDiagramStatement =>
      Langium.isRailroadDiagramStatement(statement)
  );

  for (const statement of profile.statements) {
    if (Langium.isThemeDeclaration(statement)) {
      theme = statement.value;
    }
    if (Langium.isRailroadOptionsStatement(statement)) {
      for (const prop of statement.properties) {
        if (Langium.isRailroadMarkerColorProperty(prop)) {
          options.markerColor = stripQuotes(prop.value);
        } else if (Langium.isRailroadOperatorColorProperty(prop)) {
          options.operatorColor = stripQuotes(prop.value);
        } else if (Langium.isRailroadStartMarkerProperty(prop)) {
          options.startMarker = prop.value;
        } else if (Langium.isRailroadEndMarkerProperty(prop)) {
          options.endMarker = prop.value;
        } else if (Langium.isRailroadCompactProperty(prop)) {
          options.compact = prop.value === 'true';
        }
      }
    }
  }

  return {
    type: 'railroad',
    name: profile.name.replace(/^"|"$/g, ''),
    theme,
    options: Object.keys(options).length > 0 ? options : undefined,
    diagrams: diagrams.map((statement) => ({
      name: statement.name,
      expression: convertChoice(statement.expression),
    })),
  };
}
