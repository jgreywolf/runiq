# Runiq Editor - Design Document

**Version:** 1.0  
**Date:** October 17, 2025  
**Status:** Ready for Implementation

---

## 🎯 Project Overview

Create a powerful, intuitive web-based editor for Runiq diagram creation with a focus on developer experience and productivity.

### Core Philosophy
- **Code-First, Visually-Aided**: DSL editing with real-time visual feedback
- **Fast & Responsive**: Smooth editing experience with incremental updates
- **Desktop-Optimized**: Touch-aware for tablets, desktop-primary
- **Accessible**: Keyboard navigation, screen reader support, high contrast

---

## 📐 Layout Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header: Brand Identity, Save Status, Export, Settings              │
├────────────────┬─────────────────────────────┬──────────────────────┤
│   Toolbox      │      Code Editor            │   Live Preview       │
│   (20%)        │      (40%)                  │   (40%)              │
│                │                             │                      │
│ [Search Bar]   │  ┌──────────────────────┐  │  ┌────────────────┐ │
│                │  │ Tab: diagram1.runiq  │  │  │                │ │
│ ▼ General      │  ├──────────────────────┤  │  │   SVG Canvas   │ │
│   • Rectangle  │  │ 1 diagram main {     │  │  │                │ │
│   • Circle     │  │ 2   node A           │  │  │   [Preview]    │ │
│   • Diamond    │  │ 3   node B           │  │  │                │ │
│                │  │ 4   edge A -> B      │  │  │   Pan/Zoom     │ │
│ ▼ Software     │  │ 5 }                  │  │  │                │ │
│   • Class      │  │                      │  │  │                │ │
│   • Interface  │  │ [CodeMirror]         │  │  └────────────────┘ │
│                │  │ [Line Numbers]       │  │                      │
│ ▷ Electrical   │  │ [Minimap]            │  │  [Status: Parsed ✓] │
│ ▷ Network      │  └──────────────────────┘  │  [Error Overlay]    │
│ ▷ Quantum      │                             │                      │
│ ▷ BPMN         │  [Parsing...]              │  [Minimap]          │
└────────────────┴─────────────────────────────┴──────────────────────┘
```

### Panel Sizing
- **Toolbox**: 20% width (collapsible to icon bar)
- **Editor**: 40% width (resizable)
- **Preview**: 40% width (resizable)
- Splitter bars allow user to resize panels

---

## 🔧 Technical Architecture

### State Management Strategy

**✅ DECISION: Code as Source of Truth (Option A)**

```
User Action → Update DSL Code → Parse to AST → Layout → Render SVG
     ↓
  Update Editor
     ↓
  Trigger Parsing (debounced 300ms)
     ↓
  Update Preview
```

**Data Flow:**
```typescript
// Single source of truth
interface EditorState {
  code: string;              // Current DSL text
  cursorPosition: number;    // Editor cursor
  selection: Range | null;   // Selected text
  
  // Derived state (computed from code)
  ast: DiagramAST | null;    // Parsed AST
  layoutResult: LayoutResult | null;
  svg: string | null;        // Rendered SVG
  
  // Parse status
  parseStatus: 'idle' | 'parsing' | 'success' | 'error';
  errors: ParseError[];      // Syntax/validation errors
}

// Reactive updates
$: ast = parseRuniqDSL(code);
$: layoutResult = ast ? layoutDiagram(ast) : null;
$: svg = layoutResult ? renderSVG(layoutResult) : lastValidSvg;
```

### Code ↔ Canvas Mapping

**Source Maps for Bidirectional Linking:**

```typescript
interface SourceMap {
  // Map AST node ID → Source location
  nodeLocations: Map<string, SourceLocation>;
  
  // Map line number → AST node IDs
  lineToNodes: Map<number, string[]>;
}

