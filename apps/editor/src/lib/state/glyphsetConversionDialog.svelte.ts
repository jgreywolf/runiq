/**
 * Store for managing the glyphset conversion incompatibility dialog
 */

interface GlyphsetConversionDialogState {
	open: boolean;
	fromType: string;
	toType: string;
	reason: string;
	alternatives: string[];
	canConvert: boolean;
}

const initialState: GlyphsetConversionDialogState = {
	open: false,
	fromType: '',
	toType: '',
	reason: '',
	alternatives: [],
	canConvert: false
};

export const glyphsetConversionDialogState = $state<GlyphsetConversionDialogState>({
	...initialState
});

/**
 * Open the dialog with conversion incompatibility details
 */
export function openGlyphsetConversionDialog(
	fromType: string,
	toType: string,
	reason: string,
	canConvert: boolean = false
) {
	glyphsetConversionDialogState.open = true;
	glyphsetConversionDialogState.fromType = fromType;
	glyphsetConversionDialogState.toType = toType;
	glyphsetConversionDialogState.reason = reason;
	glyphsetConversionDialogState.canConvert = canConvert;
}

/**
 * Close the dialog
 */
export function closeGlyphsetConversionDialog() {
	glyphsetConversionDialogState.open = false;
}

/**
 * Reset dialog to initial state
 */
export function resetGlyphsetConversionDialog() {
	Object.assign(glyphsetConversionDialogState, initialState);
}
