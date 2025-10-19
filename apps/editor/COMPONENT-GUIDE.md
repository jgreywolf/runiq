# Shadcn-Svelte Component Usage Guide

## Quick Reference for Runiq Editor

### 🎯 Import Path Pattern

```typescript
import { ComponentName } from '$lib/components/ui/component-name';
```

---

## Week 2 Components

### 1. Accordion (Toolbox Categories)

**Use Case**: Collapsible shape categories in toolbox

```svelte
<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
</script>

<Accordion.Root class="w-full">
	<Accordion.Item value="general">
		<Accordion.Trigger>General Shapes</Accordion.Trigger>
		<Accordion.Content>
			<!-- Shape cards go here -->
			<div class="grid grid-cols-2 gap-2 p-2">
				<!-- Shape previews -->
			</div>
		</Accordion.Content>
	</Accordion.Item>

	<Accordion.Item value="software">
		<Accordion.Trigger>Software Diagrams</Accordion.Trigger>
		<Accordion.Content>
			<!-- Software shapes -->
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
```

### 2. Tabs (Multiple Diagrams)

**Use Case**: Switch between open diagrams

```svelte
<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<Tabs.Root value="diagram-1">
	<Tabs.List>
		<Tabs.Trigger value="diagram-1">Auth Flow</Tabs.Trigger>
		<Tabs.Trigger value="diagram-2">Data Pipeline</Tabs.Trigger>
		<Tabs.Trigger value="diagram-3">+ New</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="diagram-1">
		<!-- CodeMirror editor for diagram 1 -->
	</Tabs.Content>

	<Tabs.Content value="diagram-2">
		<!-- CodeMirror editor for diagram 2 -->
	</Tabs.Content>
</Tabs.Root>
```

### 3. Input (Search Bar)

**Use Case**: Filter shapes in toolbox

```svelte
<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let searchQuery = $state('');
</script>

<div class="space-y-2">
	<Label for="shape-search">Search shapes</Label>
	<Input id="shape-search" type="text" placeholder="Search shapes..." bind:value={searchQuery} />
</div>
```

### 4. Button (Actions)

**Use Case**: All buttons throughout the UI

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<!-- Primary action -->
<Button class="bg-runiq-500 hover:bg-runiq-600">Export Diagram</Button>

<!-- Secondary action -->
<Button variant="outline">Cancel</Button>

<!-- Destructive action -->
<Button variant="destructive">Delete Diagram</Button>

<!-- Icon button -->
<Button variant="ghost" size="icon">
	<svg><!-- icon --></svg>
</Button>
```

### 5. Tooltip (Help Text)

**Use Case**: Show shape names, keyboard shortcuts

```svelte
<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<div class="shape-card">
			<!-- Shape SVG preview -->
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Rectangle - Click to insert</p>
		<kbd class="text-xs">Ctrl+R</kbd>
	</Tooltip.Content>
</Tooltip.Root>
```

---

## Week 3 Components

### 6. Dropdown Menu (Export Options)

**Use Case**: Export format selection

```svelte
<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button class="bg-runiq-500 hover:bg-runiq-600">Export</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Item on:click={exportSvg}>Export as SVG</DropdownMenu.Item>
		<DropdownMenu.Item on:click={exportPng}>Export as PNG</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={exportRuniq}>Save .runiq File</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

### 7. Popover (Shape Properties)

**Use Case**: Edit shape properties when selected

```svelte
<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<Popover.Root>
	<Popover.Trigger>
		<!-- Selected shape in preview -->
	</Popover.Trigger>

	<Popover.Content>
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="shape-label">Label</Label>
				<Input id="shape-label" value="My Shape" />
			</div>

			<div class="space-y-2">
				<Label for="shape-fill">Fill Color</Label>
				<Input id="shape-fill" type="color" value="#5a819e" />
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
```

### 8. Badge (Status Indicators)

**Use Case**: Parsing status, error count

```svelte
<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
</script>

<!-- Success status -->
<Badge variant="default" class="bg-success">✓ Ready</Badge>

<!-- Warning -->
<Badge variant="outline" class="border-warning text-warning">⚠ 2 Warnings</Badge>

<!-- Error -->
<Badge variant="destructive">✗ 3 Errors</Badge>

<!-- Parsing -->
<Badge variant="secondary">⟳ Parsing...</Badge>
```

### 9. Select (Layout Engine)

**Use Case**: Choose layout algorithm

```svelte
<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	let selectedEngine = $state({ value: 'elk', label: 'ELK' });
</script>

<Select.Root bind:selected={selectedEngine}>
	<Select.Trigger>
		<Select.Value placeholder="Layout Engine" />
	</Select.Trigger>

	<Select.Content>
		<Select.Item value="elk">ELK (Recommended)</Select.Item>
		<Select.Item value="dagre">Dagre</Select.Item>
		<Select.Item value="manual">Manual</Select.Item>
	</Select.Content>
</Select.Root>
```

