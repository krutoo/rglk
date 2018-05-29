import Point from './Point';

export default class Node extends Point {
	constructor(options) {
		options = options || {};
		super(options.x, options.y);
		this.g = options.g;
		this.h = options.h;
		this.parent = options.parent;
	}

	get g () {
		return Number(this._g) || 0;
	}

	set g (value) {
		if (!isNaN(value)) {
			this._g = Number(value);
		}
	}

	get h () {
		return Number(this._h) || 0;
	}

	set h (value) {
		if (!isNaN(value)) {
			this._h = Number(value);
		}
	}

	get parent () {
		return this._parent instanceof Node
			? this._parent
			: null;
	}

	set parent (node) {
		if (node instanceof Node) {
			this._parent = value;
		}
	}

	get f () {
		return (this.g + this.h);
	}
}
