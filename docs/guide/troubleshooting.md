---
title: Troubleshooting
description: Common issues and solutions for parsing errors, rendering problems, installation issues, and export troubleshooting.
lastUpdated: 2025-01-09
---

# Troubleshooting

Common issues and solutions when working with Runiq.

## Parser Errors

### Error: "Expecting '}' but found 'backgroundColor:'"

**Cause**: Container style properties must be **before** the opening `{`, not inside the container body.

❌ **Incorrect:**

```runiq
container "My Container" {
  backgroundColor: "#e3f2fd"
  shape A as @rect label: "Node"
}
```

✅ **Correct:**

```runiq
container "My Container" backgroundColor: "#e3f2fd" {
  shape A as @rect label: "Node"
}
```

**All properties on one line:**

```runiq
container "My Container" backgroundColor: "#e3f2fd" borderColor: "#2196f3" padding: 20 {
  shape A as @rect label: "Node"
}
```

### Error: "Unknown shape type '@xyz'"

**Cause**: Shape ID not found in registry.

**Solution**: Check the shape ID spelling. Use `@` prefix for all shapes.

✅ **Correct shape IDs:**

- `@rect` (not `@rectangle`)
- `@rhombus` (not `@diamond`)
- `@cyl` (not `@cylinder`)

[See complete shape list →](/reference/shapes)

### Error: "Property 'margin' not recognized"

**Cause**: Some CSS-like properties aren't implemented yet.

**Not supported:**

- `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`

**Use instead:**

- `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`

## Layout Issues

### Shapes Overlapping

**Cause**: Insufficient spacing or wrong layout algorithm.

<!-- **Solution 1**: Increase spacing

```runiq
diagram "My Diagram"
  direction TB
  spacing: 100    # Default is 80
``` -->

**Solution**: Try different layout algorithm

```runiq
diagram "My Diagram" {
  algorithm: layered  # or: force, stress, tree, radial
}
```

### Edges Crossing Unnecessarily

**Cause**: Suboptimal layout algorithm for your diagram type.

**Solutions:**

- **Hierarchical flows**: Use `algorithm: layered` (default)
- **Organic/network**: Use `algorithm: force`
- **Tree structures**: Use `algorithm: tree`
- **Balanced**: Use `algorithm: stress`
- **Circular/mindmap**: Use `algorithm: radial`

[Learn more about layout algorithms →](/guide/layout)

### Container Content Not Visible

**Cause**: Container padding too small or shapes positioned outside bounds.

**Solution:** Increase padding

```runiq
container "My Container" padding: 30 {
  shape A as @rect label: "Node"
}
```

## Rendering Issues

### SVG Output is Blank

**Checklist:**

1. ✅ Diagram parsed successfully (check errors)
2. ✅ Layout completed without errors
3. ✅ At least one shape exists in diagram
4. ✅ Shapes have valid positions from layout

**Debug:**

```typescript
const parseResult = parse(dslContent);
console.log('Parse success:', parseResult.success);
console.log('Errors:', parseResult.errors);

const laidOut = await layoutDiagram(diagram);
console.log('Nodes:', laidOut.nodes.length);
console.log('First node position:', laidOut.nodes[0]?.position);
```

### Text Not Rendering

**Cause**: Missing `label` property on shape.

❌ **Missing label:**

```runiq
shape A as @rect
```

✅ **With label:**

```runiq
shape A as @rect label: "My Node"
```

### Colors Not Appearing

**Cause**: Color format issue or style not applied.

**Supported formats:**

```runiq
fill: "#2196f3"              # Hex ✅
fill: "rgb(33, 150, 243)"    # RGB ✅
fill: "rgba(33, 150, 243, 0.5)" # RGBA ✅
fill: "blue"                 # Named ✅
fill: "#219"                 # Short hex ❌
```

## Editor Issues

### Autocomplete Not Working

**Cause**: Langium language server not initialized.

**Solution:** Wait 1-2 seconds after opening editor for language server to start.

### Preview Not Updating

**Cause**: Parse or render error blocking update.

**Solution:** Check browser console for errors:

1. Open DevTools (F12)
2. Look for red errors in Console tab
3. Fix parse errors in code editor

### Validation Errors Not Showing

**Cause**: Validation service not connected.

**Check:** Look for red squiggly underlines in editor. If missing, refresh page.

## Installation Issues

### `pnpm install` Fails

**Cause**: Node version too old.

**Solution:** Upgrade to Node.js 20.19+ or 22.12+

```bash
node --version  # Should be >= 20.19
```

### Build Errors with ELK

**Cause**: ELK native dependencies issue.

**Solution:** Clear cache and reinstall

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### TypeScript Errors in Workspace

