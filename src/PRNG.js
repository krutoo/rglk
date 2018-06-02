/**
 * Represents a Pseudo Random Number Generator.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 */
export default class PRNG {
	/**
	 * Create a PRNG.
	 * @param  {number} seed Seed - number which will the base for generate numbers.
	 */
	constructor (seed) {
		this._seed = isNaN(seed) // @TODO не изменять seed
			? Math.random()
			: Number(seed);
	}

	generate (min, max) {
		max = isNaN(max) ? 1 : Number(max);
		min = isNaN(min) ? 0 : Number(min);
		const rnd = this._updateSeed() / 233280;
		return min + rnd * (max - min);
	}

	_updateSeed () {
		return this._seed = (this._seed * 9301 + 49297) % 233280;
	}
}
