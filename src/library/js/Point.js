/**
 * Represents a 2D Point.
 */
export default class Point {
	/**
	 * Create a Point.
	 * @param {number} x - the x of point.
	 * @param {number} y - the y of point.
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
	 * @param {number} The x value.
	 */
	set x (value) {
		if (!isNaN(value)) {
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
	 * @param {number} The y value.
	 */
	set y (value) {
		if (!isNaN(value)) {
			this._y = Number(value);
		}
	}

	/**
	 * Get distance to a point.
	 * @param {Point} Object of Point class.
	 * @return {number|NaN} The distance.
	 */
	distanceTo (point) {
		point = point || {};
		return Math.sqrt((point.x - this.x)**2 + (point.y - this.y)**2);
	}

	/**
	 * Check that argument point is equal to self.
	 * @param  {Object} point Object with x and y properties.
	 * @return {boolean} Are points is equal?
	 */
	isEqualTo (point) {
		point = point || {};
		return point.x === this.x && point.y === this.y;
	}
}
