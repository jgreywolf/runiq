import type { TreemapNode, TreemapProfile } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

function applyNodeProperties(
  node: TreemapNode,
  properties: Langium.TreemapNodeProperty[]
): void {
  for (const prop of properties) {
    if (Langium.isTreemapValueProperty(prop)) {
      node.value = Number(prop.value);
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
    if (Langium.isThemeDeclaration(statement)) {
      treemapProfile.theme = statement.value;
    } else if (Langium.isTreemapLayoutStatement(statement)) {
      treemapProfile.layout = statement.layout as TreemapProfile['layout'];
    } else if (Langium.isTreemapPaddingStatement(statement)) {
      treemapProfile.padding = Number(statement.value);
    } else if (Langium.isTreemapGapStatement(statement)) {
      treemapProfile.gap = Number(statement.value);
    } else if (Langium.isTreemapGroupBlock(statement)) {
      treemapProfile.nodes.push(parseTreemapGroup(statement));
    } else if (Langium.isTreemapItemStatement(statement)) {
      treemapProfile.nodes.push(parseTreemapItem(statement));
    }
  }

  return treemapProfile;
}
