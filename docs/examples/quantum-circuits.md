---
title: Quantum Circuit Examples
description: Quantum computing circuit diagrams with IBM Qiskit-style visualization
lastUpdated: 2025-01-21
---

# Quantum Circuit Examples

Quantum circuits visualize quantum algorithms and operations using the standard IBM Qiskit notation. They're essential for quantum algorithm design, education, and quantum computing research.

## What are Quantum Circuits?

Quantum circuits represent quantum computations as sequences of quantum gates applied to qubits (quantum bits). Unlike classical bits that are 0 or 1, qubits exist in superposition states. Quantum gates manipulate these states to perform quantum algorithms.

Runiq follows IBM Qiskit's visual conventions:

- Horizontal lines represent qubit wires
- Boxes represent single-qubit gates
- Connected symbols represent multi-qubit operations
- Measurement boxes extract classical information

## Basic Circuit Elements

### Qubit Wires

Horizontal lines representing qubits in their initial states:

```runiq
diagram "Qubit Initialization" {
  direction LR

  shape q0 as @qubitWire label: "q0: |0⟩"
  shape q1 as @qubitWire label: "q1: |1⟩"
  shape q2 as @qubitWire label: "q2: |+⟩"
}
```

**Common Initial States:**

- `|0⟩` - Computational basis state 0 (ground state)
- `|1⟩` - Computational basis state 1 (excited state)
- `|+⟩` - Superposition state (|0⟩ + |1⟩)/√2
- `|-⟩` - Superposition state (|0⟩ - |1⟩)/√2
- `|ψ⟩` - Generic unknown state

## Single-Qubit Gates

### Pauli Gates

Basic rotation gates that are their own inverses:

```runiq
diagram "Pauli Gates" {
  direction LR

  shape q0 as @qubitWire label: "q0: |0⟩"
  shape X as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"

  shape q1 as @qubitWire label: "q1: |0⟩"
  shape Y as @gateY label: "Y" fill: "#ffebee" strokeColor: "#000"

  shape q2 as @qubitWire label: "q2: |0⟩"
  shape Z as @gateZ label: "Z" fill: "#ffebee" strokeColor: "#000"

  q0 -> X
  q1 -> Y
  q2 -> Z
}
```

**Gate Operations:**

- **X (NOT)**: Flips |0⟩ ↔ |1⟩ (bit flip)
- **Y**: Combination rotation (bit + phase flip)
- **Z**: Phase flip |1⟩ → -|1⟩, leaves |0⟩ unchanged

### Hadamard Gate

Creates superposition - the most important gate in quantum computing:

```runiq
diagram "Superposition with Hadamard" {
  direction LR

  shape q0 as @qubitWire label: "q0: |0⟩"
  shape H as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  q0 -> H

  # Result: H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
  # Equal probability of measuring 0 or 1
}
```

**Hadamard Operations:**

- H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2
- H|1⟩ = |-⟩ = (|0⟩ - |1⟩)/√2
- H|+⟩ = |0⟩
- H|-⟩ = |1⟩

### Phase Gates

Rotation gates that add phase without changing probability:

```runiq
diagram "Phase Gates" {
  direction LR

  shape q0 as @qubitWire label: "q0: |+⟩"
  shape S as @gateS label: "S" fill: "#e3f2fd" strokeColor: "#000"

  shape q1 as @qubitWire label: "q1: |+⟩"
  shape T as @gateT label: "T" fill: "#e3f2fd" strokeColor: "#000"

  q0 -> S
  q1 -> T
}
```

**Phase Operations:**

- **S (Phase gate)**: Adds π/2 phase to |1⟩
- **T (π/8 gate)**: Adds π/4 phase to |1⟩
- Used for precise quantum state manipulation

## Multi-Qubit Operations

### CNOT Gate (Controlled-NOT)

The fundamental two-qubit gate for creating entanglement:

