import Point2 from './point2';
import Rectangle from './rectangle';
import Helper from './helper';
import PRNG from './prng';

class Dungeon {
	constructor(options = {}) {
		this._options = {
			seed: isNaN(options.seed)
				? 0
				: options.seed,
			roomAmount: isNaN(options.roomAmount)
				? 1
				: options.roomAmount,
			roomMinSize: isNaN(options.roomMinSize)
				? 5
				: options.roomMinSize,
			roomMaxSize: isNaN(options.roomMaxSize)
				? 5
				: options.roomMaxSize,
			corridorMinLength: isNaN(options.corridorMinLength)
				? 1
				: options.corridorMinLength,
			corridorMaxLength: isNaN(options.corridorMaxLength)
				? 1
				: options.corridorMaxLength
		};
		this._tiles = [];
		this._rooms = [];
		this._corridors = [];
		this._prng = new PRNG(this._options.seed);
	}

	get rooms() {
		return this._rooms;
	}

	get corridors() {
		return this._corridors;
	}

	get builds() {
		return this._rooms.concat(this._corridors);
	}

	get width() {
		return Array.isArray(this._tiles[0]) ? this._tiles[0].length : 0;
	}

	get height() {
		return this._tiles.length;
	}

	get options() {
		return this._options;
	}

	updateOptions(options = {}) {
		let seed = isNaN(options.seed)
				? this._options.seed
				: options.seed,
			roomAmount = isNaN(options.roomAmount)
				? this._options.roomAmount 
				: options.roomAmount,
			roomMinSize = isNaN(options.roomMinSize)
				? this._options.roomMinSize
				: options.roomMinSize,
			roomMaxSize = isNaN(options.roomMaxSize)
				? this._options.roomMaxSize
				: options.roomMaxSize,
			corridorMinLength = isNaN(options.corridorMinLength)
				? this._options.corridorMinLength
				: options.corridorMinLength,
			corridorMaxLength = isNaN(options.corridorMaxLength)
				? this._options.corridorMaxLength
				: options.corridorMaxLength;

		this._prng = new PRNG(seed);
		this._options = {
			seed,
			roomAmount,
			roomMinSize,
			roomMaxSize,
			corridorMinLength,
			corridorMaxLength
		};
	}

	forEachTile(callback) {
		if (!this._tiles.length) {
			return;
		}

		if (callback instanceof Function) {
			for (var y = 0; y < this._tiles.length; y++) {
				for (var x = 0; x < this._tiles[y].length; x++) {
					if (callback instanceof Function) {
						callback(x, y, this._tiles[y][x]);
					}
				}
			}
		}
	}

	isWall(x, y) {
		if (this._tiles[y] !== undefined && this._tiles[y][x] !== undefined) {
			return !this._tiles[y][x];
		}

		return undefined;
	}

	generate() {
		this._correctOptions();
		this._generateBuilds();
		this._optimizeBuilds();
		this._createMap();
	}

	_correctOptions() {
		if (this._options.roomAmount < 1) {
			this._options.roomAmount = 1;
		}

		if (this._options.roomMinSize < 1) {
			this._options.roomMinSize = 1;
		}

		if (this._options.roomMaxSize < 1) {
			this._options.roomMaxSize = 1;
		}

		if (this._options.corridorMinLength < 1) {
			this._options.corridorMinLength = 1;
		}

		if (this._options.corridorMaxLength < 1) {
			this._options.corridorMaxLength = 1;
		}
	}

