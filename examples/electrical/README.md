# Electrical Circuit Examples

This folder contains example electrical circuits in Runiq format and their generated outputs.

> **📸 Visual Schematics Available!** Check the `schematics/` directory for IEEE-standard SVG circuit diagrams of all examples.

## 📁 Structure

```
electrical/
├── *.runiq             # Runiq circuit definitions
├── spice-output/       # Generated SPICE netlists (.cir files)
│   └── *.cir
└── schematics/         # Generated IEEE-standard SVG schematics
    └── *.svg
```

## 🔌 Examples

### 1. RC Lowpass Filter (`rc-filter.runiq`)

Simple first-order RC lowpass filter with 1kHz sine wave input.

- Cutoff frequency: ~15.9 kHz
- Components: 10kΩ resistor, 1nF capacitor
- Analysis: Transient (5ms)

### 2. Voltage Divider (`voltage-divider.runiq`)

Basic resistive voltage divider creating 50% output.

- Input: 12V DC
- Output: 6V (50% divider with equal resistors)
- Analysis: Operating point + DC sweep

### 3. RLC Resonant Circuit (`rlc-resonant.runiq`)

Series RLC circuit demonstrating resonance.

- Resonant frequency: ~1.59 kHz
- Components: 100Ω, 10mH, 1µF
- Analysis: AC frequency sweep + transient

### 4. RL High-Pass Filter (`rl-high-pass.runiq`)

First-order RL high-pass filter.

- Cutoff frequency: ~15.9 kHz
- Components: 10mH inductor, 1kΩ resistor
- Analysis: Transient + AC sweep

### 5. LED Circuit (`led-circuit.runiq`)

LED with current-limiting resistor.

- Supply: 5V DC
- Current limiting: 220Ω (~15mA)
- Analysis: Operating point + DC sweep

## 🚀 Quick Start

### Generate SPICE Netlists

From the `packages/export-spice` directory:

```bash
pnpm test:examples
```

This will parse all `.runiq` files and generate `.cir` files in `spice-output/`.

### Simulate with ngspice

```bash
cd examples/electrical/spice-output

# Run a simulation
ngspice rc-filter.cir

# Inside ngspice:
ngspice 1 -> run
ngspice 2 -> plot v(OUT) v(IN)
ngspice 3 -> quit
```

### Simulate with LTspice

1. Open LTspice
2. File → Open → Select any `.cir` file
3. Run → Run Simulation (F5)
4. Click on nodes to plot voltages

## 📝 Creating New Examples

1. Create a new `.runiq` file in this directory
2. Define your circuit using electrical profile syntax
3. Run `pnpm test:examples` to generate SPICE
4. Simulate and verify!

Example template:

```runiq
electrical "My Circuit" {
  net VIN, VOUT, GND

  # Define components
  part V1 type:V value:"5" pins:(VIN,GND)
  part R1 type:R value:"1k" pins:(VIN,VOUT)

  # Add analyses
  analysis op
  analysis tran "0 10m"
}
```

## 📚 Documentation

See [../docs/electrical-workflow.md](../../docs/electrical-workflow.md) for complete syntax guide and design patterns.

## ✅ Validation

All examples have been tested:

- ✅ Parse successfully with `@runiq/parser-dsl`
- ✅ Export correctly with `@runiq/export-spice`
- ✅ Generate valid SPICE netlists
- ✅ Ready for simulation in ngspice/LTspice

## 🎯 Test Results

```
🔌 Runiq → SPICE Conversion Test
   ✅ Success: 5/5 examples
   📊 Total: 16 parts, 9 analyses
```
