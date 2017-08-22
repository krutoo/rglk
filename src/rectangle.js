import Point from './point';

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
	constructor(x, y, width, height) {
		super(x, y);

		this._width = isNaN(width) ? 1: width;
		this._height = isNaN(height) ? 1: height;
	}

	/**
	 * Get width of Rectangle.
	 * @return {number} The width of Rectangle.
	 */
	get width() {
		return this._width;
	}

	/**
	 * Set width of Rectangle.
	 * @param {number} The Width of Rectangle.
	 */
	set width(value) {
		if (isNaN(value)) {
			return;
		}
		this._width = value;
	}

	/**
	 * Get height of Rectangle.
	 * @return {number} The height of Rectangle.
	 */
	get height() {
		return this._height;
	}

	/**
	 * Set height of Rectangle.
	 * @param {number} The height of Rectangle.
	 */
	set height(value) {
		if (isNaN(value)) {
			return;
		}
		this._height = value;
	}

	/**
	 * Get top of Rectangle.
	 * @return {number} The top border of Rectangle.
	 */
	get top() {
		return this._y;
	}

	/**
	 * Get right of Rectangle.
	 * @return {number} The right border of Rectangle.
	 */
	get right() {
		return this._x + this._width - 1;
	}

	/**
	 * Get bottom of Rectangle.
	 * @return {number} The bottom border of Rectangle.
	 */
	get bottom() {
		return this._y + this._height - 1;
	}

	/**
	 * Get left of Rectangle.
	 * @return {number} The left border of Rectangle.
	 */
	get left() {
		return this._x;
	}

	/**
	 * Get center of Rectangle.
	 * @return {Point} Point with coordinates to center of Rectangle.
	 */
	get center() {
		return new Point((this.right - this.left) / 2, (this.bottom - this.top) / 2);
	}

	/**
	 * Check collides with other Rectangle.
	 * @param {object} rectangle - Object of class Rectangle.
	 * @return {boolean} The boolean.
	 */
	collides(rectangle) {
		if (
			rectangle.left > this.left + this.width ||
			rectangle.left + rectangle.width < this.left ||
			rectangle.top > this.top + this.height ||
			rectangle.top + rectangle.height < this.top
		) {
			return false;
		}
		
		return true;
	}
}