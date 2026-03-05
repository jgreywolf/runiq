---
title: Digital Circuits
description: Design digital circuits with logic gates, flip-flops, multiplexers, decoders, and export to Verilog HDL for simulation and synthesis.
lastUpdated: 2025-01-09
---

# Digital Circuits

Runiq supports digital circuit design with two different profiles depending on your needs.

## When to Use Each Profile

### Electrical Profile (Simple Gate-Level Circuits)

Use the `electrical` profile for **simple, flat gate-level circuits**:

- Basic logic gates (AND, OR, XOR, NOT, NAND, NOR)
- Combinational circuits (adders, multiplexers, decoders)
- Small sequential circuits (flip-flops, latches)
- Mixed analog/digital circuits

**Syntax**: Use `part` statements with gate types

```runiq
electrical "Half Adder" {
  net A, B, SUM, CARRY

  part U1 type:XOR pins:(A,B,SUM)
  part U2 type:AND pins:(A,B,CARRY)
}
```

### Digital Profile (Hierarchical Module Design)

Use the `digital` profile for **hierarchical digital designs** with reusable modules:

- Custom module definitions with ports
- Module instantiation with port mapping
- Bus notation with bit widths `[7:0]`
- Parameter overrides
- Complex digital systems (processors, controllers)

**Syntax**: Define modules and instantiate them

```runiq
digital "4-bit Counter" {
  # Define a module with ports
  module Counter ports:(clk, reset, count[3:0])

  # Declare nets with bus notation
  net clk, reset
  net count[3:0]

  # Instantiate the counter module
  inst U1 of:Counter map:(clk:clk, reset:reset, count:count)
}
```

Note: In the editor toolbox, electrical shapes insert `part ... pins:(...)` snippets, while digital shapes insert `inst ... map:(...)` snippets. Digital mode includes both gate-level symbols and module/instance syntax so you can mix primitives with hierarchical blocks.

## Comparison

| Feature               | `electrical` Profile | `digital` Profile        |
| --------------------- | -------------------- | ------------------------ |
| **Use Case**          | Simple gate circuits | Hierarchical design      |
| **Component Keyword** | `part`               | `inst` (instance)        |
| **Module Definition** | ❌ No                | ✅ Yes (`module`)        |
| **Port Mapping**      | Simple pin lists     | Named port mapping       |
| **Bus Notation**      | ❌ No                | ✅ Yes `[7:0]`           |
| **Parameters**        | Basic properties     | Full parameter overrides |
| **Mixed Analog**      | ✅ Yes               | ❌ No (digital only)     |
| **Export**            | SPICE, Verilog       | Verilog (hierarchical)   |

## Comparison with Other Tools

| Feature                      | Runiq                 | Mermaid        | PlantUML       | Lucidchart  | Logisim        | Digital        | Quartus       | Vivado        |
| ---------------------------- | --------------------- | -------------- | -------------- | ----------- | -------------- | -------------- | ------------- | ------------- |
| **Basic Support**            | ✅                    | ❌             | ❌             | ✅          | ✅             | ❌             | ✅            | ✅            |
| **Gate-level design**        | ✅                    | ❌             | ❌             | ✅          | ✅             | ✅             | ✅            | ✅            |
| **Hierarchical modules**     | ✅                    | ❌             | ❌             | ⚠️ Manual   | ✅             | ✅             | ✅            | ✅            |
| **Interactive simulation**   | ❌                    | ❌             | ❌             | ❌          | ✅             | ✅             | ✅            | ✅            |
| **Timing analysis**          | ❌                    | ❌             | ❌             | ❌          | ⚠️ Basic       | ⚠️ Basic       | ✅            | ✅            |
| **FPGA synthesis**           | ❌                    | ❌             | ❌             | ❌          | ❌             | ❌             | ✅            | ✅            |
| **HDL export**               | ✅ Verilog            | ❌             | ❌             | ❌          | ⚠️ VHDL        | ⚠️ VHDL        | ✅            | ✅            |
| **Standard libraries**       | ✅                    | ❌             | ❌             | ⚠️ Basic    | ✅             | ✅             | ✅            | ✅            |
| **Automatic layout**         | ✅                    | ✅             | ✅             | ❌          | ❌             | ⚠️ Auto-route  | ❌            | ❌            |
| **Documentation generation** | ✅                    | ✅             | ✅             | ⚠️ Partial  | ❌             | ❌             | ⚠️ Partial    | ⚠️ Partial    |
| **Multi-profile support**    | ✅ Electrical/Digital | ❌             | ❌             | ✅          | ❌             | ❌             | ❌            | ❌            |
| **Export formats**           | SVG, PNG              | SVG, PNG       | SVG, PNG       | Multiple    | Image          | Image          | PDF, Image    | PDF, Image    |
| **Text-based DSL**           | ✅                    | ✅             | ✅             | ❌          | ❌             | ❌             | ⚠️ TCL        | ⚠️ XDC        |
| **Version control friendly** | ✅                    | ✅             | ✅             | ❌          | ❌             | ❌             | ⚠️ Partial    | ⚠️ Partial    |
| **Learning curve**           | Low                   | Low            | Medium         | Low         | Medium         | Low            | High          | High          |
| **Cost**                     | Free                  | Free           | Free           | Paid        | Free           | Free           | Paid          | Paid          |
| **Platform**                 | Cross-platform        | Cross-platform | Cross-platform | Web/Desktop | Cross-platform | Cross-platform | Windows/Linux | Windows/Linux |

