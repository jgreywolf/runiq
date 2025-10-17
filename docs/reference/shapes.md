# Shape Reference

Runiq provides **54 shapes** across 9 categories for building professional diagrams.

## Quick Reference

| Shape | Syntax | Use Case |
|-------|--------|----------|
| Rectangle | `@rect` | Process steps, general purpose |
| Rounded Rectangle | `@rounded` | Terminal points (start/end) |
| Diamond | `@rhombus` | Decisions, branching |
| Hexagon | `@hex` | Preparation, success states |
| Circle | `@circle` | Simple state, connector |
| Ellipse | `@ellipse` | Elongated state |
| Cylinder | `@cyl` | Databases, storage |
| Document | `@doc` | Documents, outputs |
| Parallelogram | `@para` | Input/output |
| Trapezoid | `@trap` | Manual operation |
| Cloud | `@cloud` | Cloud services, external systems |
| Pentagon | `@pent` | Process container |
| Triangle | `@triangle` | Flow direction |
| Octagon | `@octagon` | Stop, halt |
| Star | `@star` | Special events |

[See all 54 shapes below ↓](#all-shapes)

## Categories

### 1. Actors (8 shapes)

User representations for use case diagrams:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Actor | `@actor` | Classic stick figure actor |
| Box Actor | `@box-actor` | Simplified box actor |
| Circle Actor | `@circle-actor` | Circle head with body |
| Rounded Actor | `@rounded-actor` | Rounded box actor |
| Square Actor | `@square-actor` | Square body actor |
| Tall Actor | `@tall-actor` | Tall proportions |
| Wide Actor | `@wide-actor` | Wide proportions |
| Custom Actor | `@custom-actor` | Configurable actor |

**Example:**
```runiq
shape User as @actor label: "Customer"
shape Admin as @box-actor label: "Administrator"
```

### 2. Circles (10 shapes)

Various circle styles and sizes:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Circle | `@circle` | Standard circle |
| Small Circle | `@circle-sm` | Small circle |
| Large Circle | `@circle-lg` | Large circle |
| XL Circle | `@circle-xl` | Extra large circle |
| Double Circle | `@double-circle` | Concentric circles |
| Filled Circle | `@filled-circle` | Solid filled |
| Dashed Circle | `@dashed-circle` | Dashed border |
| Dotted Circle | `@dotted-circle` | Dotted border |
| Thick Circle | `@thick-circle` | Thick border |
| Thin Circle | `@thin-circle` | Thin border |

**Example:**
```runiq
shape Start as @circle label: "A"
shape End as @double-circle label: "Z"
```

### 3. UML (2 shapes)

UML-specific shapes:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Use Case Oval | `@usecase` | UML use case |
| System Boundary | `@system-boundary` | System container |

**Example:**
```runiq
container "Banking System" as @system-boundary {
  shape Login as @usecase label: "User Login"
}
```

### 4. Data & Documents (7 shapes)

Documents and data representations:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Document | `@doc` | Single document |
| Multi-Document | `@multi-doc` | Stack of documents |
| Tape | `@tape` | Magnetic tape |
| Stored Data | `@stored-data` | Data at rest |
| Display | `@display` | Screen/monitor |
| Note | `@note` | Annotation |
| Card | `@card` | Punch card |

**Example:**
```runiq
shape Report as @doc label: "Monthly Report"
shape Archive as @tape label: "Backup"
```

### 5. Data I/O (6 shapes)

Input and output operations:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Parallelogram | `@para` | General I/O |
| Input | `@input` | Data input |
| Output | `@output` | Data output |
| Manual Input | `@manual-input` | Keyboard entry |
| Manual Operation | `@manual-op` | Manual step |
| Prep | `@prep` | Preparation |

**Example:**
```runiq
shape UserInput as @manual-input label: "Enter Data"
shape Process as @rect label: "Validate"
shape Result as @output label: "Display"
```

### 6. Storage (6 shapes)

Database and storage systems:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Cylinder | `@cyl` | Database |
| Drum | `@drum` | Direct access storage |
| Disk | `@disk` | Magnetic disk |
| Stored Data | `@stored-data` | Data at rest |
| Internal Storage | `@internal-storage` | RAM, registers |
| Sequential Data | `@seq-data` | Sequential access |

**Example:**
```runiq
shape MainDB as @cyl label: "PostgreSQL"
shape Cache as @internal-storage label: "Redis"
```

### 7. Process (9 shapes)

Process and operation steps:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Rectangle | `@rect` | Process step |
| Rounded Rectangle | `@rounded` | Terminal (start/end) |
| Subroutine | `@subroutine` | Predefined process |
| Subprocess | `@subprocess` | Complex subprocess |
| Loop Limit | `@loop-limit` | Loop bounds |
| Collate | `@collate` | Sorting, ordering |
| Sort | `@sort` | Sort operation |
| Merge | `@merge` | Merge operation |
| Extract | `@extract` | Extract data |

**Example:**
```runiq
shape Start as @rounded label: "Start"
shape Process as @rect label: "Process"
shape Sub as @subroutine label: "Validate"
shape End as @rounded label: "End"
```

### 8. Specialized (3 shapes)

Special-purpose shapes:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Cloud | `@cloud` | Cloud service, external system |
| Delay | `@delay` | Time delay |
| Off-page | `@off-page` | Off-page connector |

**Example:**
```runiq
shape AWS as @cloud label: "AWS S3"
shape Wait as @delay label: "Wait 5 seconds"
```

### 9. Annotations (3 shapes)

Comments and notes:

| Shape | Syntax | Description |
|-------|--------|-------------|
| Note | `@note` | Annotation |
| Comment | `@comment` | Comment block |
| Callout | `@callout` | Callout bubble |

**Example:**
```runiq
shape Step as @rect label: "Process"
shape Info as @note label: "Runs nightly"
```

## All Shapes

Complete table of all 54 shapes:

<table>
<thead>
<tr>
<th>Shape</th>
<th>Syntax</th>
<th>Category</th>
<th>Use Case</th>
</tr>
</thead>
<tbody>
<tr><td>Actor</td><td><code>@actor</code></td><td>Actors</td><td>User, role in use case</td></tr>
<tr><td>Box Actor</td><td><code>@box-actor</code></td><td>Actors</td><td>Simplified actor</td></tr>
<tr><td>Circle Actor</td><td><code>@circle-actor</code></td><td>Actors</td><td>Alternative actor</td></tr>
<tr><td>Rounded Actor</td><td><code>@rounded-actor</code></td><td>Actors</td><td>Rounded actor</td></tr>
<tr><td>Square Actor</td><td><code>@square-actor</code></td><td>Actors</td><td>Square actor</td></tr>
<tr><td>Tall Actor</td><td><code>@tall-actor</code></td><td>Actors</td><td>Tall proportions</td></tr>
<tr><td>Wide Actor</td><td><code>@wide-actor</code></td><td>Actors</td><td>Wide proportions</td></tr>
<tr><td>Custom Actor</td><td><code>@custom-actor</code></td><td>Actors</td><td>Configurable</td></tr>
<tr><td>Circle</td><td><code>@circle</code></td><td>Circles</td><td>State, connector</td></tr>
<tr><td>Small Circle</td><td><code>@circle-sm</code></td><td>Circles</td><td>Small state</td></tr>
<tr><td>Large Circle</td><td><code>@circle-lg</code></td><td>Circles</td><td>Large state</td></tr>
<tr><td>XL Circle</td><td><code>@circle-xl</code></td><td>Circles</td><td>Extra large state</td></tr>
<tr><td>Double Circle</td><td><code>@double-circle</code></td><td>Circles</td><td>Final state, accept</td></tr>
<tr><td>Filled Circle</td><td><code>@filled-circle</code></td><td>Circles</td><td>Initial state</td></tr>
<tr><td>Dashed Circle</td><td><code>@dashed-circle</code></td><td>Circles</td><td>Optional state</td></tr>
<tr><td>Dotted Circle</td><td><code>@dotted-circle</code></td><td>Circles</td><td>Tentative state</td></tr>
<tr><td>Thick Circle</td><td><code>@thick-circle</code></td><td>Circles</td><td>Emphasized state</td></tr>
<tr><td>Thin Circle</td><td><code>@thin-circle</code></td><td>Circles</td><td>De-emphasized state</td></tr>
<tr><td>Use Case</td><td><code>@usecase</code></td><td>UML</td><td>UML use case</td></tr>
<tr><td>System Boundary</td><td><code>@system-boundary</code></td><td>UML</td><td>System container</td></tr>
<tr><td>Document</td><td><code>@doc</code></td><td>Data & Docs</td><td>Report, output</td></tr>
<tr><td>Multi-Document</td><td><code>@multi-doc</code></td><td>Data & Docs</td><td>Multiple documents</td></tr>
<tr><td>Tape</td><td><code>@tape</code></td><td>Data & Docs</td><td>Backup, archive</td></tr>
<tr><td>Stored Data</td><td><code>@stored-data</code></td><td>Data & Docs</td><td>Data at rest</td></tr>
<tr><td>Display</td><td><code>@display</code></td><td>Data & Docs</td><td>Screen, monitor</td></tr>
<tr><td>Note</td><td><code>@note</code></td><td>Data & Docs</td><td>Annotation</td></tr>
<tr><td>Card</td><td><code>@card</code></td><td>Data & Docs</td><td>Punch card</td></tr>
<tr><td>Parallelogram</td><td><code>@para</code></td><td>Data I/O</td><td>General I/O</td></tr>
<tr><td>Input</td><td><code>@input</code></td><td>Data I/O</td><td>Data input</td></tr>
<tr><td>Output</td><td><code>@output</code></td><td>Data I/O</td><td>Data output</td></tr>
<tr><td>Manual Input</td><td><code>@manual-input</code></td><td>Data I/O</td><td>Keyboard entry</td></tr>
<tr><td>Manual Operation</td><td><code>@manual-op</code></td><td>Data I/O</td><td>Manual step</td></tr>
<tr><td>Prep</td><td><code>@prep</code></td><td>Data I/O</td><td>Preparation</td></tr>
<tr><td>Cylinder</td><td><code>@cyl</code></td><td>Storage</td><td>Database</td></tr>
<tr><td>Drum</td><td><code>@drum</code></td><td>Storage</td><td>Direct access</td></tr>
<tr><td>Disk</td><td><code>@disk</code></td><td>Storage</td><td>Magnetic disk</td></tr>
<tr><td>Internal Storage</td><td><code>@internal-storage</code></td><td>Storage</td><td>RAM, cache</td></tr>
<tr><td>Sequential Data</td><td><code>@seq-data</code></td><td>Storage</td><td>Sequential access</td></tr>
<tr><td>Rectangle</td><td><code>@rect</code></td><td>Process</td><td>Process step</td></tr>
<tr><td>Rounded Rectangle</td><td><code>@rounded</code></td><td>Process</td><td>Start, end</td></tr>
<tr><td>Subroutine</td><td><code>@subroutine</code></td><td>Process</td><td>Predefined process</td></tr>
<tr><td>Subprocess</td><td><code>@subprocess</code></td><td>Process</td><td>Complex subprocess</td></tr>
<tr><td>Loop Limit</td><td><code>@loop-limit</code></td><td>Process</td><td>Loop bounds</td></tr>
<tr><td>Collate</td><td><code>@collate</code></td><td>Process</td><td>Sort, order</td></tr>
<tr><td>Sort</td><td><code>@sort</code></td><td>Process</td><td>Sort operation</td></tr>
<tr><td>Merge</td><td><code>@merge</code></td><td>Process</td><td>Merge data</td></tr>
<tr><td>Extract</td><td><code>@extract</code></td><td>Process</td><td>Extract data</td></tr>
<tr><td>Cloud</td><td><code>@cloud</code></td><td>Specialized</td><td>Cloud service</td></tr>
<tr><td>Delay</td><td><code>@delay</code></td><td>Specialized</td><td>Time delay</td></tr>
<tr><td>Off-page</td><td><code>@off-page</code></td><td>Specialized</td><td>Off-page connector</td></tr>
<tr><td>Note</td><td><code>@note</code></td><td>Annotations</td><td>Note, comment</td></tr>
<tr><td>Comment</td><td><code>@comment</code></td><td>Annotations</td><td>Comment block</td></tr>
<tr><td>Callout</td><td><code>@callout</code></td><td>Annotations</td><td>Callout bubble</td></tr>
</tbody>
</table>

## Shape Properties

All shapes support these properties:

```runiq
shape MyShape as @rect 
  label: "Display Text"
  fillColor: "#4caf50"
  textColor: "#ffffff"
  strokeColor: "#333333"
  strokeWidth: 2
  opacity: 0.9
```

### Color Properties

- `fillColor` - Background color (hex or CSS color)
- `textColor` - Label text color
- `strokeColor` - Border color
- `strokeWidth` - Border width in pixels
- `opacity` - Transparency (0.0 to 1.0)

### Layout Properties

- `width` - Override shape width
- `height` - Override shape height
- `padding` - Internal padding

## Next Steps

- [View Examples →](/examples/) - See shapes in action
- [Quick Start →](/guide/quick-start) - Build your first diagram
- [API Reference →](/reference/api/core) - Programmatic usage

---

::: tip Choosing Shapes
When in doubt:
- **@rounded** for start/end
- **@rect** for processes
- **@rhombus** for decisions
- **@cyl** for databases
- **@doc** for documents
:::
