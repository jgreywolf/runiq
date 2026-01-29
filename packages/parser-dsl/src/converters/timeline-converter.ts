import type {
  TimelineEvent,
  TimelineLane,
  TimelineTask,
  TimelineMilestone,
  TimelineDependency,
  TimelinePeriod,
  TimelineProfile,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

/**
 * Convert TimelineProfile from Langium AST to core format
 */
export function convertTimelineProfile(
  profile: Langium.TimelineProfile
): TimelineProfile {
  const timelineProfile: TimelineProfile = {
    type: ProfileType.TIMELINE,
    astVersion: '1.0.0',
    title: profile.name.replace(/^"|"$/g, ''),
    orientation: 'horizontal', // Default value
    events: [],
    periods: [],
    lanes: [],
    tasks: [],
    milestones: [],
    dependencies: [],
  };

  const ensureLane = (id: string, partial?: Partial<TimelineLane>) => {
    if (!timelineProfile.lanes) {
      timelineProfile.lanes = [];
    }
    const existing = timelineProfile.lanes.find((lane) => lane.id === id);
    if (existing) {
      Object.assign(existing, partial);
      return existing;
    }
    const lane: TimelineLane = { id, ...partial };
    timelineProfile.lanes.push(lane);
    return lane;
  };

  const parseFillColor = (value: string): string =>
    value.replace(/^"|"$/g, '');

  const parseLaneId = (value: string): string =>
    unescapeString(value);

  const parseTask = (
    statement: Langium.TimelineTaskStatement,
    laneOverride?: string
  ): TimelineTask => {
    const task: Partial<TimelineTask> = {
      id: unescapeString(statement.id),
      lane: laneOverride,
    };

    for (const prop of statement.properties) {
      if (Langium.isTimelineStartDateProperty(prop)) {
        task.startDate = prop.startDate.replace(/^"|"$/g, '');
      } else if (Langium.isTimelineEndDateProperty(prop)) {
        task.endDate = prop.endDate.replace(/^"|"$/g, '');
      } else if (Langium.isTimelineLabelProperty(prop)) {
        task.label = unescapeString(prop.label);
      } else if (Langium.isTimelineDescriptionProperty(prop)) {
        task.description = prop.description.replace(/^"|"$/g, '');
      } else if (Langium.isTimelineFillColorProperty(prop)) {
        task.fillColor = parseFillColor(prop.color);
      } else if (Langium.isTimelineLaneRefProperty(prop)) {
        task.lane = parseLaneId(prop.lane);
      }
    }

    return task as TimelineTask;
  };

  const parseMilestone = (
    statement: Langium.TimelineMilestoneStatement,
    laneOverride?: string
  ): TimelineMilestone => {
    const milestone: Partial<TimelineMilestone> = {
      id: unescapeString(statement.id),
      lane: laneOverride,
    };

    for (const prop of statement.properties) {
      if (Langium.isTimelineDateProperty(prop)) {
        milestone.date = prop.date.replace(/^"|"$/g, '');
      } else if (Langium.isTimelineLabelProperty(prop)) {
        milestone.label = unescapeString(prop.label);
      } else if (Langium.isTimelineDescriptionProperty(prop)) {
        milestone.description = prop.description.replace(/^"|"$/g, '');
      } else if (Langium.isTimelineFillColorProperty(prop)) {
        milestone.fillColor = parseFillColor(prop.color);
      } else if (Langium.isTimelineLaneRefProperty(prop)) {
        milestone.lane = parseLaneId(prop.lane);
      }
    }

    return milestone as TimelineMilestone;
  };

  // Process timeline statements
  for (const statement of profile.statements) {
    if (Langium.isTimelineEventStatement(statement)) {
      // event E1 date:"2024-01-15" label:"Kickoff" description:"..." icon:"rocket" textColor:"#0066cc"
      const event: Partial<TimelineEvent> = {
        id: unescapeString(statement.id),
      };

      // Extract properties from the properties array
      for (const prop of statement.properties) {
        if (Langium.isTimelineDateProperty(prop)) {
          event.date = prop.date.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineLabelProperty(prop)) {
          event.label = unescapeString(prop.label);
        } else if (Langium.isTimelineDescriptionProperty(prop)) {
          event.description = prop.description.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineIconProperty(prop)) {
          event.icon = prop.icon.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineColorProperty(prop)) {
          event.fillColor = prop.color.replace(/^"|"$/g, '');
        } else if (Langium.isTimelinePositionProperty(prop)) {
          event.position = prop.position as 'top' | 'bottom';
        }
      }

      timelineProfile.events.push(event as TimelineEvent);
    } else if (Langium.isTimelinePeriodStatement(statement)) {
      // period P1 startDate:"2024-01-15" endDate:"2024-02-15" label:"Planning" textColor:"#e0e0e0" opacity:0.3
      const period: Partial<TimelinePeriod> = {
        id: unescapeString(statement.id),
      };

      // Extract properties
      for (const prop of statement.properties) {
        if (Langium.isTimelineStartDateProperty(prop)) {
          period.startDate = prop.startDate.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineEndDateProperty(prop)) {
          period.endDate = prop.endDate.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineLabelProperty(prop)) {
          period.label = unescapeString(prop.label);
        } else if (Langium.isTimelineColorProperty(prop)) {
          period.fillColor = prop.color.replace(/^"|"$/g, '');
        } else if (Langium.isTimelineFillColorProperty(prop)) {
          period.fillColor = parseFillColor(prop.color);
        } else if (Langium.isTimelineOpacityProperty(prop)) {
          period.opacity = parseFloat(prop.opacity);
        }
      }

      if (timelineProfile.periods) {
        timelineProfile.periods.push(period as TimelinePeriod);
      }
    } else if (Langium.isTimelineOrientationStatement(statement)) {
      // orientation horizontal | vertical
      timelineProfile.orientation = statement.orientation as
        | 'horizontal'
        | 'vertical';
    } else if (Langium.isTimelineLaneStatement(statement)) {
      const lane: Partial<TimelineLane> = {
        id: unescapeString(statement.id),
      };

      for (const prop of statement.properties) {
        if (Langium.isTimelineLabelProperty(prop)) {
          lane.label = unescapeString(prop.label);
        } else if (Langium.isTimelineColorProperty(prop)) {
          lane.textColor = parseFillColor(prop.color);
        } else if (Langium.isTimelineFillColorProperty(prop)) {
          lane.fillColor = parseFillColor(prop.color);
        }
      }

      ensureLane(lane.id as string, lane);

      for (const child of statement.statements) {
        if (Langium.isTimelineTaskStatement(child)) {
          timelineProfile.tasks?.push(parseTask(child, lane.id as string));
        } else if (Langium.isTimelineMilestoneStatement(child)) {
          timelineProfile.milestones?.push(parseMilestone(child, lane.id as string));
        }
      }
    } else if (Langium.isTimelineTaskStatement(statement)) {
      timelineProfile.tasks?.push(parseTask(statement));
    } else if (Langium.isTimelineMilestoneStatement(statement)) {
      timelineProfile.milestones?.push(parseMilestone(statement));
    } else if (Langium.isTimelineDependencyStatement(statement)) {
      const dependency: TimelineDependency = {
        from: unescapeString(statement.from),
        to: unescapeString(statement.to),
      };
      timelineProfile.dependencies?.push(dependency);
    } else if (Langium.isThemeDeclaration(statement)) {
      timelineProfile.theme = statement.value;
    }
  }

  return timelineProfile;
}
