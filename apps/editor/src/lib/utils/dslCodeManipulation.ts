/**
 * DSL Code Manipulation Utilities
 * Handles editing, inserting, and deleting elements in DSL code
 */

export interface ProfileBlockInfo {
	startLineIndex: number;
	insertLineIndex: number;
	indentation: string;
}

export interface LocationHint {
	startLine: number;
	startColumn?: number;
	endLine?: number;
	endColumn?: number;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectDeclaredShapeIds(code: string): Set<string> {
	const ids = new Set<string>();
	const lines = code.split('\n');
	for (const line of lines) {
		const match = line.match(/^\s*shape\s+([^\s]+)\s+as\s+/);
		if (match?.[1]) ids.add(match[1]);
	}
	return ids;
}

function nextUniqueId(baseId: string, usedIds: Set<string>, startAt = 2): string {
	if (!usedIds.has(baseId)) return baseId;

	const numericSuffixMatch = baseId.match(/^(.*?)(\d+)$/);
	if (numericSuffixMatch) {
		const prefix = numericSuffixMatch[1];
		let n = Number(numericSuffixMatch[2]);
		while (usedIds.has(`${prefix}${n}`)) n++;
		return `${prefix}${n}`;
	}

	let n = startAt;
	while (usedIds.has(`${baseId}${n}`)) n++;
	return `${baseId}${n}`;
}

function resolveLineIndexFromLocation(
	lines: string[],
	location: LocationHint | undefined,
	matcher: (line: string) => boolean
): number {
	if (!location) return -1;

	const startIndex = Math.max(0, location.startLine - 1);
	if (startIndex < lines.length && matcher(lines[startIndex])) {
		return startIndex;
	}

	// In case locations are slightly stale after recent edits, scan nearby lines first.
	const radius = 4;
	for (let offset = 1; offset <= radius; offset++) {
		const above = startIndex - offset;
		const below = startIndex + offset;
		if (above >= 0 && matcher(lines[above])) return above;
		if (below < lines.length && matcher(lines[below])) return below;
	}

	return -1;
}

/**
 * Find the profile/diagram block in the code for inserting new elements
 */
export function findProfileBlock(code: string): ProfileBlockInfo | null {
	const lines = code.split('\n');
	const profileTypes = [
		'diagram',
		'pid',
		'electrical',
		'digital',
		'control',
		'pneumatic',
		'hydraulic',
		'hvac',
		'sequence',
		'timeline',
		'wardley',
		'glyphset'
	];

	let insertLineIndex = -1;
	let startLineIndex = -1;
	let indentation = '  ';
	let inProfileBlock = false;
	let braceDepth = 0;
	let profileStartIndent = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		const isProfileStart = profileTypes.some((type) => new RegExp(`^${type}\\s+`).test(trimmed));

		if (isProfileStart && trimmed.endsWith('{')) {
			inProfileBlock = true;
			startLineIndex = i;
			braceDepth = 1;
			const match = line.match(/^(\s*)/);
			profileStartIndent = match ? match[1] : '';
			indentation = profileStartIndent + '  ';
		} else if (inProfileBlock) {
			if (trimmed.includes('{')) braceDepth++;
			if (trimmed.includes('}')) braceDepth--;

			if (braceDepth === 0 && trimmed === '}') {
				insertLineIndex = i;
				break;
			}
		}
	}

	if (insertLineIndex === -1) return null;

	return { startLineIndex, insertLineIndex, indentation };
}

function isShapeDeclarationLine(trimmedLine: string): boolean {
	return /^shape\s+\S+/.test(trimmedLine);
}

function isEdgeDeclarationLine(trimmedLine: string): boolean {
	return /^\S+\s+(-[^>]*->|->)\s+\S+/.test(trimmedLine);
}

function findFirstEdgeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.startLineIndex + 1; i < blockInfo.insertLineIndex; i++) {
		if (isEdgeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

function findLastEdgeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.insertLineIndex - 1; i > blockInfo.startLineIndex; i--) {
		if (isEdgeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

function findLastShapeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.insertLineIndex - 1; i > blockInfo.startLineIndex; i--) {
		if (isShapeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

/**
 * Edit a node or edge label in the DSL
 */
export function editLabel(
	code: string,
	nodeOrEdgeId: string,
	value: string,
	isEdge: boolean,
	location?: LocationHint
): string {
	const lines = code.split('\n');
	let lineIndex = -1;

	if (isEdge) {
		const edgeParts = nodeOrEdgeId.split('-');
		if (edgeParts.length < 2) return code;

		const fromNode = edgeParts[0];
		const toNode = edgeParts[1];
		const edgeRegex = new RegExp(
			`^\\s*${escapeRegExp(fromNode)}\\s+(-[^>]*->|->)\\s+${escapeRegExp(toNode)}(?:\\s|$)`
		);
		lineIndex = resolveLineIndexFromLocation(lines, location, (line) => edgeRegex.test(line));

		for (let i = 0; i < lines.length && lineIndex === -1; i++) {
			if (edgeRegex.test(lines[i])) {
				lineIndex = i;
				break;
			}
		}
	} else {
		const shapeRegex = new RegExp(`^\\s*shape\\s+${escapeRegExp(nodeOrEdgeId)}(?:\\s|$)`);
		lineIndex = resolveLineIndexFromLocation(lines, location, (line) => shapeRegex.test(line));
		for (let i = 0; i < lines.length && lineIndex === -1; i++) {
			if (shapeRegex.test(lines[i])) {
				lineIndex = i;
				break;
			}
		}
	}

	if (lineIndex === -1) return code;

	const line = lines[lineIndex];
	const hasLabel = /label:\s*"[^"]*"/.test(line);

	lines[lineIndex] = hasLabel
		? line.replace(/label:\s*"[^"]*"/, `label:"${value}"`)
		: line.trim() + ` label:"${value}"`;

	return lines.join('\n');
}

/**
 * Edit a node position in the DSL
 */
export function editPosition(
	code: string,
	nodeId: string,
	x: number,
	y: number,
	location?: LocationHint
): string {
	const lines = code.split('\n');
	let lineIndex = -1;
	const shapeRegex = new RegExp(`^\\s*shape\\s+${escapeRegExp(nodeId)}(?:\\s|$)`);
	lineIndex = resolveLineIndexFromLocation(lines, location, (line) => shapeRegex.test(line));

	for (let i = 0; i < lines.length && lineIndex === -1; i++) {
		if (shapeRegex.test(lines[i])) {
			lineIndex = i;
			break;
		}
	}

	if (lineIndex === -1) return code;

	const line = lines[lineIndex];
	const hasPosition = /position:\s*\([^)]+\)/.test(line);

	lines[lineIndex] = hasPosition
		? line.replace(/position:\s*\([^)]+\)/, `position:(${x},${y})`)
		: line.trim() + ` position:(${x},${y})`;

	return lines.join('\n');
}

/**
 * Edit a style property in the DSL
 */
export function editStyleProperty(
	code: string,
	elementId: string,
	property: string,
	value: any,
	location?: LocationHint
): string {
	const lines = code.split('\n');
	let lineIndex = -1;
	const shapeRegex = new RegExp(`^\\s*shape\\s+${escapeRegExp(elementId)}(?:\\s|$)`);

	// Try as shape first
	lineIndex = resolveLineIndexFromLocation(lines, location, (line) => shapeRegex.test(line));
	for (let i = 0; i < lines.length && lineIndex === -1; i++) {
		if (shapeRegex.test(lines[i])) {
			lineIndex = i;
			break;
		}
	}

	// Try as edge if not found
	if (lineIndex === -1) {
		const edgeParts = elementId.split('-');
		if (edgeParts.length >= 2) {
			const fromNode = edgeParts[0];
			const toNode = edgeParts[1];
			const edgeRegex = new RegExp(
				`^\\s*${escapeRegExp(fromNode)}\\s+(-[^>]*->|->)\\s+${escapeRegExp(toNode)}(?:\\s|$)`
			);
			lineIndex = resolveLineIndexFromLocation(lines, location, (line) => edgeRegex.test(line));

			for (let i = 0; i < lines.length && lineIndex === -1; i++) {
				if (edgeRegex.test(lines[i])) {
					lineIndex = i;
					break;
				}
			}
		}
	}

	if (lineIndex === -1) return code;

	const line = lines[lineIndex];
	const propertyRegex = new RegExp(`${property}:\\s*[^\\s]+`);
	const hasProperty = propertyRegex.test(line);

	let updatedLine: string;
	const isClearingIcon = property === 'icon' && String(value).trim() === '';
	const isClearingStyleRef = property === 'style' && String(value).trim() === '';
	if (hasProperty) {
		if (property === 'fontSize' || property === 'strokeWidth') {
			updatedLine = line.replace(new RegExp(`${property}:\\s*\\d+`), `${property}:${value}`);
		} else if (property === 'shadow') {
			updatedLine = line.replace(
				new RegExp(`${property}:\\s*(true|false)`),
				`${property}:${value}`
			);
		} else if (property === 'routing') {
			updatedLine = line.replace(new RegExp(`${property}:\\s*\\w+`), `${property}:${value}`);
		} else if (property === 'lineStyle') {
			updatedLine = line.replace(
				new RegExp(`${property}:\\s*("[^"]*"|\\w+)`),
				`${property}:"${value}"`
			);
		} else if (property === 'style') {
			updatedLine = isClearingStyleRef
				? line.replace(new RegExp(`\\s*${property}:\\s*\\w+`), '')
				: line.replace(new RegExp(`${property}:\\s*\\w+`), `${property}:${value}`);
		} else if (property === 'icon') {
			updatedLine = isClearingIcon
				? line.replace(new RegExp(`\\s*${property}:\\s*[^\\s]+`), '')
				: line.replace(new RegExp(`${property}:\\s*[^\\s]+`), `${property}:${value}`);
		} else {
			updatedLine = line.replace(new RegExp(`${property}:\\s*"[^"]*"`), `${property}:"${value}"`);
		}
	} else {
		if (isClearingIcon || isClearingStyleRef) {
			return code;
		}
		if (property === 'fontSize' || property === 'strokeWidth' || property === 'shadow') {
			updatedLine = line.trim() + ` ${property}:${value}`;
		} else if (property === 'routing' || property === 'style') {
			updatedLine = line.trim() + ` ${property}:${value}`;
		} else if (property === 'lineStyle') {
			updatedLine = line.trim() + ` ${property}:"${value}"`;
		} else if (property === 'icon') {
			updatedLine = line.trim() + ` ${property}:${value}`;
		} else {
			updatedLine = line.trim() + ` ${property}:"${value}"`;
		}
	}

	lines[lineIndex] = updatedLine;
	return lines.join('\n');
}

export function editShapeType(
	code: string,
	nodeId: string,
	shapeType: string,
	location?: LocationHint
): string {
	const lines = code.split('\n');
	const shapeRegex = new RegExp(`^\\s*shape\\s+${escapeRegExp(nodeId)}(?:\\s|$)`);
	let lineIndex = resolveLineIndexFromLocation(lines, location, (line) => shapeRegex.test(line));
	for (let i = 0; i < lines.length && lineIndex === -1; i++) {
		if (shapeRegex.test(lines[i])) {
			lineIndex = i;
			break;
		}
	}
	if (lineIndex === -1) return code;

	const targetShape = shapeType.startsWith('@') ? shapeType.slice(1) : shapeType;
	const line = lines[lineIndex];
	if (/(\sas\s+@)([^\s]+)/.test(line)) {
		lines[lineIndex] = line.replace(/(\sas\s+@)([^\s]+)/, `$1${targetShape}`);
	} else {
		lines[lineIndex] = `${line.trim()} as @${targetShape}`;
	}
	return lines.join('\n');
}

function formatStyleProperty(name: string, value: string | number): string {
	const raw = String(value).trim();
	if (
		name === 'strokeWidth' ||
		name === 'fontSize' ||
		name === 'opacity' ||
		name === 'borderRadius'
	) {
		return `${name}:${raw}`;
	}
	if (
		name === 'lineStyle' ||
		name === 'fontWeight' ||
		name === 'textAlign'
	) {
		return `${name}:${raw}`;
	}
	return `${name}:"${raw.replace(/"/g, '\\"')}"`;
}

export function insertStyleDeclaration(
	code: string,
	styleName: string,
	properties: Record<string, string | number>
): string {
	const cleanName = styleName.trim();
	if (!cleanName) return code;
	const entries = Object.entries(properties).filter(([, v]) => String(v).trim() !== '');
	if (entries.length === 0) return code;
	const styleLine = `style ${cleanName} ${entries
		.map(([k, v]) => formatStyleProperty(k, v))
		.join(' ')}`.trim();

	const blockInfo = findProfileBlock(code);
	if (!blockInfo) return code;
	const lines = code.split('\n');

	let insertAt = blockInfo.startLineIndex + 1;
	for (let i = blockInfo.startLineIndex + 1; i < blockInfo.insertLineIndex; i++) {
		const trimmed = lines[i].trim();
		if (trimmed.startsWith('theme ') || trimmed.startsWith('direction ') || trimmed.startsWith('routing ')) {
			insertAt = i + 1;
			continue;
		}
		if (trimmed.startsWith('style ')) {
			insertAt = i + 1;
			continue;
		}
		break;
	}

	lines.splice(insertAt, 0, `${blockInfo.indentation}${styleLine}`);
	return lines.join('\n');
}

export function updateStyleDeclaration(
	code: string,
	styleName: string,
	properties: Record<string, string | number>
): string {
	const lines = code.split('\n');
	const styleRegex = new RegExp(`^\\s*style\\s+${escapeRegExp(styleName)}(?:\\s|$)`);
	const idx = lines.findIndex((line) => styleRegex.test(line));
	if (idx === -1) return code;
	const entries = Object.entries(properties).filter(([, v]) => String(v).trim() !== '');
	if (entries.length === 0) return deleteStyleDeclaration(code, styleName);
	lines[idx] = `${lines[idx].match(/^(\s*)/)?.[1] ?? ''}style ${styleName} ${entries
		.map(([k, v]) => formatStyleProperty(k, v))
		.join(' ')}`.trimEnd();
	return lines.join('\n');
}

export function deleteStyleDeclaration(code: string, styleName: string): string {
	const lines = code.split('\n');
	const styleRegex = new RegExp(`^\\s*style\\s+${escapeRegExp(styleName)}(?:\\s|$)`);
	const idx = lines.findIndex((line) => styleRegex.test(line));
	if (idx === -1) return code;
	lines.splice(idx, 1);
	return lines.join('\n');
}

export interface ParsedStyleDeclaration {
	name: string;
	properties: Record<string, string>;
}

export function parseStyleDeclarations(code: string): ParsedStyleDeclaration[] {
	const lines = code.split('\n');
	const declarations: ParsedStyleDeclaration[] = [];
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed.startsWith('style ')) continue;
		const nameMatch = trimmed.match(/^style\s+([^\s]+)\s*(.*)$/);
		if (!nameMatch) continue;
		const name = nameMatch[1];
		const rest = nameMatch[2] ?? '';
		const props: Record<string, string> = {};
		const propRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*("[^"]*"|[^\s]+)/g;
		let match: RegExpExecArray | null;
		while ((match = propRegex.exec(rest)) !== null) {
			const key = match[1];
			const raw = match[2];
			props[key] = raw.startsWith('"') ? raw.slice(1, -1) : raw;
		}
		declarations.push({ name, properties: props });
	}
	return declarations;
}

