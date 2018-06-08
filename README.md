# ⚔️ rglk.js 🐉
Simple library for development roguelike games, designed for training purposes. Inspired by [rot.js](http://ondras.github.io/rot.js/hp/).

## Using
In Node.js use this command:
```
npm install --save rglk
```

## Features
Constructors in **rglk** namespace allows to build simple 2d dungeons, define field of view, search path between two points and generates pseudo random numbers.

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

### Explorer 👁️
Object of class Explorer allows to define FOV based on **raycasting** algorytm.
```javascript
import { Explorer } from 'rglk';

const explorer = new Explorer((x, y) => {
    // should return true if tile is transparent
});

// get array of visible tile positions
const fov = explorer.calculate(centerX, centerY, radius, (x, y) => {
    // this code will be executed if tile is visible
});
```

### Pathfinder 🏃
The work of Pathfinder is based on an algorithm __A*__.
```javascript
import { Explorer } from 'rglk';

const pathfinder = new Pathfinder((x, y) => {
    // should return true if tile is can be visited
});

// returns Array of points
pathfinder.search(x1, y1, x2, y2);
```

### PRNG 💾
Object of class PRNG (Pseudo Random Number Generator) allows you to get numbers based on the seed.
```javascript
import { PRNG } from 'rglk';

const prng1 = new PRNG(123),
      prng2 = new PRNG(123);

prng1.getRandom(2, 24) === prng1.getRandom(2, 24); // true
```
