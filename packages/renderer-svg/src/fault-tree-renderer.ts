import type { FaultTreeEvent, FaultTreeGate, FaultTreeProfile } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';

export interface FaultTreeRenderOptions {
  width?: number;
  levelGap?: number;
  siblingGap?: number;
  padding?: number;
  title?: string;
}

export interface FaultTreeRenderResult {
  svg: string;
  warnings: string[];
}

type ItemKind = 'event' | 'gate';

interface PositionedItem {
  id: string;
  kind: ItemKind;
  label?: string;
  eventKind?: FaultTreeEvent['kind'];
  gateType?: FaultTreeGate['gateType'];
  parentId?: string;
  children: string[];
  width: number;
  height: number;
  subtreeWidth: number;
  centerX: number;
  y: number;
}

const DEFAULT_PADDING = 48;
const DEFAULT_LEVEL_GAP = 96;
const DEFAULT_SIBLING_GAP = 28;
const TITLE_HEIGHT = 36;

export function renderFaultTree(
  profile: FaultTreeProfile,
  options: FaultTreeRenderOptions = {}
): FaultTreeRenderResult {
  const warnings: string[] = [];
  const padding = options.padding ?? DEFAULT_PADDING;
  const levelGap = options.levelGap ?? DEFAULT_LEVEL_GAP;
  const siblingGap = options.siblingGap ?? DEFAULT_SIBLING_GAP;
  const title = options.title ?? profile.title;

  const items = new Map<string, PositionedItem>();

  for (const event of profile.events) {
    const isDiamond = event.kind === 'undevelopedEvent';
    const width = isDiamond
      ? Math.max(92, event.label.length * 7.2 + 28)
      : Math.max(132, event.label.length * 7.8 + 30);
    const height = isDiamond ? 52 : 44;
    items.set(event.id, {
      id: event.id,
      kind: 'event',
      label: event.label,
      eventKind: event.kind,
      parentId: event.under,
      children: [],
      width,
      height,
      subtreeWidth: width,
      centerX: 0,
      y: 0,
    });
  }

  for (const gate of profile.gates) {
    items.set(gate.id, {
      id: gate.id,
      kind: 'gate',
      gateType: gate.gateType,
      parentId: gate.under,
      children: [],
      width: gate.gateType === 'or' ? 48 : 42,
      height: gate.gateType === 'or' ? 34 : 30,
      subtreeWidth: gate.gateType === 'or' ? 48 : 42,
      centerX: 0,
      y: 0,
    });
  }

  for (const item of items.values()) {
    if (!item.parentId) continue;
    const parent = items.get(item.parentId);
    if (!parent) {
      warnings.push(`Fault tree item "${item.id}" references unknown parent "${item.parentId}"`);
      continue;
    }
    parent.children.push(item.id);
  }

  const roots = Array.from(items.values()).filter((item) => !item.parentId || !items.has(item.parentId));
  if (roots.length === 0) {
    return {
      svg: renderEmptyFaultTree(title, 'No root event found'),
      warnings: ['Fault tree has no root event'],
    };
  }
  if (roots.length > 1) {
    warnings.push(`Fault tree has ${roots.length} root items; rendering them left-to-right`);
  }

  const assignSubtreeWidth = (id: string): number => {
    const item = items.get(id)!;
    if (item.children.length === 0) {
      item.subtreeWidth = item.width;
      return item.subtreeWidth;
    }

    const childrenWidth = item.children.reduce((sum, childId, index) => {
      const childWidth = assignSubtreeWidth(childId);
      return sum + childWidth + (index > 0 ? siblingGap : 0);
    }, 0);

    item.subtreeWidth = Math.max(item.width, childrenWidth);
    return item.subtreeWidth;
  };

  roots.forEach((root) => assignSubtreeWidth(root.id));

  let maxDepth = 0;
  const positionTree = (id: string, left: number, depth: number) => {
    const item = items.get(id)!;
    maxDepth = Math.max(maxDepth, depth);
    item.centerX = left + item.subtreeWidth / 2;
    item.y = padding + TITLE_HEIGHT + depth * levelGap;

    let childLeft = left + Math.max(0, (item.subtreeWidth - getChildrenWidth(item.children)) / 2);
    for (const childId of item.children) {
      const child = items.get(childId)!;
      positionTree(childId, childLeft, depth + 1);
      childLeft += child.subtreeWidth + siblingGap;
    }
  };

  const getChildrenWidth = (children: string[]): number =>
    children.reduce((sum, childId, index) => {
      const child = items.get(childId)!;
      return sum + child.subtreeWidth + (index > 0 ? siblingGap : 0);
    }, 0);

  let currentLeft = padding;
  for (const root of roots) {
    positionTree(root.id, currentLeft, 0);
    currentLeft += root.subtreeWidth + siblingGap * 2;
  }

  const diagramWidth =
    options.width ?? Math.max(720, currentLeft - siblingGap * 2 + padding);
  const diagramHeight = padding + TITLE_HEIGHT + (maxDepth + 1) * levelGap + 40;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${diagramWidth}" height="${diagramHeight}" viewBox="0 0 ${diagramWidth} ${diagramHeight}" role="img" aria-labelledby="diagram-title">`;
  svg += `<title id="diagram-title">${escapeXml(title)}</title>`;
  svg += '<defs><style>.runiq-fault-label{font-family:sans-serif;font-size:14px;fill:#0f172a}.runiq-fault-gate{fill:#fff;stroke:#1e293b;stroke-width:1.6}.runiq-fault-line{stroke:#64748b;stroke-width:1.4;fill:none}.runiq-fault-title{font-family:sans-serif;font-size:18px;font-weight:700;fill:#0f172a}</style></defs>';
  svg += `<text class="runiq-fault-title" x="${padding}" y="${padding - 12}">${escapeXml(title)}</text>`;

  for (const item of items.values()) {
    if (item.children.length === 0) continue;
    const parentBottomY = item.y + item.height;
    const busY = item.y + levelGap - 26;
    const firstChild = items.get(item.children[0])!;
    const lastChild = items.get(item.children[item.children.length - 1])!;
    svg += `<line class="runiq-fault-line" x1="${item.centerX}" y1="${parentBottomY}" x2="${item.centerX}" y2="${busY}" />`;
    svg += `<line class="runiq-fault-line" x1="${firstChild.centerX}" y1="${busY}" x2="${lastChild.centerX}" y2="${busY}" />`;
    for (const childId of item.children) {
      const child = items.get(childId)!;
      svg += `<line class="runiq-fault-line" x1="${child.centerX}" y1="${busY}" x2="${child.centerX}" y2="${child.y}" />`;
    }
  }

  for (const item of items.values()) {
    if (item.kind === 'gate') {
      svg += renderGate(item);
    } else if (item.eventKind === 'undevelopedEvent') {
      svg += renderUndevelopedEvent(item);
    } else {
      svg += renderEvent(item);
    }
  }

  svg += '</svg>';
  return { svg, warnings };
}