interface SourceLocation {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

// Usage:
// 1. User clicks shape in preview
//    → Get node ID → Look up source location → Highlight in editor
// 2. User hovers line in editor
//    → Get line number → Look up node IDs → Highlight in preview
```

**Implementation in Parser:**
- Langium already tracks token positions
- Extend AST nodes with `$cstNode` property containing source info
- Build source map during parse phase

---

## 🎨 Component Architecture

### SvelteKit Structure

```
apps/editor/src/
├── routes/
│   ├── +page.svelte              # Main editor page
│   └── +layout.svelte            # App shell with header
├── lib/
│   ├── components/
│   │   ├── Header.svelte         # Brand, save status, export
│   │   ├── Toolbox/
│   │   │   ├── Toolbox.svelte    # Container
│   │   │   ├── SearchBar.svelte  # Shape search
│   │   │   ├── CategoryAccordion.svelte
│   │   │   └── ShapeItem.svelte  # Draggable shape
│   │   ├── Editor/
│   │   │   ├── CodeEditor.svelte # CodeMirror wrapper
│   │   │   ├── TabBar.svelte     # Multiple diagram tabs
│   │   │   └── Minimap.svelte    # Code overview
│   │   └── Preview/
│   │       ├── DiagramPreview.svelte # SVG canvas
│   │       ├── PanZoom.svelte    # Pan/zoom controls
│   │       ├── ErrorOverlay.svelte
│   │       └── PreviewMinimap.svelte
│   ├── stores/
│   │   ├── editor.ts             # Main editor state
│   │   ├── tabs.ts               # Tab management
│   │   ├── history.ts            # Diagram history (20 items)
│   │   └── preferences.ts        # User settings
│   ├── services/
│   │   ├── parser.service.ts     # Parsing + source maps
│   │   ├── layout.service.ts     # ELK layout
│   │   ├── render.service.ts     # SVG rendering
│   │   ├── storage.service.ts    # localStorage operations
│   │   └── export.service.ts     # Export to SVG/PNG/runiq
│   ├── utils/
│   │   ├── debounce.ts
│   │   ├── sourceMap.ts          # Source map utilities
│   │   └── keyboard.ts           # Keyboard shortcuts
│   └── types/
│       ├── editor.types.ts
│       └── sourceMap.types.ts
└── app.css                       # Tailwind + custom styles
```

---

## 🧩 Feature Specifications

### 1. Header Component

**Content:**
- **Left**: Runiq logo + brand name
- **Center**: Current diagram name (editable inline)
- **Right**: 
  - Save status indicator (Auto-saved 2 seconds ago ✓)
  - Export button (dropdown: SVG, PNG, .runiq)
  - Settings/preferences icon
  - Help/docs link

**Actions:**
```typescript
interface HeaderActions {
  onExportSVG: () => void;
  onExportPNG: () => void;
  onExportRuniq: () => void;
  onImportRuniq: (file: File) => void;
  onToggleSettings: () => void;
}
```

---

### 2. Toolbox Component

#### 2.1 Search Bar
- **Position**: Top of toolbox
- **Functionality**: 
  - Filter shapes by name (fuzzy search)
  - Show matching shapes across all categories
  - Keyboard: `/` to focus, `Esc` to clear
- **UI**: `<input>` with search icon, clear button

#### 2.2 Category Accordions

**Categories (Expandable):**
```typescript
const categories = [
  {
    id: 'general',
    name: 'General',
    icon: '📐',
    shapes: ['rectangle', 'circle', 'diamond', 'ellipse', 'polygon', ...]
  },
  {
    id: 'software',
    name: 'Software Architecture',
    icon: '💻',
    subcategories: [
      { name: 'UML', shapes: ['class', 'interface', 'component', ...] },
      { name: 'C4', shapes: ['person', 'system', 'container', ...] }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    shapes: ['resistor', 'capacitor', 'inductor', 'transistor', ...]
  },
  {
    id: 'network',
    name: 'Network & Cloud',
    icon: '🌐',
    shapes: ['router', 'switch', 'firewall', 'server', ...]
  },
  {
    id: 'quantum',
    name: 'Quantum Circuits',
    icon: '⚛️',
    shapes: ['gate-x', 'gate-h', 'cnot', 'measurement', ...]
  },
  {
    id: 'bpmn',
    name: 'BPMN',
    icon: '📋',
    shapes: ['start-event', 'end-event', 'task', 'gateway', ...]
  }
];
```

**Behavior:**
- Click category header to expand/collapse
- One expanded at a time (accordion), or allow multiple
- Remember state in localStorage

#### 2.3 Shape Items

**Display:**
- Small SVG preview (48x48px) of the shape
- Shape name on hover (tooltip)
- Drag handle indicator

**Drag & Drop:**
```typescript
// When dragged to editor
const insertSnippet = (shape: Shape, position: number) => {
  const snippet = generateShapeSnippet(shape);
  insertTextAtPosition(editor, snippet, position);
  // Example: "node N1 { shape: resistor, label: \"R1\" }\n"
};

// Shape snippet templates
const shapeSnippets = {
  resistor: 'node R1 { shape: resistor, label: "R1", value: "1kΩ" }',
  capacitor: 'node C1 { shape: capacitor, label: "C1", value: "10μF" }',
  class: 'node MyClass { shape: class, label: "MyClass" }',
  // ... etc
};
```

**Accessibility:**
- Keyboard navigation (Tab, Arrow keys)
- Enter/Space to "activate" (adds at cursor position)
- Screen reader announces shape name and category

---

### 3. Code Editor Component

#### 3.1 CodeMirror Integration

**Dependencies:**
```json
{
  "dependencies": {
    "@codemirror/state": "^6.4.1",
    "@codemirror/view": "^6.34.0",
    "@codemirror/lang-javascript": "^6.2.2",  // Base for custom language
    "@codemirror/commands": "^6.7.0",
    "@codemirror/search": "^6.5.8",
    "@codemirror/autocomplete": "^6.18.1",
    "@codemirror/lint": "^6.8.2",
    "codemirror": "^6.0.1",
    "svelte-codemirror-editor": "^1.4.1"  // Svelte wrapper
  }
}
```

**Features:**
- ✅ Line numbers
- ✅ Syntax highlighting (custom Runiq grammar)
- ✅ Auto-indentation
- ✅ Bracket matching
- ✅ Error underlining (red squiggles)
- ✅ Autocomplete (shape names, properties)
- ✅ Search/replace (Ctrl+F)
- ✅ Minimap (custom extension)

**Custom Runiq Language Definition:**
```typescript
import { parser } from '@runiq/parser-dsl'; // Langium parser
import { LRLanguage, LanguageSupport } from '@codemirror/language';

const runiqLanguage = LRLanguage.define({
  parser: parser,
  languageData: {
    commentTokens: { line: '//' },
    closeBrackets: { brackets: ['(', '[', '{', '"'] }
  }
});

export const runiq = () => new LanguageSupport(runiqLanguage);
```

**Linting Integration:**
```typescript
import { linter } from '@codemirror/lint';

const runiqLinter = linter(view => {
  const diagnostics = [];
  const { errors } = parseRuniqDSL(view.state.doc.toString());
  
  for (const error of errors) {
    diagnostics.push({
      from: error.startOffset,
      to: error.endOffset,
      severity: 'error',
      message: error.message
    });
  }
  
  return diagnostics;
});
```

#### 3.2 Visual Markers (Code ↔ Canvas Linking)

**Gutter Markers:**
```typescript
import { gutter, GutterMarker } from '@codemirror/view';

class ShapeMarker extends GutterMarker {
  constructor(public nodeId: string) {}
  
  toDOM() {
    const marker = document.createElement('div');
    marker.className = 'shape-marker';
    marker.innerHTML = '●'; // Or shape icon
    marker.title = `Shape: ${this.nodeId}`;
    return marker;
  }
}

// Apply markers based on source map
const updateShapeMarkers = (view: EditorView, sourceMap: SourceMap) => {
  const markers = [];
  for (const [line, nodeIds] of sourceMap.lineToNodes) {
    markers.push(new ShapeMarker(nodeIds[0]).range(line));
  }
  return markers;
};
```

**Highlight Active Lines:**
```typescript
// When shape selected in preview
const highlightShapeInEditor = (nodeId: string) => {
  const location = sourceMap.nodeLocations.get(nodeId);
  if (location) {
    editorView.dispatch({
      effects: [
        EditorView.scrollIntoView(location.startLine),
        highlightEffect.of([{
          from: location.startLine,
          to: location.endLine,
          class: 'cm-shape-highlight'
        }])
      ]
    });
  }
};
```

#### 3.3 Tab Bar (Multiple Diagrams)

**Tab Structure:**
```typescript
interface DiagramTab {
  id: string;
  name: string;
  code: string;
  isDirty: boolean;  // Unsaved changes
  lastSaved: Date | null;
}

// Store
const tabs = writable<DiagramTab[]>([
  { id: '1', name: 'diagram1.runiq', code: '', isDirty: false, lastSaved: null }
]);

const activeTabId = writable<string>('1');
```

**Tab UI:**
```
[ diagram1.runiq * ] [ diagram2.runiq ] [ + ]
     ↑ active           ↑ saved          ↑ new tab
     * = dirty
```

**Actions:**
- Click tab to switch
- `×` button to close (with unsaved warning)
- `+` button to create new tab
- Middle-click to close
- Ctrl+Tab to cycle tabs
- Ctrl+W to close active tab

#### 3.4 Minimap

**Implementation:**
```typescript
// CodeMirror minimap extension
import { ViewPlugin, EditorView } from '@codemirror/view';

const minimapPlugin = ViewPlugin.fromClass(class {
  constructor(view: EditorView) {
    this.createMinimap(view);
  }
  
  createMinimap(view: EditorView) {
    // Render scaled-down version of code
    // Show viewport indicator
    // Click to jump to location
  }
});
```

**Position**: Right side of editor panel (like VSCode)

---

### 4. Preview Component

#### 4.1 SVG Canvas

**Rendering:**
```typescript
// Use @runiq/renderer-svg
import { renderSVG } from '@runiq/renderer-svg';

$: svg = layoutResult ? renderSVG(layoutResult) : lastValidSvg;
```

**Interactivity:**
```typescript
// Click to select shape
const handleShapeClick = (event: MouseEvent) => {
  const target = event.target as SVGElement;
  const nodeId = target.getAttribute('data-node-id');
  
  if (nodeId) {
    selectedNode.set(nodeId);
    highlightShapeInEditor(nodeId);
  }
};

// Hover to preview
const handleShapeHover = (event: MouseEvent) => {
  const target = event.target as SVGElement;
  const nodeId = target.getAttribute('data-node-id');
  
  if (nodeId) {
    previewShapeInEditor(nodeId); // Temporary highlight
  }
};
```

#### 4.2 Pan & Zoom

**Library**: Use `panzoom` or `d3-zoom`

```typescript
import Panzoom from '@panzoom/panzoom';

const initPanZoom = (element: HTMLElement) => {
  const panzoom = Panzoom(element, {
    maxScale: 5,
    minScale: 0.1,
    step: 0.1,
    canvas: true
  });
  
  // Mouse wheel to zoom
  element.addEventListener('wheel', panzoom.zoomWithWheel);
  
  return panzoom;
};
```

**Controls:**
- Mouse wheel: Zoom in/out
- Middle-mouse drag: Pan
- Ctrl + scroll: Zoom
- Reset button: Fit to view

#### 4.3 Error Overlay

**Behavior:**
- Show last valid diagram
- Overlay semi-transparent error panel
- Display parse error message
- "Fix in Editor" button that focuses error line

```svelte
{#if parseStatus === 'error' && lastValidSvg}
  <div class="preview-container">
    {@html lastValidSvg}
    
    <div class="error-overlay">
      <div class="error-card">
        <h3>⚠️ Parsing Error</h3>
        <p>{errors[0].message}</p>
        <p>Line {errors[0].line}, Column {errors[0].column}</p>
        <button on:click={focusError}>Fix in Editor →</button>
      </div>
    </div>
  </div>
{/if}
```

#### 4.4 Status Indicator

**Bottom of preview panel:**
- ✅ "Parsed successfully"
- ⏳ "Parsing..." (with spinner)
- ❌ "Parse error" (with error count)

---

## 💾 Storage & Persistence

### localStorage Schema

```typescript
interface StorageSchema {
  // Current active work
  currentDiagram: {
    code: string;
    tabId: string;
    cursorPosition: number;
  };
  
  // All open tabs
  openTabs: DiagramTab[];
  
  // Saved diagram history (rolling, max 20)
  history: DiagramHistoryEntry[];
  
  // User preferences
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    panelSizes: [number, number, number]; // [toolbox, editor, preview]
    autoSave: boolean;
    autoSaveInterval: number; // seconds
    expandedCategories: string[];
    minimap: boolean;
  };
}

interface DiagramHistoryEntry {
  id: string;
  name: string;
  code: string;
  timestamp: Date;
  thumbnail?: string; // Base64 PNG preview
}
```

### Auto-Save Strategy

```typescript
// Debounced auto-save every 2 seconds
const autoSave = debounce(() => {
  const currentState = get(editorState);
  
  localStorage.setItem('runiq:current', JSON.stringify({
    code: currentState.code,
    tabId: get(activeTabId),
    cursorPosition: currentState.cursorPosition
  }));
  
  lastSaved.set(new Date());
}, 2000);

// Watch code changes
code.subscribe(() => {
  isDirty.set(true);
  autoSave();
});
```

### Manual Save (History)

```typescript
// When user explicitly saves (Ctrl+S)
const saveToHistory = (name: string, code: string) => {
  const history = getHistoryFromStorage();
  
  const entry: DiagramHistoryEntry = {
    id: generateId(),
    name,
    code,
    timestamp: new Date(),
    thumbnail: generateThumbnail(svg) // Optional
  };
  
  // Add to beginning, keep only 20 most recent
  history.unshift(entry);
  if (history.length > 20) {
    history.pop();
  }
  
  localStorage.setItem('runiq:history', JSON.stringify(history));
  isDirty.set(false);
};
```

### Export/Import

**Export .runiq file:**
```typescript
const exportRuniq = (name: string, code: string) => {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.runiq`;
  a.click();
  URL.revokeObjectURL(url);
};
```

**Import .runiq file:**
```typescript
const importRuniq = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const code = e.target?.result as string;
    
    // Create new tab with imported content
    createTab({
      id: generateId(),
      name: file.name,
      code,
      isDirty: false,
      lastSaved: new Date()
    });
  };
  reader.readAsText(file);
};
```

---

## ⌨️ Keyboard Shortcuts

**Global:**
- `Ctrl+S`: Save to history
- `Ctrl+E`: Export (opens menu)
- `Ctrl+O`: Import .runiq file
- `Ctrl+N`: New diagram (new tab)
- `Ctrl+W`: Close current tab
- `Ctrl+Tab`: Next tab
- `Ctrl+Shift+Tab`: Previous tab
- `Ctrl+,`: Open settings
- `/`: Focus toolbox search
- `Ctrl+B`: Toggle toolbox visibility

**Editor:**
- `Ctrl+F`: Find
- `Ctrl+H`: Find & replace
- `Ctrl+D`: Select next occurrence
- `Ctrl+/`: Toggle line comment
- `Ctrl+]`: Indent
- `Ctrl+[`: Outdent
- `Ctrl+Z`: Undo
- `Ctrl+Shift+Z`: Redo

**Preview:**
- `Ctrl++`: Zoom in
- `Ctrl+-`: Zoom out
- `Ctrl+0`: Reset zoom
- `Space+Drag`: Pan (like design tools)

---

## ♿ Accessibility

### Keyboard Navigation
- `Tab`: Navigate between panels
- `Arrow keys`: Navigate within toolbox
- `Enter/Space`: Activate/select items
- Focus indicators on all interactive elements

### Screen Reader Support
- ARIA labels on all interactive elements
- Live region announcements for parse status
- Descriptive alt text for shapes
- Semantic HTML structure

### Visual Accessibility
- High contrast mode support
- Minimum 4.5:1 contrast ratios
- Focus indicators (2px outline)
- Resizable text (respect browser zoom)
- No color-only indicators (use icons + text)

### Touch Support (Tablet)
- Touch-friendly tap targets (44x44px minimum)
- Pinch to zoom in preview
- Two-finger pan in preview
- Long-press for context menus

---

## 🎨 UI/UX Design

### Color Palette (TBD - following Tailwind)
```css
/* Light theme */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--border: #e5e7eb;
--text-primary: #111827;
--text-secondary: #6b7280;
--accent: #3b82f6;
--success: #10b981;
--error: #ef4444;

/* Dark theme */
--bg-primary: #1f2937;
--bg-secondary: #111827;
--border: #374151;
--text-primary: #f9fafb;
--text-secondary: #9ca3af;
--accent: #60a5fa;
--success: #34d399;
--error: #f87171;
```

### Typography
- **Headers**: Inter, system-ui
- **Code**: Fira Code, JetBrains Mono, Consolas, monospace
- **Body**: Inter, system-ui

### Spacing
- Panel padding: 16px
- Component gaps: 8px, 12px, 16px
- Border radius: 4px (subtle), 8px (cards)

---

## 📊 Performance Targets

### Parsing
- ✅ Parse within 300ms for diagrams <100 nodes
- ✅ Debounce parsing by 300ms after typing stops
- ✅ Show "Parsing..." indicator for >500ms operations

### Rendering
- ✅ Preview updates within 500ms of parse completion
- ✅ Smooth 60fps pan/zoom
- ✅ No UI blocking during parse/layout

### Storage
- ✅ Auto-save within 100ms
- ✅ History load <50ms
- ✅ Export/import <200ms

---

## 🚀 MVP Implementation Plan

### Phase 1: Core Layout (Week 1)
1. ✅ Set up SvelteKit routes and layout
2. ✅ Create three-panel responsive layout
3. ✅ Implement panel resizing (splitters)
4. ✅ Header with branding
5. ✅ Basic styling with Tailwind

### Phase 2: Code Editor (Week 2)
1. ✅ Integrate CodeMirror
2. ✅ Add line numbers and basic syntax highlighting
3. ✅ Implement tab bar for multiple diagrams
4. ✅ Add minimap (basic version)
5. ✅ Connect to Runiq parser
6. ✅ Error underlining

### Phase 3: Toolbox (Week 2)
1. ✅ Create accordion categories
2. ✅ Populate with all 71 shapes
3. ✅ Add search/filter
4. ✅ Implement drag to editor
5. ✅ Shape snippet generation

### Phase 4: Preview (Week 3)
1. ✅ SVG rendering integration
2. ✅ Pan/zoom controls
3. ✅ Click to select shape
4. ✅ Code ↔ canvas highlighting
5. ✅ Error overlay
6. ✅ Parsing status indicator

### Phase 5: Storage & Export (Week 3)
1. ✅ localStorage integration
2. ✅ Auto-save (2 second debounce)
3. ✅ History (rolling 20 entries)
4. ✅ Export SVG/PNG
5. ✅ Export/import .runiq files

### Phase 6: Polish (Week 4)
1. ✅ Keyboard shortcuts
2. ✅ Accessibility improvements
3. ✅ Error handling
4. ✅ Loading states
5. ✅ Documentation
6. ✅ Testing (E2E with Playwright)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- State management (stores)
- Parser service
- Storage service
- Export service
- Utility functions

### Component Tests (Vitest + Svelte Testing Library)
- Toolbox interactions
- Tab management
- Error handling
- Keyboard shortcuts

### E2E Tests (Playwright)
- Complete user flows
- Drag and drop
- Export/import
- Multi-tab workflow
- Persistence across refresh

---

## 📝 Future Enhancements (Post-MVP)

### Phase 2 Features
- ✅ Canvas editing (drag shapes in preview)
- ✅ Manual positioning support
- ✅ Property panel
- ✅ Context menu (right-click)
- ✅ Advanced undo/redo
- ✅ Template library integration (Issue #8)

### Phase 3 Features
- ✅ Dark/light theme toggle
- ✅ Mobile responsive layout
- ✅ Error panel (below editor)
- ✅ Advanced search (regex, case-sensitive)
- ✅ Version history UI

### Phase 4 Features
- ✅ Backend for sharing (shareable links)
- ✅ Collaboration (real-time editing)
- ✅ AI assistant integration
- ✅ Advanced accessibility features
- ✅ Internationalization (i18n)

---

## ✅ Success Criteria

**MVP is complete when:**
1. ✅ User can create diagrams using DSL in editor
2. ✅ Live preview updates automatically
3. ✅ Drag shapes from toolbox to editor
4. ✅ Multiple diagrams in tabs
5. ✅ Auto-save to localStorage
6. ✅ Export to SVG/PNG/.runiq
7. ✅ Import .runiq files
8. ✅ Keyboard shortcuts work
9. ✅ Accessible via keyboard
10. ✅ Error handling is graceful
11. ✅ Documentation is complete
12. ✅ E2E tests pass

---

## 📚 References

- **Mermaid Live Editor**: https://mermaid.live (inspiration, not copying UI)
- **CodeMirror 6**: https://codemirror.net/
- **SvelteKit**: https://kit.svelte.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **ELK Layout**: https://eclipse.dev/elk/
- **Accessibility**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Status**: Ready for Review  
**Next Step**: Get approval and start implementation!
