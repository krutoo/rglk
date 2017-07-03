import Point from './point';

export default class Node extends Point {
	constructor(options = {}) {
		super(options.x, options.y);

		this._g = isNaN(options.g) ? 0 : options.g;
		this._h = isNaN(options.h) ? 0 : options.h;
		this._parent = (options.parent instanceof Node) ? options.parent : null;
	}

	get g() {
		return this._g;
	}

	set g(value) {
		if (isNaN(value)) {
			return;
		} else {
			this._g = value;
		}
	}

	get h() {
		return this._h;
	}

	set h(value) {
		if (isNaN(value)) {
			return;
		} else {
			this._h = value;
		}
	}

	get parent() {
		return this._parent;
	}

	set parent(value) {
		if (value instanceof Node) {
			this._parent = value;
		} else {
			return;
		}
	}

	get f() {
		return (this.g + this.h);
	}
}