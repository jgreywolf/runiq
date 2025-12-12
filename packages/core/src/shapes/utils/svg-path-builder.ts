/**
 * SVG Path Builder - Fluent API for constructing SVG path data
 * Provides a type-safe, chainable interface for building complex SVG paths
 */

export class SvgPathBuilder {
  private commands: string[] = [];

  /**
   * Move to absolute position (M command)
   */
  moveTo(x: number, y: number): this {
    this.commands.push(`M ${x},${y}`);
    return this;
  }

  /**
   * Move by relative offset (m command)
   */
  moveBy(dx: number, dy: number): this {
    this.commands.push(`m ${dx},${dy}`);
    return this;
  }

  /**
   * Line to absolute position (L command)
   */
  lineTo(x: number, y: number): this {
    this.commands.push(`L ${x},${y}`);
    return this;
  }

  /**
   * Line by relative offset (l command)
   */
  lineBy(dx: number, dy: number): this {
    this.commands.push(`l ${dx},${dy}`);
    return this;
  }

  /**
   * Horizontal line to absolute x (H command)
   */
  horizontalTo(x: number): this {
    this.commands.push(`H ${x}`);
    return this;
  }

  /**
   * Horizontal line by relative distance (h command)
   */
  horizontalBy(dx: number): this {
    this.commands.push(`h ${dx}`);
    return this;
  }

  /**
   * Vertical line to absolute y (V command)
   */
  verticalTo(y: number): this {
    this.commands.push(`V ${y}`);
    return this;
  }

  /**
   * Vertical line by relative distance (v command)
   */
  verticalBy(dy: number): this {
    this.commands.push(`v ${dy}`);
    return this;
  }

  /**
   * Quadratic Bezier curve to absolute position (Q command)
   * @param cx Control point x
   * @param cy Control point y
   * @param x End point x
   * @param y End point y
   */
  quadraticTo(cx: number, cy: number, x: number, y: number): this {
    this.commands.push(`Q ${cx},${cy} ${x},${y}`);
    return this;
  }

  /**
   * Quadratic Bezier curve by relative offset (q command)
   */
  quadraticBy(dcx: number, dcy: number, dx: number, dy: number): this {
    this.commands.push(`q ${dcx},${dcy} ${dx},${dy}`);
    return this;
  }

  /**
   * Cubic Bezier curve to absolute position (C command)
   * @param c1x First control point x
   * @param c1y First control point y
   * @param c2x Second control point x
   * @param c2y Second control point y
   * @param x End point x
   * @param y End point y
   */
  cubicTo(
    c1x: number,
    c1y: number,
    c2x: number,
    c2y: number,
    x: number,
    y: number
  ): this {
    this.commands.push(`C ${c1x},${c1y} ${c2x},${c2y} ${x},${y}`);
    return this;
  }

  /**
   * Cubic Bezier curve by relative offset (c command)
   */
  cubicBy(
    dc1x: number,
    dc1y: number,
    dc2x: number,
    dc2y: number,
    dx: number,
    dy: number
  ): this {
    this.commands.push(`c ${dc1x},${dc1y} ${dc2x},${dc2y} ${dx},${dy}`);
    return this;
  }

  /**
   * Smooth cubic Bezier curve to absolute position (S command)
   * First control point is reflection of previous control point
   */
  smoothCubicTo(c2x: number, c2y: number, x: number, y: number): this {
    this.commands.push(`S ${c2x},${c2y} ${x},${y}`);
    return this;
  }

  /**
   * Smooth cubic Bezier curve by relative offset (s command)
   */
  smoothCubicBy(dc2x: number, dc2y: number, dx: number, dy: number): this {
    this.commands.push(`s ${dc2x},${dc2y} ${dx},${dy}`);
    return this;
  }

  /**
   * Arc to absolute position (A command)
   * @param rx Horizontal radius
   * @param ry Vertical radius
   * @param rotation X-axis rotation in degrees
   * @param largeArc Use large arc (1) or small arc (0)
   * @param sweep Clockwise (1) or counter-clockwise (0)
   * @param x End point x
   * @param y End point y
   */
  arcTo(
    rx: number,
    ry: number,
    rotation: number,
    largeArc: 0 | 1,
    sweep: 0 | 1,
    x: number,
    y: number
  ): this {
    this.commands.push(
      `A ${rx},${ry} ${rotation} ${largeArc} ${sweep} ${x},${y}`
    );
    return this;
  }

  /**
   * Arc by relative offset (a command)
   */
  arcBy(
    rx: number,
    ry: number,
    rotation: number,
    largeArc: 0 | 1,
    sweep: 0 | 1,
    dx: number,
    dy: number
  ): this {
    this.commands.push(
      `a ${rx},${ry} ${rotation} ${largeArc} ${sweep} ${dx},${dy}`
    );
    return this;
  }

  /**
   * Close path (Z command)
   */
  close(): this {
    this.commands.push('Z');
    return this;
  }

  /**
   * Add raw path command string
   */
  raw(command: string): this {
    this.commands.push(command);
    return this;
  }

  /**
   * Build and return the final path string
   */
  build(): string {
    return this.commands.join(' ');
  }

  /**
   * Build and return the final path string (alias for build)
   */
  toString(): string {
    return this.build();
  }
}

/**
 * Create a new SVG path builder
 */
export function createPath(): SvgPathBuilder {
  return new SvgPathBuilder();
}

/**
 * Helper: Create a polygon path from points
 */
export function createPolygonPath(
  points: Array<{ x: number; y: number }>
): string {
  if (points.length === 0) return '';

  const builder = createPath().moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    builder.lineTo(points[i].x, points[i].y);
  }

  return builder.close().build();
}

/**
 * Helper: Create a rounded rectangle path
 */
export function createRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  const r = Math.min(radius, width / 2, height / 2);

  return createPath()
    .moveTo(x + r, y)
    .horizontalTo(x + width - r)
    .arcTo(r, r, 0, 0, 1, x + width, y + r)
    .verticalTo(y + height - r)
    .arcTo(r, r, 0, 0, 1, x + width - r, y + height)
    .horizontalTo(x + r)
    .arcTo(r, r, 0, 0, 1, x, y + height - r)
    .verticalTo(y + r)
    .arcTo(r, r, 0, 0, 1, x + r, y)
    .close()
    .build();
}
