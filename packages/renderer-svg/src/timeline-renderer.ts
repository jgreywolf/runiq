/**
 * Timeline Renderer for Runiq
 *
 * Renders chronological timelines with:
 * - Events with dates, labels, descriptions, icons, colors
 * - Periods (time ranges) with shaded backgrounds
 * - Horizontal (default) or vertical orientation
 * - Alternating label positions for better readability
 */

import type {
  TimelineEvent,
  TimelinePeriod,
  TimelineProfile,
} from '@runiq/core';
import {
  getThemeEventColor,
  getTimelineTheme,
  Orientation,
  Position,
  type TimelineTheme,
} from '@runiq/core';

export interface TimelineRenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  eventRadius?: number;
  lineStrokeWidth?: number;
  labelFontSize?: number;
  dateFontSize?: number;
  showDates?: boolean;
  defaultEventColor?: string;
  defaultPeriodColor?: string;
  defaultPeriodOpacity?: number;
  title?: string;
}

export interface TimelineRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULT_HORIZONTAL_WIDTH = 1200;
const DEFAULT_HORIZONTAL_HEIGHT = 400;
const DEFAULT_VERTICAL_WIDTH = 600;
const DEFAULT_VERTICAL_HEIGHT = 1000;
const DEFAULT_PADDING = 80;
const DEFAULT_EVENT_RADIUS = 8;
const DEFAULT_LINE_STROKE_WIDTH = 3;
const DEFAULT_LABEL_FONT_SIZE = 14;
const DEFAULT_DATE_FONT_SIZE = 12;
const DEFAULT_PERIOD_OPACITY = 0.3;

/**
 * Main Timeline rendering function
 */
export function renderTimeline(
  profile: TimelineProfile,
  options: TimelineRenderOptions = {}
): TimelineRenderResult {
  const warnings: string[] = [];
  const isHorizontal =
    profile.orientation === Orientation.HORIZONTAL || !profile.orientation;

  // Apply theme if specified in profile
  const theme = (profile as any).theme
    ? getTimelineTheme((profile as any).theme)
    : getTimelineTheme();

  const {
    width = isHorizontal ? DEFAULT_HORIZONTAL_WIDTH : DEFAULT_VERTICAL_WIDTH,
    height = isHorizontal ? DEFAULT_HORIZONTAL_HEIGHT : DEFAULT_VERTICAL_HEIGHT,
    padding = DEFAULT_PADDING,
    eventRadius = DEFAULT_EVENT_RADIUS,
    lineStrokeWidth = DEFAULT_LINE_STROKE_WIDTH,
    labelFontSize = DEFAULT_LABEL_FONT_SIZE,
    dateFontSize = DEFAULT_DATE_FONT_SIZE,
    showDates = true,
    defaultEventColor = theme.eventColors[0],
    defaultPeriodColor = theme.periodColor,
    defaultPeriodOpacity = DEFAULT_PERIOD_OPACITY,
    title = profile.title,
  } = options;

  // Validate profile
  if (!profile.events || profile.events.length === 0) {
    warnings.push('Timeline has no events');
  }

  // Parse and sort events by date
  const sortedEvents = [...(profile.events || [])].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Calculate time range
  if (sortedEvents.length === 0) {
    warnings.push('Cannot render timeline with no events');
    return { svg: '', warnings };
  }

  const startDate = new Date(sortedEvents[0].date);
  const endDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  const timeRange = endDate.getTime() - startDate.getTime();

  // Start SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${width}" height="${height}" 
    viewBox="0 0 ${width} ${height}"
    role="img" aria-labelledby="timeline-title">`;

  // Title
  svg += `<title id="timeline-title">${escapeXml(title)}</title>`;

  // Styles
  svg += generateStyles(defaultEventColor, defaultPeriodColor);

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#FFFFFF"/>`;

  // Render timeline based on orientation
  if (isHorizontal) {
    svg += renderHorizontalTimeline(
      sortedEvents,
      profile.periods || [],
      startDate,
      endDate,
      timeRange,
      width,
      height,
      padding,
      eventRadius,
      lineStrokeWidth,
      labelFontSize,
      dateFontSize,
      showDates,
      defaultEventColor,
      defaultPeriodColor,
      defaultPeriodOpacity,
      theme
    );
  } else {
    svg += renderVerticalTimeline(
      sortedEvents,
      profile.periods || [],
      startDate,
      endDate,
      timeRange,
      width,
      height,
      padding,
      eventRadius,
      lineStrokeWidth,
      labelFontSize,
      dateFontSize,
      showDates,
      defaultEventColor,
      defaultPeriodColor,
      defaultPeriodOpacity,
      theme
    );
  }

  // Close SVG
  svg += '</svg>';

  return { svg, warnings };
}

