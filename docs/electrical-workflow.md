# Runiq Electrical Circuits → SPICE Workflow

Complete guide for text-based electrical circuit design and SPICE simulation using Runiq.

## 🎯 Overview

Runiq provides a simple text-based language for defining electrical circuits that can be automatically exported to SPICE netlists for simulation in tools like ngspice, LTspice, or any SPICE-compatible simulator.

### Why Use Runiq for Electrical Circuits?

- ✅ **Text-based**: Version control friendly, easy to diff and review
- ✅ **Simple syntax**: No need to learn complex SPICE netlist format
- ✅ **Automatic ground normalization**: GND and VSS automatically converted to 0
- ✅ **Type-safe**: Validates circuit structure at parse time
- ✅ **Industry standard output**: Generates valid SPICE netlists

## 📝 Syntax Guide

### Basic Structure

```runiq
electrical "Circuit Name" {
  net NET1, NET2, GND        # Declare networks
  part REF type:TYPE ...     # Define components
  analysis ANALYSIS_TYPE ... # Simulation analyses
}
```

### Components (Parts)

#### Resistor

```runiq
part R1 type:R value:"10k" pins:(N1,N2)
```

#### Capacitor

```runiq
part C1 type:C value:"1u" pins:(N1,GND)
```

#### Inductor

```runiq
part L1 type:L value:"10m" pins:(N1,N2)
```

#### Voltage Source (DC)

```runiq
part V1 type:V value:"5" pins:(VCC,GND)
```

#### Voltage Source (AC/Transient)

```runiq
part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)  # 1V sine at 1kHz
part V2 type:V source:"AC 1 1k" pins:(IN,GND)      # AC source
```

#### Current Source

```runiq
part I1 type:I value:"1m" pins:(VCC,N1)
```

### Analyses

#### Transient Analysis

```runiq
analysis tran "0 10m"           # 0 to 10ms
analysis tran "0 1m 10u"        # 0 to 1ms, 10µs steps
```

#### AC Analysis

```runiq
analysis ac "dec 50 100 100k"   # Decade sweep, 50 pts/decade, 100Hz-100kHz
analysis ac "lin 1000 1k 10k"   # Linear sweep, 1000 points, 1kHz-10kHz
```

#### DC Analysis

```runiq
analysis dc "V1 0 10 0.1"       # Sweep V1 from 0V to 10V in 0.1V steps
```

#### Operating Point

```runiq
analysis op                      # DC operating point
```

## 🔌 Complete Examples

### RC Lowpass Filter

**File: `rc-filter.runiq`**

```runiq
electrical "RC Lowpass Filter" {
  net IN, OUT, GND

  # Input voltage source: 1V sine wave at 1kHz
  part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)

  # Filter components
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)

  # Transient analysis: 0 to 5ms
  analysis tran "0 5m"
}
```

**Generated SPICE:**

```spice
* RC Lowpass Filter
V1 IN 0 SIN(0 1 1k)
R1 IN OUT 10k
C1 OUT 0 1n
.tran 0 5m
.end
```

### Voltage Divider

**File: `voltage-divider.runiq`**

```runiq
electrical "Voltage Divider" {
  net VIN, VOUT, GND

  part V1 type:V value:"12" pins:(VIN,GND)
  part R1 type:R value:"10k" pins:(VIN,VOUT)
  part R2 type:R value:"10k" pins:(VOUT,GND)

  analysis op
  analysis dc "V1 0 15 0.5"
}
```

### RLC Resonant Circuit

**File: `rlc-resonant.runiq`**

```runiq
electrical "RLC Resonant Circuit" {
  net VIN, N1, GND

  part V1 type:V source:"AC 1 1k" pins:(VIN,GND)
  part R1 type:R value:"100" pins:(VIN,N1)
  part L1 type:L value:"10m" pins:(N1,GND)
  part C1 type:C value:"1u" pins:(N1,GND)

  analysis ac "dec 50 100 100k"
  analysis tran "0 10m"
}
```

## 🚀 Usage

### 1. Write Your Circuit

Create a `.runiq` file with your electrical circuit definition:

```bash
vim my-circuit.runiq
```

### 2. Convert to SPICE

```bash
# Using the conversion script
cd packages/export-spice
pnpm test:examples

# Or programmatically
import { parse } from '@runiq/parser-dsl';
import { toSpice } from '@runiq/export-spice';

const circuit = `
electrical "My Circuit" {
  net IN, OUT, GND
  part V1 type:V value:"5" pins:(IN,GND)
  part R1 type:R value:"1k" pins:(IN,OUT)
  analysis op
}`;

const result = parse(circuit);
const electricalProfile = result.document.profiles[0];
const spice = toSpice(electricalProfile);

console.log(spice);
```

### 3. Simulate

#### Using ngspice (Command Line)

```bash
ngspice my-circuit.cir
```

Within ngspice:

```
ngspice> run
ngspice> plot v(OUT)
ngspice> quit
```

#### Using LTspice (GUI)

1. Open LTspice
2. File → Open → Select `.cir` file
3. Run → Run Simulation
4. Plot desired signals

