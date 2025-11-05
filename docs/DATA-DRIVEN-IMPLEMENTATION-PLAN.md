# Data-Driven Rendering System Implementation Plan

**Issue**: #47  
**Branch**: feature/data-driven-rendering  
**Estimate**: 1-2 weeks (10-12 working days)  
**Status**: In Progress

## Overview

Implement a data-driven rendering system that allows diagrams to be generated from JSON/CSV data sources, enabling dynamic visualizations, charts, and dashboards.

## Architecture

### New Package: `@runiq/data-loader`

Location: `packages/data-loader/`

**Responsibilities:**
- JSON data source loading and validation
- CSV parsing and type inference
- Schema validation and error handling
- Support for nested/hierarchical data structures

**Exports:**
```typescript
interface DataSource {
  load(path: string): Promise<DataObject[]>;
  validate(data: unknown): ValidationResult;
}

class JsonDataSource implements DataSource { ... }
class CsvDataSource implements DataSource { ... }
```

### Core Integration

**packages/core/src/types/data.ts** - New types:
```typescript
interface DataBinding {
  source: string;           // Data source path
  format: 'json' | 'csv';
  template?: string;        // Template name
}

interface TemplateExpression {
  type: 'variable' | 'conditional' | 'loop';
  expression: string;
  children?: TemplateExpression[];
}
```

**packages/parser-dsl/src/runiq.langium** - Grammar extensions:
```langium
// Data source declaration
DataSource:
  'data' name=ID 'from' ':' path=STRING ('format' ':' format=DataFormat)?
;

DataFormat: 'json' | 'csv';

// Template syntax
Template:
  'template' name=STRING ('from' ':' source=[DataSource:ID])? '{'
    statements+=TemplateStatement*
  '}'
;

TemplateStatement:
  VariableSubstitution | ConditionalBlock | LoopBlock | ShapeDeclaration
;

VariableSubstitution:
  '${' expression=Expression '}'
;

ConditionalBlock:
  'if' ':' condition='${' expression=Expression '}' '{'
    statements+=TemplateStatement*
  '}'
;

LoopBlock:
  'for' variable=ID 'in' '${' collection=Expression '}' '{'
    statements+=TemplateStatement*
  '}'
;
```

## Implementation Phases

### Phase 1: Data Source Support (3-4 days)

#### Day 1-2: JSON Data Loader
- [ ] Create `packages/data-loader` package structure
- [ ] Implement `JsonDataSource` class
- [ ] Add validation using Zod or similar
- [ ] Handle nested/hierarchical data
- [ ] Error handling for malformed JSON
- [ ] Tests: 20+ test cases

#### Day 2-3: CSV Data Loader
- [ ] Implement `CsvDataSource` class using PapaParse
- [ ] Type inference from CSV data
- [ ] Header validation
- [ ] Error handling for malformed CSV
- [ ] Tests: 15+ test cases

#### Day 3-4: Integration
- [ ] Create data source registry in core
- [ ] Integrate with parser (data declarations)
- [ ] Add data loading to renderer pipeline
- [ ] Integration tests: 10+ test cases

**Deliverables:**
- `packages/data-loader` package (35+ tests)
- Data source types in core
- Basic data loading functional

### Phase 2: Template System (3-4 days)

#### Day 4-5: DSL Syntax
- [ ] Extend Langium grammar for templates
- [ ] Add `data` and `template` keywords
- [ ] Parse variable expressions `${...}`
- [ ] Parser tests: 25+ test cases

#### Day 5-6: Variable Substitution
- [ ] Implement expression evaluator
- [ ] Support nested property access: `${data.address.city}`
- [ ] Type coercion (string, number, boolean)
- [ ] Tests: 20+ test cases

#### Day 6-7: Conditionals & Loops
- [ ] Implement `if` conditional blocks
- [ ] Implement `for...in` loops over arrays
- [ ] Support loop index/variables
- [ ] Tests: 25+ test cases

#### Day 7-8: Template Composition
- [ ] Template reuse and nesting
- [ ] Template parameters
- [ ] Tests: 15+ test cases

**Deliverables:**
- Template syntax in grammar (85+ tests)
- Expression evaluator
- Template processor
- Example templates

### Phase 3: Dynamic Shape Generation (2-3 days)

#### Day 8-9: Node Generation
- [ ] Generate nodes from data rows
- [ ] Auto-assign unique IDs
- [ ] Map data fields to shape properties
- [ ] Tests: 20+ test cases

#### Day 9: Edge Generation & Style Mapping
- [ ] Auto-generate edges from relationship fields
- [ ] Map data values to styles (color, size, opacity)
- [ ] Support thresholds and categories
- [ ] Tests: 25+ test cases

