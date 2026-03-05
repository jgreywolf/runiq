import type { IconDefinition, IconProvider } from '@runiq/core';
import { iconify } from '@runiq/icons-iconify';

const badge = (label: string, fontSize: number = 8): string =>
  `<rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="currentColor" />
   <text x="12" y="15" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${fontSize}" fill="#ffffff">${label}</text>`;

const iconMap: Record<string, IconDefinition> = {
  aws: { viewBox: '0 0 24 24', svg: badge('AWS', 6) },
  'aws-ec2': { viewBox: '0 0 24 24', svg: badge('EC2', 6) },
  'aws-s3': { viewBox: '0 0 24 24', svg: badge('S3', 7) },
  'aws-lambda': { viewBox: '0 0 24 24', svg: badge('LMB', 6) },
  'aws-rds': { viewBox: '0 0 24 24', svg: badge('RDS', 6) },
  azure: { viewBox: '0 0 24 24', svg: badge('AZ', 7) },
  'azure-vm': { viewBox: '0 0 24 24', svg: badge('VM', 7) },
  'azure-storage': { viewBox: '0 0 24 24', svg: badge('ST', 7) },
  'azure-functions': { viewBox: '0 0 24 24', svg: badge('FN', 7) },
  gcp: { viewBox: '0 0 24 24', svg: badge('GCP', 6) },
  'gcp-compute': { viewBox: '0 0 24 24', svg: badge('CE', 7) },
  'gcp-storage': { viewBox: '0 0 24 24', svg: badge('CS', 7) },
  'gcp-functions': { viewBox: '0 0 24 24', svg: badge('GF', 7) },
  cloud: { viewBox: '0 0 24 24', svg: badge('CLD', 6) },
  docker: { viewBox: '0 0 24 24', svg: badge('DK', 7) },
  kubernetes: { viewBox: '0 0 24 24', svg: badge('K8S', 6) },
  mongodb: { viewBox: '0 0 24 24', svg: badge('MG', 7) },
  postgres: { viewBox: '0 0 24 24', svg: badge('PG', 7) },
  redis: { viewBox: '0 0 24 24', svg: badge('RD', 7) },
  mysql: { viewBox: '0 0 24 24', svg: badge('MY', 7) },
  cassandra: { viewBox: '0 0 24 24', svg: badge('CS', 7) },
  snowflake: { viewBox: '0 0 24 24', svg: badge('SF', 7) },
  'db-sql': { viewBox: '0 0 24 24', svg: badge('SQL', 6) },
  'db-nosql': { viewBox: '0 0 24 24', svg: badge('NSQ', 6) },
  'db-cache': { viewBox: '0 0 24 24', svg: badge('CCH', 6) },
  'db-warehouse': { viewBox: '0 0 24 24', svg: badge('DWH', 6) },
  'db-graph': { viewBox: '0 0 24 24', svg: badge('GRF', 6) },
  'db-timeseries': { viewBox: '0 0 24 24', svg: badge('TS', 7) },
  jenkins: { viewBox: '0 0 24 24', svg: badge('JK', 7) },
  gitlab: { viewBox: '0 0 24 24', svg: badge('GL', 7) },
  'github-actions': { viewBox: '0 0 24 24', svg: badge('GHA', 5) },
  terraform: { viewBox: '0 0 24 24', svg: badge('TF', 7) },
  nginx: { viewBox: '0 0 24 24', svg: badge('NG', 7) },
  kafka: { viewBox: '0 0 24 24', svg: badge('KF', 7) },
  vault: { viewBox: '0 0 24 24', svg: badge('VT', 7) },
  'ci-cd': { viewBox: '0 0 24 24', svg: badge('CI', 8) },
  pipeline: { viewBox: '0 0 24 24', svg: badge('PL', 8) },
  'artifact-repo': { viewBox: '0 0 24 24', svg: badge('AR', 8) },
  'deploy-target': { viewBox: '0 0 24 24', svg: badge('DEP', 6) },
  user: { viewBox: '0 0 24 24', svg: badge('USR', 6) },
  team: { viewBox: '0 0 24 24', svg: badge('TM', 8) },
  'team-icon': { viewBox: '0 0 24 24', svg: badge('TM', 8) },
  department: { viewBox: '0 0 24 24', svg: badge('DEP', 6) },
  partner: { viewBox: '0 0 24 24', svg: badge('PRT', 6) },
  vendor: { viewBox: '0 0 24 24', svg: badge('VND', 6) },
  product: { viewBox: '0 0 24 24', svg: badge('PRD', 6) },
  service: { viewBox: '0 0 24 24', svg: badge('SRV', 6) },
  revenue: { viewBox: '0 0 24 24', svg: badge('REV', 6) },
  metrics: { viewBox: '0 0 24 24', svg: badge('KPI', 6) },
  firewall: { viewBox: '0 0 24 24', svg: badge('FW', 8) },
  vpn: { viewBox: '0 0 24 24', svg: badge('VPN', 6) },
  certificate: { viewBox: '0 0 24 24', svg: badge('CRT', 6) },
  key: { viewBox: '0 0 24 24', svg: badge('KEY', 6) },
  'key-icon': { viewBox: '0 0 24 24', svg: badge('KEY', 6) },
  shield: { viewBox: '0 0 24 24', svg: badge('SHD', 6) },
  threat: { viewBox: '0 0 24 24', svg: badge('THR', 6) },
  vulnerability: { viewBox: '0 0 24 24', svg: badge('VUL', 6) },
  'audit-log': { viewBox: '0 0 24 24', svg: badge('LOG', 6) },
};

