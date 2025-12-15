// Export Langium parser
export { parse, type ParseResult } from './langium-parser.js';
export type { NodeLocation } from './utils/index.js';

// Export Langium services for LSP integration
export { createRuniqServices, type RuniqServices } from './langium-module.js';

// Export generated AST types
export type * from './generated/ast.js';

// Re-export glyphset constants from @runiq/glyphsets (source of truth)
export {
  getAllGlyphsetIds,
  getGlyphsetStructureType,
  GlyphsetIdList as GlyphsetIds,
  isGlyphsetId,
  isPictureGlyphset,
  type GlyphsetId,
} from '@runiq/glyphsets';
