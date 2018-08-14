import PRNG from './PRNG';
import Point from './Point';
import Rectangle from './Rectangle';

/**
 * Builds types.
 * @type {Object}
 */
const BUILDS_TYPES = Object.freeze({
	room: 1,
	corridor: 2,
	connector: 3,
});

/**
 * Dungeons private data.
 * @type {Object}
 */
const DIRECTIONS = Object.freeze({
	left: 0,
	bottom: 1,
	right: 2,
	top: 3,
});

/**
 * Dungeons private data.
 * @type {WeakMap}
 */
const dungeonsData = new WeakMap();

/**
 * Represents a dungeon generator.
 */
export default class Dungeon {
	/**
	 * @param {Object} options Options of dungeon.
	 * @param {number} options.roomsAmount Amount of rooms.
	 * @param {number} options.roomMinSize Minimum room size.
	 * @param {number} options.roomMaxSize Maximum room size.
	 * @param {number} options.corridorMinLength Minimum corridor length.
	 * @param {number} options.corridorMaxLength Maximum corridor length.
	 * @param {number} options.corridorComplexity Amount of corridors turns.
	 * @param {number} options.seed Seed for pseudo random number generator.
	 */
	constructor (options) {
		dungeonsData.set(this, {});
		this.setOptions(options);
		this.generate();
	}

	/**
	 * Width of generated  in tiles.
	 * @readOnly
	 */
	get width () {
		return parseInt(dungeonsData.get(this).width, 10) || 0;
	}

	/**
	 * Returns height of generated dungeon in tiles.
	 * @readOnly
	 */
	get height () {
		return parseInt(dungeonsData.get(this).height, 10) || 0;
	}

	/**
	 * Returns rooms of generated dungeon.
	 * @readOnly
	 */
	get rooms () {
		return this.builds.filter(build => build.type === BUILDS_TYPES.room);
	}

	/**
	 * Returns corridors of generated dungeon.
	 * @readOnly
	 */
	get corridors () {
		return this.builds.filter(build => build.type === BUILDS_TYPES.corridor);
	}

	/**
	 * Returns connectors of generated dungeon.
	 * @readOnly
	 */
	get connectors () {
		return this.builds.filter(build => build.type === BUILDS_TYPES.connector);
	}

	/**
	 * Returns all builds of generated dungeon.
	 * @readOnly
	 */
	get builds () {
		const privateBuilds = dungeonsData.get(this).builds || [];
		return [...privateBuilds];
	}

	/**
	 * Update some options.
	 * @param {Object} newOptions New options.
	 * @see constructor
	 */
	setOptions (newOptions) {
		dungeonsData.get(this).options = this.validateOptions(newOptions, this.getDefaultOptions());
	}

	validateOptions (options, defaultOptions) {
		options = options || {};
		const resultOptions = {};
		Object.keys(defaultOptions).forEach(key => {
			const value = options[key];
			const defaultValue = defaultOptions[key];
			const minimalValue = this.getMininalOptions()[key];
			if (isNaN(value) || !isFinite(value) || value < minimalValue) {
				resultOptions[key] = defaultValue;
			} else {
				resultOptions[key] = parseInt(value, 10);
			}
		});
		return resultOptions;
	}

	getMininalOptions () {
		return {
			seed: -Infinity,
			roomsAmount: 1,
			roomMinSize: 1,
			roomMaxSize: 1,
			corridorMinLength: 1,
			corridorMaxLength: 1,
			corridorComplexity: 1,
		};
	}

	getDefaultOptions () {
		return {
			seed: Math.random(),
			roomsAmount: 7,
			roomMinSize: 5,
			roomMaxSize: 10,
			corridorMinLength: 3,
			corridorMaxLength: 7,
			corridorComplexity: 2,
		};
	}

