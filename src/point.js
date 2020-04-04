import curry from 'lodash/curry';

/**
 * Represents 2D Point.
 */
export class Point {
  /**
   * @param {number} x The x of point.
   * @param {number} y The y of point.
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get x value.
   * @return {number} The x value.
   */
  get x () {
    return Number(this._x) || 0;
  }

  /**
   * Set x value.
   * @param {number} value The X value.
   * @readonly
   */
  set x (value) {
    if (Number.isFinite(value)) {
      this._x = Number(value);
    }
  }

  /**
   * Get y value.
   * @return {number} The y value.
   */
  get y () {
    return Number(this._y) || 0;
  }

  /**
   * Set y value.
   * @param {number} value The Y value.
   */
  set y (value) {
    if (Number.isFinite(value)) {
      this._y = Number(value);
    }
  }

  /**
   * Returns a distance to a point.
   * @param {Point} point Target point.
   * @return {number} Distance.
   */
  getDistanceTo (point) {
    return Math.sqrt(
      ((point.x - this.x) ** 2) + ((point.y - this.y) ** 2)
    );
  }

  clone () {
    return new Point(this.x, this.y);
  }
}

/**
 * Check that tow arguments is equal 2d points.
 * @param {Object} point Object with x and y properties.
 * @return {boolean} Are points is equal?
 */
Point.isEqual = curry((a, b) => a && b && a.x === b.x && a.y === b.y);
