# Quantum Circuits Guide

**Status**: Production Ready  
**Last Updated**: October 17, 2025  
**Visual Standard**: IBM Qiskit

## Overview

Runiq supports quantum circuit diagrams in the style of IBM Qiskit, the industry-leading quantum computing framework. Quantum circuits visualize quantum algorithms by showing quantum gates operating on qubits over time.

### What are Quantum Circuits?

Unlike classical circuits that process bits (0 or 1), quantum circuits process **qubits** that can exist in superposition states. Quantum circuits show:

- **Qubit wires**: Horizontal lines representing quantum state evolution
- **Quantum gates**: Operations that manipulate qubit states
- **Multi-qubit gates**: Operations involving multiple qubits (entanglement)
- **Measurements**: Converting quantum states to classical bits
- **Time evolution**: Gates applied left-to-right in sequence

---

## Quick Start

### Simple Bell State Circuit

```runiq
graph TD
    q0["Qubit 0: |0⟩"]
    q1["Qubit 1: |0⟩"]

    H0[gate-h:H]
    control0[control-dot]
    target1[cnot-target]

    q0 --> H0 --> control0
    q1 --> target1
    control0 -.-> target1

style H0 fill:#e8f5e9,stroke:#000
style control0 fill:#000,stroke:#000
style target1 fill:#fff,stroke:#000
```

**Result**: Creates entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2

---

## Available Quantum Gates

### Single-Qubit Gates

#### Pauli Gates (Basis Gates)

| Gate  | Shape ID | Size    | Description         | Color     |
| ----- | -------- | ------- | ------------------- | --------- | --- | --------- |
| **X** | `gate-x` | 20×20px | Bit flip (NOT gate) | Light red |
| **Y** | `gate-y` | 20×20px | Bit + phase flip    | Light red |
| **Z** | `gate-z` | 20×20px | Phase flip (        | 1⟩ → -    | 1⟩) | Light red |

**Usage**:

```runiq
X_gate[gate-x:X]
Y_gate[gate-y:Y]
Z_gate[gate-z:Z]

style X_gate fill:#ffebee,stroke:#000
```

**Quantum Operations**:

- **X gate**: |0⟩ → |1⟩, |1⟩ → |0⟩ (classical NOT)
- **Y gate**: |0⟩ → i|1⟩, |1⟩ → -i|0⟩
- **Z gate**: |0⟩ → |0⟩, |1⟩ → -|1⟩ (phase flip)

---

#### Hadamard Gate (Superposition)

| Gate  | Shape ID | Size    | Description                 | Color       |
| ----- | -------- | ------- | --------------------------- | ----------- |
| **H** | `gate-h` | 20×20px | Creates equal superposition | Light green |

**Usage**:

```runiq
H_gate[gate-h:H]
style H_gate fill:#e8f5e9,stroke:#000
```

**Quantum Operation**:

- |0⟩ → (|0⟩ + |1⟩)/√2
- |1⟩ → (|0⟩ - |1⟩)/√2

**Key Fact**: Hadamard is its own inverse (H·H = I)

---

#### Phase Gates

| Gate  | Shape ID | Size    | Description               | Color        |
| ----- | -------- | ------- | ------------------------- | ------------ |
| **S** | `gate-s` | 20×20px | Phase gate (π/2 rotation) | Light yellow |
| **T** | `gate-t` | 20×20px | π/8 gate (π/4 rotation)   | Light yellow |

**Usage**:

```runiq
S_gate[gate-s:S]
T_gate[gate-t:T]

style S_gate fill:#fff9c4,stroke:#000
style T_gate fill:#fff9c4,stroke:#000
```

**Quantum Operations**:

- **S gate**: |0⟩ → |0⟩, |1⟩ → i|1⟩ (adds π/2 phase)
- **T gate**: |0⟩ → |0⟩, |1⟩ → e^(iπ/4)|1⟩ (adds π/4 phase)

**Relationships**:

- S = T·T (two T gates equal one S gate)
- Z = S·S (two S gates equal one Z gate)

---

### Multi-Qubit Components

#### Control Dot

| Component | Shape ID      | Size  | Description                                  |
| --------- | ------------- | ----- | -------------------------------------------- |
| **●**     | `control-dot` | 8×8px | Marks control qubit in controlled operations |

**Usage**:

```runiq
control[control-dot]
style control fill:#000,stroke:#000
```

**Function**: Indicates which qubit controls the operation. Gate only applies to target if control qubit is |1⟩.

