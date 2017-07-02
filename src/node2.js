import Point2 from './point2';

export default class Node2 extends Point2 {
	constructor(options = {}) {
		super(options.x, options.y);

		this._g = isNaN(options.g) ? 0 : options.g;
		this._h = isNaN(options.h) ? 0 : options.h;
		this._parent = (options.parent instanceof Node2) ? options.parent : null;
	}

	get g() {
		return this._g;
	}

	set g(value) {
		if (isNaN(value)) {
			console.warn(`Node2.g: value ${value} is NaN`);
		} else {
			this._g = value;
		}
	}

	get h() {
		return this._h;
	}

	set h(value) {
		if (isNaN(value)) {
			console.warn(`Node2.h: value ${value} is NaN`);
		} else {
			this._h = value;
		}
	}

	get parent() {
		return this._parent;
	}

	set parent(value) {
		if (value instanceof Node2) {
			this._parent = value;
		} else {
			console.warn(`Node2.parent: value ${value} is not a Node2`);
		}
	}

	get f() {
		return (this.g + this.h);
	}
}