	/**
	 * Calls callback for each tile in dungeon area.
	 * @param {Function} callback Callback that was called for each tile.
	 */
	forEachTile (callback) {
		if (callback instanceof Function) {
			for (let x = 0; x < this.height; x++) {
				for (let y = 0; y < this.width; y++) {
					callback(x, y, this.isFloor(x, y));
				}
			}
		}
		return this;
	}

	/**
	 * Is wall tile?
	 * @param {number} x X coordinate of tile.
	 * @param {number} y Y coordinate of tile.
	 */
	isWall (x, y) {
		return !this.isFloor(x, y);
	}

	/**
	 * Is floor tile?
	 * @param {number} x X coordinate of tile.
	 * @param {number} y Y coordinate of tile.
	 */
	isFloor (x, y) {
		let isFloor = false;
		const buffer = dungeonsData.get(this).buffer || [];
		if (x <= this.width && y <= this.height) {
			isFloor = Boolean(buffer[this.getBufferIndex(x, y, this.height)]);
		}
		return isFloor;
	}

	/**
	 * Generate new dungeon map.
	 */
	generate () {
		const options = this.getOptions();
		dungeonsData.get(this).prng = new PRNG(options.seed);
		dungeonsData.get(this).builds = this.optimizeBuilds(this.generateBuilds(options));
		dungeonsData.get(this).buffer = this.createBuffer(this.builds);
		return this;
	}

	generateBuilds (options) {
		const initialRoom = this.createRoom({ x: 0, y: 0 });
		const builds = [initialRoom];
		while (builds.filter(build => build.type === BUILDS_TYPES.room).length < this.getOptions().roomsAmount) {
			builds.push(...this.tryBuild(builds, options));
		}
		return builds;
	}

	tryBuild (readyBuilds, options) {
		const extensibleBuilds = readyBuilds.filter(build => build.type !== BUILDS_TYPES.corridor);
		const startingBuild = extensibleBuilds[this.getRandom(0, extensibleBuilds.length - 1)];
		let newBuilds = this.createBranch(startingBuild, options.corridorComplexity);
		if (newBuilds.some(build => !this.isSuitableBuild(build, readyBuilds.concat(newBuilds)))) {
			startingBuild.children.pop();
			newBuilds = [];
		}
		return newBuilds;
	}

	createBranch (parent, length) {
		const branch = [];
		let partParent = parent;
		for (let index = 0; index < length; index++) {
			const corridor = this.createCorridor({ parent: partParent });
			let closure = null;
			if (index < length - 1) {
				closure = this.createConnector({ parent: corridor });
			} else {
				closure = this.createRoom({ parent: corridor });
			}
			branch.push(corridor, closure);
			partParent = closure;
		}
		return branch;
	}

	createConnector ({ parent }) {
		const connector = this.createRoom({ parent, width: 1, height: 1 });
		connector.type = BUILDS_TYPES.connector;
		return connector;
	}

	createRoom ({ x, y, width, height, parent }) {
		const { roomMinSize, roomMaxSize } = this.getOptions();
		const room = this.createBuild(BUILDS_TYPES.room, {
			parent,
			x,
			y,
			width: width || this.getRandom(roomMinSize, roomMaxSize),
			height: height || this.getRandom(roomMinSize, roomMaxSize),
		});
		if (parent) {
			const direction = parent.direction || 0;
			this.placeBuild(room, parent);
		}
		return room;
	}

	createCorridor ({ x, y, width, height, parent }) {
		const { corridorMinLength, corridorMaxLength } = this.getOptions();
		const corridor = this.createBuild(BUILDS_TYPES.corridor, {
			parent,
			width: 1,
			height: 1,
		});
		const corridorLength = this.getRandom(corridorMinLength, corridorMaxLength);
		if (parent) {
			if (corridor.direction === DIRECTIONS.left || corridor.direction === DIRECTIONS.right) {
				corridor.width = corridorLength;
			} else {
				corridor.height = corridorLength;
			}
			this.placeBuild(corridor, parent);
		}
		return corridor;
	}

