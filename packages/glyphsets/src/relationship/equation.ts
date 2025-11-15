import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Equation Glyphset - A + B = C relationship
 * Shows mathematical or logical relationships between concepts
 */
export const equationGlyphSet: GlyphSetDefinition = {
  id: 'equation',
  name: 'Equation',
  category: 'relationship',
  description:
    'Mathematical equation format (A + B = C) showing how inputs combine to produce an output',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'operator',
      type: 'string',
      required: false,
      default: '+',
      description: 'Operator symbol (+, -, ×, ÷)',
    },
  ],
  minItems: 3,
  maxItems: 5,
  generator: (params) => {
    const inputs = (params.inputs as string[]) || [];
    const outputs = (params.outputs as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const operator = (params.operator as string) || '+';

    // Combine inputs and outputs into items array for rendering
    const items = [...inputs, ...(outputs.length > 0 ? outputs : ['Result'])];

    if (items.length < 3) {
      throw new GlyphSetError(
        'equation',
        `Equation requires at least 2 inputs and 1 output, got ${inputs.length} input(s) and ${outputs.length} output(s)`
      );
    }

    // Last item is the output, rest are inputs
    const input = items.slice(0, -1);
    const output = items[items.length - 1];
    const colors = items.map((_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'equation',
          shape: 'equation',
          label: '',
          data: {
            input,
            output,
            operator,
            colors,
          },
        },
      ],
      edges: [],
    };
  },
};
