import { findProfileBlock } from './block';
import {
	collectDeclaredShapeIds,
	escapeRegExp,
	findFirstEdgeLineIndex,
	findLastEdgeLineIndex,
	findLastShapeLineIndex,
	nextUniqueId
} from './helpers';

/**
 * Insert a shape into the DSL
 */
export function insertShape(code: string, shapeCode: string, shapeCounter: number): string {
	let uniqueCode = shapeCode.replace(/\bid\b/g, `id${shapeCounter}`).trim();
	const existingIds = collectDeclaredShapeIds(code);
	const shapeDeclMatch = uniqueCode.match(/^\s*shape\s+([^\s]+)\s+as\s+/m);
	if (shapeDeclMatch?.[1]) {
		const currentId = shapeDeclMatch[1];
		const resolvedId = nextUniqueId(currentId, existingIds, shapeCounter);
		if (resolvedId !== currentId) {
			const idRegex = new RegExp(`\\b${escapeRegExp(currentId)}\\b`, 'g');
			uniqueCode = uniqueCode.replace(idRegex, resolvedId);
		}
	}
	const blockInfo = findProfileBlock(code);
	if (!blockInfo) return code;

	const lines = code.split('\n');
	const snippetLines = uniqueCode
		.split('\n')
		.map((line) => line.trimEnd())
		.filter((line) => line.trim().length > 0)
		.map((line) => `${blockInfo.indentation}${line}`);
	if (snippetLines.length === 0) return code;

	const firstEdgeIndex = findFirstEdgeLineIndex(lines, blockInfo);
	const shapeInsertIndex = firstEdgeIndex >= 0 ? firstEdgeIndex : blockInfo.insertLineIndex;
	lines.splice(shapeInsertIndex, 0, ...snippetLines);
	return lines.join('\n');
}

export function getInsertedShapeId(previousCode: string, newCode: string): string | null {
	const before = collectDeclaredShapeIds(previousCode);
	const after = collectDeclaredShapeIds(newCode);
	for (const id of after) {
		if (!before.has(id)) return id;
	}
	return null;
}

/**
 * Insert an edge into the DSL
 */
export function insertEdge(code: string, fromNodeId: string, toNodeId: string): string {
	const edgeCode = `${fromNodeId} -> ${toNodeId}`.trim();
	const blockInfo = findProfileBlock(code);
	if (!blockInfo) return code;

	const lines = code.split('\n');
	const lastEdgeIndex = findLastEdgeLineIndex(lines, blockInfo);
	const edgeInsertIndex =
		lastEdgeIndex >= 0
			? lastEdgeIndex + 1
			: (() => {
					const lastShapeIndex = findLastShapeLineIndex(lines, blockInfo);
					return lastShapeIndex >= 0 ? lastShapeIndex + 1 : blockInfo.insertLineIndex;
				})();
	lines.splice(edgeInsertIndex, 0, `${blockInfo.indentation}${edgeCode}`);
	return lines.join('\n');
}

