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
		this._seed = isNaN(seed) || !isFinite(seed)
			? Math.random()
			: Number(seed);
	}

	/**
	 * Resturs random number between min and max.
	 * @param  {number} [min=0] Lower bound.
	 * @param  {number} [max=1] Upper bound.
	 * @return {number} Float between min and max.
	 */
	generate (min, max) {
		max = isNaN(max) ? 1 : Number(max);
		min = isNaN(min) ? 0 : Number(min);
		const random = this._updateSeed() / 233280;
		return min + random * (max - min);
	}

	/**
	 * Update seed.
	 * @return {number} Updated seed.
	 */
	_updateSeed () {
		return this._seed = (this._seed * 9301 + 49297) % 233280;
	}
}
