# C4 Architecture Diagram Examples

This directory contains example C4 model diagrams demonstrating the 4 levels of software architecture visualization.

## About C4 Model

The C4 model (Context, Containers, Components, and Code) is a way to describe and communicate software architecture at different levels of abstraction. Created by Simon Brown.

**Learn more**: [c4model.com](https://c4model.com/)

## Examples

### 1. System Context (`system-context.runiq`)

**Level 1** - Shows how your system fits in the world with external actors and systems.

Features:
- `@c4-person` for external users (Customer)
- `@c4-system` for software systems
- Simple relationships showing system interactions

### 2. Container Diagram (`container-diagram.runiq`)

**Level 2** - Shows the high-level technology choices and how containers communicate.

Features:
- Web container grouping related applications
- `@c4-container` shapes with technology labels (`[React]`, `[Spring Boot]`)
- Multi-line labels using `\n` separator
- Technology/protocol annotations on edges (`[HTTPS]`, `[SQL/TCP]`)

### 3. Component Diagram (`component-diagram.runiq`)

**Level 3** - Shows components within a container.

Features:
- `@c4-component` for code modules/services
- API container showing internal structure
- Component interactions and dependencies

### 4. Microservices Architecture (`microservices.runiq`)

**Practical example** - E-commerce platform with multiple layers.

Features:
- Three containers organized by architectural layer (Frontend, Backend, Data)
- 9 microservices with technology stack labels
- Color-coded containers using `backgroundColor` and `borderColor`
- Horizontal layout (`direction: LR`)

## C4 Shapes

Runiq provides 4 C4 shapes with the official color palette:

| Shape | Description | Color | Usage |
|-------|-------------|-------|-------|
| `@c4-person` | External actor/user | Dark Blue (#08427B) | People, roles, personas |
| `@c4-system` | Software system | Medium Blue (#1168BD) | High-level systems |
| `@c4-container` | Application/Data store | Light Blue (#438DD5) | Web apps, APIs, databases |
| `@c4-component` | Code module | Lightest Blue (#85BBF0) | Services, controllers, modules |

## Usage Tips

### Multi-line Labels

Use `\n` to add technology stacks:

```runiq
shape api as @c4-container label:"API Application\n[Java, Spring Boot]"
```

### Technology on Edges

Add protocols/formats to relationship labels:

```runiq
webapp -API calls [JSON/HTTPS]-> api
api -Reads/Writes [SQL/TCP]-> db
```

### Container Styling

Group related elements with colored containers:

```runiq
container backend "Backend Services" 
  backgroundColor:"#e3f2fd" 
  borderColor:"#1976d2" 
  borderWidth:2 {
  shape service1 as @c4-container label:"Service 1"
  shape service2 as @c4-container label:"Service 2"
}
```

### Recommended Colors

For container boxes, use light complementary colors:

- **Light Blue**: `backgroundColor:"#e3f2fd" borderColor:"#1976d2"` (Backend/Services)
- **Light Pink**: `backgroundColor:"#fce4ec" borderColor:"#c2185b"` (Frontend/UI)
- **Light Purple**: `backgroundColor:"#f3e5f5" borderColor:"#7b1fa2"` (Data/Storage)
- **Light Yellow**: `backgroundColor:"#fff8e1" borderColor:"#f57f17"` (External/Integration)
- **Light Green**: `backgroundColor:"#e8f5e9" borderColor:"#388e3c"` (Messaging/Events)

## Known Limitations

**Nested Containers**: Deep container nesting (container within container) doesn't position correctly yet. Use flat hierarchies with multiple containers at the same level as a workaround.

This is documented as a high priority item and will be addressed in a future update.

## See Also

- [C4 Model Documentation](../../docs/examples/c4-architecture.md) - Complete guide
- [Official C4 Website](https://c4model.com/) - Simon Brown's C4 model
- [Toolbox Samples](../../apps/editor/src/lib/data/toolbox-data.ts) - Editor samples

## Running Examples

To render these examples as SVG:

```bash
# Using the CLI
pnpm -r build
cd packages/cli
pnpm start ../../examples/c4-architecture/system-context.runiq

# Or use the web editor
cd apps/editor
pnpm dev
# Then open http://localhost:5173 and load the .runiq file
```