#### Using Python with PySpice

```python
import PySpice
from PySpice.Spice.Netlist import Circuit

circuit = Circuit('My Circuit')
# ... load netlist ...
simulator = circuit.simulator()
analysis = simulator.transient(step_time=1e-6, end_time=1e-3)
```

## 📊 Ground Normalization

Runiq automatically normalizes ground references to SPICE standard:

| Runiq Net | SPICE Node        |
| --------- | ----------------- |
| `GND`     | `0`               |
| `VSS`     | `0`               |
| `VCC`     | `VCC` (unchanged) |
| `VDD`     | `VDD` (unchanged) |

Example:

```runiq
part V1 type:V value:"5" pins:(VCC,GND)
```

Becomes:

```spice
V1 VCC 0 5
```

## 🎓 Design Patterns

### Filter Design

**RC Lowpass**: Cutoff frequency = 1/(2πRC)

```runiq
part R1 type:R value:"10k" pins:(IN,OUT)
part C1 type:C value:"1n" pins:(OUT,GND)
# fc = 1/(2π × 10kΩ × 1nF) ≈ 15.9 kHz
```

**RL Highpass**: Cutoff frequency = R/(2πL)

```runiq
part L1 type:L value:"10m" pins:(IN,OUT)
part R1 type:R value:"1k" pins:(OUT,GND)
# fc = 1kΩ/(2π × 10mH) ≈ 15.9 kHz
```

### Voltage Divider

Output voltage = Vin × R2/(R1+R2)

```runiq
part R1 type:R value:"10k" pins:(VIN,VOUT)
part R2 type:R value:"10k" pins:(VOUT,GND)
# Vout = Vin × 0.5 (50% divider)
```

### LED Current Limiting

Resistor value = (Vsupply - Vforward) / Idesired

```runiq
part R1 type:R value:"220" pins:(VCC,LED_ANODE)
# For 5V supply, 2V LED, ~13.6mA current
# R = (5V - 2V) / 13.6mA ≈ 220Ω
```

## 🔧 Unit Suffixes

Runiq supports standard SPICE unit suffixes:

| Suffix | Multiplier | Example         |
| ------ | ---------- | --------------- |
| `f`    | 10⁻¹⁵      | `1f` = 1 femto  |
| `p`    | 10⁻¹²      | `1p` = 1 pico   |
| `n`    | 10⁻⁹       | `1n` = 1 nano   |
| `u`    | 10⁻⁶       | `1u` = 1 micro  |
| `m`    | 10⁻³       | `1m` = 1 milli  |
| `k`    | 10³        | `1k` = 1 kilo   |
| `meg`  | 10⁶        | `1meg` = 1 mega |
| `g`    | 10⁹        | `1g` = 1 giga   |

Examples:

- `10k` → 10 kΩ
- `1n` → 1 nF
- `10m` → 10 mH
- `1meg` → 1 MΩ

## 📚 Resources

### SPICE Simulators

- **ngspice**: Open-source, command-line
  - Download: http://ngspice.sourceforge.net/
  - Documentation: http://ngspice.sourceforge.net/docs.html

- **LTspice**: Free, GUI-based (Analog Devices)
  - Download: https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html
  - Very popular for power electronics

- **PySpice**: Python wrapper for ngspice
  - GitHub: https://github.com/PySpice-org/PySpice
  - Great for scripted simulations

### Learning SPICE

- [SPICE Quick Reference](http://www.seas.upenn.edu/~jan/spice/spice.quick.html)
- [ngspice Tutorial](http://ngspice.sourceforge.net/tutorials.html)
- [LTspice Getting Started Guide](https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html#tutorial)

## 🎉 Status

**Current Implementation: Complete! ✅**

- ✅ Electrical profile parser
- ✅ SPICE netlist exporter
- ✅ Ground normalization
- ✅ Component support: R, C, L, V, I
- ✅ Analysis support: .tran, .ac, .dc, .op
- ✅ 18/18 tests passing
- ✅ 5 working examples

**Coming Soon:**

- Transistor support (Q: NPN/PNP, M: NMOS/PMOS)
- Diode support (D)
- Subcircuit definitions (.subckt/.ends)
- More analysis types (.noise, .four)

## 💡 Tips

1. **Always define GND**: Every circuit needs a ground reference
2. **Use descriptive net names**: `VCC`, `IN`, `OUT` instead of `N1`, `N2`
3. **Add comments**: Explain design decisions
4. **Start simple**: Test basic circuits before complex ones
5. **Verify with simulator**: Always run the SPICE simulation to validate

## 🐛 Troubleshooting

### "No convergence" errors in SPICE

- Add series resistances to voltage sources
- Adjust time steps in transient analysis
- Check for floating nodes (unconnected nets)

### Missing ground reference

```
Error: Circuit has no ground
```

→ Add `net GND` and connect at least one part to it

### Wrong output values

- Check component values and units
- Verify pin connections (order matters!)
- Review analysis parameters

## 📄 License

Part of the Runiq project. See main repository for license details.
