import type { Direction } from '@runiq/core';
import type { ColorTheme } from '../themes.js';

/**
 * Parameter extraction utilities for glyphset parameters
 * Reduces code duplication across ~30 glyphsets
 */

export interface CommonParams {
  theme: ColorTheme;
  shape: string;
  useContainers: boolean;
  showValues: boolean;
  direction: Direction;
  orientation: 'horizontal' | 'vertical';
}

/**
 * Extracts common parameters with defaults
 * Use this to reduce repetitive parameter extraction code
 */
export function extractCommonParams(
  params: Record<string, unknown>,
  defaults?: Partial<CommonParams>
): CommonParams {
  return {
    theme:
      (params.theme as ColorTheme | undefined) || defaults?.theme || 'colorful',
    shape: (params.shape as string | undefined) || defaults?.shape || 'rect',
    useContainers:
      (params.useContainers as boolean | undefined) ??
      defaults?.useContainers ??
      false,
    showValues:
      (params.showValues as boolean | undefined) ??
      defaults?.showValues ??
      false,
    direction: ((params.direction as 'TB' | 'LR' | undefined) ||
      defaults?.direction ||
      'TB') as Direction,
    orientation:
      (params.orientation as 'horizontal' | 'vertical' | undefined) ||
      defaults?.orientation ||
      'horizontal',
  };
}

/**
 * Extracts a string parameter with optional default
 */
export function extractStringParam(
  params: Record<string, unknown>,
  key: string,
  defaultValue?: string
): string | undefined {
  const value = params[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value as string;
}

/**
 * Extracts a boolean parameter with optional default
 */
export function extractBooleanParam(
  params: Record<string, unknown>,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = params[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value as boolean;
}

/**
 * Extracts a number parameter with optional default
 */
export function extractNumberParam(
  params: Record<string, unknown>,
  key: string,
  defaultValue?: number
): number | undefined {
  const value = params[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value as number;
}

/**
 * Extracts an array parameter
 */
export function extractArrayParam<T = unknown>(
  params: Record<string, unknown>,
  key: string
): T[] | undefined {
  const value = params[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  return value as T[];
}
