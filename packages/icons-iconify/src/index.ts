import type { IconDefinition, IconProvider } from '@runiq/core';
import { generatedIconMap } from './generated-iconify.js';

const manualIconMap: Record<string, IconDefinition> = {
  'cloud:aws': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">AWS</text>',
  },
  'cloud:aws-ec2': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">EC2</text>',
  },
  'cloud:aws-s3': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">S3</text>',
  },
  'cloud:aws-lambda': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">LMB</text>',
  },
  'cloud:aws-rds': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">RDS</text>',
  },
  'cloud:azure': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">AZ</text>',
  },
  'cloud:azure-vm': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">VM</text>',
  },
  'cloud:azure-storage': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">ST</text>',
  },
  'cloud:azure-functions': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">FN</text>',
  },
  'cloud:gcp': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">GCP</text>',
  },
  'cloud:gcp-compute': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">CE</text>',
  },
  'cloud:gcp-storage': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">CS</text>',
  },
  'cloud:gcp-functions': {
    viewBox: '0 0 24 24',
    svg: '<path d="M7.5 17h9a4 4 0 0 0 0-8h-1A5 5 0 0 0 6 10a3.5 3.5 0 0 0 1.5 7z" fill="none" stroke="currentColor" stroke-width="2" /><text x="12" y="14" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="700" fill="currentColor">GF</text>',
  },
  'cloud:compute': {
    viewBox: '0 0 24 24',
    svg: '<rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2" /><path d="M9 7v-2h6v2" stroke="currentColor" stroke-width="2" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" />',
  },
  'cloud:storage': {
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="7" rx="6" ry="2.5" fill="none" stroke="currentColor" stroke-width="2" /><rect x="6" y="7" width="12" height="8" fill="none" stroke="currentColor" stroke-width="2" /><ellipse cx="12" cy="15" rx="6" ry="2.5" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'cloud:functions': {
    viewBox: '0 0 24 24',
    svg: '<path d="M10 4L6 12h4l-1 8 7-10h-4l1-6z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'cloud:kubernetes': {
    viewBox: '0 0 24 24',
    svg: '<polygon points="12,3 19,7 19,17 12,21 5,17 5,7" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="12" r="2" fill="currentColor" />',
  },
  'cloud:docker': {
    viewBox: '0 0 24 24',
    svg: '<rect x="6" y="8" width="4" height="4" /><rect x="11" y="8" width="4" height="4" /><rect x="16" y="8" width="2" height="4" /><rect x="8" y="13" width="9" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:cloud': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="12" r="4" /><circle cx="15" cy="11" r="5" /><rect x="4" y="12" width="16" height="6" rx="3" />',
  },
  'mdi:cloud-sync': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="12" r="4" /><circle cx="15" cy="11" r="5" /><rect x="4" y="12" width="16" height="6" rx="3" /><path d="M8 16h3v-2l3 3-3 3v-2H8z" fill="currentColor" />',
  },
  'mdi:cloud-outline': {
    viewBox: '0 0 24 24',
    svg: '<path d="M8 17h9a4 4 0 0 0 0-8h-1a5 5 0 0 0-9 1 3.5 3.5 0 0 0 1 7z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:server': {
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /><circle cx="7" cy="7" r="1" /><circle cx="7" cy="17" r="1" />',
  },
  'mdi:database': {
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="5" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><rect x="5" y="5" width="14" height="10" fill="none" stroke="currentColor" stroke-width="2" /><ellipse cx="12" cy="15" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:database-outline': {
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="5" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><rect x="5" y="5" width="14" height="10" fill="none" stroke="currentColor" stroke-width="2" /><ellipse cx="12" cy="15" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:database-search': {
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="11" cy="6" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><rect x="4" y="6" width="14" height="9" fill="none" stroke="currentColor" stroke-width="2" /><ellipse cx="11" cy="15" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="18" cy="16" r="2.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="M19.8 18.1l2.2 2.2" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:database-lock': {
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="11" cy="6" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><rect x="4" y="6" width="14" height="9" fill="none" stroke="currentColor" stroke-width="2" /><ellipse cx="11" cy="15" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2" /><rect x="15" y="14" width="6" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="2" /><path d="M16.5 14v-1a2 2 0 0 1 4 0v1" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:storage': {
    viewBox: '0 0 24 24',
    svg: '<rect x="4" y="6" width="16" height="12" rx="2" /><rect x="6" y="8" width="12" height="2" />',
  },
  'mdi:function': {
    viewBox: '0 0 24 24',
    d: 'M13 2L6 13h5l-1 9 7-11h-5l1-9z',
  },
  'mdi:container': {
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="6" width="18" height="12" rx="2" /><rect x="6" y="9" width="4" height="6" /><rect x="11" y="9" width="4" height="6" /><rect x="16" y="9" width="2" height="6" />',
  },
  'mdi:cloud-queue': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="12" r="4" /><circle cx="15" cy="11" r="5" /><rect x="4" y="12" width="16" height="6" rx="3" /><rect x="6" y="18" width="3" height="3" /><rect x="11" y="18" width="3" height="3" /><rect x="16" y="18" width="3" height="3" />',
  },
  'mdi:kubernetes': {
    viewBox: '0 0 24 24',
    svg: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" /><circle cx="12" cy="12" r="2.5" />',
  },
  'mdi:pipeline': {
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="5" width="6" height="6" rx="1" /><rect x="15" y="13" width="6" height="6" rx="1" /><rect x="15" y="5" width="6" height="6" rx="1" /><path d="M9 8h6M12 11v2M9 16h6" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:git': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8 6h6M12 8v6M12 14l3 2" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:package-variant': {
    viewBox: '0 0 24 24',
    svg: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M12 4v16" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:package_variant': {
    viewBox: '0 0 24 24',
    svg: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M12 4v16" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:hammer-wrench': {
    viewBox: '0 0 24 24',
    svg: '<path d="M14 4l2 2-2 2-2-2 2-2zM5 19l6-6 2 2-6 6H5zM15 9l3 3-2 2-3-3 2-2z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:hammer_wrench': {
    viewBox: '0 0 24 24',
    svg: '<path d="M14 4l2 2-2 2-2-2 2-2zM5 19l6-6 2 2-6 6H5zM15 9l3 3-2 2-3-3 2-2z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:rocket-launch': {
    viewBox: '0 0 24 24',
    svg: '<path d="M14 3c3 1 5 4 5 7l-4 4-6-6 4-4z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M5 19l4-4 2 2-4 4H5z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:rocket_launch': {
    viewBox: '0 0 24 24',
    svg: '<path d="M14 3c3 1 5 4 5 7l-4 4-6-6 4-4z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M5 19l4-4 2 2-4 4H5z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:shield': {
    viewBox: '0 0 24 24',
    d: 'M12 2l8 4v6c0 5-3.5 9-8 12-4.5-3-8-7-8-12V6l8-4z',
  },
  'mdi:key': {
    viewBox: '0 0 24 24',
    d: 'M14 6a4 4 0 1 0 3.7 5.5H22v3h-3v3h-3v-3h-2.3A4 4 0 0 0 14 6z',
  },
  'mdi:user': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 14.5-4 16 0" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:users': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="9" r="3" /><circle cx="16" cy="10" r="2.5" /><path d="M3 20c1.3-3.5 11.7-3.5 13 0" stroke="currentColor" stroke-width="2" fill="none" /><path d="M12 20c.7-2 6.3-2 7 0" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:account-group': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="8" cy="9" r="3" /><circle cx="16.5" cy="10" r="2.5" /><path d="M3 20c1.3-3.5 11.7-3.5 13 0" stroke="currentColor" stroke-width="2" fill="none" /><path d="M12 20c.7-2 6.3-2 7 0" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:briefcase': {
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2" /><path d="M9 7V5h6v2" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:chart-line': {
    viewBox: '0 0 24 24',
    svg: '<path d="M4 18V6" stroke="currentColor" stroke-width="2" /><path d="M4 18h16" stroke="currentColor" stroke-width="2" /><path d="M6 14l4-4 4 3 4-6" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:cash': {
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:cloud-check': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="12" r="4" /><circle cx="15" cy="11" r="5" /><rect x="4" y="12" width="16" height="6" rx="3" /><path d="M10 16l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:lock': {
    viewBox: '0 0 24 24',
    svg: '<rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  'mdi:shield-outline': {
    viewBox: '0 0 24 24',
    svg: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:key-variant': {
    viewBox: '0 0 24 24',
    svg: '<circle cx="8" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="2" /><path d="M11 11h9v3h-3v3h-3v-3h-3z" fill="none" stroke="currentColor" stroke-width="2" />',
  },
  'mdi:alert-outline': {
    viewBox: '0 0 24 24',
    svg: '<path d="M12 4l8 14H4l8-14z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M12 9v4" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="15.5" r="1" fill="currentColor" />',
  },
  'mdi:file-document-alert': {
    viewBox: '0 0 24 24',
    svg: '<path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" /><path d="M14 3v4h4" stroke="currentColor" stroke-width="2" /><path d="M12 12v3" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="17" r="1" fill="currentColor" />',
  },
};

const iconMap: Record<string, IconDefinition> = {
  ...manualIconMap,
  ...generatedIconMap,
};

function resolveIconName(name: string): string[] {
  const trimmed = name.trim();
  if (!trimmed) return [];
  const normalized = trimmed.replace(/_/g, '-');
  const candidates = new Set<string>();
  const add = (value: string) => {
    if (value) candidates.add(value);
  };
  if (trimmed.includes(':')) {
    add(trimmed);
    if (normalized !== trimmed) add(normalized);
    return Array.from(candidates);
  }

  const prefixCandidates = ['mdi', 'cloud', 'logos'];
  for (const prefix of prefixCandidates) {
    const dashed = `${prefix}-`;
    const underscored = `${prefix}_`;
    if (normalized.startsWith(dashed)) {
      add(`${prefix}:${normalized.slice(dashed.length)}`);
    }
    if (trimmed.startsWith(underscored)) {
      add(`${prefix}:${trimmed.slice(underscored.length)}`);
    }
  }

  add(trimmed);
  add(normalized);
  add(`mdi:${trimmed}`);
  add(`mdi:${normalized}`);
  return Array.from(candidates);
}

export class IconifyProvider implements IconProvider {
  id = 'iconify';

  getIcon(name: string): IconDefinition | undefined {
    const candidates = resolveIconName(name);
    for (const key of candidates) {
      const icon = iconMap[key];
      if (icon) return icon;
    }
    return undefined;
  }

  getPath(): { d: string; viewBox: string } | undefined {
    return undefined;
  }
}

export const iconify = new IconifyProvider();
