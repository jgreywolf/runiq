# @runiq/export-verilog

Verilog HDL exporter for Runiq digital circuits.

## ✨ Features

- **Module Generation** - Convert digital profiles to Verilog modules
- **Port Declarations** - Input, output, and inout ports with bus widths
- **Parameters** - Module parameters with default values
- **Wire Declarations** - Automatic internal wire generation
- **Instance Generation** - Module instantiation with port/parameter mapping
- **Bus Support** - Multi-bit signals with `[N:0]` notation
- **Validation** - Warns about undeclared nets
- **Comprehensive Testing** - 15/15 tests passing with full coverage

## 📦 Installation

```bash
pnpm add @runiq/export-verilog
```

## 🚀 Quick Start

```typescript
import { toVerilog } from '@runiq/export-verilog';
import type { DigitalProfile } from '@runiq/core';

const counter: DigitalProfile = {
  type: 'digital',
  name: 'Counter4bit',
  modules: [
    {
      name: 'Counter4bit',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'reset', dir: 'input' },
        { name: 'count', dir: 'output', width: 4 },
      ],
    },
  ],
  instances: [],
  nets: [
    { name: 'clk' },
    { name: 'reset' },
    { name: 'count', width: 4 },
  ],
};

const result = toVerilog(counter);
console.log(result.verilog);
```

**Output:**
```verilog
module Counter4bit
(
  input clk,
  input reset,
  output [3:0] count
);

endmodule
```

## 📚 Examples

### Simple Logic Gate

```typescript
const andGate: DigitalProfile = {
  type: 'digital',
  name: 'AND2',
  modules: [
    {
      name: 'AND2',
      ports: [
        { name: 'a', dir: 'input' },
        { name: 'b', dir: 'input' },
        { name: 'y', dir: 'output' },
      ],
    },
  ],
  instances: [],
  nets: [
    { name: 'a' },
    { name: 'b' },
    { name: 'y' },
  ],
};

const result = toVerilog(andGate);
```

**Output:**
```verilog
module AND2
(
  input a,
  input b,
  output y
);

endmodule
```

### Parameterized Module

```typescript
const register: DigitalProfile = {
  type: 'digital',
  name: 'Register',
  modules: [
    {
      name: 'Register',
      ports: [
        { name: 'clk', dir: 'input' },
        { name: 'd', dir: 'input', width: 8 },
        { name: 'q', dir: 'output', width: 8 },
      ],
      params: {
        WIDTH: 8,
        RESET_VALUE: 0,
      },
    },
  ],
  instances: [],
  nets: [
    { name: 'clk' },
    { name: 'd', width: 8 },
    { name: 'q', width: 8 },
  ],
};
```

**Output:**
```verilog
module Register
#(
  parameter WIDTH = 8,
  parameter RESET_VALUE = 0
)
(
  input clk,
  input [7:0] d,
  output [7:0] q
);

endmodule
```

### Hierarchical Design with Instances

```typescript
const alu: DigitalProfile = {
  type: 'digital',
  name: 'ALU4bit',
  modules: [
    {
      name: 'ALU4bit',
      ports: [
        { name: 'a', dir: 'input', width: 4 },
        { name: 'b', dir: 'input', width: 4 },
        { name: 'op', dir: 'input', width: 2 },
        { name: 'result', dir: 'output', width: 4 },
      ],
    },
  ],
  instances: [
    {
      ref: 'ADDER',
      of: 'Adder4bit',
      portMap: {
        a: 'a',
        b: 'b',
        sum: 'add_result',
      },
    },
    {
      ref: 'MUX',
      of: 'Mux4to1',
      paramMap: { WIDTH: 4 },
      portMap: {
        sel: 'op',
        in0: 'add_result',
        in1: 'sub_result',
        out: 'result',
      },
    },
  ],
  nets: [
    { name: 'a', width: 4 },
    { name: 'b', width: 4 },
    { name: 'op', width: 2 },
    { name: 'result', width: 4 },
    { name: 'add_result', width: 4 },
    { name: 'sub_result', width: 4 },
  ],
};
```

