---
title: Hierarchy Glyphsets
description: Organizational structures and pyramids
lastUpdated: 2025-01-14
---

# Hierarchy Glyphsets

Hierarchy glyphsets visualize organizational structures, reporting relationships, and hierarchical concepts.

## Available Hierarchy Glyphsets

### orgChart

Organization chart with nested reporting relationships.

**Parameters:**
- `person` (nested) - Organizational hierarchy
- `theme` - Color theme

**Example:**

```runiq
glyphset orgChart "Company Structure" {
  person "CEO" {
    person "CTO" {
      person "Engineering Manager" {
        person "Senior Developer"
        person "Developer"
        person "Junior Developer"
      }
      person "QA Manager" {
        person "QA Lead"
        person "QA Engineer"
      }
    }
    person "CFO" {
      person "Accounting Manager"
      person "Finance Analyst"
    }
    person "CMO" {
      person "Marketing Manager"
      person "Content Lead"
    }
  }
  
  theme "professional"
}
```

**Features:**
- Unlimited depth (recommend 3-5 levels)
- Automatic layout and spacing
- Clear reporting lines
- Professional styling

### pyramid (Coming Soon)

Hierarchical pyramid structure.

**Example Use Cases:**
- Maslow's hierarchy of needs
- Food pyramid
- Organizational levels
- Priority tiers

## Tips for Hierarchy Glyphsets

### Best Practices

1. **Limit depth** - 3-5 levels for readability
2. **Consistent naming** - Job titles or role names
3. **Balanced structure** - Avoid too many direct reports
4. **Clear roles** - Use descriptive, standard titles

### When to Use Diagram Profiles Instead

Switch to diagram profiles for:
- Matrix organizations (multiple reporting lines)
- Complex relationships (not strictly hierarchical)
- Detailed annotations per person
- Cross-functional teams with dotted lines

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [View All Glyphsets →](/guide/glyphsets)
