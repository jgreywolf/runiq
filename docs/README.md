# VitePress Documentation Site

This directory contains the VitePress documentation site for Runiq.

## Quick Start

```bash
# Start development server
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview
```

## Structure

```
docs/
├── .vitepress/
│   └── config.ts          # Site configuration
├── public/
│   └── examples/          # Static assets (SVG images)
├── guide/
│   ├── what-is-runiq.md   # Introduction
│   ├── getting-started.md # Installation & setup
│   └── quick-start.md     # Tutorial
├── examples/
│   ├── index.md           # Examples overview
│   └── flowcharts.md      # Flowchart examples
├── reference/
│   └── shapes.md          # Shape reference (54 shapes)
└── index.md               # Home page
```

## Configuration

The site is configured in `.vitepress/config.ts`:

- **Navigation**: Guide, Examples, Reference, Export, Version dropdowns
- **Sidebar**: Context-aware sidebar for each section
- **Theme**: GitHub light/dark with line numbers
- **Search**: Local search enabled
- **Edit Links**: GitHub edit links enabled

## Adding Content

### New Guide Page

Create a file in `docs/guide/your-page.md` and add it to the sidebar in `.vitepress/config.ts`:

```typescript
{
  text: 'Guide',
  items: [
    { text: 'Your Page', link: '/guide/your-page' }
  ]
}
```

### New Example

Create a file in `docs/examples/your-example.md` and add it to the sidebar.

### Adding SVG Images

Place SVG files in `docs/public/examples/` and reference them in markdown:

```markdown
![Description](/examples/your-image.svg)
```

## Syntax Highlighting

Currently, VitePress doesn't have syntax highlighting for Runiq DSL. Code blocks will display as plain text. To add syntax highlighting:

1. Create a TextMate grammar file for Runiq
2. Add it to `.vitepress/config.ts` under `markdown.languages`

## Features

- ✅ Responsive design
- ✅ Dark mode support
- ✅ Local search
- ✅ Edit on GitHub links
- ✅ Last updated timestamps
- ✅ Mobile-friendly navigation
- ✅ Fast hot module reload (HMR)

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set build command: `pnpm docs:build`
4. Set output directory: `docs/.vitepress/dist`

### Netlify

1. Push to GitHub
2. Import project in Netlify
3. Set build command: `pnpm docs:build`
4. Set publish directory: `docs/.vitepress/dist`

### GitHub Pages

```bash
# Build
pnpm docs:build

# Deploy to gh-pages branch
cd docs/.vitepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:jgreywolf/runiq.git main:gh-pages
```

## Future Enhancements

- [ ] Add Runiq syntax highlighting
- [ ] Integrate SvelteKit editor for live diagram editing
- [ ] Add interactive playground
- [ ] Add more examples for all diagram types
- [ ] Add API documentation pages
- [ ] Add video tutorials
- [ ] Add searchable shape gallery
- [ ] Add diagram template gallery

## Notes

- VitePress files in `docs/public/` are served at the root path
- Markdown files are automatically converted to HTML pages
- Front matter in markdown controls page layout and metadata
- The site uses Vue 3 under the hood for interactivity
