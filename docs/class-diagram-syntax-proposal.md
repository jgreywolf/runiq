# Class Diagram Syntax Improvement Proposal

## Current Syntax (Verbose)

```runiq
shape Person as @class label:"Person"
  attributes:[
    {name:"name" type:"string" visibility:private},
    {name:"age" type:"int" visibility:private},
    {name:"email" type:"string" visibility:public}
  ]
  methods:[
    {name:"getName" returnType:"string" visibility:public},
    {name:"setName" params:[{name:"value" type:"string"}] visibility:public},
    {name:"getAge" returnType:"int" visibility:public},
    {name:"celebrate" visibility:public}
  ]
```

**Issues:**

- 15 lines for a simple class
- Every property needs explicit key-value syntax
- Visibility specified even when public (default)
- Empty params methods still very verbose

## Proposed Syntax (Concise)

### Option 1: Shorthand String Format

```runiq
shape Person as @class label:"Person"
  attributes:[
    "name:string private",
    "age:int private",
    "email:string"  // defaults to public
  ]
  methods:[
    "getName:string",  // public by default, returns string
    "setName(value:string)",  // public, params in parentheses
    "getAge:int",
    "celebrate"  // public, returns void
  ]
```

**Benefits:**

- 9 lines (40% reduction!)
- Reads more naturally (like programming language syntax)
- Visibility defaults to public
- Still allows full object syntax when needed

### Option 2: Hybrid Approach (Best of Both)

Allow BOTH formats - string shorthand OR full object:

```runiq
shape BankAccount as @class label:"BankAccount"
  attributes:[
    "balance:decimal private",  // shorthand
    "accountNumber:string",
    {name:"owner" type:"Person" visibility:private static:true}  // full control
  ]
  methods:[
    "getBalance:decimal",  // shorthand
    "deposit(amount:decimal)",
    {name:"withdraw" params:[{name:"amount" type:"decimal"}] returnType:"bool" visibility:public abstract:true}  // when you need abstract, static, etc.
  ]
```

## Shorthand Grammar Rules

### Attribute Shorthand: `"name:type [visibility] [=default]"`

Examples:

- `"id:int"` → `{name:"id" type:"int" visibility:public}`
- `"name:string private"` → `{name:"name" type:"string" visibility:private}`
- `"count:int=0"` → `{name:"count" type:"int" visibility:public default:"0"}`
- `"MAX:int private static"` → `{name:"MAX" type:"int" visibility:private static:true}`

### Method Shorthand: `"name[(params)][:\return\Type] [visibility]"`

Examples:

- `"clear"` → `{name:"clear" visibility:public returnType:"void"}`
- `"getValue:int"` → `{name:"getValue" returnType:"int" visibility:public}`
- `"add(a:int, b:int):int"` → `{name:"add" params:[...] returnType:"int" visibility:public}`
- `"save private"` → `{name:"save" visibility:private returnType:"void"}`

### Parameter Shorthand: `"name:type"`

Examples:

- `"value:string"` → `{name:"value" type:"string"}`
- `"x:int, y:int"` → `[{name:"x" type:"int"}, {name:"y" type:"int"}]`

## Implementation Strategy

### Phase 1: Add Alternative Rules

```langium
AttributeDecl:
    '{' properties+=AttributeField+ '}'  // existing
    | value=AttributeShorthand;           // NEW

AttributeShorthand returns string:
    STRING;  // will be parsed by custom logic

MethodDecl:
    '{' properties+=MethodField+ '}'     // existing
    | value=MethodShorthand;             // NEW

MethodShorthand returns string:
    STRING;  // will be parsed by custom logic
```

### Phase 2: Parser Logic

Add helper functions in `langium-parser.ts`:

```typescript
function parseAttributeShorthand(shorthand: string): AttributeAst {
  // Parse "name:type [visibility] [=default] [static]"
  const regex =
    /^(\w+):(\w+)(?:\s+(public|private|protected|package))?(?:=(.+))?(?:\s+(static))?$/;
  // ... parse and return object
}

function parseMethodShorthand(shorthand: string): MethodAst {
  // Parse "name[(params)][:\return\Type] [visibility] [abstract] [static]"
  // ... parse and return object
}
```

## Migration Path

1. **Backward Compatible** - Old syntax continues to work
2. **Gradual Adoption** - Users can mix shorthand and full syntax
3. **Examples Updated** - Show both approaches
4. **Documentation** - Clear guide on when to use each

## Real-World Comparison

### Current: University Example (134 lines)

```runiq
methods:[
  {name:"teach" params:[{name:"course" type:"Course"}] visibility:public},
  {name:"research" returnType:"Paper" visibility:public}
]
```

### Proposed: (much shorter)

```runiq
methods:[
  "teach(course:Course)",
  "research:Paper"
]
```

### Savings: ~40-60% fewer characters for typical classes!

## Decision Needed

Which approach would you prefer?

**A) Option 1**: Shorthand only (breaking change, need migration)
**B) Option 2**: Hybrid (both syntaxes supported) ✅ RECOMMENDED
\*\*C) Stay with current verbose syntax

I recommend **Option 2 (Hybrid)** because:

- ✅ Backward compatible
- ✅ Gives users choice
- ✅ Simple cases stay simple, complex cases stay possible
- ✅ Easy to implement incrementally
