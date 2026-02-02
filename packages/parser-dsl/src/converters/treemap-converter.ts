import type { TreemapNode, TreemapProfile } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

function parseNumericValue(value: string | number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function applyNodeProperties(
  node: TreemapNode,
  properties: Langium.TreemapNodeProperty[]
): void {
  for (const prop of properties) {
    if (Langium.isTreemapValueProperty(prop)) {
      const value = parseNumericValue(prop.value);
      if (value !== undefined) {
        node.value = value;
      }
    } else if (Langium.isTreemapColorProperty(prop)) {
      node.color = prop.color.replace(/^"|"$/g, '');
    } else if (Langium.isTreemapLabelProperty(prop)) {
      node.label = unescapeString(prop.label);
    }
  }
}

function parseTreemapItem(
  statement: Langium.TreemapItemStatement
): TreemapNode {
  const node: TreemapNode = {
    label: unescapeString(statement.label),
  };

  applyNodeProperties(node, statement.properties);

  return node;
}

function parseTreemapGroup(
  statement: Langium.TreemapGroupBlock
): TreemapNode {
  const node: TreemapNode = {
    label: unescapeString(statement.label),
    children: [],
  };

  applyNodeProperties(node, statement.properties);

  node.children = statement.children.map((child) => {
    if (Langium.isTreemapGroupBlock(child)) {
      return parseTreemapGroup(child);
    }
    return parseTreemapItem(child);
  });

  return node;
}

export function convertTreemapProfile(
  profile: Langium.TreemapProfile
): TreemapProfile {
  const treemapProfile: TreemapProfile = {
    type: ProfileType.TREEMAP,
    name: profile.name.replace(/^"|"$/g, ''),
    nodes: [],
  };

  for (const statement of profile.statements) {
    if (Langium.isDataSourceDeclaration(statement)) {
      if (!treemapProfile.dataSources) {
        treemapProfile.dataSources = [];
      }
      treemapProfile.dataSources.push({
        format: statement.format.replace(/^"|"$/g, ''),
        key: unescapeString(statement.key),
        source: statement.source.replace(/^"|"$/g, ''),
        options: statement.options?.reduce<Record<string, string | number | boolean>>(
          (acc, opt) => {
            let value: string | number | boolean = opt.value;
            if (typeof value === 'string') {
              const unquoted = value.replace(/^"|"$/g, '');
              if (unquoted === 'true') value = true;
              else if (unquoted === 'false') value = false;
              else value = unquoted;
            }
            acc[opt.name] = value;
            return acc;
          },
          {}
        ),
      });
    } else if (Langium.isDataUseStatement(statement)) {
      treemapProfile.dataUse = unescapeString(statement.source);
    } else if (Langium.isDataMapStatement(statement)) {
      if (!treemapProfile.dataMaps) {
        treemapProfile.dataMaps = [];
      }
      const fields: Record<string, string> = {};
      for (const prop of statement.properties) {
        const key = prop.key.replace(/:$/, '');
        fields[key] = prop.value.replace(/^"|"$/g, '');
      }
      treemapProfile.dataMaps.push({
        source: unescapeString(statement.source),
        target: statement.target,
        fields,
      });
    } else if (Langium.isThemeDeclaration(statement)) {
      treemapProfile.theme = statement.value;
    } else if (Langium.isTreemapLayoutStatement(statement)) {
      treemapProfile.layout = statement.layout as TreemapProfile['layout'];
    } else if (Langium.isTreemapPaddingStatement(statement)) {
      treemapProfile.padding = parseNumericValue(statement.value);
    } else if (Langium.isTreemapGapStatement(statement)) {
      treemapProfile.gap = parseNumericValue(statement.value);
    } else if (Langium.isTreemapShowValuesStatement(statement)) {
      treemapProfile.showValues = statement.value === 'true';
    } else if (Langium.isTreemapShowLegendStatement(statement)) {
      treemapProfile.showLegend = statement.value === 'true';
    } else if (Langium.isTreemapGroupBlock(statement)) {
      treemapProfile.nodes.push(parseTreemapGroup(statement));
    } else if (Langium.isTreemapItemStatement(statement)) {
      treemapProfile.nodes.push(parseTreemapItem(statement));
    }
  }

  return treemapProfile;
}
