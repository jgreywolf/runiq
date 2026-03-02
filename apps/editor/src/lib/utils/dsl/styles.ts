import { findProfileBlock } from './block';
import { escapeRegExp } from './helpers';
import type { ParsedStyleDeclaration } from './types';

function formatStyleProperty(name: string, value: string | number): string {
	const raw = String(value).trim();
	if (name === 'strokeWidth' || name === 'fontSize' || name === 'opacity' || name === 'borderRadius') {
		return `${name}:${raw}`;
	}
	if (name === 'lineStyle' || name === 'fontWeight' || name === 'textAlign') {
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
		if (
			trimmed.startsWith('theme ') ||
			trimmed.startsWith('direction ') ||
			trimmed.startsWith('routing ')
		) {
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

