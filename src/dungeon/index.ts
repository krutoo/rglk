import { createGenerator } from '../prng';
import { Point } from '../point';
import { Matrix } from './matrix';
import { Build, BuildType, BUILD_TYPE, DIRECTION } from './build';

export interface DungeonOptions {
  roomsAmount?: number;
  roomMinSize?: number;
  roomMaxSize?: number;
  corridorMinLength?: number;
  corridorMaxLength?: number;
  corridorComplexity?: number;
  seed?: number;
}

/**
 * Represents a dungeon.
 */
export class Dungeon {
  private _buffer!: Matrix;
  private _builds!: Build[];
  private _rng!: () => number;
  private _options!: Required<DungeonOptions>;

  /**
   * @param [options={}] Options of dungeon.
   * @param [options.roomsAmount=7] Amount of rooms.
   * @param [options.roomMinSize=5] Minimum room size.
   * @param [options.roomMaxSize=10] Maximum room size.
   * @param [options.corridorMinLength=3] Minimum corridor length.
   * @param [options.corridorMaxLength=7] Maximum corridor length.
   * @param [options.corridorComplexity=2] Amount of corridors turns.
   * @param [options.seed] Seed for pseudo random number generator, random by default.
   */
  constructor(options: DungeonOptions = {}) {
    this.setOptions(options);
    this.generate();
  }

  static getDefaultOptions(): Required<DungeonOptions> {
    return {
      seed: Math.random(),
      roomsAmount: 7,
      roomMinSize: 5,
      roomMaxSize: 10,
      corridorMinLength: 3,
      corridorMaxLength: 7,
      corridorComplexity: 2,
    } as const;
  }

  static optionsValidators: {
    [key in keyof Required<DungeonOptions>]: (v: unknown) => boolean;
  } = {
    seed: Number.isFinite,
    roomsAmount: isPositiveInteger,
    roomMinSize: isPositiveInteger,
    roomMaxSize: isPositiveInteger,
    corridorMinLength: isPositiveInteger,
    corridorMaxLength: isPositiveInteger,
    corridorComplexity: isPositiveInteger,
  };

  /**
   * Width of generated  in tiles.
   * @return Width.
   */
  get width() {
    return this._buffer.width;
  }

  /**
   * Returns height of generated dungeon in tiles.
   * @return Height.
   */
  get height() {
    return this._buffer.height;
  }

  /**
   * Returns rooms of generated dungeon.
   * @return List of rooms.
   */
  get rooms() {
    return this.builds.filter(Build.isRoom);
  }

  /**
   * Returns corridors of generated dungeon.
   * @return List of corridors.
   */
  get corridors() {
    return this.builds.filter(Build.isCorridor);
  }

  /**
   * Returns connectors of generated dungeon.
   * @return List of corridor connectors.
   */
  get connectors() {
    return this.builds.filter(Build.isConnector);
  }

  /**
   * Returns all builds of generated dungeon.
   * @return List all builds.
   */
  get builds() {
    const privateBuilds = Array.isArray(this._builds) ? this._builds : [];
    return [...privateBuilds];
  }

  /**
   * Update some options.
   * @param {Object} newOptions New options.
   */
  setOptions(newOptions: DungeonOptions) {
    if (this.isValidOptions(newOptions)) {
      this._options = {
        ...Dungeon.getDefaultOptions(),
        ...this._options,
        ...newOptions,
      };
    } else {
      throw Error(
        'First argument "options" is invalid: every option must be a positive integer (excluding "seed")',
      );
    }
  }

