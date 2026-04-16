import type {
  DiagramAst,
  DiagramProfile,
  LaidOutDiagram,
  LayoutOptions,
  Profile,
  RuniqDocument,
} from '@runiq/core';
// Ensure core side-effects (shape registrations & aliases) run in browser bundles.
import '@runiq/core';
import { ProfileType, iconRegistry, registerDefaultShapes } from '@runiq/core';
import { brandIcons } from '@runiq/icons-brand';
import { fontAwesome } from '@runiq/icons-fontawesome';
import { iconify } from '@runiq/icons-iconify';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { parse as parseDsl, type ParseResult } from '@runiq/parser-dsl';
import {
  renderFaultTree,
  renderGitGraph,
  renderKanban,
  renderPedigree,
  renderRailroadDiagram,
  renderSequenceDiagram,
  renderSvg,
  renderTimeline,
  renderTreemap,
  renderWardleyMap,
  type RenderOptions,
  type RenderResult,
} from '@runiq/renderer-svg';
import {
  renderDigital,
  renderPID,
  renderSchematic,
  type SchematicOptions,
} from '@runiq/renderer-schematic';

export type { ParseResult };

export interface ProfileRenderOptions {
  layout?: LayoutOptions;
  render?: RenderOptions;
  schematic?: SchematicOptions;
}

let defaultsRegistered = false;

function ensureDefaultRuntime(): void {
  if (defaultsRegistered) return;
  registerDefaultShapes();
  iconRegistry.register(brandIcons);
  iconRegistry.register(fontAwesome);
  iconRegistry.register(iconify);
  defaultsRegistered = true;
}

function parseOrThrow(text: string): ParseResult {
  ensureDefaultRuntime();
  const result = parseDsl(text);
  if (!result.success || !result.document) {
    const msg = result.errors?.join('\n') || 'Unknown parse error';
    throw new Error(`Failed to parse Runiq DSL:\n${msg}`);
  }
  return result;
}

function firstDiagramProfile(document: RuniqDocument): DiagramProfile | null {
  return (
    document.profiles.find(
      (profile): profile is DiagramProfile =>
        profile.type === ProfileType.DIAGRAM
    ) ?? null
  );
}

function diagramProfileToAst(
  profile: DiagramProfile,
  astVersion = '1.0'
): DiagramAst {
  return {
    astVersion,
    title: profile.name,
    direction: profile.direction,
    routing: profile.routing,
    theme: profile.theme,
    styles: profile.styles,
    nodes: profile.nodes,
    edges: profile.edges,
    groups: profile.groups,
    containers: profile.containers,
  };
}

/** Parse Runiq DSL text into the full multi-profile document. */
export function parseRuniqDocument(text: string): RuniqDocument {
  return parseOrThrow(text).document!;
}

/** Parse Runiq DSL text and return a profile by index. */
export function parseRuniqProfile(text: string, index = 0): Profile {
  const document = parseRuniqDocument(text);
  const profile = document.profiles[index];
  if (!profile) {
    throw new Error(`No Runiq profile found at index ${index}`);
  }
  return profile;
}

/** Parse Runiq DSL text into a Diagram AST (first diagram profile in document). */
export function parseRuniq(text: string): DiagramAst {
  const result = parseOrThrow(text);
  if (result.diagram) {
    return result.diagram;
  }

  const diagramProfile = firstDiagramProfile(result.document!);
  if (!diagramProfile) {
    throw new Error('No diagram profile found in Runiq document');
  }
  return diagramProfileToAst(diagramProfile, result.document!.astVersion);
}

/** Layout a diagram AST using the ELK layout engine. */
export async function layoutRuniq(
  diagram: DiagramAst,
  options: LayoutOptions = {}
): Promise<LaidOutDiagram> {
  ensureDefaultRuntime();
  const engine = new ElkLayoutEngine();
  return await engine.layout(diagram, options);
}

/** Render a laid out diagram to SVG markup. */
export function renderRuniq(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options: RenderOptions = {}
): RenderResult {
  ensureDefaultRuntime();
  return renderSvg(diagram, layout, options);
}

/** Render any supported Runiq profile to SVG markup. */
export async function renderRuniqProfileToSvg(
  profile: Profile,
  options: ProfileRenderOptions = {},
  astVersion = '1.0'
): Promise<RenderResult> {
  ensureDefaultRuntime();

  switch (profile.type) {
    case ProfileType.DIAGRAM: {
      const ast = diagramProfileToAst(profile, astVersion);
      const layout = await layoutRuniq(ast, options.layout);
      return renderRuniq(ast, layout, options.render);
    }
    case ProfileType.WARDLEY:
      return renderWardleyMap(profile);
    case ProfileType.RAILROAD:
      return renderRailroadDiagram(profile);
    case ProfileType.SEQUENCE:
      return renderSequenceDiagram(profile);
    case ProfileType.TIMELINE:
      return renderTimeline(profile);
    case ProfileType.FAULT_TREE:
      return renderFaultTree(profile);
    case ProfileType.KANBAN:
      return renderKanban(profile);
    case ProfileType.GITGRAPH:
      return renderGitGraph(profile);
    case ProfileType.TREEMAP:
      return renderTreemap(profile);
    case ProfileType.PEDIGREE:
      return renderPedigree(profile);
    case ProfileType.ELECTRICAL:
    case ProfileType.PNEUMATIC:
    case ProfileType.HYDRAULIC:
    case ProfileType.HVAC:
    case ProfileType.CONTROL:
      return renderSchematic(profile, options.schematic);
    case ProfileType.DIGITAL:
      return renderDigital(profile, options.schematic);
    case ProfileType.PID:
      return renderPID(profile);
    default:
      if (
        (profile as { type: string }).type === 'block-diagram' ||
        (profile as { type: string }).type === 'blockDiagram'
      ) {
        return renderSchematic(profile as any, options.schematic);
      }
      throw new Error(`Unsupported Runiq profile type: ${profile.type}`);
  }
}

/** Render a profile from a parsed Runiq document by index. */
export async function renderRuniqDocumentToSvg(
  document: RuniqDocument,
  options: ProfileRenderOptions = {},
  profileIndex = 0
): Promise<RenderResult> {
  const profile = document.profiles[profileIndex];
  if (!profile) {
    throw new Error(`No Runiq profile found at index ${profileIndex}`);
  }
  return renderRuniqProfileToSvg(profile, options, document.astVersion);
}

/** Convenience: parse + layout/profile-render in one. */
export async function renderRuniqToSvg(
  text: string,
  layoutOptions: LayoutOptions = {},
  renderOptions: RenderOptions = {}
): Promise<RenderResult> {
  const document = parseRuniqDocument(text);
  return renderRuniqDocumentToSvg(document, {
    layout: layoutOptions,
    render: renderOptions,
  });
}

// Re-exports for advanced integrations.
export { ElkLayoutEngine } from '@runiq/layout-base';
export {
  renderFaultTree,
  renderGitGraph,
  renderKanban,
  renderPedigree,
  renderRailroadDiagram,
  renderSequenceDiagram,
  renderSvg,
  renderTimeline,
  renderTreemap,
  renderWardleyMap,
} from '@runiq/renderer-svg';
export {
  renderDigital,
  renderPID,
  renderSchematic,
} from '@runiq/renderer-schematic';
