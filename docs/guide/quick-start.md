---
title: Quick Start
description: Create a complete diagram from scratch in 5 minutes with step-by-step tutorial from concept to export.
lastUpdated: 2025-01-09
---

# Quick Start

Let's create a complete diagram from scratch in 5 minutes!

## The Goal

We'll create an authentication flow diagram with multiple paths, decisions, and styling.

## Step 1: Create the File

Create `auth-flow.runiq`:

```runiq
diagram "User Authentication Flow" {
  direction TB

  # Entry point
  shape Login as @rounded label: "User Login"

  # Process steps
  shape ValidateInput as @rect label: "Validate Input"
  shape CheckDB as @cylinder label: "Check Database"
  shape VerifyPassword as @rhombus label: "Password Correct?"

  # Success path
  shape GenerateToken as @rect label: "Generate JWT"
  shape Success as @hexagon label: "Success"

  # Error paths
  shape InvalidInput as @doc label: "Invalid Input Error"
  shape WrongPassword as @doc label: "Wrong Password Error"
  shape AccountLocked as @doc label: "Account Locked"

  # Connections
  Login -> ValidateInput

  # Validation branch
  ValidateInput -valid-> CheckDB
  ValidateInput -invalid-> InvalidInput

  # Authentication branch
  CheckDB -> VerifyPassword
  VerifyPassword -yes-> GenerateToken
  VerifyPassword -no-> WrongPassword

  # Success
  GenerateToken -> Success
}
```

## Step 2: Understand the Syntax

### Shapes

Format: `shape <ID> as <shape-type> [properties]`

```runiq
shape Start as @rounded label: "Start"
#     └─ID      └─shape      └─property
```

Common shapes:

- `@rounded` - Rounded rectangle (start/end)
- `@rect` - Rectangle (process)
- `@rhombus` - Diamond (decision)
- `@hexagon` - Hexagon (preparation)
- `@cylinder` - Cylinder (database)
- `@doc` - Document (output)

[See all 54 shapes →](/reference/shapes)

### Edges

Format: `<from> -> <to> [label]` or `<from>[label] -> <to>`

```runiq
diagram "User Authentication Flow" {
  # Simple edge
  A -> B

  # Labeled edge
  A -> B label: "success"

  # Conditional edge (on source)
  Decision -yes-> Success
  Decision -no-> Failure

  # Labeled edge
  A -> B label: "validates"
}
```

## Step 3: Add Containers

Let's group related shapes into containers:

```runiq
diagram "User Authentication Flow" {
  direction TB

  container "Client Layer" {
    shape Login as @rounded label: "User Login"
    shape Success as @hexagon label: "Success"
  }

  container "Server Layer" {
    shape ValidateInput as @rect label: "Validate Input"
    shape CheckDB as @cylinder label: "Check Database"
    shape VerifyPassword as @rhombus label: "Password Correct?"
    shape GenerateToken as @rect label: "Generate JWT"
  }

  container "Error Handling" {
    shape InvalidInput as @doc label: "Invalid Input Error"
    shape WrongPassword as @doc label: "Wrong Password Error"
  }

  # Cross-container connections
  Login -> ValidateInput
  ValidateInput -valid-> CheckDB
  ValidateInput -invalid-> InvalidInput
  CheckDB -> VerifyPassword
  VerifyPassword -yes-> GenerateToken
  VerifyPassword -no-> WrongPassword
  GenerateToken -> Success
}
```

## Step 4: Add Styling

### Colors

```runiq
diagram "Colors" {
  shape Success as @hexagon label: "Success" fill: "#4caf50" color: "#fff"
  shape Error as @doc label: "Error" fill: "#f44336" color: "#fff"
}
```

### Line Styles

```runiq
diagram "Line styles" {
  direction TB
  # Dashed line for error paths
  ValidateInput -invalid-> InvalidInput lineStyle: dashed stroke: "#f44336"

  # Dotted line for optional paths
  CheckDB -> AuditLog label: "log attempt" lineStyle: dotted
}
```

### Container Styling

```runiq
diagram "Container styles" {
  container "Client Layer" fill: "#e3f2fd" {
    # ... shapes
  }
}
```

## Step 5: Add Icons

Make your diagrams more visual with inline icons:

```runiq
diagram "Social Media Flow" {
  direction TB

  # Inline icons within labels
  shape Login as @rounded label: "fa:fa-user Login"
  shape Post as @rect label: "fa:fa-pen Create Post"
  shape Share as @rhombus label: "fa:fa-share Share?"
  shape Twitter as @rect label: "fa:fa-twitter Post to Twitter"
  shape Facebook as @rect label: "fa:fa-facebook Post to Facebook"
  shape Success as @hexagon label: "fa:fa-check Published!"

  Login -> Post
  Post -> Share
  Share -yes-> Twitter
  Share -yes-> Facebook
  Twitter -> Success
  Facebook -> Success
}
```

