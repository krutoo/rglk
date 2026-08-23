import { type Point2d, Vector2, pairs, randomInteger } from '@krutoo/utils';
import { AABB, type Box2d } from '../shared/aabb.ts';
import { DSU } from '../shared/dsu.ts';

export interface CreateDungeonOptions {
  roomAmount: number;
  roomMinSize: number;
  roomMaxSize: number;
  roomMargin?: number;
}

export interface CreateDungeonIteration {
  rooms: Box2d[];
  corridors: Line2d[];
}

export interface CreateDungeonResult {
  rooms: Box2d[];
  corridors: Line2d[];
}

interface Line2d {
  a: Point2d;
  b: Point2d;
}

export function* createDungeon({
  roomAmount,
  roomMinSize,
  roomMaxSize,
  roomMargin,
}: CreateDungeonOptions): Generator<CreateDungeonIteration, CreateDungeonResult, void> {
  const rooms: Box2d[] = [];
  const bodies: Box2d[] = [];
  const corridors: Line2d[] = [];
  const maxRoomSize = Math.max(roomMinSize, roomMaxSize);

  // create collection of rooms:
  for (let i = 0; i < roomAmount; i++) {
    const room: Box2d = {
      x: randomInteger(-maxRoomSize, maxRoomSize),
      y: randomInteger(-maxRoomSize, maxRoomSize),
      width: randomInteger(roomMinSize, roomMaxSize),
      height: randomInteger(roomMinSize, roomMaxSize),
    };

    rooms.push(room);
  }

  // create physical body for each room:
  for (const room of rooms) {
    bodies.push(new ProxyBox(room, { margin: roomMargin }));
  }

  // simulate 2d physics until something moves:
  let hasUpdates = false;

  do {
    yield { rooms, corridors };

    hasUpdates = false;

    for (const [a, b] of pairs(bodies)) {
      const changed = AABB.resolveCollision(a, b);

      if (changed) {
        roundBox(a);
        roundBox(b);
        hasUpdates = true;
      }
    }
  } while (hasUpdates);

  // соединяем все вершины со всеми:
  const connections: Line2d[] = [];

  for (const [a, b] of pairs(bodies)) {
    connections.push({
      a: roundPoint(AABB.centerOf(a)),
      b: roundPoint(AABB.centerOf(b)),
    });
  }

  // строим триангуляцию:
  const triangulation: Line2d[] = [];

  connections.sort((a, b) => {
    const len1 = Vector2.from(a.a).getDistance(a.b);
    const len2 = Vector2.from(b.a).getDistance(b.b);

    return len1 - len2;
  });

  for (const item of connections) {
    if (triangulation.some(t => lineIntersects(t.a, t.b, item.a, item.b))) {
      continue;
    }

    triangulation.push(item);
  }

  // строим минимальное остовное дерево:
  const mst: Line2d[] = [];
  const dsu = new DSU(bodies.length);

  for (const line of triangulation) {
    if (
      dsu.union(
        bodies.findIndex(r => roundPoint(AABB.centerOf(r)).equalsTo(line.a)),
        bodies.findIndex(r => roundPoint(AABB.centerOf(r)).equalsTo(line.b)),
      )
      // || Math.random() > 0.8
    ) {
      mst.push(line);
    }
  }

  // коридоры:
  for (const { a, b } of mst) {
    const middle = Math.random() > 0.5 ? { x: a.x, y: b.y } : { x: b.x, y: a.y };

    corridors.push({ a, b: middle });
    corridors.push({ a: middle, b });
  }

  return { rooms, corridors };
}

interface ProxyBoxOptions {
  margin?: number;
}

class ProxyBox implements Box2d {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  private target: Box2d;
  private options: Required<ProxyBoxOptions>;

  constructor(target: Box2d, { margin = 0 }: ProxyBoxOptions = {}) {
    this._x = target.x - margin;
    this._y = target.y - margin;
    this._width = target.width + margin * 2;
    this._height = target.height + margin * 2;
    this.target = target;
    this.options = { margin };
  }

  get x() {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this.target.x = value + this.options.margin;
  }

  get y() {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
    this.target.y = value + this.options.margin;
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.target.width = value - this.options.margin * 2;
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.target.height = value - this.options.margin * 2;
  }
}

function lineIntersects(p1: Point2d, p2: Point2d, p3: Point2d, p4: Point2d) {
  let det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);

  if (det === 0) {
    return false;
  } else {
    let lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
    let gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;

    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}

function roundPoint<T extends Point2d>(v: T): T {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);

  return v;
}

function roundBox<T extends Box2d>(r: T): T {
  r.x = Math.round(r.x);
  r.y = Math.round(r.y);
  r.width = Math.round(r.width);
  r.height = Math.round(r.height);

  return r;
}
