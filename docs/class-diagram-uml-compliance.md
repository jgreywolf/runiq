# UML Class Diagram Compliance - Gap Analysis & Implementation Plan

## Current Status

✅ **Fully Implemented Features:**

- 3-compartment structure (class name, attributes, methods)
- Visibility modifiers (+, -, #, ~ for public/private/protected/package)
- Generic types (single `<T>`, multiple `<K,V>`, nested `Map<String,T>`, bounded `T extends Comparable<T>`)
- Stereotypes («interface», «abstract»)
- Attributes with name, type, default values
- Methods with name, parameters, return type (now optional, defaults to void)
- Static members (isStatic boolean flag)
- Abstract methods (isAbstract flag)
- Basic relationships (inheritance, realization via edge types)
- **Innovative**: Member-level edges (Class.field → OtherClass.method)

## Missing UML 2.5 Standard Features

Based on [Wikipedia UML Class Diagram](https://en.wikipedia.org/wiki/Class_diagram) and UML 2.5 specification.

### Priority 1: Essential Relationship Features (High Impact)

#### 1.1 Multiplicity (Cardinality) ⭐⭐⭐

**UML Standard:**

- Placed at both ends of associations
- Common values: `0..1`, `1`, `1..*`, `0..*`, `*`, `1..1`

**Current State:** Not supported

**Implementation Plan:**

```
Grammar Addition (Edge properties):
  MultiplicitySourceProperty: 'multiplicitySource:' value=Multiplicity
  MultiplicityTargetProperty: 'multiplicityTarget:' value=Multiplicity
  Multiplicity: NUMBER | NUMBER '..' (NUMBER | '*') | '*'

Example Syntax:
  edge Customer -> Order
    edgeType: association
    multiplicitySource: "1"
    multiplicityTarget: "0..*"
    label: "places"
```

**Rendering:**

- Text near source/target ends of edge
- Font: smaller than label, positioned near connection point

#### 1.2 Aggregation (Hollow Diamond) ⭐⭐⭐

**UML Standard:**

- Shared ownership ("has-a" but independent lifecycle)
- Hollow diamond on container side
- Example: Department ◇--- Employee

**Current State:** Only basic line relationships

**Implementation Plan:**

```
Grammar Addition:
  edge Company -> Employee
    edgeType: aggregation
    multiplicitySource: "1"
    multiplicityTarget: "1..*"
```

**Rendering:**

- Modify SVG edge rendering in renderer-svg
- Add hollow diamond marker definition
- Apply to source end of edge

#### 1.3 Composition (Filled Diamond) ⭐⭐⭐

**UML Standard:**

- Strong ownership (lifecycle dependency)
- Filled diamond on container side
- Example: House ◆--- Room (room destroyed when house destroyed)

**Current State:** Not supported

**Implementation Plan:**

```
Grammar Addition:
  edge House -> Room
    edgeType: composition
    multiplicitySource: "1"
    multiplicityTarget: "1..*"
```

**Rendering:**

- Filled diamond SVG marker
- Apply to source end of edge

#### 1.4 Association Names & Role Names ⭐⭐

**UML Standard:**

- Association name: label on the line
- Role names: labels at each end
- Example: `Company [employer] ---- employs --- [employee] Person`

**Current State:** Only basic label supported

**Implementation Plan:**

```
Grammar Addition:
  RoleSourceProperty: 'roleSource:' value=STRING
  RoleTargetProperty: 'roleTarget:' value=STRING

Example:
  edge Company -> Person
    edgeType: association
    label: "employs"
    roleSource: "employer"
    roleTarget: "employee"
```

**Rendering:**

- Role names near endpoints (smaller font)
- Association name at midpoint (current label behavior)

### Priority 2: Visual Enhancements (Medium Impact) ✅ COMPLETE

#### 2.1 Derived Attributes (/ prefix) ⭐⭐ ✅

**UML Standard:**

- Prefix attribute with `/` to indicate it's computed
- Example: `/age` (calculated from birthdate)

**Current State:** ✅ Implemented

**Implementation Complete:**

- Grammar: Added `AttrDerivedField: 'derived:' value=BOOLEAN`
- Parser: Extracts `isDerived` property
- Type: Added `isDerived?: boolean` to `ClassAttribute` interface
- Rendering: `formatAttribute` adds `/` prefix when `isDerived` is true
- Tests: 7/7 passing in `class-visual-enhancements.test.ts`
- Example: `visual-enhancements-example.runiq`

```runiq
attributes:[
  {name:"birthdate" type:"Date"},
  {name:"age" type:"int" derived:true} // Renders as: + /age: int
]
```

#### 2.2 Static Member Underline ⭐⭐ ✅

**UML Standard:**

- Static members shown with underline
- Currently we have `isStatic` flag but don't render underline

**Current State:** ✅ Implemented

**Implementation Complete:**

- Updated `formatAttribute` and methods rendering to wrap in `<tspan text-decoration="underline">`
- Works for both static attributes and static methods
- Can combine with other modifiers (e.g., static + derived)
- Tests: All passing
- Example: `visual-enhancements-example.runiq`

```runiq
attributes:[
  {name:"PI" type:"double" visibility:public static:true} // Renders underlined
]
```

#### 2.3 Abstract Method Italics ⭐⭐ ✅

**UML Standard:**

- Abstract methods shown in italics

**Current State:** ✅ Implemented

**Implementation Complete:**

- Updated methods rendering to wrap in `<tspan font-style="italic">`
- Can combine with static (though semantically unusual)
- Tests: All passing
- Example: `visual-enhancements-example.runiq`

```runiq
methods:[
  {name:"calculateArea" returnType:"double" abstract:true} // Renders in italics
]
```

#### 2.4 Navigability Arrows ⭐

**UML Standard:**

- Open arrow on navigable end
- Cross (×) on non-navigable end

**Current State:** All associations implicitly bi-directional

**Implementation Plan:**

```
Grammar Addition:
  NavigableProperty: 'navigable:' value=NavigabilityDirection
  NavigabilityDirection: 'source' | 'target' | 'bidirectional' | 'none'

Example:
  edge Customer -> Order
    navigable: target  // Customer can access Orders
```

**Rendering:**

- Modify edge markers based on navigability
- Add cross symbol for non-navigable ends

### Priority 3: Advanced Features (Low Impact, High Complexity)

#### 3.1 Constraints ⭐

**UML Standard:**

- Text in braces: `{ordered}`, `{unique}`, `{readonly}`
- Can apply to attributes, methods, associations

**Implementation Plan:**

```
Grammar Addition:
  ConstraintsProperty: 'constraints:' '[' values+=STRING+ ']'

Example:
  attributes:[
    {name:"items" type:"List<Item>" constraints:["ordered", "unique"]}
  ]
```

**Rendering:**

- Small text in braces after element

#### 3.2 Qualified Associations

**UML Standard:**

- Small box on association line showing qualifier

**Complexity:** High - requires extended edge rendering

#### 3.3 Association Classes

**UML Standard:**

- Class attached to association line with dashed line

**Complexity:** High - requires new node type and connection rules

#### 3.4 N-ary Associations

**UML Standard:**

- Diamond node with 3+ connections

**Complexity:** High - requires special node type

#### 3.5 Notes/Comments

**UML Standard:**

- Yellow sticky note with dashed line to element

**Complexity:** Medium - could be new node type

## Recommended Implementation Phases

### Phase 1: Relationship Enhancements (Immediate - Next 2 weeks)

- [x] Optional returnType (DONE!)
- [ ] Multiplicity on edges (1.1)
- [ ] Aggregation diamond (1.2)
- [ ] Composition diamond (1.3)
- [ ] Role names (1.4)

**Impact:** Makes class diagrams fully functional for most use cases

### Phase 2: Visual Polish (Following 1 week)

- [ ] Derived attribute prefix (2.1)
- [ ] Static member underline (2.2)
- [ ] Abstract method italics (2.3)
- [ ] Navigability arrows (2.4)

**Impact:** Matches UML notation exactly, improves clarity

### Phase 3: Advanced Features (Future)

- [ ] Constraints (3.1)
- [ ] Notes/Comments (3.5)
- [ ] Qualified Associations (3.2)
- [ ] Association Classes (3.3)
- [ ] N-ary Associations (3.4)

**Impact:** Covers edge cases, power-user features

## Implementation Strategy

### For Grammar Changes:

1. Update `runiq.langium` with new properties
2. Run `pnpm langium:generate` to regenerate parser
3. Update `langium-parser.ts` to handle new properties
4. Add tests in `parser-dsl/src/__tests__/class-diagrams.test.ts`

### For Rendering Changes:

1. Update `packages/core/src/shapes/uml/class.ts` for class rendering
2. Update `packages/renderer-svg/src/svg-renderer.ts` for edge markers
3. Add SVG marker definitions for diamonds, arrows, crosses
4. Add tests in `core/src/__tests__/new-shapes.test.ts`

### For Layout Changes:

- Multiplicity, roles, constraints: No layout impact (just labels)
- Diamonds: Extend edge start point to accommodate diamond size
- Navigability: May need marker size calculation

## Test Coverage Requirements

Each new feature must have:

1. **Parser test**: Verify syntax parsing correctly
2. **Shape test**: Verify rendering produces correct SVG
3. **Example**: Add to `examples/class-diagrams/`
4. **Documentation**: Update README with syntax

## Current Test Status

- ✅ 18/18 class shape tests passing
- ✅ 8/8 parser tests passing
- ✅ 6 working examples
- ✅ Optional returnType verified working

## Notes

**Member-Level Edges:**
Our innovative Class.field → OtherClass.method syntax is NOT standard UML, but it's extremely useful for:

- Database foreign keys
- Dependency injection connections
- Event handler wiring
- Factory pattern object creation

This should be documented as a **Runiq Extension** to standard UML.

## References

- [UML 2.5.1 Specification](https://www.omg.org/spec/UML/2.5.1/PDF)
- [Wikipedia: Class Diagram](https://en.wikipedia.org/wiki/Class_diagram)
- [UML Diagrams.org](https://www.uml-diagrams.org/class-diagrams.html)
