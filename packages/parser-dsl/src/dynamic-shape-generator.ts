/**
 * Dynamic Shape Generator
 * Phase 3: Dynamic Shape Generation
 *
 * Automatically generates nodes and edges from data with:
 * - Auto-assigned unique IDs
 * - Data field to property mapping
 * - Relationship-based edge generation
 * - Style mapping from data values
 */

import type { DataObject } from './template-processor.js';

// Re-export DataObject for test use
export type { DataObject } from './template-processor.js';

/**
 * Configuration for automatic node generation
 */
export interface NodeGenerationConfig {
  /**
   * Shape type for generated nodes (default: 'rect')
   */
  shape?: string;

  /**
   * Field to use as node ID (if not provided, auto-generate)
   */
  idField?: string;

  /**
   * Prefix for auto-generated IDs (default: 'node_')
   */
  idPrefix?: string;

  /**
   * Field mappings: property name → data field name
   * @example { label: 'name', fill: 'color' }
   */
  fieldMappings?: Record<string, string>;

  /**
   * Style mappings: property → style configuration
   */
  styleMappings?: StyleMappingConfig[];
}

/**
 * Style mapping configuration
 */
export interface StyleMappingConfig {
  /**
   * Property to apply style to (e.g., 'fill', 'stroke', 'opacity')
   */
  property: string;

  /**
   * Data field to map from
   */
  field: string;

  /**
   * Type of mapping
   */
  type: 'scale' | 'category' | 'threshold';

  /**
   * Scale configuration (for numeric values)
   */
  scale?: {
    domain: [number, number];
    range: [string, string];
  };

  /**
   * Category mappings (for categorical values)
   */
  categories?: Record<string, string>;

  /**
   * Threshold configuration (for threshold-based styling)
   */
  thresholds?: Array<{
    value: number;
    style: string;
  }>;
}

/**
 * Configuration for automatic edge generation
 */
export interface EdgeGenerationConfig {
  /**
   * Field containing source node ID/reference
   */
  fromField: string;

  /**
   * Field containing target node ID/reference
   */
  toField: string;

  /**
   * Edge type (optional)
   */
  edgeType?: string;

  /**
   * Field mappings for edge properties
   */
  fieldMappings?: Record<string, string>;

  /**
   * Style mappings for edges
   */
  styleMappings?: StyleMappingConfig[];
}

/**
 * Generated node result
 */
export interface GeneratedNode {
  id: string;
  shape: string;
  properties: Record<string, unknown>;
}

/**
 * Generated edge result
 */
export interface GeneratedEdge {
  from: string;
  to: string;
  type?: string;
  properties: Record<string, unknown>;
}

/**
 * Generate nodes from data array
 *
 * @param data Array of data objects
 * @param config Node generation configuration
 * @returns Array of generated nodes
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: 'Alice', age: 30, status: 'active' },
 *   { name: 'Bob', age: 25, status: 'inactive' }
 * ];
 *
 * const config: NodeGenerationConfig = {
 *   shape: 'rect',
 *   fieldMappings: { label: 'name' },
 *   styleMappings: [{
 *     property: 'fill',
 *     field: 'status',
 *     type: 'category',
 *     categories: { active: 'green', inactive: 'gray' }
 *   }]
 * };
 *
 * const nodes = generateNodes(data, config);
 * // [
 * //   { id: 'node_0', shape: 'rect', properties: { label: 'Alice', fill: 'green' } },
 * //   { id: 'node_1', shape: 'rect', properties: { label: 'Bob', fill: 'gray' } }
 * // ]
 * ```
 */
export function generateNodes(
  data: DataObject[],
  config: NodeGenerationConfig = {}
): GeneratedNode[] {
  const {
    shape = 'rect',
    idField,
    idPrefix = 'node_',
    fieldMappings = {},
    styleMappings = [],
  } = config;

  return data.map((item, index) => {
    // Determine node ID
    let id: string;
    if (idField && item[idField] !== undefined) {
      id = String(item[idField]);
    } else {
      id = `${idPrefix}${index}`;
    }

    // Map fields to properties
    const properties: Record<string, unknown> = {};

    // Apply field mappings
    for (const [propName, fieldName] of Object.entries(fieldMappings)) {
      if (item[fieldName] !== undefined) {
        properties[propName] = item[fieldName];
      }
    }

    // Apply style mappings
    for (const styleMapping of styleMappings) {
      const fieldValue = item[styleMapping.field];
      if (fieldValue !== undefined) {
        const styleValue = applyStyleMapping(fieldValue, styleMapping);
        if (styleValue !== undefined) {
          properties[styleMapping.property] = styleValue;
        }
      }
    }

    return {
      id,
      shape,
      properties,
    };
  });
}

/**
 * Generate edges from data array
 *
 * @param data Array of data objects representing relationships
 * @param config Edge generation configuration
 * @returns Array of generated edges
 *
 * @example
 * ```typescript
 * const data = [
 *   { source: 'n1', target: 'n2', weight: 10 },
 *   { source: 'n2', target: 'n3', weight: 5 }
 * ];
 *
 * const config: EdgeGenerationConfig = {
 *   fromField: 'source',
 *   toField: 'target',
 *   fieldMappings: { label: 'weight' }
 * };
 *
 * const edges = generateEdges(data, config);
 * ```
 */
