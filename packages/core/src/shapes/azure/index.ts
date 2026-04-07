import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

type AzureGlyphRenderer = (
  ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) => string;

function getSharedBounds(ctx: ShapeRenderContext) {
  const iconSize = 64;
  const padding = ctx.style.padding || 12;
  const labelHeight = ctx.node.label ? ctx.style.fontSize || 14 : 0;
  const spacing = ctx.node.label ? 10 : 0;

  const textMeasure = ctx.node.label
    ? ctx.measureText(ctx.node.label, ctx.style)
    : { width: 0, height: 0 };

  return {
    width: Math.max(iconSize, textMeasure.width) + padding * 2,
    height: iconSize + spacing + labelHeight + padding * 2,
  };
}

function renderLabel(
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  color: string
) {
  if (!ctx.node.label) {
    return '';
  }

  const padding = ctx.style.padding || 12;
  const labelY = position.y + padding + 64 + 14 + (ctx.style.fontSize || 14);
  const labelStyle = { ...ctx.style, color };

  return renderShapeLabel(
    { ...ctx, style: labelStyle },
    ctx.node.label,
    position.x + bounds.width / 2,
    labelY
  );
}

function createAzureShape(
  id: string,
  colors: { fill: string; stroke: string; accent?: string },
  renderGlyph: AzureGlyphRenderer
): ShapeDefinition {
  return {
    id,

    bounds(ctx: ShapeRenderContext) {
      return getSharedBounds(ctx);
    },

    anchors(ctx: ShapeRenderContext) {
      return calculateRectangularAnchors(ctx, this.bounds(ctx));
    },

    render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
      const bounds = this.bounds(ctx);
      const padding = ctx.style.padding || 12;
      const size = 64;
      const x = position.x + (bounds.width - size) / 2;
      const y = position.y + padding;
      const fill = (ctx.node.data?.fillColor as string) || colors.fill;
      const stroke = (ctx.node.data?.strokeColor as string) || colors.stroke;
      const accent = (ctx.node.data?.accentColor as string) || colors.accent || '#ffffff';
      const textColor = (ctx.node.data?.textColor as string) || stroke;

      return `<g>
        ${renderGlyph(ctx, { x, y, size }, { fill, stroke, accent })}
        ${renderLabel(ctx, position, bounds, textColor)}
      </g>`;
    },
  };
}

function renderVmGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y, size } = box;
  const w = size;
  const h = size * 0.72;
  const screenY = y + 6;
  const baseY = screenY + h + 3;
  return `
    <rect x="${x + 6}" y="${screenY}" width="${w - 12}" height="${h - 10}" rx="8" ry="8"
          fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <rect x="${x + 14}" y="${screenY + 10}" width="${w - 28}" height="${h - 28}" rx="4" ry="4"
          fill="${colors.accent}" opacity="0.22"/>
    <rect x="${x + 26}" y="${baseY}" width="${w - 52}" height="6" rx="3" ry="3" fill="${colors.stroke}"/>
    <rect x="${x + 18}" y="${baseY + 8}" width="${w - 36}" height="4" rx="2" ry="2" fill="${colors.fill}" opacity="0.75"/>
  `;
}

function renderBlobGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y, size } = box;
  const cx = x + size / 2;
  return `
    <ellipse cx="${cx}" cy="${y + 18}" rx="18" ry="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <rect x="${cx - 18}" y="${y + 18}" width="36" height="24" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${y + 42}" rx="18" ry="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <circle cx="${x + 48}" cy="${y + 22}" r="7" fill="${colors.accent}" opacity="0.9"/>
    <circle cx="${x + 54}" cy="${y + 30}" r="5" fill="${colors.accent}" opacity="0.7"/>
  `;
}

function renderFunctionsGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y, size } = box;
  const left = x + 14;
  const right = x + size - 14;
  const midX = x + size / 2;
  return `
    <path d="M ${left} ${y + 18} L ${left + 10} ${y + 18} L ${left + 6} ${y + 30} L ${left + 14} ${y + 30}" fill="none" stroke="${colors.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${right} ${y + 18} L ${right - 10} ${y + 18} L ${right - 6} ${y + 30} L ${right - 14} ${y + 30}" fill="none" stroke="${colors.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${midX + 2} ${y + 10} L ${midX - 8} ${y + 28} L ${midX + 1} ${y + 28} L ${midX - 4} ${y + 46} L ${midX + 12} ${y + 24} L ${midX + 2} ${y + 24} Z"
          fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2" stroke-linejoin="round"/>
  `;
}

function renderSqlGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y, size } = box;
  const cx = x + size / 2;
  return `
    <ellipse cx="${cx}" cy="${y + 16}" rx="18" ry="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <rect x="${cx - 18}" y="${y + 16}" width="36" height="28" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${y + 44}" rx="18" ry="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${y + 30}" rx="18" ry="8" fill="${colors.accent}" opacity="0.18"/>
  `;
}

function renderVNetGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y, size } = box;
  const points = [
    [x + 32, y + 10],
    [x + 49, y + 20],
    [x + 49, y + 40],
    [x + 32, y + 50],
    [x + 15, y + 40],
    [x + 15, y + 20],
  ];
  return `
    <polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${colors.stroke}" stroke-width="3"/>
    <line x1="${x + 32}" y1="${y + 10}" x2="${x + 32}" y2="${y + 50}" stroke="${colors.fill}" stroke-width="2"/>
    <line x1="${x + 15}" y1="${y + 20}" x2="${x + 49}" y2="${y + 40}" stroke="${colors.fill}" stroke-width="2"/>
    <line x1="${x + 49}" y1="${y + 20}" x2="${x + 15}" y2="${y + 40}" stroke="${colors.fill}" stroke-width="2"/>
    ${[
      [x + 32, y + 10],
      [x + 49, y + 20],
      [x + 49, y + 40],
      [x + 32, y + 50],
      [x + 15, y + 40],
      [x + 15, y + 20],
    ]
      .map(
        ([cx, cy]) =>
          `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5"/>`
      )
      .join('')}
  `;
}

function renderApiGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y } = box;
  return `
    <path d="M ${x + 18} ${y + 18} L ${x + 10} ${y + 30} L ${x + 18} ${y + 42}" fill="none" stroke="${colors.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${x + 46} ${y + 18} L ${x + 54} ${y + 30} L ${x + 46} ${y + 42}" fill="none" stroke="${colors.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="${x + 22}" y="${y + 20}" width="20" height="20" rx="6" ry="6" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <line x1="${x + 28}" y1="${y + 30}" x2="${x + 36}" y2="${y + 30}" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
  `;
}

function renderCdnGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y } = box;
  const cx = x + 32;
  const cy = y + 30;
  return `
    <circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="${colors.stroke}" stroke-width="3"/>
    <ellipse cx="${cx}" cy="${cy}" rx="9" ry="16" fill="none" stroke="${colors.fill}" stroke-width="2"/>
    <line x1="${cx - 16}" y1="${cy}" x2="${cx + 16}" y2="${cy}" stroke="${colors.fill}" stroke-width="2"/>
    <path d="M ${cx - 11} ${cy - 9} Q ${cx} ${cy - 15} ${cx + 11} ${cy - 9}" fill="none" stroke="${colors.fill}" stroke-width="2"/>
    <path d="M ${cx - 11} ${cy + 9} Q ${cx} ${cy + 15} ${cx + 11} ${cy + 9}" fill="none" stroke="${colors.fill}" stroke-width="2"/>
    <path d="M ${x + 47} ${y + 12} L ${x + 55} ${y + 18} L ${x + 47} ${y + 24}" fill="none" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

function renderCosmosGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y } = box;
  const cx = x + 32;
  const cy = y + 30;
  return `
    <circle cx="${cx}" cy="${cy}" r="9" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${cy}" rx="20" ry="8" fill="none" stroke="${colors.stroke}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${cy}" rx="20" ry="8" fill="none" stroke="${colors.fill}" stroke-width="2" transform="rotate(60 ${cx} ${cy})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="20" ry="8" fill="none" stroke="${colors.accent}" stroke-width="2" transform="rotate(-60 ${cx} ${cy})"/>
  `;
}

function renderServiceBusGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y } = box;
  return `
    <rect x="${x + 10}" y="${y + 18}" width="14" height="12" rx="3" ry="3" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <rect x="${x + 40}" y="${y + 18}" width="14" height="12" rx="3" ry="3" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <rect x="${x + 25}" y="${y + 34}" width="14" height="12" rx="3" ry="3" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <path d="M ${x + 24} ${y + 24} L ${x + 40} ${y + 24}" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${x + 32} ${y + 30} L ${x + 32} ${y + 34}" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${x + 24} ${y + 24} L ${x + 28} ${y + 20}" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${x + 40} ${y + 24} L ${x + 36} ${y + 20}" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
  `;
}

function renderEntraGlyph(
  _ctx: ShapeRenderContext,
  box: { x: number; y: number; size: number },
  colors: { fill: string; stroke: string; accent: string }
) {
  const { x, y } = box;
  return `
    <path d="M ${x + 16} ${y + 32} L ${x + 28} ${y + 14} L ${x + 40} ${y + 32} L ${x + 28} ${y + 50} Z"
          fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2"/>
    <circle cx="${x + 40}" cy="${y + 24}" r="10" fill="none" stroke="${colors.accent}" stroke-width="3"/>
    <circle cx="${x + 40}" cy="${y + 24}" r="3" fill="${colors.accent}"/>
  `;
}