```runiq
diagram "CNOT Gate" {
  direction LR

  shape q0 as @qubitWire label: "q0: control"
  shape q1 as @qubitWire label: "q1: target"

  shape control as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  q0 -> control
  q1 -> target
  control -> target
}
```

**CNOT Operation:**

- If control qubit is |1⟩, flip target qubit
- If control qubit is |0⟩, leave target unchanged
- Creates entanglement between qubits

### SWAP Gate

Exchanges quantum states between two qubits:

```runiq
diagram "SWAP Gate" {
  direction LR

  shape q0 as @qubitWire label: "q0: |ψ⟩"
  shape q1 as @qubitWire label: "q1: |φ⟩"

  shape swap0 as @swapX label: "×" fill: "#fff" strokeColor: "#000"
  shape swap1 as @swapX label: "×" fill: "#fff" strokeColor: "#000"

  q0 -> swap0
  q1 -> swap1
  swap0 -> swap1
}
```

### Controlled Gates

Any gate can be controlled by another qubit:

```runiq
diagram "Controlled-Z Gate" {
  direction LR

  shape q0 as @qubitWire label: "q0: control"
  shape q1 as @qubitWire label: "q1: target"

  shape control as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape Z as @gateZ label: "Z" fill: "#ffebee" strokeColor: "#000"

  q0 -> control
  q1 -> Z
  control -> Z
}
```

## Measurement and Barriers

### Measurement

Collapses quantum state to classical bit:

```runiq
diagram "Measurement" {
  direction LR

  shape q0 as @qubitWire label: "q0: |+⟩"
  shape H as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape M as @measurement label: "M" fill: "#e3f2fd" strokeColor: "#000"

  q0 -> H -> M

  # Result: 50% chance of measuring 0, 50% chance of measuring 1
}
```

### Barriers

Prevent gate reordering across time steps:

```runiq
diagram "Circuit Barriers" {
  direction LR

  shape q0 as @qubitWire label: "q0"
  shape q1 as @qubitWire label: "q1"

  shape H0 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape H1 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  shape barrier as @barrier label: "|"

  shape X0 as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"
  shape X1 as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"

  q0 -> H0 -> barrier -> X0
  q1 -> H1 -> barrier -> X1
}
```

## Famous Quantum Algorithms

### Bell State (Quantum Entanglement)

Creates the simplest entangled state:

```runiq
diagram "Bell State |Φ+⟩" {
  direction LR

  shape q0 as @qubitWire label: "q0: |0⟩"
  shape q1 as @qubitWire label: "q1: |0⟩"

  # Step 1: Create superposition on q0
  shape H as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  # Step 2: Entangle q0 and q1
  shape control as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  q0 -> H -> control
  q1 -> target
  control -> target

  # Result: |Φ+⟩ = (|00⟩ + |11⟩)/√2
  # Measuring q0 determines q1 instantly (entanglement)
}
```

### Quantum Teleportation

Teleports quantum state using entanglement and classical communication:

```runiq
diagram "Quantum Teleportation" {
  direction LR

  # Alice has q0 (unknown state) and q1
  # Bob has q2
  # q1 and q2 are entangled (Bell pair)

  shape q0 as @qubitWire label: "q0: |ψ⟩ (Alice)"
  shape q1 as @qubitWire label: "q1: |0⟩ (Alice)"
  shape q2 as @qubitWire label: "q2: |0⟩ (Bob)"

  # Create EPR pair between q1 and q2
  shape H1_prep as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape control1_prep as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target2_prep as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  # Alice entangles q0 with q1
  shape control0 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target1 as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"
  shape H0 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  # Alice measures both qubits
  shape M0 as @measurement label: "M0" fill: "#e3f2fd" strokeColor: "#000"
  shape M1 as @measurement label: "M1" fill: "#e3f2fd" strokeColor: "#000"

  # Bob applies corrections based on measurements
  shape barrier1 as @barrier label: "|"
  shape X2 as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"
  shape Z2 as @gateZ label: "Z" fill: "#ffebee" strokeColor: "#000"

  # Circuit connections
  q0 -> control0 -> H0 -> M0
  q1 -> H1_prep -> control1_prep -> target1 -> M1
  q2 -> target2_prep -> barrier1 -> X2 -> Z2

  control0 -> target1
  control1_prep -> target2_prep
  M1 -> X2 label: "if M1=1"
  M0 -> Z2 label: "if M0=1"

  # Result: q2 has the state |ψ⟩
}
```

