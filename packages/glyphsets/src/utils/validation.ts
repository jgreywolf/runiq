import { GlyphSetError } from '../types.js';

/**
 * Validation utilities for glyphset parameters
 * Reduces code duplication across 50+ glyphsets
 */

export interface ArrayValidationOptions {
  minItems?: number;
  maxItems?: number;
  itemType?: 'string' | 'object';
  allowEmpty?: boolean;
}

/**
 * Validates that a parameter is an array with optional constraints
 */
export function validateArrayParameter(
  glyphsetId: string,
  paramName: string,
  value: unknown,
  options: ArrayValidationOptions = {}
): asserts value is string[] | object[] {
  if (!value || !Array.isArray(value)) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be an array`
    );
  }

  if (!options.allowEmpty && value.length === 0) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" cannot be empty`
    );
  }

  if (options.minItems !== undefined && value.length < options.minItems) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `${glyphsetId} requires at least ${options.minItems} ${paramName}`
    );
  }

  if (options.maxItems !== undefined && value.length > options.maxItems) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `${glyphsetId} supports maximum ${options.maxItems} ${paramName} (for readability)`
    );
  }

  if (options.itemType === 'string') {
    const allStrings = value.every((item) => typeof item === 'string');
    if (!allStrings) {
      throw new GlyphSetError(
        glyphsetId,
        paramName,
        `All items in "${paramName}" must be strings`
      );
    }
  }
}

/**
 * Validates that a parameter is a string with optional allowed values
 */
export function validateStringParameter(
  glyphsetId: string,
  paramName: string,
  value: unknown,
  allowedValues?: string[]
): asserts value is string {
  if (typeof value !== 'string') {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be a string`
    );
  }

  if (allowedValues && !allowedValues.includes(value)) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be one of: ${allowedValues.join(', ')}`
    );
  }
}

/**
 * Validates that a parameter is a boolean
 */
export function validateBooleanParameter(
  glyphsetId: string,
  paramName: string,
  value: unknown
): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be a boolean`
    );
  }
}

/**
 * Validates that a parameter is a number with optional range constraints
 */
export function validateNumberParameter(
  glyphsetId: string,
  paramName: string,
  value: unknown,
  options: { min?: number; max?: number } = {}
): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be a number`
    );
  }

  if (options.min !== undefined && value < options.min) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be at least ${options.min}`
    );
  }

  if (options.max !== undefined && value > options.max) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Parameter "${paramName}" must be at most ${options.max}`
    );
  }
}

/**
 * Validates required parameter is present
 */
export function validateRequired(
  glyphsetId: string,
  paramName: string,
  value: unknown
): asserts value is NonNullable<typeof value> {
  if (value === undefined || value === null) {
    throw new GlyphSetError(
      glyphsetId,
      paramName,
      `Required parameter "${paramName}" is missing`
    );
  }
}
