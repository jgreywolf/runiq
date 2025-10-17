import type {
  DiagramAst,
  LaidOutDiagram,
  PositionedNode,
  RoutedEdge,
} from '@runiq/core';

export interface SimulinkResult {
  mdl: string;
  warnings: string[];
}

let blockCounter = 0;

/**
 * Convert a block diagram with layout to Simulink MDL format
 */
export function toSimulink(
  diagram: DiagramAst,
  layout: LaidOutDiagram
): SimulinkResult {
  const warnings: string[] = [];
  const parts: string[] = [];
  blockCounter = 0;

  // Generate Model header
  parts.push(generateModelHeader());

  // Generate System block
  parts.push('  System {');
  parts.push('    Name\t\t"untitled"');
  parts.push('    Location\t\t[0, 0, 800, 600]');
  parts.push('');

  // Generate blocks
  for (const positioned of layout.nodes) {
    const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
    if (!nodeAst) {
      warnings.push(`Node ${positioned.id} not found in diagram`);
      continue;
    }

    const blockMdl = generateBlock(nodeAst, positioned, warnings);
    if (blockMdl) {
      parts.push(blockMdl);
    }
  }

  // Generate connections (Lines)
  const portMap = new Map<string, number>();
  layout.nodes.forEach((node) => {
    portMap.set(node.id, 1); // Each block has at least 1 output port
  });

  for (const routedEdge of layout.edges) {
    const lineMdl = generateLine(routedEdge, warnings);
    if (lineMdl) {
      parts.push(lineMdl);
    }
  }

  // Close System and Model
  parts.push('  }');
  parts.push('}');

  return {
    mdl: parts.join('\n'),
    warnings,
  };
}

function generateModelHeader(): string {
  return `Model {
  Name\t\t"untitled"
  Version\t\t"7.6"
  SavedCharacterEncoding\t"UTF-8"
  SampleTimeColors\toff
  LibraryLinkDisplay\t"none"
  WideLines\t\toff
  ShowLineDimensions\toff
  ShowPortDataTypes\toff
  ShowLoopsOnError\ton
  IgnoreBidirectionalLines\toff
  Created\t\t"${new Date().toISOString()}"
  Creator\t\t"Runiq"`;
}

function generateBlock(
  nodeAst: { id: string; shape: string; label?: string },
  positioned: PositionedNode,
  warnings: string[]
): string {
  const sid = ++blockCounter;
  const parts: string[] = [];

  // Position: [left, top, right, bottom]
  const pos = [
    Math.round(positioned.x),
    Math.round(positioned.y),
    Math.round(positioned.x + positioned.width),
    Math.round(positioned.y + positioned.height),
  ];

  parts.push('    Block {');
  parts.push(`      BlockType\t\t"${getBlockType(nodeAst.shape, warnings)}"`);
  parts.push(`      Name\t\t"${nodeAst.id}"`);

  // Add shape-specific parameters
  const params = getBlockParameters(nodeAst, warnings);
  for (const [key, value] of Object.entries(params)) {
    parts.push(`      ${key}\t\t${value}`);
  }

  parts.push(`      Position\t\t[${pos.join(', ')}]`);
  parts.push(`      SID\t\t"${sid}"`);
  parts.push('    }');

  return parts.join('\n');
}

function getBlockType(shape: string, warnings: string[]): string {
  const blockTypeMap: Record<string, string> = {
    'transfer-fn': 'TransferFcn',
    gain: 'Gain',
    integrator: 'Integrator',
    differentiator: 'Derivative',
    'time-delay': 'TransportDelay',
    saturation: 'Saturate',
    'compare-junction': 'Sum',
    'multiply-junction': 'Product',
    'divide-junction': 'Product',
  };

  if (shape in blockTypeMap) {
    return blockTypeMap[shape];
  }

  warnings.push(`Unsupported shape: ${shape} - using Gain block as fallback`);
  return 'Gain';
}

function getBlockParameters(
  nodeAst: { id: string; shape: string; label?: string },
  warnings: string[]
): Record<string, string> {
  const params: Record<string, string> = {};

  switch (nodeAst.shape) {
    case 'transfer-fn':
      // Parse transfer function from label (e.g., "1/(s+1)" → num=[1], den=[1 1])
      if (nodeAst.label) {
        const tfParams = parseTransferFunction(nodeAst.label, warnings);
        params['Numerator'] = `"${tfParams.numerator}"`;
        params['Denominator'] = `"${tfParams.denominator}"`;
      } else {
        params['Numerator'] = '"[1]"';
        params['Denominator'] = '"[1]"';
      }
      break;

    case 'gain':
      // Parse gain value from label (e.g., "K=10" → 10)
      if (nodeAst.label) {
        const gainValue = parseGain(nodeAst.label);
        params['Gain'] = `"${gainValue}"`;
      } else {
        params['Gain'] = '"1"';
      }
      break;

    case 'compare-junction':
      // Parse operators from label (e.g., "+-" → "+-")
      if (nodeAst.label) {
        params['Inputs'] = `"${nodeAst.label}"`;
      } else {
        params['Inputs'] = '"++"';
      }
      break;

    case 'multiply-junction':
      params['Inputs'] = '"**"'; // Two multiply inputs
      break;

    case 'divide-junction':
      params['Inputs'] = '"*/"'; // Multiply then divide
      break;

    case 'time-delay':
      params['DelayTime'] = '"1"';
      break;

    case 'saturation':
      params['UpperLimit'] = '"1"';
      params['LowerLimit'] = '"-1"';
      break;
  }

  return params;
}

function parseTransferFunction(
  label: string,
  _warnings: string[]
): { numerator: string; denominator: string } {
  // Try to parse "num/den" format
  const match = label.match(/^(.+)\/(.+)$/);
  if (!match) {
    // If no fraction, treat as generic transfer function
    return { numerator: '[1]', denominator: '[1]' };
  }

  const num = match[1].trim();
  const den = match[2].trim();

  // Convert polynomial notation to MATLAB array notation
  // e.g., "s+1" → "[1 1]", "s^2+3s+2" → "[1 3 2]"
  const numArray = polynomialToArray(num);
  const denArray = polynomialToArray(den);

  return {
    numerator: numArray,
    denominator: denArray,
  };
}

function polynomialToArray(poly: string): string {
  // Remove parentheses
  poly = poly.replace(/[()]/g, '');

  // Simple heuristic: if it's just a number, return it
  if (/^-?\d+(\.\d+)?$/.test(poly)) {
    return `[${poly}]`;
  }

  // If it contains 's', try to parse polynomial
  // This is a simplified parser - real implementation would need proper parsing
  if (poly.includes('s')) {
    // "s+1" → [1, 1]
    // "s^2+3s+2" → [1, 3, 2]
    // For now, return a placeholder that needs manual adjustment
    return '[1 1]'; // Default first-order
  }

  return `[${poly}]`;
}

function parseGain(label: string): string {
  // Try to extract number from "K=10", "Gain=5", or just "10"
  const match = label.match(/[=:]?\s*(-?\d+(\.\d+)?)/);
  return match ? match[1] : '1';
}

function generateLine(routedEdge: RoutedEdge, _warnings: string[]): string {
  const parts: string[] = [];

  parts.push('    Line {');
  parts.push(`      SrcBlock\t\t"${routedEdge.from}"`);
  parts.push(`      SrcPort\t\t1`);
  parts.push(`      DstBlock\t\t"${routedEdge.to}"`);
  parts.push(`      DstPort\t\t1`);
  parts.push('    }');

  return parts.join('\n');
}
