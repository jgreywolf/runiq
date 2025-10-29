import type { ShapeDefinition, IconProvider, LayoutEngine } from './types.js';

class ShapeRegistry {
  private shapes = new Map<string, ShapeDefinition>();
  private aliases = new Map<string, string>(); // alias -> canonical ID

  register(shape: ShapeDefinition, aliases?: string[]): void {
    this.shapes.set(shape.id, shape);

    // Register aliases if provided
    if (aliases) {
      for (const alias of aliases) {
        this.aliases.set(alias, shape.id);
      }
    }
  }

  /**
   * Register an alias for an existing shape
   */
  registerAlias(alias: string, shapeId: string): void {
    if (!this.shapes.has(shapeId)) {
      throw new Error(
        `Cannot create alias "${alias}" for unknown shape "${shapeId}"`
      );
    }
    this.aliases.set(alias, shapeId);
  }

  /**
   * Get shape by ID or alias
   */
  get(idOrAlias: string): ShapeDefinition | undefined {
    // Try direct lookup first
    const shape = this.shapes.get(idOrAlias);
    if (shape) return shape;

    // Try alias lookup
    const canonicalId = this.aliases.get(idOrAlias);
    if (canonicalId) {
      return this.shapes.get(canonicalId);
    }

    return undefined;
  }

  /**
   * Resolve alias to canonical ID
   */
  resolveAlias(idOrAlias: string): string {
    return this.aliases.get(idOrAlias) || idOrAlias;
  }

  /**
   * Get all aliases for a shape ID
   */
  getAliases(shapeId: string): string[] {
    const aliases: string[] = [];
    for (const [alias, id] of this.aliases.entries()) {
      if (id === shapeId) {
        aliases.push(alias);
      }
    }
    return aliases;
  }

  list(): ShapeDefinition[] {
    return Array.from(this.shapes.values());
  }

  /**
   * List all registered IDs and aliases
   */
  listAllIdentifiers(): string[] {
    return [...this.shapes.keys(), ...this.aliases.keys()];
  }

  has(idOrAlias: string): boolean {
    return this.shapes.has(idOrAlias) || this.aliases.has(idOrAlias);
  }
}

class IconRegistry {
  private providers = new Map<string, IconProvider>();

  register(provider: IconProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(providerId: string): IconProvider | undefined {
    return this.providers.get(providerId);
  }

  getIcon(
    providerId: string,
    name: string
  ): { d: string; viewBox: string } | undefined {
    const provider = this.providers.get(providerId);
    return provider?.getPath(name);
  }

  list(): IconProvider[] {
    return Array.from(this.providers.values());
  }
}

class LayoutRegistry {
  private engines = new Map<string, LayoutEngine>();

  register(engine: LayoutEngine): void {
    this.engines.set(engine.id, engine);
  }

  get(id: string): LayoutEngine | undefined {
    return this.engines.get(id);
  }

  list(): LayoutEngine[] {
    return Array.from(this.engines.values());
  }

  has(id: string): boolean {
    return this.engines.has(id);
  }
}

// Global registries
export const shapeRegistry = new ShapeRegistry();
export const iconRegistry = new IconRegistry();
export const layoutRegistry = new LayoutRegistry();
