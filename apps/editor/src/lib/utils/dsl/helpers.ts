import type { LocationHint, ProfileBlockInfo } from './types';

export function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function collectDeclaredShapeIds(code: string): Set<string> {
	const ids = new Set<string>();
	const lines = code.split('\n');
	for (const line of lines) {
		const match = line.match(/^\s*shape\s+([^\s]+)\s+as\s+/);
		if (match?.[1]) ids.add(match[1]);
	}
	return ids;
}

export function nextUniqueId(baseId: string, usedIds: Set<string>, startAt = 2): string {
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

export function resolveLineIndexFromLocation(
	lines: string[],
	location: LocationHint | undefined,
	matcher: (line: string) => boolean
): number {
	if (!location) return -1;

	const startIndex = Math.max(0, location.startLine - 1);
	if (startIndex < lines.length && matcher(lines[startIndex])) {
		return startIndex;
	}

	const radius = 4;
	for (let offset = 1; offset <= radius; offset++) {
		const above = startIndex - offset;
		const below = startIndex + offset;
		if (above >= 0 && matcher(lines[above])) return above;
		if (below < lines.length && matcher(lines[below])) return below;
	}

	return -1;
}

export function isShapeDeclarationLine(trimmedLine: string): boolean {
	return /^shape\s+\S+/.test(trimmedLine);
}

export function isEdgeDeclarationLine(trimmedLine: string): boolean {
	return /^\S+\s+(-[^>]*->|->)\s+\S+/.test(trimmedLine);
}

export function findFirstEdgeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.startLineIndex + 1; i < blockInfo.insertLineIndex; i++) {
		if (isEdgeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

export function findLastEdgeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.insertLineIndex - 1; i > blockInfo.startLineIndex; i--) {
		if (isEdgeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

export function findLastShapeLineIndex(lines: string[], blockInfo: ProfileBlockInfo): number {
	for (let i = blockInfo.insertLineIndex - 1; i > blockInfo.startLineIndex; i--) {
		if (isShapeDeclarationLine(lines[i].trim())) return i;
	}
	return -1;
}

