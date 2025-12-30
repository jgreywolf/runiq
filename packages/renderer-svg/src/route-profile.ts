import type {
  SequenceRenderResult,
  TimelineRenderResult,
  WardleyRenderResult,
} from './index.js';
import { renderSequenceDiagram } from './sequence-renderer.js';
import { renderTimeline } from './timeline-renderer.js';
import { renderWardleyMap } from './wardley-renderer.js';

export interface RouteResult {
  handled: boolean;
  result?:
    | SequenceRenderResult
    | TimelineRenderResult
    | WardleyRenderResult
    | { svg: string; warnings: string[] };
}

export function routeProfileToRenderer(
  profileType: string | undefined,
  diagram: any,
  opts: any = {}
): RouteResult {
  if (!profileType) return { handled: false };

  switch (profileType) {
    case 'sequence':
      return { handled: true, result: renderSequenceDiagram(diagram, opts) };
    case 'timeline':
      return { handled: true, result: renderTimeline(diagram, opts) };
    case 'wardley':
      return { handled: true, result: renderWardleyMap(diagram, opts) };
    default:
      return { handled: false };
  }
}
