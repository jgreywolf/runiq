# Export Formats

Export Runiq diagrams to various external formats for simulation, synthesis, academic papers, and MATLAB integration. This reference covers all supported export formats: **SPICE** (analog circuits), **Verilog HDL** (digital circuits), **LaTeX/TikZ** (academic papers), and **Simulink MDL** (MATLAB).

## Overview

Runiq supports four export formats, each targeting specific domains:

| Format           | Domain                  | Use Cases                            | Package                  |
| ---------------- | ----------------------- | ------------------------------------ | ------------------------ |
| **SPICE**        | Analog circuits         | Simulation in LTspice/ngspice/PSpice | `@runiq/export-spice`    |
| **Verilog HDL**  | Digital circuits        | Synthesis with Vivado/Quartus/Yosys  | `@runiq/export-verilog`  |
| **LaTeX/TikZ**   | Control system diagrams | Academic papers and presentations    | `@runiq/export-latex`    |
| **Simulink MDL** | Control systems         | MATLAB/Simulink simulation           | `@runiq/export-simulink` |

All export formats are accessible via:

- **CLI**: `runiq diagram.runiq --export <format> -o output.ext`
- **TypeScript API**: `import { toSpice, toVerilog, toLatex, toSimulink } from '@runiq/export-*'`

### SVG, PNG, and PDF (Diagram Profile)

The diagram profile renders to SVG. To produce PNG or PDF, render SVG first and convert with external tools.

**Render SVG:**

```bash
runiq render diagram.runiq -o diagram.svg
```

**Convert to PNG or PDF (examples):**

```bash
# Inkscape
inkscape diagram.svg --export-type=png --export-filename=diagram.png
inkscape diagram.svg --export-type=pdf --export-filename=diagram.pdf

# librsvg
rsvg-convert diagram.svg -o diagram.png

# ImageMagick
magick diagram.svg diagram.png
magick diagram.svg diagram.pdf
```

::: tip Notes
- Inkscape and librsvg generally preserve text and gradients best for SVG conversion.
- Use higher resolution with ImageMagick: `magick -density 300 diagram.svg diagram.png`.
:::

---

## SPICE Netlist Export

Export electrical circuits to SPICE netlist format for analog circuit simulation.

### Supported Tools

- **LTspice** (Free, Windows/Mac/Linux) - Industry-standard GUI simulator
- **ngspice** (Open source) - Command-line SPICE simulator
- **PSpice** (Commercial) - Advanced simulation with extensive libraries
- **Xyce** (High-performance) - Parallel simulation for large circuits

### Supported Components

The SPICE exporter supports all passive and active components:

| Component      | SPICE Type | Syntax Example            |
| -------------- | ---------- | ------------------------- |
| Resistor       | `R`        | `R1 IN OUT 10k`           |
| Capacitor      | `C`        | `C1 OUT GND 1n`           |
| Inductor       | `L`        | `L1 A B 10m`              |
| Voltage Source | `V`        | `V1 IN 0 DC 5`            |
| Current Source | `I`        | `I1 N1 0 1m`              |
| Diode          | `D`        | `D1 ANODE CATHODE 1N4148` |
| BJT Transistor | `Q`        | `Q1 C B E Q2N2222`        |
| MOSFET         | `M`        | `M1 D G S B NMOS`         |

### Analysis Types

Specify simulation analyses in your `.runiq` file:

```runiq
electrical "RC Filter" {
  net IN, OUT, GND

  # Components
  part V1 type:V source:"SIN(0 1 1k)" pins:(IN, GND)
  part R1 type:R value:10k pins:(IN, OUT)
  part C1 type:C value:1n pins:(OUT, GND)

  # Analyses
  analysis tran "0 5m"            # Transient analysis (0 to 5ms)
  analysis ac "dec 10 1 100k"     # AC analysis (1Hz to 100kHz)
  analysis dc "V1 0 5 0.1"        # DC sweep (0V to 5V, 0.1V steps)
}
```

**Analysis Directives:**

- `.tran <start> <stop> [step] [uic]` - Transient analysis
- `.ac <type> <points> <start> <stop>` - AC frequency analysis
- `.dc <source> <start> <stop> <step>` - DC sweep
- `.op` - Operating point analysis
- `.tf <output> <source>` - Transfer function

### CLI Usage

```bash
# Export to SPICE netlist
runiq rc-filter.runiq --export spice -o rc-filter.cir

# Simulate with ngspice
ngspice rc-filter.cir
ngspice> run
ngspice> plot v(OUT) v(IN)

# Simulate with LTspice
ltspice rc-filter.cir
```

