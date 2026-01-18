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
      style.borderRadius = Number(prop.value);
    }
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

function parseCard(statement: Langium.KanbanCardStatement): KanbanCard {
  const card: KanbanCard = {
    id: statement.id,
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
    id: statement.id,
    label: unescapeString(statement.label),
    cards: [],
  };
  const styleProps: Langium.KanbanStyleProperty[] = [];

  for (const prop of statement.properties) {
    if (Langium.isKanbanWipProperty(prop)) {
      column.wipLimit = Number(prop.value);
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