/**
 * Insert a shape into the DSL
 */
export function insertShape(code: string, shapeCode: string, shapeCounter: number): string {
	// Replace 'id' with 'id{counter}' only when it's a standalone word boundary
	// This prevents replacing 'id' in words like 'pyramid' -> 'pyramid9'
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

/**
 * Delete a node or edge from the DSL
 */
export function deleteElement(code: string, nodeId: string | null, edgeId: string | null): string {
	const lines = code.split('\n');
	const linesToRemove: number[] = [];

	if (nodeId) {
		// Find and remove shape declaration
		for (let i = 0; i < lines.length; i++) {
			const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeId}\\s+as\\s+@\\w+`);
			if (shapeRegex.test(lines[i])) {
				linesToRemove.push(i);
				break;
			}
		}

		// Remove connected edges
		for (let i = 0; i < lines.length; i++) {
			const edgeRegex = new RegExp(
				`^\\s*(${nodeId}\\s+(-\\w*->|->)\\s+\\w+|\\w+\\s+(-\\w*->|->)\\s+${nodeId})`
			);
			if (edgeRegex.test(lines[i])) {
				linesToRemove.push(i);
			}
		}
	} else if (edgeId) {
		const edgeParts = edgeId.split('-');
		if (edgeParts.length >= 2) {
			const fromNode = edgeParts[0];
			const toNode = edgeParts[1];

			for (let i = 0; i < lines.length; i++) {
				const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}`);
				if (edgeRegex.test(lines[i])) {
					linesToRemove.push(i);
					break;
				}
			}
		}
	}

	if (linesToRemove.length > 0) {
		const sortedLines = [...linesToRemove].sort((a, b) => b - a);
		for (const lineIndex of sortedLines) {
			lines.splice(lineIndex, 1);
		}
	}

	return lines.join('\n');
}

