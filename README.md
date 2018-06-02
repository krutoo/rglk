# ⚔️ rglk.js 🐉
Simple library for development roguelike games, designed for training purposes. Inspired by [rot.js](http://ondras.github.io/rot.js/hp/).

## Using
In Node.js use this command:
```
npm install --save rglk
```

## Features
List of constructors in **rglk**.

### Dungeon 🏗️


Object of class Dungeon can generate a random two-dimensional map consisting of walls and floors. You can decide the size of rooms, rooms amount and length of corridors between rooms. Dungeon map can be restored by seed.
```javascript
import { Dungeon } from 'rglk';

const dungeon = new Dungeon({
    roomsAmount: 64,
    roomMinSize: 5,
    roomMaxSize: 11,
    corridorMinLength: 1,
    corridorMaxLength: 10,
    seed: 12345,
});

// each call returns new random dungeon
dungeon.generate();

// for generated dungeon
dungeon.forEachTile((x, y, isFloor) => {
    // ...draw wall or floor
});

// check tile, returns Boolean
dungeon.isWall(x, y);
```

### Explorer 👁️
Object of class Explorer allows to define FOV based on **raycasting** algorytm.
```javascript
import { Explorer } from 'rglk';

const explorer = new Explorer((x, y) => {
    // return true if tile is transparent
});

explorer.calculate(centerX, centerY, radius, (x, y) => {
    // this code will be executed if tile is visible
});
```

### Pathfinder 🏃
The work of Pathfinder is based on an algorithm __A*__.
```javascript
import { Explorer } from 'rglk';

const pathfinder = new Pathfinder((x, y) => {
    // return true if tile is can be visited
});

pathfinder.search(x1, y1, x2, y2); // returns Array of points
```

### PRNG 💾
Object of class PRNG (Pseudo Random Number Generator) allows you to get numbers based on the seed.
```javascript
import { PRNG } from 'rglk';

const prng1 = new PRNG(123),
      prng2 = new PRNG(123);

prng1.getRandom(min, max) === prng1.getRandom(min, max); // true
```
