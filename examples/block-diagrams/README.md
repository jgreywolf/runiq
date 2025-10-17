# Block Diagram Examples

Control system and signal processing block diagrams created with Runiq.

> **📸 Visual Outputs:** SVG visualizations are coming soon! For now, you can view the `.runiq` source files below. To generate SVGs, run through the Runiq CLI or renderer.

## What are Block Diagrams?

Block diagrams are used in control systems, signal processing, and systems engineering to represent the flow of signals and control through a system. Each block represents a mathematical operation or transfer function.

## Features Demonstrated

### Shapes Used
- **Transfer Function** (`@transfer-function`) - System dynamics in Laplace domain, e.g., `K/(s+1)`
- **Gain Block** (`@gain`) - Simple multiplier: `K×`
- **Integrator** (`@integrator`) - Integration operator: `1/s`
- **Differentiator** (`@differentiator`) - Derivative operator: `s`
- **Time Delay** (`@time-delay`) - Transport delay: `e^(-sT)`
- **Saturation** (`@saturation`) - Nonlinear limiter
- **Summing Junction** (`@summing-junction`) - Addition/subtraction: `Σ`
- **Multiply Junction** (`@multiply`) - Multiplication: `×`
- **Divide Junction** (`@divide`) - Division: `÷`
- **Compare Junction** (`@compare`) - Comparator

### Export Formats

These diagrams can be exported to:
- **LaTeX/TikZ** - For academic papers and documentation
- **Simulink MDL** - For MATLAB simulation and analysis
- **SVG** - For web and presentations

## Examples

### pid-controller.runiq
Classic PID (Proportional-Integral-Derivative) controller:
```runiq
diagram: block-diagram
title: "PID Controller"

shape Reference as @rounded label: "r(t)"
shape Error as @summing-junction label: "Σ"
shape Kp as @gain label: "Kp"
shape Ki as @transfer-function label: "Ki/s"
shape Kd as @transfer-function label: "Kd·s"
shape Sum as @summing-junction label: "Σ"
shape Plant as @transfer-function label: "1/(s+1)"
shape Output as @rounded label: "y(t)"

Reference -> Error
Error -> Kp -> Sum
Error -> Ki -> Sum
Error -> Kd -> Sum
Sum -> Plant -> Output
Output -> Error : feedback
```

**Demonstrates:**
- PID controller structure
- Parallel control paths
- Feedback loop
- Standard control notation

### feedback-system.runiq
Negative feedback control system:
```runiq
diagram: block-diagram
title: "Feedback Control System"

shape Input as @rounded label: "R(s)"
shape Error as @summing-junction label: "+"
shape Controller as @transfer-function label: "C(s)"
shape Plant as @transfer-function label: "G(s)"
shape Output as @rounded label: "Y(s)"
shape Sensor as @transfer-function label: "H(s)"

Input -> Error
Error -> Controller -> Plant -> Output
Output -> Sensor -> Error : feedback "-"
```

**Demonstrates:**
- Classic feedback loop structure
- Controller-Plant-Sensor chain
- Negative feedback path
- Laplace domain notation

### transfer-function-chain.runiq
Series of transfer functions:
```runiq
diagram: block-diagram
title: "Transfer Function Chain"

shape Input as @rounded label: "X(s)"
shape TF1 as @transfer-function label: "G₁(s) = K/(s+a)"
shape TF2 as @transfer-function label: "G₂(s) = 1/(τs+1)"
shape TF3 as @transfer-function label: "G₃(s) = ωn²/(s²+2ζωns+ωn²)"
shape Output as @rounded label: "Y(s)"

Input -> TF1 -> TF2 -> TF3 -> Output
```

**Demonstrates:**
- Cascaded transfer functions
- First-order systems
- Second-order systems
- Greek letters and subscripts in notation

### state-space.runiq
State-space representation:
```runiq
diagram: block-diagram
title: "State-Space Model"

shape Input as @rounded label: "u(t)"
shape B as @gain label: "B"
shape Integrator as @integrator label: "∫"
shape A as @gain label: "A"
shape C as @gain label: "C"
shape D as @gain label: "D"
shape Sum1 as @summing-junction label: "+"
shape Sum2 as @summing-junction label: "+"
shape State as @rounded label: "x(t)"
shape Output as @rounded label: "y(t)"

Input -> B -> Sum1 -> Integrator -> State
State -> A -> Sum1 : feedback
State -> C -> Sum2
Input -> D -> Sum2
Sum2 -> Output
```

**Demonstrates:**
- State-space form: ẋ = Ax + Bu, y = Cx + Du
- State feedback
- Direct feedthrough path
- Modern control theory notation

### parallel-paths.runiq
Parallel signal paths:
```runiq
diagram: block-diagram
title: "Parallel Control Paths"

shape Input as @rounded label: "Input"
shape Path1 as @transfer-function label: "G₁(s)"
shape Path2 as @transfer-function label: "G₂(s)"
shape Path3 as @transfer-function label: "G₃(s)"
shape Sum as @summing-junction label: "Σ"
shape Output as @rounded label: "Output"

Input -> Path1 -> Sum
Input -> Path2 -> Sum
Input -> Path3 -> Sum
Sum -> Output
```

**Demonstrates:**
- Multiple parallel paths
- Signal summation
- Multi-input systems
- Path diversity

## Export Examples

### Generate LaTeX for Academic Papers

```bash
# Generate LaTeX/TikZ code
runiq pid-controller.runiq --export latex -o pid-controller.tex

# Include in your LaTeX document
\input{pid-controller.tex}
```

### Generate Simulink Model

```bash
# Generate Simulink .mdl file
runiq pid-controller.runiq --export simulink -o pid_controller.mdl

# Open in MATLAB
matlab -r "open_system('pid_controller.mdl')"
```

### Generate SVG for Web/Presentations

```bash
# Generate SVG
runiq pid-controller.runiq -o pid-controller.svg
```

## References

- **Control Systems**: Ogata, "Modern Control Engineering"
- **Signal Processing**: Oppenheim & Willsky, "Signals and Systems"
- **Laplace Transforms**: Used for frequency domain analysis
- **State-Space**: Modern control theory representation

## See Also

- [Use Case Diagrams](../use-case-diagram/) - UML use case examples
- [Electrical Circuits](../electrical/) - Analog circuit examples
- [Digital Circuits](../../packages/export-verilog/examples/) - Logic gate examples
