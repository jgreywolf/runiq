---
title: Pedigree Charts
description: Create family pedigree charts for genetic analysis with standard symbols for males, females, affected individuals, and inheritance patterns.
lastUpdated: 2025-01-09
---

# Pedigree Charts

Pedigree charts (family trees) are specialized diagrams used in genetics and genealogy to track inheritance patterns of traits and genetic conditions across generations. Runiq provides dedicated shapes and properties that follow medical/genetics standards for pedigree notation.

## Overview

Pedigree charts use specific symbols to represent:

- **Gender**: Males (squares), females (circles), unknown (diamonds)
- **Genetic status**: Affected (filled black), carrier (half-filled), normal (white)
- **Vital status**: Deceased (diagonal line through symbol)
- **Relationships**: Marriages (horizontal line, no arrow), consanguinity (double line)

## Basic Shapes

Runiq provides three pedigree shapes that automatically render according to standard conventions:

### Male Individual

```runiq
shape father as @pedigreeMale label:"Father"
```

Renders as a square (40×40px) with black outline.

### Female Individual

```runiq
shape mother as @pedigreeFemale label:"Mother"
```

Renders as a circle (38px diameter) with black outline.

### Unknown Sex

```runiq
shape child as @pedigreeUnknown label:"Unknown"
```

Renders as a diamond (40×40px) with black outline.

## Genetic Status Properties

Use inline properties to indicate genetic status:

### Affected Individual

Black-filled symbol indicates the person has the trait/condition:

```runiq
shape patient as @pedigreeMale label:"Patient" affected:true
```

### Carrier Individual

Half-filled symbol (vertical stripe pattern) indicates carrier status:

```runiq
shape carrier as @pedigreeFemale label:"Carrier" carrier:true
```

### Normal Individual

White-filled symbol (default) indicates no trait/condition:

```runiq
shape normal as @pedigreeMale label:"Normal"
```

### Deceased Individual

Diagonal line through symbol indicates deceased:

```runiq
shape grandfather as @pedigreeMale label:"Grandfather" deceased:true
```

## Relationship Notation

### Marriage/Partnership

Use `arrowType:none` to create horizontal marriage lines without directional arrows:

```runiq
husband -> wife arrowType:none
```

### Consanguineous Marriage

Use `lineStyle:double` for blood-related spouses (e.g., cousins):

```runiq
cousin1 -> cousin2 lineStyle:double arrowType:none
```

### Parent-Child Relationships

Standard directed edges represent descent:

```runiq
father -> child
mother -> child
```

## Complete Example

Here's a three-generation pedigree showing autosomal recessive inheritance:

```runiq
diagram "Genetic Trait Inheritance" {
  direction TB

  # Generation I - Both carriers
  shape i1 as @pedigreeMale label:"I-1" carrier:true
  shape i2 as @pedigreeFemale label:"I-2" carrier:true

  # Generation II - Mix of affected, carrier, and normal
  shape ii1 as @pedigreeFemale label:"II-1"
  shape ii2 as @pedigreeMale label:"II-2" carrier:true
  shape ii3 as @pedigreeFemale label:"II-3" affected:true

  # Generation III
  shape iii1 as @pedigreeMale label:"III-1" carrier:true

  # Marriages
  i1 -> i2 arrowType:none

  # Parent-child relationships
  i1 -> ii1
  i1 -> ii2
  i1 -> ii3
  i2 -> ii1
  i2 -> ii2
  i2 -> ii3
}
```

## Property Reference

### Node Properties

| Property   | Type    | Values           | Description                          |
| ---------- | ------- | ---------------- | ------------------------------------ |
| `affected` | boolean | `true` / `false` | Black fill - has the trait/condition |
| `carrier`  | boolean | `true` / `false` | Half-fill pattern - carries one copy |
| `deceased` | boolean | `true` / `false` | Diagonal line overlay                |

### Edge Properties

| Property    | Type   | Values                                | Description                                  |
| ----------- | ------ | ------------------------------------- | -------------------------------------------- |
| `arrowType` | string | `none`, `standard`, `hollow`, `open`  | Arrow head style (use `none` for marriages)  |
| `lineStyle` | string | `solid`, `dashed`, `dotted`, `double` | Line appearance (`double` for consanguinity) |

## Best Practices

### Layout Direction

Always use `direction TB` (top-to-bottom) for pedigree charts:

```runiq
diagram "My Pedigree" {
  direction TB
  # ... shapes and edges
}
```

### Generation Labeling

Use Roman numerals (I, II, III) for generation labels:

```runiq
shape i1 as @pedigreeMale label:"I-1"
shape ii1 as @pedigreeFemale label:"II-1"
```

### Node IDs

Use short, lowercase IDs without special characters:

```runiq
# Good
shape i1 as @pedigreeMale
shape iipartner as @pedigreeFemale

# Avoid
shape I-1 as @pedigreeMale  # Hyphens in IDs
shape II_Partner as @pedigreeFemale  # Underscores
```

### Marriage Edges First

Define marriage edges before parent-child edges for better visual clarity:

```runiq
# Marriages first
grandfather -> grandmother arrowType:none
father -> mother arrowType:none

# Then parent-child
grandfather -> father
grandmother -> father
```

## Advanced Features

### Multiple Marriages