#### Day 10: Legend Generation
- [ ] Auto-generate legends from data
- [ ] Show color/size mappings
- [ ] Position legends appropriately
- [ ] Tests: 15+ test cases

**Deliverables:**
- Dynamic shape generation (60+ tests)
- Style mapping system
- Legend support

### Phase 4: Chart Support (3-4 days)

#### Day 10-11: Pie Chart
- [ ] Pie chart shape definition
- [ ] Data binding for slices
- [ ] Auto-calculate angles from values
- [ ] Label positioning
- [ ] Legend integration
- [ ] Tests: 20+ test cases
- [ ] **Closes Issue #10**

#### Day 11-12: Bar/Column Chart
- [ ] Bar chart shape definition
- [ ] Vertical and horizontal orientations
- [ ] Auto-scaling for axes
- [ ] Grid lines and labels
- [ ] Tests: 20+ test cases

#### Day 12: Line Chart
- [ ] Line chart shape definition
- [ ] Path generation from time series
- [ ] Markers and data points
- [ ] Axes and grid
- [ ] Tests: 15+ test cases

#### Day 13: Radar Chart
- [ ] Radar chart shape definition
- [ ] Polygon generation from metrics
- [ ] Axis spokes and labels
- [ ] Tests: 15+ test cases
- [ ] **Closes Issue #37**

**Deliverables:**
- 4 chart types (70+ tests)
- Chart data binding system
- Auto-scaling and axis generation

### Final Phase: Documentation & Integration (1 day)

#### Day 14: Documentation & PR
- [ ] Create `docs/guide/data-driven.md`
- [ ] Document template syntax
- [ ] Create 10+ example files
- [ ] Run full test suite (target: 250+ new tests)
- [ ] Create PR with detailed description
- [ ] Update CHANGELOG.md

**Deliverables:**
- Complete documentation
- Comprehensive examples
- PR ready for review

## Test Coverage Goals

| Package | Target Tests | Focus Areas |
|---------|--------------|-------------|
| data-loader | 35+ | JSON, CSV parsing, validation, errors |
| parser-dsl | 85+ | Template syntax, expressions, control flow |
| core (data) | 130+ | Node/edge generation, style mapping, legends, charts |
| integration | 10+ | End-to-end data-driven diagrams |
| **Total** | **260+** | Full feature coverage |

## Acceptance Criteria

- [x] Create implementation plan
- [ ] Load JSON and CSV data sources ✅
- [ ] Template syntax works with variables ✅
- [ ] Generate nodes/edges from data ✅
- [ ] At least 3 chart types supported ✅ (target: 4)
- [ ] Comprehensive test coverage ✅ (target: 260+ tests)
- [ ] Documentation with examples ✅

## Example Usage

### Data Source

**sales-data.json:**
```json
{
  "regions": [
    { "id": "west", "name": "West Coast", "revenue": 450000, "color": "#1f77b4" },
    { "id": "east", "name": "East Coast", "revenue": 380000, "color": "#ff7f0e" },
    { "id": "central", "name": "Central", "revenue": 290000, "color": "#2ca02c" }
  ]
}
```

### Template-Based Diagram

```runiq
diagram "Sales by Region" {
  data sales from:"sales-data.json"
  
  template "region-nodes" from:sales {
    for region in ${regions} {
      shape ${region.id} as @rectangle 
        label:"${region.name}\n$${region.revenue}"
        fill:${region.color}
    }
  }
}
```

### Pie Chart

```runiq
diagram "Revenue Distribution" {
  data sales from:"sales-data.json"
  
  shape pie as @pie-chart
    data:sales.regions
    valueField:"revenue"
    labelField:"name"
    colorField:"color"
    showLegend:true
}
```

## Related Issues

This feature enables:
- **Issue #10**: Pie Chart Support ✅
- **Issue #15**: XY Chart / Scatter Plot (partial)
- **Issue #16**: Gantt Chart (future)
- **Issue #37**: Radar Chart ✅
- Any data-driven visualization

## Dependencies

**New Dependencies:**
- `papaparse` - CSV parsing
- `zod` - Schema validation (optional, evaluate vs built-in validation)

**Existing:**
- All core packages
- Langium parser
- ELK layout

## Success Metrics

- [ ] 260+ tests passing
- [ ] 4 chart types implemented
- [ ] 10+ examples created
- [ ] Documentation complete
- [ ] PR approved and merged
- [ ] Issues #10 and #37 closed

## Timeline

- **Week 1**: Phases 1-3 (Data loading, templates, dynamic generation)
- **Week 2**: Phase 4 + documentation (Charts, examples, PR)

**Started**: November 5, 2025  
**Target Completion**: November 15-19, 2025