**Key Advantages of Runiq:**

- **Dual Profiles**: Switch between electrical (gate-level) and digital (hierarchical) views
- **Version Control**: Text-based format integrates seamlessly with Git
- **Documentation**: Natural fit for technical documentation and papers
- **Hierarchical Design**: Clean module instantiation and reuse

**When to Use Alternatives:**

- **Logisim/Digital**: Interactive circuit design and simulation for education
- **Quartus/Vivado**: Professional FPGA development with synthesis and implementation
- **Lucidchart**: Real-time collaboration with non-technical stakeholders
- **Mermaid/PlantUML**: Simple logic diagrams in existing documentation

## Examples

### Example 1: Full Adder (Electrical Profile)

Best for simple gate-level implementation:

```runiq
electrical "Full Adder" {
  # Inputs and outputs
  net A, B, Cin, Sum, Cout

  # Half adder 1
  part XOR1 type:XOR pins:(A,B,S1)
  part AND1 type:AND pins:(A,B,C1)

  # Half adder 2
  part XOR2 type:XOR pins:(S1,Cin,Sum)
  part AND2 type:AND pins:(S1,Cin,C2)

  # Carry out
  part OR1 type:OR pins:(C1,C2,Cout)

  # Internal nets
  net S1, C1, C2
}
```

### Example 2: 4-bit Ripple Carry Adder (Digital Profile)

Best for hierarchical design with reusable full adder modules:

```runiq
digital "4-bit Ripple Carry Adder" {
  # Define the full adder module
  module FullAdder ports:(a, b, cin, sum, cout)

  # Inputs
  net a[3:0], b[3:0], cin

  # Outputs
  net sum[3:0], cout

  # Internal carry signals
  net c[2:0]

  # Instantiate 4 full adders
  inst FA0 of:FullAdder map:(a:a[0], b:b[0], cin:cin, sum:sum[0], cout:c[0])
  inst FA1 of:FullAdder map:(a:a[1], b:b[1], cin:c[0], sum:sum[1], cout:c[1])
  inst FA2 of:FullAdder map:(a:a[2], b:b[2], cin:c[1], sum:sum[2], cout:c[2])
  inst FA3 of:FullAdder map:(a:a[3], b:b[3], cin:c[2], sum:sum[3], cout:cout)
}
```

### Example 3: 8-bit Register with Enable (Digital Profile)

Hierarchical design with parameters:

```runiq
digital "8-bit Register" {
  # Define D flip-flop module
  module DFF ports:(clk, d, q) params:(width:8)

  # System signals
  net clk, enable
  net data_in[7:0], data_out[7:0]

  # Gated clock for enable
  net clk_gated
  part AND1 type:AND pins:(clk,enable,clk_gated)

  # 8-bit register using parameterized DFF
  inst REG of:DFF map:(clk:clk_gated, d:data_in, q:data_out) params:(width:8)
}
```

### Example 4: Mixed Analog-Digital (Electrical Profile Only)

When you need both analog and digital components:

```runiq
electrical "ADC Interface" {
  # Analog input conditioning
  part R1 type:R value:"10k" pins:(AIN,COMP_IN)
  part C1 type:C value:"100nF" pins:(COMP_IN,GND)

  # Comparator (analog)
  part U1 type:OPAMP model:"LM358" pins:(COMP_IN,VREF,COMP_OUT)

  # Digital processing
  part U2 type:AND pins:(COMP_OUT,CLK,DOUT)
  part U3 type:DFF pins:(CLK,DOUT,Q)

  # Nets
  net AIN, COMP_IN, COMP_OUT, CLK, DOUT, Q, VREF, GND
}
```

## Digital Profile Features

### Bus Notation

