---
title: Editor Guide
description: What the Runiq Editor can do today, what it cannot do yet, and recommended workflows.
lastUpdated: 2026-03-09
---

# Editor Guide

The Runiq Editor is a browser-based authoring app for writing DSL, previewing diagrams, and exporting output.

## What The Editor Does Well

- Create new diagrams by profile from the **New Diagram** dialog.
- Edit DSL and data side-by-side with a live preview.
- Parse, lint, and show inline errors/warnings while you type.
- Browse profile-aware shapes and insert snippets from the toolbox.
- Use the sample browser with global search across sample categories.
- Pan/zoom/select elements on the visual canvas.
- Visual editing for `diagram` profile:
  - `Select` mode for element selection and property editing.
  - `Connect` mode for creating edges and quick-connect node creation.
  - Canvas toolbar actions: Add Shape, Add Container, Add Image, Add Text.
- Element flyout toolbar for selected nodes/edges:
  - Change Shape
  - Styles (assign style refs, create/edit/delete styles)
  - Border (stroke color/width/line style)
  - Fill (node only)
  - Text (node only)
  - Icon (node only, searchable icon picker)
- Export directly to `SVG` and `PNG`.
- Auto-save your DSL in browser storage and restore it on reload.
- Open **Settings** to configure autosave behavior, default layout strategy, canvas mode, and default diagram theme.
  - Layout strategy options are shown only for profiles that support automatic layout selection.
