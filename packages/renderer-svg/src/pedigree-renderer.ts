import { createTextMeasurer, getDiagramTheme } from '@runiq/core';
import type { PedigreeParentage, PedigreePerson, PedigreeProfile } from '@runiq/core';
import { renderDefs } from './renderers/defs.js';
import { escapeXml } from './renderers/utils.js';

export interface PedigreeRenderOptions {
  theme?: string;
  title?: string;
}

export interface PedigreeRenderResult {
  svg: string;
  warnings: string[];
}

type PositionedPerson = {
  person: PedigreePerson;
  x: number;
  y: number;
  width: number;
  height: number;
};

type MarriageAnchor = {
  x: number;
  y: number;
};

const DEFAULTS = {
  margin: 40,
  rowGap: 60,
  colGap: 40,
  paddingX: 12,
  paddingY: 10,
  nameFontSize: 14,
  detailFontSize: 11,
  lineHeight: 1.2,
  marriageNodeRadius: 4,
  parentageDrop: 12,
  siblingBarHalf: 10,
};

function formatLifeSpan(person: PedigreePerson): string | null {
  if (!person.dob && !person.dod) return null;
  const start = person.dob ? person.dob : '?';
  const end = person.dod ? person.dod : '';
  return end ? `${start} \u2013 ${end}` : start;
}

function computeGenerations(
  people: PedigreePerson[],
  parentages: PedigreeParentage[],
  spouses: { left: string; right: string }[]
): Map<string, number> {
  const generation = new Map<string, number>();
  for (const person of people) {
    generation.set(person.id, 0);
  }

  for (let i = 0; i < people.length; i += 1) {
    let changed = false;
    for (const spouse of spouses) {
      const leftGen = generation.get(spouse.left);
      const rightGen = generation.get(spouse.right);
      if (leftGen === undefined || rightGen === undefined) continue;
      if (leftGen !== rightGen) {
        const aligned = Math.max(leftGen, rightGen);
        generation.set(spouse.left, aligned);
        generation.set(spouse.right, aligned);
        changed = true;
      }
    }
    for (const parentage of parentages) {
      const childGen = generation.get(parentage.child) ?? 0;
      const maxParentGen =
        parentage.parents.reduce(
          (max, parentId) => Math.max(max, generation.get(parentId) ?? 0),
          0
        ) + 1;
      if (maxParentGen > childGen) {
        generation.set(parentage.child, maxParentGen);
        changed = true;
      }
    }
    if (!changed) break;
  }

  return generation;
}

function getSexColorIndex(sex?: PedigreePerson['sex']): number {
  if (sex === 'female') return 1;
  if (sex === 'unknown') return 2;
  return 0;
}

function getPairKey(left: string, right: string): string {
  return [left, right].sort().join('::');
}

function getParentsKey(parents: string[]): string {
  return [...parents].sort().join('::');
}

