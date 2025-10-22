# Shadcn-Svelte Integration

## Setup Complete ✅

### Installed Dependencies

- `clsx@2.1.1` - Utility for constructing className strings conditionally
- `tailwind-merge@3.3.1` - Merge Tailwind CSS classes without style conflicts
- `tailwind-variants@3.1.1` - Create component variants with Tailwind

### Configuration Files

#### `components.json`

```json
{
	"$schema": "https://shadcn-svelte.com/schema.json",
	"style": "new-york",
	"tailwind": {
		"config": "tailwind.config.js",
		"css": "src/app.css",
		"baseColor": "slate"
	},
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui"
	}
}
```

#### `src/lib/utils.ts`

Utility functions for shadcn components:

- `cn()` - Combines clsx and tailwind-merge for className composition
- `flyAndScale()` - Svelte transition for dropdown/modal animations

### How to Add Components

Use the shadcn-svelte CLI to add components as needed:

```bash
# Add a button component
npx shadcn-svelte@latest add button

# Add a dropdown menu
npx shadcn-svelte@latest add dropdown-menu

# Add a dialog/modal
npx shadcn-svelte@latest add dialog

# Add an accordion
npx shadcn-svelte@latest add accordion

# Add a tabs component
npx shadcn-svelte@latest add tabs

# Add a select/combobox
npx shadcn-svelte@latest add select

# Add a popover
npx shadcn-svelte@latest add popover
```

### Recommended Components for Runiq Editor

#### Week 2 (Toolbox & Editor)

- **Accordion** - For toolbox shape categories
- **Input** - For search/filter bar
- **Tabs** - For multiple diagram tabs
- **Button** - For all action buttons
- **Tooltip** - For shape previews and help text

#### Week 3 (Preview & Interactions)

- **Dropdown Menu** - For export options
- **Popover** - For shape properties
- **Select** - For layout engine selection
- **Badge** - For parsing status indicators

#### Week 4 (Settings & Polish)

- **Dialog** - For settings modal
- **Checkbox** - For settings toggles
- **Label** - For form labels
- **Switch** - For feature toggles
- **Separator** - For visual dividers

### Benefits

1. **Accessibility** - All components follow WCAG 2.1 AA standards
2. **Customizable** - Components use Tailwind and can be modified
3. **Type-safe** - Full TypeScript support
4. **Composable** - Build complex UIs from primitives
5. **Consistent** - Matches our design system (slate base color)

### Integration with Brand Colors

The components will automatically use our brand colors from `app.css`:

- Primary actions: `bg-runiq-500`
- Hover states: `bg-runiq-600`
- Focus rings: `ring-runiq-500`
- Text: `text-runiq-700`

### Usage Example

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';
</script>

<!-- Button with brand colors -->
<Button class="bg-runiq-500 hover:bg-runiq-600">Export Diagram</Button>

<!-- Accordion for toolbox -->
<Accordion>
	<AccordionItem value="general">
		<AccordionTrigger>General Shapes</AccordionTrigger>
		<AccordionContent>
			<!-- Shape cards here -->
		</AccordionContent>
	</AccordionItem>
</Accordion>
```

### Components Installed ✅

All recommended components have been installed to `src/lib/components/ui/`:

1. **accordion/** - Collapsible sections for toolbox categories
2. **badge/** - Status indicators (parsing, errors, warnings)
3. **button/** - All action buttons throughout the UI
4. **checkbox/** - Settings toggles and preferences
5. **dialog/** - Settings modal, export dialog
6. **dropdown-menu/** - Export options, context menus
7. **input/** - Search bar, text inputs
8. **label/** - Form labels for accessibility
9. **popover/** - Shape properties, tooltips with actions
10. **select/** - Layout engine selection, dropdowns
11. **separator/** - Visual dividers between sections
12. **switch/** - Feature toggles (dark mode, auto-save)
13. **tabs/** - Multiple diagram tabs
14. **tooltip/** - Help text, keyboard shortcuts

### Next Steps

1. ✅ Setup complete (dependencies installed, utils created)
2. ✅ All components installed (14 components ready)
3. ⏳ Customize components with brand colors
4. ⏳ Build toolbox with Accordion
5. ⏳ Build tab bar with Tabs
6. ⏳ Add export dropdown with DropdownMenu

### Documentation

- Official Docs: https://shadcn-svelte.com
- Component Examples: https://shadcn-svelte.com/docs/components
- Customization: https://shadcn-svelte.com/docs/theming

---

## Notes

- **Style**: Using "new-york" style (cleaner, more modern than default)
- **Base Color**: Slate (matches our neutral color palette)
- **Location**: Components will be installed to `src/lib/components/ui/`
- **No Runtime**: Components are copied to your project (not a dependency)
- **Editable**: You own the code and can modify as needed
