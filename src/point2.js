export default class Point2 {
	constructor(x, y) {
		this._x = isNaN(x) ? 0 : x;
		this._y = isNaN(x) ? 0 : y;
	}

	get x() {
		return this._x;
	}
	
	set x(value) {
		if (isNaN(value)) {
			console.warn(`Point2.x: value ${value} is NaN`);
		} else {
			this._x = value;
		}
	}

	get y() {
		return this._y;
	}

	set y(value) {
		if (isNaN(value)) {
			console.warn(`Point2.y: value ${value} is NaN`);
		} else {
			this._y = value;
		}
	}
	
	distance(point2) {
		return Math.sqrt(Math.pow(point2.x - this.x, 2) + Math.pow(point2.y - this.y, 2));
	}
}