export interface IMatrix {
  readonly width: number;
  readonly height: number;

  get(x: number, y: number): number;
  set(x: number, y: number, value: number): void;
}

export class Matrix implements IMatrix {
  readonly width: number;
  readonly height: number;

  private buffer: number[];

  constructor(width: number, height: number, filler = 0) {
    this.width = width;
    this.height = height;
    this.buffer = Array(width * height).fill(filler);
  }

  get(x: number, y: number): number {
    return this.buffer[Matrix.pointToIndex(x, y, this.width)];
  }

  set(x: number, y: number, item: number): void {
    this.buffer[Matrix.pointToIndex(x, y, this.width)] = item;
  }

  forEach(callback: (x: number, y: number, value: number) => void) {
    this.forEachInRect(0, 0, this.width, this.height, callback);
  }

  forEachInRect(
    rectLeft: number,
    rectTop: number,
    rectWidth: number,
    rectHeight: number,
    callback: (x: number, y: number, value: number) => void,
  ) {
    for (let x = rectLeft; x < rectLeft + rectWidth; x++) {
      for (let y = rectTop; y < rectTop + rectHeight; y++) {
        callback(x, y, this.get(x, y));
      }
    }
  }

  static pointToIndex(x: number, y: number, width: number): number {
    return x + y * width;
  }
}
