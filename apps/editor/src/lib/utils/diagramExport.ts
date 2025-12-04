/**
 * Diagram export utilities
 */

/**
 * Export diagram as SVG
 */
export function exportAsSvg(svg: string, filename: string): void {
	const blob = new Blob([svg], { type: 'image/svg+xml' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${filename.replace(/\s+/g, '-')}.svg`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Export diagram as PNG
 */
export async function exportAsPng(svg: string, filename: string): Promise<void> {
	// Parse SVG to get dimensions
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = svg;
	const svgElement = tempDiv.querySelector('svg');

	if (!svgElement) {
		throw new Error('Failed to parse SVG content');
	}

	const width = parseInt(svgElement.getAttribute('width') || '800');
	const height = parseInt(svgElement.getAttribute('height') || '600');

	// Create canvas
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Failed to create canvas context');
	}

	// Convert SVG to image
	return new Promise((resolve, reject) => {
		const img = new Image();
		const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		img.onload = () => {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, width, height);
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);

			canvas.toBlob((blob) => {
				if (blob) {
					const pngUrl = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = pngUrl;
					a.download = `${filename.replace(/\s+/g, '-')}.png`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(pngUrl);
					resolve();
				} else {
					reject(new Error('Failed to create PNG blob'));
				}
			}, 'image/png');
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to render SVG to PNG'));
		};

		img.src = url;
	});
}