### Quantum Fourier Transform (QFT)

Essential subroutine for Shor's algorithm and phase estimation:

```runiq
diagram "3-Qubit QFT" {
  direction LR

  shape q0 as @qubitWire label: "q0"
  shape q1 as @qubitWire label: "q1"
  shape q2 as @qubitWire label: "q2"

  # QFT on q0
  shape H0 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape S01 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape R2_01 as @gateS label: "S" fill: "#e3f2fd" strokeColor: "#000"
  shape T02 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape R3_02 as @gateT label: "T" fill: "#e3f2fd" strokeColor: "#000"

  # QFT on q1
  shape H1 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape S12 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape R2_12 as @gateS label: "S" fill: "#e3f2fd" strokeColor: "#000"

  # QFT on q2
  shape H2 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  # SWAP to reverse order
  shape swap01_a as @swapX label: "×" fill: "#fff" strokeColor: "#000"
  shape swap01_b as @swapX label: "×" fill: "#fff" strokeColor: "#000"

  q0 -> H0 -> S01 -> T02 -> swap01_a
  q1 -> R2_01 -> H1 -> S12
  q2 -> R3_02 -> R2_12 -> H2 -> swap01_b

  S01 -> R2_01
  T02 -> R3_02
  S12 -> R2_12
  swap01_a -> swap01_b
}
```

### Grover's Search Algorithm

Searches unsorted database in O(√N) time:

```runiq
diagram "Grover Iteration" {
  direction LR

  shape q0 as @qubitWire label: "q0"
  shape q1 as @qubitWire label: "q1"
  shape q2 as @qubitWire label: "q2: ancilla"

  # Step 1: Oracle (marks solution)
  shape oracle as @barrier label: "Oracle"

  # Step 2: Diffusion operator (amplifies marked state)
  shape H0_diff as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape H1_diff as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  shape X0_diff as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"
  shape X1_diff as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"

  shape control_diff as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target_diff as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  shape X0_diff2 as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"
  shape X1_diff2 as @gateX label: "X" fill: "#ffebee" strokeColor: "#000"

  shape H0_diff2 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"
  shape H1_diff2 as @gateH label: "H" fill: "#e8f5e9" strokeColor: "#000"

  q0 -> oracle -> H0_diff -> X0_diff -> control_diff -> X0_diff2 -> H0_diff2
  q1 -> oracle -> H1_diff -> X1_diff -> target_diff -> X1_diff2 -> H1_diff2
  q2 -> oracle

  control_diff -> target_diff
}
```

## Quantum Error Correction

### Bit Flip Code

Protects against X errors (bit flips):

```runiq
diagram "3-Qubit Bit Flip Code" {
  direction LR

  shape q0 as @qubitWire label: "q0: |ψ⟩ (data)"
  shape q1 as @qubitWire label: "q1: |0⟩ (ancilla)"
  shape q2 as @qubitWire label: "q2: |0⟩ (ancilla)"

  # Encoding
  shape cnot01 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target1 as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  shape cnot02 as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target2 as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  # Error channel (X error might occur)
  shape noise as @barrier label: "noise"

  # Decoding (majority vote)
  shape cnot01_dec as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target1_dec as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  shape cnot02_dec as @controlDot label: "●" fill: "#000" strokeColor: "#000"
  shape target2_dec as @cnotTarget label: "⊕" fill: "#fff" strokeColor: "#000"

  q0 -> cnot01 -> cnot02 -> noise -> cnot01_dec -> cnot02_dec
  q1 -> target1 -> noise -> target1_dec
  q2 -> target2 -> noise -> target2_dec

  cnot01 -> target1
  cnot02 -> target2
  cnot01_dec -> target1_dec
  cnot02_dec -> target2_dec
}
```

