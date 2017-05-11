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
	random(min, max) {
		var args = Array.prototype.slice.call(arguments);
		
		if (!args.length) {
			return Math.random();
		} else if (args.length === 1) {
			return Math.round(min * Math.random());
		} else if (args.length === 2) {
			return Math.round(min + Math.random() * (max - min));
		}
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
		length = (!isNaN(length) && length > 0) ? length : 1;
		
		var id = '';
		
		while (id.length < length) {
			var char = Math.random().toString(16).slice(2);
			
			id += char;
		}
		
		return id.slice(0, length);
	}

	/*
	 * Array
	 */
	arrayGetRandom(array) {
		if (!array.length) { 
			return null; 
		}
		return array[this.random(0, array.length - 1)];
	}

	arrayRandomize(array) {
		var clone = array.slice();
		
		clone.sort(function() {
			return (Math.random() >= 0.5) ? 1 : -1;
		});
		
		return clone;
	}
}

export default Helper;