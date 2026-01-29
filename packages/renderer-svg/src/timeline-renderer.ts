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
  TimelineLane,
  TimelineTask,
  TimelineMilestone,
  TimelineDependency,
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

interface GanttMetrics {
  startDate: Date;
  endDate: Date;
  timeRange: number;
  lanes: TimelineLane[];
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
  dependencies: TimelineDependency[];
  height: number;
  laneHeight: number;
  laneGap: number;
  taskHeight: number;
  milestoneSize: number;
}

const DEFAULT_HORIZONTAL_WIDTH = 1200;
const DEFAULT_HORIZONTAL_HEIGHT = 400;
const DEFAULT_VERTICAL_WIDTH = 600;
const DEFAULT_VERTICAL_HEIGHT = 1000;
const DEFAULT_GANTT_HEIGHT = 520;
const DEFAULT_PADDING = 80;
const DEFAULT_EVENT_RADIUS = 8;
const DEFAULT_LINE_STROKE_WIDTH = 3;
const DEFAULT_LABEL_FONT_SIZE = 14;
const DEFAULT_DATE_FONT_SIZE = 12;
const DEFAULT_PERIOD_OPACITY = 0.3;
const DEFAULT_LANE_HEIGHT = 44;
const DEFAULT_LANE_GAP = 14;
const DEFAULT_TASK_HEIGHT = 18;
const DEFAULT_MILESTONE_SIZE = 10;

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
  const hasGanttElements =
    (profile.lanes && profile.lanes.length > 0) ||
    (profile.tasks && profile.tasks.length > 0) ||
    (profile.milestones && profile.milestones.length > 0);

  // Apply theme if specified in profile
  const theme = profile.theme
    ? getTimelineTheme(profile.theme)
    : getTimelineTheme();

  const width =
    options.width ?? (isHorizontal ? DEFAULT_HORIZONTAL_WIDTH : DEFAULT_VERTICAL_WIDTH);
  let height =
    options.height ??
    (hasGanttElements ? DEFAULT_GANTT_HEIGHT : isHorizontal ? DEFAULT_HORIZONTAL_HEIGHT : DEFAULT_VERTICAL_HEIGHT);
  const {
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

  if (hasGanttElements && !isHorizontal) {
    warnings.push('Gantt/roadmap timelines currently render horizontally');
  }

  if (hasGanttElements) {
    const ganttMetrics = getGanttMetrics(profile, warnings);
    if (!ganttMetrics) {
      return { svg: '', warnings };
    }

    if (options.height === undefined) {
      height = ganttMetrics.height;
    }

    const { svg } = renderGanttTimeline(
      profile,
      ganttMetrics,
      width,
      height,
      padding,
      labelFontSize,
      dateFontSize,
      lineStrokeWidth,
      defaultPeriodColor,
      defaultPeriodOpacity,
      theme,
      warnings
    );

    return { svg, warnings };
  }

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

function parseDate(value: string, warnings: string[], context: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    warnings.push(`Invalid date for ${context}: ${value}`);
    return null;
  }
  return parsed;
}

