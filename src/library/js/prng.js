import { isFiniteNumber } from './utils.js';

/**
 * Returns a Pseudo Random Number Generator based on seed from first argument.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/.
 * @param {number} seed Finite number seed.
 * @return {function():number} Function that returns pseudo random number from 0 to 1.
 */
export const createGenerator = seed => {
  if (!isFiniteNumber(seed)) {
    throw TypeError('First argument "seed" must be a finite number.');
  }

  let currentSeed = seed;

  return () => {
    const oldSeed = currentSeed;
    const newSeed = ((oldSeed * 9301) + 49297) % 233280; // this values provides most random numbers
    const random = newSeed / 233280;
    currentSeed = newSeed;

    return random;
  };
};
