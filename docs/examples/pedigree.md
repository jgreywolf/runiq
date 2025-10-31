# Pedigree Chart Examples

Medical and genetic family trees using standard pedigree notation.

** Note: ** There are still some issues with edge placement that are being worked out

## Simple Three-Generation Pedigree

A basic three-generation family tree showing affected individuals and carriers:

```runiq
diagram "Simple Pedigree" {
  direction TB

  # Generation I (Grandparents)
  shape grandfather as @pedigreeMale label:"Grandfather"
  shape grandmother as @pedigreeFemale label:"Grandmother"

  # Generation II (Parents)
  shape father as @pedigreeMale label:"Father" affected:true
  shape mother as @pedigreeFemale label:"Mother"
  shape uncle as @pedigreeMale label:"Uncle" deceased:true

  # Generation III (Children)
  shape son1 as @pedigreeMale label:"Son 1" affected:true
  shape son2 as @pedigreeMale label:"Son 2"
  shape daughter as @pedigreeFemale label:"Daughter" carrier:true

  # Marriages (no arrows)
  grandfather -> grandmother arrowType:none
  father -> mother arrowType:none

  # Parent-child connections
  grandfather -> father
  grandfather -> uncle
  grandmother -> father
  grandmother -> uncle

  father -> son1
  father -> son2
  father -> daughter
  mother -> son1
  mother -> son2
  mother -> daughter
}
```

**Key Features:**

- ■ Black fill = Affected by condition (Father, Son 1)
- ▦ Half-fill = Carrier status (Daughter)
- ⌿ Diagonal line = Deceased (Uncle)
- Horizontal lines without arrows = Marriages

## Autosomal Recessive Inheritance

Demonstrating a classic autosomal recessive pattern where both parents are carriers:

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
  shape ii4 as @pedigreeMale label:"II-4" carrier:true
  shape ii5 as @pedigreeFemale label:"II-5"

  # Generation III
  shape iipartner as @pedigreeFemale label:"II-partner"
  shape iii1 as @pedigreeMale label:"III-1" carrier:true
  shape iii2 as @pedigreeFemale label:"III-2"

  # Marriages
  i1 -> i2 arrowType:none
  ii2 -> iipartner arrowType:none

  # Parent-child (Generation I -> II)
  i1 -> ii1
  i1 -> ii2
  i1 -> ii3
  i1 -> ii4
  i1 -> ii5
  i2 -> ii1
  i2 -> ii2
  i2 -> ii3
  i2 -> ii4
  i2 -> ii5

  # Parent-child (Generation II -> III)
  ii2 -> iii1
  ii2 -> iii2
  iipartner -> iii1
  iipartner -> iii2
}
```

**Expected Ratio:**
With two carrier parents (I-1 × I-2):

- 25% affected (II-3)
- 50% carriers (II-2, II-4)
- 25% normal (II-1, II-5)

## Consanguineous Marriage

Showing blood-related spouses (e.g., cousins) using double line notation:

```runiq
diagram "Consanguinity" {
  direction TB

  # Cousins who marry
  shape cousin1 as @pedigreeMale label:"Cousin 1"
  shape cousin2 as @pedigreeFemale label:"Cousin 2"

  # Child
  shape child as @pedigreeMale label:"Child" affected:true

  # Consanguineous marriage (double line, no arrow)
  cousin1 -> cousin2 lineStyle:double arrowType:none

  # Parent-child
  cousin1 -> child
  cousin2 -> child
}
```

**Double Line Notation:**
The `lineStyle:double` property creates parallel lines 6px apart, the standard symbol for consanguineous (blood-related) marriages. This is important in genetics for tracking increased risk of recessive conditions.

## Multiple Marriages

Tracking sequential marriages and half-siblings:

```runiq
diagram "Multiple Marriages" {
  direction TB

  # Person with two marriages
  shape person as @pedigreeMale label:"Father"
  shape spouse1 as @pedigreeFemale label:"Wife 1" deceased:true
  shape spouse2 as @pedigreeFemale label:"Wife 2"

  # Children from first marriage
  shape child1 as @pedigreeMale label:"Child 1"
  shape child2 as @pedigreeFemale label:"Child 2"

  # Children from second marriage
  shape child3 as @pedigreeMale label:"Child 3"

  # Marriage relationships
  person -> spouse1 arrowType:none
  person -> spouse2 arrowType:none

  # First marriage children
  person -> child1
  person -> child2
  spouse1 -> child1
  spouse1 -> child2

  # Second marriage children
  person -> child3
  spouse2 -> child3
}
```

**Notes:**

- Children 1 and 2 are half-siblings to Child 3
- Wife 1 is marked deceased with diagonal line
- Both marriage lines shown without arrows

## Unknown Sex Individual

When sex is unknown or not yet determined:

```runiq
diagram "Unknown Sex" {
  direction TB

  # Parents
  shape parent1 as @pedigreeMale label:"Parent 1"
  shape parent2 as @pedigreeFemale label:"Parent 2"

  # Unborn or sex unknown child
  shape fetus as @pedigreeUnknown label:"Fetus"

  # Marriage
  parent1 -> parent2 arrowType:none

  # Parent-child
  parent1 -> fetus
  parent2 -> fetus
}
```

**Diamond Symbol:**
The `@pedigreeUnknown` shape renders as a diamond, used for:

- Unborn children (prenatal testing)
- Miscarriages where sex unknown
- Historical records where sex not recorded

## Combining Properties

All pedigree properties can be combined:

```runiq
diagram "Combined Properties" {
  direction TB

  # Deceased affected individual
  shape patient as @pedigreeMale label:"Patient" affected:true deceased:true

  # Deceased carrier
  shape grandmother as @pedigreeFemale label:"Grandmother" carrier:true deceased:true

  # Normal living individual (default)
  shape child as @pedigreeFemale label:"Child"
}
```

**Rendering:**

- Patient: Black-filled square with diagonal line
- Grandmother: Half-filled circle with diagonal line
- Child: White-filled circle (normal)

## Best Practices

### Generation Labels

Use Roman numerals for clarity:

```runiq
shape i1 as @pedigreeMale label:"I-1"     # Generation I, individual 1
shape ii3 as @pedigreeFemale label:"II-3" # Generation II, individual 3
```

### ID Naming

Keep IDs simple and lowercase:

```runiq
# Good
shape father as @pedigreeMale
shape iipartner as @pedigreeFemale