function getGanttMetrics(profile: TimelineProfile, warnings: string[]): GanttMetrics | null {
  const tasks = profile.tasks ? [...profile.tasks] : [];
  const milestones = profile.milestones ? [...profile.milestones] : [];
  const dependencies = profile.dependencies ? [...profile.dependencies] : [];
  const lanes: TimelineLane[] = [];
  const laneMap = new Map<string, TimelineLane>();

  if (profile.events && profile.events.length > 0) {
    warnings.push('Timeline events are ignored when tasks or milestones are present');
  }

  const ensureLane = (id: string, partial?: Partial<TimelineLane>) => {
    const existing = laneMap.get(id);
    if (existing) {
      Object.assign(existing, partial);
      return existing;
    }
    const lane: TimelineLane = { id, ...partial };
    laneMap.set(id, lane);
    lanes.push(lane);
    return lane;
  };

  if (profile.lanes && profile.lanes.length > 0) {
    for (const lane of profile.lanes) {
      ensureLane(lane.id, lane);
    }
  }

  const defaultLaneId = 'lane-default';
  if (!tasks.length && !milestones.length) {
    warnings.push('Timeline has no tasks or milestones');
    return null;
  }

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  for (const task of tasks) {
    const start = parseDate(task.startDate, warnings, `task ${task.id} startDate`);
    const end = parseDate(task.endDate, warnings, `task ${task.id} endDate`);
    if (!start || !end) {
      continue;
    }
    const startTime = start.getTime();
    const endTime = end.getTime();
    if (endTime < startTime) {
      warnings.push(`Task ${task.id} endDate precedes startDate`);
      continue;
    }
    startDate = !startDate || startTime < startDate.getTime() ? start : startDate;
    endDate = !endDate || endTime > endDate.getTime() ? end : endDate;
    const laneId = task.lane || defaultLaneId;
    task.lane = laneId;
    ensureLane(laneId);
  }

  for (const milestone of milestones) {
    const date = parseDate(milestone.date, warnings, `milestone ${milestone.id} date`);
    if (!date) {
      continue;
    }
    const dateTime = date.getTime();
    startDate = !startDate || dateTime < startDate.getTime() ? date : startDate;
    endDate = !endDate || dateTime > endDate.getTime() ? date : endDate;
    const laneId = milestone.lane || defaultLaneId;
    milestone.lane = laneId;
    ensureLane(laneId);
  }

  if (!startDate || !endDate) {
    warnings.push('Cannot render Gantt timeline with invalid dates');
    return null;
  }

  if (lanes.length === 0) {
    ensureLane(defaultLaneId, { label: 'Workstream' });
  }

  const laneHeight = DEFAULT_LANE_HEIGHT;
  const laneGap = DEFAULT_LANE_GAP;
  const taskHeight = DEFAULT_TASK_HEIGHT;
  const milestoneSize = DEFAULT_MILESTONE_SIZE;
  const height =
    DEFAULT_PADDING * 2 +
    lanes.length * laneHeight +
    Math.max(lanes.length - 1, 0) * laneGap +
    60;

  return {
    startDate,
    endDate,
    timeRange: endDate.getTime() - startDate.getTime(),
    lanes,
    tasks,
    milestones,
    dependencies,
    height,
    laneHeight,
    laneGap,
    taskHeight,
    milestoneSize,
  };
}

function resolveContrastText(fill: string | undefined, fallback: string): string {
  if (!fill) {
    return fallback;
  }
  const hex = fill.trim().replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) {
    return fallback;
  }
  const normalized =
    hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return fallback;
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