You can also add corner icons:

```runiq
shape Server as @rect label: "Production Server" icon:fa/server
shape DB as @cylinder label: "Database" icon:fa/database
```

[Learn more about icons →](/guide/inline-icons)

## Step 6: Use UML Stereotypes

For use case or architectural diagrams:

```runiq
diagram "System Architecture" {
  direction LR

  shape Client as @rect label: "Client App"
  shape API as @rect label: "REST API"
  shape DB as @cylinder label: "Database"

  # UML stereotypes
  Client -> API stereotype: "«uses»" lineStyle: dashed arrowType: open
  API -> DB stereotype: "«accesses»" lineStyle: solid arrowType: standard
}
```

## Step 7: Generate Output

### Using TypeScript API

```typescript
import { parse } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';
import { renderSvg } from '@runiq/renderer-svg';
import { readFileSync, writeFileSync } from 'fs';

async function generateDiagram() {
  // Parse DSL
  const dsl = readFileSync('auth-flow.runiq', 'utf-8');
  const parseResult = parse(dsl);

  if (!parseResult.success) {
    console.error('Errors:', parseResult.errors);
    return;
  }

  // Layout
  const diagram = parseResult.document!.diagrams[0];
  const laidOut = await layoutDiagram(diagram, {
    algorithm: 'layered',
    direction: 'TB',
    spacing: 80,
  });

  // Render
  const result = renderSvg(diagram, laidOut, {
    title: diagram.title,
  });

  // Save
  writeFileSync('auth-flow.svg', result.svg);
  console.log('✅ Generated auth-flow.svg');
}

generateDiagram();
```

### Using CLI (coming soon)

```bash
runiq auth-flow.runiq -o auth-flow.svg
```

## Common Patterns

### 1. Flowchart with Loops

```runiq
diagram "Process Loop" {
  direction TB

  shape Start as @rounded label: "Start"
  shape Process as @rect label: "Process Item"
  shape Check as @rhombus label: "More Items?"
  shape End as @rounded label: "End"

  Start -> Process
  Process -> Check
  Check -yes-> Process
  Check -no-> End
}
```

### 2. Multi-tier Architecture

```runiq
diagram "Three-Tier Architecture" {
  direction TB

  container "Presentation" {
    shape UI as @rect label: "Web UI"
  }

  container "Business Logic" {
    shape API as @rect label: "API Server"
    shape Auth as @rect label: "Auth Service"
  }

  container "Data" {
    shape DB as @cylinder label: "Database"
    shape Cache as @cylinder label: "Redis"
  }

  UI -> API
  API -> Auth
  API -> DB
  API -> Cache
}
```

### 3. State Machine

```runiq
diagram "Order State Machine" {
  direction LR

  shape New as @rounded label: "New"
  shape Processing as @rect label: "Processing"
  shape Shipped as @rect label: "Shipped"
  shape Delivered as @hexagon label: "Delivered"
  shape Cancelled as @doc label: "Cancelled"

  New -> Processing label: "confirm"
  Processing -> Shipped label: "ship"
  Shipped -> Delivered label: "deliver"
  Processing -> Cancelled label: "cancel"
  New -> Cancelled label: "cancel"
}
```

## Next Steps

Now that you've created your first diagram:

1. **Explore Examples** - See [complete examples →](/examples/)
2. **Learn All Shapes** - Browse the [shape reference →](/reference/shapes)
3. **Advanced Features** - Try [electrical circuits →](/guide/electrical) or [block diagrams →](/guide/block-diagrams)
4. **API Deep Dive** - Read the [full API docs →](/reference/api/core)

## Tips & Tricks

::: tip Use Meaningful IDs
Choose IDs that describe the purpose, not just `A`, `B`, `C`:

```runiq
shape ValidateUser as @rect    # ✅ Clear
shape Node1 as @rect            # ❌ Unclear
```

:::

::: tip Group Related Shapes
Use containers to organize complex diagrams:

```runiq
container "Frontend" { ... }
container "Backend" { ... }
container "Database" { ... }
```

:::

::: tip Test Your Diagrams
Write tests for critical diagrams to ensure they parse correctly:

```typescript
test('auth flow parses correctly', () => {
  const result = parse(readFileSync('auth-flow.runiq', 'utf-8'));
  expect(result.success).toBe(true);
  expect(result.document.diagrams).toHaveLength(1);
});
```

:::

---

**Congratulations!** 🎉 You've created your first Runiq diagram. Now go build something amazing!