function renderEmptyFaultTree(title: string, message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="180" viewBox="0 0 520 180" role="img" aria-labelledby="diagram-title"><title id="diagram-title">${escapeXml(title)}</title><rect x="0" y="0" width="520" height="180" fill="#fff" stroke="#cbd5e1"/><text x="24" y="42" font-family="sans-serif" font-size="18" font-weight="700" fill="#0f172a">${escapeXml(title)}</text><text x="24" y="92" font-family="sans-serif" font-size="14" fill="#475569">${escapeXml(message)}</text></svg>`;
}

function renderEvent(item: PositionedItem): string {
  const x = item.centerX - item.width / 2;
  const fill = item.eventKind === 'topEvent' ? '#fee2e2' : '#ffffff';
  const stroke = item.eventKind === 'topEvent' ? '#b91c1c' : '#1e293b';
  return `<g data-fault-id="${escapeXml(item.id)}"><rect x="${x}" y="${item.y}" width="${item.width}" height="${item.height}" rx="4" ry="4" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/><text class="runiq-fault-label" x="${item.centerX}" y="${item.y + item.height / 2}" text-anchor="middle" dominant-baseline="middle">${escapeXml(item.label || item.id)}</text></g>`;
}

function renderUndevelopedEvent(item: PositionedItem): string {
  const x = item.centerX;
  const y = item.y;
  const halfW = item.width / 2;
  const halfH = item.height / 2;
  const path = `M ${x} ${y} L ${x + halfW} ${y + halfH} L ${x} ${y + item.height} L ${x - halfW} ${y + halfH} Z`;
  return `<g data-fault-id="${escapeXml(item.id)}"><path d="${path}" fill="#ffffff" stroke="#1e293b" stroke-width="1.6"/><text class="runiq-fault-label" x="${item.centerX}" y="${item.y + item.height / 2}" text-anchor="middle" dominant-baseline="middle">${escapeXml(item.label || item.id)}</text></g>`;
}

function renderGate(item: PositionedItem): string {
  const x = item.centerX - item.width / 2;
  const y = item.y;
  const gatePath =
    item.gateType === 'or'
      ? `M ${x} ${y + 5} Q ${x + item.width / 2} ${y - 2} ${x + item.width} ${y + 5} Q ${x + item.width * 0.78} ${y + item.height * 0.72} ${x + item.width / 2} ${y + item.height} Q ${x + item.width * 0.22} ${y + item.height * 0.72} ${x} ${y + 5}`
      : `M ${x} ${y} L ${x + item.width} ${y} L ${x + item.width} ${y + item.height * 0.5} Q ${x + item.width / 2} ${y + item.height} ${x} ${y + item.height * 0.5} Z`;
  const label = item.gateType === 'or' ? 'OR' : 'AND';
  return `<g data-fault-id="${escapeXml(item.id)}"><path class="runiq-fault-gate" d="${gatePath}"/><text class="runiq-fault-label" x="${item.centerX}" y="${item.y + item.height / 2 + 1}" text-anchor="middle" dominant-baseline="middle">${label}</text></g>`;
}
