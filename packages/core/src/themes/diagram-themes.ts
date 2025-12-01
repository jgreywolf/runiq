/**
 * Predefined color themes for general diagrams
 * Each theme provides coordinated colors for nodes, edges, and backgrounds
 * Built on top of base theme palettes for consistency
 */

import { baseThemes, type BaseColorPalette } from './base-themes.js';

export interface DiagramTheme {
  id: string;
  name: string;
  description: string;
  nodeColors: string[];
  edgeColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * Convert a base theme to a diagram theme
 */
function baseToDiagramTheme(base: BaseColorPalette): DiagramTheme {
  return {
    id: base.id,
    name: base.name,
    description: base.description,
    nodeColors: base.colors,
    edgeColor: base.edgeColor,
    accentColor: base.primaryColor,
    backgroundColor: base.backgroundColor,
    textColor: base.textColor,
  };
}

/**
 * Predefined diagram themes
 */
export const diagramThemes: Record<string, DiagramTheme> = {
  runiq: baseToDiagramTheme(baseThemes.runiq),
  professional: baseToDiagramTheme(baseThemes.professional),
  forest: baseToDiagramTheme(baseThemes.forest),
  sunset: baseToDiagramTheme(baseThemes.sunset),
  ocean: baseToDiagramTheme(baseThemes.ocean),
  monochrome: baseToDiagramTheme(baseThemes.monochrome),
  colorful: baseToDiagramTheme(baseThemes.colorful),
  vibrant: baseToDiagramTheme(baseThemes.vibrant),
  warm: baseToDiagramTheme(baseThemes.warm),
  cool: baseToDiagramTheme(baseThemes.cool),
};

/**
 * Get a theme by ID, or return the default runiq theme
 */
export function getDiagramTheme(themeId?: string): DiagramTheme {
  if (!themeId) {
    return diagramThemes.runiq;
  }

  const theme = diagramThemes[themeId.toLowerCase()];
  if (!theme) {
    console.warn(`Theme '${themeId}' not found, using 'runiq' theme instead`);
    return diagramThemes.runiq;
  }

  return theme;
}

/**
 * Get node color from theme by index (cycles through colors if index exceeds array length)
 */
export function getThemeNodeColor(theme: DiagramTheme, index: number): string {
  return theme.nodeColors[index % theme.nodeColors.length];
}

/**
 * Get all available theme IDs
 */
export function getAvailableDiagramThemes(): string[] {
  return Object.keys(diagramThemes);
}
