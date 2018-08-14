/**
 * Seeds for generators
 * @type {WeakMap}
 */
const seeds = new WeakMap();

/**
 * Represents a Pseudo Random Number Generator.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 */
export default class PRNG {
	/**
	 * Create a PRNG.
	 * @param {number} seed Seed - number which will the base for generate numbers.
	 */
	constructor (seed) {
		if (isNaN(seed) && !isFinite(seed)) {
			throw new TypeError('PRNG.constructor: first argument must be a finite number');
		}
		seeds.set(this, Number(seed));
	}

	/**
	 * Returns random number between min and max.
	 * @return {number} Float number between 0 and 1.
	 */
	generate (min, max) {
		const oldSeed = seeds.get(this);
		const newSeed = (oldSeed * 9301 + 49297) % 233280
		const random = newSeed / 233280;
		seeds.set(this, newSeed);
		return random;
	}
}