Declare multi-bit signals:

```runiq
digital "Bus Example" {
  net address[15:0]    # 16-bit address bus
  net data[7:0]        # 8-bit data bus
  net control[3:0]     # 4-bit control signals
}
```

### Module Ports

Define reusable modules with typed ports:

```runiq
digital "Module Definition" {
  # Define a counter module
  module Counter ports:(
    clk,              # Single-bit port
    reset,            # Single-bit port
    count[7:0]        # 8-bit bus port
  )
}
```

### Port Mapping

Connect instance ports to nets:

```runiq
digital "Port Mapping" {
  module ALU ports:(a[7:0], b[7:0], op[2:0], result[7:0])

  net operand_a[7:0], operand_b[7:0]
  net operation[2:0]
  net alu_out[7:0]

  # Map ports by name
  inst U1 of:ALU map:(
    a:operand_a,
    b:operand_b,
    op:operation,
    result:alu_out
  )
}
```

### Parameters

Override module parameters:

```runiq
digital "Parameterized Design" {
  module Memory ports:(addr[9:0], data[7:0]) params:(depth:1024, width:8)

  # Instantiate with different parameters
  inst RAM1 of:Memory params:(depth:2048, width:16)
  inst RAM2 of:Memory params:(depth:512, width:32)
}
```

## Best Practices

### For Electrical Profile

::: tip Simple is Better
Use `electrical` for straightforward gate circuits. It's easier to write and understand.

```runiq
electrical "Decoder" {
  net A, B, Y0, Y1, Y2, Y3

  part U1 type:NOT pins:(A,A_)
  part U2 type:NOT pins:(B,B_)
  part U3 type:AND pins:(A_,B_,Y0)
  part U4 type:AND pins:(A_,B,Y1)
  # ...
}
```

:::

::: tip Mixed Circuits
Always use `electrical` when combining analog and digital components.
:::

### For Digital Profile

::: tip Use for Hierarchy
Use `digital` when you have:

- Multiple instances of the same module
- Complex port interfaces
- Multi-bit buses
- Need for parameterization
  :::

::: tip Module Library
Build a library of reusable modules:

```runiq
# Define once, use many times
module Register ports:(clk, d[7:0], q[7:0])
module Mux ports:(sel, in0[7:0], in1[7:0], out[7:0])
module ALU ports:(a[7:0], b[7:0], op[2:0], result[7:0])
```

:::

## Complete Component Reference

### Logic Gates

Runiq supports all standard logic gates with IEEE distinctive shapes.

#### 2-Input Gates

| Gate Type  | Part Type     | Symbol                    | Description                   | Logic Function              |
| ---------- | ------------- | ------------------------- | ----------------------------- | --------------------------- |
| **AND**    | `type:AND`    | Flat-left, curved-right   | All inputs high → output high | $Y = A \cdot B$             |
| **OR**     | `type:OR`     | Curved-both-sides         | Any input high → output high  | $Y = A + B$                 |
| **NOT**    | `type:NOT`    | Triangle with bubble      | Inverts input                 | $Y = \overline{A}$          |
| **XOR**    | `type:XOR`    | OR with extra input curve | Odd parity                    | $Y = A \oplus B$            |
| **NAND**   | `type:NAND`   | AND with output bubble    | NOT-AND                       | $Y = \overline{A \cdot B}$  |
| **NOR**    | `type:NOR`    | OR with output bubble     | NOT-OR                        | $Y = \overline{A + B}$      |
| **XNOR**   | `type:XNOR`   | XOR with output bubble    | Even parity                   | $Y = \overline{A \oplus B}$ |
| **BUFFER** | `type:BUFFER` | Triangle without bubble   | Non-inverting buffer          | $Y = A$                     |

**Example - 2-Input Gates:**

```runiq
electrical "Basic Gates" {
  net A, B, Y_AND, Y_OR, Y_XOR, Y_NAND, Y_NOR, Y_XNOR

  part U1 type:AND pins:(A,B,Y_AND)
  part U2 type:OR pins:(A,B,Y_OR)
  part U3 type:XOR pins:(A,B,Y_XOR)
  part U4 type:NAND pins:(A,B,Y_NAND)
  part U5 type:NOR pins:(A,B,Y_NOR)
  part U6 type:XNOR pins:(A,B,Y_XNOR)
}
```

#### 3-Input Gates

