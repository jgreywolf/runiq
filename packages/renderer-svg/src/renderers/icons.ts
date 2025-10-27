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
  const iconX = positioned.x + positioned.width - iconSize - 5;
  const iconY = positioned.y + 5;

  return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
    <path d="${iconData.d}" fill="currentColor" />
  </svg>`;
}
