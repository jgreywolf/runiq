/**
 * Predefined color themes for glyphsets
 * Each theme provides a coordinated set of colors for visualizations
 * Built on top of base theme palettes for consistency
 */

import { baseThemes, type BaseColorPalette } from './base-themes.js';

export interface GlyphsetTheme {
  id: string;
  name: string;
  description: string;
  colors: string[];
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Convert a base theme to a glyphset theme
 */
function baseToGlyphsetTheme(base: BaseColorPalette): GlyphsetTheme {
  return {
    id: base.id,
    name: base.name,
    description: base.description,
    colors: base.colors,
    accentColor: base.primaryColor,
    backgroundColor: base.backgroundColor,
    textColor: base.textColor,
  };
}

/**
 * Predefined glyphset themes
 */
export const glyphsetThemes: Record<string, GlyphsetTheme> = {
  runiq: baseToGlyphsetTheme(baseThemes.runiq),
  professional: baseToGlyphsetTheme(baseThemes.professional),
  forest: baseToGlyphsetTheme(baseThemes.forest),
  sunset: baseToGlyphsetTheme(baseThemes.sunset),
  ocean: baseToGlyphsetTheme(baseThemes.ocean),
  monochrome: baseToGlyphsetTheme(baseThemes.monochrome),
  colorful: baseToGlyphsetTheme(baseThemes.colorful),
  vibrant: baseToGlyphsetTheme(baseThemes.vibrant),
  warm: baseToGlyphsetTheme(baseThemes.warm),
  cool: baseToGlyphsetTheme(baseThemes.cool),
};

/**
 * Get a theme by ID, or return the default runiq theme
 */
export function getGlyphsetTheme(themeId?: string): GlyphsetTheme {
  if (!themeId) {
    return glyphsetThemes.runiq;
  }

  const theme = glyphsetThemes[themeId.toLowerCase()];
  if (!theme) {
    console.warn(`Theme '${themeId}' not found, using 'runiq' theme instead`);
    return glyphsetThemes.runiq;
  }

  return theme;
}

/**
 * Get color from theme by index (cycles through colors if index exceeds array length)
 */
export function getThemeColor(theme: GlyphsetTheme, index: number): string {
  return theme.colors[index % theme.colors.length];
}

/**
 * Get all available theme IDs
 */
export function getAvailableGlyphsetThemes(): string[] {
  return Object.keys(glyphsetThemes);
}
