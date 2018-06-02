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
		this.x = x;
		this.y = y;
	}

	static create (object) {
		object = object || {};
		return new Point(
			object.x,
			object.y,
		);
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
	 * @return {number} The distance.
	 */
	distance (point) {
		point = point || {};
		return Math.sqrt(Math.pow(point2.x - this.x, 2) + Math.pow(point2.y - this.y, 2));
	}

	isEqualTo (point) {
		let result = false;
		if (point instanceof Point) {
			result = point.x === this.x && point.y === this.y;
		}
		return result;
	}
}
