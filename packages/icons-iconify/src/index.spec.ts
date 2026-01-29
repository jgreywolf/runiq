import { describe, expect, it } from 'vitest';
import { iconify } from './index.js';

describe('iconify', () => {
  it('resolves mdi icons with colon notation', () => {
    const icon = iconify.getIcon('mdi:cloud');
    expect(icon).toBeDefined();
    expect(icon?.viewBox).toBe('0 0 24 24');
  });

  it('resolves mdi icons using underscore names', () => {
    const icon = iconify.getIcon('mdi_cloud_sync');
    expect(icon).toBeDefined();
  });

  it('includes database variant icons', () => {
    expect(iconify.getIcon('mdi_database')).toBeDefined();
    expect(iconify.getIcon('mdi_database_search')).toBeDefined();
    expect(iconify.getIcon('mdi_database_lock')).toBeDefined();
  });

  it('resolves cloud collection icons with underscore names', () => {
    expect(iconify.getIcon('cloud_aws')).toBeDefined();
    expect(iconify.getIcon('cloud_kubernetes')).toBeDefined();
  });

  it('includes provider-specific cloud icons', () => {
    expect(iconify.getIcon('cloud_aws_ec2')).toBeDefined();
    expect(iconify.getIcon('cloud_azure_storage')).toBeDefined();
    expect(iconify.getIcon('cloud_gcp_functions')).toBeDefined();
  });

  it('includes additional cloud services', () => {
    expect(iconify.getIcon('cloud_aws_apigateway')).toBeDefined();
    expect(iconify.getIcon('cloud_aws_cloudwatch')).toBeDefined();
    expect(iconify.getIcon('cloud_gcp_spanner')).toBeDefined();
  });
});
