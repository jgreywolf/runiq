# Editor Validation Implementation

## Completed: January 2025

### ✅ Enhanced CodeMirror Linter with Langium

**File**: `src/lib/components/CodeEditor.svelte`

#### Features Implemented:

##### Real-time Validation
- Integrated full Langium parser validation
- Replaces basic syntax checking with comprehensive DSL validation
- Async validation with debouncing for performance

##### Smart Shape Typo Detection
- Uses Levenshtein distance algorithm for fuzzy matching
- Suggests closest valid shape names when typos detected
- Error message format: `Unknown shape type 'rectange'. Did you mean: rectangle, triangle, rhombus?`

##### Quick-Fix Actions
- Clickable suggestions in error tooltips
- One-click replacement of misspelled shapes
- Limits to top 3 suggestions for clarity
- Pattern matching to replace only the shape type (preserves `@` prefix and other code)

##### Diagnostic Severity Mapping
- **Errors**: Unknown shapes, invalid syntax (red squiggles)
- **Warnings**: Long shape IDs (>50 chars), multiple arrows (yellow squiggles)
- **Info/Hints**: Shape alias hints, best practices (blue squiggles)

#### Implementation Details:

**Langium Services Integration:**
```typescript
const langiumServices = createRuniqServices(EmptyFileSystem).Runiq;

async function runiqLinter(view: EditorView): Promise<Diagnostic[]> {
  const langiumDoc = langiumServices.shared.workspace.LangiumDocumentFactory.fromString(
    text,
    'inmemory://temp.runiq' as any
  );
  
  await langiumServices.shared.workspace.DocumentBuilder.build([langiumDoc], {});
  
  const validationDiagnostics = 
    await langiumServices.validation.DocumentValidator.validateDocument(langiumDoc);
  
  // Convert LSP → CodeMirror format
  return convertDiagnostics(validationDiagnostics);
}
```

**Quick-Fix Pattern Extraction:**
```typescript
function extractQuickFixes(diagnostic: LangiumDiagnostic): Action[] {
  const didYouMeanMatch = message.match(/Did you mean: ([^?]+)\?/);
  
  if (didYouMeanMatch) {
    const suggestions = didYouMeanMatch[1].split(',').map(s => s.trim());
    
    return suggestions.slice(0, 3).map(suggestion => ({
      name: `Replace with '${suggestion}'`,
      apply: (view, from, to) => {
        // Smart replacement preserving @ prefix and line structure
        const asMatch = lineText.match(/as\s+(@?\w+)/);
        // ... replace logic
      }
    }));
  }
  
  return [];
}
```

**Severity Mapping:**
```typescript
let severity: 'error' | 'warning' | 'info' = 'error';
if (diagnostic.severity === 1) severity = 'error';       // LSP DiagnosticSeverity.Error
else if (diagnostic.severity === 2) severity = 'warning'; // LSP DiagnosticSeverity.Warning
else if (diagnostic.severity === 3 || diagnostic.severity === 4) severity = 'info'; // LSP Info/Hint
```

#### Dependencies Added:
- `langium` v4.1.0 - Langium framework services
- `vscode-languageserver-types` v3.17.5 - LSP diagnostic types

#### User Experience:

1. **Type invalid shape:**
   ```
   shape A as @rectange
             ^^^^^^^^^^ 
   ```
   Error: "Unknown shape type 'rectange'. Did you mean: rectangle, triangle, rhombus?"

2. **Click suggestion:**
   - Hover over error → See tooltip with suggestions
   - Click "Replace with 'rectangle'" → Instant fix

3. **See alias hints:**
   ```
   shape A as @rect
              ^^^^
   ```
   Hint: "Shape 'rect' is alias for 'rectangle'. Available aliases: rect, box, square"

#### Performance Considerations:
- Async validation prevents UI blocking
- Debounced updates (300ms delay configured in parent component)
- Efficient LSP → CodeMirror position conversion
- Validation runs on document change only

#### Testing:

Manual testing checklist:
- [x] Type `shape A as @rectange` → See error with suggestions
- [x] Click suggestion → Shape name replaced correctly
- [x] Type valid shape → No errors
- [x] Type `shape A as @rect` → See hint about alias
- [x] Type very long shape ID → See warning
- [x] Type invalid syntax → See parse errors

#### Future Enhancements:
- [ ] Visual error overlay panel (show all errors at once)
- [ ] Inline error markers in gutter
- [ ] Autocomplete integration with shape registry
- [ ] Code actions for inserting common patterns
- [ ] Diagnostic filtering/suppression

#### Related Files:
- `packages/parser-dsl/src/validator.ts` - Langium validation logic
- `packages/parser-dsl/src/utils/levenshtein.ts` - Fuzzy matching algorithm
- `packages/core/src/shape-aliases.ts` - Shape alias definitions

---

## Technical Architecture

### Validation Flow:

```
User Types in Editor
     ↓
CodeMirror Change Event
     ↓
Debounce Timer (300ms)
     ↓
runiqLinter(view: EditorView)
     ↓
Create Langium Document (in-memory)
     ↓
Build Document (resolve references)
     ↓
Validate Document (run validators)
     ↓
Extract Diagnostics
     ↓
Convert LSP → CodeMirror Format
     ↓
Extract Quick-Fix Actions
     ↓
Render Error Squiggles + Tooltips
```

### Data Flow:

```typescript
// Input
text: string = "shape A as @rectange"

// Processing
langiumDoc: LangiumDocument = createDoc(text)
validationDiagnostics: LangiumDiagnostic[] = validate(langiumDoc)

// Output
codemirrorDiagnostics: CodeMirror.Diagnostic[] = [
  {
    from: 15,
    to: 24,
    severity: 'error',
    message: "Unknown shape type 'rectange'. Did you mean: rectangle, triangle, rhombus?",
    actions: [
      { name: "Replace with 'rectangle'", apply: (v, f, t) => {...} },
      { name: "Replace with 'triangle'", apply: (v, f, t) => {...} },
      { name: "Replace with 'rhombus'", apply: (v, f, t) => {...} }
    ]
  }
]
```

### Position Conversion:

LSP uses 0-based line/character positions:
```typescript
{ line: 0, character: 15 }  // First line, 16th character
```

CodeMirror uses absolute offsets:
```typescript
from: 15, to: 24  // Characters 15-24 in the document
```

Conversion function:
```typescript
function offsetAt(doc: any, position: { line: number; character: number }): number {
  const line = doc.line(position.line + 1); // LSP 0-based → CodeMirror 1-based
  return line.from + position.character;
}
```

---

## Configuration

No user-facing configuration needed. Validation is automatic and always enabled.

Developer can adjust:
- Debounce delay in parent component (`Preview.svelte`)
- Max suggestions count in `extractQuickFixes()` (currently 3)
- Severity levels in validator implementation

---

## Troubleshooting

**Validation not working:**
- Check browser console for errors
- Verify `@runiq/parser-dsl` is built and up-to-date
- Ensure `registerDefaultShapes()` was called on app init

**Quick-fixes not appearing:**
- Verify error message contains "Did you mean:" pattern
- Check that shape registry has available alternatives
- Ensure Levenshtein distance < 3 for suggestions

**Performance issues:**
- Increase debounce delay in parent component
- Reduce max suggestions count
- Consider disabling validation for very large documents

---

## Credits

- Validation system: Based on Langium framework
- Fuzzy matching: Levenshtein distance algorithm
- Quick-fixes: Inspired by VS Code Code Actions API
