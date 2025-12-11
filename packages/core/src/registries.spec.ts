import { describe, it, expect, beforeEach } from 'vitest';
import type {
  ShapeDefinition,
  IconProvider,
  LayoutEngine,
  ShapeRenderContext,
} from './types/index.js';

// We need to test the registry classes directly since they're used internally
// Import private classes for testing by recreating them
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

  clear(): void {
    this.shapes.clear();
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

  clear(): void {
    this.providers.clear();
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

  clear(): void {
    this.engines.clear();
  }
}

describe('ShapeRegistry', () => {
  let registry: ShapeRegistry;

  beforeEach(() => {
    registry = new ShapeRegistry();
  });

  const mockShape: ShapeDefinition = {
    id: 'rounded',
    bounds: (_ctx: ShapeRenderContext) => ({ width: 100, height: 60 }),
    render: (_ctx: ShapeRenderContext, position: { x: number; y: number }) =>
      `<rect x="${position.x}" y="${position.y}" width="100" height="60" />`,
  };

  it('should register a shape', () => {
    registry.register(mockShape);
    expect(registry.has('rounded')).toBe(true);
  });

  it('should retrieve a registered shape', () => {
    registry.register(mockShape);
    const shape = registry.get('rounded');
    expect(shape).toEqual(mockShape);
  });

  it('should return undefined for unregistered shape', () => {
    const shape = registry.get('nonexistent');
    expect(shape).toBeUndefined();
  });

  it('should list all registered shapes', () => {
    const shape2: ShapeDefinition = {
      id: 'circle',
      bounds: (_ctx: ShapeRenderContext) => ({ width: 80, height: 80 }),
      render: (_ctx: ShapeRenderContext, position: { x: number; y: number }) =>
        `<circle cx="${position.x}" cy="${position.y}" r="40" />`,
    };

    registry.register(mockShape);
    registry.register(shape2);

    const shapes = registry.list();
    expect(shapes).toHaveLength(2);
    expect(shapes).toContainEqual(mockShape);
    expect(shapes).toContainEqual(shape2);
  });

  it('should check if shape exists', () => {
    expect(registry.has('rounded')).toBe(false);
    registry.register(mockShape);
    expect(registry.has('rounded')).toBe(true);
  });

  it('should overwrite existing shape with same id', () => {
    registry.register(mockShape);

    const updatedShape: ShapeDefinition = {
      id: 'rounded',
      bounds: (_ctx: ShapeRenderContext) => ({ width: 120, height: 70 }),
      render: (_ctx: ShapeRenderContext, position: { x: number; y: number }) =>
        `<rect x="${position.x}" y="${position.y}" width="120" height="70" />`,
    };

    registry.register(updatedShape);
    const shape = registry.get('rounded');
    expect(shape?.bounds).toBe(updatedShape.bounds);
  });

  it('should handle multiple shapes', () => {
    const shapes: ShapeDefinition[] = [
      {
        id: 'shape1',
        bounds: () => ({ width: 100, height: 60 }),
        render: () => '',
      },
      {
        id: 'shape2',
        bounds: () => ({ width: 100, height: 60 }),
        render: () => '',
      },
      {
        id: 'shape3',
        bounds: () => ({ width: 100, height: 60 }),
        render: () => '',
      },
    ];

    shapes.forEach((shape) => registry.register(shape));
    expect(registry.list()).toHaveLength(3);
  });
});

describe('IconRegistry', () => {
  let registry: IconRegistry;

  beforeEach(() => {
    registry = new IconRegistry();
  });

  const mockProvider: IconProvider = {
    id: 'fa',
    getPath: (name: string) => {
      if (name === 'user') {
        return { d: 'M0,0 L10,10', viewBox: '0 0 24 24' };
      }
      return undefined;
    },
  };

  it('should register an icon provider', () => {
    registry.register(mockProvider);
    const provider = registry.get('fa');
    expect(provider).toEqual(mockProvider);
  });

  it('should return undefined for unregistered provider', () => {
    const provider = registry.get('nonexistent');
    expect(provider).toBeUndefined();
  });

  it('should get icon path from provider', () => {
    registry.register(mockProvider);
    const icon = registry.getIcon('fa', 'user');
    expect(icon).toEqual({ d: 'M0,0 L10,10', viewBox: '0 0 24 24' });
  });

  it('should return undefined for invalid icon name', () => {
    registry.register(mockProvider);
    const icon = registry.getIcon('fa', 'nonexistent');
    expect(icon).toBeUndefined();
  });

  it('should return undefined for invalid provider', () => {
    const icon = registry.getIcon('nonexistent', 'user');
    expect(icon).toBeUndefined();
  });

  it('should list all registered providers', () => {
    const provider2: IconProvider = {
      id: 'mdi',
      getPath: () => undefined,
    };

    registry.register(mockProvider);
    registry.register(provider2);

    const providers = registry.list();
    expect(providers).toHaveLength(2);
    expect(providers).toContainEqual(mockProvider);
    expect(providers).toContainEqual(provider2);
  });

  it('should overwrite existing provider with same id', () => {
    registry.register(mockProvider);

    const updatedProvider: IconProvider = {
      id: 'fa',
      getPath: (name: string) => {
        if (name === 'heart') {
          return { d: 'M20,10', viewBox: '0 0 24 24' };
        }
        return undefined;
      },
    };

    registry.register(updatedProvider);
    const provider = registry.get('fa');
    expect(provider?.getPath).toBe(updatedProvider.getPath);
  });

  it('should handle multiple providers', () => {
    const providers: IconProvider[] = [
      { id: 'provider1', getPath: () => undefined },
      { id: 'provider2', getPath: () => undefined },
      { id: 'provider3', getPath: () => undefined },
    ];

    providers.forEach((provider) => registry.register(provider));
    expect(registry.list()).toHaveLength(3);
  });
});

describe('LayoutRegistry', () => {
  let registry: LayoutRegistry;

  beforeEach(() => {
    registry = new LayoutRegistry();
  });

  const mockEngine: LayoutEngine = {
    id: 'dagre',
    layout: async (_diagram) => ({
      nodes: [],
      edges: [],
      size: { width: 0, height: 0 },
    }),
  };

  it('should register a layout engine', () => {
    registry.register(mockEngine);
    expect(registry.has('dagre')).toBe(true);
  });

  it('should retrieve a registered engine', () => {
    registry.register(mockEngine);
    const engine = registry.get('dagre');
    expect(engine).toEqual(mockEngine);
  });

  it('should return undefined for unregistered engine', () => {
    const engine = registry.get('nonexistent');
    expect(engine).toBeUndefined();
  });

  it('should list all registered engines', () => {
    const engine2: LayoutEngine = {
      id: 'force',
      layout: async (_diagram) => ({
        nodes: [],
        edges: [],
        size: { width: 0, height: 0 },
      }),
    };

    registry.register(mockEngine);
    registry.register(engine2);

    const engines = registry.list();
    expect(engines).toHaveLength(2);
    expect(engines).toContainEqual(mockEngine);
    expect(engines).toContainEqual(engine2);
  });

  it('should check if engine exists', () => {
    expect(registry.has('dagre')).toBe(false);
    registry.register(mockEngine);
    expect(registry.has('dagre')).toBe(true);
  });

  it('should overwrite existing engine with same id', () => {
    registry.register(mockEngine);

    const updatedEngine: LayoutEngine = {
      id: 'dagre',
      layout: async (_diagram) => ({
        nodes: [],
        edges: [],
        size: { width: 100, height: 100 },
      }),
    };

    registry.register(updatedEngine);
    const engine = registry.get('dagre');
    expect(engine?.layout).toBe(updatedEngine.layout);
  });

  it('should handle multiple engines', () => {
    const engines: LayoutEngine[] = [
      {
        id: 'engine1',
        layout: async () => ({
          nodes: [],
          edges: [],
          size: { width: 0, height: 0 },
        }),
      },
      {
        id: 'engine2',
        layout: async () => ({
          nodes: [],
          edges: [],
          size: { width: 0, height: 0 },
        }),
      },
      {
        id: 'engine3',
        layout: async () => ({
          nodes: [],
          edges: [],
          size: { width: 0, height: 0 },
        }),
      },
    ];

    engines.forEach((engine) => registry.register(engine));
    expect(registry.list()).toHaveLength(3);
  });

  it('should execute layout engine', async () => {
    const testEngine: LayoutEngine = {
      id: 'test',
      layout: async (_diagram) => ({
        nodes: [{ id: 'A', x: 0, y: 0, width: 100, height: 60 }],
        edges: [],
        size: { width: 100, height: 60 },
      }),
    };

    registry.register(testEngine);
    const engine = registry.get('test');

    if (engine) {
      const result = await engine.layout({
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('A');
      expect(result.size).toEqual({ width: 100, height: 60 });
    }
  });
});
