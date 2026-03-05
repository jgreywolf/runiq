import { describe, expect, it } from 'vitest';
import { renderGitGraph } from './gitgraph-renderer.js';
import type { GitGraphProfile } from '@runiq/core';

describe('renderGitGraph', () => {
  it('renders empty state when there are no commits', () => {
    const profile: GitGraphProfile = {
      type: 'gitgraph',
      name: 'Empty Graph',
      branches: [],
      commits: [],
      merges: [],
    };

    const result = renderGitGraph(profile);

    expect(result.svg).toContain('No commits defined');
    expect(result.warnings).toHaveLength(0);
  });

  it('auto-adds missing branches from commits and merges', () => {
    const profile: GitGraphProfile = {
      type: 'gitgraph',
      name: 'Auto Branches',
      branches: [],
      commits: [
        { id: 'c1', branch: 'auto', label: 'Auto commit' },
      ],
      merges: [
        { id: 'm1', from: 'feature', into: 'main', label: 'Merge feature' },
      ],
    };

    const result = renderGitGraph(profile);

    expect(result.svg).toContain('auto');
    expect(result.svg).toContain('feature');
    expect(result.svg).toContain('main');
  });

  it('renders horizontal orientation with merge + tag', () => {
    const profile: GitGraphProfile = {
      type: 'gitgraph',
      name: 'Horizontal',
      orientation: 'horizontal',
      branches: [
        { id: 'main', label: 'main' },
        { id: 'feature', label: 'feature' },
      ],
      commits: [
        { id: 'c1', branch: 'main', label: 'Init' },
        { id: 'c2', branch: 'feature', label: 'Work' },
      ],
      merges: [
        { id: 'm1', from: 'feature', into: 'main', label: 'Merge', tag: 'v1.0.0' },
      ],
    };

    const result = renderGitGraph(profile);

    expect(result.svg).toContain('stroke-dasharray="4,4"');
    expect(result.svg).toContain('v1.0.0');
    expect(result.svg).toContain('Merge');
  });
});
