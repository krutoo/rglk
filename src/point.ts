/**
 * Represents 2D Point.
 */
export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a distance to a point.
   * @param point Target point.
   * @return Distance.
   */
  getDistanceTo(point: Point) {
    return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
  }

  clone() {
    return new Point(this.x, this.y);
  }

  static isEqual(a: Point, b: Point): boolean {
    return a && b && a.x === b.x && a.y === b.y;
  }
}
