import Point from './Point.js';

/**
 * Rectangles private data.
 * @type {WeakMap}
 */
const rectanglesData = new WeakMap();

/**
 * Represents a 2D Rectangle.
 * @extends Point
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
		rectanglesData.set(this, {});
		this.width = width;
		this.height = height;
	}

	/**
	 * Get width of Rectangle.
	 * @return {number} The width of Rectangle.
	 */
	get width () {
		return Number(rectanglesData.get(this).width) || 0;
	}

	/**
	 * Set width of Rectangle.
	 * @param {number} The Width of Rectangle.
	 */
	set width (value) {
		if (!isNaN(value)) {
			rectanglesData.get(this).width = Number(value);
		}
	}

	/**
	 * Get height of Rectangle.
	 * @return {number} The height of Rectangle.
	 */
	get height () {
		return Number(rectanglesData.get(this).height) || 0;
	}

	/**
	 * Set height of Rectangle.
	 * @param {number} The height of Rectangle.
	 */
	set height (value) {
		if (!isNaN(value)) {
			rectanglesData.get(this).height = Number(value);
		}
	}

	/**
	 * Get left of Rectangle.
	 * @return {number} The left border of Rectangle.
	 */
	get left () {
		return this.x;
	}

	/**
	 * Set left of Rectangle.
	 * @param {number} The left border of Rectangle.
	 */
	set left (value) {
		this.x = value;
	}

	/**
	 * Get bottom of Rectangle.
	 * @return {number} The bottom border of Rectangle.
	 */
	get bottom () {
		return this.y + this.height;
	}

	/**
	 * Set bottom of Rectangle.
	 * @param {number} The bottom border of Rectangle.
	 */
	set bottom (value) {
		this.y = value - this.height;
	}

	/**
	 * Get right of Rectangle.
	 * @return {number} The right border of Rectangle.
	 */
	get right () {
		return this.x + this.width;
	}

	/**
	 * Set right of Rectangle.
	 * @param {number} The right border of Rectangle.
	 */
	set right (value) {
		this.x = value - this.width;
	}

	/**
	 * Get top of Rectangle.
	 * @return {number} The top border of Rectangle.
	 */
	get top () {
		return this.y;
	}

	/**
	 * Set top of Rectangle.
	 * @param {number} The top border of Rectangle.
	 */
	set top (value) {
		this.y = value;
	}

	/**
	 * Get center of Rectangle.
	 * @return {Point} Point with coordinates to center of Rectangle.
	 */
	get center () {
		return new Point(
			this.x + (this.width / 2),
			this.y + (this.height / 2),
		);
	}

	/**
	 * Check collides with other Rectangle.
	 * @param {Rectangle} rectangle to check.
	 * @return {boolean} Rectangles collides?.
	 */
	collides (rectangle) {
		rectangle = rectangle || {};
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