### TypeScript API

```typescript
import { toSpice } from '@runiq/export-spice';
import type { ElectricalProfile } from '@runiq/core';

const profile: ElectricalProfile = {
  type: 'electrical',
  name: 'RC Filter',
  nets: [{ name: 'IN' }, { name: 'OUT' }, { name: 'GND' }],
  parts: [
    {
      ref: 'V1',
      type: 'V',
      params: { source: 'SIN(0 1 1k)' },
      pins: ['IN', 'GND'],
    },
    { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['IN', 'OUT'] },
    { ref: 'C1', type: 'C', params: { value: '1n' }, pins: ['OUT', 'GND'] },
  ],
  analyses: [
    { kind: 'tran', args: '0 5m' },
    { kind: 'ac', args: 'dec 10 1 100k' },
  ],
};

const spice = toSpice(profile);
console.log(spice);
// Output:
// * RC Filter
// V1 IN 0 SIN(0 1 1k)
// R1 IN OUT 10k
// C1 OUT 0 1n
// .tran 0 5m
// .ac dec 10 1 100k
// .end
```

### SPICE Options

```typescript
const spice = toSpice(profile, {
  flavor: 'ngspice', // or 'pspice', 'ltspice'
});
```

**Flavors:**

- `ngspice` - Open-source SPICE (default)
- `pspice` - Cadence PSpice format
- `ltspice` - Linear Technology LTspice format

### Ground Normalization

The exporter automatically normalizes ground references:

- `GND`, `gnd`, `Gnd` → `0`
- `VSS`, `vss` → `0`

### Value Suffixes

SPICE standard suffixes are supported:

| Suffix | Multiplier | Example                  |
| ------ | ---------- | ------------------------ |
| `T`    | 10¹²       | `1T` = 1000000000000     |
| `G`    | 10⁹        | `1G` = 1000000000        |
| `MEG`  | 10⁶        | `1MEG` = 1000000         |
| `k`    | 10³        | `10k` = 10000            |
| `m`    | 10⁻³       | `1m` = 0.001             |
| `u`    | 10⁻⁶       | `1u` = 0.000001          |
| `n`    | 10⁻⁹       | `1n` = 0.000000001       |
| `p`    | 10⁻¹²      | `1p` = 0.000000000001    |
| `f`    | 10⁻¹⁵      | `1f` = 0.000000000000001 |

### Complete Example: Op-Amp Circuit

```runiq
electrical "Inverting Amplifier" {
  net IN, OUT, VINV, VCC, VEE, GND

  # Power supply
  part VCC type:V source:"DC 15" pins:(VCC, GND)
  part VEE type:V source:"DC -15" pins:(VEE, GND)

  # Input signal
  part VIN type:V source:"SIN(0 0.1 1k)" pins:(IN, GND)

  # Feedback network
  part R1 type:R value:10k pins:(IN, VINV)
  part R2 type:R value:100k pins:(VINV, OUT)

  # Op-amp
  part U1 type:X model:"OPAMP" pins:(VINV, GND, VCC, VEE, OUT)

  # Analysis
  analysis tran "0 2m"
  analysis ac "dec 10 1 100k"
}
```

**Exported SPICE:**

```spice
* Inverting Amplifier
VCC VCC 0 DC 15
VEE VEE 0 DC -15
VIN IN 0 SIN(0 0.1 1k)
R1 IN VINV 10k
R2 VINV OUT 100k
XU1 VINV 0 VCC VEE OUT OPAMP
.tran 0 2m
.ac dec 10 1 100k
.end
```

---

## Verilog HDL Export

Export digital circuits to Verilog HDL for synthesis and simulation with FPGA/ASIC tools.

### Supported Tools

- **Icarus Verilog** (Free) - Verilog simulator and synthesis tool
- **Vivado** (Xilinx) - FPGA synthesis and implementation
- **Quartus** (Intel/Altera) - FPGA design suite
- **Yosys** (Open source) - Synthesis framework
- **ModelSim** - Industry-standard HDL simulator
- **Verilator** - Fast open-source Verilog simulator

### Features

- **Module Generation** - Verilog modules with ports and parameters
- **Port Declarations** - `input`, `output`, `inout` with bus widths
- **Wire Declarations** - Automatic internal wire generation
- **Instance Generation** - Module instantiation with port mapping
- **Parameter Support** - Module parameters with defaults
- **Bus Notation** - Multi-bit signals `[N:0]`
- **IEEE 1364 Compliant** - Standard Verilog-2001 syntax

### Digital Components

All standard logic gates and components are supported:

