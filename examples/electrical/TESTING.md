# Testing with ngspice

Quick validation steps to test Runiq-generated SPICE netlists with ngspice.

## 🔧 Prerequisites

**Install ngspice:**

- **Windows**: Download from http://ngspice.sourceforge.net/download.html
- **macOS**: `brew install ngspice`
- **Linux**: `sudo apt-get install ngspice` or `sudo yum install ngspice`

## 🚀 Quick Test Commands

### 1. RC Lowpass Filter

```bash
cd examples/electrical/spice-output
ngspice rc-filter.cir
```

Within ngspice:

```
ngspice 1 -> run
ngspice 2 -> plot v(OUT) v(IN)
ngspice 3 -> print v(OUT)
ngspice 4 -> quit
```

**Expected behavior**: Output signal should be attenuated version of input (lowpass filtering)

### 2. Voltage Divider

```bash
ngspice voltage-divider.cir
```

```
ngspice 1 -> run
ngspice 2 -> print v(VOUT)
ngspice 3 -> plot dc1.v(VOUT)
```

**Expected result**: VOUT should be ~6V (50% of 12V input)

### 3. RLC Resonant Circuit

```bash
ngspice rlc-resonant.cir
```

```
ngspice 1 -> run
ngspice 2 -> plot ac1.v(N1)
ngspice 3 -> plot tran1.v(N1)
```

**Expected behavior**:

- AC plot shows resonance peak around 1.6 kHz
- Transient shows oscillating voltage

### 4. RL High-Pass Filter

```bash
ngspice rl-high-pass.cir
```

```
ngspice 1 -> run
ngspice 2 -> plot ac1.v(VOUT) ac1.v(VIN)
ngspice 3 -> plot tran1.v(VOUT)
```

**Expected behavior**: High frequencies pass, low frequencies attenuated

### 5. LED Circuit

```bash
ngspice led-circuit.cir
```

```
ngspice 1 -> run
ngspice 2 -> print v(LED_ANODE)
ngspice 3 -> print i(V1)
ngspice 4 -> plot dc1.i(V1)
```

**Expected results**:

- LED_ANODE voltage: ~2V (LED forward voltage)
- Current: ~13.6mA through R1

## 📊 Verification Checklist

For each circuit:

- ✅ ngspice loads the `.cir` file without errors
- ✅ `run` command executes successfully
- ✅ No convergence errors
- ✅ Output values are reasonable
- ✅ Plot commands display waveforms

## 🎯 Success Criteria

All tests pass if:

1. ✅ All 5 SPICE files load without syntax errors
2. ✅ Simulations converge (no "timestep too small" errors)
3. ✅ Output values match expected behavior
4. ✅ Plots display correctly

## 🐛 Common Issues

### "Cannot find file"

→ Make sure you're in `examples/electrical/spice-output/` directory

### "No such analysis"

→ Run the `run` command first before plotting

### Convergence failures

→ This shouldn't happen with these simple circuits. If it does, the netlist may be malformed.

## ✨ Result

If all tests pass, this validates:

- ✅ Runiq parser correctly interprets electrical circuits
- ✅ SPICE exporter generates valid netlists
- ✅ Ground normalization works (GND → 0)
- ✅ Component values exported correctly
- ✅ Analysis directives formatted properly
- ✅ Complete workflow: Runiq DSL → SPICE → Simulation

## 📝 Manual Verification (Without ngspice)

If you don't have ngspice installed, you can manually verify the `.cir` files:

**Check rc-filter.cir:**

```spice
* RC Lowpass Filter
V1 IN 0 SIN(0 1 1k)
R1 IN OUT 10k
C1 OUT 0 1n
.tran 0 5m
.end
```

Verify:

- ✅ Title comment exists
- ✅ GND converted to 0
- ✅ Components in correct format: `REF NODE1 NODE2 VALUE`
- ✅ Analysis directive: `.tran 0 5m`
- ✅ Ends with `.end`

Repeat for other files!

## 🎉 Status

**Current Test Status: All Examples Converted ✅**

```
🔌 Runiq → SPICE Conversion Test
   ✅ Success: 5/5 examples

   📄 led-circuit.cir      (3 parts, 2 analyses)
   📄 rc-filter.cir        (3 parts, 1 analysis)
   📄 rl-high-pass.cir     (3 parts, 2 analyses)
   📄 rlc-resonant.cir     (4 parts, 2 analyses)
   📄 voltage-divider.cir  (3 parts, 2 analyses)
```

Ready for SPICE simulation! 🚀
