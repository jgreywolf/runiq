import * as fs from 'fs/promises';
import type {
  DataSource,
  DataObject,
  ValidationResult,
  ValidationError,
  JsonDataSourceOptions,
} from './types.js';

/**
 * JSON data source loader
 * Loads and validates JSON data from files or inline strings
 */
export class JsonDataSource implements DataSource {
  readonly format = 'json' as const;
  private options: Required<JsonDataSourceOptions>;

  constructor(options: JsonDataSourceOptions = {}) {
    this.options = {
      maxDepth: options.maxDepth ?? 10,
      validateOnLoad: options.validateOnLoad ?? true,
      strict: options.strict ?? false,
    };
  }

  /**
   * Load JSON data from a file path or inline JSON string
   * @param source - File path or JSON string
   * @returns Array of data objects
   */
  async load(source: string): Promise<DataObject[]> {
    let data: unknown;

    // Try to parse as inline JSON first
    if (source.trim().startsWith('{') || source.trim().startsWith('[')) {
      try {
        data = JSON.parse(source);
      } catch {
        // If inline parsing fails, treat as file path
        data = await this.loadFromFile(source);
      }
    } else {
      // Load from file
      data = await this.loadFromFile(source);
    }

    // Validate if enabled
    if (this.options.validateOnLoad) {
      const validation = this.validate(data);
      if (!validation.valid) {
        throw new Error(
          `JSON validation failed:\n${validation.errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n')}`
        );
      }
    }

    // Normalize to array
    return this.normalizeToArray(data);
  }

  /**
   * Load JSON from a file
   */
  private async loadFromFile(filePath: string): Promise<unknown> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as unknown;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'ENOENT') {
          throw new Error(`File not found: ${filePath}`);
        }
        if (error instanceof SyntaxError) {
          throw new Error(`Invalid JSON in file ${filePath}: ${error.message}`);
        }
        throw new Error(`Failed to load JSON from ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validate JSON data structure
   */
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    // Check if data is valid
    if (data === undefined || data === null) {
      errors.push({
        path: '$',
        message: 'Data cannot be null or undefined',
      });
      return { valid: false, errors };
    }

    // Check nesting depth
    const depthCheck = this.checkDepth(data, '$', 0);
    if (!depthCheck.valid) {
      errors.push(...depthCheck.errors);
    }

    // Check for circular references
    try {
      JSON.stringify(data);
    } catch (error) {
      errors.push({
        path: '$',
        message: 'Circular reference detected in data structure',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check nesting depth recursively
   */
  private checkDepth(
    data: unknown,
    path: string,
    currentDepth: number
  ): ValidationResult {
    const errors: ValidationError[] = [];

    if (currentDepth > this.options.maxDepth) {
      errors.push({
        path,
        message: `Nesting depth exceeds maximum of ${this.options.maxDepth}`,
      });
      return { valid: false, errors };
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        const result = this.checkDepth(item, itemPath, currentDepth + 1);
        errors.push(...result.errors);
      });
    } else if (data !== null && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        const keyPath = `${path}.${key}`;
        const result = this.checkDepth(value, keyPath, currentDepth + 1);
        errors.push(...result.errors);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalize data to array format
   * - If already array, return as-is
   * - If object, wrap in array
   * - If object has 'data' or 'items' property that's an array, use that
   */
  private normalizeToArray(data: unknown): DataObject[] {
    if (Array.isArray(data)) {
      return data as DataObject[];
    }

    if (data !== null && typeof data === 'object') {
      const obj = data as DataObject;

      // Check for common array container properties
      if (Array.isArray(obj.data)) {
        return obj.data as DataObject[];
      }
      if (Array.isArray(obj.items)) {
        return obj.items as DataObject[];
      }
      if (Array.isArray(obj.records)) {
        return obj.records as DataObject[];
      }
      if (Array.isArray(obj.rows)) {
        return obj.rows as DataObject[];
      }

      // Wrap single object in array
      return [obj];
    }

    // Primitive value - wrap in object and array
    return [{ value: data }];
  }
}

/**
 * Convenience function to load JSON data
 */
export async function loadJsonData(
  source: string,
  options?: JsonDataSourceOptions
): Promise<DataObject[]> {
  const loader = new JsonDataSource(options);
  return loader.load(source);
}