| Component        | Description        | Verilog Primitive   |
| ---------------- | ------------------ | ------------------- |
| `AND2`, `AND3`   | 2/3-input AND gate | `and`               |
| `OR2`, `OR3`     | 2/3-input OR gate  | `or`                |
| `NOT`            | Inverter           | `not`               |
| `XOR2`           | XOR gate           | `xor`               |
| `NAND2`, `NAND3` | NAND gate          | `nand`              |
| `NOR2`, `NOR3`   | NOR gate           | `nor`               |
| `XNOR2`          | XNOR gate          | `xnor`              |
| `BUFFER`         | Buffer             | `buf`               |
| `DFF`            | D flip-flop        | `always @(posedge)` |
| `JKFF`           | JK flip-flop       | Sequential logic    |
| `TFF`            | T flip-flop        | Sequential logic    |
| `MUX41`, `MUX81` | Multiplexers       | Conditional logic   |
| `DEC24`, `DEC38` | Decoders           | Case statement      |

### CLI Usage

```bash
# Export to Verilog
runiq counter.runiq --export verilog -o counter.v

# Simulate with Icarus Verilog
iverilog -o counter.vvp counter.v counter_tb.v
vvp counter.vvp

# Synthesize with Yosys
yosys -p "read_verilog counter.v; synth -top Counter4bit; write_verilog synth_counter.v"
```

### TypeScript API

```typescript
import { toVerilog } from '@runiq/export-verilog';
import type { DigitalProfile } from '@runiq/core';

const counter: DigitalProfile = {
  type: 'digital',
  name: 'Counter4bit',
  modules: [
    {
      name: 'Counter4bit',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'reset', dir: 'input' },
        { name: 'count', dir: 'output', width: 4 },
      ],
    },
  ],
  instances: [],
  nets: [{ name: 'clk' }, { name: 'reset' }, { name: 'count', width: 4 }],
};

const result = toVerilog(counter);
console.log(result.verilog);
console.log('Warnings:', result.warnings);
```

### Verilog Result

```typescript
interface VerilogResult {
  verilog: string; // Generated Verilog code
  warnings: string[]; // Validation warnings
}
```

### Basic Module Example

**Input (.runiq):**

```runiq
digital "AND2" {
  module AND2 ports:(a, b, y)
  net a, b, y
}
```

**Output (.v):**

```verilog
module AND2
(
  input a,
  input b,
  output y
);

endmodule
```

### Parameterized Module

**Input (.runiq):**

```runiq
digital "Register" {
  module Register params:(WIDTH:8, RESET_VALUE:0) ports:(clk, d[7:0], q[7:0])
  net clk, d[7:0], q[7:0]
}
```

**Output (.v):**

```verilog
module Register
#(
  parameter WIDTH = 8,
  parameter RESET_VALUE = 0
)
(
  input clk,
  input [7:0] d,
  output [7:0] q
);

endmodule
```

### Hierarchical Design with Instances

**Input (.runiq):**

```runiq
digital "ALU4bit" {
  module ALU4bit ports:(a[3:0], b[3:0], op[1:0], result[3:0])

  # Internal nets
  net a[3:0], b[3:0], op[1:0], result[3:0], add_result[3:0], sub_result[3:0]

  # Instances
  inst ADDER of:Adder4bit map:(a:a, b:b, sum:add_result)
  inst MUX of:Mux4to1 params:(WIDTH:4) map:(sel:op, in0:add_result, in1:sub_result, out:result)
}
```

**Output (.v):**

```verilog
module ALU4bit
(
  input [3:0] a,
  input [3:0] b,
  input [1:0] op,
  output [3:0] result
);

  // Internal wires
  wire [3:0] add_result;
  wire [3:0] sub_result;

  // Module instances
  Adder4bit ADDER (
    .a(a),
    .b(b),
    .sum(add_result)
  );

  Mux4to1 #(
    .WIDTH(4)
  ) MUX (
    .sel(op),
    .in0(add_result),
    .in1(sub_result),
    .out(result)
  );

endmodule
```

### Complete Workflow: Design → Simulate → Synthesize

