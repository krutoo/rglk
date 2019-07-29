import Point from '../point.js';

/**
 * Represents a 2D Rectangle.
 */
export default class Rectangle extends Point {
  /**
   * @param {number} x Left border position of rectangle.
   * @param {number} y Top border position of rectangle.
   * @param {number} width Width of rectangle.
   * @param {number} height Height of rectangle.
   */
  constructor (x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  /**
   * Get width of Rectangle.
   * @return {number} The width of Rectangle.
   * @readonly
   */
  get width () {
    return Number(this._width) || 0;
  }

  /**
   * Set width of Rectangle.
   * @param {number} value The Width of Rectangle.
   * @readonly
   */
  set width (value) {
    if (!isNaN(value)) {
      this._width = Number(value);
    }
  }

  /**
   * Get height of Rectangle.
   * @return {number} The height of Rectangle.
   * @readonly
   */
  get height () {
    return Number(this._height) || 0;
  }

  /**
   * Set height of Rectangle.
   * @param {number} value The Height of Rectangle.
   * @readonly
   */
  set height (value) {
    if (!isNaN(value)) {
      this._height = Number(value);
    }
  }

  /**
   * Get left of Rectangle.
   * @return {number} The left border of Rectangle.
   * @readonly
   */
  get left () {
    return this.x;
  }

  /**
   * Set left of Rectangle.
   * @param {number} value The Left border of Rectangle.
   * @readonly
   */
  set left (value) {
    this.x = value;
  }

  /**
   * Get bottom of Rectangle.
   * @return {number} The bottom border of Rectangle.
   * @readonly
   */
  get bottom () {
    return this.y + this.height;
  }

  /**
   * Set bottom of Rectangle.
   * @param {number} value The Bottom border of Rectangle.
   * @readonly
   */
  set bottom (value) {
    this.y = value - this.height;
  }

  /**
   * Get right of Rectangle.
   * @return {number} The right border of Rectangle.
   * @readonly
   */
  get right () {
    return this.x + this.width;
  }

  /**
   * Set right of Rectangle.
   * @param {number} value The Right border of Rectangle.
   * @readonly
   */
  set right (value) {
    this.x = value - this.width;
  }

  /**
   * Get top of Rectangle.
   * @return {number} The top border of Rectangle.
   * @readonly
   */
  get top () {
    return this.y;
  }

  /**
   * Set top of Rectangle.
   * @param {number} value The Top border of Rectangle.
   * @readonly
   */
  set top (value) {
    this.y = value;
  }

  /**
   * Get center of Rectangle.
   * @return {Point} Point with coordinates to center of Rectangle.
   * @readonly
   */
  get center () {
    return new Point(
      this.x + (this.width / 2),
      this.y + (this.height / 2)
    );
  }

  /**
   * Check collides with other Rectangle.
   * @param {Rectangle} rectangle Rectangle to check.
   * @return {boolean} Rectangles collides?
   */
  collides (rectangle) {
    let result = true;

    if (
      this.left > rectangle.right
      || this.right < rectangle.left
      || this.top > rectangle.bottom
      || this.bottom < rectangle.top
    ) {
      result = false;
    }

    return result;
  }
}
