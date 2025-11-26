// Export Langium parser
export { parse, type ParseResult, type NodeLocation } from './langium-parser.js';

// Export Langium services for LSP integration
export { createRuniqServices, type RuniqServices } from './langium-module.js';

// Export generated AST types
export type * from './generated/ast.js';