```bash
# Step 1: Create Runiq digital circuit
cat > counter.runiq << 'EOF'
digital "Counter4bit" {
  module Counter4bit ports:(clk, reset, count[3:0])
  net clk, reset, count[3:0]
}
EOF

# Step 2: Export to Verilog
runiq counter.runiq --export verilog -o counter.v

# Step 3: Create testbench
cat > counter_tb.v << 'EOF'
module counter_tb;
  reg clk, reset;
  wire [3:0] count;

  Counter4bit uut (.clk(clk), .reset(reset), .count(count));

  initial begin
    $dumpfile("counter.vcd");
    $dumpvars(0, counter_tb);
    clk = 0;
    reset = 1;
    #10 reset = 0;
    #100 $finish;
  end

  always #5 clk = ~clk;
endmodule
EOF

# Step 4: Simulate with Icarus Verilog
iverilog -o counter.vvp counter.v counter_tb.v
vvp counter.vvp
gtkwave counter.vcd  # View waveforms

# Step 5: Synthesize with Yosys
yosys -p "read_verilog counter.v; synth -top Counter4bit; stat"
```

### Export Options

```typescript
const result = toVerilog(profile, {
  indentSize: 2, // Spaces per indent level
  lineWidth: 80, // Max line width
  modulePrefix: 'runiq_', // Module name prefix
  includeComments: true, // Include DSL comments
  includeTimestamp: true, // Add generation timestamp
  declareWires: true, // Explicit wire declarations
  useParameterizedWidth: false, // Use parameters for bus widths
});
```

### Validation Warnings

The exporter validates:

- **Undeclared nets** - All port/instance connections must reference declared nets
- **Port mismatches** - Instance ports must match module definitions
- **Bus width conflicts** - Multi-bit connections must have matching widths

---

## LaTeX/TikZ Export

Export Control system diagrams to LaTeX/TikZ format for academic papers and presentations.

### Use Cases

- **Control Systems** - PID controllers, feedback loops, state-space models
- **Signal Processing** - Filter banks, FFTs, modulation schemes
- **Academic Papers** - IEEE, ACM, Springer publication-ready diagrams
- **Presentations** - Beamer slides with vector graphics
- **Thesis/Dissertation** - Professional engineering diagrams

### Supported Shapes

The LaTeX exporter handles all block diagram shapes:

| Shape               | TikZ Style          | Description                              |
| ------------------- | ------------------- | ---------------------------------------- |
| `transfer-fn`       | `block` (rectangle) | Transfer function with $\frac{num}{den}$ |
| `gain`              | `gain` (triangle)   | Amplifier/gain block                     |
| `integrator`        | `block` (blue)      | Integration $\frac{1}{s}$                |
| `differentiator`    | `block` (orange)    | Differentiation $s$                      |
| `time-delay`        | `block` (pink)      | Time delay $e^{-sT}$                     |
| `saturation`        | `block` (yellow)    | Saturation limiter                       |
| `compare-junction`  | `sum` (circle)      | Summing junction ⊕                       |
| `multiply-junction` | `multiply` (circle) | Multiplication ⊗                         |
| `divide-junction`   | `divide` (circle)   | Division ⊘                               |

### CLI Usage

```bash
# Export to LaTeX
runiq pid-controller.runiq --export latex -o pid-controller.tex

# Compile standalone document
pdflatex pid-controller.tex

# Or include in your paper
\input{pid-controller.tex}
```

### TypeScript API

```typescript
import { toLatex } from '@runiq/export-latex';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

// Diagram from parser
const diagram: DiagramAst = {
  /* ... */
};

// Layout from ELK layout engine
const layout: LaidOutDiagram = {
  /* ... */
};

// Export to LaTeX
const result = toLatex(diagram, layout);

// Write to file
import fs from 'fs';
fs.writeFileSync('diagram.tex', result.latex);

// Check warnings
if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

### LaTeX Result

```typescript
interface LatexResult {
  latex: string; // Complete LaTeX document
  warnings: string[]; // Conversion warnings
}
```

### Generated LaTeX Structure

The exporter produces a standalone LaTeX document:

```latex
\documentclass[tikz,border=2mm]{standalone}
\usepackage{tikz}
\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}

\tikzset{
  block/.style={rectangle, draw, fill=white, text centered, minimum width=2cm, minimum height=1cm},
  gain/.style={regular polygon, regular polygon sides=3, draw, fill=white},
  sum/.style={circle, draw, fill=white, minimum size=0.8cm},
  integrator/.style={block, fill=blue!10},
  differentiator/.style={block, fill=orange!10},
  timedelay/.style={block, fill=pink!10},
  saturation/.style={block, fill=yellow!10}
}

\begin{document}
\begin{tikzpicture}[auto, node distance=2cm, >=Stealth]
  % Nodes
  \node[block] (tf1) at (2.54cm,1.27cm) {$\frac{K}{s+1}$};
  \node[gain] (g1) at (5.08cm,1.27cm) {$K=10$};
  \node[sum] (sum1) at (7.62cm,1.27cm) {$+$};

  % Edges
  \draw[->,>=Stealth] (tf1) -- (g1) node[midway,above] {$x(s)$};
  \draw[->,>=Stealth] (g1) -- (sum1);
