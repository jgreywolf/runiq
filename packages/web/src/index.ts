import type { DiagramAst, LaidOutDiagram } from '@runiq/core';
// Ensure core side-effects (shape registrations & aliases) run in browser bundles
import '@runiq/core';
import { parse as parseDsl, type ParseResult } from '@runiq/parser-dsl';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { renderSvg, type RenderResult, type RenderOptions } from '@runiq/renderer-svg';
import {
  registerBasicShapes,
  registerRectVariantShapes,
  registerFlowchartShapes,
} from '@runiq/core';

export type { ParseResult };

export interface LayoutOptions {
  /** Direction TB/LR/BT/RL - defaults to diagram or TB */
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  /** Node spacing in px */
  spacing?: number;
}

/** Parse Runiq DSL text into a Diagram AST (first diagram in document). */
export function parseRuniq(text: string): DiagramAst {
  // Ensure common shapes are registered (idempotent)
  registerBasicShapes();
  registerRectVariantShapes();
  registerFlowchartShapes();
  const result = parseDsl(text);
  if (!result.success || !result.diagram) {
    const msg = result.errors?.join('\n') || 'Unknown parse error';
    throw new Error(`Failed to parse Runiq DSL:\n${msg}`);
  }
  return result.diagram;
}

/** Layout a diagram AST using the ELK layout engine. */
export async function layoutRuniq(
  diagram: DiagramAst,
  options: LayoutOptions = {}
): Promise<LaidOutDiagram> {
  const engine = new ElkLayoutEngine();
  return await engine.layout(diagram, options);
}

/** Render a laid out diagram to SVG markup. */
export function renderRuniq(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options: RenderOptions = {}
): RenderResult {
  return renderSvg(diagram, layout, options);
}

/** Convenience: parse + layout + render in one. */
export async function renderRuniqToSvg(
  text: string,
  layoutOptions: LayoutOptions = {},
  renderOptions: RenderOptions = {}
): Promise<RenderResult> {
  const ast = parseRuniq(text);
  const layout = await layoutRuniq(ast, layoutOptions);
  return renderRuniq(ast, layout, renderOptions);
}

// Re-exports for advanced integrations
export { ElkLayoutEngine } from '@runiq/layout-base';
export { renderSvg } from '@runiq/renderer-svg';
