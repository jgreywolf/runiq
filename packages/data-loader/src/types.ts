/**
 * Result of a validation operation
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  path: string;
  message: string;
  value?: unknown;
}

/**
 * Generic data object - can be any valid JSON structure
 */
export type DataObject = Record<string, unknown>;

/**
 * Data source interface - all loaders must implement this
 */
export interface DataSource {
  /**
   * Load data from a source (file path, URL, or inline data)
   */
  load(source: string): Promise<DataObject[]>;

  /**
   * Validate data structure
   */
  validate(data: unknown): ValidationResult;

  /**
   * Get the format/type of this data source
   */
  readonly format: 'json' | 'csv';
}

/**
 * Options for JSON data loading
 */
export interface JsonDataSourceOptions {
  /**
   * Maximum nesting depth for validation (default: 10)
   */
  maxDepth?: number;

  /**
   * Validate on load (default: true)
   */
  validateOnLoad?: boolean;

  /**
   * Allow additional properties (default: true)
   */
  strict?: boolean;
}

/**
 * Options for CSV data loading
 */
export interface CsvDataSourceOptions {
  /**
   * Whether first row contains headers (default: true)
   */
  header?: boolean;

  /**
   * Column delimiter (default: ',')
   */
  delimiter?: string;

  /**
   * Quote character (default: '"')
   */
  quoteChar?: string;

  /**
   * Escape character (default: '"')
   */
  escapeChar?: string;

  /**
   * Skip empty lines (default: true)
   */
  skipEmptyLines?: boolean;

  /**
   * Automatically detect delimiter (default: false)
   */
  dynamicTyping?: boolean;
}
