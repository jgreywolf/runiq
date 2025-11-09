---
title: Quantum Circuits
description: Design quantum circuits with qubits, gates, measurements, and barriers following IBM Qiskit visual standards for quantum computing.
lastUpdated: 2025-01-09
---

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
diagram "Bell State Circuit" {

    style H0 fill:"#e8f5e9" stroke:"#000"
    style control0 fill:"#333" stroke:"#000"
    style target1 fill:"#fff" stroke:"#000"

    shape q0 as @qubitWire label:"q0" style: H0
    shape q1 as @qubitWire label:"q1" style: control0
    shape h as @gateH label:"H"
    shape cnot as @cnotTarget label:"⊕"
    shape ctrl as @controlDot label:"●"
    shape m0 as @measurement label:"M"
    shape m1 as @measurement label:"M"

    q0 -> h
    h -> ctrl
    ctrl -> m0
    q1 -> cnot
    cnot -> m1
}
```

**Result**: Creates entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2

---

## Available Quantum Gates

### Single-Qubit Gates

#### Pauli Gates (Basis Gates)

| Gate  | Shape ID | Size    | Description           | Color     |
| ----- | -------- | ------- | --------------------- | --------- |
| **X** | `gateX`  | 20×20px | Bit flip (NOT gate)   | Light red |
| **Y** | `gateY`  | 20×20px | Bit + phase flip      | Light red |
| **Z** | `gateZ`  | 20×20px | Phase flip (1⟩ → -1⟩) | Light red |

**Usage**:

```runiq
diagram "Pauli Gates" {
  shape X_gate as @gateX label: "X" fill: "#ffebee" stroke: "#000"
  shape Y_gate as @gateY label: "Y" fill: "#ffebee" stroke: "#000"
  shape Z_gate as @gateZ label: "Z" fill: "#ffebee" stroke: "#000"
}
```

**Quantum Operations**:

- **X gate**: |0⟩ → |1⟩, |1⟩ → |0⟩ (classical NOT)
- **Y gate**: |0⟩ → i|1⟩, |1⟩ → -i|0⟩
- **Z gate**: |0⟩ → |0⟩, |1⟩ → -|1⟩ (phase flip)

---

#### Hadamard Gate (Superposition)

| Gate  | Shape ID | Size    | Description                 | Color       |
| ----- | -------- | ------- | --------------------------- | ----------- |
| **H** | `gateH`  | 20×20px | Creates equal superposition | Light green |

**Usage**:

```runiq
diagram "Hadamard Gate" {
  shape H_gate as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
}
```

**Quantum Operation**:

- |0⟩ → (|0⟩ + |1⟩)/√2
- |1⟩ → (|0⟩ - |1⟩)/√2

**Key Fact**: Hadamard is its own inverse (H·H = I)

---

#### Phase Gates

| Gate  | Shape ID | Size    | Description               | Color        |
| ----- | -------- | ------- | ------------------------- | ------------ |
| **S** | `gateS`  | 20×20px | Phase gate (π/2 rotation) | Light yellow |
| **T** | `gateT`  | 20×20px | π/8 gate (π/4 rotation)   | Light yellow |

**Usage**:

```runiq
diagram "Phase Gates" {
  shape S_gate as @gateS label: "S" fill: "#fff9c4" stroke: "#000"
  shape T_gate as @gateT label: "T" fill: "#fff9c4" stroke: "#000"
}
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

| Component | Shape ID     | Size  | Description                                  |
| --------- | ------------ | ----- | -------------------------------------------- |
| **●**     | `controlDot` | 8×8px | Marks control qubit in controlled operations |

**Usage**:

```runiq
diagram "Control Dot" {
  shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"
}
```

**Function**: Indicates which qubit controls the operation. Gate only applies to target if control qubit is |1⟩.

---

#### CNOT Target

| Component | Shape ID     | Size    | Description                        |
| --------- | ------------ | ------- | ---------------------------------- |
| **⊕**     | `cnotTarget` | 16×16px | Target of controlled-NOT operation |

**Usage**:

```runiq
diagram "CNOT Gate" {
  shape targetId as @cnotTarget label: "⊕" fill: "#fff" stroke: "#000"
  shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"

  controlId -> targetId
}
```

**CNOT Operation**:

- If control = |0⟩: target unchanged
- If control = |1⟩: target flipped (X gate applied)
- Creates entanglement between qubits

---

#### SWAP Symbol

| Component | Shape ID | Size    | Description                    |
| --------- | -------- | ------- | ------------------------------ |
| **✕**     | `swapX`  | 12×12px | Exchanges states of two qubits |

**Usage**:

```runiq
diagram "SWAP Gate" {
  shape swap0 as @swapX label: "⨉" fill: "#fff" stroke: "#000"
  shape swap2 as @swapX label: "⨉" fill: "#fff" stroke: "#000"

  swap0 -> swap2
}
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
diagram "Measurement" {
  shape M0 as @measurement label: "M0" fill: "#e3f2fd" stroke: "#000"
  shape M1 as @measurement label: "M1" fill: "#e3f2fd" stroke: "#000"
}
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
diagram "Barrier Example" {
  shape barrier1 as @barrier label: "|"
  shape barrier2 as @barrier label: "|"
  shape q0 as @qubitWire label: "q0"
  shape H0 as @gateH label: "H"
  shape oracle as @rectangle label: "Oracle"

  q0 -> H0 -> barrier1 -> oracle
}
```