| Gate Type | Part Type    | Inputs  | Description                       |
| --------- | ------------ | ------- | --------------------------------- |
| **AND3**  | `type:AND3`  | A, B, C | 3-input AND gate (80×50px, wider) |
| **OR3**   | `type:OR3`   | A, B, C | 3-input OR gate (curved shape)    |
| **NAND3** | `type:NAND3` | A, B, C | 3-input NAND (AND3 with bubble)   |
| **NOR3**  | `type:NOR3`  | A, B, C | 3-input NOR (OR3 with bubble)     |

**Example - 3-Input Gates:**

```runiq
electrical "3-Input Logic" {
  net A, B, C, Y_AND3, Y_OR3, Y_NAND3, Y_NOR3

  part U1 type:AND3 pins:(A,B,C,Y_AND3)
  part U2 type:OR3 pins:(A,B,C,Y_OR3)
  part U3 type:NAND3 pins:(A,B,C,Y_NAND3)
  part U4 type:NOR3 pins:(A,B,C,Y_NOR3)
}
```

### Sequential Logic

#### Flip-Flops

Flip-flops store 1 bit of state, triggered by clock edges.

| Type             | Part Type   | Size    | Description                                    | Inputs    | Outputs |
| ---------------- | ----------- | ------- | ---------------------------------------------- | --------- | ------- |
| **D Flip-Flop**  | `type:DFF`  | 80×60px | Data flip-flop, output follows D on clock edge | D, CLK    | Q, Q̄    |
| **JK Flip-Flop** | `type:JKFF` | 80×70px | Universal flip-flop (set, reset, toggle)       | J, K, CLK | Q, Q̄    |
| **T Flip-Flop**  | `type:TFF`  | 80×60px | Toggle flip-flop, changes state on clock edge  | T, CLK    | Q, Q̄    |

**Example - D Flip-Flop:**

```runiq
electrical "D Flip-Flop" {
  net D, CLK, RST, Q, QB

  part FF1 type:DFF pins:(D,CLK,Q,QB)
  part RST_GATE type:AND pins:(RST,Q,Q_RST)
}
```

**DFF Truth Table:**

| CLK | D   | Q(next) |
| --- | --- | ------- |
| ↑   | 0   | 0       |
| ↑   | 1   | 1       |
| ↓   | X   | Q(prev) |

**Example - JK Flip-Flop:**

```runiq
electrical "JK Flip-Flop" {
  net J, K, CLK, Q, QB

  part FF1 type:JKFF pins:(J,K,CLK,Q,QB)
}
```

**JKFF Truth Table:**

| J   | K   | Q(next) | Operation |
| --- | --- | ------- | --------- |
| 0   | 0   | Q(prev) | No change |
| 0   | 1   | 0       | Reset     |
| 1   | 0   | 1       | Set       |
| 1   | 1   | Q̄(prev) | Toggle    |

**Example - T Flip-Flop:**

```runiq
electrical "T Flip-Flop Counter" {
  net T, CLK, Q0, Q1, Q2, Q3

  // 4-bit ripple counter using T flip-flops
  part FF0 type:TFF pins:(T,CLK,Q0)
  part FF1 type:TFF pins:(T,Q0,Q1)
  part FF2 type:TFF pins:(T,Q1,Q2)
  part FF3 type:TFF pins:(T,Q2,Q3)
}
```

#### Registers

Multi-bit storage elements with clock and enable.

| Type               | Part Type   | Size      | Description             | Inputs         | Outputs |
| ------------------ | ----------- | --------- | ----------------------- | -------------- | ------- |
| **4-bit Register** | `type:REG4` | 100×80px  | 4-bit parallel register | D0-D3, CLK, EN | Q0-Q3   |
| **8-bit Register** | `type:REG8` | 120×100px | 8-bit parallel register | D0-D7, CLK, EN | Q0-Q7   |

**Example - 8-bit Register with Enable:**

```runiq
electrical "8-bit Register" {
  net CLK, EN
  net D0, D1, D2, D3, D4, D5, D6, D7
  net Q0, Q1, Q2, Q3, Q4, Q5, Q6, Q7

  part REG1 type:REG8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,CLK,EN,Q0,Q1,Q2,Q3,Q4,Q5,Q6,Q7)
}
```

**Example - Shift Register:**

```runiq
electrical "8-bit Shift Register" {
  net CLK, SHIFT_EN, SERIAL_IN, SERIAL_OUT
  net D0, D1, D2, D3, D4, D5, D6, D7

  // Chain of D flip-flops
  part FF0 type:DFF pins:(SERIAL_IN,CLK,D0)
  part FF1 type:DFF pins:(D0,CLK,D1)
  part FF2 type:DFF pins:(D1,CLK,D2)
  part FF3 type:DFF pins:(D2,CLK,D3)
  part FF4 type:DFF pins:(D3,CLK,D4)
  part FF5 type:DFF pins:(D4,CLK,D5)
  part FF6 type:DFF pins:(D5,CLK,D6)
  part FF7 type:DFF pins:(D6,CLK,D7)

  // Serial output from last stage
  net SERIAL_OUT
  part BUF type:BUFFER pins:(D7,SERIAL_OUT)
}
```