\end{tikzpicture}
\end{document}
```

### Transfer Function Conversion

The exporter automatically converts transfer functions to LaTeX fractions:

| Input Label          | LaTeX Output             |
| -------------------- | ------------------------ |
| `"1/(s+1)"`          | `$\frac{1}{s+1}$`        |
| `"K/(s^2+2s+1)"`     | `$\frac{K}{s^2+2s+1}$`   |
| `"(s+1)/(s^2+3s+2)"` | `$\frac{s+1}{s^2+3s+2}$` |
| `"1/s"`              | `$\frac{1}{s}$`          |

### Example: PID Controller

**Input (.runiq):**

```runiq
diagram "PID Controller" {
  shape setpoint as @input label:"r(t)"
  shape error as @compare-junction label:"+"
  shape Kp as @gain label:"Kp"
  shape Ki as @integrator label:"Ki/s"
  shape Kd as @differentiator label:"Kd·s"
  shape sum as @compare-junction label:"+"
  shape plant as @transfer-fn label:"G(s) = 1/(s+1)"
  shape output as @output label:"y(t)"

  setpoint -> error
  error -> Kp
  error -> Ki
  error -> Kd
  Kp -> sum
  Ki -> sum
  Kd -> sum
  sum -> plant
  plant -> output
  output -> error label:"-" lineStyle:"dashed"
}
```

**Output (.tex):**

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
  \node[block] (setpoint) at (0,0) {$r(t)$};
  \node[sum] (error) at (2,0) {$+$};
  \node[gain] (Kp) at (4,1) {$K_p$};
  \node[block] (Ki) at (4,0) {$\frac{K_i}{s}$};
  \node[block] (Kd) at (4,-1) {$K_d \cdot s$};
  \node[sum] (sum) at (6,0) {$+$};
  \node[block] (plant) at (8,0) {$\frac{1}{s+1}$};
  \node[block] (output) at (10,0) {$y(t)$};

  \draw[->,>=Stealth] (setpoint) -- (error);
  \draw[->,>=Stealth] (error) -- (Kp);
  \draw[->,>=Stealth] (error) -- (Ki);
  \draw[->,>=Stealth] (error) -- (Kd);
  \draw[->,>=Stealth] (Kp) -- (sum);
  \draw[->,>=Stealth] (Ki) -- (sum);
  \draw[->,>=Stealth] (Kd) -- (sum);
  \draw[->,>=Stealth] (sum) -- (plant);
  \draw[->,>=Stealth] (plant) -- (output);
  \draw[->,>=Stealth,dashed] (output) |- (error) node[pos=0.25,right] {$-$};
\end{tikzpicture}
\end{document}
```

### Compiling LaTeX

```bash
# Compile standalone document
pdflatex diagram.tex

# Or use latexmk for automatic compilation
latexmk -pdf diagram.tex

# Online: Upload to Overleaf
```

### Including in Papers

```latex
\documentclass{article}
\usepackage{tikz}
\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}

\begin{document}

\section{Control System Design}

The PID controller architecture is shown in Figure~\ref{fig:pid}.

\begin{figure}[h]
  \centering
  \input{pid-controller.tex}  % Include exported TikZ
  \caption{PID Controller Block Diagram}
  \label{fig:pid}
\end{figure}

\end{document}
```

### Special Character Escaping

LaTeX special characters are automatically escaped:

| Character | LaTeX Escaped        |
| --------- | -------------------- |
| `\`       | `\textbackslash{}`   |
| `{`       | `\{`                 |
| `}`       | `\}`                 |
| `_`       | `\_`                 |
| `^`       | `\textasciicircum{}` |
| `#`       | `\#`                 |
| `&`       | `\&`                 |
| `%`       | `\%`                 |

---

## Simulink MDL Export

Export Control system diagrams to Simulink MDL format for MATLAB/Simulink simulation.

### Use Cases

- **Control Systems** - PID tuning, state-space controllers
- **Signal Processing** - Filter design, modulation
- **System Identification** - Model validation
- **Hardware-in-Loop** - Embedded system testing
- **Education** - Teaching control theory

### Supported Simulink Blocks

