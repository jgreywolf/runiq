/**
 * GlyphSet expansion logic for parser
 *
 * When a diagram uses `glyphset:pattern-name`, this module expands it
 * into a complete diagram AST by invoking the appropriate glyphset generator.
 */

import type { DiagramAst } from '@runiq/core';
import { glyphsetRegistry, GlyphSetError } from '@runiq/glyphsets';
import * as Langium from './generated/ast.js';

// Define hierarchical node types
interface HierarchicalNode {
  name: string;
  reports?: HierarchicalNode[];
  children?: HierarchicalNode[];
}

export function isGlyphSetProfile(
  profile: unknown
): profile is Langium.GlyphSetProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    '$type' in profile &&
    (profile as { $type: string }).$type === 'GlyphSetProfile'
  );
}

/**
 * Extract parameters from glyphset items
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
function extractGlyphSetParams(
  statements: Langium.GlyphSetItemStatement[]
): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  const steps: string[] = [];
  const items: string[] = [];
  const levels: string[] = [];
  const stages: string[] = [];
  const events: string[] = [];
  const quadrants: string[][] = [];
  const circles: string[] = [];
  const sides: string[] = [];
  const persons: HierarchicalNode[] = [];
  const nodes: HierarchicalNode[] = [];

  for (const stmt of statements) {
    // Check if it's a nested item or simple item
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    if (Langium.isGlyphSetNestedItem(stmt)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const nestedItem = stmt as Langium.GlyphSetNestedItem;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const keyword = nestedItem.keyword;
      const nested = extractNestedItem(nestedItem);

      if (keyword === 'person') {
        persons.push(nested);
      } else if (keyword === 'node') {
        nodes.push(nested);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    } else if (Langium.isGlyphSetSimpleItem(stmt)) {
      // Handle flat/simple items
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const simpleItem = stmt as Langium.GlyphSetSimpleItem;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const keyword = simpleItem.keyword;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const label = simpleItem.label.replace(/^"|"$/g, ''); // Remove quotes

      switch (keyword) {
        case 'step':
          steps.push(label);
          break;
        case 'item':
          items.push(label);
          break;
        case 'level':
          levels.push(label);
          break;
        case 'stage':
          stages.push(label);
          break;
        case 'event':
          events.push(label);
          break;
        case 'quadrant':
          quadrants.push([label]);
          break;
        case 'circle':
          circles.push(label);
          break;
        case 'side':
          sides.push(label);
          break;
      }
    }
  }

  // Map arrays to parameters based on what was collected
  if (steps.length > 0) params.steps = steps;
  if (items.length > 0) params.items = items;
  if (levels.length > 0) params.levels = levels;
  if (stages.length > 0) params.stages = stages;
  if (events.length > 0) params.events = events;
  if (quadrants.length > 0) params.quadrants = quadrants;
  if (circles.length > 0) params.circles = circles;
  if (sides.length > 0) params.sides = sides;

  // Handle hierarchical structures
  if (persons.length > 0) {
    // Always keep as array - orgChart generator expects array of root nodes
    params.structure = persons;
  }
  if (nodes.length > 0) {
    // Keep as array for consistency
    params.nodes = nodes;
  }

  return params;
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

/**
 * Recursively extract nested item with children
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
function extractNestedItem(item: Langium.GlyphSetNestedItem): HierarchicalNode {
  const label = item.label.replace(/^"|"$/g, ''); // Remove quotes
  const children: HierarchicalNode[] = [];

  // Process all children recursively
  for (const child of item.children) {
    if (Langium.isGlyphSetNestedItem(child)) {
      children.push(extractNestedItem(child));
    } else if (Langium.isGlyphSetSimpleItem(child)) {
      // Leaf node - just the label
      const childLabel = child.label.replace(/^"|"$/g, '');
      children.push({ name: childLabel });
    }
  }

  // Build node with appropriate children property
  const node: HierarchicalNode = { name: label };
  if (children.length > 0) {
    // Use 'reports' for person keyword, 'children' for others
    if (item.keyword === 'person') {
      node.reports = children;
    } else {
      node.children = children;
    }
  }

  return node;
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

/**
 * Expand a GlyphSetProfile into a complete DiagramAst
 *
 * @param profile The Langium GlyphSetProfile
 * @returns Complete DiagramAst generated by the glyphset
 * @throws GlyphSetError if glyphset not found or invalid
 */
export function expandGlyphSet(profile: Langium.GlyphSetProfile): DiagramAst {
  const glyphsetId = profile.glyphsetType;

  // Look up the glyphset
  const glyphset = glyphsetRegistry.get(glyphsetId);

  if (!glyphset) {
    throw new GlyphSetError(
      glyphsetId,
      undefined,
      `Unknown glyphset "${glyphsetId}". Available glyphsets: ${glyphsetRegistry.getAllIds().join(', ')}`
    );
  }

  // Extract parameters from glyphset items
  const params = extractGlyphSetParams(profile.items);

  // Generate the diagram using the glyphset
  try {
    const diagram = glyphset.generator(params);

    return {
      ...diagram,
      // Preserve any metadata
      _glyphsetId: glyphsetId,
      _glyphsetParams: params,
    } as DiagramAst;
  } catch (error) {
    if (error instanceof GlyphSetError) {
      throw error;
    }
    throw new GlyphSetError(
      glyphsetId,
      undefined,
      `Error generating glyphset "${glyphsetId}": ${(error as Error).message}`
    );
  }
}
