import type { GlyphSetCategory, GlyphSetDefinition } from './types.js';

/**
 * Registry for managing GlyphSet definitions
 */
export class GlyphSetRegistry {
  private glyphsets = new Map<string, GlyphSetDefinition>();

  /**
   * Register a new glyphset
   */
  register(glyphset: GlyphSetDefinition): void {
    if (this.glyphsets.has(glyphset.id)) {
      console.warn(`GlyphSet "${glyphset.id}" is already registered. Overwriting.`);
    }
    this.glyphsets.set(glyphset.id, glyphset);
  }

  /**
   * Get a glyphset by ID
   */
  get(id: string): GlyphSetDefinition | undefined {
    return this.glyphsets.get(id);
  }

  /**
   * Get all glyphsets, optionally filtered by category
   */
  list(category?: GlyphSetCategory): GlyphSetDefinition[] {
    const all = Array.from(this.glyphsets.values());
    return category ? all.filter((g) => g.category === category) : all;
  }

  /**
   * Check if a glyphset exists
   */
  has(id: string): boolean {
    return this.glyphsets.has(id);
  }

  /**
   * Get all registered glyphset IDs
   */
  getAllIds(): string[] {
    return Array.from(this.glyphsets.keys());
  }

  /**
   * Clear all registered glyphsets (useful for testing)
   */
  clear(): void {
    this.glyphsets.clear();
  }
}

/**
 * Global glyphset registry instance
 */
export const glyphsetRegistry = new GlyphSetRegistry();
