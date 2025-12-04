# Glyphset Conversion System

## Overview

The glyphset conversion system allows users to switch between different glyphset types in the editor while intelligently preserving content. It automatically converts item keywords (like `level`, `step`, `node`, `side`) to the appropriate keyword for the target glyphset type, and provides warnings when conversions may not preserve the intended structure.

## Features

### 1. Automatic Keyword Conversion

When switching glyphset types, the system automatically converts keywords:

**Example:** Converting from `funnel` to `basicList`

```runiq
// Before (funnel uses "level")
glyphset funnel "Sales" {
  level "Awareness"
  level "Interest"
}

// After (basicList uses "item")
glyphset basicList "Sales" {
  item "Awareness"
  item "Interest"
}
```

### 2. Compatibility Groups

Glyphsets are organized into compatibility groups for easier conversion:

- **Process**: `basicProcess`, `cycle`, `stepProcess`, `verticalProcess`, etc.
- **Hierarchy**: `pyramid`, `invertedPyramid`, `orgChart`, `hierarchyTree`, etc.
- **List**: `basicList`, `chevronList`, `numberedChevronList`, `columnList`, etc.
- **Comparison**: `matrix2x2`, `matrix3x3`, `venn2`, `venn3`, etc.
- **Balance**: `balance`, `opposing`, `counterbalance`
- **Flow**: `converging`, `diverging`, `hub`
- **Network**: `interconnected`, `cluster`
- **Target**: `target`, `funnel`

Conversions within the same group are generally seamless.

### 3. Warnings and Validation

The system provides warnings for:

#### Item Count Mismatches

- **balance/opposing/counterbalance**: Expects exactly 2 items
- **matrix2x2**: Expects 4 items
- **matrix3x3**: Expects 9 items

#### Structural Requirements

- **hub**: Needs one `center` item and multiple `spoke` items
- **equation**: Has special structure (input + operator = result) - blocked from conversion

#### Cross-Category Conversions

Warns when converting between different categories (e.g., balance → list) as the layout may change significantly.

## Supported Keywords

### By Glyphset Type

| Glyphset Type       | Primary Keyword(s)            | Alternative Keywords | Special Handling          |
| ------------------- | ----------------------------- | -------------------- | ------------------------- |
| basicProcess, cycle | `item`                        | `step`               | -                         |
| pyramid, funnel     | `level`                       | `stage`              | -                         |
| balance, opposing   | `side`                        | -                    | -                         |
| interconnected      | `node`                        | -                    | -                         |
| hub                 | `spoke`, `center`             | -                    | -                         |
| orgChart            | `person`                      | -                    | -                         |
| converging          | `input`                       | -                    | -                         |
| diverging           | `output`                      | -                    | -                         |
| equation            | `input`, `operator`, `result` | -                    | ⚠️ special structure      |
| **pictureProcess**  | **`image`**                   | -                    | **🖼️ adds/removes URLs**  |
| **detailedProcess** | **`item`**                    | -                    | **📝 adds/removes pipes** |

### Universal Fallback

All keywords can be converted to `item`, which works with most glyphset types.

## Usage in Editor

### From the Toolbox

1. Open a glyphset diagram in the editor
2. In the toolbox, you'll see categorized glyphset options
3. Click any glyphset to convert to that type
4. The system will:
   - Convert keywords automatically
   - Show warnings in the console if needed
   - Update the diagram with undo support

### Programmatic Usage

```typescript
import {
  convertGlyphset,
  areGlyphsetsCompatible,
} from '$lib/utils/glyphsetConversion';

// Check compatibility first
const compat = areGlyphsetsCompatible('pyramid', 'invertedPyramid');
if (compat.compatible) {
  console.log('Safe to convert!');
  if (compat.reason) console.warn(compat.reason);
}

// Perform conversion
const result = convertGlyphset(code, 'newType');
if (result.success) {
  // Use result.newCode
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
} else {
  console.error('Conversion failed:', result.errors);
}
```

## Blocked Conversions

Some conversions are blocked because they cannot be automatically converted:

### Equation Glyphset

The `equation` glyphset has a special structure:

```runiq
glyphset equation "Math" {
  input "A"
  operator "+"
  input "B"
  result "C"
}
```

This structure cannot be automatically converted to/from other glyphsets. Users must manually recreate the content.

## Examples

### Example 1: Funnel to Pyramid

