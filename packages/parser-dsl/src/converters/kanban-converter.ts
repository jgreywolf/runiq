import type {
  KanbanCard,
  KanbanColumn,
  KanbanProfile,
  KanbanStyle,
  KanbanSwimlane,
} from '@runiq/core';
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

function parseStyle(
  properties: Langium.KanbanStyleProperty[]
): KanbanStyle | undefined {
  const style: KanbanStyle = {};

  for (const prop of properties) {
    if (Langium.isKanbanFillColorProperty(prop)) {
      style.fillColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isKanbanStrokeColorProperty(prop)) {
      style.strokeColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isKanbanTextColorProperty(prop)) {
      style.textColor = prop.value.replace(/^"|"$/g, '');
    } else if (Langium.isKanbanBorderRadiusProperty(prop)) {
      const borderRadius = parseNumericValue(prop.value);
      if (borderRadius !== undefined) {
        style.borderRadius = borderRadius;
      }
    }
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

function parseCard(statement: Langium.KanbanCardStatement): KanbanCard {
  const card: KanbanCard = {
    id: statement.id ? unescapeString(statement.id) : undefined,
    label: unescapeString(statement.label),
  };
  const styleProps: Langium.KanbanStyleProperty[] = [];

  for (const prop of statement.properties) {
    if (Langium.isKanbanDescriptionProperty(prop)) {
      card.description = unescapeString(prop.description);
    } else if (Langium.isKanbanAssigneeProperty(prop)) {
      card.assignee = unescapeString(prop.assignee);
    } else if (Langium.isKanbanPriorityProperty(prop)) {
      card.priority = prop.priority as KanbanCard['priority'];
    } else if (Langium.isKanbanTagsProperty(prop)) {
      card.tags = (prop.value.items || []).map((item) =>
        unescapeString(item)
      );
    } else if (Langium.isKanbanEstimateProperty(prop)) {
      card.estimate = unescapeString(prop.estimate);
    } else if (Langium.isKanbanStyleProperty(prop)) {
      styleProps.push(prop);
    }
  }

  const style = parseStyle(styleProps);
  if (style) {
    card.style = style;
  }

  return card;
}

function parseColumn(statement: Langium.KanbanColumnBlock): KanbanColumn {
  const column: KanbanColumn = {
    id: statement.id ? unescapeString(statement.id) : undefined,
    label: unescapeString(statement.label),
    cards: [],
  };
  const styleProps: Langium.KanbanStyleProperty[] = [];

  for (const prop of statement.properties) {
    if (Langium.isKanbanWipProperty(prop)) {
      column.wipLimit = parseNumericValue(prop.value);
    } else if (Langium.isKanbanMaxCardsProperty(prop)) {
      column.maxCards = parseNumericValue(prop.value);
    } else if (Langium.isKanbanOverflowProperty(prop)) {
      column.overflow = prop.value as KanbanColumn['overflow'];
    } else if (Langium.isKanbanStyleProperty(prop)) {
      styleProps.push(prop);
    }
  }

  const style = parseStyle(styleProps);
  if (style) {
    column.style = style;
  }

  column.cards = statement.cards.map(parseCard);

  return column;
}

function parseSwimlane(statement: Langium.KanbanSwimlaneBlock): KanbanSwimlane {
  const swimlane: KanbanSwimlane = {
    label: statement.label ? unescapeString(statement.label) : undefined,
    columns: statement.columns.map(parseColumn),
  };

  const style = parseStyle(statement.properties);
  if (style) {
    swimlane.style = style;
  }

  return swimlane;
}

export function convertKanbanProfile(
  profile: Langium.KanbanProfile
): KanbanProfile {
  const kanbanProfile: KanbanProfile = {
    type: ProfileType.KANBAN,
    name: profile.name.replace(/^"|"$/g, ''),
    columns: [],
  };

  let swimlane: KanbanSwimlane | undefined;

  for (const statement of profile.statements) {
    if (Langium.isThemeDeclaration(statement)) {
      kanbanProfile.theme = statement.value;
    } else if (Langium.isKanbanSwimlaneBlock(statement)) {
      const lane = parseSwimlane(statement);
      if (!swimlane) {
        swimlane = lane;
      }
      kanbanProfile.columns.push(...lane.columns);
    } else if (Langium.isKanbanColumnBlock(statement)) {
      kanbanProfile.columns.push(parseColumn(statement));
    }
  }

  if (swimlane) {
    swimlane.columns = kanbanProfile.columns;
    kanbanProfile.swimlane = swimlane;
  }

  return kanbanProfile;
}
