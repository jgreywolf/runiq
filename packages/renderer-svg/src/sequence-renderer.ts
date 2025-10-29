/**
 * Sequence Diagram Renderer for Runiq
 *
 * Renders UML-style sequence diagrams with:
 * - Participants (actors, entities, systems, boundaries, controls, databases)
 * - Lifelines (vertical dashed lines)
 * - Messages (sync, async, return, create, destroy)
 * - Activation boxes (execution specifications)
 * - Notes (annotations)
 * - Combined fragments (loop, alt, opt, par, critical, break)
 */

import type {
  SequenceProfile,
  SequenceParticipant,
  SequenceMessage,
  SequenceNote,
  SequenceFragment,
} from '@runiq/core';

export interface SequenceRenderOptions {
  width?: number;
  height?: number;
  participantSpacing?: number;
  messageSpacing?: number;
  participantBoxHeight?: number;
  participantBoxWidth?: number;
  activationBoxWidth?: number;
  noteWidth?: number;
  fragmentPadding?: number;
  title?: string;
  participantColor?: string;
  messageColor?: string;
  noteColor?: string;
  fragmentColor?: string;
}

export interface SequenceRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const PARTICIPANT_SPACING = 150;
const MESSAGE_SPACING = 60;
const PARTICIPANT_BOX_HEIGHT = 40;
const PARTICIPANT_BOX_WIDTH = 120;
const ACTIVATION_BOX_WIDTH = 10;
const NOTE_WIDTH = 150;
const FRAGMENT_PADDING = 10;
const PARTICIPANT_BOX_TOP = 50; // Top of participant boxes (below title at y=30)
const LIFELINE_START = PARTICIPANT_BOX_TOP + PARTICIPANT_BOX_HEIGHT + 20; // Start lifelines 20px below participant boxes (y=110)

/**
 * Main sequence diagram rendering function
 */
export function renderSequenceDiagram(
  profile: SequenceProfile,
  options: SequenceRenderOptions = {}
): SequenceRenderResult {
  const warnings: string[] = [];
  const {
    participantSpacing = PARTICIPANT_SPACING,
    messageSpacing = MESSAGE_SPACING,
    participantBoxHeight = PARTICIPANT_BOX_HEIGHT,
    participantBoxWidth = PARTICIPANT_BOX_WIDTH,
    activationBoxWidth = ACTIVATION_BOX_WIDTH,
    noteWidth = NOTE_WIDTH,
    fragmentPadding = FRAGMENT_PADDING,
    title = profile.title,
    participantColor = '#4A90E2',
    messageColor = '#333333',
    noteColor = '#FFFACD',
    fragmentColor = '#E8F4F8',
  } = options;

  // Validate profile
  if (profile.participants.length === 0) {
    warnings.push('No participants defined');
    return { svg: '', warnings };
  }

  // Calculate participant positions
  const participantMap = new Map<string, number>();
  const startX = 50;
  profile.participants.forEach((participant, index) => {
    participantMap.set(
      participant.id,
      startX + index * participantSpacing + participantBoxWidth / 2
    );
  });

  // Calculate diagram height
  const totalMessages = profile.messages.length;
  const totalNotes = profile.notes?.length || 0;
  const totalFragments = profile.fragments?.length || 0;
  const estimatedHeight =
    LIFELINE_START +
    (totalMessages + totalNotes + totalFragments) * messageSpacing +
    100;
  const height = options.height || Math.max(DEFAULT_HEIGHT, estimatedHeight);

  // Calculate diagram width
  const lastParticipantX =
    startX +
    (profile.participants.length - 1) * participantSpacing +
    participantBoxWidth;
  const width = options.width || Math.max(DEFAULT_WIDTH, lastParticipantX + 50);

  // Start SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${width}" height="${height}" 
    viewBox="0 0 ${width} ${height}"
    role="img" aria-labelledby="sequence-title">`;

  // Title
  svg += `<title id="sequence-title">${escapeXml(title)}</title>`;

  // Styles
  svg += generateStyles(
    participantColor,
    messageColor,
    noteColor,
    fragmentColor
  );

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#FFFFFF"/>`;

  // Render diagram title if present
  if (title) {
    svg += `<text x="${width / 2}" y="30" class="diagram-title" text-anchor="middle" font-size="18" font-weight="bold" fill="#333333">${escapeXml(title)}</text>`;
  }

  // Track current Y position for messages
  let currentY = LIFELINE_START;

  // Render participants at top
  svg += renderParticipants(
    profile.participants,
    participantMap,
    participantBoxHeight,
    participantBoxWidth
  );

  // Render lifelines
  svg += renderLifelines(
    profile.participants,
    participantMap,
    LIFELINE_START,
    height - 50
  );

  // Track activation state for each participant
  const activations = new Map<string, boolean>();

  // Render messages and fragments
  for (let i = 0; i < profile.messages.length; i++) {
    const message = profile.messages[i];

    // Check for fragments starting at this message
    if (profile.fragments) {
      for (const fragment of profile.fragments) {
        if (fragment.startAfterMessage === i) {
          const fragmentHeight =
            (fragment.endAfterMessage - fragment.startAfterMessage + 1) *
            messageSpacing;
          svg += renderFragment(
            fragment,
            startX,
            currentY - messageSpacing / 2,
            lastParticipantX,
            fragmentHeight,
            fragmentPadding
          );
        }
      }
    }

    // Render the message
    svg += renderMessage(
      message,
      participantMap,
      currentY,
      activations,
      activationBoxWidth
    );

    currentY += messageSpacing;
  }

  // Render notes separately
  if (profile.notes && profile.notes.length > 0) {
    for (const note of profile.notes) {
      svg += renderNote(
        note,
        participantMap,
        currentY,
        noteWidth,
        participantBoxWidth
      );
      currentY += messageSpacing;
    }
  }

  // Close SVG
  svg += '</svg>';

  return { svg, warnings };
}