### Combinational Logic

#### Multiplexers (Data Selectors)

Select one of multiple inputs based on select lines.

| Type           | Part Type    | Size     | Description                  | Inputs       | Outputs |
| -------------- | ------------ | -------- | ---------------------------- | ------------ | ------- |
| **4-to-1 Mux** | `type:MUX41` | 60×80px  | 4 data inputs, 2 select bits | D0-D3, S0-S1 | Y       |
| **8-to-1 Mux** | `type:MUX81` | 70×120px | 8 data inputs, 3 select bits | D0-D7, S0-S2 | Y       |

**Example - 4-to-1 Multiplexer:**

```runiq
electrical "4-to-1 Multiplexer" {
  net D0, D1, D2, D3, S0, S1, Y

  part MUX1 type:MUX41 pins:(D0,D1,D2,D3,S0,S1,Y)
}
```

**MUX41 Truth Table:**

| S1  | S0  | Y   |
| --- | --- | --- |
| 0   | 0   | D0  |
| 0   | 1   | D1  |
| 1   | 0   | D2  |
| 1   | 1   | D3  |

**Example - 8-to-1 Multiplexer:**

```runiq
electrical "8-to-1 Multiplexer" {
  net D0, D1, D2, D3, D4, D5, D6, D7
  net S0, S1, S2, Y

  part MUX1 type:MUX81 pins:(D0,D1,D2,D3,D4,D5,D6,D7,S0,S1,S2,Y)
}
```

#### Decoders (Address Decoders)

Convert binary address to one-hot output.

| Type               | Part Type    | Size     | Description                | Inputs    | Outputs |
| ------------------ | ------------ | -------- | -------------------------- | --------- | ------- |
| **2-to-4 Decoder** | `type:DEC24` | 60×70px  | 2 address bits → 4 outputs | A0-A1, EN | Y0-Y3   |
| **3-to-8 Decoder** | `type:DEC38` | 70×110px | 3 address bits → 8 outputs | A0-A2, EN | Y0-Y7   |

**Example - 2-to-4 Decoder:**

```runiq
electrical "2-to-4 Decoder" {
  net A0, A1, EN, Y0, Y1, Y2, Y3

  part DEC1 type:DEC24 pins:(A0,A1,EN,Y0,Y1,Y2,Y3)
}
```

**DEC24 Truth Table (EN=1):**

| A1  | A0  | Y3  | Y2  | Y1  | Y0  |
| --- | --- | --- | --- | --- | --- |
| 0   | 0   | 0   | 0   | 0   | 1   |
| 0   | 1   | 0   | 0   | 1   | 0   |
| 1   | 0   | 0   | 1   | 0   | 0   |
| 1   | 1   | 1   | 0   | 0   | 0   |

**Example - 3-to-8 Decoder:**

```runiq
electrical "3-to-8 Decoder with Enable" {
  net A0, A1, A2, EN, Y0, Y1, Y2, Y3, Y4, Y5, Y6, Y7

  part DEC1 type:DEC38 pins:(A0,A1,A2,EN,Y0,Y1,Y2,Y3,Y4,Y5,Y6,Y7)
}
```

### Complete Sequential Circuit Examples

#### Example 1: 4-bit Synchronous Counter

```runiq
electrical "4-bit Synchronous Counter" {
  net CLK, RST, EN
  net Q0, Q1, Q2, Q3
  net T0, T1, T2, T3

  // T0 always toggles when enabled
  part AND_T0 type:AND pins:(EN,T0)
  part FF0 type:TFF pins:(T0,CLK,Q0)

  // T1 toggles when Q0=1 and enabled
  part AND_T1 type:AND pins:(Q0,EN,T1)
  part FF1 type:TFF pins:(T1,CLK,Q1)

  // T2 toggles when Q1=Q0=1 and enabled
  part AND_Q01 type:AND pins:(Q0,Q1,C1)
  part AND_T2 type:AND pins:(C1,EN,T2)
  part FF2 type:TFF pins:(T2,CLK,Q2)

  // T3 toggles when Q2=Q1=Q0=1 and enabled
  part AND_Q012 type:AND3 pins:(Q0,Q1,Q2,C2)
  part AND_T3 type:AND pins:(C2,EN,T3)
  part FF3 type:TFF pins:(T3,CLK,Q3)

  net C1, C2
}
```

