/**
 * BPMN Profile Icons
 * SVG icon definitions for BPMN shapes
 */

/**
 * BPMN Event icons (start, end, intermediate)
 */
export function getBpmnEventIcon(
	shapeId: string,
	size: number,
	eventType: 'start' | 'end' | 'intermediate'
): string {
	const cx = size / 2;
	const cy = size / 2;
	const r = size * 0.35;

	// Different stroke widths for different event types
	const strokeWidth = eventType === 'end' ? 2.5 : eventType === 'intermediate' ? 1.5 : 1.2;
	const doubleRing = eventType === 'intermediate' || eventType === 'end';

	return `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 ${size} ${size}"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			<circle 
				cx="${cx}" 
				cy="${cy}" 
				r="${r}" 
				fill="${eventType === 'end' ? '#333' : '#fff'}" 
				stroke="#000" 
				stroke-width="${strokeWidth}"
			/>
			${
				doubleRing
					? `<circle 
				cx="${cx}" 
				cy="${cy}" 
				r="${r - 2}" 
				fill="none" 
				stroke="#000" 
				stroke-width="1"
			/>`
					: ''
			}
		</svg>
	`;
}

/**
 * BPMN Gateway icons (exclusive, parallel, inclusive)
 */
export function getBpmnGatewayIcon(
	shapeId: string,
	size: number,
	gatewayType: 'exclusive' | 'parallel' | 'inclusive'
): string {
	const cx = size / 2;
	const cy = size / 2;
	const r = size * 0.35;

	// Calculate diamond points
	const top = cy - r;
	const right = cx + r;
	const bottom = cy + r;
	const left = cx - r;

	// Inner marker size
	const markerSize = r * 0.5;

	let innerMarker = '';
	if (gatewayType === 'exclusive') {
		// X marker
		const offset = markerSize * 0.7;
		innerMarker = `
			<line x1="${cx - offset}" y1="${cy - offset}" x2="${cx + offset}" y2="${cy + offset}" stroke="#000" stroke-width="1.2" />
			<line x1="${cx + offset}" y1="${cy - offset}" x2="${cx - offset}" y2="${cy + offset}" stroke="#000" stroke-width="1.2" />
		`;
	} else if (gatewayType === 'parallel') {
		// + marker
		innerMarker = `
			<line x1="${cx}" y1="${cy - markerSize}" x2="${cx}" y2="${cy + markerSize}" stroke="#000" stroke-width="1.5" />
			<line x1="${cx - markerSize}" y1="${cy}" x2="${cx + markerSize}" y2="${cy}" stroke="#000" stroke-width="1.5" />
		`;
	} else {
		// O marker (circle)
		innerMarker = `
			<circle cx="${cx}" cy="${cy}" r="${markerSize * 0.8}" fill="none" stroke="#000" stroke-width="1.2" />
		`;
	}

	return `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 ${size} ${size}"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			<path 
				d="M${cx},${top} L${right},${cy} L${cx},${bottom} L${left},${cy} Z" 
				fill="#fff" 
				stroke="#000" 
				stroke-width="1.5"
			/>
			${innerMarker}
		</svg>
	`;
}

/**
 * Check if ID is a BPMN event shape
 */
export function isBpmnEvent(shapeId: string): boolean {
	return ['bpmnEventStart', 'bpmnEventEnd', 'bpmnEventIntermediate'].includes(shapeId);
}

/**
 * Check if ID is a BPMN gateway shape
 */
export function isBpmnGateway(shapeId: string): boolean {
	return ['bpmnGatewayExclusive', 'bpmnGatewayParallel', 'bpmnGatewayInclusive'].includes(shapeId);
}

/**
 * Get BPMN shape icon
 */
export function getBpmnShapeIcon(shapeId: string, size: number): string | null {
	// BPMN Events
	if (shapeId === 'bpmnEventStart') {
		return getBpmnEventIcon(shapeId, size, 'start');
	}
	if (shapeId === 'bpmnEventEnd') {
		return getBpmnEventIcon(shapeId, size, 'end');
	}
	if (shapeId === 'bpmnEventIntermediate') {
		return getBpmnEventIcon(shapeId, size, 'intermediate');
	}

	// BPMN Gateways
	if (shapeId === 'bpmnGatewayExclusive') {
		return getBpmnGatewayIcon(shapeId, size, 'exclusive');
	}
	if (shapeId === 'bpmnGatewayParallel') {
		return getBpmnGatewayIcon(shapeId, size, 'parallel');
	}
	if (shapeId === 'bpmnGatewayInclusive') {
		return getBpmnGatewayIcon(shapeId, size, 'inclusive');
	}

	return null;
}
