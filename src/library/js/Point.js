/**
 * Points private data.
 * @type {WeakMap}
 */
const pointsData = new WeakMap();

/**
 * Represents 2D Point.
 */
export default class Point {
  /**
   * @param {number} x - The x of point.
   * @param {number} y - The y of point.
   */
  constructor (x, y) {
    pointsData.set(this, {});
    this.x = x;
    this.y = y;
  }

  /**
   * Get x value.
   * @return {number} The x value.
   */
  get x () {
    return Number(pointsData.get(this).x) || 0;
  }

  /**
   * Set x value.
   * @param {number} value The X value.
   * @readonly
   */
  set x (value) {
    if (!isNaN(value)) {
      pointsData.get(this).x = Number(value);
    }
  }

  /**
   * Get y value.
   * @return {number} The y value.
   */
  get y () {
    return Number(pointsData.get(this).y) || 0;
  }

  /**
   * Set y value.
   * @param {number} value The Y value.
   */
  set y (value) {
    if (!isNaN(value)) {
      pointsData.get(this).y = Number(value);
    }
  }

  /**
   * Returns a distance to a point.
   * @param {Point} point Target point.
   * @return {number} Distance.
   */
  getDistanceTo (point) {
    point = point || {};
    return Math.sqrt(((point.x - this.x) ** 2) + ((point.y - this.y) ** 2));
  }

  /**
   * Check that argument point is equal to self.
   * @param {Object} point Object with x and y properties.
   * @return {boolean} Are points is equal?
   */
  isEqualTo (point) {
    point = point || {};
    return point.x === this.x && point.y === this.y;
  }
}
