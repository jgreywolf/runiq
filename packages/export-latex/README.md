# @runiq/export-latex

LaTeX/TikZ exporter for Runiq block diagrams

## Features

- ✅ Exports block diagrams to LaTeX/TikZ format
- ✅ Generates standalone LaTeX documents ready to compile
- ✅ Converts transfer functions to LaTeX fractions (`\frac{num}{den}`)
- ✅ Supports all block diagram shapes (transfer functions, gains, integrators, etc.)
- ✅ Automatic positioning from layout information
- ✅ Color-coded blocks (integrator=blue, differentiator=orange, etc.)
- ✅ Professional control system diagrams for academic papers

## Installation

```bash
pnpm add @runiq/export-latex
```

## Usage

```typescript
import { toLatex } from '@runiq/export-latex';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

// Your diagram and layout from parser + layout engine
const diagram: DiagramAst = { /* ... */ };
const layout: LaidOutDiagram = { /* ... */ };

// Export to LaTeX
const result = toLatex(diagram, layout);

// result.latex contains the complete LaTeX document
console.log(result.latex);

// Check for warnings
if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

## Output Example

The exporter generates a standalone LaTeX document using the TikZ library:

```latex
\documentclass[tikz,border=2mm]{standalone}
\usepackage{tikz}
\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}

\tikzset{
  block/.style={rectangle, draw, fill=white, text centered, minimum width=2cm, minimum height=1cm},
  gain/.style={regular polygon, regular polygon sides=3, draw, fill=white},
  sum/.style={circle, draw, fill=white, minimum size=0.8cm}
}

\begin{document}
\begin{tikzpicture}[auto, node distance=2cm, >=Stealth]
  \node[block] (tf1) at (2.54cm,1.27cm) {$\frac{K}{s+1}$};
  \node[gain] (g1) at (5.08cm,1.27cm) {$K=10$};
  \draw[->,>=Stealth] (tf1) -- (g1) node[above] {$signal$};
\end{tikzpicture}
\end{document}
```

## Compiling LaTeX Output

Save the output to a `.tex` file and compile with:

```bash
pdflatex diagram.tex
```

Or use online tools like Overleaf.

## Supported Shapes

- **transfer-fn**: Transfer function blocks with fraction notation
- **gain**: Amplifier/gain blocks (triangular)
- **integrator**: Integration blocks (blue-tinted, 1/s)
- **differentiator**: Differentiation blocks (orange-tinted, s)
- **time-delay**: Time delay blocks (pink-tinted, e^-sT)
- **saturation**: Saturation blocks (yellow-tinted)
- **compare-junction**: Summing junctions with +/- operators
- **multiply-junction**: Multiplication junctions (×)
- **divide-junction**: Division junctions (÷)
- **Plus all standard flowchart shapes**

## API

### `toLatex(diagram, layout): LatexResult`

**Parameters:**
- `diagram` (DiagramAst): The diagram AST from parser
- `layout` (LaidOutDiagram): The positioned nodes/edges from layout engine

**Returns:** `LatexResult`
- `latex` (string): Complete LaTeX document
- `warnings` (string[]): Array of warning messages

## Testing

```bash
pnpm test       # Run tests
pnpm build      # Build package
```

## License

MIT
