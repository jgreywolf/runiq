import type { IconRef } from '@runiq/core';
import { iconRegistry } from '@runiq/core';

/**
 * Parses a label string that may contain inline icon references.
 * Icon syntax: "prefix:icon-name" (e.g., "fa:fa-twitter for peace")
 *
 * @param label The label text that may contain inline icons
 * @returns Array of segments, each being either text or an icon reference
 */
export interface LabelSegment {
  type: 'text' | 'icon';
  content: string;
  iconRef?: IconRef;
}

export function parseLabelWithIcons(label: string): LabelSegment[] {
  const segments: LabelSegment[] = [];

  // Regex to match icon syntax: prefix:icon-name (followed by space or end of string)
  // Examples: "fa:fa-twitter", "mdi:account", etc.
  const iconPattern = /(\w+):(\S+?)(?=\s|$)/g;

  let lastIndex = 0;
  let match;

  while ((match = iconPattern.exec(label)) !== null) {
    // Add text before the icon (if any)
    if (match.index > lastIndex) {
      const textBefore = label.substring(lastIndex, match.index).trim();
      if (textBefore) {
        segments.push({ type: 'text', content: textBefore });
      }
    }

    // Add the icon segment
    const provider = match[1];
    const iconName = match[2];

    segments.push({
      type: 'icon',
      content: `${provider}:${iconName}`,
      iconRef: { provider, name: iconName },
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last icon
  if (lastIndex < label.length) {
    const textAfter = label.substring(lastIndex).trim();
    if (textAfter) {
      segments.push({ type: 'text', content: textAfter });
    }
  }

  // If no icons found, return the whole label as text
  if (segments.length === 0 && label.trim()) {
    segments.push({ type: 'text', content: label });
  }

  return segments;
}

/**
 * Renders a label with inline icons as SVG markup.
 * Icons are rendered inline with the text at the specified position.
 *
 * @param label The label text that may contain inline icons
 * @param x The x position for the text
 * @param y The y position for the text (baseline)
 * @param style Text styling options
 * @param warnings Array to collect warning messages
 * @returns SVG markup for the label with icons
 */
export function renderLabelWithIcons(
  label: string,
  x: number,
  y: number,
  style: {
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    textAnchor?: 'start' | 'middle' | 'end';
    dominantBaseline?: string;
  },
  warnings: string[]
): string {
  const segments = parseLabelWithIcons(label);

  // If no icons, return simple text element
  if (segments.every((s) => s.type === 'text')) {
    return `<text x="${x}" y="${y}" 
      text-anchor="${style.textAnchor || 'middle'}" 
      dominant-baseline="${style.dominantBaseline || 'middle'}"
      font-family="${style.fontFamily || 'sans-serif'}" 
      font-size="${style.fontSize || 14}"
      fill="${style.fill || 'currentColor'}">
      ${label}
    </text>`;
  }

  // Build SVG with inline icons
  const fontSize = style.fontSize || 14;
  const iconSize = fontSize; // Icons are same size as text
  const iconPadding = 4; // Space between icon and text

  let svg = '<g>';
  let currentX = x;

  // For centered text, we need to calculate total width first
  if (style.textAnchor === 'middle') {
    let totalWidth = 0;
    segments.forEach((seg) => {
      if (seg.type === 'text') {
        // Approximate width (8px per char is rough estimate)
        totalWidth += seg.content.length * (fontSize * 0.6);
      } else {
        totalWidth += iconSize + iconPadding;
      }
    });
    currentX = x - totalWidth / 2;
  }

  segments.forEach((seg) => {
    if (seg.type === 'text') {
      svg += `<text x="${currentX}" y="${y}" 
        text-anchor="start" 
        dominant-baseline="${style.dominantBaseline || 'middle'}"
        font-family="${style.fontFamily || 'sans-serif'}" 
        font-size="${fontSize}"
        fill="${style.fill || 'currentColor'}">
        ${seg.content}
      </text>`;
      // Approximate text width
      currentX += seg.content.length * (fontSize * 0.6) + iconPadding;
    } else if (seg.type === 'icon' && seg.iconRef) {
      const provider = iconRegistry.get(seg.iconRef.provider);
      const iconData = provider?.getPath(seg.iconRef.name);

      if (iconData) {
        // Adjust icon Y to align with text baseline
        const iconY = y - iconSize / 2;
        svg += `<svg x="${currentX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
          <path d="${iconData.d}" fill="${style.fill || 'currentColor'}" />
        </svg>`;
        currentX += iconSize + iconPadding;
      } else {
        warnings.push(
          `Icon ${seg.iconRef.provider}/${seg.iconRef.name} not found in label`
        );
        // Show the icon reference as fallback text
        svg += `<text x="${currentX}" y="${y}" 
          text-anchor="start" 
          dominant-baseline="${style.dominantBaseline || 'middle'}"
          font-family="${style.fontFamily || 'sans-serif'}" 
          font-size="${fontSize * 0.8}"
          fill="${style.fill || 'currentColor'}">
          [${seg.content}]
        </text>`;
        currentX += seg.content.length * (fontSize * 0.5) + iconPadding;
      }
    }
  });

  svg += '</g>';
  return svg;
}

/**
 * Calculates the width of a label with inline icons.
 * This is an approximation used for layout calculations.
 *
 * @param label The label text that may contain inline icons
 * @param fontSize The font size for text measurement
 * @returns Approximate width in pixels
 */
export function measureLabelWithIcons(
  label: string,
  fontSize: number = 14
): number {
  const segments = parseLabelWithIcons(label);
  let totalWidth = 0;

  segments.forEach((seg) => {
    if (seg.type === 'text') {
      // Approximate: 0.6 * fontSize per character
      totalWidth += seg.content.length * (fontSize * 0.6);
    } else {
      // Icon size + padding
      totalWidth += fontSize + 4;
    }
  });

  return totalWidth;
}