/**
 * Render horizontal timeline
 */
function renderHorizontalTimeline(
  events: TimelineEvent[],
  periods: TimelinePeriod[],
  startDate: Date,
  _endDate: Date,
  timeRange: number,
  width: number,
  height: number,
  padding: number,
  eventRadius: number,
  lineStrokeWidth: number,
  labelFontSize: number,
  dateFontSize: number,
  showDates: boolean,
  _defaultEventColor: string,
  defaultPeriodColor: string,
  defaultPeriodOpacity: number,
  theme: TimelineTheme
): string {
  let svg = '';
  const timelineY = height / 2;
  const timelineStartX = padding;
  const timelineEndX = width - padding;
  const timelineWidth = timelineEndX - timelineStartX;

  // Helper to convert date to X position
  const dateToX = (date: Date): number => {
    const offset = date.getTime() - startDate.getTime();
    const ratio = timeRange > 0 ? offset / timeRange : 0;
    return timelineStartX + ratio * timelineWidth;
  };

  // Render periods first (as backgrounds)
  for (const period of periods) {
    const periodStartDate = new Date(period.startDate);
    const periodEndDate = new Date(period.endDate);
    const x1 = dateToX(periodStartDate);
    const x2 = dateToX(periodEndDate);
    const periodWidth = x2 - x1;
    const periodColor = period.fillColor || defaultPeriodColor;
    const periodOpacity = period.opacity ?? defaultPeriodOpacity;

    // Period background rectangle
    svg += `<rect 
      x="${x1}" 
      y="${padding}" 
      width="${periodWidth}" 
      height="${height - padding * 2}" 
      fill="${periodColor}" 
      opacity="${periodOpacity}" 
      class="runiq-timeline-period"/>`;

    // Period label (centered in period, at top)
    if (period.label) {
      const labelX = x1 + periodWidth / 2;
      svg += `<text 
        x="${labelX}" 
        y="${padding - 10}" 
        text-anchor="middle" 
        font-size="${dateFontSize}" 
        fill="#666666" 
        class="runiq-timeline-period-label">${escapeXml(period.label)}</text>`;
    }
  }

  // Main timeline line
  svg += `<line 
    x1="${timelineStartX}" 
    y1="${timelineY}" 
    x2="${timelineEndX}" 
    y2="${timelineY}" 
    stroke="#333333" 
    stroke-width="${lineStrokeWidth}" 
    class="runiq-timeline-axis"/>`;

  // Render events
  events.forEach((event, index) => {
    const eventDate = new Date(event.date);
    const x = dateToX(eventDate);
    // Use theme color if no custom color specified
    const eventColor = event.fillColor || getThemeEventColor(theme, index);

    // Alternating label positions (top/bottom) unless specified
    const isTop =
      event.position === Position.TOP ||
      (event.position !== Position.BOTTOM && index % 2 === 0);
    const labelY = isTop ? timelineY - 40 : timelineY + 40;
    const labelAnchor = 'middle';

    // Event marker (circle)
    svg += `<circle 
      cx="${x}" 
      cy="${timelineY}" 
      r="${eventRadius}" 
      fill="${eventColor}" 
      stroke="#FFFFFF" 
      stroke-width="2" 
      class="runiq-timeline-event"/>`;

    // Connector line from event to label
    const connectorEndY = isTop
      ? timelineY - eventRadius - 5
      : timelineY + eventRadius + 5;
    const labelConnectorY = isTop ? labelY + 15 : labelY - 5;
    svg += `<line 
      x1="${x}" 
      y1="${connectorEndY}" 
      x2="${x}" 
      y2="${labelConnectorY}" 
      stroke="${eventColor}" 
      stroke-width="1" 
      stroke-dasharray="2,2" 
      class="runiq-timeline-connector"/>`;

    // Event label
    if (event.label) {
      svg += `<text 
        x="${x}" 
        y="${labelY}" 
        text-anchor="${labelAnchor}" 
        font-size="${labelFontSize}" 
        font-weight="600" 
        fill="#333333" 
        class="runiq-timeline-event-label">${escapeXml(event.label)}</text>`;
    }

    // Event description (smaller text below label)
    if (event.description) {
      const descY = isTop ? labelY + 18 : labelY + 18;
      svg += `<text 
        x="${x}" 
        y="${descY}" 
        text-anchor="${labelAnchor}" 
        font-size="${dateFontSize}" 
        fill="#666666" 
        class="runiq-timeline-event-description">${escapeXml(event.description)}</text>`;
    }

    // Event date (on the axis)
    if (showDates) {
      const dateY = timelineY + eventRadius + 20;
      svg += `<text 
        x="${x}" 
        y="${dateY}" 
        text-anchor="middle" 
        font-size="${dateFontSize}" 
        fill="#999999" 
        class="runiq-timeline-event-date">${formatDate(eventDate)}</text>`;
    }

    // Icon placeholder (future enhancement)
    if (event.icon) {
      // TODO: Implement icon rendering when icon system is available
    }
  });

  return svg;
}

