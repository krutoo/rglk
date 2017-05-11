;(function() {
'use strict';
var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	dungeon = new rglk.Dungeon({roomAmount: 1280, roomMinSize: 1, roomMaxSize: 1, density: 1}),
	pathfinder = new rglk.Pathfinder(function (x, y) {
		if (dungeon._tiles[y] && dungeon._tiles[y][x]) {
			return true;
		}

		return false;
	}),
	explorer = new rglk.Explorer(function (x, y) {
		if (dungeon._tiles[y] && dungeon._tiles[y][x]) {
			return true;
		}

		return false;
	});

document.addEventListener('DOMContentLoaded', function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	dungeon.generate(function (x, y, isFloor) {
		ctx.fillStyle = isFloor ? '#445' : '#000';
		ctx.fillRect(x * 10, y * 10, 10, 10);
	});

	explorer.calculate(
		dungeon.rooms[0].center.x, 
		dungeon.rooms[0].center.y, 
		7,
		function (x, y) {
			ctx.fillStyle = '#aa7';
			ctx.fillRect(x * 10, y * 10, 10, 10);

			ctx.fillStyle = '#333';
			for (var iy = y - 1; iy <= y + 1; iy++) {
				for (var ix = x - 1; ix <= x + 1; ix++) {
					if (dungeon._tiles[iy] && dungeon._tiles[iy][ix] === false) {
						ctx.fillRect(ix * 10, iy * 10, 10, 10);
					}
				}
			}
		}
	);

	console.time('1');
	var path = pathfinder.search(
		dungeon.rooms[0].center.x, 
		dungeon.rooms[0].center.y, 
		dungeon.rooms[dungeon.rooms.length - 1].center.x, 
		dungeon.rooms[dungeon.rooms.length - 1].center.y
	);
	console.timeEnd('1');

	console.log(path);

	ctx.beginPath();
	ctx.strokeStyle = '#0f0';
	ctx.lineWidth = 4;
	ctx.moveTo(path[0].x * 10 + 5, path[0].y * 10 + 5);
	path.forEach(function (point) {
		ctx.lineTo(point.x * 10 + 5, point.y * 10 + 5);
	});
	ctx.stroke();
}, false);

}());