Show sequential marriages by creating separate marriage edges:

```runiq
shape person as @pedigreeMale label:"Person"
shape spouse1 as @pedigreeFemale label:"Spouse 1" deceased:true
shape spouse2 as @pedigreeFemale label:"Spouse 2"

person -> spouse1 arrowType:none
person -> spouse2 arrowType:none
```

### Combining Properties

You can combine multiple properties on one individual:

```runiq
shape patient as @pedigreeMale label:"Patient" affected:true deceased:true
```

This renders a black-filled square with a diagonal line (affected and deceased).

### Legend/Key

While Runiq doesn't auto-generate legends, you can add explanatory notes in comments:

```runiq
# Legend:
# ■ (filled) = Affected
# ▦ (half-filled) = Carrier
# □ (empty) = Normal
# ⌿ (diagonal line) = Deceased
```

## Medical Standards Compliance

Runiq's pedigree implementation follows these standards:

- **Square = Male**, **Circle = Female**, **Diamond = Unknown sex**
- **Black fill = Affected** by condition
- **Half-fill = Carrier** (heterozygous)
- **White fill = Unaffected** (normal)
- **Diagonal line = Deceased**
- **Horizontal line, no arrow = Marriage/Mating**
- **Double line = Consanguineous marriage**

These conventions are widely used in:

- Medical genetics clinics
- Genetic counseling
- Research publications
- Educational materials

## Limitations

### Current

- Layout is optimized for hierarchical flow, not traditional pedigree tree alignment
- Children descend directly from parents rather than from a marriage line
- Siblings may not always align perfectly on the same horizontal level

### Workarounds

- Use `direction TB` for best results
- Order nodes in generation groups for clearer structure
- Consider using containers with `algorithm:mrtree` for tree-like layout (experimental)

## Examples

See the `examples/pedigree/` directory for complete examples:

- `simple-3-generation.runiq` - Basic three-generation family
- `genetic-trait.runiq` - Autosomal recessive inheritance pattern
- `test-consanguinity.runiq` - Consanguineous marriage example
- `test-marriage-edges.runiq` - Marriage edge notation

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid           | PlantUML          | Lucidchart  | GenoPro    | Progeny | Family Tree Maker |
| ---------------------------- | -------------- | ----------------- | ----------------- | ----------- | ---------- | ------- | ----------------- |
| **Basic Pedigree Format**    | ✅             | ⚠️ via Flowcharts | ⚠️ via Flowcharts | ⚠️          | ✅         | ✅      | ✅                |
| **Genetic trait markers**    | ✅             | ❌                | ❌                | ⚠️ Manual   | ✅         | ✅      | ❌                |
| **Medical symbols**          | ✅             | ❌                | ❌                | ⚠️ Custom   | ✅         | ✅      | ❌                |
| **Consanguinity**            | ✅             | ❌                | ❌                | ⚠️ Manual   | ✅         | ✅      | ❌                |
| **Carrier notation**         | ✅             | ❌                | ❌                | ⚠️ Manual   | ✅         | ✅      | ❌                |
| **Deceased markers**         | ✅             | ❌                | ❌                | ✅          | ✅         | ✅      | ✅                |
| **Adoption notation**        | ✅             | ❌                | ❌                | ⚠️ Manual   | ✅         | ✅      | ✅                |
| **Automatic layout**         | ✅             | ✅                | ✅                | ⚠️ Partial  | ✅         | ✅      | ✅                |
| **Multi-generation**         | ✅             | ⚠️ Limited        | ⚠️ Limited        | ✅          | ✅         | ✅      | ✅                |
| **Export formats**           | SVG, PNG       | SVG, PNG          | SVG, PNG          | Multiple    | PDF, Image | PDF     | Multiple          |
| **Medical genetics**         | ✅             | ❌                | ❌                | ❌          | ✅         | ✅      | ❌                |
| **Text-based DSL**           | ✅             | ✅                | ✅                | ❌          | ❌         | ❌      | ❌                |
| **Version control friendly** | ✅             | ✅                | ✅                | ❌          | ⚠️ Partial | ❌      | ❌                |
| **Learning curve**           | Low            | Low               | Medium            | Low         | Medium     | Medium  | Low               |
| **Cost**                     | Free           | Free              | Free              | Paid        | Paid       | Paid    | Paid              |
| **Platform**                 | Cross-platform | Cross-platform    | Cross-platform    | Web/Desktop | Windows    | Windows | Multi-platform    |

**Key Advantages of Runiq:**

- **Medical Genetics**: Proper symbols for affected, carrier, and deceased individuals
- **Version Control**: Text format works seamlessly with Git
- **Standards Compliant**: Follows medical pedigree conventions
- **Programmatic**: Easy to generate from genetic databases

**When to Use Alternatives:**

- **GenoPro/Progeny**: Professional genetic counseling with extensive medical features
- **Family Tree Maker**: General genealogy research with historical records
- **Lucidchart**: Collaborative editing with non-technical users
- **Mermaid/PlantUML**: Simple family trees without genetic notation

## See Also

- [Shapes Reference](../reference/shapes.md) - Complete shape documentation
- [Edge Properties](../reference/edges.md) - Edge styling options
- [Layout Options](../guide/layout.md) - Direction and algorithm settings
