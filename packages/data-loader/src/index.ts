// Type definitions
export type {
  DataSource,
  DataObject,
  ValidationResult,
  ValidationError,
  JsonDataSourceOptions,
  CsvDataSourceOptions,
} from './types.js';

// JSON data source
export { JsonDataSource, loadJsonData } from './json-data-source.js';
