import type {
  TimelineEvent,
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
  };

  // Process timeline statements
  for (const statement of profile.statements) {
    if (Langium.isTimelineEventStatement(statement)) {
      // event E1 date:"2024-01-15" label:"Kickoff" description:"..." icon:"rocket" textColor:"#0066cc"
      const event: Partial<TimelineEvent> = {
        id: statement.id,
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
        id: statement.id,
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
    }
  }

  return timelineProfile;
}
