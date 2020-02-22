import { createGenerator } from '../prng';
import { Point } from '../point';
import { Rectangle } from './rectangle';
import { createMatrix } from './matrix';
import __ from 'lodash/fp/__';
import isFunction from 'lodash/isFunction';
import includes from 'lodash/fp/includes';
import negate from 'lodash/fp/negate';
import propEq from 'lodash/fp/propEq';

const BUILD_TYPES = Object.freeze({
  room: Symbol('room'),
  corridor: Symbol('corridor'),
  connector: Symbol('connector'),
});

const DIRECTIONS = Object.freeze({
  top: Symbol('top'),
  right: Symbol('right'),
  bottom: Symbol('bottom'),
  left: Symbol('left'),
});

const directionsList = Object.freeze(Object.values(DIRECTIONS));

/**
 * Dungeon.
 */
export class Dungeon {
  /**
   * @param {Object} [options={}] Options of dungeon.
   * @param {number} [options.roomsAmount=7] Amount of rooms.
   * @param {number} [options.roomMinSize=5] Minimum room size.
   * @param {number} [options.roomMaxSize=10] Maximum room size.
   * @param {number} [options.corridorMinLength=3] Minimum corridor length.
   * @param {number} [options.corridorMaxLength=7] Maximum corridor length.
   * @param {number} [options.corridorComplexity=2] Amount of corridors turns.
   * @param {number} [options.seed] Seed for pseudo random number generator, random by default.
   */
  constructor (options = {}) {
    this.setOptions(options);
    this.generate();
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

  static getOptionsCheckers () {
    return {
      seed: Number.isFinite,
      roomsAmount: isPositiveInteger,
      roomMinSize: isPositiveInteger,
      roomMaxSize: isPositiveInteger,
      corridorMinLength: isPositiveInteger,
      corridorMaxLength: isPositiveInteger,
      corridorComplexity: isPositiveInteger,
    };
  }

  /**
   * Width of generated  in tiles.
   * @return {number} Width.
   */
  get width () {
    return this._buffer.width;
  }

  /**
   * Returns height of generated dungeon in tiles.
   * @return {number} Height.
   */
  get height () {
    return this._buffer.height;
  }

  /**
   * Returns rooms of generated dungeon.
   * @return {Array} List of rooms.
   */
  get rooms () {
    return this.builds.filter(isRoom);
  }

  /**
   * Returns corridors of generated dungeon.
   * @return {Array} List of corridors.
   */
  get corridors () {
    return this.builds.filter(isCorridor);
  }

  /**
   * Returns connectors of generated dungeon.
   * @return {Array} List of corridor connectors.
   */
  get connectors () {
    return this.builds.filter(isConnector);
  }

  /**
   * Returns all builds of generated dungeon.
   * @return {Array} List all builds.
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
        ...this._options,
        ...newOptions,
      };
    } else {
      throw Error(
        'First argument "options" is invalid: every option must be a positive integer (excluding "seed")'
      );
    }
  }

  isValidOptions (options) {
    const defaults = Dungeon.getDefaultOptions();
    const checkers = Dungeon.getOptionsCheckers();
    let isValid = true;

    Object.keys(defaults).forEach(optionKey => {
      const { [optionKey]: defaultValue } = defaults;
      const { [optionKey]: isValidValue } = checkers;
      const { [optionKey]: value = defaultValue } = options || {};

      if (!isValidValue(value)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Calls callback for each tile in dungeon area.
   * @param {Function} callback Callback that was called for each tile.
   * @return {Dungeon} Instance.
   */
  forEachTile (callback) {
    if (isFunction(callback)) {
      const { width, height } = this;

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
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
      isFloor = Boolean(this._buffer && this._buffer.get(x, y));
    }

    return isFloor;
  }

  /**
   * Generate new dungeon map.
   */
  generate () {
    this._rng = createGenerator(this._options.seed);
    this._builds = optimizeBuilds(this._generateBuilds(this._options));
    this._buffer = this._createBuffer(this._builds);
  }

  _generateBuilds (options) {
    const { roomsAmount } = this._options;
    const initialRoom = this._createRoom({ x: 0, y: 0 });
    const builds = [initialRoom];

    if (roomsAmount > 1) {
      while (builds.filter(isRoom).length < roomsAmount) {
        builds.push(...this._tryBuild(builds, options));
      }
    }

    return builds;
  }

  _tryBuild (readyBuilds, options) {
    const extensibleBuilds = readyBuilds.filter(isExtensible);
    const branchRootBuild = extensibleBuilds[this._getRandom(0, extensibleBuilds.length - 1)];
    let newBuilds = this._createBranch(branchRootBuild, options.corridorComplexity);
    const checkingBuilds = readyBuilds.concat(newBuilds);

    // if some build from new builds list collides with ready other
    if (newBuilds.some(build => !canAddBuild(build, checkingBuilds))) {
      branchRootBuild.children.pop(); // remove created branch
      newBuilds = [];
    }

    return newBuilds;
  }

  _createBranch (parent, branchLength = 1) {
    const branch = [];
    let partParent = parent;

    for (let index = 0; index < branchLength; index++) {
      // branch always starts with corridor, from room or from connector
      const corridor = this._createCorridor({ parent: partParent });
      let closure = null;

      if (index < branchLength - 1) {
        closure = this._createConnector({ parent: corridor });
      } else {
        closure = this._createRoom({ parent: corridor });
      }
      branch.push(corridor, closure);
      partParent = closure;
    }

    return branch;
  }

  _createRoom ({ x, y, width, height, parent }) {
    const { roomMinSize, roomMaxSize } = this._options;
    const room = this._createBuild(BUILD_TYPES.room, {
      parent,
      x,
      y,
      width: width || this._getRandom(roomMinSize, roomMaxSize),
      height: height || this._getRandom(roomMinSize, roomMaxSize),
    });

    parent && this._placeBuild(room, parent);
    return room;
  }

  _createCorridor ({ parent }) {
    const { corridorMinLength, corridorMaxLength } = this._options;
    const corridorLength = this._getRandom(corridorMinLength, corridorMaxLength);
    const corridor = this._createBuild(BUILD_TYPES.corridor, {
      parent,
      width: 1,
      height: 1,
    });

    corridor.direction = directionsList[this._getRandom(0, directionsList.length - 1)];

    if (parent) {
      if (isHorizontal(corridor.direction)) {
        corridor.width = corridorLength;
      } else {
        corridor.height = corridorLength;
      }
      this._placeBuild(corridor, parent);
    }

    return corridor;
  }

  _createConnector ({ parent }) {
    const connector = this._createBuild(BUILD_TYPES.connector, {
      parent,
      width: 1,
      height: 1,
    });

    parent && this._placeBuild(connector, parent);
    return connector;
  }

  _createBuild (type, { x, y, width, height, parent }) {
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

  _placeBuild (build, parent) {
    const direction = (
      build.type === BUILD_TYPES.corridor
        ? build.direction
        : parent.direction
    ) || DIRECTIONS.left;

    if (isHorizontal(direction)) {
      build.y = this._getRandom(
        parent.top - build.height + 1,
        parent.bottom - 1
      );
    } else {
      build.x = this._getRandom(
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

  _getRandom (min, max) {
    const seededRandom = this._rng();
    return Math.floor(min + (seededRandom * (max + 1 - min)));
  }

  _createBuffer (builds) {
    const bottomRight = getBottomRightBound(builds);
    const buffer = createMatrix(
      bottomRight.x + 1,
      bottomRight.y + 1,
      false
    );

    builds.forEach(build => {
      buffer.forEachInRect(build.x, build.y, build.width, build.height, (x, y) => {
        buffer.set(x, y, true);
      });
    });

    return buffer;
  }
}

const isRoom = propEq('type', BUILD_TYPES.room);
const isCorridor = propEq('type', BUILD_TYPES.corridor);
const isConnector = propEq('type', BUILD_TYPES.connector);
const isExtensible = negate(isCorridor);

const isHorizontal = includes(__, [DIRECTIONS.left, DIRECTIONS.right]);

const canAddBuild = (newBuild, readyBuilds) => {
  // builds list to check collides with new build
  const checkingBuilds = readyBuilds.filter(build => {
    const isSelf = build === newBuild;
    const isParent = build === newBuild.parent;
    const isChildren = newBuild.children.includes(build);
    const isConnected = build.children.includes(newBuild.parent) || newBuild.children.includes(build.parent);

    return !isSelf && !isParent && !isChildren && !isConnected;
  });

  return !checkingBuilds.some(
    build => build.collides(newBuild)
  );
};

const optimizeBuilds = builds => {
  const topLeft = getTopLeftBound(builds);

  translateBuilds(
    builds,
    topLeft.x < 1 ? 1 - topLeft.x : 0,
    topLeft.y < 1 ? 1 - topLeft.y : 0
  );

  return builds;
};

const translateBuilds = (builds, offsetX, offsetY) => {
  builds.forEach(build => {
    build.x += offsetX;
    build.y += offsetY;
  });
};

const getTopLeftBound = builds => {
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
};

const getBottomRightBound = builds => {
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
};

const isPositiveInteger = n => Number.isInteger(n) && n > 0;
