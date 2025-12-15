/**
 * Data-related type definitions for Runiq diagrams
 * Supports data-driven rendering (charts, graphs, data binding)
 */

/**
 * Data value types for data-driven rendering (charts, graphs)
 */
export type DataValue = number | { label: string; value: number };
export type DataArray = DataValue[];

export interface DataPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

/**
 * Data source interface for loading external data
 * Implemented by @runiq/data-loader package
 */
export interface DataSource {
  load(source: string): Promise<DataObject[]>;
  validate(data: unknown): ValidationResult;
  readonly format: string;
}

export type DataObject = Record<string, unknown>;

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: unknown;
}

/**
 * Identifier for a registered data source in dataSourceRegistry
 */
export type DataSourceKey = string;

/**
 * Reference to a data source and where to load from.
 * - key: registry key (e.g., 'json', 'csv', 'http')
 * - source: either a file path or an inline payload string depending on the loader
 */
export interface DataSourceRef {
  key: DataSourceKey;
  source: string;
  // Optional loader-specific options (kept generic to avoid coupling)
  options?: Record<string, unknown>;
}

/**
 * Declarative data binding description used by higher layers (DSL, templates).
 * This does not execute anything by itself; it describes how to obtain and map data.
 */
export interface DataBinding {
  /** Data source reference to load from */
  source: DataSourceRef;
  /** Optional field mapping: targetProperty -> dataFieldPath (dot notation supported later) */
  fields?: Record<string, string>;
  /** Optional filter expression (reserved for future DSL integration) */
  filter?: string;
  /** Optional maximum number of rows to consume */
  limit?: number;
}
