# rglk.js
Very simple library for development roguelike games, designed for training purposes. Inspired by [rot.js](http://ondras.github.io/rot.js/hp/).

## usage
### Dungeon
Object of class Dungeon generates a random two-dimensional map consisting of walls and floors. You can decide the size of rooms, rooms amount and density of location.
```
var dungeon = new rglk.Dungeon({
	roomAmount: 64, 
	roomMinSize: 5, 
	roomMaxSize: 11, 
	density: 1
});

// each call returns new random dungeon
dungeon.generate(function (x, y, isFloor) {
	// ...draw tile?
});
```

### Explorer
object of class Explorer allows to define FOV.
```
var explorer = new rglk.Explorer(function isTtransparentTile(x, y) {
	// return Boolean
});

explorer.calculate(centerX, centerY, radius, function isExploredCallback(x, y) {
	// ...draw title?
})
```

### Pathfinder
The work of Pathfinder is based on an algorithm A*.
```
var pathfinder = new rglk.Pathfinder(function isWalkable (x, y) {
	// return Boolean
});

pathfinder.search(x1, y1, x2, y2); // returns array of points
```

### rglk.utils
Object containing utility methods for working with objects, arrays and numbers.
```
// Math
rglk.utils.random(2, 8); // returns 7 or 3 i don't know
rglk.utils.lerp(1, 2, 3); // linear interpolation
// and other

// Object
rglk.utils.classOf(2); // return 'Number'
rglk.utils.isObject(2); // return false
rglk.utils.isFunction(2); // also returns false
rglk.utils.isString(2); // and there

//Array
rglk.utils.arrayGetRandom([1, 2, 3]); // returns maybe [2,1,3]
rglk.utils.arrayRandomize([1 ,2 ,3]); // returns maybe 2
```
