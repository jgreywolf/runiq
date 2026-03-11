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
	let pendingProfileStart = false;
	let pendingStartLineIndex = -1;
	let pendingStartIndent = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		const isProfileStart = profileTypes.some((type) => new RegExp(`^${type}\\s+`).test(trimmed));

		if (!inProfileBlock && isProfileStart) {
			const match = line.match(/^(\s*)/);
			pendingStartIndent = match ? match[1] : '';
			pendingStartLineIndex = i;
			pendingProfileStart = true;
		}

		// Profile may declare "{" either on the same line or a following line.
		if (!inProfileBlock && pendingProfileStart && trimmed.includes('{')) {
			inProfileBlock = true;
			startLineIndex = pendingStartLineIndex;
			profileStartIndent = pendingStartIndent;
			indentation = profileStartIndent + '  ';
			braceDepth = 1;
			const remaining = trimmed.slice(trimmed.indexOf('{') + 1);
			if (remaining.includes('{')) {
				braceDepth += remaining.split('{').length - 1;
			}
			if (remaining.includes('}')) {
				braceDepth -= remaining.split('}').length - 1;
			}
			if (braceDepth <= 0) {
				insertLineIndex = i;
				break;
			}
			continue;
		}

		if (inProfileBlock) {
			// Count braces across the full line.
			const openCount = (line.match(/{/g) ?? []).length;
			const closeCount = (line.match(/}/g) ?? []).length;
			braceDepth += openCount - closeCount;

			if (braceDepth <= 0) {
				insertLineIndex = i;
				break;
			}
		}
	}

	if (insertLineIndex === -1) return null;
	return { startLineIndex, insertLineIndex, indentation };
}
