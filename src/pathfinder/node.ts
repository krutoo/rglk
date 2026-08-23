import { Point } from '../point.ts';

export class Node extends Point {
  g: number;
  h: number;
  parent?: Node | null;

  constructor(x: number, y: number, g?: number, h?: number, parent?: Node | null) {
    super(x, y);

    this.g = g || 0;
    this.h = h || 0;
    this.parent = parent || null;
  }

  get f(): number {
    return this.g + this.h;
  }

  createPathToRoot(): Node[] {
    const path: Node[] = [];
    let currentNode: Node = this;

    while (currentNode.parent) {
      path.unshift(currentNode);
      currentNode = currentNode.parent;
    }

    return path;
  }
}
