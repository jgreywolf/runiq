# Quantum Circuit Examples

This directory contains example quantum circuits demonstrating fundamental quantum algorithms and protocols.

## Examples

### 1. Bell State (`bell-state.runiq`)

**Difficulty**: Beginner  
**Qubits**: 2  
**Gates**: H, CNOT

Creates the maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2.

**Concepts demonstrated**:

- Superposition (Hadamard gate)
- Entanglement (CNOT gate)
- Quantum correlation

**Circuit**:

```
|q0⟩ ──[H]──●──
            │
|q1⟩ ───────⊕──
```

---

### 2. Quantum Teleportation (`quantum-teleportation.runiq`)

**Difficulty**: Intermediate  
**Qubits**: 3  
**Gates**: H, CNOT, Measurement, X, Z

Demonstrates the quantum teleportation protocol where Alice sends a quantum state to Bob using entanglement and classical communication.

**Concepts demonstrated**:

- EPR pair creation
- Bell state measurement
- Classical communication
- Quantum state transfer without physical transmission

**Key insight**: No faster-than-light communication (requires classical channel)

**Circuit**:

```
|q0⟩ ─────────●──[H]──M─── (Alice's state to teleport)
              │       │
|q1⟩ ──[H]──●─⊕───M─── │ ── (Alice's EPR half)
            │       │  │
|q2⟩ ───────⊕───────●──[X]──[Z]── (Bob's EPR half → receives state)
```

---

### 3. Grover's Search (`grover-search.runiq`)

**Difficulty**: Advanced  
**Qubits**: 3  
**Gates**: H, Oracle, X, Multi-controlled Z, Measurement

Searches an unsorted database of 8 items in ~√8 ≈ 2-3 operations (vs. 4 classical average).

**Concepts demonstrated**:

- Amplitude amplification
- Oracle queries
- Grover diffusion operator
- Quadratic speedup over classical search

**Complexity**:

- Classical: O(n) operations
- Quantum: O(√n) operations

**Circuit steps**:

1. Create equal superposition
2. Apply oracle (marks target)
3. Apply diffusion operator (amplifies marked state)
4. Measure (high probability of finding target)

---

### 4. Quantum Fourier Transform (`quantum-fourier-transform.runiq`)

**Difficulty**: Advanced  
**Qubits**: 3  
**Gates**: H, S (phase π/2), T (phase π/4), SWAP

Implements the quantum version of the discrete Fourier transform.

**Concepts demonstrated**:

- Phase gates (S, T)
- Controlled rotations
- Basis transformation
- Qubit order reversal (SWAP gates)

**Complexity**:

- Classical FFT: O(n·2^n) operations
- Quantum QFT: O(n²) operations

**Applications**:

- Shor's factoring algorithm
- Quantum phase estimation
- Period finding

**Circuit**:

```
|q0⟩ ─[H]─[S]^q1─[T]^q2───┐
                          SWAP
|q1⟩ ─────[H]───[S]^q2────┤
                          │
|q2⟩ ─────────────[H]─────┘
```

---

## Understanding Quantum Gates

### Single-Qubit Gates

| Gate  | Symbol     | Matrix   | Description            |
| ----- | ---------- | -------- | ---------------------- |
| **X** | `[gate-x]` | Pauli-X  | Bit flip (quantum NOT) |
| **Y** | `[gate-y]` | Pauli-Y  | Bit + phase flip       |
| **Z** | `[gate-z]` | Pauli-Z  | Phase flip             |
| **H** | `[gate-h]` | Hadamard | Creates superposition  |
| **S** | `[gate-s]` | S gate   | Phase rotation π/2     |
| **T** | `[gate-t]` | T gate   | Phase rotation π/4     |

### Multi-Qubit Gates

| Gate     | Symbol  | Description                       |
| -------- | ------- | --------------------------------- |
| **CNOT** | `●─⊕`   | Controlled-NOT (XOR)              |
| **SWAP** | `✕─✕`   | Exchange qubit states             |
| **CCX**  | `●─●─⊕` | Toffoli (controlled-controlled-X) |
| **CZ**   | `●─[Z]` | Controlled-Z phase flip           |

### Measurement & Utilities

| Symbol            | Description                   |
| ----------------- | ----------------------------- |
| `[measurement:M]` | Measure qubit → classical bit |
| `[barrier]`       | Prevent gate reordering       |
| `qubit-wire`      | Qubit state evolution         |

---

## Running Examples

```bash
# Using Runiq CLI
runiq render examples/quantum-circuits/bell-state.runiq -o bell-state.svg

# All examples
runiq render examples/quantum-circuits/*.runiq
```

---

## Quantum Circuit Conventions

1. **Time flows left-to-right**: Gates are applied in sequence from left to right
2. **Qubit wires**: Horizontal lines represent quantum state evolution
3. **Control qubits**: Filled circles (●) indicate control qubits
4. **Target qubits**: ⊕ or gate boxes indicate target qubits
5. **Classical bits**: Double lines (after measurement)
6. **Barriers**: Vertical dashed lines prevent optimization

---

## Further Reading

- [IBM Qiskit Textbook](https://learn.qiskit.org/)
- [Quantum Algorithm Zoo](https://quantumalgorithmzoo.org/)
- Nielsen & Chuang - _Quantum Computation and Quantum Information_
- [Quirk - Interactive Quantum Circuit Simulator](https://algassert.com/quirk)

---

## Notes

⚠️ **These are visual representations only**  
Runiq provides quantum circuit _visualization_, not simulation. For actual quantum computation, use:

- IBM Qiskit (Python)
- Google Cirq (Python)
- Microsoft Q# (Q#/C#)
- Rigetti Forest (Python)

📝 **Educational Purpose**  
These examples are designed to help understand quantum algorithms visually. They demonstrate the gate sequences and circuit structure of famous quantum protocols.
