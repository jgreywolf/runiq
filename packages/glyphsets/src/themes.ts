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

  // Forest/nature greens
  forest: [
    '#2E7D32', // Forest Green
    '#43A047', // Medium Green
    '#66BB6A', // Light Green
    '#81C784', // Pale Green
    '#1B5E20', // Dark Green
    '#388E3C', // Green
    '#4CAF50', // Bright Green
    '#A5D6A7', // Very Light Green
  ],

  // Sunset/warm oranges and reds
  sunset: [
    '#FF6F00', // Dark Orange
    '#FF8F00', // Orange
    '#FFA726', // Light Orange
    '#FFB74D', // Pale Orange
    '#F57C00', // Burnt Orange
    '#FB8C00', // Medium Orange
    '#FFA000', // Amber
    '#FFD54F', // Light Amber
  ],

  // Ocean/water blues
  ocean: [
    '#006064', // Deep Ocean
    '#00838F', // Dark Cyan
    '#00ACC1', // Cyan
    '#26C6DA', // Light Cyan
    '#004D40', // Teal
    '#00796B', // Dark Teal
    '#00897B', // Teal
    '#80CBC4', // Light Teal
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
