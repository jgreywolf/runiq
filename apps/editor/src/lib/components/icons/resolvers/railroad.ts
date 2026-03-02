import { generatePlaceholderIcon } from './placeholder';
import type { IconResolution } from './types';

export function resolveRailroadIcon(shapeId: string, size: number): IconResolution {
	const snippetLabels: Record<string, string> = {
		'railroad-rule': 'rule',
		'railroad-theme': 'theme',
		'railroad-choice': 'A|B',
		'railroad-sequence': 'A B',
		'railroad-optional': 'A?',
		'railroad-zero-or-more': 'A*',
		'railroad-one-or-more': 'A+',
		'railroad-group': '(A|B)',
		'railroad-literal': '"+"',
		'railroad-reference': 'Expr'
	};

	const label = snippetLabels[shapeId];
	if (!label) {
		return { svg: generatePlaceholderIcon(shapeId, size), source: 'placeholder-railroad' };
	}

	const fontSize = Math.max(8, Math.floor(size * 0.28));
	const padding = Math.max(2, Math.floor(size * 0.08));
	const width = size - padding * 2;
	const height = size - padding * 2;
	const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
		<rect x="${padding}" y="${padding}" width="${width}" height="${height}" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" />
		<text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" fill="#0f172a" font-family="monospace">${label}</text>
	</svg>`;
	return { svg, source: 'railroad' };
}
