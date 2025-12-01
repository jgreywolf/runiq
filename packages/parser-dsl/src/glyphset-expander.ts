/**
 * GlyphSet expansion logic for parser
 *
 * When a diagram uses `glyphset:pattern-name`, this module expands it
 * into a complete diagram AST by invoking the appropriate glyphset generator.
 */

import type { DiagramAst } from '@runiq/core';
import { glyphsetRegistry, GlyphSetError } from '@runiq/glyphsets';
import type { ImageItem } from '@runiq/glyphsets';
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
 * Extract parameters from glyphset items and parameters
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
function extractGlyphSetParams(
  statements: Array<Langium.GlyphSetItemStatement | Langium.GlyphSetParameter>
): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  const steps: string[] = [];
  const items: string[] = [];
  const levels: string[] = [];
  const levelsWithItems: Array<{
    label: string;
    items?: string[];
    segments?: string[];
  }> = [];
  const stages: string[] = [];
  const events: string[] = [];
  const quadrants: string[] = [];
  const circles: string[] = [];
  const sides: string[] = [];
  const persons: HierarchicalNode[] = [];
  const nodes: HierarchicalNode[] = [];
  const groups: Array<{ name: string; items: string[] }> = [];
  const images: Array<string | ImageItem> = [];

  // New keyword arrays for additional glyphsets
  const roots: string[] = [];
  const children: string[] = [];
  const centers: string[] = [];
  const spokes: string[] = [];
  const teams: string[] = [];
  const leaders: string[] = [];
  const members: string[] = [];
  const inputs: string[] = [];
  const outputs: string[] = [];
  const lefts: string[] = [];
  const rights: string[] = [];

  // Callouts for pictureCallout glyphset
  const callouts: Array<{ label: string; position?: string }> = [];

  for (const stmt of statements) {
    // Check if it's a parameter assignment
    if (Langium.isGlyphSetParameter(stmt)) {
      const param = stmt as Langium.GlyphSetParameter;
      const name = param.name;
      let value: string | number | boolean;

      // Handle new GlyphSetParameterValue structure
      const paramValue = param.value;
      if (paramValue.stringValue !== undefined) {
        // STRING value - remove quotes
        const strValue = paramValue.stringValue;
        value = strValue.replace(/^"|"$/g, '');
      } else if (paramValue.numberValue !== undefined) {
        // NUMBER value
        value = paramValue.numberValue;
      } else if (paramValue.boolValue !== undefined) {
        // BooleanValue
        value = paramValue.boolValue;
      } else if (paramValue.themeValue !== undefined) {
        // ThemeValue - already unquoted string
        value = paramValue.themeValue;
      } else if (paramValue.directionValue !== undefined) {
        // DirectionValue - already unquoted string
        value = paramValue.directionValue;
      } else {
        // Fallback - shouldn't happen with proper grammar
        value = String(paramValue);
      }

      params[name] = value;
      continue;
    }

    // Check if it's a nested item or simple item
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    if (Langium.isGlyphSetNestedItem(stmt)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const nestedItem = stmt as Langium.GlyphSetNestedItem;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const keyword = nestedItem.keyword;

      // Handle hierarchical structures (item, person, node)
      if (keyword === 'item' || keyword === 'person' || keyword === 'node') {
        const nested = extractNestedItem(nestedItem);
        if (keyword === 'item' || keyword === 'person') {
          persons.push(nested);
        } else if (keyword === 'node') {
          nodes.push(nested);
        }
      }
      // Handle nested root/child hierarchies
      else if (keyword === 'root' || keyword === 'child') {
        const nested = extractNestedHierarchyItem(nestedItem);
        if (keyword === 'root') {
          roots.push(nested);
        } else {
          children.push(nested);
        }
      }
      // Handle group with nested items (for groupedProcess)
      else if (keyword === 'group') {
        const groupName = nestedItem.label.replace(/^"|"$/g, '');
        const groupItems: string[] = [];

        // Extract child items
        for (const child of nestedItem.children) {
          if (Langium.isGlyphSetSimpleItem(child)) {
            const childLabel = child.label.replace(/^"|"$/g, '');
            groupItems.push(childLabel);
          }
        }

        groups.push({ name: groupName, items: groupItems });
      }
      // Handle level/stage/step with nested items (for pyramidList, segmentedPyramid, etc.)
      else if (
        keyword === 'level' ||
        keyword === 'stage' ||
        keyword === 'step'
      ) {
        const label = nestedItem.label.replace(/^"|"$/g, '');
        const childItems: string[] = [];

        // Extract child items (use 'item' keyword for all children)
        for (const child of nestedItem.children) {
          if (Langium.isGlyphSetSimpleItem(child)) {
            const childLabel = child.label.replace(/^"|"$/g, '');
            childItems.push(childLabel);
          }
        }

        // Add to levelsWithItems array
        // Use 'items' property for pyramidList, 'segments' for segmentedPyramid
        // The glyphset generator will handle both
        const levelObj: {
          label: string;
          items?: string[];
          segments?: string[];
        } = { label };
        if (childItems.length > 0) {
          levelObj.items = childItems;
          levelObj.segments = childItems; // Also set segments for compatibility
        }
        levelsWithItems.push(levelObj);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    } else if (Langium.isGlyphSetImageItem(stmt)) {
      // Handle image items with url, label, and description
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const imageItem = stmt as Langium.GlyphSetImageItem;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const url = imageItem.url.replace(/^"|"$/g, ''); // Remove quotes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const label = imageItem.label?.replace(/^"|"$/g, '') ?? 'No label';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const description = imageItem.description?.replace(/^"|"$/g, '');

      images.push({
        image: url,
        label,
        ...(description && { description }),
      });
    } else if (Langium.isGlyphSetSimpleItem(stmt)) {
      // Handle flat/simple items
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const simpleItem = stmt as Langium.GlyphSetSimpleItem;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const keyword = simpleItem.keyword;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const label = simpleItem.label.replace(/^"|"/g, ''); // Remove quotes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const relationship = simpleItem.relationship || '';

      switch (keyword) {
        case 'step':
          steps.push(label);
          break;
        case 'item':
          items.push(label);
          break;
        case 'node':
          items.push(label);
          break;
        case 'level':
          if (relationship) {
            levels.push(`${label}:${relationship}`);
          } else {
            levels.push(label);
          }
          break;
        case 'stage':
          stages.push(label);
          break;
        case 'event':
          events.push(label);
          break;
        case 'quadrant':
          quadrants.push(label);
          break;
        case 'circle':
          circles.push(label);
          break;
        case 'side':
          sides.push(label);
          break;
        case 'root':
          roots.push(label);
          break;
        case 'child':
          if (relationship) {
            children.push(`${label}:${relationship}`);
          } else {
            children.push(label);
          }
          break;
        case 'center':
          centers.push(label);
          break;
        case 'spoke':
          spokes.push(label);
          break;
        case 'team':
          teams.push(label);
          break;
        case 'leader':
          leaders.push(label);
          break;
        case 'member':
          members.push(label);
          break;
        case 'input':
          inputs.push(label);
          break;
        case 'output':
          outputs.push(label);
          break;
        case 'left':
          lefts.push(label);
          break;
        case 'right':
          rights.push(label);
          break;
        case 'callout':
          {
            // Normalize position: map common variations to expected values
            let position = relationship;
            if (position) {
              const positionMap: Record<string, string> = {
                topSide: 'top',
                rightSide: 'right',
                bottomSide: 'bottom',
                leftSide: 'left',
                top: 'top',
                right: 'right',
                bottom: 'bottom',
                left: 'left',
              };
              position = positionMap[position] || position;
            }
            callouts.push({
              label,
              ...(position && { position }),
            });
          }
          break;
      }
    }
  }

  // Map arrays to parameters based on what was collected
  if (steps.length > 0) params.steps = steps;
  if (items.length > 0) params.items = items;

  // If we have levelsWithItems (nested structure), use that; otherwise use simple levels
  if (levelsWithItems.length > 0) {
    params.levels = levelsWithItems;
  } else if (levels.length > 0) {
    params.levels = levels;
  }

  if (stages.length > 0) params.stages = stages;
  if (events.length > 0) params.events = events;
  if (quadrants.length > 0) params.quadrants = quadrants;
  if (circles.length > 0) params.circles = circles;
  if (sides.length > 0) params.sides = sides;
  if (images.length > 0) {
    params.images = images;
    // Picture glyphsets expect 'items' parameter
    if (!params.items) params.items = images;
    // pictureCallout expects singular 'image' parameter
    if (images.length === 1 && !params.image) {
      params.image = images[0];
    }
  }

  // Add new keyword parameters
  if (roots.length > 0) params.roots = roots;
  if (children.length > 0) params.children = children;
  if (centers.length > 0) params.centers = centers;
  if (spokes.length > 0) params.spokes = spokes;
  if (teams.length > 0) params.teams = teams;
  if (leaders.length > 0) params.leaders = leaders;
  if (members.length > 0) params.members = members;
  if (inputs.length > 0) params.inputs = inputs;
  if (outputs.length > 0) params.outputs = outputs;
  if (lefts.length > 0) params.lefts = lefts;
  if (rights.length > 0) params.rights = rights;
  if (callouts.length > 0) params.callouts = callouts;

  // Fallback: If only 'item' was used, map it to the appropriate parameter
  // This allows users to use 'item' as a universal keyword
  if (items.length > 0) {
    // Always set items parameter
    if (!params.items) params.items = items;

    if (steps.length === 0 && levels.length === 0 && stages.length === 0) {
      // Could be steps, levels, or stages - set all as fallback
      if (!params.steps) params.steps = items;
      if (!params.levels) params.levels = items;
      if (!params.stages) params.stages = items;
    }
    if (quadrants.length === 0) {
      params.quadrants = items;
    }
    if (circles.length === 0) {
      params.circles = items;
    }
    if (sides.length === 0) {
      params.sides = items;
    }
    if (events.length === 0) {
      params.events = items;
    }
  }

  // Handle hierarchical structures
  if (persons.length > 0) {
    // Always keep as array - orgChart generator expects array of root nodes
    params.structure = persons;
  }
  if (nodes.length > 0) {
    // orgChart uses 'node' keyword and expects 'structure' parameter
    params.structure = nodes;
  }
  if (groups.length > 0) {
    params.groups = groups;
  }

  return params;
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

/**
 * Extract nested hierarchy item (root/child) with optional relationship
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
function extractNestedHierarchyItem(item: Langium.GlyphSetNestedItem): any {
  const label = item.label.replace(/^"|"$/g, ''); // Remove quotes
  const relationship = item.relationship || '';
  const children: any[] = [];

  // Process all children recursively
  for (const child of item.children) {
    if (Langium.isGlyphSetNestedItem(child)) {
      children.push(extractNestedHierarchyItem(child));
    } else if (Langium.isGlyphSetSimpleItem(child)) {
      const childLabel = child.label.replace(/^"|"$/g, '');
      const childRelationship = child.relationship || '';
      const childStr = childRelationship
        ? `${childLabel}:${childRelationship}`
        : childLabel;
      children.push(childStr);
    }
  }

  // If no children, return string (backward compatible)
  if (children.length === 0) {
    return relationship ? `${label}:${relationship}` : label;
  }

  // Return object with children
  const node: any = { label };
  if (relationship) node.relationship = relationship;
  if (children.length > 0) node.children = children;
  return node;
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
    // Use 'reports' for item/person/node keywords (orgChart), 'children' for others
    if (
      item.keyword === 'item' ||
      item.keyword === 'person' ||
      item.keyword === 'node'
    ) {
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
