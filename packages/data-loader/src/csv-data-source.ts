import * as fs from 'fs/promises';
import Papa from 'papaparse';
import type {
  DataSource,
  DataObject,
  ValidationResult,
  ValidationError,
  CsvDataSourceOptions,
} from './types.js';

/**
 * CSV data source loader
 * Loads and parses CSV data from files or inline strings
 */
export class CsvDataSource implements DataSource {
  readonly format = 'csv' as const;
  private options: Required<CsvDataSourceOptions>;

  constructor(options: CsvDataSourceOptions = {}) {
    this.options = {
      header: options.header ?? true,
      delimiter: options.delimiter ?? ',',
      quoteChar: options.quoteChar ?? '"',
      escapeChar: options.escapeChar ?? '"',
      skipEmptyLines: options.skipEmptyLines ?? true,
      dynamicTyping: options.dynamicTyping ?? true,
    };
  }

  /**
   * Load CSV data from a file path or inline CSV string
   * @param source - File path or CSV string
   * @returns Array of data objects
   */
  async load(source: string): Promise<DataObject[]> {
    let csvContent: string;

    // Check if source looks like CSV data (contains newlines or commas)
    if (
      source.includes('\n') ||
      (source.includes(',') && !source.includes('/'))
    ) {
      csvContent = source;
    } else {
      // Load from file
      csvContent = await this.loadFromFile(source);
    }

    // Parse CSV
    const result = Papa.parse(csvContent, {
      header: this.options.header,
      delimiter: this.options.delimiter,
      quoteChar: this.options.quoteChar,
      escapeChar: this.options.escapeChar,
      skipEmptyLines: this.options.skipEmptyLines,
      dynamicTyping: this.options.dynamicTyping,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
    });

    // Check for errors
    if (result.errors.length > 0) {
      throw new Error(
        `CSV parsing failed:\n${result.errors.map((e) => `  - Row ${e.row}: ${e.message}`).join('\n')}`
      );
    }

    // Validate and return data
    const data = result.data as DataObject[];
    const validation = this.validate(data);

    if (!validation.valid) {
      throw new Error(
        `CSV validation failed:\n${validation.errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n')}`
      );
    }

    return data;
  }

  /**
   * Load CSV from a file
   */
  private async loadFromFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'ENOENT') {
          throw new Error(`File not found: ${filePath}`);
        }
        throw new Error(
          `Failed to load CSV from ${filePath}: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Validate CSV data structure
   */
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    // Check if data is an array
    if (!Array.isArray(data)) {
      errors.push({
        path: '$',
        message: 'CSV data must be an array',
      });
      return { valid: false, errors };
    }

    // Check if array is empty
    if (data.length === 0) {
      // Empty CSV is technically valid
      return { valid: true, errors: [] };
    }

    // If using headers, check that all rows have the same structure
    if (this.options.header) {
      const firstRow = data[0] as DataObject;
      const expectedKeys = Object.keys(firstRow).sort();

      data.forEach((row, index) => {
        if (typeof row !== 'object' || row === null) {
          errors.push({
            path: `$[${index}]`,
            message: 'Row must be an object',
            value: row,
          });
          return;
        }

        const rowKeys = Object.keys(row as DataObject).sort();
        if (JSON.stringify(rowKeys) !== JSON.stringify(expectedKeys)) {
          errors.push({
            path: `$[${index}]`,
            message: `Row has inconsistent columns. Expected: [${expectedKeys.join(', ')}], Got: [${rowKeys.join(', ')}]`,
          });
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get column names from CSV data
   */
  getColumnNames(data: DataObject[]): string[] {
    if (data.length === 0) {
      return [];
    }
    return Object.keys(data[0]);
  }

  /**
   * Infer column types from CSV data
   */
  inferColumnTypes(
    data: DataObject[]
  ): Record<string, 'string' | 'number' | 'boolean'> {
    if (data.length === 0) {
      return {};
    }

    const types: Record<string, 'string' | 'number' | 'boolean'> = {};
    const columnNames = this.getColumnNames(data);

    columnNames.forEach((column) => {
      const values = data.map((row) => row[column]);
      types[column] = this.inferType(values);
    });

    return types;
  }

  /**
   * Infer type from array of values
   */
  private inferType(values: unknown[]): 'string' | 'number' | 'boolean' {
    const nonNullValues = values.filter(
      (v) => v !== null && v !== undefined && v !== ''
    );

    if (nonNullValues.length === 0) {
      return 'string';
    }

    // Check if all values are booleans first (before numbers check)
    const allBooleans = nonNullValues.every(
      (v) => typeof v === 'boolean' || v === 'true' || v === 'false'
    );
    if (allBooleans) {
      return 'boolean';
    }

    // Check if all values are numbers
    const allNumbers = nonNullValues.every(
      (v) => typeof v === 'number' || !isNaN(Number(v))
    );
    if (allNumbers) {
      return 'number';
    }

    return 'string';
  }
}

/**
 * Convenience function to load CSV data
 */
export async function loadCsvData(
  source: string,
  options?: CsvDataSourceOptions
): Promise<DataObject[]> {
  const loader = new CsvDataSource(options);
  return loader.load(source);
}
