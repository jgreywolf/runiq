import type { DiagramAst } from '@runiq/core';

/**
 * Parameter definition for a GlyphSet
 */
export interface GlyphSetParameter {
  /** Parameter name (e.g., "steps", "items") */
  name: string;
  /** Parameter type */
  type: 'string' | 'number' | 'array' | 'boolean';
  /** Whether this parameter is required */
  required: boolean;
  /** Default value if not provided */
  default?: string | number | boolean | string[];
  /** Human-readable description */
  description?: string;
}

/**
 * Function that generates a diagram from parameters
 */
export type GlyphSetGenerator = (params: Record<string, unknown>) => DiagramAst;

/**
 * GlyphSet category
 */
export type GlyphSetCategory =
  | 'process'
  | 'hierarchy'
  | 'comparison'
  | 'visualization'
  | 'list'
  | 'relationship';

/**
 * Complete GlyphSet definition
 */
export interface GlyphSetDefinition {
  /** Unique identifier (e.g., "horizontal-process") */
  id: string;
  /** Display name (e.g., "Horizontal Process") */
  name: string;
  /** Category for organization */
  category: GlyphSetCategory;
  /** Human-readable description */
  description: string;
  /** Parameters this glyphset accepts */
  parameters: GlyphSetParameter[];
  /** Function that generates the diagram */
  generator: GlyphSetGenerator;
  /** Searchable tags */
  tags?: string[];
  /** Path to preview image/SVG */
  preview?: string;
  /** Minimum number of items required */
  minItems?: number;
  /** Maximum number of items supported */
  maxItems?: number;
}

/**
 * Error thrown during glyphset generation
 */
export class GlyphSetError extends Error {
  constructor(
    public glyphsetId: string,
    public parameterName?: string,
    message?: string
  ) {
    super(message || `GlyphSet error in ${glyphsetId}`);
    this.name = 'GlyphSetError';
  }
}
