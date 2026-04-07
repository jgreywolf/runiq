# Requirement Diagrams

Requirement diagrams let you capture SysML-style requirements inside the `diagram` profile using specialized requirement shapes, package containers, and labeled relationships.

## Supported Shapes

- `@requirementPackage`
- `@requirement`
- `@testCase`

Requirement IDs use the existing `title:` property. The visible requirement statement stays in `label:`.

## Basic Example

```runiq
diagram "Brake System Requirements" {
  direction LR

  container sysReqs "Brake System" as @requirementPackage {
    shape stopping as @requirement title:"REQ-001" label:"Stopping distance under 40m"
    shape abs as @requirement title:"REQ-002" label:"ABS shall engage on wheel slip"
  }

  shape ecu as @subsystemBlock label:"Brake ECU"
  shape bench as @testCase label:"BrakeBenchTest"

  abs -> stopping stereotype:"deriveReqt" lineStyle:"dashed" arrowType:open
  ecu -> abs stereotype:"satisfy"
  bench -> abs stereotype:"verify" lineStyle:"dashed" arrowType:open
}
```

## Relationship Semantics

Use normal edges with `stereotype:` to express standard requirement relations:

- `deriveReqt`
- `satisfy`
- `verify`
- `refine`
- `trace`

Example:

```runiq
shape parent as @requirement title:"REQ-001" label:"Vehicle shall stop safely"
shape child as @requirement title:"REQ-001.1" label:"ABS shall engage on slip"
shape test1 as @testCase label:"SlipBenchTest"

child -> parent stereotype:"deriveReqt" lineStyle:"dashed" arrowType:open
test1 -> child stereotype:"verify" lineStyle:"dashed" arrowType:open
```

## Packages

Use `@requirementPackage` to keep related requirement sets together:

```runiq
container safety "Safety Requirements" as @requirementPackage {
  shape req1 as @requirement title:"SAFE-001" label:"System shall enter safe state on sensor fault"
  shape req2 as @requirement title:"SAFE-002" label:"Brake ECU shall report degraded mode within 200ms"
}
```

## Notes

- `@requirement` renders with a standard `«requirement»` header.
- `title:` is treated as the requirement identifier in the rendered box.
- Requirement packages work well with `direction:LR` or `direction:TB` depending on whether you want a broad traceability view or a vertical decomposition.

## Comparison with Other Tools

| Tool            | Requirement Support                    | SysML-style Semantics        | Text-first Authoring |
| --------------- | -------------------------------------- | ---------------------------- | -------------------- |
| Runiq           | Focused requirement shapes + relations | Yes, via shapes + stereotypes| Excellent            |
| Mermaid         | No dedicated requirement notation      | No                           | Good                 |
| Draw.io         | Manual drawing                         | Manual                       | Weak                 |
| SysML tools     | Deep formal support                    | Strong                       | Usually weak         |

## Key Advantages of Runiq

- Requirement diagrams stay in the same DSL as your other architecture and engineering views.
- You can mix requirements with architecture blocks, threat models, and test-case views directly.
- Requirement IDs and traceability labels stay readable in version control.

## When to Use Alternatives

- Use a dedicated SysML modeling suite when you need full model repositories, parametrics, simulations, or formal requirements management workflows.
- Use Draw.io if you only need a one-off visual and do not care about maintainable source text.
