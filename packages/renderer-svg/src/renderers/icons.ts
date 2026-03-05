import type { IconRef, NodeAst, PositionedNode } from '@runiq/core';
import { iconRegistry } from '@runiq/core';

export function renderIcon(
  icon: IconRef,
  positioned: PositionedNode,
  nodeOrWarnings?: NodeAst | string[],
  warningsArg?: string[]
): string {
  const warnings = Array.isArray(nodeOrWarnings)
    ? nodeOrWarnings
    : warningsArg || [];
  const node = Array.isArray(nodeOrWarnings)
    ? (positioned as unknown as NodeAst)
    : nodeOrWarnings;

  const iconData = iconRegistry.getIcon(icon.provider, icon.name);
  if (!iconData) {
    warnings.push(`Icon ${icon.provider}/${icon.name} not found`);
    return '';
  }

  const sizeFromNode = (node as any)?.data?.iconSize;
  const iconSize =
    typeof sizeFromNode === 'number'
      ? sizeFromNode
      : icon.provider === 'brand' || icon.provider === 'iconify'
        ? 22
        : 16;
  const padding = iconSize === 22 ? 18 : 12;
  const iconX = positioned.x + positioned.width - iconSize - padding;
  const iconY = positioned.y + 4; // Small padding from top edge

  // Support custom icon color via iconColor property, otherwise use currentColor
  const iconColor = (node as any)?.data?.iconColor || 'currentColor';

  if (iconData.svg) {
    return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}" fill="${iconColor}">
      ${iconData.svg}
    </svg>`;
  }

  if (!iconData.d) {
    warnings.push(`Icon ${icon.provider}/${icon.name} missing path data`);
    return '';
  }

  return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
    <path d="${iconData.d}" fill="${iconColor}" />
  </svg>`;
}