- Canvas context menus (empty-canvas and element) with flyout submenus for insert actions and theme selection.
- Undo/redo code changes from the app-level key handler (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+Shift+Z`).
- Visual editing support for `sequence` profile:
  - Add Participant, Add Message, Add Note from the main canvas toolbar.
  - Use the floating sequence toolbar for **Label** and **Details** editing.
  - Double-click sequence notes for inline label editing.
  - Drag message endpoints to retarget `from`/`to` participant.
  - Drag participants and messages to reorder (with insertion guides).

## What The Editor Cannot Do Yet

- Full visual-first authoring for every DSL feature. Advanced constructs still require direct DSL edits.
- Full visual editing parity across all profiles. Most interactive canvas editing currently targets `diagram` profile.
- Multi-file project management. The editor currently works as a single-document session.
- Real-time collaboration or shared cursors.
- In-editor export to all backend formats (SPICE, Verilog, LaTeX, Simulink). Use CLI/packages for those.
- Uniform toolbox behavior across every profile. Some profiles are sample-driven for faster starts.

## Recommended Workflow

1. Start from **Sample Browser** or **New Diagram** profile template.
2. Use the **Syntax** tab for structure and advanced options.
3. Use the **Data** tab for data-aware diagrams (JSON/CSV), then map fields in DSL.
4. Refine styling from the canvas and style panel.
5. Export as `SVG` for source-of-truth assets, then `PNG` if needed for docs/slides.

## Keyboard And Interaction Notes

- App-level undo/redo works from the main editor page.
- In `diagram` profile, canvas mode is context-aware:
  - `Select` mode: standard selection/edit interactions.
  - `Connect` mode: edge creation interactions; toolbar actions remain available.
- In `sequence` profile, canvas editing uses `Select` mode only (no dedicated connect mode toggle).
- Sequence endpoint retargeting:
  - Select a message, then drag blue endpoint handles.
  - Lifeline targets are highlighted while dragging.
  - Drop on a participant/lifeline to retarget the message endpoint.
- Quick-connect behavior in connect mode:
  - Hover a node to show directional handles.
  - Click a handle to connect to an existing directional target (auto) or create a new node.
  - Hold `Alt` to force new node creation.
  - Hold `Shift` to force existing-node targeting.
- If DSL parse errors are present, canvas mode is forced back to `Select`.
- Additional shortcuts shown in Help are evolving; prefer toolbar actions when in doubt.

## Visual Canvas Details

### Global Canvas Toolbar

- `Select Mode`: default editing mode.
- `Connect Mode`: create edges by drag or quick-connect handles.
- `Add Shape`: insert quick node snippets.
- `Add Container`: insert container snippets/templates.
- `Add Image`: inserts `@image` node using `data:[{ src:"..." }]`.
- `Add Text`: inserts `@textBlock` with default left text alignment.
- `Theme`: applies/updates `theme <id>` in current profile block.
  - Theme insertion is anchored to the first line after the active profile opening `{` (not cursor location).
- `Zoom In / Zoom Out / Reset / Fit`.

### Context Menus

- Right-click empty canvas to open profile-aware canvas actions.
- Right-click an element to open element actions (edit/duplicate/delete and profile-specific actions).
- Items that open a flyout submenu show a right-arrow indicator.
- Theme picker opens as a flyout with visual previews:
  - Theme name/id
  - Palette swatches
  - Small sample chip for quick contrast/readability cues

### Selection Toolbar (Diagram Profile)

- Appears near the selected element (node or edge midpoint), not fixed to the top.
- Closes when selection is cleared or when clicking outside the toolbar/popovers.
- Panel actions:
  - `Change Shape`: convert selected node shape.
  - `Styles`: apply a style reference or manage style declarations.
  - `Border`: stroke color, width, line style (`solid`, `dashed`, `dotted`, `none`).
  - `Fill`: node fill color.
  - `Text`: text color, size, font family.
  - `Icon`: searchable picker for supported `brand/...` and `iconify/...` tokens.
  - `Delete`: remove selected element.

### Sequence Canvas (Current)

- Toolbar actions:
  - `Add Participant`
  - `Add Message`
  - `Add Note`
  - `Theme`, zoom controls
- Context menu actions:
  - Sequence element editing is toolbar-first (element context menu is not used).
- Inline edits:
  - Double-click notes to edit note text directly.
- Drag interactions:
  - Drag participants to reorder declaration order.
  - Drag message lines/labels to reorder message statements.
  - Drag message endpoint handles to retarget `from`/`to`.

### Style Precedence

- Effective precedence:
  1. Theme defaults
  2. Style reference (`style:<name>`)
  3. Inline element properties (`fillColor`, `textColor`, etc.)
- Applying a style from the selection toolbar clears existing inline style overrides first, then assigns the style ref.

## Visual Canvas DSL Snippets

### 1. Style Ref + Border Pattern

```runiq
diagram "Styled Node" {
  theme vibrant
  style emphasis strokeColor:"#333333" strokeWidth:2 lineStyle:"dashed" textColor:"#111111"

  shape id1 as @rectangle label:"Label" style:emphasis
}
```

### 2. Connect Mode Result (Node + Edge Creation)

```runiq
diagram "Quick Connect" {
  shape id1 as @rectangle label:"Start"
  shape id2 as @rectangle label:"New Node"

  id1 -> id2
}
```

### 3. Image Node

```runiq
diagram "Image Example" {
  shape img1 as @image label:"Reference" data:[{ src:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6" }]
}
```

### 4. Icon Assignment

```runiq
diagram "Icon Example" {
  shape svc as @roundedRectangle label:"API" icon:brand/github_actions
  shape db as @rectangle label:"DB" icon:iconify/mdi_database

  svc -> db
}
```

### 5. Style Ref + Inline Override Precedence

```runiq
diagram "Precedence Example" {
  style base fillColor:"#dbeafe" strokeColor:"#1d4ed8" textColor:"#0f172a"

  shape a as @rectangle label:"Style Only" style:base
  shape b as @rectangle label:"Inline Override" style:base fillColor:"#fee2e2"
}
```

In this example, `b` keeps `base` stroke/text but overrides fill via inline `fillColor`.

## Related Pages

- [Getting Started](/guide/getting-started)
- [Troubleshooting](/guide/troubleshooting)
- [Profiles](/guide/profiles)
- [Web SDK Integration](/guide/web-sdk)
