import { createSymbol, SymbolDefinition } from '../symbol.js';
import {
  renderCircleBody,
  renderRectangleBody,
  renderHorizontalConnectionLines,
  styleAttrs,
} from '../symbol-utils.js';

const STANDARD_WIDTH = 80;
const STANDARD_HEIGHT = 40;
const STANDARD_TERMINALS = [
  { x: 0, y: STANDARD_HEIGHT / 2, name: 'in' },
  { x: STANDARD_WIDTH, y: STANDARD_HEIGHT / 2, name: 'out' },
];

function rectSymbol(
  id: string,
  label: string,
  terminals = STANDARD_TERMINALS
): SymbolDefinition {
  return createSymbol(id, STANDARD_WIDTH, STANDARD_HEIGHT, terminals, (cx, cy) => {
    const width = STANDARD_WIDTH - 6;
    const height = STANDARD_HEIGHT - 6;
    return `
      ${renderRectangleBody(cx, cy, width, height)}
      <text x="${cx}" y="${cy + 4}" font-family="sans-serif" font-size="10" text-anchor="middle">${label}</text>
    `;
  });
}

function ductSymbol(id: string, label: string): SymbolDefinition {
  return createSymbol(id, STANDARD_WIDTH, STANDARD_HEIGHT, STANDARD_TERMINALS, (cx, cy) => {
    const width = STANDARD_WIDTH - 6;
    const height = STANDARD_HEIGHT - 6;
    const x = cx - width / 2;
    const y = cy - height / 2;
    const arrowStart = x + 10;
    const arrowEnd = x + width - 10;
    const arrowY = cy;
    const arrowHead = `${arrowEnd - 6},${arrowY - 4} ${arrowEnd},${arrowY} ${arrowEnd - 6},${arrowY + 4}`;
    return `
      ${renderRectangleBody(cx, cy, width, height)}
      <line x1="${arrowStart}" y1="${arrowY}" x2="${arrowEnd}" y2="${arrowY}" ${styleAttrs()} />
      <polygon points="${arrowHead}" ${styleAttrs({ fillColor: 'currentColor' })} />
      <text x="${cx}" y="${y + height - 6}" font-family="sans-serif" font-size="9" text-anchor="middle">${label}</text>
    `;
  });
}

function coilSymbol(id: string, label: string): SymbolDefinition {
  return createSymbol(id, STANDARD_WIDTH, STANDARD_HEIGHT, STANDARD_TERMINALS, (cx, cy) => {
    const width = STANDARD_WIDTH - 6;
    const height = STANDARD_HEIGHT - 6;
    const x = cx - width / 2;
    const y = cy - height / 2;
    return `
      ${renderRectangleBody(cx, cy, width, height)}
      <path d="M ${x + 10} ${cy} q 6 -8 12 0 t 12 0 t 12 0 t 12 0" ${styleAttrs()} />
      <text x="${cx}" y="${y + height - 6}" font-family="sans-serif" font-size="9" text-anchor="middle">${label}</text>
    `;
  });
}

function fanSymbol(id: string, label: string): SymbolDefinition {
  return createSymbol(id, STANDARD_WIDTH, STANDARD_HEIGHT, STANDARD_TERMINALS, (cx, cy) => {
    const radius = 12;
    return `
      ${renderCircleBody(cx, cy, radius)}
      ${renderHorizontalConnectionLines(cx, cy, radius, 10)}
      <path d="M ${cx - 3} ${cy - 6} L ${cx + 6} ${cy} L ${cx - 3} ${cy + 6} Z" ${styleAttrs({
        fillColor: 'currentColor',
      })}/>
      <text x="${cx}" y="${cy + 22}" font-family="sans-serif" font-size="9" text-anchor="middle">${label}</text>
    `;
  });
}

function sensorSymbol(id: string, label: string): SymbolDefinition {
  return createSymbol(id, 40, 40, [{ x: 0, y: 20, name: 'sense' }], (cx, cy) => {
    return `
      ${renderCircleBody(cx, cy, 12)}
      <text x="${cx}" y="${cy + 4}" font-family="sans-serif" font-size="9" text-anchor="middle">${label}</text>
    `;
  });
}

export const airHandlingUnit = rectSymbol('AIR_HANDLING_UNIT', 'AHU');
export const supplyFan = fanSymbol('SUPPLY_FAN', 'SF');
export const returnFan = fanSymbol('RETURN_FAN', 'RF');
export const exhaustFan = fanSymbol('EXHAUST_FAN', 'EF');
export const filter = rectSymbol('FILTER', 'FILT');
export const heatingCoil = coilSymbol('HEATING_COIL', 'HEAT');
export const coolingCoil = coilSymbol('COOLING_COIL', 'COOL');
export const humidifier = rectSymbol('HUMIDIFIER', 'HUM');
export const dehumidifier = rectSymbol('DEHUMIDIFIER', 'DEHUM');
export const vavBox = rectSymbol('VAV_BOX', 'VAV');
export const diffuserSupply = rectSymbol('DIFFUSER_SUPPLY', 'DIFF');
export const diffuserReturn = rectSymbol('DIFFUSER_RETURN', 'DIFF');
export const damperMotorized = rectSymbol('DAMPER_MOTORIZED', 'DM');
export const damperManual = rectSymbol('DAMPER_MANUAL', 'D');
export const damperFire = rectSymbol('DAMPER_FIRE', 'FD');
export const thermostat = sensorSymbol('THERMOSTAT', 'T');
export const temperatureSensor = sensorSymbol('TEMPERATURE_SENSOR', 'TS');
export const pressureSensor = sensorSymbol('PRESSURE_SENSOR', 'PS');
export const chiller = rectSymbol('CHILLER', 'CHLR');
export const boiler = rectSymbol('BOILER', 'BLR');
export const coolingTower = rectSymbol('COOLING_TOWER', 'CT');
export const pump = rectSymbol('PUMP', 'P');
export const heatExchanger = rectSymbol('HEAT_EXCHANGER', 'HX');
export const ductSupply = ductSymbol('DUCT_SUPPLY', 'SUP');
export const ductReturn = ductSymbol('DUCT_RETURN', 'RET');
export const ductExhaust = ductSymbol('DUCT_EXHAUST', 'EXH');
