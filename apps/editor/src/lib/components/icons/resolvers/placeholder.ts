export function generatePlaceholderIcon(shapeId: string, size: number): string {
	const abbreviation = shapeId
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.split(' ')
		.map((word) => word[0])
		.join('')
		.slice(0, 3)
		.toUpperCase();

	return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="white" stroke="#ccc" stroke-width="1" rx="2"/>
        <text x="${size / 2}" y="${size / 2 + 3}" text-anchor="middle" font-size="8" fill="#666" font-family="monospace">${abbreviation}</text>
    </svg>`;
}
