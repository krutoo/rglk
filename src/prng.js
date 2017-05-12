// source: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
class PRNG {
	constructor(seed) {
		this._seed = isNaN(seed) ? 12345 : seed;
	}

	getRandom(min, max) {
		max = isNaN(max) ? 1 : max;
		min = isNaN(min) ? 0 : min;

		this._seed = (this._seed * 9301 + 49297) % 233280;
		var rnd = this._seed / 233280;

		return min + rnd * (max - min);
	}

	get seed() {
		return this._seed;
	}

	set seed(value) {
		if (isNaN(value)) {
			console.warn(`PRNG.seed: value ${value} is NaN`);
		} else {
			this._seed = value;
		}
	}
}

export default PRNG;