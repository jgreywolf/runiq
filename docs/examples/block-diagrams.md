# Block Diagram Examples

Control system diagrams with transfer functions, feedback loops, and export to LaTeX/Simulink.

## PID Controller

Classic proportional-integral-derivative controller with feedback.

### DSL Code

```runiq
diagram "PID Controller"

  shape ref as @box label: "Reference"
  shape sum as @junction label: "+/-"
  shape pid as @transfer-fn label: "PID"
  shape plant as @transfer-fn label: "Plant\nG(s)"
  shape output as @box label: "Output"

  ref -> sum label: "r(t)"
  sum -> pid label: "e(t)"
  pid -> plant label: "u(t)"
  plant -> output label: "y(t)"
  output -> sum label: "feedback"
```

### Generated SVG

![PID Controller](/examples/pid-controller.svg)

### Generated SVG

![PID Controller](/examples/pid-controller.svg)

### Transfer Function

$$C(s) = K_p + \frac{K_i}{s} + K_d s$$

Where:

- $K_p$ = Proportional gain
- $K_i$ = Integral gain
- $K_d$ = Derivative gain

### Control Law

$$u(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$

### Use Cases

- Temperature control
- Motor speed control
- Robotic arm positioning
- Flight control systems

## Feedback System

Generic feedback control system with forward and feedback paths.

### DSL Code

```runiq
diagram "Feedback Control System" direction: LR

  # Forward path
  shape input as @box label: "Input\nR(s)"
  shape error as @summing-junction label: "Σ"
  shape controller as @transfer-fn label: "Controller\nC(s)"
  shape plant as @transfer-fn label: "Plant\nG(s)"
  shape output as @box label: "Output\nY(s)"

  # Feedback path
  shape sensor as @transfer-fn label: "Sensor\nH(s)"

  # Disturbance
  shape disturbance as @box label: "Disturbance\nD(s)"
  shape dist_sum as @summing-junction label: "Σ"

  # Forward connections
  input -> error label: "+"
  error -> controller
  controller -> dist_sum label: "+"
  disturbance -> dist_sum label: "+"
  dist_sum -> plant
  plant -> output

  # Feedback path
  output -> sensor
  sensor -> error label: "-"
```

### Generated SVG

![Feedback Control System](/examples/feedback-system.svg)

### Generated SVG

![Feedback Control System](/examples/feedback-system.svg)

### Closed-Loop Transfer Function

$$\frac{Y(s)}{R(s)} = \frac{C(s)G(s)}{1 + C(s)G(s)H(s)}$$

### Open-Loop vs Closed-Loop

**Open-Loop** (no feedback):

- Simple design
- No self-correction
- Sensitive to disturbances

**Closed-Loop** (with feedback):

- Self-correcting
- Reduced sensitivity
- Improved stability

## Transfer Function Chain

Series connection of multiple transfer functions.

### DSL Code

```runiq
diagram "Multi-Stage Amplifier" direction: LR

  shape input as @box label: "Input"
  shape stage1 as @transfer-fn label: "Stage 1\nA₁(s)"
  shape stage2 as @transfer-fn label: "Stage 2\nA₂(s)"
  shape stage3 as @transfer-fn label: "Stage 3\nA₃(s)"
  shape output as @box label: "Output"

  input -> stage1
  stage1 -> stage2
  stage2 -> stage3
  stage3 -> output
```

### Generated SVG

![Multi-Stage Amplifier](/examples/transfer-function-chain.svg)

### Generated SVG

![Transfer Function Chain](/examples/transfer-function-chain.svg)

### Overall Transfer Function

For series connection:
$$H(s) = A_1(s) \cdot A_2(s) \cdot A_3(s)$$

Example:
$$H(s) = \frac{10}{s+1} \cdot \frac{5}{s+10} \cdot \frac{2}{s+100}$$

## State-Space Representation

Modern control representation using state variables.

### DSL Code

```runiq
diagram "State-Space System" direction: TB

  # Input
  shape u as @box label: "Input\nu(t)"

  # State equations
  shape B as @gain label: "B"
  shape integrator as @transfer-fn label: "1/s"
  shape A as @gain label: "A"
  shape C as @gain label: "C"
  shape D as @gain label: "D"

  # Output
  shape y as @box label: "Output\ny(t)"

  # State feedback
  shape sum1 as @summing-junction label: "Σ"
  shape sum2 as @summing-junction label: "Σ"

  # Connections
  u -> B
  B -> sum1 label: "+"
  sum1 -> integrator label: "ẋ(t)"
  integrator -> A label: "x(t)"
  A -> sum1 label: "+"
  integrator -> C
  C -> sum2 label: "+"
  u -> D
  D -> sum2 label: "+"
  sum2 -> y
```

### Generated SVG

![State-Space System](/examples/state-space.svg)

### Generated SVG

![State-Space](/examples/state-space.svg)

### State-Space Equations

$$\dot{x}(t) = Ax(t) + Bu(t)$$
$$y(t) = Cx(t) + Du(t)$$

Where:

- $x(t)$ = State vector
- $u(t)$ = Input vector
- $y(t)$ = Output vector
- $A$ = System matrix
- $B$ = Input matrix
- $C$ = Output matrix
- $D$ = Feedthrough matrix

## Parallel Paths

Multiple parallel signal paths that combine.

### DSL Code

```runiq
diagram "Parallel PID Controller" direction: LR

  shape error as @box label: "Error\ne(t)"

  # Parallel paths
  shape Kp as @gain label: "Kp"
  shape Ki as @transfer-fn label: "Ki/s"
  shape Kd as @transfer-fn label: "Kd·s"

  # Sum
  shape sum as @summing-junction label: "Σ"
  shape output as @box label: "Output\nu(t)"

  # Connections
  error -> Kp -> sum label: "+"
  error -> Ki -> sum label: "+"
  error -> Kd -> sum label: "+"
  sum -> output
```

### Generated SVG

![Parallel PID Controller](/examples/parallel-paths.svg)

### Generated SVG

![Parallel Paths](/examples/parallel-paths.svg)

### Parallel Transfer Function

For parallel paths:
$$H(s) = H_1(s) + H_2(s) + H_3(s)$$

PID example:
$$C(s) = K_p + \frac{K_i}{s} + K_d s$$

## Block Diagram Elements

Runiq provides specialized shapes for control systems:

### Basic Blocks

| Shape                 | Syntax              | Use Case                      |
| --------------------- | ------------------- | ----------------------------- |
| **Box**               | `@box`              | Input/output, reference       |
| **Transfer Function** | `@transfer-fn`      | System dynamics $G(s)$        |
| **Gain**              | `@gain`             | Constant multiplier $K$       |
| **Summing Junction**  | `@summing-junction` | Addition/subtraction $\Sigma$ |
| **Junction**          | `@junction`         | Signal split point            |
| **Integrator**        | `@transfer-fn`      | $\frac{1}{s}$ or $\int$       |
| **Differentiator**    | `@transfer-fn`      | $s$ or $\frac{d}{dt}$         |

### Common Transfer Functions

```runiq
# First-order lag
shape tf1 as @transfer-fn label: "1/(τs+1)"

# Second-order system
shape tf2 as @transfer-fn label: "ωₙ²/(s²+2ζωₙs+ωₙ²)"

# Integrator
shape int as @transfer-fn label: "1/s"

# Differentiator
shape diff as @transfer-fn label: "s"

# Delay
shape delay as @transfer-fn label: "e^(-τs)"

# Lead-lag compensator
shape comp as @transfer-fn label: "(s+z)/(s+p)"
```

## Complete Examples

### Motor Speed Control

```runiq
diagram "DC Motor Speed Control" direction: LR

  # Input
  shape ref as @box label: "Desired\nSpeed"

  # Controller
  shape error as @summing-junction label: "Σ"
  shape pid as @transfer-fn label: "PID\nController"

  # Motor model
  shape motor as @transfer-fn label: "Motor\nK/(Js+b)"

  # Tachometer (sensor)
  shape tacho as @gain label: "Kt"

  # Output
  shape speed as @box label: "Actual\nSpeed"

  # Connections
  ref -> error label: "+"
  error -> pid
  pid -> motor label: "Voltage"
  motor -> speed
  speed -> tacho
  tacho -> error label: "-"
```

### Aircraft Pitch Control

```runiq
diagram "Aircraft Pitch Control" direction: LR

  # Reference
  shape theta_ref as @box label: "θ_ref"

  # Autopilot
  shape error as @summing-junction label: "Σ"
  shape autopilot as @transfer-fn label: "Autopilot\nC(s)"

  # Elevator actuator
  shape actuator as @transfer-fn label: "Actuator\n1/(τs+1)"

  # Aircraft dynamics
  shape aircraft as @transfer-fn label: "Aircraft\nG(s)"

  # Pitch angle sensor
  shape gyro as @gain label: "Kg"

  # Output
  shape theta as @box label: "θ"

  # Disturbance (wind)
  shape wind as @box label: "Wind"
  shape wind_sum as @summing-junction label: "Σ"

  # Connections
  theta_ref -> error label: "+"
  error -> autopilot
  autopilot -> actuator
  actuator -> wind_sum label: "+"
  wind -> wind_sum label: "+"
  wind_sum -> aircraft
  aircraft -> theta
  theta -> gyro
  gyro -> error label: "-"
```

## Export Options

### LaTeX/TikZ

Generate publication-quality diagrams for papers:

```latex
\begin{tikzpicture}[auto, node distance=2cm]
  \node [input] (input) {$R(s)$};
  \node [sum, right of=input] (sum) {$\Sigma$};
  \node [block, right of=sum] (controller) {$C(s)$};
  \node [block, right of=controller] (plant) {$G(s)$};
  \node [output, right of=plant] (output) {$Y(s)$};

  \draw [->] (input) -- (sum);
  \draw [->] (sum) -- (controller);
  \draw [->] (controller) -- (plant);
  \draw [->] (plant) -- (output);
  \draw [->] (output) |- (sum) node[near end] {$-$};
\end{tikzpicture}
```

### Simulink

Generate `.mdl` files for MATLAB Simulink:

- Drag-and-drop compatible
- Preserves transfer functions
- Ready for simulation
- Includes feedback loops

```bash
# Export to Simulink
runiq pid-controller.runiq --export simulink -o pid.mdl

# Open in MATLAB
matlab -r "open_system('pid.mdl')"
```

## Analysis Methods

### Frequency Response

**Bode Plot**: Magnitude and phase vs. frequency

- Gain margin
- Phase margin
- Crossover frequencies

**Nyquist Plot**: Polar plot in complex plane

- Stability analysis
- Encirclements of -1 point

### Time Response

**Step Response**: System response to unit step

- Rise time
- Settling time
- Overshoot
- Steady-state error

**Impulse Response**: Response to delta function

- System characterization
- Natural frequencies

## Best Practices

::: tip Signal Flow

- Use **LR** (left-right) direction for forward paths
- Use **TB** (top-bottom) for hierarchical systems
- Place feedback paths below forward paths
  :::

::: tip Transfer Function Labels
Use proper mathematical notation:

```runiq
shape tf as @transfer-fn label: "K/(τs+1)"
shape tf2 as @transfer-fn label: "ωₙ²/(s²+2ζωₙs+ωₙ²)"
```

Support Unicode: τ, ω, ζ, θ, ϕ
:::

::: tip Summing Junctions
Always label inputs with signs:

```runiq
ref -> sum label: "+"
feedback -> sum label: "-"
```

:::

## Next Steps

- [Electrical Circuits →](/examples/electrical) - Analog schematics
- [Digital Logic →](/examples/digital) - Gate-level design
- [Flowcharts →](/examples/flowcharts) - Process flows

---

## Download Examples

All example `.runiq` files are available in the [GitHub repository](https://github.com/jgreywolf/runiq/tree/main/examples/block-diagrams).

```bash
git clone https://github.com/jgreywolf/runiq.git
cd runiq/examples/block-diagrams
```
