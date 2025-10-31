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

## Verilog Export

Both profiles can export to Verilog:

### From Electrical Profile

```verilog
// Simple gate-level Verilog
module half_adder(
  input A,
  input B,
  output SUM,
  output CARRY
);
  xor XOR1 (SUM, A, B);
  and AND1 (CARRY, A, B);
endmodule
```

### From Digital Profile

```verilog
// Hierarchical Verilog with modules
module counter(
  input clk,
  input reset,
  output [3:0] count
);
  // Module implementation
endmodule

module system(
  input clk,
  input reset,
  output [3:0] out
);
  counter U1 (
    .clk(clk),
    .reset(reset),
    .count(out)
  );
endmodule
```

## Summary

- **Use `electrical`** for simple gate circuits and mixed analog/digital
- **Use `digital`** for hierarchical designs with modules and buses
- Both export to Verilog
- `electrical` is simpler, `digital` is more powerful for complex systems

## See Also

- [Electrical Circuits →](/guide/electrical) - Analog circuit design
- [Verilog Export →](/export/verilog) - HDL code generation
- [Examples →](/examples/digital) - More digital circuit examples
