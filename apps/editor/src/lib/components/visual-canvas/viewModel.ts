import type { WarningDetail } from '@runiq/parser-dsl';

export function mergeWarnings(warningDetails: WarningDetail[], diagramWarnings: string[], lintWarnings: string[]): string[] {
	const detailMessages = new Set(warningDetails.map((warning) => warning.message));
	const merged = [...diagramWarnings, ...lintWarnings];
	const unique: string[] = [];

	for (const warning of merged) {
		if (!warning || detailMessages.has(warning) || unique.includes(warning)) {
			continue;
		}
		unique.push(warning);
	}

	return unique;
}

export function updateWarningVisibility(
	currentShowWarnings: boolean,
	lastWarningCount: number,
	nextWarningCount: number
): { showWarnings: boolean; lastWarningCount: number } {
	if (nextWarningCount === 0) {
		return { showWarnings: false, lastWarningCount: nextWarningCount };
	}

	if (nextWarningCount > lastWarningCount) {
		return { showWarnings: true, lastWarningCount: nextWarningCount };
	}

	return { showWarnings: currentShowWarnings, lastWarningCount: nextWarningCount };
}
