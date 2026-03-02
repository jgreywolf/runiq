import type { LocationHint } from './types';
import { escapeRegExp, resolveLineIndexFromLocation } from './helpers';

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

	lineIndex = resolveLineIndexFromLocation(lines, location, (line) => shapeRegex.test(line));
	for (let i = 0; i < lines.length && lineIndex === -1; i++) {
		if (shapeRegex.test(lines[i])) {
			lineIndex = i;
			break;
		}
	}

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

		for (let i = 0; i < lines.length; i++) {
			const shapeRegex = new RegExp(`^\\s*shape\\s+${elementId}(?:\\s|$)`);
			if (shapeRegex.test(lines[i])) {
				lineIndex = i;
				break;
			}
		}

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

