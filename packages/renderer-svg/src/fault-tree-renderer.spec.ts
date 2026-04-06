import { describe, expect, it } from 'vitest';
import type { FaultTreeProfile } from '@runiq/core';
import { renderFaultTree } from './fault-tree-renderer.js';

describe('renderFaultTree', () => {
  it('renders a basic fault tree with events and gates', () => {
    const profile: FaultTreeProfile = {
      type: 'faultTree',
      astVersion: '1.0.0',
      title: 'Brake Failure',
      events: [
        { id: 'loss', label: 'Brake system fails', kind: 'topEvent' },
        { id: 'hydraulic', label: 'Hydraulic pressure lost', kind: 'event', under: 'g1' },
        { id: 'control', label: 'Controller failure', kind: 'event', under: 'g1' },
      ],
      gates: [{ id: 'g1', gateType: 'or', under: 'loss' }],
    };

    const result = renderFaultTree(profile);
    expect(result.warnings).toHaveLength(0);
    expect(result.svg).toContain('Brake system fails');
    expect(result.svg).toContain('Hydraulic pressure lost');
    expect(result.svg).toContain('Controller failure');
    expect(result.svg).toContain('OR');
  });

  it('renders undeveloped events as a diamond', () => {
    const profile: FaultTreeProfile = {
      type: 'faultTree',
      astVersion: '1.0.0',
      title: 'Power Loss',
      events: [
        { id: 'outage', label: 'Loss of power', kind: 'topEvent' },
        { id: 'backup', label: 'Backup unavailable', kind: 'undevelopedEvent', under: 'g1' },
      ],
      gates: [{ id: 'g1', gateType: 'and', under: 'outage' }],
    };

    const result = renderFaultTree(profile);
    expect(result.svg).toContain('Backup unavailable');
    expect(result.svg).toContain('AND');
  });
});