export function renderPedigree(
  profile: PedigreeProfile,
  options: PedigreeRenderOptions = {}
): PedigreeRenderResult {
  const warnings: string[] = [];
  const theme = getDiagramTheme(options.theme);
  const measureText = createTextMeasurer();

  const sizeById = new Map<string, { width: number; height: number }>();
  for (const person of profile.people) {
    const nameMetrics = measureText(person.name, {
      fontSize: DEFAULTS.nameFontSize,
    });
    const lifeSpan = formatLifeSpan(person);
    const detailMetrics = lifeSpan
      ? measureText(lifeSpan, { fontSize: DEFAULTS.detailFontSize })
      : { width: 0 };
    const contentWidth = Math.max(nameMetrics.width, detailMetrics.width);
    const lines = lifeSpan ? 2 : 1;
    const height =
      lines * DEFAULTS.nameFontSize * DEFAULTS.lineHeight +
      DEFAULTS.paddingY * 2 +
      (lifeSpan ? DEFAULTS.detailFontSize * 0.2 : 0);
    const width = contentWidth + DEFAULTS.paddingX * 2;
    sizeById.set(person.id, { width, height });
  }

  const spouseChildClusters = new Map<string, string[]>();
  for (const parentage of profile.parentages) {
    if (parentage.parents.length !== 2) continue;
    const key = getPairKey(parentage.parents[0], parentage.parents[1]);
    if (!spouseChildClusters.has(key)) spouseChildClusters.set(key, []);
    spouseChildClusters.get(key)?.push(parentage.child);
  }
  const spouseClusterWidth = new Map<string, number>();
  for (const [key, children] of spouseChildClusters.entries()) {
    const uniqueChildren = Array.from(new Set(children));
    if (uniqueChildren.length === 0) continue;
    const width =
      uniqueChildren.reduce((sum, id) => {
        const size = sizeById.get(id);
        return sum + (size?.width ?? 0);
      }, 0) +
      DEFAULTS.colGap * Math.max(0, uniqueChildren.length - 1);
    spouseClusterWidth.set(key, width);
  }

  const generationMap = computeGenerations(
    profile.people,
    profile.parentages,
    profile.spouses
  );
  const spouseOrder = new Map<string, number>();
  profile.spouses.forEach((spouse, index) => {
    spouseOrder.set(getPairKey(spouse.left, spouse.right), index);
  });
  const parentageByChild = new Map<string, PedigreeParentage>();
  for (const parentage of profile.parentages) {
    const existing = parentageByChild.get(parentage.child);
    if (!existing) {
      parentageByChild.set(parentage.child, parentage);
    } else if (existing.parents.length < 2 && parentage.parents.length === 2) {
      parentageByChild.set(parentage.child, parentage);
    }
  }
  const rows = new Map<number, PedigreePerson[]>();
  for (const person of profile.people) {
    const level = generationMap.get(person.id) ?? 0;
    if (!rows.has(level)) rows.set(level, []);
    rows.get(level)?.push(person);
  }

  const peopleById = new Map(profile.people.map((person) => [person.id, person]));

  for (const row of rows.values()) {
    const rowIds = new Set(row.map((person) => person.id));
    const grouped: PedigreePerson[][] = [];
    const used = new Set<string>();

    for (const spouse of profile.spouses) {
      if (!rowIds.has(spouse.left) || !rowIds.has(spouse.right)) continue;
      if (used.has(spouse.left) || used.has(spouse.right)) continue;
      const left = peopleById.get(spouse.left);
      const right = peopleById.get(spouse.right);
      if (!left || !right) continue;
      const pair = [left, right].sort((a, b) => a.name.localeCompare(b.name));
      grouped.push(pair);
      used.add(spouse.left);
      used.add(spouse.right);
    }

    const singles = row
      .filter((person) => !used.has(person.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((person) => [person]);

    const orderedGroups = [...grouped, ...singles].sort((a, b) => {
      const aName = a[0]?.name ?? '';
      const bName = b[0]?.name ?? '';
      return aName.localeCompare(bName);
    });

    row.length = 0;
    for (const group of orderedGroups) {
      row.push(...group);
    }
  }

  const positioned: PositionedPerson[] = [];
  const positionedById = new Map<string, PositionedPerson>();
  let maxWidth = 0;
  let yCursor = DEFAULTS.margin;
  const orderedRows = Array.from(rows.entries()).sort((a, b) => a[0] - b[0]);

  for (const [, people] of orderedRows) {
    let rowHeight = 0;
    const rowSizes = people.map((person) => {
      const size = sizeById.get(person.id);
      const width = size?.width ?? 0;
      const height = size?.height ?? 0;
      rowHeight = Math.max(rowHeight, height);
      const parentage = parentageByChild.get(person.id);
      let desiredCenter: number | null = null;
      if (parentage) {
        const parentIds = parentage.parents;
        if (parentIds.length >= 1) {
          const leftParent = positionedById.get(parentIds[0]);
          const rightParent =
            parentIds.length > 1
              ? positionedById.get(parentIds[1])
              : undefined;
          if (leftParent && rightParent) {
            desiredCenter =
              (leftParent.x +
                leftParent.width / 2 +
                rightParent.x +
                rightParent.width / 2) /
              2;
          } else if (leftParent) {
            desiredCenter = leftParent.x + leftParent.width / 2;
          }
        }
      }
      return { person, width, height, desiredCenter };
    });

    const rowSizeById = new Map(
      rowSizes.map((size) => [size.person.id, size])
    );
    const rowIds = new Set(people.map((person) => person.id));
    const groupedIds: string[][] = [];
    const used = new Set<string>();

    const siblingGroups = new Map<string, string[]>();
    for (const parentage of profile.parentages) {
      if (!rowIds.has(parentage.child)) continue;
      const key = getParentsKey(parentage.parents);
      if (!siblingGroups.has(key)) siblingGroups.set(key, []);
      siblingGroups.get(key)?.push(parentage.child);
    }

    for (const group of siblingGroups.values()) {
      const unique = Array.from(new Set(group));
      if (unique.length === 0) continue;
      unique.sort((a, b) => {
        const aPerson = peopleById.get(a);
        const bPerson = peopleById.get(b);
        return (aPerson?.name ?? a).localeCompare(bPerson?.name ?? b);
      });
      groupedIds.push(unique);
      unique.forEach((id) => used.add(id));
    }

    for (const spouse of profile.spouses) {
      if (!rowIds.has(spouse.left) || !rowIds.has(spouse.right)) continue;
      if (used.has(spouse.left) || used.has(spouse.right)) continue;
      groupedIds.push([spouse.left, spouse.right]);
      used.add(spouse.left);
      used.add(spouse.right);
    }

    for (const person of people) {
      if (!used.has(person.id)) {
        groupedIds.push([person.id]);
      }
    }

    const orderedGroups = groupedIds.sort((groupA, groupB) => {
      const desiredA = groupA
        .map((id) => rowSizeById.get(id)?.desiredCenter)
        .filter((val): val is number => typeof val === 'number');
      const desiredB = groupB
        .map((id) => rowSizeById.get(id)?.desiredCenter)
        .filter((val): val is number => typeof val === 'number');
      const centerA =
        desiredA.length > 0
          ? desiredA.reduce((sum, val) => sum + val, 0) / desiredA.length
          : null;
      const centerB =
        desiredB.length > 0
          ? desiredB.reduce((sum, val) => sum + val, 0) / desiredB.length
          : null;

      if (centerA !== null || centerB !== null) {
        const aVal = centerA ?? Number.POSITIVE_INFINITY;
        const bVal = centerB ?? Number.POSITIVE_INFINITY;
        if (aVal !== bVal) return aVal - bVal;
      }

      const keyA =
        groupA.length === 2
          ? spouseOrder.get(getPairKey(groupA[0], groupA[1])) ??
            Number.POSITIVE_INFINITY
          : rowSizeById.get(groupA[0])?.person.name ?? '';
      const keyB =
        groupB.length === 2
          ? spouseOrder.get(getPairKey(groupB[0], groupB[1])) ??
            Number.POSITIVE_INFINITY
          : rowSizeById.get(groupB[0])?.person.name ?? '';
      if (typeof keyA === 'number' || typeof keyB === 'number') {
        return Number(keyA) - Number(keyB);
      }
      return String(keyA).localeCompare(String(keyB));
    });

    let xCursor = DEFAULTS.margin;
    const groupLayouts = orderedGroups.map((group) => {
      const sizes = group
        .map((id) => rowSizeById.get(id))
        .filter((value): value is typeof rowSizes[number] => Boolean(value))
        .sort((a, b) => {
          const aCenter = a.desiredCenter ?? Number.POSITIVE_INFINITY;
          const bCenter = b.desiredCenter ?? Number.POSITIVE_INFINITY;
          if (aCenter !== bCenter) return aCenter - bCenter;
          return a.person.name.localeCompare(b.person.name);
        });
      const baseGroupWidth =
        sizes.reduce((sum, size) => sum + size.width, 0) +
        DEFAULTS.colGap * Math.max(0, sizes.length - 1);
      let groupWidth = baseGroupWidth;
      let pairSpan = false;
      if (group.length === 2) {
        const pairKey = getPairKey(group[0], group[1]);
        const clusterWidth = spouseClusterWidth.get(pairKey);
        if (clusterWidth && clusterWidth > baseGroupWidth) {
          groupWidth = clusterWidth;
          pairSpan = true;
        }
      }
      const desiredCenters = sizes
        .map((size) => size.desiredCenter)
        .filter((val): val is number => typeof val === 'number');
      const groupCenter =
        desiredCenters.length > 0
          ? desiredCenters.reduce((sum, val) => sum + val, 0) /
            desiredCenters.length
          : null;
      const preferredStart =
        groupCenter !== null ? groupCenter - groupWidth / 2 : xCursor;
      return {
        sizes,
        groupWidth,
        groupCenter,
        preferredStart,
        start: preferredStart,
        pairSpan,
      };
    });

    groupLayouts.sort((a, b) => {
      const aVal = a.groupCenter ?? Number.POSITIVE_INFINITY;
      const bVal = b.groupCenter ?? Number.POSITIVE_INFINITY;
      if (aVal !== bVal) return aVal - bVal;
      return a.preferredStart - b.preferredStart;
    });

    for (let i = 0; i < groupLayouts.length; i += 1) {
      const previous = i > 0 ? groupLayouts[i - 1] : null;
      const minStart = previous
        ? previous.start + previous.groupWidth + DEFAULTS.colGap
        : DEFAULTS.margin;
      if (groupLayouts[i].start < minStart) {
        groupLayouts[i].start = minStart;
      }
    }

    for (let i = groupLayouts.length - 2; i >= 0; i -= 1) {
      const current = groupLayouts[i];
      const next = groupLayouts[i + 1];
      const maxStart =
        next.start - DEFAULTS.colGap - current.groupWidth;
      if (current.start > maxStart) {
        current.start = maxStart;
      }
    }

    xCursor = DEFAULTS.margin;
    for (const groupLayout of groupLayouts) {
      let memberX = Math.max(groupLayout.start, xCursor);
      if (groupLayout.pairSpan && groupLayout.sizes.length === 2) {
        const [left, right] = groupLayout.sizes;
        const leftX = memberX;
        const rightX = memberX + groupLayout.groupWidth - right.width;
        const leftPlaced = {
          person: left.person,
          x: leftX,
          y: yCursor,
          width: left.width,
          height: left.height,
        };
        const rightPlaced = {
          person: right.person,
          x: rightX,
          y: yCursor,
          width: right.width,
          height: right.height,
        };
        positioned.push(leftPlaced, rightPlaced);
        positionedById.set(left.person.id, leftPlaced);
        positionedById.set(right.person.id, rightPlaced);
        memberX = Math.max(leftX + left.width, rightX + right.width) + DEFAULTS.colGap;
      } else {
        for (const { person, width, height } of groupLayout.sizes) {
          positioned.push({
            person,
            x: memberX,
            y: yCursor,
            width,
            height,
          });
          const placed = positioned[positioned.length - 1];
          positionedById.set(person.id, placed);
          memberX += width + DEFAULTS.colGap;
        }
      }
      xCursor = Math.max(xCursor, memberX);
    }

    maxWidth = Math.max(maxWidth, xCursor - DEFAULTS.colGap + DEFAULTS.margin);
    yCursor += rowHeight + DEFAULTS.rowGap;
  }

  const totalHeight =
    (positioned.length > 0
      ? Math.max(...positioned.map((node) => node.y + node.height))
      : DEFAULTS.margin) + DEFAULTS.margin;
  const totalWidth = Math.max(maxWidth, DEFAULTS.margin * 2);

  const nodeById = new Map(positioned.map((node) => [node.person.id, node]));
  const marriageAnchors = new Map<string, MarriageAnchor>();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">`;
  const title = options.title || profile.name || 'Pedigree';
  svg += `<title id="diagram-title">${escapeXml(title)}</title>`;
  svg += renderDefs();

  // Relationships first
  for (const spouse of profile.spouses) {
    const left = nodeById.get(spouse.left);
    const right = nodeById.get(spouse.right);
    if (!left || !right) {
      warnings.push(`Missing spouse participant: ${spouse.left} or ${spouse.right}`);
      continue;
    }
    const leftCenterX = left.x + left.width / 2;
    const rightCenterX = right.x + right.width / 2;
    const leftCenterY = left.y + left.height / 2;
    const rightCenterY = right.y + right.height / 2;
    const midX = (leftCenterX + rightCenterX) / 2;
    const midY = (leftCenterY + rightCenterY) / 2;
    const startX = leftCenterX + left.width / 2;
    const endX = rightCenterX - right.width / 2;
    svg += `<line x1="${startX}" y1="${leftCenterY}" x2="${endX}" y2="${rightCenterY}" stroke="${theme.edgeColor}" stroke-width="2" />`;
    svg += `<circle cx="${midX}" cy="${midY}" r="${DEFAULTS.marriageNodeRadius}" fill="${theme.edgeColor}" />`;
    marriageAnchors.set(getPairKey(spouse.left, spouse.right), {
      x: midX,
      y: midY,
    });
    if (spouse.date) {
      const labelX = midX;
      const labelY = midY - 6;
      svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${theme.textColor}">${escapeXml(
        spouse.date
      )}</text>`;
    }
  }

  const groupedParentages = new Map<string, PedigreeParentage[]>();
  const soloParentages: PedigreeParentage[] = [];

  for (const parentage of profile.parentages) {
    if (parentage.parents.length === 2) {
      const [leftId, rightId] = parentage.parents;
      const key = getPairKey(leftId, rightId);
      if (!groupedParentages.has(key)) groupedParentages.set(key, []);
      groupedParentages.get(key)?.push(parentage);
    } else {
      soloParentages.push(parentage);
    }
  }

  for (const [pairKey, parentages] of groupedParentages.entries()) {
    const [leftId, rightId] = pairKey.split('::');
    const anchor =
      marriageAnchors.get(pairKey) ??
      (() => {
        const left = nodeById.get(leftId);
        const right = nodeById.get(rightId);
        if (!left || !right) return null;
        return {
          x: (left.x + left.width / 2 + right.x + right.width / 2) / 2,
          y: (left.y + left.height / 2 + right.y + right.height / 2) / 2,
        };
      })();

    if (!anchor) {
      for (const parentage of parentages) {
        soloParentages.push(parentage);
      }
      continue;
    }

    const childTops = parentages
      .map((parentage) => nodeById.get(parentage.child))
      .filter((child): child is PositionedPerson => Boolean(child))
      .map((child) => child.y);
    const minChildY = childTops.length > 0 ? Math.min(...childTops) : anchor.y + DEFAULTS.parentageDrop;
    const barY = Math.max(anchor.y + DEFAULTS.parentageDrop, minChildY - DEFAULTS.parentageDrop);

    const visibleChildren = parentages
      .map((parentage) => ({ parentage, child: nodeById.get(parentage.child) }))
      .filter((entry) => Boolean(entry.child));

    if (visibleChildren.length === 1) {
      const entry = visibleChildren[0];
      if (!entry.child) {
        warnings.push(`Missing child: ${entry.parentage.child}`);
        continue;
      }
      const childX = entry.child.x + entry.child.width / 2;
      const childY = entry.child.y;
      const dash =
        entry.parentage.type === 'adopted'
          ? ' stroke-dasharray="6,4"'
          : entry.parentage.type === 'step'
            ? ' stroke-dasharray="2,4"'
            : '';
      svg += `<path d="M ${anchor.x} ${anchor.y} L ${anchor.x} ${barY} L ${childX} ${barY} L ${childX} ${childY}" stroke="${theme.edgeColor}" stroke-width="2" fill="none"${dash} />`;
      continue;
    }

    const childCenters = visibleChildren.map((entry) => {
      const child = entry.child as PositionedPerson;
      return child.x + child.width / 2;
    });
    const barStart = Math.min(...childCenters);
    const barEnd = Math.max(...childCenters);

    svg += `<line x1="${anchor.x}" y1="${anchor.y}" x2="${anchor.x}" y2="${barY}" stroke="${theme.edgeColor}" stroke-width="2" />`;
    svg += `<line x1="${barStart}" y1="${barY}" x2="${barEnd}" y2="${barY}" stroke="${theme.edgeColor}" stroke-width="2" />`;

    for (const entry of visibleChildren) {
      if (!entry.child) {
        warnings.push(`Missing child: ${entry.parentage.child}`);
        continue;
      }
      const childX = entry.child.x + entry.child.width / 2;
      const childY = entry.child.y;
      const dash =
        entry.parentage.type === 'adopted'
          ? ' stroke-dasharray="6,4"'
          : entry.parentage.type === 'step'
            ? ' stroke-dasharray="2,4"'
            : '';
      svg += `<line x1="${childX}" y1="${barY}" x2="${childX}" y2="${childY}" stroke="${theme.edgeColor}" stroke-width="2"${dash} />`;
    }
  }

  for (const parentage of soloParentages) {
    const child = nodeById.get(parentage.child);
    if (!child) {
      warnings.push(`Missing child: ${parentage.child}`);
      continue;
    }
    const childX = child.x + child.width / 2;
    const childY = child.y;
    const dash =
      parentage.type === 'adopted'
        ? ' stroke-dasharray="6,4"'
        : parentage.type === 'step'
          ? ' stroke-dasharray="2,4"'
          : '';
    for (const parentId of parentage.parents) {
      const parent = nodeById.get(parentId);
      if (!parent) {
        warnings.push(`Missing parent: ${parentId}`);
        continue;
      }
      const parentX = parent.x + parent.width / 2;
      const parentY = parent.y + parent.height;
      svg += `<line x1="${parentX}" y1="${parentY}" x2="${childX}" y2="${childY}" stroke="${theme.edgeColor}" stroke-width="2"${dash} />`;
    }
  }

  // Nodes
  for (const node of positioned) {
    const { person, x, y, width, height } = node;
    const fill = theme.nodeColors[getSexColorIndex(person.sex)];
    svg += `<g data-runiq-node="${escapeXml(person.id)}" data-node-id="${escapeXml(
      person.id
    )}">`;
    svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" ry="8" fill="${fill}" stroke="${theme.edgeColor}" stroke-width="1.5" />`;
    const nameX = x + width / 2;
    const nameY = y + DEFAULTS.paddingY + DEFAULTS.nameFontSize;
    svg += `<text x="${nameX}" y="${nameY}" text-anchor="middle" font-family="sans-serif" font-size="${DEFAULTS.nameFontSize}" fill="${theme.textColor}">${escapeXml(
      person.name
    )}</text>`;
    const lifeSpan = formatLifeSpan(person);
    if (lifeSpan) {
      const detailY = nameY + DEFAULTS.nameFontSize * DEFAULTS.lineHeight;
      svg += `<text x="${nameX}" y="${detailY}" text-anchor="middle" font-family="sans-serif" font-size="${DEFAULTS.detailFontSize}" fill="${theme.textColor}">${escapeXml(
        lifeSpan
      )}</text>`;
    }
    if (person.sex) {
      const marker = person.sex === 'male' ? 'M' : person.sex === 'female' ? 'F' : '?';
      svg += `<text x="${x + width - 10}" y="${y + 14}" text-anchor="end" font-family="sans-serif" font-size="10" fill="${theme.textColor}">${marker}</text>`;
    }
    svg += '</g>';
  }

  svg += '</svg>';

  return { svg, warnings };
}
