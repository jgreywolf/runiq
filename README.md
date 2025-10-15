# Runiq

A markdown-friendly diagram DSL with JSON twin that compiles to standards-compliant SVG.

## Features

- **Two inputs, one AST**: Human-friendly DSL and 1:1 JSON format
- **Pure SVG output**: No HTML hacks, embed-safe for PowerPoint/Keynote/Google Slides
- **Pluggable system**: Extensible shapes, icons, layout engines, and themes
- **SvelteKit editor**: Monaco code editor with real-time preview
- **Standards compliant**: SVG 1.1/2.0 friendly with accessibility support

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start the editor
pnpm dev
```

## Packages

- `@runiq/core` - Core AST types, registries, and interfaces
- `@runiq/parser-dsl` - DSL parser powered by **Langium** with built-in LSP support
- `@runiq/io-json` - JSON ↔ AST conversion
- `@runiq/layout-base` - Layout engine interfaces and adapters
- `@runiq/renderer-svg` - SVG renderer
- `@runiq/icons-fontawesome` - Font Awesome icon provider
- `@runiq/cli` - Command line interface

## Parser Technology

Runiq uses **[Langium](https://langium.org/)** for parsing - a modern TypeScript language engineering framework with:

✅ **Built-in LSP support** - Ready for VS Code extensions and Monaco editor  
✅ **Auto-generated typed AST** - TypeScript types derived from grammar  
✅ **Declarative grammar** - Clean `.langium` syntax  
✅ **Production-proven** - Used by Mermaid.js for new diagrams  
✅ **Active maintenance** - Regular updates from TypeFox/Eclipse

See [docs/langium-migration.md](./docs/langium-migration.md) for migration details.

## Apps

- `editor` - SvelteKit editor with Monaco
- `playground` - Simple demo

## Example DSL

```runiq
diagram "Auth Flow" direction: LR

style default fill:#f7f7ff stroke:#444 font:Inter fontSize:14
style decision fill:#fff7e6 stroke:#aa7700

shape User     as @actor   label:"Visitor" icon:fa/user
shape Landing  as @rounded label:"Landing Page"
shape Check    as @rhombus label:"Signed up?" style:decision
shape Welcome  as @hex     label:"Welcome"

User -> Landing : visits
Landing -> Check
Check[yes] -> Welcome
Check[no]  -> Pricing : reads
```

## License

MIT
