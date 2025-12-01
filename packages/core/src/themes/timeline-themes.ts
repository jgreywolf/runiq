/**
 * Predefined color themes for timeline diagrams
 * Each theme provides coordinated colors for events, periods, milestones, and backgrounds
 */

export interface TimelineTheme {
  id: string;
  name: string;
  description: string;
  eventColors: string[];
  milestoneColor: string;
  periodColor: string;
  lineColor: string;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
}

/**
 * Predefined timeline themes
 */
export const timelineThemes: Record<string, TimelineTheme> = {
  // Runiq branded theme
  runiq: {
    id: 'runiq',
    name: 'Runiq',
    description: 'Official Runiq brand colors',
    eventColors: ['#5a819e', '#73a3bf', '#96bacf', '#48677e', '#364d5f'],
    milestoneColor: '#364d5f',
    periodColor: '#f0f5f8',
    lineColor: '#5a819e',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#5a819e',
  },

  // Professional blue theme (default)
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Classic blue tones for business timelines',
    eventColors: ['#5B9BD5', '#70AD47', '#FFC000', '#ED7D31', '#A5A5A5'],
    milestoneColor: '#2E5AAC',
    periodColor: '#E8F4F8',
    lineColor: '#4A90E2',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    accentColor: '#2E5AAC',
  },

  // Natural forest theme
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    eventColors: ['#2D5016', '#4A7C2C', '#6FA84C', '#8FBC6F', '#B8D4A0'],
    milestoneColor: '#1A3309',
    periodColor: '#F5F9F3',
    lineColor: '#4A7C2C',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#1A3309',
  },

  // Vibrant sunset theme
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges, reds, and purples',
    eventColors: ['#E63946', '#F77F00', '#FCBF49', '#A05195', '#D64161'],
    milestoneColor: '#9B2226',
    periodColor: '#FFF8F3',
    lineColor: '#E63946',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#9B2226',
  },

  // Cool ocean theme
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals inspired by the sea',
    eventColors: ['#023E8A', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF'],
    milestoneColor: '#012A4A',
    periodColor: '#F0F9FF',
    lineColor: '#0077B6',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#012A4A',
  },

  // Modern monochrome theme
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Sophisticated grayscale palette',
    eventColors: ['#2C3E50', '#495867', '#577399', '#7C90A0', '#A8B4C0'],
    milestoneColor: '#1A252F',
    periodColor: '#F8F9FA',
    lineColor: '#495867',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#1A252F',
  },

  // Colorful office theme
  colorful: {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant multi-color palette',
    eventColors: [
      '#4472C4',
      '#ED7D31',
      '#A5A5A5',
      '#FFC000',
      '#5B9BD5',
      '#70AD47',
      '#264478',
      '#9E480E',
    ],
    milestoneColor: '#2E5AAC',
    periodColor: '#F8F9FA',
    lineColor: '#4472C4',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    accentColor: '#2E5AAC',
  },

  // Vibrant modern theme
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold, energetic colors for impact',
    eventColors: [
      '#E74C3C',
      '#3498DB',
      '#2ECC71',
      '#F39C12',
      '#9B59B6',
      '#1ABC9C',
      '#E67E22',
      '#34495E',
    ],
    milestoneColor: '#C0392B',
    periodColor: '#F8F9FA',
    lineColor: '#3498DB',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#C0392B',
  },

  // Warm spectrum theme
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Warm reds, oranges, and yellows',
    eventColors: [
      '#FF6B6B',
      '#FFB347',
      '#FFD93D',
      '#FF8C42',
      '#C44569',
      '#F8B500',
      '#FF7F50',
      '#CD5C5C',
    ],
    milestoneColor: '#DC143C',
    periodColor: '#FFF8F0',
    lineColor: '#FF6B6B',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    accentColor: '#DC143C',
  },

  // Cool spectrum theme
  cool: {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blues, purples, and teals',
    eventColors: [
      '#00B8D4',
      '#0288D1',
      '#5E35B1',
      '#00897B',
      '#039BE5',
      '#4A148C',
      '#006064',
      '#1A237E',
    ],
    milestoneColor: '#01579B',
    periodColor: '#F0F8FF',
    lineColor: '#0288D1',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    accentColor: '#01579B',
  },

  // Historical theme (sepia/vintage)
  historical: {
    id: 'historical',
    name: 'Historical',
    description: 'Vintage sepia tones for historical timelines',
    eventColors: ['#8B7355', '#A0826D', '#C9A581', '#E6C9A8', '#F4E4C1'],
    milestoneColor: '#5C4033',
    periodColor: '#FFF8DC',
    lineColor: '#8B7355',
    textColor: '#3E2723',
    backgroundColor: '#FFFAF0',
    accentColor: '#5C4033',
  },
};

/**
 * Get a theme by ID, or return the default runiq theme
 */
export function getTimelineTheme(themeId?: string): TimelineTheme {
  if (!themeId) {
    return timelineThemes.runiq;
  }

  const theme = timelineThemes[themeId.toLowerCase()];
  if (!theme) {
    console.warn(`Theme '${themeId}' not found, using 'runiq' theme instead`);
    return timelineThemes.runiq;
  }

  return theme;
}

/**
 * Get event color from theme by index (cycles through colors if index exceeds array length)
 */
export function getThemeEventColor(
  theme: TimelineTheme,
  index: number
): string {
  return theme.eventColors[index % theme.eventColors.length];
}

/**
 * Get all available theme IDs
 */
export function getAvailableTimelineThemes(): string[] {
  return Object.keys(timelineThemes);
}
