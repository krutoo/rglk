/**
 * Returns a Pseudo Random Number Generator based on seed from first argument.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/.
 * @param seed Finite number seed.
 * @return Function that returns pseudo random number from 0 to 1.
 */
export function createPRNG(seed: number): () => number {
  let part = seed;

  return (): number => {
    // these magic values provides most random numbers
    const newSeed = (part * 9301 + 49297) % 233280;
    const value = newSeed / 233280;

    part = newSeed;

    return value;
  };
}
