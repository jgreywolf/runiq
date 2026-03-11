import * as Langium from '../generated/ast.js';
import { nodeRefToString } from './node-ref-utils.js';
import { unescapeString } from './string-utils.js';

/**
 * Location information for a node in the source text
 */
export interface NodeLocation {
  nodeId: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

/**
 * Extract node locations from the parsed document for error reporting
 * Extracts locations from edge declarations since that's where nodes appear in the DSL
 */
export function extractNodeLocations(
  document: Langium.Document
): Map<string, NodeLocation> {
  const locations = new Map<string, NodeLocation>();

  const setLocation = (key: string, range: { start: { line: number; character: number }; end: { line: number; character: number } }) => {
    if (locations.has(key)) return;
    locations.set(key, {
      nodeId: key,
      startLine: range.start.line + 1,
      startColumn: range.start.character + 1,
      endLine: range.end.line + 1,
      endColumn: range.end.character + 1,
    });
  };

  // Process each profile
  for (const profile of document.profiles) {
    // Only extract locations for diagram profiles for now
    if (Langium.isDiagramProfile(profile)) {
      for (const statement of profile.statements) {
        if (Langium.isShapeDeclaration(statement)) {
          const id = unescapeString(statement.id);
          if (statement.$cstNode?.range) {
            setLocation(id, statement.$cstNode.range);
          }
          continue;
        }

        // Extract edge declarations - nodes are referenced in edges
        if (Langium.isEdgeDeclaration(statement)) {
          const fromId = nodeRefToString(statement.from);
          const toId = nodeRefToString(statement.to);
          if (statement.$cstNode?.range) {
            setLocation(`${fromId}-${toId}`, statement.$cstNode.range);
          }

          // Extract source node location from the 'from' NodeRef
          if (statement.from?.$cstNode?.range) {
            const fromRange = statement.from.$cstNode.range;
            setLocation(fromId, fromRange);
          }

          // Extract target node location from the 'to' NodeRef (or chain)
          if (statement.to?.$cstNode?.range) {
            const toRange = statement.to.$cstNode.range;
            setLocation(toId, toRange);
          }

          // Handle edge chains (A -> B -> C)
          if (statement.chain && statement.chain.length > 0) {
            let chainFromId = toId;
            for (const chainItem of statement.chain) {
              if (chainItem.to?.$cstNode?.range) {
                const chainNodeId = nodeRefToString(chainItem.to);
                const chainRange = chainItem.to.$cstNode.range;
                setLocation(chainNodeId, chainRange);
                if (chainItem.$cstNode?.range) {
                  setLocation(`${chainFromId}-${chainNodeId}`, chainItem.$cstNode.range);
                }
                chainFromId = chainNodeId;
              }
            }
          }
        }
      }
    }
  }

  return locations;
}
