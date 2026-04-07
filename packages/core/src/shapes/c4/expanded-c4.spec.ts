import { describe, expect, it } from 'vitest';
import { c4ContainerInstance } from './containerInstance.js';
import { c4DeploymentNode } from './deploymentNode.js';
import { c4ExternalPerson } from './externalPerson.js';
import { c4ExternalSystem } from './externalSystem.js';
import { c4SystemInstance } from './systemInstance.js';

const measureText = (text: string, style?: { fontSize?: number }) => ({
  width: text.length * ((style?.fontSize || 14) * 0.6),
  height: style?.fontSize || 14,
});

describe('expanded C4 shapes', () => {
  it('renders an external person with external styling', () => {
    const svg = c4ExternalPerson.render(
      {
        node: { id: 'user', shape: 'c4ExternalPerson', label: 'Customer' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('#999999');
  });

  it('renders an external system with external styling', () => {
    const svg = c4ExternalSystem.render(
      {
        node: { id: 'ext', shape: 'c4ExternalSystem', label: 'Payments API' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('#999999');
    expect(svg).toContain('Payments API');
  });

  it('renders a deployment node as a 3d box', () => {
    const svg = c4DeploymentNode.render(
      {
        node: { id: 'node', shape: 'c4DeploymentNode', label: 'Kubernetes Cluster' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 10, y: 20 }
    );

    expect(svg).toContain('<polygon');
    expect(svg).toContain('Kubernetes Cluster');
  });

  it('renders a container instance with instance badge text', () => {
    const svg = c4ContainerInstance.render(
      {
        node: { id: 'web', shape: 'c4ContainerInstance', label: 'Web App\\n[React]' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('instance');
    expect(svg).toContain('stroke-dasharray');
  });

  it('renders a system instance with instance badge text', () => {
    const svg = c4SystemInstance.render(
      {
        node: { id: 'banking', shape: 'c4SystemInstance', label: 'Banking System' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('instance');
    expect(svg).toContain('stroke-dasharray');
  });
});
