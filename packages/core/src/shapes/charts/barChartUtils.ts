/**
 * Shared utilities for bar chart rendering
 * Used by both vertical and horizontal bar chart implementations
 */

export const DEFAULT_PALETTE = [
  '#4299e1', // blue
  '#48bb78', // green
  '#ed8936', // orange
  '#9f7aea', // purple
  '#f56565', // red
  '#38b2ac', // teal
  '#ed64a6', // pink
  '#ecc94b', // yellow
];

export interface BarData {
  label: string;
  value: number;
}

export interface GroupedBarData {
  label: string;
  values: number[];
}

/**
 * Legend position options
 */
export type LegendPosition =
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left';

/**
 * Check if data is in grouped format
 */
export function isGroupedFormat(data: any): boolean {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return false;
  }

  // Check if first item has 'values' array property
  const firstItem = data.values[0];
  return (
    firstItem &&
    typeof firstItem === 'object' &&
    'values' in firstItem &&
    Array.isArray(firstItem.values)
  );
}

/**
 * Normalize grouped data format
 */
export function normalizeGroupedData(data: any): GroupedBarData[] {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return [];
  }

  return data.values
    .map((item: any): GroupedBarData | null => {
      if (
        typeof item === 'object' &&
        item !== null &&
        Array.isArray(item.values)
      ) {
        const values = item.values
          .map((v: any) => Number(v))
          .filter((v: number) => !isNaN(v) && v > 0);

        if (values.length === 0) return null;

        return {
          label: item.label || 'Group',
          values,
        };
      }
      return null;
    })
    .filter(
      (item: GroupedBarData | null): item is GroupedBarData => item !== null
    );
}

/**
 * Check if data is in stacked format
 */
export function isStackedFormat(data: any): boolean {
  return data && data.stacked === true && isGroupedFormat(data);
}

/**
 * Normalize data into consistent format
 */
export function normalizeData(data: any): BarData[] {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return [];
  }

  return data.values
    .map((item: any, index: number): BarData | null => {
      if (typeof item === 'number') {
        // Filter out zero and negative values
        if (item <= 0) return null;
        return {
          label: `Bar ${index + 1}`,
          value: item,
        };
      }

      if (typeof item === 'object' && item !== null) {
        const value = Number(item.value);
        // Filter out zero and negative values
        if (isNaN(value) || value <= 0) return null;
        return {
          label: item.label || `Bar ${index + 1}`,
          value,
        };
      }

      return null;
    })
    .filter((item: BarData | null): item is BarData => item !== null);
}

/**
 * Get color from palette by index
 */
export function getBarColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}