**Output:**
```verilog
module ALU4bit
(
  input [3:0] a,
  input [3:0] b,
  input [1:0] op,
  output [3:0] result
);

  // Internal wires
  wire [3:0] add_result;
  wire [3:0] sub_result;

  // Module instances
  Adder4bit ADDER (
    .a(a),
    .b(b),
    .sum(add_result)
  );

  Mux4to1 #(
    .WIDTH(4)
  ) MUX (
    .sel(op),
    .in0(add_result),
    .in1(sub_result),
    .out(result)
  );

endmodule
```

## 🎯 API Reference

### `toVerilog(profile: DigitalProfile): VerilogResult`

Converts a digital profile to Verilog HDL.

**Parameters:**
- `profile: DigitalProfile` - The digital circuit to convert

**Returns:**
```typescript
interface VerilogResult {
  verilog: string;    // Generated Verilog code
  warnings: string[]; // Any validation warnings
}
```

### `DigitalProfile`

```typescript
interface DigitalProfile {
  type: 'digital';
  name: string;               // Top-level module name
  modules?: ModuleAst[];      // Module declarations
  instances: InstanceAst[];   // Module instances
  nets: NetAst[];             // Wire/net declarations
}
```

### `ModuleAst`

```typescript
interface ModuleAst {
  name: string;                           // Module name
  ports: PortAst[];                       // Port list
  params?: Record<string, string | number>; // Parameters
}
```

### `PortAst`

```typescript
interface PortAst {
  name: string;                    // Port name
  dir: 'input' | 'output' | 'inout'; // Direction
  width?: number;                  // Bus width (optional)
}
```

### `InstanceAst`

```typescript
interface InstanceAst {
  ref: string;                              // Instance name
  of: string;                               // Module type
  paramMap?: Record<string, string | number>; // Parameter overrides
  portMap: Record<string, string>;          // Port connections
}
```

### `NetAst`

```typescript
interface NetAst {
  name: string;   // Net name
  width?: number; // Bus width (optional)
}
```

## ✅ Validation

The exporter performs validation and provides warnings for:

- **Undeclared Nets**: Nets used in instances but not declared in the nets list
- **Port Conflicts**: Ports that might conflict with wire declarations

Example:
```typescript
const result = toVerilog(profile);

if (result.warnings.length > 0) {
  console.warn('Validation warnings:');
  result.warnings.forEach(w => console.warn('  -', w));
}
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

**Test Coverage:**
- ✅ Simple modules (4 tests)
- ✅ Wire declarations (2 tests)
- ✅ Module instances (4 tests)
- ✅ Edge cases & validation (3 tests)
- ✅ Complete examples (2 tests)
- **Total: 15/15 tests passing** ✅

## 🔧 Complete Workflow

### 1. Write Runiq Digital Circuit

```runiq
digital "Counter" {
  module Counter {
    param WIDTH = 8
    input clk
    input reset
    output [7:0] count
  }
  
  net clk, reset, count[7:0]
}
```

### 2. Parse and Export

```typescript
import { parse } from '@runiq/parser-dsl';
import { toVerilog } from '@runiq/export-verilog';

const content = await fs.readFile('counter.runiq', 'utf-8');
const parseResult = parse(content);

const digitalProfile = parseResult.document.profiles.find(
  p => p.type === 'digital'
);

const verilogResult = toVerilog(digitalProfile);

await fs.writeFile('counter.v', verilogResult.verilog);
```

## 🎨 Generated Code Style

The exporter generates clean, readable Verilog:

- **Consistent indentation** - 2 spaces
- **Clear sections** - Comments separate wires from instances
- **IEEE 1364 compliant** - Standard Verilog-2001 syntax
- **Bus notation** - `[N:0]` format for multi-bit signals
- **Named port connections** - `.port(net)` style

## 🚀 Future Enhancements

Potential additions (not yet implemented):

- Assign statements for continuous assignments
- Always blocks for behavioral code
- Initial blocks for simulation
- Generate blocks for parameterized arrays
- SystemVerilog features (logic, interfaces, etc.)

## 📖 Related Packages

- `@runiq/core` - Core types and interfaces
- `@runiq/parser-dsl` - Runiq DSL parser
- `@runiq/export-spice` - SPICE netlist exporter (for electrical circuits)

## 📄 License

MIT

---

**Status:** Production ready - 15/15 tests passing ✅
