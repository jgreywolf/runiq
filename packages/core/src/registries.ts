import type { ShapeDefinition, IconProvider, LayoutEngine } from './types.js';

class ShapeRegistry {
  private shapes = new Map<string, ShapeDefinition>();

  register(shape: ShapeDefinition): void {
    this.shapes.set(shape.id, shape);
  }

  get(id: string): ShapeDefinition | undefined {
    return this.shapes.get(id);
  }

  list(): ShapeDefinition[] {
    return Array.from(this.shapes.values());
  }

  has(id: string): boolean {
    return this.shapes.has(id);
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