## Use Cases

### Quantum Algorithm Design

- Developing new quantum algorithms
- Testing gate sequences
- Optimizing circuit depth
- Studying algorithm complexity

### Quantum Education

- Teaching quantum mechanics concepts
- Illustrating superposition and entanglement
- Explaining quantum gates
- Demonstrating quantum algorithms

### Research and Development

- Quantum error correction codes
- Variational quantum algorithms (VQE, QAOA)
- Quantum machine learning
- Quantum chemistry simulations

### Hardware Implementation

- Circuit transpilation for real devices
- Gate scheduling and optimization
- Noise modeling and simulation
- Benchmarking quantum processors

## Best Practices

1. **Start Simple**: Begin with single-qubit gates before multi-qubit operations
2. **Initialize Clearly**: Always label qubit initial states (|0⟩, |1⟩, |+⟩, etc.)
3. **Use Barriers**: Separate logical circuit stages with barriers
4. **Label Measurements**: Indicate what measurement results mean
5. **Document Results**: Add comments explaining expected outcomes
6. **Follow Conventions**: Use IBM Qiskit visual standards for consistency
7. **Minimize Depth**: Reduce circuit depth for real quantum hardware

## Quantum Gate Reference

| Gate             | Symbol                        | Operation                | Use Case                       |
| ---------------- | ----------------------------- | ------------------------ | ------------------------------ |
| **X (NOT)**      | `@gateX`                      | Bit flip: \|0⟩ ↔ \|1⟩   | Logical NOT, state preparation |
| **Y**            | `@gateY`                      | Bit + phase flip         | Rotation operations            |
| **Z**            | `@gateZ`                      | Phase flip: \|1⟩ → -\|1⟩ | Phase corrections              |
| **H (Hadamard)** | `@gateH`                      | Creates superposition    | Most quantum algorithms        |
| **S (Phase)**    | `@gateS`                      | π/2 phase shift          | QFT, phase estimation          |
| **T (π/8)**      | `@gateT`                      | π/4 phase shift          | Universal gate set, QFT        |
| **CNOT**         | `@controlDot` + `@cnotTarget` | Controlled-NOT           | Entanglement, logic            |
| **SWAP**         | `@swapX` (pair)               | Exchange qubit states    | Qubit routing                  |
| **Measure**      | `@measurement`                | Collapse to classical    | Readout, mid-circuit           |

## Quantum State Notation

| Notation  | Name        | Description                        |
| --------- | ----------- | ---------------------------------- |
| **\|0⟩**  | Zero state  | Computational basis, ground state  |
| **\|1⟩**  | One state   | Computational basis, excited state |
| **\|+⟩**  | Plus state  | (\|0⟩ + \|1⟩)/√2, superposition    |
| **\|-⟩**  | Minus state | (\|0⟩ - \|1⟩)/√2, superposition    |
| **\|ψ⟩**  | Psi state   | Generic unknown quantum state      |
| **\|Φ+⟩** | Bell state  | (\|00⟩ + \|11⟩)/√2, entangled      |

## Next Steps

- See [Flowcharts](/examples/flowcharts) for classical algorithm visualization
- Check [C4 Architecture](/examples/c4-architecture) for system design and architecture diagrams
- Explore [State Machine Diagrams](/examples/state-machines) for quantum protocol states
- Browse the [examples/quantum-circuits](https://github.com/jgreywolf/Runiq/tree/main/examples/quantum-circuits) directory for more examples
