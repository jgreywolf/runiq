import type {
  DiagramAst,
  LaidOutDiagram,
  PositionedNode,
  RoutedEdge,
} from '@runiq/core';

export interface LatexResult {
  latex: string;
  warnings: string[];
}

const PX_TO_CM = 0.0254; // 1 pixel ≈ 0.0254 cm (at 100 DPI)

/**
 * Convert a Control system block diagram with layout to LaTeX/TikZ format
 */
export function toLatex(
  diagram: DiagramAst,
  layout: LaidOutDiagram
): LatexResult {
  const warnings: string[] = [];
  const parts: string[] = [];

  // Generate document preamble
  parts.push(generatePreamble());

  // Generate TikZ picture opening
  parts.push('\\begin{tikzpicture}[auto, node distance=2cm, >=Stealth]\n');

  // Generate nodes
  for (const positioned of layout.nodes) {
    const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
    if (!nodeAst) {
      warnings.push(`Node ${positioned.id} not found in diagram`);
      continue;
    }

    const nodeTikz = generateNode(nodeAst, positioned, warnings);
    if (nodeTikz) {
      parts.push(nodeTikz);
    }
  }

  // Generate edges
  for (const routedEdge of layout.edges) {
    const edgeAst = diagram.edges.find(
      (e) => e.from === routedEdge.from && e.to === routedEdge.to
    );
    const edgeTikz = generateEdge(routedEdge, edgeAst, warnings);
    if (edgeTikz) {
      parts.push(edgeTikz);
    }
  }

  // Close TikZ picture
  parts.push('\\end{tikzpicture}\n');

  // Close document
  parts.push('\\end{document}');

  return {
    latex: parts.join('\n'),
    warnings,
  };
}

function generatePreamble(): string {
  return `\\documentclass[tikz,border=2mm]{standalone}
\\usepackage{tikz}
\\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}

% TikZ styles for block diagrams
\\tikzset{
  block/.style={
    rectangle,
    draw,
    fill=white,
    text centered,
    minimum width=2cm,
    minimum height=1cm
  },
  gain/.style={
    regular polygon,
    regular polygon sides=3,
    draw,
    fill=white,
    text centered,
    minimum width=1cm
  },
  sum/.style={
    circle,
    draw,
    fill=white,
    minimum size=0.8cm,
    inner sep=0pt
  },
  arrow/.style={
    thick,
    ->,
    >=Stealth
  }
}

\\begin{document}
`;
}

function generateNode(
  nodeAst: { id: string; shape: string; label?: string },
  positioned: PositionedNode,
  warnings: string[]
): string {
  const x = positioned.x * PX_TO_CM;
  const y = positioned.y * PX_TO_CM;

  const label = nodeAst.label || nodeAst.id;
  const formattedLabel = formatLabel(label, nodeAst.shape);

  // Map shape to TikZ style
  const style = getShapeStyle(nodeAst.shape, warnings);

  return `  \\node[${style}] (${nodeAst.id}) at (${x.toFixed(2)}cm,${y.toFixed(2)}cm) {${formattedLabel}};`;
}

function getShapeStyle(shape: string, warnings: string[]): string {
  // Block diagram shapes
  const shapeMap: Record<string, string> = {
    'transfer-fn': 'block',
    gain: 'gain',
    integrator: 'block,fill=blue!10',
    differentiator: 'block,fill=orange!10',
    'time-delay': 'block,fill=pink!10',
    saturation: 'block,fill=yellow!10',
    'compare-junction': 'sum',
    'multiply-junction': 'sum',
    'divide-junction': 'sum',
    // Flowchart shapes
    rounded: 'block,rounded corners',
    rhombus: 'block,diamond',
    terminal: 'block,rounded corners,fill=gray!10',
  };

  if (shape in shapeMap) {
    return shapeMap[shape];
  }

  warnings.push(`Unsupported shape: ${shape} - using default block style`);
  return 'block';
}

function formatLabel(label: string, _shape: string): string {
  // Wrap in math mode
  let formatted = label;

  // Convert fractions (e.g., "K/(s+1)" → "\frac{K}{s+1}")
  // Match: numerator / denominator (denominator may be in parens)
  formatted = formatted.replace(/([^/]+)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
  formatted = formatted.replace(/([^/]+)\/([^/\s]+)/g, '\\frac{$1}{$2}');

  // Wrap in $ for math mode
  if (!formatted.startsWith('$')) {
    formatted = `$${formatted}$`;
  }

  return formatted;
}

function generateEdge(
  routedEdge: RoutedEdge,
  edgeAst: { from: string; to: string; label?: string } | undefined,
  _warnings: string[]
): string {
  const label = edgeAst?.label || '';
  const labelPart = label ? ` node[above] {$${label}$}` : '';

  return `  \\draw[->,>=Stealth] (${routedEdge.from}) -- (${routedEdge.to})${labelPart};`;
}
