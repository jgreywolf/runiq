/**
 * Delete a node or edge from the DSL
 */
export function deleteElement(code: string, nodeId: string | null, edgeId: string | null): string {
	const lines = code.split('\n');
	const linesToRemove: number[] = [];

	if (nodeId) {
		for (let i = 0; i < lines.length; i++) {
			const shapeRegex = new RegExp(`^\\s*shape\\s+${nodeId}\\s+as\\s+@\\w+`);
			if (shapeRegex.test(lines[i])) {
				linesToRemove.push(i);
				break;
			}
		}

		for (let i = 0; i < lines.length; i++) {
			const edgeRegex = new RegExp(
				`^\\s*(${nodeId}\\s+(-\\w*->|->)\\s+\\w+|\\w+\\s+(-\\w*->|->)\\s+${nodeId})`
			);
			if (edgeRegex.test(lines[i])) {
				linesToRemove.push(i);
			}
		}
	} else if (edgeId) {
		const edgeParts = edgeId.split('-');
		if (edgeParts.length >= 2) {
			const fromNode = edgeParts[0];
			const toNode = edgeParts[1];

			for (let i = 0; i < lines.length; i++) {
				const edgeRegex = new RegExp(`^\\s*${fromNode}\\s+(-\\w*->|->)\\s+${toNode}`);
				if (edgeRegex.test(lines[i])) {
					linesToRemove.push(i);
					break;
				}
			}
		}
	}

	if (linesToRemove.length > 0) {
		const sortedLines = [...linesToRemove].sort((a, b) => b - a);
		for (const lineIndex of sortedLines) {
			lines.splice(lineIndex, 1);
		}
	}

	return lines.join('\n');
}

