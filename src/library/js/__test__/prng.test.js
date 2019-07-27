import { createGenerator } from '../prng.js';

describe('createGenerator', () => {
  test('should throw when argument is not a finite number', () => {
    const invalidValues = [
      '1',
      true,
      null,
      undefined,
      {},
      Object,
      Symbol('test'),
    ];
    invalidValues.forEach(value => {
      expect(() => createGenerator(value)).toThrow('First argument "seed" must be a finite number.');
    });
  });
  test('should number generators that based on seed', () => {
    const firstGen = createGenerator(123);
    const secondGen = createGenerator(123);

    let firstGenValue;
    let secondGenValue;

    for (let i = 0; i < 10; i++) {
      firstGenValue = firstGen();
      secondGenValue = secondGen();
      expect(typeof firstGenValue).toBe('number');
      expect(firstGenValue).toBe(secondGenValue);
    }
  });
});