| Runiq Shape         | Simulink Block   | Description                               |
| ------------------- | ---------------- | ----------------------------------------- |
| `transfer-fn`       | `TransferFcn`    | Transfer function (numerator/denominator) |
| `gain`              | `Gain`           | Amplifier/gain block                      |
| `integrator`        | `Integrator`     | Integration block (1/s)                   |
| `differentiator`    | `Derivative`     | Differentiation block (s)                 |
| `time-delay`        | `TransportDelay` | Time delay block                          |
| `saturation`        | `Saturate`       | Saturation with upper/lower limits        |
| `compare-junction`  | `Sum`            | Summing junction with +/- inputs          |
| `multiply-junction` | `Product`        | Multiplication block (⊗)                  |
| `divide-junction`   | `Product`        | Division block (÷)                        |

### CLI Usage

```bash
# Export to Simulink MDL
runiq pid-controller.runiq --export simulink -o pid_controller.mdl

# Open in MATLAB
matlab -r "open_system('pid_controller.mdl')"
```

### TypeScript API

```typescript
import { toSimulink } from '@runiq/export-simulink';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

// Diagram from parser
const diagram: DiagramAst = {
  /* ... */
};

// Layout from ELK layout engine
const layout: LaidOutDiagram = {
  /* ... */
};

// Export to Simulink MDL
const result = toSimulink(diagram, layout);

// Write to file
import fs from 'fs';
fs.writeFileSync('control_system.mdl', result.mdl);

// Check warnings
if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

### Simulink Result

```typescript
interface SimulinkResult {
  mdl: string; // Complete MDL file content
  warnings: string[]; // Conversion warnings
}
```

### Generated MDL Structure

The exporter produces a Simulink Model Definition Language (MDL) file:

```mdl
Model {
  Name		"control_system"
  Version		"7.6"
  SavedCharacterEncoding	"UTF-8"

  System {
    Name		"control_system"
    Location		[0, 0, 1024, 768]

    Block {
      BlockType		"TransferFcn"
      Name		"Plant"
      Numerator		"[1]"
      Denominator		"[1 1]"
      Position		[200, 100, 280, 160]
      SID		"1"
    }

    Block {
      BlockType		"Gain"
      Name		"Controller"
      Gain		"10"
      Position		[100, 100, 180, 140]
      SID		"2"
    }

    Line {
      SrcBlock		"Controller"
      SrcPort		1
      DstBlock		"Plant"
      DstPort		1
    }
  }
}
```

### Transfer Function Parsing

The exporter automatically parses transfer functions from labels:

| Input Label          | Numerator | Denominator |
| -------------------- | --------- | ----------- |
| `"1/(s+1)"`          | `[1]`     | `[1 1]`     |
| `"5/(s^2+3s+2)"`     | `[5]`     | `[1 3 2]`   |
| `"(s+2)/(s^2+5s+6)"` | `[1 2]`   | `[1 5 6]`   |
| `"K/(s+1)"`          | `[K]`     | `[1 1]`     |

**Polynomial Format:** Coefficients in descending order of powers of $s$.

Example: $s^2 + 3s + 2$ → `[1 3 2]`

### Example: Second-Order System

**Input (.runiq):**

```runiq
diagram "Second Order System" {
  shape input as @input label:"r(t)"
  shape plant as @transfer-fn label:"1/(s^2+2s+1)"
  shape output as @output label:"y(t)"

  input -> plant
  plant -> output
}
```

**Output (.mdl):**

```mdl
Model {
  Name		"second_order_system"
  Version		"7.6"
  SavedCharacterEncoding	"UTF-8"

  System {
    Name		"second_order_system"
    Location		[0, 0, 800, 600]

    Block {
      BlockType		"Inport"
      Name		"input"
      Position		[50, 100, 80, 120]
      Port		"1"
      SID		"1"
    }

    Block {
      BlockType		"TransferFcn"
      Name		"plant"
      Numerator		"[1]"
      Denominator		"[1 2 1]"
      Position		[150, 90, 230, 130]
      SID		"2"
    }

    Block {
      BlockType		"Outport"
      Name		"output"
      Position		[300, 100, 330, 120]
      Port		"1"
      SID		"3"
    }

    Line {
      SrcBlock		"input"
      SrcPort		1
      DstBlock		"plant"
      DstPort		1
    }

    Line {
      SrcBlock		"plant"
      SrcPort		1
      DstBlock		"output"
      DstPort		1
    }
  }
}
```

### Opening in MATLAB

```matlab
% Open the generated model
open_system('control_system.mdl')

% Run simulation
sim('control_system')