function renderGanttTimeline(
  profile: TimelineProfile,
  metrics: GanttMetrics,
  width: number,
  height: number,
  padding: number,
  labelFontSize: number,
  dateFontSize: number,
  lineStrokeWidth: number,
  defaultPeriodColor: string,
  defaultPeriodOpacity: number,
  theme: TimelineTheme,
  warnings: string[]
): TimelineRenderResult {
  const {
    startDate,
    timeRange,
    lanes,
    tasks,
    milestones,
    dependencies,
    laneHeight,
    laneGap,
    taskHeight,
    milestoneSize,
  } = metrics;
  const axisY = padding;
  const laneStartY = padding + 40;
  const timelineStartX = padding + 80;
  const timelineEndX = width - padding;
  const timelineWidth = timelineEndX - timelineStartX;

  const dateToX = (date: Date): number => {
    const offset = date.getTime() - startDate.getTime();
    const ratio = timeRange > 0 ? offset / timeRange : 0;
    return timelineStartX + ratio * timelineWidth;
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${width}" height="${height}" 
    viewBox="0 0 ${width} ${height}"
    role="img" aria-labelledby="timeline-title">`;

  svg += `<title id="timeline-title">${escapeXml(profile.title)}</title>`;
  svg += generateStyles(theme.eventColors[0], defaultPeriodColor);
  svg += `<rect width="${width}" height="${height}" fill="${theme.backgroundColor}"/>`;

  // Period backgrounds
  for (const period of profile.periods || []) {
    const start = parseDate(period.startDate, warnings, `period ${period.id} startDate`);
    const end = parseDate(period.endDate, warnings, `period ${period.id} endDate`);
    if (!start || !end) {
      continue;
    }
    const x1 = dateToX(start);
    const x2 = dateToX(end);
    const periodWidth = x2 - x1;
    const periodColor = period.fillColor || defaultPeriodColor;
    const periodOpacity = period.opacity ?? defaultPeriodOpacity;
    svg += `<rect x="${x1}" y="${laneStartY - 24}" width="${periodWidth}" height="${height - laneStartY + 16}" fill="${periodColor}" opacity="${periodOpacity}" class="runiq-timeline-period"/>`;
    if (period.label) {
      const labelX = x1 + periodWidth / 2;
      svg += `<text x="${labelX}" y="${laneStartY - 28}" text-anchor="middle" font-size="${dateFontSize}" fill="#555555" class="runiq-timeline-period-label">${escapeXml(period.label)}</text>`;
    }
  }

  // Timeline axis
  svg += `<line x1="${timelineStartX}" y1="${axisY}" x2="${timelineEndX}" y2="${axisY}" stroke="${theme.lineColor}" stroke-width="${lineStrokeWidth}" class="runiq-timeline-axis"/>`;
  svg += `<text x="${timelineStartX}" y="${axisY - 10}" text-anchor="start" font-size="${dateFontSize}" fill="#555555">${formatDate(startDate)}</text>`;
  const endLabelDate = new Date(startDate.getTime() + timeRange);
  svg += `<text x="${timelineEndX}" y="${axisY - 10}" text-anchor="end" font-size="${dateFontSize}" fill="#555555">${formatDate(endLabelDate)}</text>`;

  // Render lanes, tasks, milestones
  const itemAnchors = new Map<string, { x: number; y: number }>();

  lanes.forEach((lane, index) => {
    const laneY = laneStartY + index * (laneHeight + laneGap);
    const laneCenterY = laneY + laneHeight / 2;
    const laneFill = lane.fillColor || (index % 2 === 0 ? '#f8fafc' : '#ffffff');
    svg += `<rect x="${padding}" y="${laneY}" width="${width - padding * 2}" height="${laneHeight}" fill="${laneFill}" stroke="#e2e8f0" stroke-width="1"/>`;
    const label = lane.label || lane.id;
    if (label) {
      const textColor = lane.textColor || '#1f2937';
      svg += `<text x="${padding + 8}" y="${laneCenterY + 4}" text-anchor="start" font-size="${labelFontSize}" fill="${textColor}">${escapeXml(label)}</text>`;
    }

    tasks
      .filter((task) => task.lane === lane.id)
      .forEach((task, taskIndex) => {
        const start = parseDate(task.startDate, warnings, `task ${task.id} startDate`);
        const end = parseDate(task.endDate, warnings, `task ${task.id} endDate`);
        if (!start || !end) {
          return;
        }
        const x1 = dateToX(start);
        const x2 = dateToX(end);
        const barWidth = Math.max(x2 - x1, 8);
        const barY = laneCenterY - taskHeight / 2;
        const barColor = task.fillColor || getThemeEventColor(theme, taskIndex);
        const textColor = resolveContrastText(barColor, '#0f172a');
        svg += `<rect x="${x1}" y="${barY}" width="${barWidth}" height="${taskHeight}" rx="4" ry="4" fill="${barColor}" stroke="#2f3b4a" stroke-width="0.5" class="runiq-timeline-task"/>`;
        if (task.label) {
          svg += `<text x="${x1 + 6}" y="${barY + taskHeight / 2 + 4}" font-size="${dateFontSize}" fill="${textColor}">${escapeXml(task.label)}</text>`;
        }
        itemAnchors.set(task.id, { x: x2, y: laneCenterY });
      });

    milestones
      .filter((milestone) => milestone.lane === lane.id)
      .forEach((milestone) => {
        const date = parseDate(milestone.date, warnings, `milestone ${milestone.id} date`);
        if (!date) {
          return;
        }
        const x = dateToX(date);
        const size = milestoneSize;
        const fill = milestone.fillColor || theme.milestoneColor;
        const points = `${x} ${laneCenterY - size} ${x + size} ${laneCenterY} ${x} ${laneCenterY + size} ${x - size} ${laneCenterY}`;
        svg += `<polygon points="${points}" fill="${fill}" stroke="#ffffff" stroke-width="1" class="runiq-timeline-milestone"/>`;
        if (milestone.label) {
          svg += `<text x="${x + size + 6}" y="${laneCenterY + 4}" font-size="${dateFontSize}" fill="#111827">${escapeXml(milestone.label)}</text>`;
        }
        itemAnchors.set(milestone.id, { x, y: laneCenterY });
      });
  });

  if (dependencies.length > 0) {
    const markerId = 'runiq-timeline-arrow';
    svg += `<defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker></defs>`;
    for (const dep of dependencies) {
      const from = itemAnchors.get(dep.from);
      const to = itemAnchors.get(dep.to);
      if (!from || !to) {
        warnings.push(`Dependency ${dep.from} -> ${dep.to} references missing task/milestone`);
        continue;
      }
      const midX = Math.min(from.x + 20, to.x - 20);
      const path = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
      svg += `<path d="${path}" fill="none" stroke="#334155" stroke-width="1.2" marker-end="url(#${markerId})" class="runiq-timeline-dependency"/>`;
    }
  }

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
      .runiq-timeline-task {
        pointer-events: none;
      }
      .runiq-timeline-milestone {
        pointer-events: none;
      }
      .runiq-timeline-dependency {
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
