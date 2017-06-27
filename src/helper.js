class Helper {
	constructor() {}

	/*
	 * Object
	 */
	classOf(object) {
		return Object.prototype.toString.call(object).slice(8, -1);
	}

	isObject(object) {
		return (this.classOf(object) === 'Object');
	}

	isFunction(object) {
		return (this.classOf(object) === 'Function');
	}

	isString(object) {
		return (typeof object === 'string' || object instanceof String);
	}

	/*
	 * Math
	 */
	random(max, min) {
		max = isNaN(max) ? 1 : max;
		min = isNaN(min) ? 0 : min;

		return Math.random() * (max - min) + min;
	}

	randomInt(max, min) {
		return Math.round(this.random(max, min));
	}

	lerp(start, end, amt) {
		return (1 - amt) * start + amt * end;
	}

	toRadian(degrees) {
		return degrees * Math.PI / 180;
	}

	toDegree(radians) {
		return radians * 180 / Math.PI;
	}

	generateID(length) {
		length = (!isNaN(length) && length > 0) ? length : 8;

		var id = '';

		while (id.length < length) {
			id += Math.random().toString(16).slice(2);
		}

		return id.slice(0, length);
	}

	/*
	 * Array
	 */
	arrayGetRandom(array) {
		if (!Array.isArray(array)) {
			console.warn(`Helper.arrayGetRandom: argument ${array} is not a Array`);
			return undefined;
		}

		if (!array.length) { 
			return null; 
		}

		return array[Math.round(this.random(0, array.length - 1))];
	}

	arrayRandomize(array) {
		if (!Array.isArray(array)) {
			console.warn(`Helper.arrayRandomize: argument ${array} is not a Array`);
			return array;
		}

		var clone = array.slice();

		clone.sort(() => {
			return (Math.random() >= 0.5) ? 1 : -1;
		});

		return clone;
	}
}

export default Helper;