import * as DSL from '../utils/dslCodeManipulation';
import type { NodeLocation } from '@runiq/parser-dsl';

export type DraftOperation =
	| {
			type: 'edit';
			targetId: string;
			property: string;
			value: string | number | boolean | { x: number; y: number };
	  }
	| { type: 'insert-shape'; shapeCode: string }
	| { type: 'insert-edge'; fromNodeId: string; toNodeId: string }
	| {
			type: 'insert-shape-and-edge';
			shapeCode: string;
			fromNodeId: string;
			toNodeId: string;
	  }
	| { type: 'delete'; nodeId: string | null; edgeId: string | null }
	| { type: 'reset-styles'; elementIds: string[] };

export interface DraftApplyResult {
	newCode: string;
	shapeCounterDelta: number;
}

export function applyDraftOperation(
	code: string,
	shapeCounter: number,
	op: DraftOperation,
	locations?: Map<string, NodeLocation>
): DraftApplyResult {
	const resolveLocation = (targetId: string, isEdge: boolean): NodeLocation | undefined => {
		if (!locations) return undefined;
		if (!isEdge) return locations.get(targetId);
		if (locations.has(targetId)) return locations.get(targetId);
		const parts = targetId.split('-');
		if (parts.length >= 2) {
			return locations.get(`${parts[0]}-${parts[1]}`);
		}
		return undefined;
	};

	switch (op.type) {
		case 'edit': {
			let newCode = code;
			const { targetId, property, value } = op;

			if (property === 'label') {
				if (targetId.startsWith('seq-note-')) {
					newCode = editSequenceNoteLabel(code, targetId, String(value));
				} else {
					newCode = DSL.editLabel(code, targetId, String(value), false, resolveLocation(targetId, false));
				}
			} else if (property === 'edgeLabel') {
				newCode = DSL.editLabel(code, targetId, String(value), true, resolveLocation(targetId, true));
			} else if (property === 'position') {
				if (typeof value === 'object' && value && 'x' in value && 'y' in value) {
					newCode = DSL.editPosition(
						code,
						targetId,
						value.x,
						value.y,
						resolveLocation(targetId, false)
					);
				}
			} else if (
				[
					'shapeType',
					'style',
					'fillColor',
					'strokeColor',
					'strokeWidth',
					'fontSize',
					'textColor',
					'shadow',
					'routing',
					'lineStyle',
					'icon'
				].includes(property)
			) {
				if (property === 'shapeType') {
					newCode = DSL.editShapeType(
						code,
						targetId,
						String(value),
						resolveLocation(targetId, false)
					);
				} else {
					newCode = DSL.editStyleProperty(
						code,
						targetId,
						property,
						value,
						resolveLocation(targetId, targetId.includes('-'))
					);
				}
			}

			return { newCode, shapeCounterDelta: 0 };
		}
		case 'insert-shape': {
			const newCode = DSL.insertShape(code, op.shapeCode, shapeCounter);
			const shapeCounterDelta = newCode !== code ? 1 : 0;
			return { newCode, shapeCounterDelta };
		}
		case 'insert-edge': {
			const newCode = DSL.insertEdge(code, op.fromNodeId, op.toNodeId);
			return { newCode, shapeCounterDelta: 0 };
		}
		case 'insert-shape-and-edge': {
			let newCode = DSL.insertShape(code, op.shapeCode, shapeCounter);
			let shapeCounterDelta = 0;
			if (newCode !== code) {
				shapeCounterDelta = 1;
				const insertedId = DSL.getInsertedShapeId(code, newCode) ?? op.toNodeId;
				newCode = DSL.insertEdge(newCode, op.fromNodeId, insertedId);
			}
			return { newCode, shapeCounterDelta };
		}
		case 'delete': {
			const newCode = DSL.deleteElement(code, op.nodeId, op.edgeId);
			return { newCode, shapeCounterDelta: 0 };
		}
		case 'reset-styles': {
			const newCode = DSL.resetStyles(code, op.elementIds);
			return { newCode, shapeCounterDelta: 0 };
		}
		default:
			return { newCode: code, shapeCounterDelta: 0 };
	}
}

function editSequenceNoteLabel(code: string, noteNodeId: string, nextLabel: string): string {
	const indexRaw = noteNodeId.slice('seq-note-'.length);
	const noteIndex = Number.parseInt(indexRaw, 10);
	if (!Number.isFinite(noteIndex) || noteIndex < 0) return code;
	const lines = code.split('\n');
	let currentNote = 0;
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		if (!/^\s*note\b/.test(line)) continue;
		if (currentNote !== noteIndex) {
			currentNote += 1;
			continue;
		}
		const match = line.match(/^(\s*note\s+)("([^"\\]|\\.)*")(.*)$/);
		if (!match) return code;
		const escaped = nextLabel.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
		lines[i] = `${match[1]}"${escaped}"${match[4] || ''}`;
		return lines.join('\n');
	}
	return code;
}