	placeBuild (build, parent) {
		const direction = build.type === BUILDS_TYPES.corridor
			? build.direction || 0
			: parent.direction || 0;
		if (direction === DIRECTIONS.left || direction === DIRECTIONS.right) {
			build.y = this.getRandom(
				parent.top - build.height + 1,
				parent.bottom - 1,
			);
		} else {
			build.x = this.getRandom(
				parent.left - build.width + 1,
				parent.right - 1,
			);
		}
		switch (direction) {
			case DIRECTIONS.left:
				build.x = parent.right;
				break;
			case DIRECTIONS.bottom:
				build.y = parent.bottom;
				break;
			case DIRECTIONS.right:
				build.x = parent.left - build.width;
				break;
			case DIRECTIONS.top:
				build.y = parent.top - build.height;
				break;
		}
	}

	getOptions () {
		return { ...this.getDefaultOptions(), ...dungeonsData.get(this).options };
	}

	createBuild (type, { x, y, width, height, parent }) {
		const build = new Rectangle(x, y, width, height);
		build.type = type;
		build.children = [];
		if (parent) {
			build.parent = parent;
			parent.children.push(build);
			build.direction = parent.direction;
		}
		if (type === BUILDS_TYPES.corridor) {
			build.direction = this.getRandom(0, 3);
		}
		return build;
	}

	getRandom (min, max) {
		const seededRandom = dungeonsData.get(this).prng.generate();
		return Math.floor(min + seededRandom * (max + 1 - min));
	}

	isSuitableBuild (newBuild, readyBuilds) {
		const checkingBuilds = readyBuilds.filter(build => {
			const isSelf = build === newBuild;
			const isParent = build === newBuild.parent;
			const isChildren = newBuild.children.includes(build);
			const isConnected = build.children.includes(newBuild.parent) || newBuild.children.includes(build.parent);
			return !isSelf && !isParent && !isChildren && !isConnected;
		});
		return !checkingBuilds.some(build => build.collides(newBuild));
	}

	optimizeBuilds (builds) {
		const topLeft = this.getTopLeftPoint(builds);
		if (topLeft.x < 1) {
			this.translateBuilds(builds, 1 - topLeft.x, 0);
		}
		if (topLeft.y < 1) {
			this.translateBuilds(builds, 0, 1 - topLeft.y);
		}
		return builds;
	}

	getTopLeftPoint (builds) {
		const topLeft = new Point(Infinity, Infinity);
		builds.forEach(build => {
			if (build.x < topLeft.x) {
				topLeft.x = build.x;
			}
			if (build.y < topLeft.y) {
				topLeft.y = build.y;
			}
		});
		return topLeft;
	}

	translateBuilds (builds, offsetX, offsetY) {
		return builds.forEach(build => {
			build.x += offsetX;
			build.y += offsetY;
		});
	}

	createBuffer (builds) {
		const bottomRight = this.getBottomRightPoint(builds);
		dungeonsData.get(this).width = bottomRight.x + 1;
		dungeonsData.get(this).height = bottomRight.y + 1;
		const buffer = Array(this.width * this.height);
		buffer.fill(false);
		builds.forEach(build => this.fillRectangle(buffer, this.height, build));
		return buffer;
	}

	getBottomRightPoint (builds) {
		const bottomRight = new Point(-Infinity, -Infinity);
		builds.forEach(build => {
			if (build.right > bottomRight.x) {
				bottomRight.x = build.right;
			}
			if (build.bottom > bottomRight.y) {
				bottomRight.y = build.bottom;
			}
		});
		return bottomRight;
	}

	fillRectangle (buffer, height, { left, bottom, right, top }) {
		for (let y = top; y < bottom; y++) {
			for (let x = left; x < right; x++) {
				buffer[this.getBufferIndex(x, y)] = true;
			}
		}
	}

	getBufferIndex (x, y) {
		return (x * this.height) + y;
	}
}