% Plot results
plot(ans.tout, ans.yout)
xlabel('Time (s)')
ylabel('Output')
title('Step Response')
```

### Compatibility

- **MATLAB**: R2010a and later
- **Simulink**: Version 7.6 and later
- **Toolboxes**: Control System Toolbox recommended

### Complete Example: PID Controller

**Input (.runiq):**

```runiq
diagram "PID Controller" {

# Reference input
  shape ref as @input label:"Setpoint"

# Controller
  shape error as @compare-junction label:"+"
  shape Kp as @gain label:"Kp=5"
  shape Ki as @integrator label:"Ki=2"
  shape Kd as @differentiator label:"Kd=0.5"
  shape pid_sum as @compare-junction label:"+"

# Plant
  shape plant as @transfer-fn label:"1/(s^2+3s+2)"

# Output
  shape output as @output label:"Output"

# Connections
  ref -> error
  error -> Kp
  error -> Ki
  error -> Kd
  Kp -> pid_sum
  Ki -> pid_sum
  Kd -> pid_sum
  pid_sum -> plant
  plant -> output
  output -> error label:"-" lineStyle:"dashed"
}
```

**Generated MDL:**

```mdl
Model {
  Name		"pid_controller"
  Version		"7.6"
  SavedCharacterEncoding	"UTF-8"

  System {
    Name		"pid_controller"
    Location		[0, 0, 1024, 768]

    Block {
      BlockType		"Inport"
      Name		"ref"
      Position		[50, 200, 80, 220]
      Port		"1"
      SID		"1"
    }

    Block {
      BlockType		"Sum"
      Name		"error"
      Inputs		"+-"
      Position		[130, 195, 150, 225]
      SID		"2"
    }

    Block {
      BlockType		"Gain"
      Name		"Kp"
      Gain		"5"
      Position		[200, 150, 240, 180]
      SID		"3"
    }

    Block {
      BlockType		"Integrator"
      Name		"Ki"
      InitialCondition	"0"
      Position		[200, 200, 240, 230]
      SID		"4"
    }

    Block {
      BlockType		"Derivative"
      Name		"Kd"
      Position		[200, 250, 240, 280]
      SID		"5"
    }

    Block {
      BlockType		"Sum"
      Name		"pid_sum"
      Inputs		"+++"
      Position		[290, 195, 310, 225]
      SID		"6"
    }

    Block {
      BlockType		"TransferFcn"
      Name		"plant"
      Numerator		"[1]"
      Denominator		"[1 3 2]"
      Position		[360, 190, 440, 230]
      SID		"7"
    }

    Block {
      BlockType		"Outport"
      Name		"output"
      Position		[490, 200, 520, 220]
      Port		"1"
      SID		"8"
    }

    Line {
      SrcBlock		"ref"
      SrcPort		1
      DstBlock		"error"
      DstPort		1
    }

    Line {
      SrcBlock		"error"
      SrcPort		1
      DstBlock		"Kp"
      DstPort		1
      Points		[0, -30]
    }

    Line {
      SrcBlock		"error"
      SrcPort		1
      DstBlock		"Ki"
      DstPort		1
    }

    Line {
      SrcBlock		"error"
      SrcPort		1
      DstBlock		"Kd"
      DstPort		1
      Points		[0, 30]
    }

    Line {
      SrcBlock		"Kp"
      SrcPort		1
      DstBlock		"pid_sum"
      DstPort		1
    }

    Line {
      SrcBlock		"Ki"
      SrcPort		1
      DstBlock		"pid_sum"
      DstPort		2
    }

    Line {
      SrcBlock		"Kd"
      SrcPort		1
      DstBlock		"pid_sum"
      DstPort		3
    }

    Line {
      SrcBlock		"pid_sum"
      SrcPort		1
      DstBlock		"plant"
      DstPort		1
    }

    Line {
      SrcBlock		"plant"
      SrcPort		1
      DstBlock		"output"
      DstPort		1
    }

    Line {
      SrcBlock		"output"
      SrcPort		1
      DstBlock		"error"
      DstPort		2
      Points		[0, 100; -400, 0; 0, -100]
    }
  }
}
```

---

## Best Practices

### General Export Tips

1. **Validate Before Export** - Ensure diagram syntax is correct
2. **Use Meaningful Labels** - Clear node/edge labels improve readability
3. **Test Output** - Verify exported files compile/simulate correctly
4. **Version Control** - Track both `.runiq` source and exported files
5. **Document Assumptions** - Add comments explaining design choices

### SPICE-Specific

- **Ground Reference** - Always include a ground net (GND or 0)
- **Component Values** - Use standard SPICE suffixes (k, u, n, p)
- **Analysis Selection** - Choose appropriate analysis for circuit type
- **Model Files** - Reference external `.lib` files for complex models
- **Simulation Time** - Start with small time steps, increase as needed

### Verilog-Specific

- **Naming Conventions** - Use lowercase for signals, uppercase for parameters
- **Bit Widths** - Explicitly declare all bus widths
- **Port Ordering** - Inputs first, then outputs
- **Hierarchy** - Organize complex designs with submodules
- **Testbenches** - Create testbenches for all modules

### LaTeX-Specific

- **Minimal Packages** - Only include necessary TikZ libraries
- **Consistent Spacing** - Use `node distance` for uniform layout
- **Math Mode** - Use `$...$` for all mathematical expressions
- **Label Placement** - Use `above`, `below`, `left`, `right` for edge labels
- **Color Scheme** - Use semantic colors (blue=integrator, red=error)

### Simulink-Specific

- **Block Naming** - Use descriptive block names (not `Block1`, `Block2`)
- **Signal Labels** - Label important signals for clarity
- **Subsystems** - Group related blocks into subsystems
- **Sample Times** - Set appropriate sample times for discrete blocks
- **Documentation** - Use annotation blocks for explanatory text

---

## Troubleshooting

### SPICE Issues

**Problem:** "Unknown subcircuit model"

- **Solution:** Include `.lib` file or define subcircuit in netlist

**Problem:** "Singular matrix error"

- **Solution:** Add small resistances to floating nodes

**Problem:** "Time step too small"

- **Solution:** Increase `reltol` or adjust transient analysis step size

### Verilog Issues

**Problem:** "Undeclared identifier"

- **Solution:** Declare all wires/nets used in instances

**Problem:** "Port size mismatch"

- **Solution:** Ensure bus widths match between instances and modules

**Problem:** "Syntax error near ';'"

- **Solution:** Check for missing commas in port/parameter lists

### LaTeX Issues

**Problem:** "Undefined control sequence"

- **Solution:** Load required TikZ libraries (`\usetikzlibrary{...}`)

**Problem:** "Missing $ inserted"

- **Solution:** Wrap math expressions in `$...$` or `\(...\)`

**Problem:** "Dimension too large"

- **Solution:** Scale coordinates (`[scale=0.5]` in TikZ options)

### Simulink Issues

**Problem:** "Unable to open system"

- **Solution:** Check MDL file encoding (UTF-8) and MATLAB version

**Problem:** "Unconnected input port"

- **Solution:** Connect all block inputs or set initial conditions

**Problem:** "Algebraic loop detected"

- **Solution:** Add unit delay or integrate signal in feedback path

---

## Related Documentation

- [Digital Circuits Guide](/guide/digital-circuits) - Digital circuit design patterns
- [Electrical Circuits Guide](/guide/electrical) - Analog circuit design patterns
- [Control system Diagrams Guide](/guide/control-diagrams) - Control system design
- [CLI Reference](/reference/cli) - Command-line export options
- [Shapes Reference](/reference/shapes) - All available shape IDs

---

## API Reference

### SPICE Export

```typescript
import { toSpice } from '@runiq/export-spice';

