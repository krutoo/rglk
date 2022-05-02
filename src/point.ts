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

  clone() {
    return new Point(this.x, this.y);
  }

  static equals(a: Point, b: Point): boolean {
    return a && b && a.x === b.x && a.y === b.y;
  }
}
