import type { IconRef, PositionedNode } from '@runiq/core';
import { iconRegistry } from '@runiq/core';

export function renderIcon(
  icon: IconRef,
  positioned: PositionedNode,
  warnings: string[]
): string {
  const provider = iconRegistry.get(icon.provider);
  const iconData = provider?.getPath(icon.name);
  if (!iconData) {
    warnings.push(`Icon ${icon.provider}/${icon.name} not found`);
    return '';
  }

  const iconSize = 16;
  const padding = 12; // Padding to prevent text overlap
  const iconX = positioned.x + positioned.width - iconSize - padding;
  const iconY = positioned.y + 4; // Small padding from top edge

  // Support custom icon color via iconColor property, otherwise use currentColor
  const positionedWithData = positioned as PositionedNode & {
    data?: { iconColor?: string };
  };
  const iconColor = positionedWithData.data?.iconColor || 'currentColor';

  return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
    <path d="${iconData.d}" fill="${iconColor}" />
  </svg>`;
}