**Purpose**:

- Prevents quantum compiler from reordering gates across barrier
- Useful for separating circuit sections
- Marks algorithmic phases (preparation, oracle, diffusion)
- Visual separator in complex circuits

---

#### Qubit Wire

| Component | Shape ID    | Size   | Description                                  |
| --------- | ----------- | ------ | -------------------------------------------- |
| **—**     | `qubitWire` | 50×1px | Horizontal line representing qubit evolution |

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
diagram "Entanglement" {
    direction TB

    shape q0 as @qubitWire label: "Qubit 0: |0⟩"
    shape q1 as @qubitWire label: "Qubit 1: |0⟩"
    shape H0 as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
    shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"
    shape targetId as @cnotTarget label: "⊕" fill: "#fff" stroke: "#000"

    q0 -> H0 -> controlId
    q1 -> targetId
    controlId -> targetId
}
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
diagram "Superposition" {
    direction LR

    shape q0 as @qubitWire label: "q0"
    shape q1 as @qubitWire label: "q1"
    shape q2 as @qubitWire label: "q2"
    shape H0 as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
    shape H1 as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
    shape H2 as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"

    q0 -> H0
    q1 -> H1
    q2 -> H2
}
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
diagram "Controlled-Z Gate" {
    direction LR

    shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"
    shape Z_gate as @gateZ label: "Z" fill: "#ffebee" stroke: "#000"

    controlId -> Z_gate
}
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
diagram "Phase Kickback" {
    direction LR

    shape q0 as @qubitWire label: "q0"
    shape q1 as @qubitWire label: "q1"
    shape H_control as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
    shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"
    shape target_init as @gateX label: "X" fill: "#ffebee" stroke: "#000"
    shape X_target as @gateX label: "X" fill: "#ffebee" stroke: "#000"

    q0 -> H_control -> controlId
    q1 -> target_init -> X_target
    controlId -> X_target
}
```

**Key Insight**: Used in quantum algorithms (Grover, Shor) to mark states via phase.

---

### Pattern 5: Measurement + Classical Control

Measure qubits and apply gates conditionally based on classical results.

```runiq
diagram "Measurement + Classical Control" {
    direction LR

    shape q0 as @qubitWire label: "q0"
    shape q1 as @qubitWire label: "q1"
    shape q2 as @qubitWire label: "q2"
    shape M0 as @measurement label: "M0" fill: "#e3f2fd" stroke: "#000"
    shape M1 as @measurement label: "M1" fill: "#e3f2fd" stroke: "#000"
    shape X_gate as @gateX label: "X" fill: "#ffebee" stroke: "#000"
    shape Z_gate as @gateZ label: "Z" fill: "#ffebee" stroke: "#000"

    q0 -> M0
    q1 -> M1
    q2 -> X_gate -> Z_gate
    M1 -> X_gate label: "if M1=1"
    M0 -> Z_gate label: "if M0=1"
}
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
diagram "Gate Ordering" {
    direction LR
    shape q0 as @qubitWire label: "q0"
    shape H as @gateH label: "H"
    shape X as @gateX label: "X"
    shape Z as @gateZ label: "Z"
    shape M as @measurement label: "M"

    q0 -> H -> X -> Z -> M
}
```

❌ **DON'T**: Place gates out of order (measurement should be last)

---

### 2. Vertical Alignment

✅ **DO**: Align multi-qubit gates vertically

```runiq
diagram "Vertical Alignment" {
    direction TB
    shape controlId as @controlDot label: "●" fill: "#000" stroke: "#000"
    shape targetId as @cnotTarget label: "⊕" fill: "#fff" stroke: "#000"

    controlId -> targetId
}
```

❌ **DON'T**: Misalign control and target (makes connections unclear)

---

### 3. Label Gates Clearly

✅ **DO**: Use descriptive labels

```runiq
diagram "Clear Labels" {
    shape H_init as @gateH label: "H (init)" fill: "#e8f5e9" stroke: "#000"
    shape H_diff as @gateH label: "H (diff)" fill: "#e8f5e9" stroke: "#000"
}
```

❌ **DON'T**: Use ambiguous labels like H1, H2 without context

---

### 4. Use Barriers to Separate Phases

✅ **DO**: Mark algorithm phases

```runiq
diagram "Grover's Algorithm Phases" {
    direction LR
    shape q0 as @qubitWire label: "q0"
    shape H_init as @gateH label: "H"
    shape barrier1 as @barrier label: "|"
    shape oracle as @rectangle label: "Oracle"
    shape barrier2 as @barrier label: "|"
    shape diffusion as @rectangle label: "Diffusion"
    shape barrier3 as @barrier label: "|"
    shape M as @measurement label: "M"

    q0 -> H_init -> barrier1 -> oracle -> barrier2 -> diffusion -> barrier3 -> M
}
```

---

### 5. Color Code by Function

✅ **DO**: Use consistent colors

```runiq
diagram "Color Coding" {
    shape H_gate as @gateH label: "H" fill: "#e8f5e9" stroke: "#000"
    shape X_gate as @gateX label: "X" fill: "#ffebee" stroke: "#000"
    shape S_gate as @gateS label: "S" fill: "#fff9c4" stroke: "#000"
    shape M_gate as @measurement label: "M" fill: "#e3f2fd" stroke: "#000"
}
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
