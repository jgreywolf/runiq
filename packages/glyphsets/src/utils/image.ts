/**
 * Image utilities for glyphsets
 * Handles image URLs, data URLs, and placeholder images
 */

/**
 * Placeholder image for missing/broken images
 * A simple gray square with a question mark
 */
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='middle' font-size='48' fill='%23999'%3E%3F%3C/text%3E%3C/svg%3E`;

/**
 * Validate if a string is a valid image URL or data URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check for data URL
  if (url.startsWith('data:image/')) {
    return true;
  }

  // Check for HTTP/HTTPS URL
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get image URL or fallback to placeholder
 */
export function getImageUrl(url?: string): string {
  if (!url || !isValidImageUrl(url)) {
    return PLACEHOLDER_IMAGE;
  }
  return url;
}

/**
 * Render an SVG image element
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param width - Width of the image
 * @param height - Height of the image
 * @param imageUrl - URL or data URL of the image
 * @param options - Additional rendering options
 */
export interface RenderImageOptions {
  /** Clip path ID for circular or custom clipping */
  clipPath?: string;
  /** How to preserve aspect ratio */
  preserveAspectRatio?: 'xMidYMid meet' | 'xMidYMid slice' | 'none';
  /** Opacity (0-1) */
  opacity?: number;
}

export function renderImage(
  x: number,
  y: number,
  width: number,
  height: number,
  imageUrl: string,
  options: RenderImageOptions = {}
): string {
  const {
    clipPath,
    preserveAspectRatio = 'xMidYMid slice',
    opacity = 1,
  } = options;

  const validUrl = getImageUrl(imageUrl);

  return `<image 
    x="${x}" 
    y="${y}" 
    width="${width}" 
    height="${height}"
    href="${validUrl}"
    preserveAspectRatio="${preserveAspectRatio}"
    opacity="${opacity}"
    ${clipPath ? `clip-path="url(#${clipPath})"` : ''}
  />`;
}

/**
 * Render a circular clipping path definition for circular images
 */
export function renderCircularClipPath(
  id: string,
  cx: number,
  cy: number,
  radius: number
): string {
  return `<defs>
    <clipPath id="${id}">
      <circle cx="${cx}" cy="${cy}" r="${radius}" />
    </clipPath>
  </defs>`;
}

/**
 * Render a rounded rectangle clipping path for rounded image corners
 */
export function renderRoundedRectClipPath(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number
): string {
  return `<defs>
    <clipPath id="${id}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${borderRadius}" ry="${borderRadius}" />
    </clipPath>
  </defs>`;
}

/**
 * Image item for glyphsets that support pictures
 */
export interface ImageItem {
  /** Image URL or data URL */
  image?: string;
  /** Label/title for the item */
  label: string;
  /** Optional description/subtitle */
  description?: string;
}

/**
 * Validate an image item structure
 */
export function validateImageItem(item: unknown): item is ImageItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const imageItem = item as Partial<ImageItem>;

  // Must have a label
  if (typeof imageItem.label !== 'string' || !imageItem.label) {
    return false;
  }

  // Image is optional but if present must be valid
  if (imageItem.image !== undefined) {
    if (typeof imageItem.image !== 'string') {
      return false;
    }
  }

  // Description is optional but if present must be string
  if (imageItem.description !== undefined) {
    if (typeof imageItem.description !== 'string') {
      return false;
    }
  }

  return true;
}
