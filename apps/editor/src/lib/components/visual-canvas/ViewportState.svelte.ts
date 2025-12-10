export interface ViewportStateConfig {
	minScale?: number;
	maxScale?: number;
	onViewportChange?: (scale: number, translateX: number, translateY: number) => void;
}

export class ViewportState {
	// Pan/zoom state
	scale = $state(1);
	translateX = $state(0);
	translateY = $state(0);

	// Drag state for panning
	isDragging = $state(false);
	dragStart = $state<{ x: number; y: number } | null>(null);

	// Mouse coordinates (screen space)
	mouseX = $state(0);
	mouseY = $state(0);

	// SVG coordinates
	svgMouseX = $state(0);
	svgMouseY = $state(0);

	// Configuration
	private config: ViewportStateConfig;
	private readonly MIN_SCALE: number;
	private readonly MAX_SCALE: number;

	constructor(config: ViewportStateConfig = {}) {
		this.config = config;
		this.MIN_SCALE = config.minScale ?? 0.1;
		this.MAX_SCALE = config.maxScale ?? 5;
	}

	// Start panning the canvas
	startPan(clientX: number, clientY: number): void {
		this.isDragging = true;
		this.dragStart = { x: clientX - this.translateX, y: clientY - this.translateY };
	}

	// Update pan position during drag
	updatePan(clientX: number, clientY: number): void {
		if (!this.isDragging || !this.dragStart) return;

		this.translateX = clientX - this.dragStart.x;
		this.translateY = clientY - this.dragStart.y;

		this.notifyViewportChange();
	}

	// End panning
	endPan(): void {
		this.isDragging = false;
		this.dragStart = null;
	}

	// Update mouse coordinates
	updateMousePosition(
		clientX: number,
		clientY: number,
		containerRect: { left: number; top: number }
	): void {
		this.mouseX = Math.round(clientX - containerRect.left);
		this.mouseY = Math.round(clientY - containerRect.top);

		// Calculate SVG coordinates
		this.svgMouseX = (this.mouseX - this.translateX) / this.scale;
		this.svgMouseY = (this.mouseY - this.translateY) / this.scale;
	}

	// Zoom by delta (0.9 = zoom out, 1.1 = zoom in)
	zoom(delta: number): void {
		this.scale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, this.scale * delta));
		this.notifyViewportChange();
	}

	// Zoom in by 20%
	zoomIn(): void {
		this.scale = Math.min(this.scale * 1.2, this.MAX_SCALE);
		this.notifyViewportChange();
	}

	// Zoom out by 20%
	zoomOut(): void {
		this.scale = Math.max(this.scale / 1.2, this.MIN_SCALE);
		this.notifyViewportChange();
	}

	// Reset zoom and pan to default
	resetZoom(): void {
		this.scale = 1;
		this.translateX = 0;
		this.translateY = 0;
		this.notifyViewportChange();
	}

	// Fit content to screen with padding
	fitToScreen(
		svgWidth: number,
		svgHeight: number,
		containerWidth: number,
		containerHeight: number,
		padding: number = 0.9
	): void {
		const scaleX = (containerWidth * padding) / svgWidth;
		const scaleY = (containerHeight * padding) / svgHeight;

		this.scale = Math.min(scaleX, scaleY, this.MAX_SCALE);
		this.notifyViewportChange();
	}

	// Convert client coordinates to SVG coordinates
	clientToSvg(
		clientX: number,
		clientY: number,
		containerRect: { left: number; top: number }
	): { x: number; y: number } {
		const screenX = clientX - containerRect.left;
		const screenY = clientY - containerRect.top;

		return {
			x: (screenX - this.translateX) / this.scale,
			y: (screenY - this.translateY) / this.scale
		};
	}

	// Convert SVG coordinates to client coordinates
	svgToClient(
		svgX: number,
		svgY: number,
		containerRect: { left: number; top: number }
	): { x: number; y: number } {
		return {
			x: svgX * this.scale + this.translateX + containerRect.left,
			y: svgY * this.scale + this.translateY + containerRect.top
		};
	}

	// Check if currently panning
	get isPanning(): boolean {
		return this.isDragging && this.dragStart !== null;
	}

	// Get current zoom level as percentage
	get zoomPercentage(): number {
		return Math.round(this.scale * 100);
	}

	// Notify viewport change callback
	private notifyViewportChange(): void {
		if (this.config.onViewportChange) {
			this.config.onViewportChange(this.scale, this.translateX, this.translateY);
		}
	}
}
