export interface ProfileBlockInfo {
	startLineIndex: number;
	insertLineIndex: number;
	indentation: string;
}

export interface LocationHint {
	startLine: number;
	startColumn?: number;
	endLine?: number;
	endColumn?: number;
}

export interface ParsedStyleDeclaration {
	name: string;
	properties: Record<string, string>;
}

