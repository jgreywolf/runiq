/**
 * Base color palettes shared across all diagram types
 * This ensures consistent theming across diagram, sequence, timeline, and glyphset profiles
 */

export interface BaseColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[]; // Primary colors for nodes, events, etc.
  primaryColor: string; // Main accent color
  secondaryColor: string; // Supporting accent
  edgeColor: string; // Lines and connections
  textColor: string; // Primary text
  backgroundColor: string; // Canvas background
  surfaceColor: string; // Component backgrounds (notes, fragments, etc.)
  strokeColor: string; // Borders and outlines
}

/**
 * Base theme palettes used by all profile types
 */
export const baseThemes: Record<string, BaseColorPalette> = {
  // Runiq branded theme - using official brand colors
  runiq: {
    id: 'runiq',
    name: 'Runiq',
    description: 'Official Runiq brand colors',
    colors: ['#5a819e', '#73a3bf', '#96bacf', '#48677e', '#364d5f'],
    primaryColor: '#5a819e', // Main brand color
    secondaryColor: '#73a3bf',
    edgeColor: '#48677e',
    textColor: '#FFFFFF', // White text on brand colors
    backgroundColor: '#f0f5f8',
    surfaceColor: '#dce8ef',
    strokeColor: '#96bacf',
  },

  // Professional blue theme (default)
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Classic blue tones for business and technical diagrams',
    colors: ['#5B9BD5', '#70AD47', '#FFC000', '#ED7D31', '#A5A5A5'],
    primaryColor: '#5B9BD5',
    secondaryColor: '#2E5AAC',
    edgeColor: '#666666',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F5F9FF',
    strokeColor: '#CCCCCC',
  },

  // Natural forest theme
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    colors: ['#2D5016', '#4A7C2C', '#6FA84C', '#8FBC6F', '#B8D4A0'],
    primaryColor: '#4A7C2C',
    secondaryColor: '#2D5016',
    edgeColor: '#4A7C2C',
    textColor: '#FFFFFF',
    backgroundColor: '#F5F9F3',
    surfaceColor: '#E8F2E4',
    strokeColor: '#8FBC6F',
  },

  // Vibrant sunset theme
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges, reds, and purples',
    colors: ['#E63946', '#F77F00', '#FCBF49', '#A05195', '#D64161'],
    primaryColor: '#E63946',
    secondaryColor: '#A05195',
    edgeColor: '#A05195',
    textColor: '#FFFFFF',
    backgroundColor: '#FFF8F5',
    surfaceColor: '#FFE8E0',
    strokeColor: '#FCBF49',
  },

  // Deep ocean theme
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blues and teals inspired by the sea',
    colors: ['#006BA6', '#0496FF', '#0582CA', '#003554', '#051923'],
    primaryColor: '#0496FF',
    secondaryColor: '#003554',
    edgeColor: '#0582CA',
    textColor: '#FFFFFF',
    backgroundColor: '#F0F8FF',
    surfaceColor: '#D6EBFF',
    strokeColor: '#0496FF',
  },

  // Monochrome theme
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Grayscale for print and minimalist designs',
    colors: ['#2C2C2C', '#4D4D4D', '#6E6E6E', '#8F8F8F', '#B0B0B0'],
    primaryColor: '#4D4D4D',
    secondaryColor: '#2C2C2C',
    edgeColor: '#6E6E6E',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F5F5F5',
    strokeColor: '#CCCCCC',
  },

  // Colorful theme
  colorful: {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant multi-color palette for creative diagrams',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    primaryColor: '#4ECDC4',
    secondaryColor: '#FF6B6B',
    edgeColor: '#45B7D1',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFEF9',
    surfaceColor: '#F0F8FF',
    strokeColor: '#98D8C8',
  },

  // Vibrant theme
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bright, saturated colors for bold statements',
    colors: ['#FF0080', '#00D9FF', '#FFD700', '#7B68EE', '#FF4500'],
    primaryColor: '#00D9FF',
    secondaryColor: '#FF0080',
    edgeColor: '#7B68EE',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F8F8FF',
    strokeColor: '#FFD700',
  },

  // Warm theme
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Warm reds, oranges, and yellows',
    colors: ['#C1121F', '#FE5F55', '#FF9F1C', '#FFBF69', '#FFD23F'],
    primaryColor: '#FE5F55',
    secondaryColor: '#C1121F',
    edgeColor: '#C1121F',
    textColor: '#FFFFFF',
    backgroundColor: '#FFF9F5',
    surfaceColor: '#FFE8E0',
    strokeColor: '#FFBF69',
  },

  // Cool theme
  cool: {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blues and purples',
    colors: ['#4361EE', '#4895EF', '#4CC9F0', '#7209B7', '#560BAD'],
    primaryColor: '#4895EF',
    secondaryColor: '#7209B7',
    edgeColor: '#4361EE',
    textColor: '#FFFFFF',
    backgroundColor: '#F8F9FF',
    surfaceColor: '#E8ECFF',
    strokeColor: '#4CC9F0',
  },
};

/**
 * Get a base theme palette by ID
 */
export function getBaseTheme(
  themeId: string = 'professional'
): BaseColorPalette {
  return baseThemes[themeId] || baseThemes.professional;
}

/**
 * Get all available base theme IDs
 */
export function getAvailableBaseThemes(): string[] {
  return Object.keys(baseThemes);
}
