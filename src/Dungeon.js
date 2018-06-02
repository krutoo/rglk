import PRNG from './PRNG';
import Point from './Point';
import Rectangle from './Rectangle';

/**
 * Represents a Dungeon class.
 */
export default class Dungeon {
	/**
	 * Create a dungeon.
	 * @param {Object} [options] - Dungeon generation options.
	 * @param {number} options.seed - The seed to pseudorandom number generator.
	 * @param {number} options.roomsAmount - The amount of rooms.
	 * @param {number} options.roomMinSize - Min size of room.
	 * @param {number} options.roomMaxSize - Max size of room.
	 * @param {number} options.corridorMinLength - Min length of corridors.
	 * @param {number} options.corridorMaxLength - Max length of corridors.
	 */
	constructor (options) {
		options = options || {};
		// @TODO this.map = new Rectangle()?
		this._tiles = [];
		this._rooms = [];
		this._corridors = [];
		this._prng = new PRNG(options.seed);
		this._options = this.applyOptions(options);
	}

	applyOptions (options) {
		options = options || {};
		const resultOptions = {};
		Object.keys(this.defaultOptions).forEach(key => {
			const option = options[key];
			if (isNaN(option) || !isFinite(option) || option < 1) {
				resultOptions[key] = parseInt(this.defaultOptions[key], 10) || 1;
			} else {
				resultOptions[key] = parseInt(option, 10);
			}
		});
		return resultOptions;
	}

	/**
	 * Get default options.
	 * @readonly
	 */
	get defaultOptions () {
		return {
			seed: Math.random(),
			roomsAmount: 7,
			roomMinSize: 5,
			roomMaxSize: 10,
			corridorMinLength: 3,
			corridorMaxLength: 7,
		};
	}

	/**
	 * Get the array of rooms.
	 * @readonly
	 * @return {array} List of rooms.
	 */
	get rooms () {
		return this._rooms.slice();
	}

	/**
	 * Get the array of corridors.
	 * @readonly
	 * @return {array} List of corridors.
	 */
	get corridors () {
		return this._corridors.slice();
	}

	/**
	 * Get the array of all builds.
	 * @readonly
	 * @return {array} List of builds (rooms & corridors).
	 */
	get builds () {
		return this.rooms.concat(this.corridors);
	}

	/**
	 * Get the width of dungeon.
	 * @readonly
	 * @return {number} The dungeon width (number of tiles).
	 */
	get width () {
		return Array.isArray(this._tiles[0]) ? this._tiles[0].length : 0;
	}

	/**
	 * Get the height of dungeon.
	 * @readonly
	 * @return {number} The dungeon height (number of tiles).
	 */
	get height () {
		return Array.isArray(this._tiles) ? this._tiles.length : 0;
	}

	/**
	 * Run callback for each tile of generated map.
	 * @param {Function} callback Function called fo each tile.
	 */
	forEachTile (callback) {
		if (this._tiles && callback instanceof Function) {
			for (var y = 0; y < this._tiles.length; y++) {
				for (var x = 0; x < this._tiles[y].length; x++) {
					callback(x, y, this._tiles[y][x]);
				}
			}
		}
		return this;
	}

	isFloor () {
		return !this.isWall.call(this, arguments);
	}

	/**
	 * Get type of tile.
	 * @param {number} x - The y of tile position.
	 * @param {number} y - The x of tile position.
	 * @return {boolean}
	 */
	isWall (x, y) {
		let result = false;
		if (Array.isArray(this._tiles[y]) && this._tiles[y].hasOwnProperty(x)) {
			result = !this._tiles[y][x];
		}
		return result;
	}

	/**
	 * Generate dungeon. Generate arrays of rooms and corridors, matrix of tiles
	 */
	generate () {
		this._generateBuilds();
		this._optimizeBuilds();
		this._createMap();
	}

	/**
	 * Generate builds (rooms & corridors).
	 * @private
	 * @TODO need decomposition!
	 */
	_generateBuilds () {
		const random = (max, min) => Math.round(this._prng.generate(min, max)),
			roomsAmount = this._options.roomsAmount,
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
		while (this._rooms.length < roomsAmount) {
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
	 * Translate all builds to positive coordinates.
	 * @private
	 */
	_optimizeBuilds () {
		// leftmost top point search
		const topLeft = this._getTopLeft();

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
	 * @private
	 * @return {Object} The point.
	 */
	_getTopLeft () {
		const topLeft = new Point(Infinity, Infinity);
		this.builds.forEach(build => {
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
	 * @private
	 * @return {Object} The point.
	 */
	_getBottomRight () {
		const bottomRight = new Point(-Infinity, -Infinity);
		this.builds.forEach(build => {
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
	 * @private
	 * @param {number} offsetX - Offset by x axis.
	 * @param {number} offsetY - Offset by y axis.
	 */
	_translateBuilds (offsetX, offsetY) {
		this.builds.forEach(build => {
			build.x += offsetX;
			build.y += offsetY;
		});
	}

	/**
	 * Create map: generate array of arrays of tiles.
	 * @private
	 */
	_createMap () {
		let bottomRight = this._getBottomRight();
		this._fillMap(bottomRight.x + 2, bottomRight.y + 2);
		this.builds.forEach(build => {
			this._fillRectangle(build.x, build.y, build.width, build.height);
		});
	}

	/**
	 * Fill map: generate matrix (array of arrays) with needed size.
	 * @private
	 * @param {number} width - The width of matrix.
	 * @param {number} height - The height of matrix.
	 * @TODO new Rectangle
	 */
	_fillMap (width, height) {
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
	 * @private
	 * @param {number} startX - Left border position of rectangle.
	 * @param {number} startY - Top border position of rectangle.
	 * @param {number} width - Width of rectangle.
	 * @param {number} height - Height of rectangle.
	 * @TODO move to Rectangle (forEachPoint)?
	 */
	_fillRectangle(startX, startY, width, height) {
		for (var y = startY; y <= startY + height - 1; y++) {
			for (var x = startX; x <= startX + width - 1; x++) {
				this._tiles[y][x] = true;
			}
		}
	}
}