	_generateBuilds() {
		let random = (max, min) => {
				return Math.round(this._prng.getRandom(min, max));
			},
			roomAmount = this._options.roomAmount,
			roomMinSize = this._options.roomMinSize,
			roomMaxSize = this._options.roomMaxSize,
			corridorMinLength = this._options.corridorMinLength,
			corridorMaxLength = this._options.corridorMaxLength;

		// set default
		this._rooms = [];
		this._corridors = [];

		// add first room
		this._rooms.push(new Rectangle(
			1,
			1,
			random(roomMinSize, roomMaxSize),
			random(roomMinSize, roomMaxSize)
		));

		// main loop
		while (this._rooms.length < roomAmount) {
			// configure new room relative random room from list
			let index = random(0, this._rooms.length - 1),
				lastRoom = this._rooms[index],
				newWidth = random(roomMinSize, roomMaxSize),
				newHeight = random(roomMinSize, roomMaxSize),
				newRoom = new Rectangle(0, 0, newWidth, newHeight),
				newCorridorLength = random(corridorMinLength, corridorMaxLength),
				newCorridor = new Rectangle(0, 0, 1, 1),
				direction = random(0, 3),
				collision = false,
				deltaWidth = newRoom.width - lastRoom.width,
				deltaHeight = newRoom.height - lastRoom.height;

			// configure new corridor and room
			if (direction === 0 || direction === 2) {
				newRoom.y = lastRoom.y - random(0, deltaHeight);
				newCorridor.y = random(
					Math.max(lastRoom.top, newRoom.top),
					Math.min(lastRoom.bottom, newRoom.bottom)
				);
				newCorridor.width = newCorridorLength;
			} else {
				newRoom.x = lastRoom.x - random(0, deltaWidth);
				newCorridor.height = newCorridorLength;
				newCorridor.x = random(
					Math.max(lastRoom.left, newRoom.left),
					Math.min(lastRoom.right, newRoom.right)
				);
			}

			// configure new corridor and room
			if (direction === 0) {
				newRoom.x = lastRoom.right + newCorridorLength + 1;
				newCorridor.x = lastRoom.right + 1;
			} else if (direction === 1) {
				newRoom.y = lastRoom.bottom + newCorridorLength + 1;
				newCorridor.y = lastRoom.bottom + 1;
			} else if (direction === 2) {
				newRoom.x = lastRoom.left - newCorridorLength - newRoom.width;
				newCorridor.x = lastRoom.left - newCorridor.width;
			} else {
				newRoom.y = lastRoom.top - newCorridorLength - newRoom.height;
				newCorridor.y = lastRoom.top - newCorridor.height;
			}

			// check cillosoions new room and corridor with rooms
			for (let i = 0; i < this._rooms.length; i++) {
				if (newRoom.collides(this._rooms[i])) {
					collision = true;
					break;
				}

				if (newCorridor.collides(this._rooms[i])) {
					if (index !== i) { // if this is not last room
						collision = true;
						break;
					}
				}
			}

			// check cillosoions new room with corridors
			for (let i = 0; i < this._corridors.length; i++) {
				if (newRoom.collides(this._corridors[i])) {
					collision = true;
					break;
				}
			}

			// add builds
			if (!collision) {
				this._rooms.push(newRoom);
				this._corridors.push(newCorridor);
			}
		}
	}

	_optimizeBuilds() {
		// leftmost top point search
		var topLeft = this._getTopLeft();
		
		// translate rooms to leftmost top position (1, 1)
		if (topLeft.x < 1) {
			this._translateBuilds(1 - topLeft.x, 0);
		}
		
		if (topLeft.y < 1) {
			this._translateBuilds(0, 1 - topLeft.y);
		}
	}

	_getTopLeft() {
		var topLeft = new Point2(Infinity, Infinity);
		
		this.builds.forEach(function (build) {
			if (build.x < topLeft.x) {
				topLeft.x = build.x;
			}
			
			if (build.y < topLeft.y) {
				topLeft.y = build.y;
			}
		});
		
		return topLeft;
	}

	_getBottomRight() {
		var bottomRight = new Point2(-Infinity, -Infinity);
		
		this.builds.forEach(function (build) {
			if (build.right > bottomRight.x) {
				bottomRight.x = build.right;
			}
			
			if (build.bottom > bottomRight.y) {
				bottomRight.y = build.bottom;
			}
		});
		
		return bottomRight;
	}

	_translateBuilds(offsetX, offsetY) {
		this.builds.forEach(function(build) {
			build.x += offsetX;
			build.y += offsetY;
		});
	}

	_createMap() {
		let bottomRight = this._getBottomRight();

		this._fillMap(bottomRight.x + 2, bottomRight.y + 2);
		this.builds.forEach((build) => {
			this._fillRectangle(build.x, build.y, build.width, build.height);
		});
	}

	_fillMap(width, height) {
		// set default
		this._tiles = [];

		// this._tiles[y][x] === true (floor) || false (wall)
		for (var y = 0; y < height; y++) {
			this._tiles.push([]);
			for (var x = 0; x < width; x++) {
				this._tiles[y].push(false);
			}
		}
	}

	_fillRectangle(startX, startY, width, height) {
		for (var y = startY; y <= startY + height - 1; y++) {
			for (var x = startX; x <= startX + width - 1; x++) {
				this._tiles[y][x] = true;
			}
		}
	}
}

module.exports = Dungeon;