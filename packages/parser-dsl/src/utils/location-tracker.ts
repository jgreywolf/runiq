import * as Langium from '../generated/ast.js';
import { nodeRefToString } from './node-ref-utils.js';

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

  // Process each profile
  for (const profile of document.profiles) {
    // Only extract locations for diagram profiles for now
    if (Langium.isDiagramProfile(profile)) {
      for (const statement of profile.statements) {
        // Extract edge declarations - nodes are referenced in edges
        if (Langium.isEdgeDeclaration(statement)) {
          // Extract source node location from the 'from' NodeRef
          if (statement.from?.$cstNode?.range) {
            const sourceNodeId = nodeRefToString(statement.from);
            const fromRange = statement.from.$cstNode.range;

            if (!locations.has(sourceNodeId)) {
              locations.set(sourceNodeId, {
                nodeId: sourceNodeId,
                startLine: fromRange.start.line + 1,
                startColumn: fromRange.start.character + 1,
                endLine: fromRange.end.line + 1,
                endColumn: fromRange.end.character + 1,
              });
            }
          }

          // Extract target node location from the 'to' NodeRef (or chain)
          if (statement.to?.$cstNode?.range) {
            const targetNodeId = nodeRefToString(statement.to);
            const toRange = statement.to.$cstNode.range;

            if (!locations.has(targetNodeId)) {
              locations.set(targetNodeId, {
                nodeId: targetNodeId,
                startLine: toRange.start.line + 1,
                startColumn: toRange.start.character + 1,
                endLine: toRange.end.line + 1,
                endColumn: toRange.end.character + 1,
              });
            }
          }

          // Handle edge chains (A -> B -> C)
          if (statement.chain && statement.chain.length > 0) {
            for (const chainItem of statement.chain) {
              if (chainItem.to?.$cstNode?.range) {
                const chainNodeId = nodeRefToString(chainItem.to);
                const chainRange = chainItem.to.$cstNode.range;

                if (!locations.has(chainNodeId)) {
                  locations.set(chainNodeId, {
                    nodeId: chainNodeId,
                    startLine: chainRange.start.line + 1,
                    startColumn: chainRange.start.character + 1,
                    endLine: chainRange.end.line + 1,
                    endColumn: chainRange.end.character + 1,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  return locations;
}
