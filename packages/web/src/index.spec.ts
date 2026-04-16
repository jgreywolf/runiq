import { describe, it, expect } from 'vitest';
import {
  layoutRuniq,
  parseRuniq,
  parseRuniqDocument,
  renderRuniqDocumentToSvg,
  renderRuniqProfileToSvg,
  renderRuniqToSvg,
} from './index.js';

const sample = `diagram "My Diagram" {
  direction TB
  style s1 fill: "#eef"
  shape A as @rectangle label:"Hello" style: s1
  shape B as @rectangle label:"World"
  A -link-> B
}`;

describe('@runiq/web API', () => {
  it('parses and layouts a simple diagram', async () => {
    const ast = parseRuniq(sample);
    expect(ast.nodes.length).toBe(2);
    const layout = await layoutRuniq(ast, { direction: 'TB', spacing: 80 });
    expect(layout.nodes.length).toBe(2);
    expect(layout.edges.length).toBe(1);
    expect(layout.size.width).toBeGreaterThan(0);
    expect(layout.size.height).toBeGreaterThan(0);
  });

  it('renders SVG end-to-end', async () => {
    const result = await renderRuniqToSvg(sample, {}, { title: 'Sample' });
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('<title id="diagram-title">Sample</title>');
  });

  it('registers bundled icon providers for rendering', async () => {
    const result = await renderRuniqToSvg(`diagram "Icons" {
      shape api as @rect label:"API" icon:fa/server
    }`);

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('viewBox="0 0 512 512"');
    expect(result.warnings).toHaveLength(0);
  });

  it('registers all default shapes for diagram rendering', async () => {
    const result = await renderRuniqToSvg(`diagram "Network" {
      direction LR
      shape api as @server label:"API"
      shape db as @database label:"Database"
      api -> db
    }`);

    expect(result.svg).toContain('<svg');
    expect(result.warnings).not.toContain('Unknown shape: server');
    expect(result.warnings).not.toContain('Unknown shape: database');
  });

  it('parses full documents with non-diagram profiles', () => {
    const document = parseRuniqDocument(`sequence "Login" {
      participant "User" as actor
      participant "App" as entity
      message from:"User" to:"App" label:"Sign in" type:sync
    }`);

    expect(document.profiles).toHaveLength(1);
    expect(document.profiles[0].type).toBe('sequence');
  });

  it('renders a parsed non-diagram profile', async () => {
    const document = parseRuniqDocument(`sequence "Login" {
      participant "User" as actor
      participant "App" as entity
      message from:"User" to:"App" label:"Sign in" type:sync
    }`);

    const result = await renderRuniqDocumentToSvg(document);

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('Login');
  });

  it('renders schematic profiles through the web package', async () => {
    const document = parseRuniqDocument(`pneumatic "Air Prep" {
      net SUPPLY, FILTERED
      part FILTER type:FILTER pins:(SUPPLY,FILTERED)
    }`);

    const result = await renderRuniqProfileToSvg(document.profiles[0]);

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('Air Prep');
  });
});
