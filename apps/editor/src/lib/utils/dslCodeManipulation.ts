/**
 * DSL Code Manipulation Utilities
 * Handles editing, inserting, and deleting elements in DSL code
 */

export interface ProfileBlockInfo {
	insertLineIndex: number;
	indentation: string;
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
		'pneumatic',
		'hydraulic',
		'sequence',
		'timeline',
		'wardley',
		'glyphset'
	];

	let insertLineIndex = -1;
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

	return { insertLineIndex, indentation };
}

/**
 * Edit a node or edge label in the DSL
 */
export function editLabel(
	code: string,
	nodeOrEdgeId: string,
	value: string,
	isEdge: boolean
): string {
	const lines = code.split('\n');
	let lineIndex = -1;

	if (isEdge) {
		const edgeParts = nodeOrEdgeId.split('-');
		if (edgeParts.length < 2) return code;

		const fromNode = edgeParts[0];
		const toNode = edgeParts[1];

		for (let i = 0; i < lines.length; i++) {
			const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}(?:\\s|$)`);
			if (edgeRegex.test(lines[i])) {
				lineIndex = i;
				break;
			}
		}
	} else {
		for (let i = 0; i < lines.length; i++) {
			const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeOrEdgeId}(?:\\s|$)`);
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
export function editPosition(code: string, nodeId: string, x: number, y: number): string {
	const lines = code.split('\n');
	let lineIndex = -1;

	for (let i = 0; i < lines.length; i++) {
		const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeId}(?:\\s|$)`);
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
	value: any
): string {
	const lines = code.split('\n');
	let lineIndex = -1;

	// Try as shape first
	for (let i = 0; i < lines.length; i++) {
		const shapeRegex = new RegExp(`^\\s*shape\\s+${elementId}(?:\\s|$)`);
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

			for (let i = 0; i < lines.length; i++) {
				const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}(?:\\s|$)`);
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
		} else {
			updatedLine = line.replace(new RegExp(`${property}:\\s*"[^"]*"`), `${property}:"${value}"`);
		}
	} else {
		if (property === 'fontSize' || property === 'strokeWidth' || property === 'shadow') {
			updatedLine = line.trim() + ` ${property}:${value}`;
		} else if (property === 'routing') {
			updatedLine = line.trim() + ` ${property}:${value}`;
		} else {
			updatedLine = line.trim() + ` ${property}:"${value}"`;
		}
	}

	lines[lineIndex] = updatedLine;
	return lines.join('\n');
}

/**
 * Insert a shape into the DSL
 */
export function insertShape(code: string, shapeCode: string, shapeCounter: number): string {
	// Replace 'id' with 'id{counter}' only when it's a standalone word boundary
	// This prevents replacing 'id' in words like 'pyramid' -> 'pyramid9'
	const uniqueCode = shapeCode.replace(/\bid\b/g, `id${shapeCounter}`);
	const blockInfo = findProfileBlock(code);

	if (!blockInfo) return code;

	const lines = code.split('\n');
	lines.splice(blockInfo.insertLineIndex, 0, `${blockInfo.indentation}${uniqueCode}`);
	return lines.join('\n');
}

/**
 * Insert an edge into the DSL
 */
export function insertEdge(code: string, fromNodeId: string, toNodeId: string): string {
	const edgeCode = `${fromNodeId} -> ${toNodeId}`;
	const blockInfo = findProfileBlock(code);

	if (!blockInfo) return code;

	const lines = code.split('\n');
	lines.splice(blockInfo.insertLineIndex, 0, `${blockInfo.indentation}${edgeCode}`);
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
