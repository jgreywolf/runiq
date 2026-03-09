import { ProfileName } from '$lib/types';
import type { NodeLocation } from '@runiq/parser-dsl';

export interface SourceLocation {
	line: number;
	column: number;
}

interface ResolveSelectionLocationParams {
	code: string;
	profileName: ProfileName | null;
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	selectedEdgeFrom?: string | null;
	selectedEdgeTo?: string | null;
	nodeLocations?: Map<string, NodeLocation>;
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toLineLocation(lineIndex: number): SourceLocation {
	return { line: lineIndex + 1, column: 1 };
}

function findLineByPattern(lines: string[], pattern: RegExp): SourceLocation | null {
	const index = lines.findIndex((line) => pattern.test(line));
	return index >= 0 ? toLineLocation(index) : null;
}

function findDiagramNodeLocation(code: string, nodeId: string): SourceLocation | null {
	const lines = code.split('\n');
	const id = escapeRegex(nodeId);
	return (
		findLineByPattern(lines, new RegExp(`^\\s*shape\\s+${id}\\b`)) ??
		findLineByPattern(lines, new RegExp(`^\\s*container\\s+${id}\\b`)) ??
		findLineByPattern(lines, new RegExp(`^\\s*group\\s+${id}\\b`))
	);
}

function findTimelineNodeLocation(code: string, nodeId: string): SourceLocation | null {
	const lines = code.split('\n');
	const id = escapeRegex(nodeId);
	return (
		findLineByPattern(lines, new RegExp(`^\\s*event\\s+${id}\\b`)) ??
		findLineByPattern(lines, new RegExp(`^\\s*task\\s+${id}\\b`)) ??
		findLineByPattern(lines, new RegExp(`^\\s*milestone\\s+${id}\\b`)) ??
		findLineByPattern(lines, new RegExp(`^\\s*period\\s+${id}\\b`))
	);
}

function normalizeSequenceIdentifier(value: string): string {
	return value.trim().replace(/^"|"$/g, '').toLowerCase().replace(/\s+/g, '_');
}

function findSequenceParticipantLocation(code: string, participantId: string): SourceLocation | null {
	const lines = code.split('\n');
	const participantRegex = /^\s*participant\s+("([^"\\]|\\.)*"|\S+)/;
	for (let index = 0; index < lines.length; index += 1) {
		const match = participantRegex.exec(lines[index]);
		if (!match) continue;
		if (normalizeSequenceIdentifier(match[1]) === participantId) {
			return toLineLocation(index);
		}
	}
	return null;
}

function findSequenceMessageLocation(code: string, messageIndex: number): SourceLocation | null {
	if (!Number.isFinite(messageIndex) || messageIndex < 0) return null;
	const lines = code.split('\n');
	let current = 0;
	for (let index = 0; index < lines.length; index += 1) {
		if (!/^\s*message\s+/.test(lines[index])) continue;
		if (current === messageIndex) return toLineLocation(index);
		current += 1;
	}
	return null;
}

function findEdgeLocation(code: string, from: string, to: string): SourceLocation | null {
	const lines = code.split('\n');
	const fromPattern = new RegExp(`\\b${escapeRegex(from)}\\b`);
	const toPattern = new RegExp(`\\b${escapeRegex(to)}\\b`);

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		if (!line.includes('->') || !fromPattern.test(line) || !toPattern.test(line)) continue;
		return toLineLocation(index);
	}

	return null;
}

export function resolveSelectionSourceLocation(
	params: ResolveSelectionLocationParams
): SourceLocation | null {
	const {
		code,
		profileName,
		selectedNodeId,
		selectedEdgeId,
		selectedEdgeFrom,
		selectedEdgeTo,
		nodeLocations
	} = params;

	if (!code.trim()) return null;

	if (profileName === ProfileName.diagram) {
		if (selectedNodeId) {
			const fromMap = nodeLocations?.get(selectedNodeId);
			if (fromMap) {
				return { line: fromMap.startLine, column: fromMap.startColumn };
			}
			return findDiagramNodeLocation(code, selectedNodeId);
		}

		if (selectedEdgeId) {
			const fromMap = nodeLocations?.get(selectedEdgeId);
			if (fromMap) {
				return { line: fromMap.startLine, column: fromMap.startColumn };
			}
			const fallbackEdgeKey = selectedEdgeId.replace(/-\d+$/, '');
			const fromFallbackMap = nodeLocations?.get(fallbackEdgeKey);
			if (fromFallbackMap) {
				return { line: fromFallbackMap.startLine, column: fromFallbackMap.startColumn };
			}
			if (selectedEdgeFrom && selectedEdgeTo) {
				return findEdgeLocation(code, selectedEdgeFrom, selectedEdgeTo);
			}
		}
	}

	if (profileName === ProfileName.timeline && selectedNodeId) {
		return findTimelineNodeLocation(code, selectedNodeId);
	}

	if (profileName === ProfileName.sequence) {
		if (selectedNodeId?.startsWith('seq-participant-')) {
			return findSequenceParticipantLocation(
				code,
				selectedNodeId.slice('seq-participant-'.length)
			);
		}
		if (selectedEdgeId?.startsWith('seq-message-')) {
			const messageIndex = Number.parseInt(selectedEdgeId.slice('seq-message-'.length), 10);
			return findSequenceMessageLocation(code, messageIndex);
		}
	}

	return null;
}
