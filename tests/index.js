import assert from 'node:assert';
import { createExplorer, createPathfinder, createPRNG, Dungeon } from 'rglk';

assert.strictEqual('function' === typeof createExplorer, true);
assert.strictEqual('function' === typeof createPathfinder, true);
assert.strictEqual('function' === typeof createPRNG, true);
assert.strictEqual('function' === typeof Dungeon, true);
