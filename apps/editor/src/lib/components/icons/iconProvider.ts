/**
 * Icon Provider System
 * Centralized system to get icon SVG content for any shape based on profile context
 */

import { ProfileName } from '$lib/types';
import { resolveDiagramProfileIcon } from './resolvers/diagramProfile';
import { resolveGlyphsetIcon } from './resolvers/glyphset';
import { generatePlaceholderIcon } from './resolvers/placeholder';
import { resolveRailroadIcon } from './resolvers/railroad';
import type { IconRequest, IconResolution } from './resolvers/types';

const iconCache = new Map<string, string>();
const iconSourceCache = new Map<string, string>();

function cacheKey(request: IconRequest): string {
	return `${request.profileName ?? 'none'}::${request.shapeId}::${request.size ?? 48}`;
}

export function __clearIconCache(): void {
	iconCache.clear();
	iconSourceCache.clear();
}

export function __getIconCacheSize(): number {
	return iconCache.size;
}

export interface IconDebugInfo {
	source: string;
	fromCache: boolean;
	hasIcon: boolean;
}

export function getShapeIconDebugInfo(request: IconRequest): IconDebugInfo {
	const key = cacheKey(request);
	const cached = iconCache.get(key);
	if (cached !== undefined) {
		return {
			source: iconSourceCache.get(key) ?? 'unknown',
			fromCache: true,
			hasIcon: true
		};
	}

	const resolution = resolveIcon(request);
	iconCache.set(key, resolution.svg);
	iconSourceCache.set(key, resolution.source);
	return {
		source: resolution.source,
		fromCache: false,
		hasIcon: true
	};
}

/**
 * Get icon SVG content for a shape based on profile context
 * Always returns an SVG (resolved icon or deterministic placeholder)
 */
export function getShapeIconSvg(request: IconRequest): string {
	const key = cacheKey(request);
	const cached = iconCache.get(key);
	if (cached !== undefined) {
		return cached;
	}

	const resolution = resolveIcon(request);
	iconCache.set(key, resolution.svg);
	iconSourceCache.set(key, resolution.source);
	return resolution.svg;
}

function resolveIcon(request: IconRequest): IconResolution {
	const { shapeId, profileName, size = 48 } = request;

	switch (profileName) {
		case ProfileName.glyphset:
			return resolveGlyphsetIcon(shapeId, size);
		case ProfileName.diagram:
		case ProfileName.sequence:
		case ProfileName.electrical:
		case ProfileName.digital:
		case ProfileName.pneumatic:
		case ProfileName.hydraulic:
		case ProfileName.hvac:
			return resolveDiagramProfileIcon(shapeId, size);
		case ProfileName.railroad:
			return resolveRailroadIcon(shapeId, size);
		default:
			return { svg: generatePlaceholderIcon(shapeId, size), source: 'placeholder-default' };
	}
}