const iconifyFallbacks: Record<string, string> = {
  aws: 'cloud_aws',
  'aws-ec2': 'cloud_aws_ec2',
  'aws-s3': 'cloud_aws_s3',
  'aws-lambda': 'cloud_aws_lambda',
  'aws-rds': 'cloud_aws_rds',
  azure: 'cloud_azure',
  'azure-vm': 'cloud_azure_vm',
  'azure-storage': 'cloud_azure_storage',
  'azure-functions': 'cloud_azure_functions',
  gcp: 'cloud_gcp',
  'gcp-compute': 'cloud_gcp_compute',
  'gcp-storage': 'cloud_gcp_storage',
  'gcp-functions': 'cloud_gcp_functions',
  cloud: 'mdi_cloud',
  docker: 'cloud_docker',
  kubernetes: 'cloud_kubernetes',
  'db-sql': 'mdi_database',
  'db-nosql': 'mdi_database_outline',
  'db-cache': 'mdi_database_lock',
  'db-warehouse': 'mdi_database',
  'db-graph': 'mdi_database_search',
  'db-timeseries': 'mdi_database',
  redis: 'mdi_database_lock',
  mysql: 'mdi_database',
  postgres: 'mdi_database',
  mongodb: 'mdi_database',
  cassandra: 'mdi_database_search',
  snowflake: 'mdi_database',
  jenkins: 'mdi_pipeline',
  gitlab: 'mdi_git',
  'github-actions': 'mdi_pipeline',
  terraform: 'mdi_hammer_wrench',
  nginx: 'mdi_server',
  kafka: 'mdi_package_variant',
  vault: 'mdi_lock',
  'ci-cd': 'mdi_pipeline',
  pipeline: 'mdi_pipeline',
  'artifact-repo': 'mdi_package_variant',
  'deploy-target': 'mdi_rocket_launch',
  user: 'mdi_user',
  team: 'mdi_users',
  'team-icon': 'mdi_users',
  department: 'mdi_account_group',
  partner: 'mdi_account_group',
  vendor: 'mdi_briefcase',
  product: 'mdi_package_variant',
  service: 'mdi_server',
  revenue: 'mdi_cash',
  metrics: 'mdi_chart_line',
  firewall: 'mdi_shield',
  vpn: 'mdi_lock',
  certificate: 'mdi_file_document_alert',
  key: 'mdi_key',
  'key-icon': 'mdi_key',
  shield: 'mdi_shield',
  threat: 'mdi_alert_outline',
  vulnerability: 'mdi_alert_outline',
  'audit-log': 'mdi_file_document_alert',
};

export class BrandIconProvider implements IconProvider {
  id = 'brand';

  getIcon(name: string): IconDefinition | undefined {
    const key = name.trim().toLowerCase();
    if (!key) return undefined;
    const normalized = key.replace(/_/g, '-');
    const fallbackKey = iconifyFallbacks[key] || iconifyFallbacks[normalized];
    if (fallbackKey) {
      const fallbackIcon = iconify.getIcon(fallbackKey);
      if (fallbackIcon) return fallbackIcon;
    }
    return iconMap[key] || iconMap[normalized];
  }

  getPath(): { d: string; viewBox: string } | undefined {
    return undefined;
  }
}

export const brandIcons = new BrandIconProvider();
