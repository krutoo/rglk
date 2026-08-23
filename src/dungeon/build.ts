import { Rectangle } from './rectangle.ts';

export type BuildType = 'room' | 'corridor' | 'connector';

export type Direction = 'top' | 'right' | 'bottom' | 'left';

export class Build extends Rectangle {
  static isRoom(build: Build): boolean {
    return build.type === 'room';
  }

  static isCorridor(build: Build): boolean {
    return build.type === 'corridor';
  }

  static isConnector(build: Build): boolean {
    return build.type === 'connector';
  }

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
    }: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      parent?: Build;
    },
  ) {
    super(x, y, width, height);
    this.type = type;
    this.parent = parent;
    this.children = [];
  }
}
