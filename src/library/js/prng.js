import { isNumber } from './utils';

/**
 * Returns a Pseudo Random Number Generator based on seed from first argument.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 * @param {number} seed Finite number seed.
 * @return {function():number} Function that returns pseudo random number.
 */
export const createGenerator = seed => {
  if (!isNumber(seed) || !isFinite(seed)) {
    throw TypeError('First argument "seed" must be a finite number.');
  }

  let currentSeed = seed;

  return () => {
    const oldSeed = currentSeed;
    const newSeed = (oldSeed * 9301 + 49297) % 233280;
    const random = newSeed / 233280;
    currentSeed = newSeed;

    return random;
  };
};
