import Point from './Point';

/**
 * Represents a Rectangle
 * @extends Point
 */
export default class Rectangle extends Point {
	/**
	 * Create a Rectangle.
	 * @param {number} x - Left border position of rectangle.
	 * @param {number} y - Top border position of rectangle.
	 * @param {number} width - Width of rectangle.
	 * @param {number} height - Height of rectangle.
	 */
	constructor (x, y, width, height) {
		super(x, y);
		this.width = width;
		this.height = height;
	}

	/**
	 * Get width of Rectangle.
	 * @return {number} The width of Rectangle.
	 */
	get width () {
		return Number(this._width) || 0;
	}

	/**
	 * Set width of Rectangle.
	 * @param {number} The Width of Rectangle.
	 */
	set width (value) {
		if (!isNaN(value)) {
			this._width = Number(value);
		}
	}

	/**
	 * Get height of Rectangle.
	 * @return {number} The height of Rectangle.
	 */
	get height () {
		return Number(this._height) || 0;
	}

	/**
	 * Set height of Rectangle.
	 * @param {number} The height of Rectangle.
	 */
	set height (value) {
		if (!isNaN(value)) {
			this._height = Number(value);
		}
	}

	/**
	 * Get top of Rectangle.
	 * @return {number} The top border of Rectangle.
	 */
	get top () {
		return this.y;
	}

	/**
	 * Get right of Rectangle.
	 * @return {number} The right border of Rectangle.
	 */
	get right () {
		return this.x + this.width;
	}

	/**
	 * Get bottom of Rectangle.
	 * @return {number} The bottom border of Rectangle.
	 */
	get bottom () {
		return this.y + this.height;
	}

	/**
	 * Get left of Rectangle.
	 * @return {number} The left border of Rectangle.
	 */
	get left () {
		return this.x;
	}

	/**
	 * Get center of Rectangle.
	 * @return {Point} Point with coordinates to center of Rectangle.
	 */
	get center () {
		return new Point(
			this.x + (this.width / 2),
			this.y + (this.height / 2)
		);
	}

	/**
	 * Check collides with other Rectangle.
	 * @param {Object} rectangle Object with x, y, width and height properties.
	 * @return {boolean} Rectangles collides?.
	 */
	collides (rectangle) {
		rectangle = rectangle || {};
		let result = false;
		if (
			!isNaN(rectangle.x + rectangle.y + rectangle.width + rectangle.height)
			&& rectangle.x <= this.x + this.width
			&& rectangle.x + rectangle.width >= this.x
			&& rectangle.y <= this.y + this.height
			&& rectangle.height + rectangle.y >= this.y
		) {
			result = true;
		}
		return result;
	}

	// @TODO complete!
	forEachPoint (callback) {}
}
