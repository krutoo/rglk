import assert from 'node:assert';
import { describe, test } from 'node:test';
import { createPRNG } from '../index.ts';

describe('createGenerator', () => {
  test('should number generators that based on seed', () => {
    const firstGen = createPRNG(123);
    const secondGen = createPRNG(123);

    let firstGenValue;
    let secondGenValue;

    for (let i = 0; i < 10; i++) {
      firstGenValue = firstGen();
      secondGenValue = secondGen();
      assert.strictEqual(typeof firstGenValue, 'number');
      assert.strictEqual(firstGenValue, secondGenValue);
    }
  });
});