---

#### CNOT Target

| Component | Shape ID      | Size    | Description                        |
| --------- | ------------- | ------- | ---------------------------------- |
| **⊕**     | `cnot-target` | 16×16px | Target of controlled-NOT operation |

**Usage**:

```runiq
target[cnot-target]
control[control-dot]

control -.-> target  # Vertical connection

style target fill:#fff,stroke:#000
style control fill:#000,stroke:#000
```

**CNOT Operation**:

- If control = |0⟩: target unchanged
- If control = |1⟩: target flipped (X gate applied)
- Creates entanglement between qubits

---

#### SWAP Symbol

| Component | Shape ID | Size    | Description                    |
| --------- | -------- | ------- | ------------------------------ |
| **✕**     | `swap-x` | 12×12px | Exchanges states of two qubits |

**Usage**:

```runiq
swap0[swap-x:⨉]
swap2[swap-x:⨉]

swap0 -.-> swap2  # Vertical connection

style swap0 fill:#fff,stroke:#000
style swap2 fill:#fff,stroke:#000
```

**SWAP Operation**:

- Exchanges quantum states of two qubits
- |01⟩ → |10⟩, |10⟩ → |01⟩
- Useful for qubit reordering (e.g., in QFT)

---

### Measurement & Utilities

#### Measurement

| Component | Shape ID      | Size    | Description                    | Color      |
| --------- | ------------- | ------- | ------------------------------ | ---------- |
| **M**     | `measurement` | 25×20px | Measures qubit → classical bit | Light blue |

**Usage**:

```runiq
M0[measurement:M0]
M1[measurement:M1]

style M0 fill:#e3f2fd,stroke:#000
```

**Measurement Operation**:

- Collapses quantum superposition to classical bit
- Probabilistic: P(0) = |α|², P(1) = |β|² for |ψ⟩ = α|0⟩ + β|1⟩
- Irreversible (destroys superposition)
- Outputs classical bit (0 or 1)

---

#### Barrier

| Component | Shape ID  | Size   | Description                           |
| --------- | --------- | ------ | ------------------------------------- |
| **\|**    | `barrier` | 2×40px | Prevents gate reordering optimization |

**Usage**:

```runiq
barrier1[barrier]
barrier2[barrier]

q0 --> H0 --> barrier1 --> oracle
q1 --> H1 --> barrier1 --> oracle
```

**Purpose**:

- Prevents quantum compiler from reordering gates across barrier
- Useful for separating circuit sections
- Marks algorithmic phases (preparation, oracle, diffusion)
- Visual separator in complex circuits

---

#### Qubit Wire

| Component | Shape ID     | Size   | Description                                  |
| --------- | ------------ | ------ | -------------------------------------------- |
| **—**     | `qubit-wire` | 50×1px | Horizontal line representing qubit evolution |

**Usage**: Automatically rendered as connections between gates

**Convention**:

- Single solid line = qubit wire (quantum state)
- Double line = classical wire (after measurement)
- Time flows left-to-right along wire

---

## Circuit Patterns

### Pattern 1: Entanglement (Bell States)

Creates maximally entangled two-qubit states.

```runiq
graph TD
    q0["Qubit 0: |0⟩"]
    q1["Qubit 1: |0⟩"]

    H0[gate-h:H]
    control[control-dot]
    target[cnot-target]

    q0 --> H0 --> control
    q1 --> target
    control -.-> target

style H0 fill:#e8f5e9
style control fill:#000
```

**Four Bell States**:

1. **|Φ+⟩** = (|00⟩ + |11⟩)/√2: H on q0, CNOT(q0→q1)
2. **|Φ-⟩** = (|00⟩ - |11⟩)/√2: H on q0, Z on q0, CNOT(q0→q1)
3. **|Ψ+⟩** = (|01⟩ + |10⟩)/√2: X on q1, H on q0, CNOT(q0→q1)
4. **|Ψ-⟩** = (|01⟩ - |10⟩)/√2: X on q1, H on q0, Z on q0, CNOT(q0→q1)

---

### Pattern 2: Superposition (Equal Amplitude)

Creates equal superposition of all basis states.

```runiq
# 3-qubit equal superposition
H0[gate-h:H]
H1[gate-h:H]
H2[gate-h:H]

q0 --> H0
q1 --> H1
q2 --> H2
```

**Result**: |000⟩ → (|000⟩ + |001⟩ + |010⟩ + ... + |111⟩)/√8