export function generateEdges(
  data: DataObject[],
  config: EdgeGenerationConfig
): GeneratedEdge[] {
  const {
    fromField,
    toField,
    edgeType,
    fieldMappings = {},
    styleMappings = [],
  } = config;

  const edges: GeneratedEdge[] = [];

  for (const item of data) {
    const from = item[fromField];
    const to = item[toField];

    // Skip if from/to not defined
    if (
      from === undefined ||
      to === undefined ||
      from === null ||
      to === null
    ) {
      continue;
    }

    // Map fields to properties
    const properties: Record<string, unknown> = {};

    // Apply field mappings
    for (const [propName, fieldName] of Object.entries(fieldMappings)) {
      if (item[fieldName] !== undefined) {
        properties[propName] = item[fieldName];
      }
    }

    // Apply style mappings
    for (const styleMapping of styleMappings) {
      const fieldValue = item[styleMapping.field];
      if (fieldValue !== undefined) {
        const styleValue = applyStyleMapping(fieldValue, styleMapping);
        if (styleValue !== undefined) {
          properties[styleMapping.property] = styleValue;
        }
      }
    }

    edges.push({
      from: String(from),
      to: String(to),
      type: edgeType,
      properties,
    });
  }

  return edges;
}

/**
 * Apply style mapping to a value
 *
 * @param value Data value to map
 * @param mapping Style mapping configuration
 * @returns Mapped style value
 */
function applyStyleMapping(
  value: unknown,
  mapping: StyleMappingConfig
): string | number | undefined {
  switch (mapping.type) {
    case 'category':
      return applyCategoryMapping(value, mapping);

    case 'scale':
      return applyScaleMapping(value, mapping);

    case 'threshold':
      return applyThresholdMapping(value, mapping);

    default:
      return undefined;
  }
}

/**
 * Apply category-based mapping
 */
function applyCategoryMapping(
  value: unknown,
  mapping: StyleMappingConfig
): string | undefined {
  if (!mapping.categories) return undefined;

  const stringValue = String(value);
  return mapping.categories[stringValue];
}

/**
 * Apply scale-based mapping (linear interpolation for colors/sizes)
 */
function applyScaleMapping(
  value: unknown,
  mapping: StyleMappingConfig
): string | number | undefined {
  if (!mapping.scale) return undefined;

  const numValue = Number(value);
  if (isNaN(numValue)) return undefined;

  const { domain, range } = mapping.scale;

  // Clamp value to domain
  const clamped = Math.max(domain[0], Math.min(domain[1], numValue));

  // Normalize to 0-1
  const normalized = (clamped - domain[0]) / (domain[1] - domain[0]);

  // Check if range is colors (hex strings) or numbers
  if (typeof range[0] === 'string' && range[0].startsWith('#')) {
    return interpolateColor(range[0], range[1], normalized);
  } else {
    // Numeric range
    const rangeStart = Number(range[0]);
    const rangeEnd = Number(range[1]);
    return rangeStart + normalized * (rangeEnd - rangeStart);
  }
}

/**
 * Apply threshold-based mapping
 */
function applyThresholdMapping(
  value: unknown,
  mapping: StyleMappingConfig
): string | undefined {
  if (!mapping.thresholds || mapping.thresholds.length === 0) return undefined;

  const numValue = Number(value);
  if (isNaN(numValue)) return undefined;

  // Sort thresholds by value (descending) and find first match
  const sorted = [...mapping.thresholds].sort((a, b) => b.value - a.value);

  for (const threshold of sorted) {
    if (numValue >= threshold.value) {
      return threshold.style;
    }
  }

  // If no threshold matched, use the lowest threshold's style
  return sorted[sorted.length - 1]?.style;
}

/**
 * Interpolate between two hex colors
 *
 * @param color1 Starting color (hex format)
 * @param color2 Ending color (hex format)
 * @param t Interpolation factor (0-1)
 * @returns Interpolated color in hex format
 */
function interpolateColor(color1: string, color2: string, t: number): string {
  // Parse hex colors
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  // Extract RGB components
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  // Convert back to hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Generate nodes and edges from relational data
 *
 * Automatically creates nodes for unique entities and edges for relationships
 *
 * @param data Array of relationship data
 * @param config Configuration with node and edge settings
 * @returns Object with nodes and edges arrays
 *
 * @example
 * ```typescript
 * const data = [
 *   { from: 'Alice', to: 'Bob', type: 'friend' },
 *   { from: 'Bob', to: 'Charlie', type: 'colleague' }
 * ];
 *
 * const result = generateNodesAndEdges(data, {
 *   nodeConfig: { fieldMappings: { label: 'id' } },
 *   edgeConfig: {
 *     fromField: 'from',
 *     toField: 'to',
 *     fieldMappings: { label: 'type' }
 *   }
 * });
 * ```
 */
export function generateNodesAndEdges(
  data: DataObject[],
  config: {
    nodeConfig?: NodeGenerationConfig;
    edgeConfig: EdgeGenerationConfig;
  }
): { nodes: GeneratedNode[]; edges: GeneratedEdge[] } {
  const { nodeConfig = {}, edgeConfig } = config;

  // Extract unique node IDs from relationships
  const nodeIds = new Set<string>();

  for (const item of data) {
    const from = item[edgeConfig.fromField];
    const to = item[edgeConfig.toField];

    if (from !== undefined && from !== null) {
      nodeIds.add(String(from));
    }
    if (to !== undefined && to !== null) {
      nodeIds.add(String(to));
    }
  }

  // Generate nodes for unique IDs
  const nodeData: DataObject[] = Array.from(nodeIds).map((id) => ({
    id,
    ...nodeConfig.fieldMappings,
  }));

  const nodes = generateNodes(nodeData, {
    ...nodeConfig,
    idField: 'id',
  });

  // Generate edges
  const edges = generateEdges(data, edgeConfig);

  return { nodes, edges };
}
