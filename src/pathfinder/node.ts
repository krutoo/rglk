import { Point } from '../point';

export class Node extends Point {
  g: number;
  h: number;
  parent?: Node | null;

  constructor({
    x,
    y,
    g,
    h,
    parent,
  }: {
    x: number;
    y: number;
    g?: number;
    h?: number;
    parent?: Node | null;
  }) {
    super(x, y);

    this.g = g || 0;
    this.h = h || 0;
    this.parent = parent || null;
  }

  get f() {
    return this.g + this.h;
  }

  createPathToRoot() {
    const path = [];
    let currentNode: Node = this;

    while (currentNode.parent) {
      path.unshift(currentNode);
      currentNode = currentNode.parent;
    }

    return path;
  }
}
