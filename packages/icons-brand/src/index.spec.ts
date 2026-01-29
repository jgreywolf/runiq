import { describe, expect, it } from 'vitest';
import { brandIcons } from './index.js';

describe('brandIcons', () => {
  it('returns cloud provider icons with direct keys', () => {
    expect(brandIcons.getIcon('aws')).toBeDefined();
    expect(brandIcons.getIcon('azure')).toBeDefined();
    expect(brandIcons.getIcon('gcp')).toBeDefined();
  });

  it('prefers iconify fallbacks when available', () => {
    const icon = brandIcons.getIcon('aws');
    expect(icon?.svg).toBeDefined();
    expect(icon?.svg).not.toContain('rect x="2"');
  });

  it('normalizes underscore names to hyphenated keys', () => {
    expect(brandIcons.getIcon('aws_ec2')).toBeDefined();
    expect(brandIcons.getIcon('azure_storage')).toBeDefined();
    expect(brandIcons.getIcon('gcp_functions')).toBeDefined();
  });

  it('exposes database category icons', () => {
    expect(brandIcons.getIcon('db_sql')).toBeDefined();
    expect(brandIcons.getIcon('db_cache')).toBeDefined();
    expect(brandIcons.getIcon('db_timeseries')).toBeDefined();
  });
});
