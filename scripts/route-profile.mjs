#!/usr/bin/env node
import {
  renderSequenceDiagram,
  renderTimeline,
  renderWardleyMap,
} from '../packages/renderer-svg/dist/index.js';

export function routeProfileToRenderer(profileType, diagram, opts = {}) {
  if (!profileType) return { handled: false };

  if (profileType === 'sequence') {
    return { handled: true, result: renderSequenceDiagram(diagram, opts) };
  }

  if (profileType === 'timeline') {
    return { handled: true, result: renderTimeline(diagram, opts) };
  }

  if (profileType === 'wardley') {
    return { handled: true, result: renderWardleyMap(diagram, opts) };
  }

  return { handled: false };
}

export default routeProfileToRenderer;
