import type { ProfileBlockInfo } from './types';

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

