/**
 * Represents a 2D Point.
 */
export default class Point {
	/**
	 * Create a Point.
	 * @param {number} x - the x of point.
	 * @param {number} y - the y of point.
	 */
	constructor(x, y) {
		this._x = isNaN(x) ? 0 : x;
		this._y = isNaN(x) ? 0 : y;
	}

	/**
	 * Get x value.
	 * @return {number} The x value.
	 */
	get x() {
		return this._x;
	}

	/**
	 * Set x value.
	 * @param {number} The x value.
	 */
	set x(value) {
		if (isNaN(value)) {
			console.warn(`Point.x: value ${value} is NaN`);
		} else {
			this._x = value;
		}
	}

	/**
	 * Get y value.
	 * @return {number} The y value.
	 */
	get y() {
		return this._y;
	}

	/**
	 * Set y value.
	 * @param {number} The y value.
	 */
	set y(value) {
		if (isNaN(value)) {
			console.warn(`Point.y: value ${value} is NaN`);
		} else {
			this._y = value;
		}
	}

	/**
	 * Get distance to a point.
	 * @param {object} Object of Point class.
	 * @return {number} The distance.
	 */
	distance(point2) {
		return Math.sqrt(Math.pow(point2.x - this.x, 2) + Math.pow(point2.y - this.y, 2));
	}
}