/**
 * Reset styles for selected elements
 */
export function resetStyles(code: string, elementIds: string[]): string {
	const lines = code.split('\n');
	const styleProperties = [
		'fillColor',
		'strokeColor',
		'strokeWidth',
		'lineStyle',
		'fontSize',
		'fontFamily',
		'fontWeight',
		'opacity',
		'textColor',
		'shadow',
		'routing'
	];

	elementIds.forEach((elementId) => {
		let lineIndex = -1;

		// Try as shape
		for (let i = 0; i < lines.length; i++) {
			const shapeRegex = new RegExp(`^\\s*shape\\s+${elementId}(?:\\s|$)`);
			if (shapeRegex.test(lines[i])) {
				lineIndex = i;
				break;
			}
		}

		// Try as edge
		if (lineIndex === -1) {
			const edgeParts = elementId.split('-');
			if (edgeParts.length >= 2) {
				const fromNode = edgeParts[0];
				const toNode = edgeParts[1];
				for (let i = 0; i < lines.length; i++) {
					const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}(?:\\s|$)`);
					if (edgeRegex.test(lines[i])) {
						lineIndex = i;
						break;
					}
				}
			}
		}

		if (lineIndex !== -1) {
			let line = lines[lineIndex];
			styleProperties.forEach((prop) => {
				line = line.replace(new RegExp(`\\s+${prop}:[^\\s]+`, 'g'), '');
				line = line.replace(new RegExp(`\\s+${prop}:"[^"]*"`, 'g'), '');
			});
			lines[lineIndex] = line.trim();
		}
	});

	return lines.join('\n');
}
