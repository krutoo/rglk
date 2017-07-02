import Point2 from './point2';

export default class Rectangle extends Point2 {
	constructor(x, y, width, height) {
		super(x, y);

		this._width = isNaN(width) ? 1: width;
		this._height = isNaN(height) ? 1: height;
	}

	// x
	get x() {
		return this._x;
	}

	set x(value) {
		if (isNaN(value)) {
			return;
		}
		this._x = value;
	}

	// y
	get y() {
		return this._y;
	}

	set y(value) {
		if (isNaN(value)) {
			return;
		}
		this._y = value;
	}

	// width
	get width() {
		return this._width;
	}

	set width(value) {
		if (isNaN(value)) {
			return;
		}
		this._width = value;
	}

	// height
	get height() {
		return this._height;
	}

	set height(value) {
		if (isNaN(value)) {
			return;
		}
		this._height = value;
	}

	// top
	get top() {
		return this._y;
	}

	// right
	get right() {
		return this._x + this._width - 1;
	}

	// bottom
	get bottom() {
		return this._y + this._height - 1;
	}

	// left
	get left() {
		return this._x;
	}

	// check collides
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