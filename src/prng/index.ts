/**
 * Returns a Pseudo Random Number Generator based on seed from first argument.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/.
 * @param seed Finite number seed.
 * @return Function that returns pseudo random number from 0 to 1.
 */
export const createGenerator = (seed: number) => {
  if (!Number.isFinite(seed)) {
    throw Error('First argument "seed" must be a finite number.');
  }

  let currentSeed = seed;

  return (): number => {
    // this values provides most random numbers
    const newSeed = (currentSeed * 9301 + 49297) % 233280;
    const random = newSeed / 233280;

    currentSeed = newSeed;

    return random;
  };
};