/**
 * Render vertical timeline
 */
function renderVerticalTimeline(
  events: TimelineEvent[],
  periods: TimelinePeriod[],
  startDate: Date,
  _endDate: Date,
  timeRange: number,
  width: number,
  height: number,
  padding: number,
  eventRadius: number,
  lineStrokeWidth: number,
  labelFontSize: number,
  dateFontSize: number,
  showDates: boolean,
  _defaultEventColor: string,
  defaultPeriodColor: string,
  defaultPeriodOpacity: number,
  theme: TimelineTheme
): string {
  let svg = '';
  const timelineX = width / 2;
  const timelineStartY = padding;
  const timelineEndY = height - padding;
  const timelineHeight = timelineEndY - timelineStartY;

  // Helper to convert date to Y position
  const dateToY = (date: Date): number => {
    const offset = date.getTime() - startDate.getTime();
    const ratio = timeRange > 0 ? offset / timeRange : 0;
    return timelineStartY + ratio * timelineHeight;
  };

  // Render periods first (as backgrounds)
  for (const period of periods) {
    const periodStartDate = new Date(period.startDate);
    const periodEndDate = new Date(period.endDate);
    const y1 = dateToY(periodStartDate);
    const y2 = dateToY(periodEndDate);
    const periodHeight = y2 - y1;
    const periodColor = period.fillColor || defaultPeriodColor;
    const periodOpacity = period.opacity ?? defaultPeriodOpacity;

    // Period background rectangle
    svg += `<rect 
      x="${padding}" 
      y="${y1}" 
      width="${width - padding * 2}" 
      height="${periodHeight}" 
      fill="${periodColor}" 
      opacity="${periodOpacity}" 
      class="runiq-timeline-period"/>`;

    // Period label (centered in period, on the left side)
    if (period.label) {
      const labelY = y1 + periodHeight / 2;
      svg += `<text 
        x="${padding - 10}" 
        y="${labelY}" 
        text-anchor="end" 
        font-size="${dateFontSize}" 
        fill="#666666" 
        alignment-baseline="middle" 
        class="runiq-timeline-period-label">${escapeXml(period.label)}</text>`;
    }
  }

  // Main timeline line
  svg += `<line 
    x1="${timelineX}" 
    y1="${timelineStartY}" 
    x2="${timelineX}" 
    y2="${timelineEndY}" 
    stroke="#333333" 
    stroke-width="${lineStrokeWidth}" 
    class="runiq-timeline-axis"/>`;

  // Render events
  events.forEach((event, index) => {
    const eventDate = new Date(event.date);
    const y = dateToY(eventDate);
    // Use theme color if no custom color specified
    const eventColor = event.fillColor || getThemeEventColor(theme, index);

    // Alternating label positions (left/right) unless specified
    const isLeft =
      event.position === Position.LEFT ||
      (event.position !== Position.RIGHT && index % 2 === 0);
    const labelX = isLeft ? timelineX - 40 : timelineX + 40;
    const labelAnchor = isLeft ? 'end' : 'start';

    // Event marker (circle)
    svg += `<circle 
      cx="${timelineX}" 
      cy="${y}" 
      r="${eventRadius}" 
      fill="${eventColor}" 
      stroke="#FFFFFF" 
      stroke-width="2" 
      class="runiq-timeline-event"/>`;

    // Connector line from event to label
    const connectorEndX = isLeft
      ? timelineX - eventRadius - 5
      : timelineX + eventRadius + 5;
    const labelConnectorX = isLeft ? labelX + 5 : labelX - 5;
    svg += `<line 
      x1="${connectorEndX}" 
      y1="${y}" 
      x2="${labelConnectorX}" 
      y2="${y}" 
      stroke="${eventColor}" 
      stroke-width="1" 
      stroke-dasharray="2,2" 
      class="runiq-timeline-connector"/>`;

    // Event label
    if (event.label) {
      svg += `<text 
        x="${labelX}" 
        y="${y - 5}" 
        text-anchor="${labelAnchor}" 
        font-size="${labelFontSize}" 
        font-weight="600" 
        fill="#333333" 
        class="runiq-timeline-event-label">${escapeXml(event.label)}</text>`;
    }

    // Event description (smaller text below label)
    if (event.description) {
      const descY = y + 10;
      svg += `<text 
        x="${labelX}" 
        y="${descY}" 
        text-anchor="${labelAnchor}" 
        font-size="${dateFontSize}" 
        fill="#666666" 
        class="runiq-timeline-event-description">${escapeXml(event.description)}</text>`;
    }

    // Event date
    if (showDates) {
      const dateX = isLeft ? labelX : labelX;
      const dateY = y + 25;
      svg += `<text 
        x="${dateX}" 
        y="${dateY}" 
        text-anchor="${labelAnchor}" 
        font-size="${dateFontSize}" 
        fill="#999999" 
        class="runiq-timeline-event-date">${formatDate(eventDate)}</text>`;
    }

    // Icon placeholder (future enhancement)
    if (event.icon) {
      // TODO: Implement icon rendering when icon system is available
    }
  });

  return svg;
}

/**
 * Generate CSS styles
 */
function generateStyles(
  _defaultEventColor: string,
  _defaultPeriodColor: string
): string {
  return `
    <style>
      .runiq-timeline-axis {
        stroke-linecap: round;
      }
      .runiq-timeline-event {
        cursor: pointer;
        transition: r 0.2s;
      }
      .runiq-timeline-event:hover {
        r: 12;
      }
      .runiq-timeline-event-label {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .runiq-timeline-event-description {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .runiq-timeline-event-date {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Consolas, monospace;
      }
      .runiq-timeline-period-label {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-style: italic;
      }
      .runiq-timeline-period {
        pointer-events: none;
      }
      .runiq-timeline-connector {
        pointer-events: none;
      }
    </style>
  `;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