/**
 * Generate CSS styles
 */
function generateStyles(
  participantColor: string,
  messageColor: string,
  noteColor: string,
  fragmentColor: string
): string {
  return `
  <style>
    .participant-box {
      fill: ${participantColor};
      stroke: #2C5F8D;
      stroke-width: 2;
    }
    .participant-text {
      fill: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      text-anchor: middle;
    }
    .lifeline {
      stroke: #999999;
      stroke-width: 1;
      stroke-dasharray: 5,5;
    }
    .message-line {
      stroke: ${messageColor};
      stroke-width: 2;
      fill: none;
    }
    .message-arrow {
      fill: ${messageColor};
      stroke: ${messageColor};
    }
    .message-text {
      fill: ${messageColor};
      font-family: Arial, sans-serif;
      font-size: 12px;
    }
    .activation-box {
      fill: #FFFFFF;
      stroke: ${participantColor};
      stroke-width: 2;
    }
    .note-box {
      fill: ${noteColor};
      stroke: #E6DB74;
      stroke-width: 1;
    }
    .note-text {
      fill: #333333;
      font-family: Arial, sans-serif;
      font-size: 11px;
    }
    .fragment-box {
      fill: ${fragmentColor};
      stroke: #4A90E2;
      stroke-width: 2;
    }
    .fragment-label-bg {
      fill: #4A90E2;
    }
    .fragment-label-text {
      fill: white;
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
    }
    .fragment-condition {
      fill: #333333;
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-style: italic;
    }
  </style>
  `;
}

/**
 * Render participants at the top of the diagram
 */
function renderParticipants(
  participants: SequenceParticipant[],
  participantMap: Map<string, number>,
  boxHeight: number,
  boxWidth: number
): string {
  let svg = '';

  for (const participant of participants) {
    const x = participantMap.get(participant.id)!;
    const boxX = x - boxWidth / 2;
    const boxY = PARTICIPANT_BOX_TOP;

    // Participant box
    svg += `<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" class="participant-box" rx="5"/>`;

    // Participant name
    const textY = boxY + boxHeight / 2 + 5;
    svg += `<text x="${x}" y="${textY}" class="participant-text">${escapeXml(participant.name)}</text>`;
  }

  return svg;
}

/**
 * Render lifelines (vertical dashed lines)
 */
function renderLifelines(
  participants: SequenceParticipant[],
  participantMap: Map<string, number>,
  startY: number,
  endY: number
): string {
  let svg = '';

  for (const participant of participants) {
    const x = participantMap.get(participant.id)!;
    svg += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${endY}" class="lifeline"/>`;
  }

  return svg;
}

/**
 * Render a single message
 */
function renderMessage(
  message: SequenceMessage,
  participantMap: Map<string, number>,
  y: number,
  activations: Map<string, boolean>,
  activationBoxWidth: number
): string {
  let svg = '';

  const fromX = participantMap.get(message.from);
  const toX = participantMap.get(message.to);

  if (fromX === undefined || toX === undefined) {
    return `<!-- Warning: Invalid participant reference in message -->`;
  }

  // Handle activation
  if (message.activate && !activations.get(message.to)) {
    activations.set(message.to, true);
    svg += renderActivationBox(toX, y, activationBoxWidth);
  }

  // Determine line style based on message type
  const isDashed =
    message.type === 'async' ||
    message.type === 'return' ||
    message.type === 'destroy';
  const strokeDasharray = isDashed ? '5,5' : '';

  // Draw line
  svg += `<line x1="${fromX}" y1="${y}" x2="${toX}" y2="${y}" class="message-line" stroke-dasharray="${strokeDasharray}"/>`;

  // Draw arrow
  const arrowSize = 8;
  const direction = toX > fromX ? 1 : -1;
  const arrowX = toX - direction * arrowSize;

  if (message.type === 'return') {
    // Open arrow for return messages
    svg += `<polyline points="${arrowX},${y - arrowSize / 2} ${toX},${y} ${arrowX},${y + arrowSize / 2}" class="message-arrow" fill="none"/>`;
  } else {
    // Filled arrow for other messages
    svg += `<polygon points="${toX},${y} ${arrowX},${y - arrowSize / 2} ${arrowX},${y + arrowSize / 2}" class="message-arrow"/>`;
  }

  // Message label
  const labelX = (fromX + toX) / 2;
  const labelY = y - 5;
  svg += `<text x="${labelX}" y="${labelY}" class="message-text" text-anchor="middle">${escapeXml(message.label)}</text>`;

  return svg;
}

