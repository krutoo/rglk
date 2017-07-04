# rglk.js ⚔️
Very simple library for development roguelike games, designed for training purposes. Inspired by [rot.js](http://ondras.github.io/rot.js/hp/).

## Features
### Dungeon
Object of class Dungeon generates a random two-dimensional map consisting of walls and floors. You can decide the size of rooms, rooms amount and length of corridors between rooms.
```javascript
var dungeon = new rglk.Dungeon({
	roomAmount: 64, 
	roomMinSize: 5, 
	roomMaxSize: 11, 
	corridorMinLength: 1,
	corridorMaxLength: 10,
	seed: 12345
});

// each call returns new random dungeon
dungeon.generate();

// for generated dungeon
dungeon.forEachTile(function makeTile(x, y, isFloor) {
	// ...draw tile?
});

// check tile, returns Boolean
dungeon.isWall(x, y);
```

### Explorer
object of class Explorer allows to define FOV based on **raycasting** algorytm.
```javascript
var explorer = new rglk.Explorer(function isTtransparentTile(x, y) {
	// return Boolean
});

explorer.calculate(centerX, centerY, radius, function isExploredCallback(x, y) {
	// ...draw title?
});
```

### Pathfinder
The work of Pathfinder is based on an algorithm __A*__.
```javascript
var pathfinder = new rglk.Pathfinder(function isWalkable(x, y) {
	// return Boolean
});

pathfinder.search(x1, y1, x2, y2); // returns Array of points
```

### PRNG
Constructor PRNG (Pseudo Random Number Generator) retuns object, which allows you to get numbers based on the seed.
```javascript
var prng = new rglk.PRNG(0);

prng.seed = 2;

prng.getRandom(min, max); // returns Number
```