  isValidOptions(options: DungeonOptions): boolean {
    const defaults = Dungeon.getDefaultOptions();
    const checkers = Dungeon.optionsValidators;
    let isValid = true;

    Object.keys(defaults).forEach(optionKey => {
      const { [optionKey as unknown as keyof DungeonOptions]: defaultValue } = defaults;
      const { [optionKey as unknown as keyof DungeonOptions]: isValidValue } = checkers;
      const { [optionKey as unknown as keyof DungeonOptions]: value = defaultValue } =
        options || {};

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
  forEachTile(callback: (x: number, n: number, isFloor: boolean) => void) {
    const { width, height } = this;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        callback(x, y, this.isFloor(x, y));
      }
    }

    return this;
  }

  /**
   * Defines is it wall tile?
   * @param x X coordinate of tile.
   * @param y Y coordinate of tile.
   * @return Is wall tile?
   */
  isWall(x: number, y: number): boolean {
    return !this.isFloor(x, y);
  }

  /**
   * Defines is it floor tile?
   * @param x X coordinate of tile.
   * @param y Y coordinate of tile.
   * @return Is floor tile?
   */
  isFloor(x: number, y: number): boolean {
    let isFloor = false;

    if (x <= this.width && y <= this.height) {
      isFloor = Boolean(this._buffer && this._buffer.get(x, y));
    }

    return isFloor;
  }

  /**
   * Generate new dungeon map.
   */
  generate() {
    this._rng = createGenerator(this._options.seed);
    this._builds = optimizeBuilds(this._generateBuilds(this._options));
    this._buffer = this._createBuffer(this._builds);
  }

  private _generateBuilds(options: Required<DungeonOptions>): Build[] {
    const { roomsAmount } = this._options;
    const initialRoom = this._createRoom({ x: 0, y: 0 });

    const builds: Build[] = [initialRoom];

    if (roomsAmount > 1) {
      while (builds.filter(Build.isRoom).length < roomsAmount) {
        builds.push(...this._tryBuild(builds, options));
      }
    }

    return builds;
  }

  private _tryBuild(readyBuilds: Build[], options: Required<DungeonOptions>) {
    const extensibleBuilds = readyBuilds.filter(b => !Build.isCorridor(b));
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

  private _createBranch(parentBuild: Build, branchLength = 1) {
    const branch = [];
    let partParent = parentBuild;

    for (let index = 0; index < branchLength; index++) {
      // branch always starts with corridor, from room or from connector
      const corridor = this._createCorridor({ parentBuild: partParent });
      let closure = null;

      if (index < branchLength - 1) {
        closure = this._createConnector({ parentBuild: corridor });
      } else {
        closure = this._createRoom({ parentBuild: corridor });
      }
      branch.push(corridor, closure);
      partParent = closure;
    }

    return branch;
  }

  private _createRoom({
    x,
    y,
    width,
    height,
    parentBuild,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    parentBuild?: Build;
  }): Build {
    const { roomMinSize, roomMaxSize } = this._options;
    const room = this._createBuild(BUILD_TYPE.room, {
      parentBuild,
      x,
      y,
      width: width || this._getRandom(roomMinSize, roomMaxSize),
      height: height || this._getRandom(roomMinSize, roomMaxSize),
    });

    parentBuild && this._placeBuild(room, parentBuild);

    return room;
  }

  private _createCorridor({ parentBuild }: any) {
    const { corridorMinLength, corridorMaxLength } = this._options;
    const corridorLength = this._getRandom(corridorMinLength, corridorMaxLength);

    const corridor = this._createBuild(BUILD_TYPE.corridor, {
      parentBuild,
      width: 1,
      height: 1,
    });

    const allDirections = Object.values(DIRECTION);
    corridor.direction = allDirections[this._getRandom(0, allDirections.length - 1)];

    if (parentBuild) {
      if (isHorizontal(corridor.direction)) {
        corridor.width = corridorLength;
      } else {
        corridor.height = corridorLength;
      }
      this._placeBuild(corridor, parentBuild);
    }

    return corridor;
  }

  private _createConnector({ parentBuild }: { parentBuild: Build }) {
    const connector = this._createBuild(BUILD_TYPE.connector, {
      width: 1,
      height: 1,
      parentBuild,
    });

    if (parent) {
      this._placeBuild(connector, parentBuild);
    }

    return connector;
  }

  private _createBuild(
    type: BuildType,
    {
      x,
      y,
      width,
      height,
      parentBuild,
    }: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      parentBuild?: Build;
    },
  ) {
    const build = new Build(type, { x, y, width, height, parent: parentBuild });

    if (parentBuild) {
      build.parent = parentBuild;
      parentBuild.children.push(build);

      build.direction = parentBuild.direction;
    }

    return build;
  }

  private _placeBuild(build: Build, parentBuild: Build) {
    const direction =
      (build.type === BUILD_TYPE.corridor ? build.direction : parentBuild.direction) ||
      DIRECTION.left;

    if (isHorizontal(direction)) {
      build.y = this._getRandom(parentBuild.top - build.height + 1, parentBuild.bottom - 1);
    } else {
      build.x = this._getRandom(parentBuild.left - build.width + 1, parentBuild.right - 1);
    }

    switch (direction) {
      case DIRECTION.left:
        build.x = parentBuild.right;
        break;
      case DIRECTION.bottom:
        build.y = parentBuild.bottom;
        break;
      case DIRECTION.right:
        build.x = parentBuild.left - build.width;
        break;
      case DIRECTION.top:
        build.y = parentBuild.top - build.height;
        break;
    }
  }

  private _getRandom(min: number, max: number) {
    const seededRandom = this._rng();
    return Math.floor(min + seededRandom * (max + 1 - min));
  }

  private _createBuffer(builds: Build[]) {
    const bottomRight = getBottomRightBound(builds);
    const buffer = new Matrix(bottomRight.x + 1, bottomRight.y + 1, 0);

    builds.forEach(build => {
      buffer.forEachInRect(build.x, build.y, build.width, build.height, (x, y) => {
        buffer.set(x, y, 1);
      });
    });

    return buffer;
  }
}

function isHorizontal(value: unknown): boolean {
  return value === DIRECTION.left || value === DIRECTION.right;
}

const canAddBuild = (newBuild: Build, readyBuilds: Build[]) => {
  // builds list to check collides with new build
  const checkingBuilds = readyBuilds.filter(build => {
    const isSelf = build === newBuild;
    const isParent = build === newBuild.parent;
    const isChildren = newBuild.children.includes(build);
    const isConnected =
      (newBuild.parent && build.children.includes(newBuild.parent)) ||
      (build.parent && newBuild.children.includes(build.parent));

    return !isSelf && !isParent && !isChildren && !isConnected;
  });

  return !checkingBuilds.some(build => build.collides(newBuild));
};

const optimizeBuilds = (builds: Build[]) => {
  const topLeft = getTopLeftBound(builds);

  translateBuilds(builds, topLeft.x < 1 ? 1 - topLeft.x : 0, topLeft.y < 1 ? 1 - topLeft.y : 0);

  return builds;
};

const translateBuilds = (builds: Build[], offsetX: number, offsetY: number) => {
  builds.forEach(build => {
    build.x += offsetX;
    build.y += offsetY;
  });
};

const getTopLeftBound = (builds: Build[]) => {
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

const getBottomRightBound = (builds: Build[]) => {
  const bottomRight = new Point(-Infinity, -Infinity);

  builds.forEach((build: Build) => {
    if (build.right > bottomRight.x) {
      bottomRight.x = build.right;
    }
    if (build.bottom > bottomRight.y) {
      bottomRight.y = build.bottom;
    }
  });

  return bottomRight;
};

function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}
