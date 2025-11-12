/**
 * Color themes for GlyphSets
 * Inspired by Microsoft SmartArt color schemes
 */

export const COLOR_THEMES = {
  // Default Office blue (current)
  colorful: [
    '#4472C4', // Blue
    '#ED7D31', // Orange
    '#A5A5A5', // Gray
    '#FFC000', // Gold
    '#5B9BD5', // Light Blue
    '#70AD47', // Green
    '#264478', // Dark Blue
    '#9E480E', // Dark Orange
  ],

  // Monochrome blues
  monochrome: [
    '#4472C4',
    '#5B8FD8',
    '#7AABEC',
    '#A8C7F5',
    '#2E5AAC',
    '#1E4A94',
    '#0E3A7C',
    '#003366',
  ],

  // Vibrant colors
  vibrant: [
    '#E74C3C', // Red
    '#3498DB', // Blue
    '#2ECC71', // Green
    '#F39C12', // Orange
    '#9B59B6', // Purple
    '#1ABC9C', // Teal
    '#E67E22', // Dark Orange
    '#34495E', // Dark Gray
  ],

  // Warm spectrum
  warm: [
    '#FF6B6B', // Coral
    '#FFB347', // Orange
    '#FFD93D', // Yellow
    '#FF8C42', // Peach
    '#C44569', // Pink
    '#F8B500', // Amber
    '#FF7F50', // Light Coral
    '#CD5C5C', // Indian Red
  ],

  // Cool spectrum
  cool: [
    '#00B8D4', // Cyan
    '#0288D1', // Blue
    '#5E35B1', // Purple
    '#00897B', // Teal
    '#039BE5', // Light Blue
    '#4A148C', // Deep Purple
    '#006064', // Dark Cyan
    '#1A237E', // Indigo
  ],

  // Professional gray-blue
  professional: [
    '#546E7A',
    '#607D8B',
    '#78909C',
    '#90A4AE',
    '#455A64',
    '#37474F',
    '#263238',
    '#B0BEC5',
  ],
};

export type ColorTheme = keyof typeof COLOR_THEMES;

/**
 * Get color from theme by index (cycles if index > theme length)
 */
export function getThemeColor(theme: ColorTheme, index: number): string {
  const colors = COLOR_THEMES[theme];
  return colors[index % colors.length];
}
