import type * as Langium from '../generated/ast.js';
import { unescapeString } from './string-utils.js';

/**
 * Convert NodeRef to string representation
 * Supports both simple refs (node1) and member refs (Class.field)
 */
export function nodeRefToString(ref: Langium.NodeRef): string {
  const node = unescapeString(ref.node);
  const member = ref.member ? unescapeString(ref.member) : undefined;
  if (ref.member) {
    return `${node}.${member}`;
  }
  return node;
}

/**
 * Parse anchored arrow terminal to extract anchor sides and optional label
 * Matches patterns like: -east->, -north->south, -east-"label"->west
 */
export function parseAnchoredArrow(anchoredArrow: string): {
  anchorFrom?: 'north' | 'south' | 'east' | 'west';
  anchorTo?: 'north' | 'south' | 'east' | 'west';
  label?: string;
} {
  // Pattern: -(north|south|east|west)(-"[^"]*")?->(north|south|east|west)?
  const match = anchoredArrow.match(
    /^-(north|south|east|west)(?:-"([^"]*)")?->(?:(north|south|east|west))?$/
  );

  if (!match) {
    return {};
  }

  return {
    anchorFrom: match[1] as 'north' | 'south' | 'east' | 'west',
    anchorTo: match[3] as 'north' | 'south' | 'east' | 'west' | undefined,
    label: match[2] || undefined,
  };
}
