/**
 * Predefined color themes for sequence diagrams
 * Each theme provides coordinated colors for participants, messages, lifelines, and notes
 */

export interface SequenceTheme {
  id: string;
  name: string;
  description: string;
  participantColor: string;
  participantTextColor: string;
  lifelineColor: string;
  messageColor: string;
  activationColor: string;
  noteColor: string;
  noteTextColor: string;
  fragmentColor: string;
  fragmentBorderColor: string;
  backgroundColor: string;
}

/**
 * Predefined sequence diagram themes
 */
export const sequenceThemes: Record<string, SequenceTheme> = {
  // Runiq branded theme
  runiq: {
    id: 'runiq',
    name: 'Runiq',
    description: 'Official Runiq brand colors',
    participantColor: '#5a819e',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#96bacf',
    messageColor: '#48677e',
    activationColor: '#73a3bf',
    noteColor: '#dce8ef',
    noteTextColor: '#24333f',
    fragmentColor: '#f0f5f8',
    fragmentBorderColor: '#5a819e',
    backgroundColor: '#FFFFFF',
  },

  // Professional blue theme (default)
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Classic blue tones for UML sequence diagrams',
    participantColor: '#5B9BD5',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#999999',
    messageColor: '#333333',
    activationColor: '#4A90E2',
    noteColor: '#FFFACD',
    noteTextColor: '#000000',
    fragmentColor: '#E8F4F8',
    fragmentBorderColor: '#4A90E2',
    backgroundColor: '#FFFFFF',
  },

  // Natural forest theme
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    participantColor: '#4A7C2C',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#8FBC6F',
    messageColor: '#2D5016',
    activationColor: '#6FA84C',
    noteColor: '#E8F5E0',
    noteTextColor: '#1A3309',
    fragmentColor: '#F5F9F3',
    fragmentBorderColor: '#4A7C2C',
    backgroundColor: '#FFFFFF',
  },

  // Vibrant sunset theme
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges, reds, and purples',
    participantColor: '#E63946',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#D64161',
    messageColor: '#9B2226',
    activationColor: '#F77F00',
    noteColor: '#FFF4E6',
    noteTextColor: '#9B2226',
    fragmentColor: '#FFF8F3',
    fragmentBorderColor: '#E63946',
    backgroundColor: '#FFFFFF',
  },

  // Cool ocean theme
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals inspired by the sea',
    participantColor: '#0077B6',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#48CAE4',
    messageColor: '#023E8A',
    activationColor: '#00B4D8',
    noteColor: '#E0F7FA',
    noteTextColor: '#012A4A',
    fragmentColor: '#F0F9FF',
    fragmentBorderColor: '#0077B6',
    backgroundColor: '#FFFFFF',
  },

  // Modern monochrome theme
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Sophisticated grayscale palette',
    participantColor: '#495867',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#A8B4C0',
    messageColor: '#2C3E50',
    activationColor: '#577399',
    noteColor: '#F8F9FA',
    noteTextColor: '#1A252F',
    fragmentColor: '#F5F6F7',
    fragmentBorderColor: '#495867',
    backgroundColor: '#FFFFFF',
  },

  // Colorful office theme
  colorful: {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant multi-color palette',
    participantColor: '#4472C4',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#A5A5A5',
    messageColor: '#264478',
    activationColor: '#5B9BD5',
    noteColor: '#FFF9DB',
    noteTextColor: '#000000',
    fragmentColor: '#F0F8FF',
    fragmentBorderColor: '#4472C4',
    backgroundColor: '#FFFFFF',
  },

  // Vibrant modern theme
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold, energetic colors for impact',
    participantColor: '#3498DB',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#9B59B6',
    messageColor: '#2C3E50',
    activationColor: '#2ECC71',
    noteColor: '#FFF3CD',
    noteTextColor: '#856404',
    fragmentColor: '#F8F9FA',
    fragmentBorderColor: '#3498DB',
    backgroundColor: '#FFFFFF',
  },

  // Warm spectrum theme
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Warm reds, oranges, and yellows',
    participantColor: '#FF6B6B',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#FF8C42',
    messageColor: '#CD5C5C',
    activationColor: '#FFB347',
    noteColor: '#FFF8DC',
    noteTextColor: '#8B4513',
    fragmentColor: '#FFF8F0',
    fragmentBorderColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
  },

  // Cool spectrum theme
  cool: {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blues, purples, and teals',
    participantColor: '#0288D1',
    participantTextColor: '#FFFFFF',
    lifelineColor: '#5E35B1',
    messageColor: '#01579B',
    activationColor: '#00897B',
    noteColor: '#E1F5FE',
    noteTextColor: '#01579B',
    fragmentColor: '#F0F8FF',
    fragmentBorderColor: '#0288D1',
    backgroundColor: '#FFFFFF',
  },
};

/**
 * Get a theme by ID, or return the default runiq theme
 */
export function getSequenceTheme(themeId?: string): SequenceTheme {
  if (!themeId) {
    return sequenceThemes.runiq;
  }

  const theme = sequenceThemes[themeId.toLowerCase()];
  if (!theme) {
    console.warn(`Theme '${themeId}' not found, using 'runiq' theme instead`);
    return sequenceThemes.runiq;
  }

  return theme;
}

/**
 * Get all available theme IDs
 */
export function getAvailableSequenceThemes(): string[] {
  return Object.keys(sequenceThemes);
}
