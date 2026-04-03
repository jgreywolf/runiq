import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export function getBpmnEventBounds() {
  const size = 40;
  return { width: size, height: size };
}

export function renderBpmnEventSvg(
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  options: {
    forceIntermediate?: boolean;
    suppressLabel?: boolean;
    dashedBorder?: boolean;
  } = {}
) {
  const bounds = getBpmnEventBounds();
  const { x, y } = position;
  const radius = bounds.width / 2;
  const cx = x + radius;
  const cy = y + radius;

  const { fill, stroke } = extractBasicStyles(ctx, {
    defaultFill: '#ffffff',
    defaultStroke: '#000000',
  });

  const eventType =
    getDataProperty<string>(ctx.node.data, 'eventType', 'start') || 'start';

  let svg = '';
  let icon = '';

  const isEndEvent =
    !options.forceIntermediate &&
    (eventType === 'end' || eventType.startsWith('end-'));
  const isIntermediateEvent =
    options.forceIntermediate ||
    eventType === 'intermediate' ||
    eventType.startsWith('intermediate-');
  const dashAttr = options.dashedBorder ? ' stroke-dasharray="3,2"' : '';

  if (isEndEvent) {
    svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 2.5}" fill="${fill}" stroke="${stroke}" stroke-width="5"${dashAttr}/>`;
  } else if (isIntermediateEvent) {
    svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"${dashAttr}/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius - 5}" fill="none" stroke="${stroke}" stroke-width="1.5"${dashAttr}/>`;
  } else {
    svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1"${dashAttr}/>`;
  }

  const baseEventType = eventType
    .replace(/^start-/, '')
    .replace(/^intermediate-/, '')
    .replace(/^end-/, '');

  const iconSize = 12;

  switch (baseEventType) {
    case 'timer':
      icon = `
        <circle cx="${cx}" cy="${cy}" r="${iconSize / 2}" fill="none" stroke="${stroke}" stroke-width="1"/>
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - iconSize / 3}" stroke="${stroke}" stroke-width="1"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + iconSize / 4}" y2="${cy - iconSize / 5}" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'message':
      icon = `
        <rect x="${cx - iconSize / 2}" y="${cy - iconSize / 3}" width="${iconSize}" height="${iconSize * 0.66}" fill="none" stroke="${stroke}" stroke-width="1"/>
        <path d="M ${cx - iconSize / 2} ${cy - iconSize / 3} L ${cx} ${cy} L ${cx + iconSize / 2} ${cy - iconSize / 3}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'error':
      icon = `
        <path d="M ${cx - 2} ${cy - iconSize / 2} L ${cx - 5} ${cy} L ${cx + 2} ${cy} L ${cx - 1} ${cy + iconSize / 2} L ${cx + 5} ${cy - 2} L ${cx - 2} ${cy - 2} Z"
              fill="${stroke}" stroke="none"/>`;
      break;

    case 'conditional':
      icon = `
        <line x1="${cx - iconSize / 2}" y1="${cy - iconSize / 3}" x2="${cx + iconSize / 2}" y2="${cy - iconSize / 3}" stroke="${stroke}" stroke-width="1"/>
        <line x1="${cx - iconSize / 2}" y1="${cy}" x2="${cx + iconSize / 2}" y2="${cy}" stroke="${stroke}" stroke-width="1"/>
        <line x1="${cx - iconSize / 2}" y1="${cy + iconSize / 3}" x2="${cx + iconSize / 2}" y2="${cy + iconSize / 3}" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'signal':
      icon = `
        <path d="M ${cx} ${cy - iconSize / 2} L ${cx + iconSize / 2} ${cy + iconSize / 2} L ${cx - iconSize / 2} ${cy + iconSize / 2} Z"
              fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'escalation':
      icon = `
        <path d="M ${cx} ${cy - iconSize / 2} L ${cx + iconSize / 2} ${cy + iconSize / 3} L ${cx + iconSize / 4} ${cy + iconSize / 3} L ${cx} ${cy - iconSize / 4} L ${cx - iconSize / 4} ${cy + iconSize / 3} L ${cx - iconSize / 2} ${cy + iconSize / 3} Z"
              fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'compensation':
      icon = `
        <path d="M ${cx} ${cy - iconSize / 2} L ${cx - iconSize / 3} ${cy} L ${cx} ${cy + iconSize / 2} Z" fill="none" stroke="${stroke}" stroke-width="1"/>
        <path d="M ${cx + iconSize / 3} ${cy - iconSize / 2} L ${cx} ${cy} L ${cx + iconSize / 3} ${cy + iconSize / 2} Z" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'cancel':
      icon = `
        <line x1="${cx - iconSize / 2}" y1="${cy - iconSize / 2}" x2="${cx + iconSize / 2}" y2="${cy + iconSize / 2}" stroke="${stroke}" stroke-width="1.5"/>
        <line x1="${cx + iconSize / 2}" y1="${cy - iconSize / 2}" x2="${cx - iconSize / 2}" y2="${cy + iconSize / 2}" stroke="${stroke}" stroke-width="1.5"/>`;
      break;

    case 'link':
      icon = `
        <line x1="${cx - iconSize / 2}" y1="${cy}" x2="${cx + iconSize / 3}" y2="${cy}" stroke="${stroke}" stroke-width="1.5"/>
        <path d="M ${cx + iconSize / 3} ${cy} L ${cx} ${cy - iconSize / 3} M ${cx + iconSize / 3} ${cy} L ${cx} ${cy + iconSize / 3}" stroke="${stroke}" stroke-width="1.5" fill="none"/>`;
      break;

    case 'terminate':
      icon = `<circle cx="${cx}" cy="${cy}" r="${iconSize / 2}" fill="${stroke}"/>`;
      break;

    case 'multiple':
      icon = `
        <path d="M ${cx} ${cy - iconSize / 2}
                 L ${cx + iconSize * 0.48} ${cy - iconSize * 0.15}
                 L ${cx + iconSize * 0.3} ${cy + iconSize / 2}
                 L ${cx - iconSize * 0.3} ${cy + iconSize / 2}
                 L ${cx - iconSize * 0.48} ${cy - iconSize * 0.15}
                 Z"
              fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;

    case 'parallelMultiple':
      icon = `
        <line x1="${cx - iconSize / 2}" y1="${cy}" x2="${cx + iconSize / 2}" y2="${cy}" stroke="${stroke}" stroke-width="1.2"/>
        <line x1="${cx}" y1="${cy - iconSize / 2}" x2="${cx}" y2="${cy + iconSize / 2}" stroke="${stroke}" stroke-width="1.2"/>
        <line x1="${cx - iconSize * 0.35}" y1="${cy - iconSize * 0.35}" x2="${cx + iconSize * 0.35}" y2="${cy + iconSize * 0.35}" stroke="${stroke}" stroke-width="1.2"/>
        <line x1="${cx + iconSize * 0.35}" y1="${cy - iconSize * 0.35}" x2="${cx - iconSize * 0.35}" y2="${cy + iconSize * 0.35}" stroke="${stroke}" stroke-width="1.2"/>`;
      break;
  }

  svg += icon;

  if (!options.suppressLabel && ctx.node.label) {
    const textY = y + bounds.height + 16;
    const labelStyle = {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) * 0.85,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label,
      cx,
      textY
    );
  }

  return svg;
}

/**
 * BPMN Event shape - represents something that happens during a process.
 * Can be start (single circle), intermediate (double circle), or end (thick circle).
 */
export const bpmnEventShape: ShapeDefinition = {
  id: 'bpmnEvent',

  bounds() {
    return getBpmnEventBounds();
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const radius = bounds.width / 2;

    return [
      { x: radius, y: 0, name: 'top' },
      { x: bounds.width, y: radius, name: 'right' },
      { x: radius, y: bounds.height, name: 'bottom' },
      { x: 0, y: radius, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    return renderBpmnEventSvg(ctx, position);
  },
};
