import { describe, expect, it } from 'vitest';
import {
  azureApiManagementShape,
  azureBlobStorageShape,
  azureCdnShape,
  azureCosmosDbShape,
  azureEntraIdShape,
  azureFunctionsShape,
  azureResourceGroupShape,
  azureServiceBusShape,
  azureSqlDatabaseShape,
  azureSubscriptionShape,
  azureVirtualNetworkShape,
  azureVmShape,
} from './index.js';

const measureText = (text: string, style?: { fontSize?: number }) => ({
  width: text.length * ((style?.fontSize || 14) * 0.6),
  height: style?.fontSize || 14,
});

describe('expanded Azure shapes', () => {
  it('exports the expected Azure shape ids', () => {
    expect(azureVmShape.id).toBe('azureVm');
    expect(azureBlobStorageShape.id).toBe('azureBlobStorage');
    expect(azureFunctionsShape.id).toBe('azureFunctions');
    expect(azureSqlDatabaseShape.id).toBe('azureSqlDatabase');
    expect(azureVirtualNetworkShape.id).toBe('azureVirtualNetwork');
    expect(azureApiManagementShape.id).toBe('azureApiManagement');
    expect(azureCdnShape.id).toBe('azureCdn');
    expect(azureCosmosDbShape.id).toBe('azureCosmosDb');
    expect(azureServiceBusShape.id).toBe('azureServiceBus');
    expect(azureEntraIdShape.id).toBe('azureEntraId');
    expect(azureResourceGroupShape.id).toBe('azureResourceGroup');
    expect(azureSubscriptionShape.id).toBe('azureSubscription');
  });

  it('renders an Azure VM with its badge and label', () => {
    const svg = azureVmShape.render(
      {
        node: { id: 'vm', shape: 'azureVm', label: 'Web VM' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('VM');
    expect(svg).toContain('Web VM');
  });

  it('renders Azure Functions with its service glyph', () => {
    const svg = azureFunctionsShape.render(
      {
        node: { id: 'fn', shape: 'azureFunctions', label: 'Order Function' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(svg).toContain('<path');
    expect(svg).toContain('Order Function');
  });

  it('renders Azure resource grouping containers', () => {
    const resourceGroupSvg = azureResourceGroupShape.render(
      {
        node: { id: 'rg', shape: 'azureResourceGroup', label: 'App Resource Group' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    const subscriptionSvg = azureSubscriptionShape.render(
      {
        node: { id: 'sub', shape: 'azureSubscription', label: 'Production Subscription' },
        style: {},
        theme: { mode: 'light' },
        measureText,
      } as never,
      { x: 0, y: 0 }
    );

    expect(resourceGroupSvg).toContain('Resource Group');
    expect(resourceGroupSvg).toContain('stroke-dasharray');
    expect(subscriptionSvg).toContain('Subscription');
  });
});
