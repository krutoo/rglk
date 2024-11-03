import { Rectangle } from './rectangle.js';

export const BUILD_TYPE = {
  room: Symbol('room'),
  corridor: Symbol('corridor'),
  connector: Symbol('connector'),
} as const;

export const DIRECTION = {
  top: Symbol('top'),
  right: Symbol('right'),
  bottom: Symbol('bottom'),
  left: Symbol('left'),
} as const;

export type BuildType = (typeof BUILD_TYPE)[keyof typeof BUILD_TYPE];

export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export class Build extends Rectangle {
  readonly type: BuildType;
  parent?: Build;
  children: Build[];
  direction?: Direction;

  constructor(
    type: BuildType,
    {
      x = 0,
      y = 0,
      width = 1,
      height = 1,
      parent,
    }: { x?: number; y?: number; width?: number; height?: number; parent?: Build },
  ) {
    super(x, y, width, height);
    this.type = type;
    this.parent = parent;
    this.children = [];
  }

  static isRoom(build: Build): boolean {
    return build.type === BUILD_TYPE.room;
  }

  static isCorridor(build: Build): boolean {
    return build.type === BUILD_TYPE.corridor;
  }

  static isConnector(build: Build): boolean {
    return build.type === BUILD_TYPE.connector;
  }
}
