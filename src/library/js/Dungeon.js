import { createGenerator } from './prng.js';
import Point from './Point.js';
import Rectangle from './Rectangle.js';
import { isObject, isFiniteNumber, isFunction } from './utils.js';
import { propEq, negate } from './fp.js';

/**
 * Builds types.
 * @type {Object}
 */
const BUILD_TYPES = Object.freeze({
  room: Symbol('room'),
  corridor: Symbol('corridor'),
  connector: Symbol('connector'),
});

const isRoom = propEq('type', BUILD_TYPES.room);
const isCorridor = propEq('type', BUILD_TYPES.corridor);
const isConnector = propEq('type', BUILD_TYPES.connector);

/**
 * Dungeons private data.
 * @type {Object}
 */
const DIRECTIONS = Object.freeze({
  left: Symbol('left'),
  bottom: Symbol('bottom'),
  right: Symbol('right'),
  top: Symbol('top'),
});

/**
 * Directions list.
 * @type {Array<symbol>}
 */
const directionsList = Object.values(DIRECTIONS);

/**
 * Determines that direction is horizontal.
 * @type {Function}
 * @param {symbol} direction Direction.
 * @return {boolean} Is direction horizontal?
 */
const isHorizontal = (() => {
  const horizontalDirections = [DIRECTIONS.left, DIRECTIONS.right];
  return direction => horizontalDirections.includes(direction);
})();

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
    this.setOptions(options);
    this.generate();
  }

  static getMinimalOptions () {
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

  static getDefaultOptions () {
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
   * Width of generated  in tiles.
   * @return {number} Width.
   * @readonly
   */
  get width () {
    return parseInt(this._width) || 0;
  }

  /**
   * Returns height of generated dungeon in tiles.
   * @return {number} Height.
   * @readonly
   */
  get height () {
    return parseInt(this._height) || 0;
  }

  /**
   * Returns rooms of generated dungeon.
   * @return {Array} List of rooms.
   * @readonly
   */
  get rooms () {
    return this.builds.filter(isRoom);
  }

  /**
   * Returns corridors of generated dungeon.
   * @return {Array} List of corridors.
   * @readonly
   */
  get corridors () {
    return this.builds.filter(isCorridor);
  }

  /**
   * Returns connectors of generated dungeon.
   * @return {Array} List of corridor connectors.
   * @readonly
   */
  get connectors () {
    return this.builds.filter(isConnector);
  }

  /**
   * Returns all builds of generated dungeon.
   * @return {Array} List all builds.
   * @readonly
   */
  get builds () {
    const privateBuilds = Array.isArray(this._builds) ? this._builds : [];
    return [...privateBuilds];
  }

  /**
   * Update some options.
   * @param {Object} newOptions New options.
   */
  setOptions (newOptions) {
    if (this.isValidOptions(newOptions)) {
      this._options = {
        ...Dungeon.getDefaultOptions(),
        ...newOptions,
      };
    } else {
      throw Error('First argument "options" is invalid: every option must be a positive integer (excluding "seed")');
    }
  }

  isValidOptions (options) {
    const minimalOptions = Dungeon.getMinimalOptions();
    let isValid = true;

    if (!isObject(options)) {
      isValid = false;
    } else {
      Object.keys(options).forEach(optionKey => {
        const { [optionKey]: value } = options || {};
        const { [optionKey]: minimalValue } = minimalOptions;

        if (!isFiniteNumber(value) || value < minimalValue) {
          isValid = false;
        }
      });
    }

    return isValid;
  }

  /**
   * Calls callback for each tile in dungeon area.
   * @param {Function} callback Callback that was called for each tile.
   * @return {Dungeon} Instance.
   */
  forEachTile (callback) {
    if (isFunction(callback)) {
      for (let x = 0; x < this.height; x++) {
        for (let y = 0; y < this.width; y++) {
          callback(x, y, this.isFloor(x, y));
        }
      }
    }
    return this;
  }

  /**
   * Defines is it wall tile?
   * @param {number} x X coordinate of tile.
   * @param {number} y Y coordinate of tile.
   * @return {boolean} Is wall tile?
   */
  isWall (x, y) {
    return !this.isFloor(x, y);
  }

  /**
   * Defines is it floor tile?
   * @param {number} x X coordinate of tile.
   * @param {number} y Y coordinate of tile.
   * @return {boolean} Is floor tile?
   */
  isFloor (x, y) {
    let isFloor = false;

    if (x <= this.width && y <= this.height) {
      isFloor = Boolean(this._buffer && this._buffer[this.getBufferIndex(x, y, this.height)]);
    }

    return isFloor;
  }

  /**
   * Generate new dungeon map.
   * @return {Dungeon} Instance.
   */
  generate () {
    this._prng = createGenerator(this._options.seed);
    this._builds = this.optimizeBuilds(this.generateBuilds(this._options));
    this._buffer = this.createBuffer(this.builds); // @todo getBoundRect

    return this;
  }

  generateBuilds (options) {
    const { roomsAmount } = this._options;
    const initialRoom = this.createRoom({ x: 0, y: 0 });
    const builds = [initialRoom];

    if (roomsAmount > 1) {
      while (builds.filter(isRoom).length < roomsAmount) {
        builds.push(...this.tryBuild(builds, options));
      }
    }

    return builds;
  }

  tryBuild (readyBuilds, options) {
    const extensibleBuilds = readyBuilds.filter(negate(isCorridor));
    const startingBuild = extensibleBuilds[this.getRandom(0, extensibleBuilds.length - 1)];
    let newBuilds = this.createBranch(startingBuild, options.corridorComplexity);

    if (newBuilds.some(build => !this.isSuitableBuild(build, readyBuilds.concat(newBuilds)))) {
      startingBuild.children.pop();
      newBuilds = [];
    }

    return newBuilds;
  }

  createBranch (parent, branchLength = 1) {
    const branch = [];
    let partParent = parent;

    for (let index = 0; index < branchLength; index++) {
      const corridor = this.createCorridor({ parent: partParent });
      let closure = null;

      if (index < branchLength - 1) {
        closure = this.createConnector({ parent: corridor });
      } else {
        closure = this.createRoom({ parent: corridor });
      }
      branch.push(corridor, closure);
      partParent = closure;
    }

    return branch;
  }

  createRoom ({ x, y, width, height, parent }) {
    const { roomMinSize, roomMaxSize } = this._options;
    const room = this.createBuild(BUILD_TYPES.room, {
      parent,
      x,
      y,
      width: width || this.getRandom(roomMinSize, roomMaxSize),
      height: height || this.getRandom(roomMinSize, roomMaxSize),
    });

    parent && this.placeBuild(room, parent);
    return room;
  }

  createCorridor ({ parent }) {
    const { corridorMinLength, corridorMaxLength } = this._options;
    const corridorLength = this.getRandom(corridorMinLength, corridorMaxLength);
    const corridor = this.createBuild(BUILD_TYPES.corridor, {
      parent,
      width: 1,
      height: 1,
    });

    corridor.direction = directionsList[this.getRandom(0, directionsList.length - 1)];

    if (parent) {
      if (isHorizontal(corridor.direction)) {
        corridor.width = corridorLength;
      } else {
        corridor.height = corridorLength;
      }
      this.placeBuild(corridor, parent);
    }

    return corridor;
  }

  createConnector ({ parent }) {
    const connector = this.createBuild(BUILD_TYPES.connector, {
      parent,
      width: 1,
      height: 1,
    });

    parent && this.placeBuild(connector, parent);
    return connector;
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

    return build;
  }

  placeBuild (build, parent) {
    const direction = (
      build.type === BUILD_TYPES.corridor
        ? build.direction
        : parent.direction
    ) || DIRECTIONS.left;

    if (isHorizontal(direction)) {
      build.y = this.getRandom(
        parent.top - build.height + 1,
        parent.bottom - 1
      );
    } else {
      build.x = this.getRandom(
        parent.left - build.width + 1,
        parent.right - 1
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

  getRandom (min, max) {
    const seededRandom = this._prng();
    return Math.floor(min + (seededRandom * (max + 1 - min)));
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

    this._width = bottomRight.x + 1;
    this._height = bottomRight.y + 1;

    const buffer = Array(this._width * this._height);

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
