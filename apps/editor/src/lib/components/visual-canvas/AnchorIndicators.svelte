<script lang="ts">
	import { tick } from 'svelte';

	interface Props {
		selectedNodeId: string | null;
		svgContainer: HTMLDivElement | null;
		onAnchorDragStart: (
			direction: 'north' | 'south' | 'east' | 'west',
			x: number,
			y: number
		) => void;
		onAnchorDrag: (x: number, y: number) => void;
		onAnchorDragEnd: (x: number, y: number) => void;
	}

	let {
		selectedNodeId = $bindable(),
		svgContainer,
		onAnchorDragStart,
		onAnchorDrag,
		onAnchorDragEnd
	}: Props = $props();

	// SVG group references - single persistent elements
	let anchorGroup: SVGGElement | null = null;
	let lastSvgElement: SVGSVGElement | null = null;
	let previewGroup: SVGGElement | null = null;
	let hoveredDirection: 'north' | 'south' | 'east' | 'west' | null = $state(null);
	
	// Persistent state for positioning
	let visible = $state(false);
	let nodeX = $state(0);
	let nodeY = $state(0);
	let nodeWidth = $state(0);
	let nodeHeight = $state(0);
	
	// Computed anchor positions based on node bounds
	let anchorNorth = $derived({ x: nodeX + nodeWidth / 2, y: nodeY });
	let anchorEast = $derived({ x: nodeX + nodeWidth, y: nodeY + nodeHeight / 2 });
	let anchorSouth = $derived({ x: nodeX + nodeWidth / 2, y: nodeY + nodeHeight });
	let anchorWest = $derived({ x: nodeX, y: nodeY + nodeHeight / 2 });

	// Initialize the persistent anchor group in the SVG
	function initializeAnchors(diagramSvg: SVGSVGElement) {
		// If we're already attached to this SVG and the group still exists, don't reinitialize
		if (lastSvgElement === diagramSvg && anchorGroup && anchorGroup.parentElement) {
			return;
		}

		// Ensure SVG allows overflow for anchors
		diagramSvg.style.overflow = 'visible';
		const svgParent = diagramSvg.parentElement;
		if (svgParent) {
			svgParent.style.overflow = 'visible';
		}

		// Check if anchor group already exists in this SVG
		anchorGroup = diagramSvg.querySelector('#anchor-indicators') as SVGGElement | null;
		previewGroup = diagramSvg.querySelector('#anchor-preview') as SVGGElement | null;

		if (!anchorGroup) {
			// Create the preview group first (so it renders below anchors)
			previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			previewGroup.id = 'anchor-preview';
			previewGroup.style.pointerEvents = 'none';
			previewGroup.style.visibility = 'hidden';
			diagramSvg.appendChild(previewGroup);

			// Create the persistent anchor group
			anchorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			anchorGroup.id = 'anchor-indicators';
			anchorGroup.style.pointerEvents = 'all';
			anchorGroup.style.visibility = 'hidden'; // Start hidden

			// Create all 4 anchor indicators
			createAnchor(anchorGroup, 'north');
			createAnchor(anchorGroup, 'east');
			createAnchor(anchorGroup, 'south');
			createAnchor(anchorGroup, 'west');

			diagramSvg.appendChild(anchorGroup);
		} else if (!previewGroup) {
			// Anchor group exists but preview group is missing - create it
			previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			previewGroup.id = 'anchor-preview';
			previewGroup.style.pointerEvents = 'none';
			previewGroup.style.visibility = 'hidden';
			// Insert before anchor group so it renders below
			diagramSvg.insertBefore(previewGroup, anchorGroup);
		}

		lastSvgElement = diagramSvg;
	}

	// Create a single anchor indicator
	function createAnchor(
		parent: SVGGElement,
		direction: 'north' | 'south' | 'east' | 'west'
	) {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		g.classList.add('anchor-indicator');
		g.setAttribute('data-direction', direction);
		g.style.cursor = 'pointer';

		// Anchor circle
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('r', '8');
		circle.setAttribute('fill', '#fff');
		circle.setAttribute('stroke', '#3b82f6');
		circle.setAttribute('stroke-width', '2');
		circle.classList.add('anchor-circle');

		// Direction arrow
		const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		arrow.setAttribute('fill', '#3b82f6');
		arrow.classList.add('anchor-arrow');

		g.appendChild(circle);
		g.appendChild(arrow);

		// Event listeners
		g.addEventListener('mouseenter', (e) => {
			e.stopPropagation();
			hoveredDirection = direction;
			showPreview(direction);
		});
		g.addEventListener('mouseleave', (e) => {
			e.stopPropagation();
			hoveredDirection = null;
			hidePreview();
		});
		g.addEventListener('mousedown', (e) => {
			e.stopPropagation();
			const pos = getAnchorPosition(direction);
			onAnchorDragStart(direction, pos.x, pos.y);
		});

		parent.appendChild(g);
	}

	// Get anchor position for a given direction
	function getAnchorPosition(direction: 'north' | 'south' | 'east' | 'west') {
		switch (direction) {
			case 'north':
				return anchorNorth;
			case 'east':
				return anchorEast;
			case 'south':
				return anchorSouth;
			case 'west':
				return anchorWest;
		}
	}

	// Update anchor positions without recreating elements
	function updateAnchorPositions() {
		if (!anchorGroup) return;

		const directions: Array<'north' | 'south' | 'east' | 'west'> = [
			'north',
			'east',
			'south',
			'west'
		];

		directions.forEach((direction) => {
			const g = anchorGroup!.querySelector(
				`[data-direction="${direction}"]`
			) as SVGGElement | null;
			if (!g) return;

			const pos = getAnchorPosition(direction);
			const circle = g.querySelector('.anchor-circle') as SVGCircleElement;
			const arrow = g.querySelector('.anchor-arrow') as SVGPathElement;

			if (circle) {
				circle.setAttribute('cx', String(pos.x));
				circle.setAttribute('cy', String(pos.y));
			}

			if (arrow) {
				let arrowPath = '';
				switch (direction) {
					case 'north':
						arrowPath = `M ${pos.x} ${pos.y - 4} L ${pos.x - 3} ${pos.y - 1} L ${pos.x + 3} ${pos.y - 1} Z`;
						break;
					case 'east':
						arrowPath = `M ${pos.x + 4} ${pos.y} L ${pos.x + 1} ${pos.y - 3} L ${pos.x + 1} ${pos.y + 3} Z`;
						break;
					case 'south':
						arrowPath = `M ${pos.x} ${pos.y + 4} L ${pos.x - 3} ${pos.y + 1} L ${pos.x + 3} ${pos.y + 1} Z`;
						break;
					case 'west':
						arrowPath = `M ${pos.x - 4} ${pos.y} L ${pos.x - 1} ${pos.y - 3} L ${pos.x - 1} ${pos.y + 3} Z`;
						break;
				}
				arrow.setAttribute('d', arrowPath);
			}
		});
	}

	// Show preview of edge and new node
	function showPreview(direction: 'north' | 'south' | 'east' | 'west') {
		if (!svgContainer || !previewGroup) return;

		// Calculate preview positions
		const startPos = getAnchorPosition(direction);
		const previewDistance = 120; // Distance to preview node
		let endX = startPos.x;
		let endY = startPos.y;

		switch (direction) {
			case 'north':
				endY -= previewDistance;
				break;
			case 'south':
				endY += previewDistance;
				break;
			case 'east':
				endX += previewDistance;
				break;
			case 'west':
				endX -= previewDistance;
				break;
		}

		// Clear existing preview
		previewGroup.innerHTML = '';

		// Create preview edge (slightly thicker with pale blue glow)
		const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		edge.setAttribute('x1', String(startPos.x));
		edge.setAttribute('y1', String(startPos.y));
		edge.setAttribute('x2', String(endX));
		edge.setAttribute('y2', String(endY));
		edge.setAttribute('stroke', '#93c5fd'); // Pale blue
		edge.setAttribute('stroke-width', '3');
		edge.setAttribute('opacity', '0.6');
		edge.style.filter = 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))';
		edge.style.pointerEvents = 'none';

		// Create preview node (rectangle with pale blue glow)
		const previewNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		const nodeSize = 60;
		previewNode.setAttribute('x', String(endX - nodeSize / 2));
		previewNode.setAttribute('y', String(endY - nodeSize / 2));
		previewNode.setAttribute('width', String(nodeSize));
		previewNode.setAttribute('height', String(nodeSize));
		previewNode.setAttribute('rx', '8');
		previewNode.setAttribute('fill', '#dbeafe'); // Very pale blue
		previewNode.setAttribute('stroke', '#93c5fd'); // Pale blue
		previewNode.setAttribute('stroke-width', '3');
		previewNode.setAttribute('opacity', '0.6');
		previewNode.style.filter = 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))';
		previewNode.style.pointerEvents = 'none';

		previewGroup.appendChild(edge);
		previewGroup.appendChild(previewNode);
		previewGroup.style.visibility = 'visible';
	}

	// Hide preview elements
	function hidePreview() {
		if (!previewGroup) return;
		previewGroup.style.visibility = 'hidden';
		previewGroup.innerHTML = '';
	}

	// Show/hide anchors
	function setVisibility(show: boolean) {
		if (anchorGroup) {
			anchorGroup.style.visibility = show ? 'visible' : 'hidden';
		}
		if (!show && previewGroup) {
			// Hide preview when anchors are hidden
			hidePreview();
		}
		visible = show;
	}

	// Update anchors for the selected node
	function updateForNode() {
		if (!selectedNodeId || !svgContainer) {
			setVisibility(false);
			return;
		}

		// Find the diagram SVG
		const allSvgs = svgContainer.querySelectorAll('svg');
		let svgElement: SVGSVGElement | null = null;
		for (const svg of allSvgs) {
			if (svg.querySelector('[data-node-id], [data-edge-id]')) {
				svgElement = svg as SVGSVGElement;
				break;
			}
		}

		if (!svgElement) {
			setVisibility(false);
			return;
		}

		// Ensure anchor group exists in the current SVG (may have been replaced)
		initializeAnchors(svgElement);

		const nodeElement = svgElement.querySelector(`[data-node-id="${selectedNodeId}"]`);
		if (!nodeElement) {
			setVisibility(false);
			return;
		}

		// Get the actual bounding box of the node in SVG coordinate space
		const bbox = (nodeElement as SVGGraphicsElement).getBBox();
		
		// Update node bounds (triggers derived anchor positions)
		nodeX = bbox.x;
		nodeY = bbox.y;
		nodeWidth = bbox.width;
		nodeHeight = bbox.height;

		// Update positions and show
		updateAnchorPositions();
		setVisibility(true);
	}

	// Public API for parent component
	export function recalculate() {
		updateForNode();
	}

	// React to selection changes
	$effect(() => {
		if (selectedNodeId) {
			// Wait for DOM updates then position anchors
			tick().then(() => {
				updateForNode();
			});
		} else {
			setVisibility(false);
		}
	});
</script>

<style>
	:global(.anchor-indicator) {
		cursor: pointer;
	}

	:global(.anchor-circle) {
		transition: all 0.15s;
	}
</style>
