/**
 * Predefined color themes for glyphsets
 * Each theme provides a coordinated set of colors for visualizations
 */

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
 * Predefined glyphset themes
 */
export const glyphsetThemes: Record<string, GlyphsetTheme> = {
  // Professional blue theme (default)
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Classic blue tones for business and technical diagrams',
    colors: ['#5B9BD5', '#70AD47', '#FFC000', '#ED7D31', '#A5A5A5'],
    accentColor: '#2E5AAC',
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },

  // Natural forest theme
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    colors: ['#2D5016', '#4A7C2C', '#6FA84C', '#8FBC6F', '#B8D4A0'],
    accentColor: '#1A3309',
    backgroundColor: '#F5F9F3',
    textColor: '#FFFFFF',
  },

  // Vibrant sunset theme
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges, reds, and purples',
    colors: ['#E63946', '#F77F00', '#FCBF49', '#A05195', '#D64161'],
    accentColor: '#9B2226',
    backgroundColor: '#FFF8F3',
    textColor: '#FFFFFF',
  },

  // Cool ocean theme
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals inspired by the sea',
    colors: ['#023E8A', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF'],
    accentColor: '#012A4A',
    backgroundColor: '#F0F9FF',
    textColor: '#FFFFFF',
  },

  // Modern monochrome theme
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Sophisticated grayscale palette',
    colors: ['#2C3E50', '#495867', '#577399', '#7C90A0', '#A8B4C0'],
    accentColor: '#1A252F',
    backgroundColor: '#F8F9FA',
    textColor: '#FFFFFF',
  },

  // Colorful office theme
  colorful: {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant multi-color palette inspired by Office',
    colors: [
      '#4472C4',
      '#ED7D31',
      '#A5A5A5',
      '#FFC000',
      '#5B9BD5',
      '#70AD47',
      '#264478',
      '#9E480E',
    ],
    accentColor: '#2E5AAC',
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },

  // Vibrant modern theme
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold, energetic colors for impact',
    colors: [
      '#E74C3C',
      '#3498DB',
      '#2ECC71',
      '#F39C12',
      '#9B59B6',
      '#1ABC9C',
      '#E67E22',
      '#34495E',
    ],
    accentColor: '#C0392B',
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
  },

  // Warm spectrum theme
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Warm reds, oranges, and yellows',
    colors: [
      '#FF6B6B',
      '#FFB347',
      '#FFD93D',
      '#FF8C42',
      '#C44569',
      '#F8B500',
      '#FF7F50',
      '#CD5C5C',
    ],
    accentColor: '#DC143C',
    backgroundColor: '#FFF8F0',
    textColor: '#FFFFFF',
  },

  // Cool spectrum theme
  cool: {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blues, purples, and teals',
    colors: [
      '#00B8D4',
      '#0288D1',
      '#5E35B1',
      '#00897B',
      '#039BE5',
      '#4A148C',
      '#006064',
      '#1A237E',
    ],
    accentColor: '#01579B',
    backgroundColor: '#F0F8FF',
    textColor: '#FFFFFF',
  },
};

/**
 * Get a theme by ID, or return the default professional theme
 */
export function getGlyphsetTheme(themeId?: string): GlyphsetTheme {
  if (!themeId) {
    return glyphsetThemes.professional;
  }

  const theme = glyphsetThemes[themeId.toLowerCase()];
  if (!theme) {
    console.warn(
      `Theme '${themeId}' not found, using 'professional' theme instead`
    );
    return glyphsetThemes.professional;
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
export function getAvailableThemes(): string[] {
  return Object.keys(glyphsetThemes);
}
