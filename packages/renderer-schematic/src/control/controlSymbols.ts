import { createSymbol, type SymbolDefinition } from '../symbol.js';

const stroke = 'currentColor';
const strokeWidth = 2;

export const contactNO: SymbolDefinition = createSymbol(
  'CONTACT_NO',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const gap = 12;
    const barTop = cy - 8;
    const barBottom = cy + 8;

    return `
      <line x1="${left}" y1="${cy}" x2="${cx - gap}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + gap}" y1="${cy}" x2="${right}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - gap}" y1="${barTop}" x2="${cx - gap}" y2="${barBottom}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + gap}" y1="${barTop}" x2="${cx + gap}" y2="${barBottom}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    `;
  }
);

export const contactNC: SymbolDefinition = createSymbol(
  'CONTACT_NC',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => {
    const left = cx - 30;
    const right = cx + 30;
    const gap = 12;
    const barTop = cy - 8;
    const barBottom = cy + 8;

    return `
      <line x1="${left}" y1="${cy}" x2="${cx - gap}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + gap}" y1="${cy}" x2="${right}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - gap}" y1="${barTop}" x2="${cx - gap}" y2="${barBottom}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + gap}" y1="${barTop}" x2="${cx + gap}" y2="${barBottom}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - gap - 2}" y1="${barBottom}" x2="${cx + gap + 2}" y2="${barTop}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    `;
  }
);

export const coil: SymbolDefinition = createSymbol(
  'COIL',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => `
      <line x1="${cx - 30}" y1="${cy}" x2="${cx - 12}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + 12}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${cx}" cy="${cy}" r="8" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" />
    `
);

export const setCoil: SymbolDefinition = createSymbol(
  'SET_COIL',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => `
      <line x1="${cx - 30}" y1="${cy}" x2="${cx - 12}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + 12}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${cx}" cy="${cy}" r="8" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" />
      <text x="${cx}" y="${cy}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="${stroke}">S</text>
    `
);

export const resetCoil: SymbolDefinition = createSymbol(
  'RESET_COIL',
  60,
  20,
  [
    { x: 0, y: 10, name: 'left' },
    { x: 60, y: 10, name: 'right' },
  ],
  (cx, cy) => `
      <line x1="${cx - 30}" y1="${cy}" x2="${cx - 12}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + 12}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${cx}" cy="${cy}" r="8" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" />
      <text x="${cx}" y="${cy}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="${stroke}">R</text>
    `
);

export const timerOn: SymbolDefinition = createSymbol(
  'TIMER_ON',
  80,
  30,
  [
    { x: 0, y: 15, name: 'left' },
    { x: 80, y: 15, name: 'right' },
  ],
  (cx, cy) => `
      <rect x="${cx - 30}" y="${cy - 12}" width="60" height="24" rx="3" ry="3" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" />
      <text x="${cx}" y="${cy}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="${stroke}">TON</text>
    `
);
