# File Tree Diagrams

File tree diagrams are useful for showing repository structure, deployment
packages, configuration layouts, and nested document hierarchies without
switching to a separate profile.

Runiq supports first-pass file tree diagrams inside the standard `diagram`
profile using a root container plus `@folder` and `@file` shapes.

## Core Shapes

- `@fileTree`
- `@folder`
- `@file`

## Basic Example

```runiq
diagram "Repository Layout" {
  container repo "runiq" as @fileTree {
    container apps "apps" as @folder {
      shape editor as @folder label:"editor"
      shape studio as @folder label:"studio"
    }

    container packages "packages" as @folder {
      shape core as @folder label:"core"
      shape parser as @folder label:"parser-dsl"
    }

    shape readme as @file label:"README.md"
    shape pnpm as @file label:"pnpm-lock.yaml"
  }
}
```

## When To Use It

Use file tree diagrams when you want to show:

- monorepo structure
- application/module boundaries
- deployment package contents
- configuration file placement
- documentation hierarchies

## Modeling Tips

- Use `@fileTree` for the root boundary.
- Use `@folder` on containers when you want nested groups of children.
- Use `@folder` on simple shapes when you just want a folder leaf.
- Use `@file` for document or source-file leaves.
- Use `collapsed:true` on a folder container to show only the folder row and hide its children.

## Collapsed Folders

```runiq
diagram "Compact Tree" {
  container repo "runiq" as @fileTree {
    container src "src" as @folder collapsed:true {
      shape routes as @folder label:"routes"
      shape lib as @folder label:"lib"
    }

    shape readme as @file label:"README.md"
  }
}
```

## Styling

Like other diagram-profile shapes, file tree shapes support standard styling:

```runiq
diagram "Styled Tree" {
  container repo "studio" as @fileTree fillColor:"#f8fafc" strokeColor:"#94a3b8" {
    container src "src" as @folder fillColor:"#fef3c7" strokeColor:"#b45309" {
      shape routes as @folder label:"routes"
    }

    shape packageJson as @file label:"package.json" strokeColor:"#64748b"
  }
}
```

## Related

- [Containers](./containers)
- [Architecture Diagrams](./architecture-diagrams)
- [Shapes Reference](../reference/shapes)