**Behavior:**

- Counts from 0000 to 1111 (0 to 15)
- Wraps to 0000 after 1111
- Synchronous: all flip-flops triggered by same clock
- Enable pin freezes count when low

#### Example 2: 8-bit Shift Register with Parallel Load

```runiq
electrical "8-bit Shift Register with Parallel Load" {
  net CLK, LOAD, SHIFT, SERIAL_IN
  net D0, D1, D2, D3, D4, D5, D6, D7  // Parallel inputs
  net Q0, Q1, Q2, Q3, Q4, Q5, Q6, Q7  // Parallel outputs
  net M0, M1, M2, M3, M4, M5, M6, M7  // Mux outputs

  // Multiplexers select between parallel load and shift
  part MUX0 type:MUX41 pins:(Q0,SERIAL_IN,D0,0,SHIFT,LOAD,M0)
  part MUX1 type:MUX41 pins:(Q1,Q0,D1,0,SHIFT,LOAD,M1)
  part MUX2 type:MUX41 pins:(Q2,Q1,D2,0,SHIFT,LOAD,M2)
  part MUX3 type:MUX41 pins:(Q3,Q2,D3,0,SHIFT,LOAD,M3)
  part MUX4 type:MUX41 pins:(Q4,Q3,D4,0,SHIFT,LOAD,M4)
  part MUX5 type:MUX41 pins:(Q5,Q4,D5,0,SHIFT,LOAD,M5)
  part MUX6 type:MUX41 pins:(Q6,Q5,D6,0,SHIFT,LOAD,M6)
  part MUX7 type:MUX41 pins:(Q7,Q6,D7,0,SHIFT,LOAD,M7)

  // D flip-flops
  part FF0 type:DFF pins:(M0,CLK,Q0)
  part FF1 type:DFF pins:(M1,CLK,Q1)
  part FF2 type:DFF pins:(M2,CLK,Q2)
  part FF3 type:DFF pins:(M3,CLK,Q3)
  part FF4 type:DFF pins:(M4,CLK,Q4)
  part FF5 type:DFF pins:(M5,CLK,Q5)
  part FF6 type:DFF pins:(M6,CLK,Q6)
  part FF7 type:DFF pins:(M7,CLK,Q7)
}
```

**Operations:**

- **LOAD=1**: Parallel load D0-D7 into Q0-Q7
- **SHIFT=1**: Shift right, SERIAL_IN enters Q0
- **LOAD=0, SHIFT=0**: Hold current value

#### Example 3: State Machine - Traffic Light Controller

```runiq
electrical "Traffic Light Controller" {
  net CLK, RST
  net STATE0, STATE1, STATE2  // 3-bit state
  net TIMER_DONE
  net NS_RED, NS_YELLOW, NS_GREEN
  net EW_RED, EW_YELLOW, EW_GREEN

  // State register (3 D flip-flops)
  part FF0 type:DFF pins:(NEXT_STATE0,CLK,STATE0)
  part FF1 type:DFF pins:(NEXT_STATE1,CLK,STATE1)
  part FF2 type:DFF pins:(NEXT_STATE2,CLK,STATE2)

  // Next state logic
  // State 0: NS Green, EW Red → State 1 when timer done
  part NS0 type:AND3 pins:(STATE0,TIMER_DONE,NOT_STATE1,T0)
  part NS1 type:OR pins:(T0,OTHER_COND,NEXT_STATE0)

  // Output logic - North/South lights
  part NS_GRN type:AND pins:(STATE0,NS_GREEN)
  part NS_YEL type:AND pins:(STATE1,NS_YELLOW)
  part NS_R type:NOR pins:(STATE0,STATE1,NS_RED)

  // Output logic - East/West lights
  part EW_R type:OR pins:(STATE0,STATE1,EW_RED)
  part EW_YEL type:AND pins:(STATE2,EW_YELLOW)
  part EW_GRN type:AND pins:(STATE3,EW_GREEN)

  net NEXT_STATE0, NEXT_STATE1, NEXT_STATE2
  net NOT_STATE1, T0, OTHER_COND
}
```

**State Machine:**

1. **State 0**: NS Green, EW Red (30s)
2. **State 1**: NS Yellow, EW Red (5s)
3. **State 2**: NS Red, EW Green (30s)
4. **State 3**: NS Red, EW Yellow (5s)
5. **Return to State 0**

## Verilog Export

Both profiles export to **synthesizable Verilog HDL** for FPGA/ASIC implementation and simulation.

### Export from Electrical Profile