```runiq
// Original
glyphset funnel "Hierarchy" {
  level "Executive"
  level "Management"
  level "Staff"
}

// Converted to pyramid (levels preserved)
glyphset pyramid "Hierarchy" {
  level "Executive"
  level "Management"
  level "Staff"
}
```

### Example 2: Balance to List (with warning)

```runiq
// Original
glyphset balance "Trade-offs" {
  side "Speed: Fast deployment"
  side "Quality: Thorough testing"
}

// Converted to basicList
glyphset basicList "Trade-offs" {
  item "Speed: Fast deployment"
  item "Quality: Thorough testing"
}
// Warning: "Converting from balance (2 sides) may result in unexpected layout"
```

### Example 3: Interconnected to Cluster

```runiq
// Original
glyphset interconnected "Services" {
  node "Auth"
  node "API"
  node "Database"
}

// Converted to cluster (nodes → items)
glyphset cluster "Services" {
  item "Auth"
  item "API"
  item "Database"
}
```

### Example 4: Converting TO pictureProcess

```runiq
// Original (basicList)
glyphset basicList "Baking Steps" {
  theme vibrant
  item "Gather Ingredients"
  item "Mix Thoroughly"
  item "Bake at 350°F"
  item "Cool & Serve"
}

// Converted to pictureProcess (adds image URLs)
glyphset pictureProcess "Baking Steps" {
  theme vibrant
  image "https://i.pravatar.cc/200?img=11" label "Gather Ingredients"
  image "https://i.pravatar.cc/200?img=12" label "Mix Thoroughly"
  image "https://i.pravatar.cc/200?img=13" label "Bake at 350°F"
  image "https://i.pravatar.cc/200?img=14" label "Cool & Serve"
}
```

### Example 5: Converting FROM pictureProcess

```runiq
// Original (pictureProcess)
glyphset pictureProcess "Workflow" {
  theme colorful
  image "https://i.pravatar.cc/200?img=11" label "Design"
  image "https://i.pravatar.cc/200?img=12" label "Develop"
  image "https://i.pravatar.cc/200?img=13" label "Test"
}

// Converted to chevronList (extracts labels only)
glyphset chevronList "Workflow" {
  theme colorful
  item "Design"
  item "Develop"
  item "Test"
}
```

### Example 6: Converting TO detailedProcess

```runiq
// Original (basicList)
glyphset basicList "Project Phases" {
  theme forest
  item "Research"
  item "Design"
  item "Build"
}

// Converted to detailedProcess (adds pipe separator for substeps)
glyphset detailedProcess "Project Phases" {
  theme forest
  item "Research | "
  item "Design | "
  item "Build | "
}
```

**Note**: The conversion appends `|` to indicate that substeps can be added. Users can then manually add substeps like `"Research | Market Analysis | User Interviews"`.

### Example 7: Converting FROM detailedProcess

```runiq
// Original (detailedProcess with substeps)
glyphset detailedProcess "Product Dev" {
  theme vibrant
  item "Research | Market Analysis | User Interviews"
  item "Design | Wireframes | Prototypes | Testing"
  item "Build | Frontend | Backend | DevOps"
}

// Converted to basicList (extracts main step only)
glyphset basicList "Product Dev" {
  theme vibrant
  item "Research"
  item "Design"
  item "Build"
}
```

**Note**: Only the main step (first part before the first `|`) is preserved. All substeps are removed during conversion.

## Implementation Details

### Files

- **`glyphsetConversion.ts`**: Core conversion logic, keyword mappings, compatibility checks
- **`glyphsetConversion.spec.ts`**: Comprehensive test suite (25 tests)
- **`editorActions.svelte.ts`**: Integration with editor (handleReplaceGlyphset)

### Keyword Conversion Map

```typescript
const KEYWORD_CONVERSIONS = {
  step: 'item',
  level: 'item',
  stage: 'item',
  person: 'item',
  circle: 'item',
  node: 'item',
  side: 'item',
  input: 'item',
  output: 'item',
  // ... etc
};
```

### Preservation Rules

The conversion system preserves:

- ✅ Glyphset name
- ✅ Theme settings
- ✅ Direction/orientation
- ✅ All parameters (columns, shape, showValues, etc.)
- ✅ Comments
- ✅ Indentation

Only keywords are converted (e.g., `level` → `item`).

## Future Enhancements

Potential improvements:

- [ ] Visual warning dialogs instead of console logs
- [ ] Suggest best-fit glyphset based on current item count
- [ ] Auto-adjust item count for matrix glyphsets
- [ ] Preserve nested structures for hierarchy conversions
- [ ] Interactive preview of conversion before applying
