import { getGlyphsetShapeIcon, isGlyphsetShape } from '../glyphsetIcons';
import { generatePlaceholderIcon } from './placeholder';
import type { IconResolution } from './types';

export function resolveGlyphsetIcon(shapeId: string, size: number): IconResolution {
	const glyphsetIcon = isGlyphsetShape(shapeId) ? getGlyphsetShapeIcon(shapeId, size) : null;
	return {
		svg: glyphsetIcon ?? generatePlaceholderIcon(shapeId, size),
		source: glyphsetIcon ? 'glyphset' : 'placeholder-glyphset'
	};
}