Electrical circuits export to **gate-level Verilog** with primitive gate instantiations.

**Runiq DSL:**

```runiq
electrical "Half Adder" {
  net A, B, SUM, CARRY

  part U1 type:XOR pins:(A,B,SUM)
  part U2 type:AND pins:(A,B,CARRY)
}
```

**Generated Verilog:**

```verilog
// Half Adder
// Generated by Runiq

module half_adder(
  input wire A,
  input wire B,
  output wire SUM,
  output wire CARRY
);

  xor U1(SUM, A, B);
  and U2(CARRY, A, B);

endmodule
```

**Features:**

- **Primitive gates**: `and`, `or`, `not`, `xor`, `nand`, `nor`, `xnor`
- **Direct mapping**: Each `part` becomes a gate instantiation
- **IEEE Std 1364**: Compliant Verilog-2001 syntax
- **Synthesizable**: Works with Xilinx Vivado, Intel Quartus, open-source tools

### Export from Digital Profile

Digital profiles export to **hierarchical Verilog** with module definitions and port mapping.

**Runiq DSL:**

```runiq
digital "4-bit Counter" {
  module Counter ports:(clk, reset, enable, count[3:0]) params:(WIDTH:4)

  net clk, reset, enable
  net count[3:0]

  inst U1 of:Counter map:(clk:clk, reset:reset, enable:enable, count:count)
}
```

**Generated Verilog:**

```verilog
// 4-bit Counter
// Generated by Runiq

module Counter
#(
  parameter WIDTH = 4
)
(
  input clk,
  input reset,
  input enable,
  output [3:0] count
);

  // Module implementation

endmodule

module system(
  input clk,
  input reset,
  input enable,
  output [3:0] count
);

  Counter U1 (
    .clk(clk),
    .reset(reset),
    .enable(enable),
    .count(count)
  );

endmodule
```

**Features:**

- **Hierarchical design**: Nested module instantiations
- **Bus notation**: `[7:0]` becomes `[7:0]` in Verilog
- **Parameters**: `#(parameter WIDTH = 8)` declarations
- **Named port mapping**: `.port(net)` connections
- **Reusable modules**: Define once, instantiate multiple times

### Export Workflow

#### Using the CLI

```bash
# Parse and export to Verilog
runiq export --format verilog --input circuit.runiq --output circuit.v

# Verify Verilog syntax
iverilog -t null circuit.v
```

#### Using the API

```typescript
import { parse } from '@runiq/parser-dsl';
import { toVerilog } from '@runiq/export-verilog';
import * as fs from 'fs';

// Read Runiq DSL
const content = await fs.readFile('counter.runiq', 'utf-8');
const parseResult = parse(content);

// Find digital/electrical profile
const profile = parseResult.document.profiles.find(
  (p) => p.type === 'digital' || p.type === 'electrical'
);

// Export to Verilog
const verilogResult = toVerilog(profile);

// Write to file
await fs.writeFile('counter.v', verilogResult.verilog);

console.log(`Exported ${verilogResult.moduleCount} modules`);
console.log(`Warnings: ${verilogResult.warnings.length}`);
```

### Simulation with Icarus Verilog

**Step 1: Create testbench**

```verilog
`timescale 1ns/1ps

module tb_half_adder();
  reg A, B;
  wire SUM, CARRY;

  // Instantiate DUT
  half_adder dut (
    .A(A),
    .B(B),
    .SUM(SUM),
    .CARRY(CARRY)
  );

  initial begin
    $dumpfile("half_adder.vcd");
    $dumpvars(0, tb_half_adder);

    // Test all combinations
    A = 0; B = 0; #10;
    A = 0; B = 1; #10;
    A = 1; B = 0; #10;
    A = 1; B = 1; #10;

    $finish;
  end
endmodule
```

**Step 2: Compile and simulate**

```bash
# Compile with Icarus Verilog
iverilog -o half_adder.vvp half_adder.v tb_half_adder.v

# Run simulation
vvp half_adder.vvp

# View waveforms
gtkwave half_adder.vcd
```

### Synthesis with Yosys (Open Source)

```bash
# Synthesize to gate-level netlist
yosys -p "read_verilog half_adder.v; synth -top half_adder; write_verilog -noattr half_adder_synth.v"

# Target FPGA (Lattice iCE40)
yosys -p "read_verilog counter.v; synth_ice40 -top counter; write_json counter.json"
nextpnr-ice40 --json counter.json --pcf pins.pcf --asc counter.asc
icepack counter.asc counter.bin
```

### Synthesis with Commercial Tools

#### Xilinx Vivado

```tcl
# Create project
create_project -force counter ./counter_vivado -part xc7a35tcpg236-1

