import { Point } from '../point';

export class Node extends Point {
  constructor ({ x, y, g, h, parent } = {}) {
    super(x, y);

    this.g = g;
    this.h = h;
    this.parent = parent;
  }

  get g () {
    return Number(this._g) || 0;
  }

  set g (value) {
    if (Number.isFinite(value)) {
      this._g = Number(value);
    }
  }

  get h () {
    return Number(this._h) || 0;
  }

  set h (value) {
    if (Number.isFinite(value)) {
      this._h = Number(value);
    }
  }

  get parent () {
    return this._parent || null;
  }

  set parent (node) {
    if (node instanceof Node) {
      this._parent = node;
    }
  }

  get f () {
    return this.g + this.h;
  }

  createPathToRoot () {
    const path = [];
    let currentNode = this;

    while (currentNode.parent) {
      path.unshift(currentNode);
      currentNode = currentNode.parent;
    }

    return path;
  }
}
