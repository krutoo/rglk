import assert from 'node:assert';
import { test } from 'node:test';

test('should export things properly', async () => {
  const {
    //
    createExplorer,
    createPathfinder,
    createPRNG,
    Dungeon,
  } = await import('rglk');

  assert.strictEqual('function' === typeof createExplorer, true);
  assert.strictEqual('function' === typeof createPathfinder, true);
  assert.strictEqual('function' === typeof createPRNG, true);
  assert.strictEqual('function' === typeof Dungeon, true);
});