# Avoid hyphens in IDs
shape i-1 as @pedigreeMale  # DON'T
```

### Edge Order

Define marriages before parent-child relationships:

```runiq
# 1. Marriages first
father -> mother arrowType:none

# 2. Then parent-child
father -> child
mother -> child
```

### Direction

Always use top-to-bottom for pedigree charts:

```runiq
diagram "My Pedigree" {
  direction TB  # Required for proper pedigree layout
  # ...
}
```

## Legend/Key

While Runiq doesn't auto-generate legends, include explanatory comments:

```runiq
# Pedigree Key:
# ■ (black fill) = Affected by condition
# ▦ (half fill) = Carrier (heterozygous)
# □ (white fill) = Unaffected (normal)
# ⌿ (diagonal line) = Deceased
# ═ (double line) = Consanguineous marriage
```

## Medical Standards

Runiq's pedigree implementation follows standard medical genetics notation:

| Symbol                   | Meaning       | Runiq Syntax                      |
| ------------------------ | ------------- | --------------------------------- |
| □ (square)               | Male          | `@pedigreeMale`                   |
| ○ (circle)               | Female        | `@pedigreeFemale`                 |
| ◇ (diamond)              | Unknown sex   | `@pedigreeUnknown`                |
| ■ (filled)               | Affected      | `affected:true`                   |
| ▦ (half-filled)          | Carrier       | `carrier:true`                    |
| ⌿ (diagonal line)        | Deceased      | `deceased:true`                   |
| ─ (horizontal, no arrow) | Marriage      | `arrowType:none`                  |
| ═ (double line)          | Consanguinity | `lineStyle:double arrowType:none` |

## See Also

- [Pedigree Charts Guide](../guide/pedigree-charts.md) - Complete pedigree documentation
- [Shape Reference](../reference/shapes.md) - All available shapes
- [Edge Properties](../reference/edges.md) - Edge styling options
