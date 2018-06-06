import PRNG from './PRNG';
import Point from './Point';
import Rectangle from './Rectangle';

/**
 * Represents a Dungeon class.
 */
export default class Dungeon {
	/**
	 * Create a dungeon.
	 * @param {Object} [options] Dungeon generation options.
	 * @param {number} options.seed The seed to pseudorandom number generator.
	 * @param {number} options.roomsAmount The amount of rooms.
	 * @param {number} options.roomMinSize Min size of room.
	 * @param {number} options.roomMaxSize Max size of room.
	 * @param {number} options.corridorMinLength Min length of corridors.
	 * @param {number} options.corridorMaxLength Max length of corridors.
	 * @param {number} options.corridorComplexity Complexity corridors.
	 */
	constructor (options) {
		// @TODO this.map = new Rectangle()?
		this._tiles = [];
		this._rooms = [];
		this._corridors = [];
		this._prng = new PRNG(options.seed);
		this._options = this.validateOptions(options);
		this.generate();
	}

	/**
	 * Returns validated options.
	 * @param  {Object} options Options.
	 * @return {Object} validated options.
	 */
	validateOptions (options) {
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
	 * Get a default options.
	 * @readOnly
	 * @return {Object} Default options.
	 */
	get defaultOptions () {
		return {
			seed: Math.random(),
			roomsAmount: 7,
			roomMinSize: 5,
			roomMaxSize: 10,
			corridorMinLength: 3,
			corridorMaxLength: 7,
			corridorComplexity: 3,
		};
	}

	/**
	 * Get the array of rooms.
	 * @readOnly
	 * @return {array} List of rooms.
	 */
	get rooms () {
		return this._rooms.slice();
	}

	/**
	 * Get the array of corridors.
	 * @readOnly
	 * @return {array} List of corridors.
	 */
	get corridors () {
		return this._corridors.slice();
	}

	/**
	 * Get the array of all builds.
	 * @readOnly
	 * @return {array} List of builds (rooms & corridors).
	 */
	get builds () {
		return this.rooms.concat(this.corridors);
	}

	/**
	 * Get the width of dungeon.
	 * @readOnly
	 * @return {number} The dungeon width (number of tiles).
	 */
	get width () {
		return Array.isArray(this._tiles[0]) ? this._tiles[0].length : 0;
	}

	/**
	 * Get the height of dungeon.
	 * @readOnly
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
		return !this.isWall.apply(this, arguments);
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
		const random = (max, min) => Math.floor(this._prng.generate(min, max));
		const {
			roomsAmount,
			roomMinSize,
			roomMaxSize,
			corridorMinLength,
			corridorMaxLength
		} = this._options;

		// set default
		this._rooms = [];
		this._corridors = [];

		// add first room
		this._rooms.push(new Rectangle(
			1,
			1,
			random(roomMinSize, roomMaxSize),
			random(roomMinSize, roomMaxSize),
		));
		this._rooms[0].children = [];

		// main loop
		while (this._rooms.length < roomsAmount) {
			// configure new room and corridor relative to random room from list
			const lastRoom = this._rooms[random(0, this._rooms.length - 1)],
				newRoomWidth = random(roomMinSize, roomMaxSize),
				newRoomHeight = random(roomMinSize, roomMaxSize),
				newRoom = new Rectangle(0, 0, newRoomWidth, newRoomHeight),
				newCorridorLength = random(corridorMinLength, corridorMaxLength),
				newCorridor = new Rectangle(0, 0, 1, 1),
				direction = parseInt(Math.random() * 4, 10);
			lastRoom.children.push(newCorridor);
			newRoom.parent = newCorridor;
			newRoom.children = [];
			newCorridor.parent = lastRoom;
			newCorridor.children = [newRoom];

			// configure new corridor and room
			if (direction === 0 || direction === 2) {
				newRoom.y = lastRoom.bottom - 1 - random(
					0,
					Math.abs(newRoom.height + lastRoom.height) - 1,
				);
				newCorridor.y = random(
					Math.max(lastRoom.top, newRoom.top),
 					Math.min(lastRoom.bottom, newRoom.bottom) - 1
				);
				newCorridor.width = newCorridorLength;
			} else {
				newRoom.x = lastRoom.right - 1 - random(
					0,
					Math.abs(newRoom.width + lastRoom.width) - 1,
				);
				newCorridor.height = newCorridorLength;
				newCorridor.x = random(
					Math.max(lastRoom.left, newRoom.left),
					Math.min(lastRoom.right, newRoom.right),
				);
			}

			// configure new corridor and room
			if (direction === 0) { // left
				newRoom.x = lastRoom.right + newCorridorLength;
				newCorridor.x = lastRoom.right;
			} else if (direction === 1) { // bottom
				newRoom.y = lastRoom.bottom + newCorridorLength;
				newCorridor.y = lastRoom.bottom;
			} else if (direction === 2) { // right
				newRoom.x = lastRoom.left - newCorridorLength - newRoom.width;
				newCorridor.x = lastRoom.left - newCorridor.width;
			} else { // top
				newRoom.y = lastRoom.top - newCorridorLength - newRoom.height;
				newCorridor.y = lastRoom.top - newCorridor.height;
			}

			// if new builds is suitable - save it
			if (this._isSuitableBuilds(newRoom, newCorridor)) {
				this._rooms.push(newRoom);
				this._corridors.push(newCorridor);
			} else {
				lastRoom.children = lastRoom.children.filter(child => child !== newCorridor);
				newCorridor.children = newCorridor.children.filter(child => child !== newRoom);
			}
		}
	}

	/**
	 * Chack that all arguments is suitable builds for create dungeon.
	 * @param  {...Rectangle} newBuilds Builds.
	 * @return {boolean} Is all arguments suitable builds for create dungeon?
	 */
	_isSuitableBuilds (...newBuilds) {
		return newBuilds.every(newBuild => this._isSuitableBuild(newBuild));
	}

	/**
	 * Check that build is suitable to place in dungeon.
	 * @param  {Rectangle} newBuild Checking build.
	 * @return {boolean} Build is suitable?
	 */
	_isSuitableBuild (newBuild) {
		const checkingBuilds = this.builds.filter(build => {
			return build.parent !== newBuild.parent
				&& build !== newBuild.parent
				&& build !== newBuild.children
				&& !build.children.includes(newBuild.parent)
		});
		return !checkingBuilds.some(build => build.collides(newBuild));
	}

	/**
	 * Translates all builds to positive coordinates.
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
	 * Returns the point of leftmost top position among all builds.
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
	 * fill rectangle area on map.
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
