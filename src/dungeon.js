import Point from './point';
import Rectangle from './rectangle';
import PRNG from './prng';

/**
 * Represents a dungeon generator.
 */
export default class Dungeon {
	/**
	 * Create a dungeon.
	 * @param {object} options - Dungeon generation options.
	 * @param {number} options.seed - The seed to pseudorandom number generator.
	 * @param {number} options.roomAmount - The amount of rooms.
	 * @param {number} options.roomMinSize - Min size of room.
	 * @param {number} options.roomMaxSize - Max size of room.
	 * @param {number} options.corridorMinLength - Min length of corridors.
	 * @param {number} options.corridorMaxLength - Max length of corridors.
	 */
	constructor(options = {}) {
		options = options instanceof Object ? options : {};

		this._tiles = [];
		this._rooms = [];
		this._corridors = [];
		this._prng = new PRNG(isNaN(options.seed) ? 0 : options.seed);
		this._options = {};

		// correct & add options
		Object.keys(options).forEach((key) => {
			let option = options[key];
			this._options[key] = (isNaN(option) || option < 1) ? 1 : option;
		});
	}

	/**
	 * Get the array of rooms.
	 * @return {array} List of rooms.
	 */
	getRooms() {
		return this._rooms;
	}

	/**
	 * Get the array of corridors.
	 * @return {array} List of corridors.
	 */
	getCorridors() {
		return this._corridors;
	}

	/**
	 * Get the array of all builds.
	 * @return {array} List of builds (rooms & corridors).
	 */
	getBuilds() {
		return this._rooms.concat(this._corridors);
	}

	/**
	 * Get the width of dungeon.
	 * @return {number} The dungeon width (number of tiles).
	 */
	getWidth() {
		return Array.isArray(this._tiles[0]) ? this._tiles[0].length : 0;
	}

	/**
	 * Get the height of dungeon.
	 * @return {number} The dungeon height (number of tiles).
	 */
	getHeight() {
		return Array.isArray(this._tiles) ? this._tiles.length : 0;
	}

	/**
	 * Get seed of dungeon.
	 * @return {number} The seed value.
	 */
	getSeed() {
		return this._prng.seed;
	}

	/**
	 * Run callback to each tile of generated map.
	 * @param {Dungeon~forEachTileCallback} forEachTileCallback - function called fo each tile.
	 */
	forEachTile(callback) {
		if (!this._tiles) {
			return;
		}

		if (callback instanceof Function) {
			for (var y = 0; y < this._tiles.length; y++) {
				for (var x = 0; x < this._tiles[y].length; x++) {
					callback(x, y, this._tiles[y][x]);
				}
			}
		}

		return this;
	}
	/**
	 * This callback called fo each tile. Is the part of the Dungeon class.
	 * @callback Dungeon~forEachTileCallback
	 * @param {number} The x of tile.
	 * @param {number} The y of tile.
	 * @param {boolean} Boolean giving is floor tile or not.
	 */

	/**
	 * Get type of tile.
	 * @param {number} x - The y of tile position.
	 * @param {number} y - The x of tile position.
	 */
	isWall(x, y) {
		if (this._tiles[y] !== undefined && this._tiles[y][x] !== undefined) {
			return !this._tiles[y][x];
		}

		return undefined;
	}

	/**
	 * Generate dungeon. Generate arrays of rooms and corridors, matrix of tiles
	 */
	generate() {
		this._generateBuilds();
		this._optimizeBuilds();
		this._createMap();

		return this;
	}

	/**
	 * Generate builds (rooms & corridors).
	 */
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

	/**
	 * Optimize builds: translate all builds to positive coordinates.
	 */
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

	/**
	 * Get the point of leftmost top position among all builds.
	 * @return {object} The point.
	 */
	_getTopLeft() {
		var topLeft = new Point(Infinity, Infinity);
		
		this.getBuilds().forEach(function (build) {
			if (build.x < topLeft.x) {
				topLeft.x = build.x;
			}
			
			if (build.y < topLeft.y) {
				topLeft.y = build.y;
			}
		});
		
		return topLeft;
	}

	/**
	 * Get the point of rightmost bottom position among all builds.
	 * @return {object} The point.
	 */
	_getBottomRight() {
		var bottomRight = new Point(-Infinity, -Infinity);
		
		this.getBuilds().forEach(function (build) {
			if (build.right > bottomRight.x) {
				bottomRight.x = build.right;
			}
			
			if (build.bottom > bottomRight.y) {
				bottomRight.y = build.bottom;
			}
		});
		
		return bottomRight;
	}

	/**
	 * Translate all builds.
	 * @param {number} offsetX - Offset by x axis.
	 * @param {number} offsetY - Offset by y axis.
	 */
	_translateBuilds(offsetX, offsetY) {
		this.getBuilds().forEach(function(build) {
			build.x += offsetX;
			build.y += offsetY;
		});
	}

	/**
	 * Create map: generate array of arrays of tiles.
	 */
	_createMap() {
		let bottomRight = this._getBottomRight();

		this._fillMap(bottomRight.x + 2, bottomRight.y + 2);
		this.getBuilds().forEach((build) => {
			this._fillRectangle(build.x, build.y, build.width, build.height);
		});
	}

	/**
	 * Fill map: generate matrix (array of arrays) with needed size.
	 * @param {number} width - The width of matrix.
	 * @param {number} height - The height of matrix.
	 */
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

	/**
	 * Fill rectagle: fill rectangle area on map.
	 * @param {number} startX - Left border position of rectangle.
	 * @param {number} startY - Top border position of rectangle.
	 * @param {number} width - Width of rectangle.
	 * @param {number} height - Height of rectangle.
	 */
	_fillRectangle(startX, startY, width, height) {
		for (var y = startY; y <= startY + height - 1; y++) {
			for (var x = startX; x <= startX + width - 1; x++) {
				this._tiles[y][x] = true;
			}
		}
	}
}