/**
 * Render activation box
 */
function renderActivationBox(
  x: number,
  y: number,
  width: number
): string {
  const height = 40; // Fixed height for now
  return `<rect x="${x - width / 2}" y="${y}" width="${width}" height="${height}" class="activation-box"/>`;
}

/**
 * Render a note
 */
function renderNote(
  note: SequenceNote,
  participantMap: Map<string, number>,
  y: number,
  noteWidth: number,
  _participantBoxWidth: number
): string {
  let svg = '';

  if (note.participants.length === 0) {
    return svg;
  }

  const firstParticipantX = participantMap.get(note.participants[0]);
  if (firstParticipantX === undefined) {
    return `<!-- Warning: Invalid participant reference in note -->`;
  }

  let noteX = firstParticipantX;

  if (note.position === 'left') {
    noteX = firstParticipantX - noteWidth - 10;
  } else if (note.position === 'right') {
    noteX = firstParticipantX + 10;
  } else if (note.position === 'over') {
    // Center over participants
    if (note.participants.length > 1) {
      const lastParticipantX = participantMap.get(
        note.participants[note.participants.length - 1]
      );
      if (lastParticipantX) {
        noteX = (firstParticipantX + lastParticipantX) / 2 - noteWidth / 2;
      }
    } else {
      noteX = firstParticipantX - noteWidth / 2;
    }
  }

  const noteHeight = 40;

  // Note box
  svg += `<rect x="${noteX}" y="${y - 20}" width="${noteWidth}" height="${noteHeight}" class="note-box"/>`;

  // Folded corner effect
  const cornerSize = 10;
  svg += `<polyline points="${noteX + noteWidth - cornerSize},${y - 20} ${noteX + noteWidth - cornerSize},${y - 20 + cornerSize} ${noteX + noteWidth},${y - 20 + cornerSize}" fill="none" stroke="#E6DB74" stroke-width="1"/>`;

  // Note text (wrap if needed)
  const textY = y + 5;
  svg += `<text x="${noteX + 5}" y="${textY}" class="note-text">${escapeXml(note.text)}</text>`;

  return svg;
}

/**
 * Render a fragment (loop, alt, opt, etc.)
 */
function renderFragment(
  fragment: SequenceFragment,
  startX: number,
  startY: number,
  endX: number,
  height: number,
  padding: number
): string {
  let svg = '';

  const fragmentX = startX - padding;
  const fragmentWidth = endX - startX + padding * 2;

  // Fragment box
  svg += `<rect x="${fragmentX}" y="${startY}" width="${fragmentWidth}" height="${height}" class="fragment-box"/>`;

  // Fragment label tab
  const labelTabWidth = 60;
  const labelTabHeight = 20;
  svg += `<rect x="${fragmentX}" y="${startY}" width="${labelTabWidth}" height="${labelTabHeight}" class="fragment-label-bg"/>`;
  svg += `<text x="${fragmentX + labelTabWidth / 2}" y="${startY + 14}" class="fragment-label-text" text-anchor="middle">${fragment.type}</text>`;

  // Fragment condition
  if (fragment.label) {
    svg += `<text x="${fragmentX + labelTabWidth + 5}" y="${startY + 14}" class="fragment-condition">[${escapeXml(fragment.label)}]</text>`;
  }

  // Render alternatives for 'alt' fragments
  if (fragment.alternatives && fragment.alternatives.length > 0) {
    const altHeight = height / fragment.alternatives.length;
    fragment.alternatives.forEach((alt, index) => {
      if (index > 0) {
        // Divider line
        const dividerY = startY + index * altHeight;
        svg += `<line x1="${fragmentX}" y1="${dividerY}" x2="${fragmentX + fragmentWidth}" y2="${dividerY}" stroke="#4A90E2" stroke-width="1" stroke-dasharray="3,3"/>`;
      }
      // Alternative label
      const altY = startY + index * altHeight + 20;
      svg += `<text x="${fragmentX + 5}" y="${altY}" class="fragment-condition">[${escapeXml(alt.label)}]</text>`;
    });
  }

  return svg;
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