function toSpice(
  profile: ElectricalProfile,
  options?: {
    flavor?: 'ngspice' | 'pspice' | 'ltspice';
  }
): string;

interface ElectricalProfile {
  type: 'electrical';
  name: string;
  nets: NetAst[];
  parts: PartAst[];
  analyses?: AnalysisAst[];
}
```

### Verilog Export

```typescript
import { toVerilog } from '@runiq/export-verilog';

function toVerilog(
  profile: DigitalProfile,
  options?: VerilogOptions
): VerilogResult;

interface VerilogResult {
  verilog: string;
  warnings: string[];
}

interface VerilogOptions {
  indentSize?: number;
  lineWidth?: number;
  modulePrefix?: string;
  includeComments?: boolean;
  includeTimestamp?: boolean;
  declareWires?: boolean;
  useParameterizedWidth?: boolean;
}
```

### LaTeX Export

```typescript
import { toLatex } from '@runiq/export-latex';

function toLatex(diagram: DiagramAst, layout: LaidOutDiagram): LatexResult;

interface LatexResult {
  latex: string;
  warnings: string[];
}
```

### Simulink Export

```typescript
import { toSimulink } from '@runiq/export-simulink';

function toSimulink(
  diagram: DiagramAst,
  layout: LaidOutDiagram
): SimulinkResult;

interface SimulinkResult {
  mdl: string;
  warnings: string[];
}
```

---

## Examples

- [Electrical Examples](/examples/electrical) - RC filters, op-amps, power supplies
- [Digital Examples](/examples/digital) - Counters, ALUs, state machines
- [Control system Diagram Examples](/examples/control-diagrams) - PID controllers, filters
- [GitHub Repository](https://github.com/jgreywolf/runiq/tree/main/examples) - All example files