**Cause**: Packages not built yet.

**Solution:** Build packages in correct order

```bash
pnpm build
```

Or specific package:

```bash
cd packages/core
pnpm build
```

## Performance Issues

### Slow Layout for Large Diagrams

**Symptom**: Diagrams with 100+ nodes take several seconds to layout.

**Solutions:**

1. **Split into multiple diagrams** - Use containers to organize
2. **Use simpler layout** - Try `algorithm: stress` (faster than `layered`)
3. **Reduce edge complexity** - Fewer crossing edges = faster layout

### Memory Issues

**Symptom**: Browser tab crashes with very large diagrams.

**Solution:** Use streaming rendering (future feature) or split diagram.

## Export Issues

### SPICE Export: "Net not found"

**Cause**: Part pins reference undefined nets.

**Solution:** Declare all nets used in parts

```runiq
# Define nets first
net VCC, GND, IN, OUT

# Then use in parts
part R1 type:R value:10k pins:(IN,OUT)
```

### LaTeX Export: Invalid TikZ Syntax

**Cause**: Node labels contain special LaTeX characters.

**Solution:** Escape special characters: `\`, `{`, `}`, `_`, `^`, `#`, `&`, `%`

```runiq
# Escape underscores
label: "my\_variable"
```

## Common Mistakes

### 1. Forgetting `as` Keyword

❌ **Incorrect:**

```runiq
shape MyNode @rect label: "Node"
```

✅ **Correct:**

```runiq
shape MyNode as @rect label: "Node"
```

### 2. Using `:` Instead of `as`

❌ **Incorrect:**

```runiq
shape MyNode: @rect
```

✅ **Correct:**

```runiq
shape MyNode as @rect
```

### 3. Comments with Wrong Syntax

❌ **Incorrect (Python/Shell style):**

```runiq
# This is a comment
shape A as @rect
```

✅ **Correct (C-style):**

```runiq
// This is a comment
shape A as @rect

/* Or multi-line
   comment */
```

### 4. Edge Label on Wrong Side

```runiq
# Label on source (conditional)
Decision -yes-> Success
Decision -no-> Failure

# Label on edge
Start -> Process label: "begins"
```

### 5. Mixing JSON and DSL

❌ **Don't mix:**

```runiq
diagram "My Diagram"
{
  "shapes": [
    { "id": "A" }
  ]
}
```

Use **either** DSL **or** JSON, not both.

## Getting Help

### Check Existing Documentation

1. [Getting Started Guide](/guide/getting-started)
2. [DSL Syntax Reference](/reference/dsl)
3. [Shape Catalog](/reference/shapes)
4. [Examples](/examples/)

### Search GitHub Issues

Before opening a new issue, search existing ones:
https://github.com/jgreywolf/runiq/issues

### Open a New Issue

Found a bug or need help?

1. Go to: https://github.com/jgreywolf/runiq/issues/new
2. Choose appropriate template:
   - Bug report
   - Feature request
   - Documentation improvement
3. Include:
   - Runiq version
   - Node.js version
   - Operating system
   - Minimal reproducible example
   - Error messages (full text)

### Community Support

- **GitHub Discussions**: https://github.com/jgreywolf/runiq/discussions
- **Discord** (coming soon)

## Debug Mode

Enable verbose logging:

```typescript
import { parse } from '@runiq/parser-dsl';

// Enable debug output
const parseResult = parse(dslContent, {
  debug: true, // Shows parser tokens and AST
});

console.log('AST:', JSON.stringify(parseResult.document, null, 2));
```

## Still Stuck?

If none of these solutions work:

1. ✅ Check that you're using latest version: `pnpm list @runiq/*`
2. ✅ Review [Changelog](https://github.com/jgreywolf/runiq/blob/main/CHANGELOG.md) for breaking changes
3. ✅ Try the [online playground](https://editor.runiq.org) - does it work there?
4. ✅ Check browser console for JavaScript errors
5. ✅ Search GitHub issues for similar problems
6. ✅ Open a detailed issue with reproducible example

## Quick Diagnostic Checklist

```bash
# Check versions
node --version    # >= 20.19 or >= 22.12
pnpm --version    # >= 8.15.0

# Check build status
pnpm build        # All packages should build successfully

# Run tests
pnpm test         # Should see 1,700+ tests passing

# Check parser
cd packages/parser-dsl
pnpm test         # Should see ~400 tests passing
```

## See Also

- [Getting Started](/guide/getting-started) - Installation and setup
- [Quick Start](/guide/quick-start) - 5-minute tutorial
- [DSL Reference](/reference/dsl) - Complete syntax reference
- [Contributing Guide](/contributing) - Report bugs or contribute