---

## Week 4 Components

### 10. Dialog (Settings Modal)

**Use Case**: Application settings

```svelte
<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="ghost" size="icon">
			<!-- Settings icon -->
		</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Editor Settings</Dialog.Title>
			<Dialog.Description>Customize your Runiq editor experience</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div class="flex items-center justify-between">
				<Label for="dark-mode">Dark Mode</Label>
				<Switch id="dark-mode" />
			</div>

			<div class="flex items-center justify-between">
				<Label for="auto-save">Auto-save</Label>
				<Switch id="auto-save" checked />
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline">Cancel</Button>
			<Button class="bg-runiq-500">Save Changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
```

### 11. Switch (Feature Toggles)

**Use Case**: Enable/disable features

```svelte
<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';

	let autoSave = $state(true);
</script>

<div class="flex items-center space-x-2">
	<Switch id="auto-save" bind:checked={autoSave} />
	<Label for="auto-save">Auto-save every 2 seconds</Label>
</div>
```

### 12. Checkbox (Settings Options)

**Use Case**: Multiple selection options

```svelte
<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let showGrid = $state(true);
	let showMinimap = $state(true);
</script>

<div class="space-y-2">
	<div class="flex items-center space-x-2">
		<Checkbox id="grid" bind:checked={showGrid} />
		<Label for="grid">Show grid</Label>
	</div>

	<div class="flex items-center space-x-2">
		<Checkbox id="minimap" bind:checked={showMinimap} />
		<Label for="minimap">Show minimap</Label>
	</div>
</div>
```

### 13. Separator (Visual Dividers)

**Use Case**: Separate sections in menus/settings

```svelte
<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
</script>

<div class="space-y-4">
	<div>Section 1</div>
	<Separator />
	<div>Section 2</div>
	<Separator orientation="vertical" />
	<!-- For horizontal layouts -->
	<div>Section 3</div>
</div>
```

---

## Customization with Brand Colors

All components can be customized with Tailwind classes:

```svelte
<!-- Primary button with brand color -->
<Button class="bg-runiq-500 text-white hover:bg-runiq-600">Export</Button>

<!-- Badge with brand color -->
<Badge class="border-runiq-300 bg-runiq-100 text-runiq-700">Active</Badge>

<!-- Input with brand focus -->
<Input class="focus-visible:ring-runiq-500" />

<!-- Tab with brand active state -->
<Tabs.Trigger class="data-[state=active]:bg-runiq-500 data-[state=active]:text-white">
	Diagram 1
</Tabs.Trigger>
```

---

## Accessibility Features

All components include:

- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ High contrast mode compatibility

**Example keyboard shortcuts:**

- `Tab` - Navigate between elements
- `Enter/Space` - Activate buttons
- `Escape` - Close dialogs/dropdowns
- `Arrow keys` - Navigate lists/tabs
- `Home/End` - Jump to first/last item

---

## Component File Locations

```
src/lib/components/ui/
├── accordion/
│   ├── accordion.svelte
│   ├── accordion-content.svelte
│   ├── accordion-item.svelte
│   ├── accordion-trigger.svelte
│   └── index.ts
├── badge/
│   ├── badge.svelte
│   └── index.ts
├── button/
│   ├── button.svelte
│   └── index.ts
├── checkbox/
│   ├── checkbox.svelte
│   └── index.ts
├── dialog/
│   ├── dialog.svelte
│   ├── dialog-content.svelte
│   ├── dialog-description.svelte
│   ├── dialog-footer.svelte
│   ├── dialog-header.svelte
│   ├── dialog-title.svelte
│   └── index.ts
├── dropdown-menu/
│   └── [multiple files]
├── input/
│   ├── input.svelte
│   └── index.ts
├── label/
│   ├── label.svelte
│   └── index.ts
├── popover/
│   └── [multiple files]
├── select/
│   └── [multiple files]
├── separator/
│   ├── separator.svelte
│   └── index.ts
├── switch/
│   ├── switch.svelte
│   └── index.ts
├── tabs/
│   └── [multiple files]
└── tooltip/
    └── [multiple files]
```

---

## Tips

1. **Import Pattern**: Always use the barrel export from `index.ts`
2. **Customization**: Add Tailwind classes via the `class` prop
3. **Composition**: Combine primitives to build complex UIs
4. **Type Safety**: All components are fully typed
5. **Variants**: Use built-in variants (default, outline, ghost, etc.)
6. **Size**: Most components support size prop (sm, default, lg)

---

**Ready to build!** 🚀 All 14 components are installed and ready to use in the Runiq Editor.