**Use cases**:

- Grover's search initialization
- Quantum random number generation
- Amplitude amplification algorithms

---

### Pattern 3: Controlled Operations

Apply gate to target only if control is |1⟩.

```runiq
# Controlled-Z (CZ gate)
control[control-dot]
Z_gate[gate-z:Z]

control -.-> Z_gate

style control fill:#000
style Z_gate fill:#ffebee
```

**Common Controlled Gates**:

- **CNOT**: Controlled-X (⊕ symbol)
- **CZ**: Controlled-Z
- **CH**: Controlled-Hadamard
- **CS**: Controlled-S (phase)
- **CT**: Controlled-T

---

### Pattern 4: Phase Kickback

Control qubit acquires phase from controlled operation on target in superposition.

```runiq
# Phase kickback example
H_control[gate-h:H]
control[control-dot]
X_target[gate-x:X]
target_init[gate-x:X]

q0 --> H_control --> control
q1 --> target_init --> X_target

control -.-> X_target
```

**Key Insight**: Used in quantum algorithms (Grover, Shor) to mark states via phase.

---

### Pattern 5: Measurement + Classical Control

Measure qubits and apply gates conditionally based on classical results.

```runiq
M0[measurement:M0]
M1[measurement:M1]
X_gate[gate-x:X]
Z_gate[gate-z:Z]

q0 --> M0
q1 --> M1
q2 --> X_gate --> Z_gate

M1 -.->|"if M1=1"| X_gate
M0 -.->|"if M0=1"| Z_gate
```

**Use cases**:

- Quantum teleportation corrections
- Quantum error correction
- Adaptive measurements

---

## Best Practices

### 1. Gate Ordering

✅ **DO**: Order gates left-to-right (time sequence)

```runiq
q0 --> H --> X --> Z --> M
```

❌ **DON'T**: Place gates out of order

```runiq
q0 --> M --> H  # Measurement should be last!
```

---

### 2. Vertical Alignment

✅ **DO**: Align multi-qubit gates vertically

```runiq
control[control-dot]
target[cnot-target]

control -.-> target  # Clear vertical connection
```

❌ **DON'T**: Misalign control and target

```runiq
# Hard to see which qubits are connected
```

---

### 3. Label Gates Clearly

✅ **DO**: Use descriptive labels

```runiq
H_init[gate-h:H]  # Initialization
H_diff[gate-h:H]  # Diffusion operator
```

❌ **DON'T**: Use ambiguous labels

```runiq
H1[gate-h:H]
H2[gate-h:H]  # Which is which?
```

---

### 4. Use Barriers to Separate Phases

✅ **DO**: Mark algorithm phases

```runiq
# Grover's algorithm
barrier1[barrier]  # After initialization
barrier2[barrier]  # After oracle
barrier3[barrier]  # After diffusion

q0 --> H_init --> barrier1 --> oracle --> barrier2 --> diffusion --> barrier3 --> M
```

---

### 5. Color Code by Function

✅ **DO**: Use consistent colors

```runiq
style H_gate fill:#e8f5e9  # Green for Hadamard
style X_gate fill:#ffebee  # Red for Pauli gates
style S_gate fill:#fff9c4  # Yellow for phase gates
style M_gate fill:#e3f2fd  # Blue for measurement
```

**Suggested Color Scheme**:

