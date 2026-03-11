import type { WarningDetail } from '@runiq/parser-dsl';
import type { NodeLocation } from '@runiq/parser-dsl';
import type { DiagramProfile } from '@runiq/parser-dsl';
import type { RenderResult } from './renderingUtils';
import { mergeWarnings, updateWarningVisibility } from './viewModel';

export interface WarningUiState {
	combinedWarnings: string[];
	showWarnings: boolean;
	lastWarningCount: number;
}

export interface RenderStateCallbacks {
	setSvgOutput: (value: string) => void;
	clearErrors: () => void;
	clearWarnings: () => void;
	setErrors: (errors: string[]) => void;
	setWarnings: (warnings: string[]) => void;
	setWarningDetails: (details: WarningDetail[]) => void;
	setParseTime: (value: number) => void;
	setRenderTime: (value: number) => void;
	setNodeLocations: (locations: Map<string, NodeLocation>) => void;
	clearNodeLocations: () => void;
	setProfile: (profile: DiagramProfile) => void;
	handleParse: (success: boolean, errors: string[]) => void;
}

export function computeWarningUiState(params: {
	warningDetails: WarningDetail[];
	diagramWarnings: string[];
	lintWarnings: string[];
	currentShowWarnings: boolean;
	lastWarningCount: number;
}): WarningUiState {
	const combinedWarnings = mergeWarnings(
		params.warningDetails,
		params.diagramWarnings,
		params.lintWarnings
	);
	const warningCount = params.warningDetails.length + combinedWarnings.length;
	const visibility = updateWarningVisibility(
		params.currentShowWarnings,
		params.lastWarningCount,
		warningCount
	);
	return {
		combinedWarnings,
		showWarnings: visibility.showWarnings,
		lastWarningCount: visibility.lastWarningCount
	};
}

export function shouldForceSelectMode(errorCount: number, mode: string): boolean {
	return errorCount > 0 && mode !== 'select';
}

export function getFloatingToolbarTop(
	showWarnings: boolean,
	warningDetailCount: number,
	combinedWarningCount: number
): string {
	return showWarnings && warningDetailCount + combinedWarningCount > 0 ? '120px' : '66px';
}

export function applyRenderEmptyState(callbacks: RenderStateCallbacks): void {
	callbacks.setSvgOutput('');
	callbacks.clearErrors();
	callbacks.clearWarnings();
	callbacks.setWarningDetails([]);
	callbacks.setParseTime(0);
	callbacks.setRenderTime(0);
	callbacks.handleParse(true, []);
}

export function applyRenderSuccessState(
	result: RenderResult,
	callbacks: RenderStateCallbacks
): void {
	if (result.svg && result.svg.trim().length > 0) {
		callbacks.setSvgOutput(result.svg);
	}
	callbacks.setErrors(result.errors);
	callbacks.setWarnings(result.warnings);
	callbacks.setWarningDetails(result.warningDetails ?? []);
	callbacks.setParseTime(result.parseTime);
	callbacks.setRenderTime(result.renderTime);

	if (result.nodeLocations) callbacks.setNodeLocations(result.nodeLocations);
	else callbacks.clearNodeLocations();

	if (result.profile) callbacks.setProfile(result.profile);

	callbacks.handleParse(result.success, result.errors);
}

export function applyRenderErrorState(errorMessage: string, callbacks: RenderStateCallbacks): void {
	callbacks.setErrors([errorMessage]);
	callbacks.setWarningDetails([]);
	callbacks.handleParse(false, [errorMessage]);
}

export async function jumpToWarningLocation(params: {
	warning: WarningDetail;
	setShowCodeEditor: (value: boolean) => void;
	setActiveTab: (tab: 'syntax' | 'data') => void;
	jumpTo: (line: number, column: number) => void;
	tick: () => Promise<void>;
}): Promise<void> {
	params.setShowCodeEditor(true);
	params.setActiveTab('syntax');
	await params.tick();
	params.jumpTo(params.warning.range.startLine, params.warning.range.startColumn);
}
