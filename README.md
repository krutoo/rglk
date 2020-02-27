# ⚔️ rglk.js 🐉

Simple library for development roguelike games, designed for training purposes.
Inspired by [rot.js](http://ondras.github.io/rot.js/hp/).

## Using

In Node.js use this command:

```bash
npm install --save rglk
```

## Features

**rglk** allows to build simple 2d dungeons, define field of view, search path between two points and generates pseudo random numbers.

### Dungeon 🏗️

Object of class Dungeon can generate a random two-dimensional map consisting of walls and floors. You can decide the size of rooms, rooms amount and length of corridors between rooms. Dungeon map can be restored by seed.

```javascript
import { Dungeon } from 'rglk';

// create a new generated dungeon
const dungeon = new Dungeon({
  roomsAmount: 64,
  roomMinSize: 5,
  roomMaxSize: 11,
  corridorMinLength: 1,
  corridorMaxLength: 10,
  seed: 12345,
});

// each call rebuilds dungeon
dungeon.generate();

// process each tile
dungeon.forEachTile((x, y, isFloor) => {
  // ...draw wall or floor
});

// check tile type (returns boolean)
dungeon.isWall(x, y);
dungeon.isFloor(x, y);
```

### createExplorer 👁️

`createExplorer` returns function that allows to define 2d FOV based on **raycasting** algorytm.

```javascript
import { createExplorer } from 'rglk';

const explore = createExplorer((x, y) => {
  // should return boolean depends on tile is transparent
});

// get array of visible tile positions
const fov = explore(centerX, centerY, radius, (x, y) => {
  // this callback will be executed if tile is visible
});
```

### createPathfinder 🏃

`createPathfinder` returns function which works based on an algorithm __A*__.

```javascript
import { createPathfinder } from 'rglk';

const findPath = createPathfinder((x, y) => {
  // should return true if tile is can be visited
});

// returns Array of points
findPath(x1, y1, x2, y2);
```

### createPRNG 💾

`createPRNG` (Pseudo Random Number Generator) allows you to get random numbers based on the seed.

```javascript
import { createPRNG } from 'rglk';

// two generators with same seed
const first = createPRNG(123);
const second = createPRNG(123);

first() === second(); // true
```