- **Green** (#e8f5e9): Hadamard (superposition)
- **Red** (#ffebee): Pauli gates (X, Y, Z)
- **Yellow** (#fff9c4): Phase gates (S, T)
- **Blue** (#e3f2fd): Measurement
- **Purple** (#f3e5f5): Multi-qubit gates
- **Black** (#000): Control dots

---

## Common Algorithms

### 1. Bell State Preparation

**File**: `examples/quantum-circuits/bell-state.runiq`  
**Qubits**: 2  
**Gates**: H, CNOT  
**Purpose**: Create entangled pair

---

### 2. Quantum Teleportation

**File**: `examples/quantum-circuits/quantum-teleportation.runiq`  
**Qubits**: 3  
**Gates**: H, CNOT, X, Z, Measurement  
**Purpose**: Transfer quantum state via entanglement

---

### 3. Grover's Search

**File**: `examples/quantum-circuits/grover-search.runiq`  
**Qubits**: 3  
**Gates**: H, Oracle, X, Multi-controlled Z  
**Purpose**: Search unsorted database with quadratic speedup

---

### 4. Quantum Fourier Transform

**File**: `examples/quantum-circuits/quantum-fourier-transform.runiq`  
**Qubits**: 3  
**Gates**: H, S, T, SWAP  
**Purpose**: Quantum version of FFT

---

## Technical Notes

### Qubit Numbering

- **Convention**: Qubits numbered top-to-bottom as q0, q1, q2, ...
- **State notation**: |q₀q₁q₂⟩ where leftmost is q₀
- **Binary mapping**: |101⟩ = |q₀=1, q₁=0, q₂=1⟩ = 5 in decimal

### Time Evolution

- **Left-to-right**: Gates applied sequentially from left to right
- **No signal delay**: Gates are instantaneous (idealized model)
- **Circuit depth**: Number of time steps (longest path through circuit)

### Multi-Qubit Gates

- **Control → Target**: Vertical line connects control (●) to target
- **Multiple controls**: Stack control dots vertically (Toffoli, Fredkin)
- **SWAP**: Connect two ✕ symbols with vertical line

### Measurement Convention

- **Before measurement**: Single solid line (qubit wire)
- **After measurement**: Double solid line (classical bit)
- **Irreversibility**: Cannot reverse measurement (no-cloning theorem)

---

## Limitations

### What Runiq Does

✅ **Visualizes** quantum circuit structure  
✅ **Shows** gate sequences and connections  
✅ **Demonstrates** algorithm flow  
✅ **Educates** on quantum computing concepts

### What Runiq Does NOT Do

❌ **Simulate** quantum state evolution  
❌ **Calculate** measurement probabilities  
❌ **Execute** quantum algorithms  
❌ **Model** quantum noise/decoherence

**For actual quantum computation**, use:

- **IBM Qiskit** (Python) - https://qiskit.org/
- **Google Cirq** (Python) - https://quantumai.google/cirq
- **Microsoft Q#** (Q#) - https://azure.microsoft.com/quantum
- **Rigetti Forest** (Python) - https://www.rigetti.com/

---

## Further Resources

### Online Courses

- [IBM Quantum Learning](https://learning.quantum.ibm.com/)
- [Qiskit Textbook](https://learn.qiskit.org/)
- [Microsoft Quantum Katas](https://quantum.microsoft.com/en-us/experience/quantum-katas)

### Books

- Nielsen & Chuang - _Quantum Computation and Quantum Information_
- Yanofsky & Mannucci - _Quantum Computing for Computer Scientists_
- Mermin - _Quantum Computer Science_

### Interactive Tools

- [Quirk](https://algassert.com/quirk) - Quantum circuit simulator
- [IBM Quantum Composer](https://quantum-computing.ibm.com/) - Visual circuit builder
- [Q-CTRL Visualizer](https://q-ctrl.com/) - Quantum gate visualizations

### Communities

- [Quantum Computing Stack Exchange](https://quantumcomputing.stackexchange.com/)
- [Qiskit Slack](https://qiskit.org/slack)
- [r/QuantumComputing](https://reddit.com/r/quantumcomputing)

---

## FAQ

**Q: Can I run these circuits on a real quantum computer?**  
A: Runiq provides visualizations only. Export the circuit structure and recreate in Qiskit/Cirq for execution on IBM/Google quantum hardware.

**Q: Why do some gates have funny symbols (⊕, ✕)?**  
A: These are standard quantum computing notations:

- ⊕ = XOR (CNOT target)
- ✕ = SWAP
- ● = Control qubit
- | = Barrier

**Q: What's the difference between classical and quantum gates?**  
A: Classical gates are deterministic and irreversible. Quantum gates are:

- Reversible (unitary transformations)
- Can create superposition
- Can create entanglement
- Preserve quantum information

**Q: How do I create custom quantum gates?**  
A: Combine primitive gates (X, Y, Z, H, S, T, CNOT) to create any quantum operation. All single-qubit gates can be decomposed into rotations. All multi-qubit gates can be decomposed into CNOT + single-qubit gates.

**Q: What's the maximum number of qubits I can visualize?**  
A: No hard limit, but readability decreases beyond 5-6 qubits. For large circuits, consider:

- Breaking into subcircuits
- Using circuit folding
- Focusing on key algorithmic sections

---

**Last Updated**: October 17, 2025  
**Runiq Version**: 0.1.0+  
**Visual Standard**: IBM Qiskit  
**Maintained by**: Justin Greywolf
