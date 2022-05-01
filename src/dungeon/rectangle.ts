import { Point } from '../point';

/**
 * Represents a 2D Rectangle.
 */
export class Rectangle extends Point {
  width: number;
  height: number;

  /**
   * @param x Left border position of rectangle.
   * @param y Top border position of rectangle.
   * @param width Width of rectangle.
   * @param height Height of rectangle.
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  /**
   * Get left of Rectangle.
   * @return The left border of Rectangle.
   */
  get left() {
    return this.x;
  }

  /**
   * Set left of Rectangle.
   * @param value The Left border of Rectangle.
   */
  set left(value) {
    this.x = value;
  }

  /**
   * Get bottom of Rectangle.
   * @return The bottom border of Rectangle.
   */
  get bottom() {
    return this.y + this.height;
  }

  /**
   * Set bottom of Rectangle.
   * @param value The Bottom border of Rectangle.
   */
  set bottom(value) {
    this.y = value - this.height;
  }

  /**
   * Get right of Rectangle.
   * @return The right border of Rectangle.
   */
  get right() {
    return this.x + this.width;
  }

  /**
   * Set right of Rectangle.
   * @param value The Right border of Rectangle.
   */
  set right(value) {
    this.x = value - this.width;
  }

  /**
   * Get top of Rectangle.
   * @return The top border of Rectangle.
   */
  get top() {
    return this.y;
  }

  /**
   * Set top of Rectangle.
   * @param value The Top border of Rectangle.
   */
  set top(value) {
    this.y = value;
  }

  /**
   * Get center of Rectangle.
   * @return Point with coordinates to center of Rectangle.
   */
  get center(): Point {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }

  /**
   * Check collides with other Rectangle.
   * @param rectangle Rectangle to check.
   * @return Rectangles collides?
   */
  collides(rectangle: Rectangle): boolean {
    let result = true;

    if (
      this.left > rectangle.right ||
      this.right < rectangle.left ||
      this.top > rectangle.bottom ||
      this.bottom < rectangle.top
    ) {
      result = false;
    }

    return result;
  }
}
