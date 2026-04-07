import type {
  ParseResult as ParseResultType,
  WarningDetail as WarningDetailType,
} from './langium-parser.js';
import type { DiagramProfile as DiagramProfileType } from './generated/ast.js';
import type { NodeLocation as NodeLocationType } from './utils/index.js';
import type { GlyphsetId as GlyphsetIdType } from '@runiq/glyphsets';

// Export Langium parser
export { parse } from './langium-parser.js';
export type ParseResult = ParseResultType;
export type WarningDetail = WarningDetailType;
export type NodeLocation = NodeLocationType;

// Export Langium services for LSP integration
export { createRuniqServices, type RuniqServices } from './langium-module.js';

// Export generated AST types
export type * from './generated/ast.js';
export type DiagramProfile = DiagramProfileType;

// Re-export glyphset constants from @runiq/glyphsets (source of truth)
export {
  getAllGlyphsetIds,
  getGlyphsetStructureType,
  GlyphsetIdList as GlyphsetIds,
  isGlyphsetId,
  isPictureGlyphset,
} from '@runiq/glyphsets';
export type GlyphsetId = GlyphsetIdType;
