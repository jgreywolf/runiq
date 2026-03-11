export function injectDataIntoCode(syntaxCode: string, data: string): string {
	if (!data || !data.trim()) {
		return syntaxCode;
	}

	const trimmedData = data.trim();
	const looksLikeJson = trimmedData.startsWith('{') || trimmedData.startsWith('[');

	let parsedData: any;

	if (looksLikeJson) {
		try {
			parsedData = JSON.parse(trimmedData);
		} catch {
			return syntaxCode;
		}
	} else {
		const lines = trimmedData
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l);

		if (lines.length > 0) {
			const headers = lines[0].split(',').map((h) => h.trim());
			const rows = lines.slice(1).map((line) => {
				const values = line.split(',').map((v) => v.trim());
				const obj: any = {};
				headers.forEach((header, i) => {
					const value = values[i];
					obj[header] = isNaN(Number(value)) ? value : Number(value);
				});
				return obj;
			});

			parsedData = { dataset: rows };
		}
	}

	if (!parsedData) {
		return syntaxCode;
	}

	let modifiedCode = syntaxCode;
	const chartShapePattern =
		/shape\s+(\w+)\s+as\s+@(lineChart|radarChart|pieChart|barChart|pyramidShape|venn\dShape|sankeyChart)/g;

	let match;
	const replacements: Array<{ from: number; to: number; replacement: string }> = [];

	while ((match = chartShapePattern.exec(syntaxCode)) !== null) {
		const fullMatch = match[0];
		const shapeId = match[1];
		const shapeType = match[2];
		const matchStart = match.index;

		if (shapeType === 'sankeyChart') continue;

		const afterMatch = syntaxCode.substring(matchStart + fullMatch.length);
		const endMatch = afterMatch.match(/(?:\r?\n|$)/);
		const lineEnd = endMatch
			? matchStart + fullMatch.length + endMatch.index!
			: syntaxCode.length;

		const currentLine = syntaxCode.substring(matchStart, lineEnd);
		const propsMatch = currentLine.match(/as\s+@\w+\s+(.*)$/);
		const existingProps = propsMatch ? propsMatch[1].trim() : '';
		const withoutData = existingProps.replace(/\bdata:\[.*?\]|\bdata:\{.*?\}/g, '').trim();

		let dataToInject: any;
		if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
			const dataKeys = Object.keys(parsedData);
			if (dataKeys.length > 0) dataToInject = parsedData[dataKeys[0]];
		} else {
			dataToInject = parsedData;
		}

		if (!dataToInject) continue;

		let chartData: any;
		let chartLabels: string[] | null = null;

		if (
			Array.isArray(dataToInject) &&
			dataToInject.length > 0 &&
			typeof dataToInject[0] === 'object'
		) {
			const firstObj = dataToInject[0];
			const keys = Object.keys(firstObj);
			const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
			const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

			if (numericKey) {
				chartData = dataToInject.map((item: any) => item[numericKey]);
				if (labelKey) chartLabels = dataToInject.map((item: any) => item[labelKey]);
			} else {
				chartData = dataToInject;
			}
		} else {
			chartData = dataToInject;
		}

		const dataStr = JSON.stringify(chartData);
		let newProps = withoutData;

		if (chartLabels && chartLabels.length > 0) {
			const labelsStr = JSON.stringify(chartLabels);
			newProps = newProps
				? `${newProps} labels:${labelsStr} data:${dataStr}`
				: `labels:${labelsStr} data:${dataStr}`;
		} else {
			newProps = newProps ? `${newProps} data:${dataStr}` : `data:${dataStr}`;
		}

		replacements.push({
			from: matchStart,
			to: lineEnd,
			replacement: `shape ${shapeId} as @${shapeType} ${newProps}`
		});
	}

	replacements.reverse().forEach(({ from, to, replacement }) => {
		modifiedCode = modifiedCode.substring(0, from) + replacement + modifiedCode.substring(to);
	});

	return modifiedCode;
}

