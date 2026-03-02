/**
 * DSL Code Manipulation Utilities
 * Handles editing, inserting, and deleting elements in DSL code.
 * Public API preserved; implementation split by concern under ./dsl/*
 */

export type { LocationHint, ParsedStyleDeclaration, ProfileBlockInfo } from './dsl/types';

export { findProfileBlock } from './dsl/block';
export { deleteElement } from './dsl/delete';
export { editLabel, editPosition, editShapeType, editStyleProperty, resetStyles } from './dsl/edit';
export { getInsertedShapeId, insertEdge, insertShape } from './dsl/insert';
export {
	deleteStyleDeclaration,
	insertStyleDeclaration,
	parseStyleDeclarations,
	updateStyleDeclaration
} from './dsl/styles';

