/**
 * Constants and type definitions for glyphset conversion
 */

export const standardKeywordRegex =
	/^(\s*)(item|image|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)\s+"([^"]+)"/;
export const imageWithLabelRegex = /^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/;
export const parameterRegEx =
	/^(theme|direction|columns|shape|showValues|showPercentages|layout|orientation)\s/;