# Add Verilog sources
add_files {counter.v}
set_property top counter [current_fileset]

# Synthesize
synth_design -top counter -part xc7a35tcpg236-1

# Implement
opt_design
place_design
route_design

# Generate bitstream
write_bitstream -force counter.bit
```

#### Intel Quartus

```tcl
# Create project
project_new counter -overwrite

# Add Verilog files
set_global_assignment -name VERILOG_FILE counter.v
set_global_assignment -name TOP_LEVEL_ENTITY counter

# Target device
set_global_assignment -name DEVICE EP4CE22F17C6

# Compile
execute_flow -compile
```

### Verilog Export Options

The `@runiq/export-verilog` package supports various options:

```typescript
const verilogResult = toVerilog(profile, {
  // Output format
  indentSize: 2, // Spaces per indent level
  lineWidth: 80, // Max line width before wrapping

  // Module naming
  modulePrefix: 'runiq_', // Prefix for generated modules

  // Comments
  includeComments: true, // Include DSL comments
  includeTimestamp: true, // Add generation timestamp

  // Code style
  declareWires: true, // Explicit wire declarations
  useParameterizedWidth: false, // Use parameters for bus widths
});
```

### Common Export Patterns

#### Pattern 1: Combinational Logic

```runiq
electrical "Full Adder" {
  net A, B, CIN, SUM, COUT, S1, C1, C2

  part XOR1 type:XOR pins:(A,B,S1)
  part XOR2 type:XOR pins:(S1,CIN,SUM)
  part AND1 type:AND pins:(A,B,C1)
  part AND2 type:AND pins:(S1,CIN,C2)
  part OR1 type:OR pins:(C1,C2,COUT)
}
```

**Exports to:**

```verilog
module full_adder(
  input wire A, B, CIN,
  output wire SUM, COUT
);
  wire S1, C1, C2;

  xor XOR1(S1, A, B);
  xor XOR2(SUM, S1, CIN);
  and AND1(C1, A, B);
  and AND2(C2, S1, CIN);
  or OR1(COUT, C1, C2);
endmodule
```

#### Pattern 2: Sequential Logic with Parameters

```runiq
digital "N-bit Counter" {
  module Counter ports:(clk, reset, enable, count[N-1:0]) params:(N:8)

  net clk, reset, enable
  net count[N-1:0]
  net next_count[N-1:0]

  // Adder for increment
  inst ADD1 of:Adder map:(a:count, b:1, sum:next_count) params:(WIDTH:N)

  // Register for state
  inst REG1 of:Register map:(clk:clk, d:next_count, q:count) params:(WIDTH:N)
}
```

**Exports to:**

```verilog
module Counter
#(
  parameter N = 8
)
(
  input clk,
  input reset,
  input enable,
  output [N-1:0] count
);
  wire [N-1:0] next_count;

  Adder #(.WIDTH(N)) ADD1 (
    .a(count),
    .b(8'd1),
    .sum(next_count)
  );

  Register #(.WIDTH(N)) REG1 (
    .clk(clk),
    .d(next_count),
    .q(count)
  );
endmodule
```

### Verification Best Practices

1. **Write testbenches**: Always create comprehensive testbenches
2. **Check timing**: Use `$time` and `#delay` for proper sequencing
3. **Dump waveforms**: Use `$dumpfile` and `$dumpvars` for debugging
4. **Lint before synthesis**: Run `verilator --lint-only` to catch issues
5. **Simulate post-synthesis**: Verify gate-level netlist behavior matches RTL

### Troubleshooting

**Issue: "Identifier not declared"**

- Ensure all nets are declared in `net` statements
- Check for typos in pin names

**Issue: "Multiple drivers for wire"**

- A net can have only one driver
- Use tri-state logic or multiplexers for multiple sources

**Issue: "Incorrect port connection"**

- Verify port names match module definition
- Check bus widths match (`[7:0]` to `[7:0]`)

**Issue: "Synthesis failure"**

- Avoid using Verilog keywords as net names
- Ensure all paths have defined logic levels
- Check for combinational loops

## Summary

- **Use `electrical`** for simple gate circuits and mixed analog/digital
- **Use `digital`** for hierarchical designs with modules and buses
- Both export to Verilog
- `electrical` is simpler, `digital` is more powerful for complex systems

## See Also

- [Electrical Circuits →](/guide/electrical) - Analog circuit design
- [Verilog Export →](/export/verilog) - HDL code generation
- [Examples →](/examples/digital) - More digital circuit examples