export const azureVmShape = createAzureShape(
  'azureVm',
  { fill: '#0078D4', stroke: '#005A9C', accent: '#ffffff' },
  renderVmGlyph
);
export const azureBlobStorageShape = createAzureShape(
  'azureBlobStorage',
  { fill: '#00BCF2', stroke: '#0078D4', accent: '#7FE7FF' },
  renderBlobGlyph
);
export const azureFunctionsShape = createAzureShape(
  'azureFunctions',
  { fill: '#0063B1', stroke: '#004578', accent: '#00BCF2' },
  renderFunctionsGlyph
);
export const azureSqlDatabaseShape = createAzureShape(
  'azureSqlDatabase',
  { fill: '#185ABD', stroke: '#0F3E83', accent: '#8EC5FF' },
  renderSqlGlyph
);
export const azureVirtualNetworkShape = createAzureShape(
  'azureVirtualNetwork',
  { fill: '#5C2D91', stroke: '#3B1466', accent: '#C6A7FF' },
  renderVNetGlyph
);
export const azureApiManagementShape = createAzureShape(
  'azureApiManagement',
  { fill: '#0078D4', stroke: '#005A9C', accent: '#50E6FF' },
  renderApiGlyph
);
export const azureCdnShape = createAzureShape(
  'azureCdn',
  { fill: '#00B7C3', stroke: '#007A85', accent: '#B4F1F6' },
  renderCdnGlyph
);
export const azureCosmosDbShape = createAzureShape(
  'azureCosmosDb',
  { fill: '#881798', stroke: '#5C1269', accent: '#D59BE6' },
  renderCosmosGlyph
);
export const azureServiceBusShape = createAzureShape(
  'azureServiceBus',
  { fill: '#038387', stroke: '#005E60', accent: '#9BF5F7' },
  renderServiceBusGlyph
);
export const azureEntraIdShape = createAzureShape(
  'azureEntraId',
  { fill: '#2560E0', stroke: '#143AA2', accent: '#8FB1FF' },
  renderEntraGlyph
);

function createAzureContainerShape(
  id: string,
  options: {
    fill: string;
    stroke: string;
    icon: string;
    badge: string;
    dashed?: boolean;
  }
): ShapeDefinition {
  return {
    id,

    bounds(ctx: ShapeRenderContext) {
      const data = ctx.node.data as { width?: number; height?: number } | undefined;
      if (data?.width && data?.height) {
        return { width: data.width, height: data.height };
      }
      return { width: 420, height: 280 };
    },

    anchors(ctx: ShapeRenderContext) {
      return calculateRectangularAnchors(ctx, this.bounds(ctx));
    },

    render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
      const bounds = this.bounds(ctx);
      const fill = (ctx.node.data?.fillColor as string) || options.fill;
      const stroke = (ctx.node.data?.strokeColor as string) || options.stroke;
      const textColor = (ctx.node.data?.textColor as string) || stroke;
      const dash = options.dashed ? ' stroke-dasharray="10 6"' : '';
      const headerHeight = 42;

      return `<g>
        <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}"
              rx="12" ry="12" fill="${fill}" stroke="${stroke}" stroke-width="2"${dash}/>
        <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${headerHeight}"
              rx="12" ry="12" fill="${stroke}" opacity="0.12"/>
        <rect x="${position.x + 14}" y="${position.y + 10}" width="24" height="24" rx="6" ry="6"
              fill="${stroke}" opacity="0.18" stroke="${stroke}" stroke-width="1.5"/>
        <text x="${position.x + 26}" y="${position.y + 22}" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="${stroke}">${options.icon}</text>
        <text x="${position.x + 48}" y="${position.y + 23}" dominant-baseline="middle"
              font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${ctx.node.label || ctx.node.id}</text>
        <text x="${position.x + bounds.width - 16}" y="${position.y + 23}" dominant-baseline="middle" text-anchor="end"
              font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="${stroke}">${options.badge}</text>
      </g>`;
    },
  };
}

export const azureResourceGroupShape = createAzureContainerShape('azureResourceGroup', {
  fill: '#F3F8FF',
  stroke: '#0078D4',
  icon: 'RG',
  badge: 'Resource Group',
  dashed: true,
});

export const azureSubscriptionShape = createAzureContainerShape('azureSubscription', {
  fill: '#EEF3FF',
  stroke: '#2560E0',
  icon: 'S',
  badge: 'Subscription',
});
