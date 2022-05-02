import { Node } from './node';
import { Point } from '../point';

interface PositionChecker {
  (x: number, y: number): boolean;
}

/**
 * Returns a 2d pathfinder function.
 * @param isOpen Should determine that position is open.
 * @param [options] Options.
 * @param [options.getHeuristic=getManhattanDistance] Heuristic function.
 * @return List of path points.
 */
export const createPathfinder = (
  isOpen: PositionChecker,
  { getHeuristic = getManhattanDistance } = {},
) => {
  if (typeof isOpen !== 'function') {
    throw new TypeError('First argument "isOpen" must be a function');
  }

  const getNeighbors = createNeighborsFinder(isOpen);

  /**
   * Search path between two points.
   * @param x1 First point x.
   * @param y1 First point y.
   * @param x2 Second point x.
   * @param y2 Second point y.
   * @return List of path points.
   */
  return (x1: number, y1: number, x2: number, y2: number) => {
    const visitedNodes = [];
    const unvisitedNodes = [];

    const start = new Node({ x: x1, y: y1 });
    const finish = new Node({ x: x2, y: y2 });

    let resultPath: Point[] = [];

    unvisitedNodes.push(start);

    // main loop
    while (unvisitedNodes.length > 0) {
      // search in open list node with lowest value f = g + h
      let currentNodeIndex = 0;
      let currentNode = unvisitedNodes[0];

      // @todo optimize search (maybe use binary heap)
      unvisitedNodes.forEach((node, index) => {
        if (node.f < currentNode.f) {
          currentNode = node;
          currentNodeIndex = index;
        }
      });

      // add found node to closed list, delete it from open list
      unvisitedNodes.splice(currentNodeIndex, 1);
      visitedNodes.push(currentNode);

      // if current node is target then create path and break
      if (Point.equals(currentNode, finish)) {
        resultPath = currentNode.createPathToRoot();
        break;
      }

      const neighbors = getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        const likeNeighbor = (p: Point) => Point.equals(p, neighbor);

        // ignore neighbor node if it is already visited
        if (visitedNodes.some(likeNeighbor)) {
          continue;
        }

        // if neighbor not in open list, add him to open list, update h
        if (!unvisitedNodes.some(likeNeighbor)) {
          neighbor.h = getHeuristic(neighbor.x, neighbor.y, finish.x, finish.y);
          unvisitedNodes.push(neighbor);
        }
      }
    }

    return resultPath;
  };
};

/**
 * Returns heuristic value (Manhattan distance) between two positions.
 * @param x1 First position x.
 * @param y1 First position y.
 * @param x2 Second position x.
 * @param y2 Second position y.
 * @return Heuristic value.
 */
export const getManhattanDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const horizontal = Math.abs(x2 - x1);
  const vertical = Math.abs(y2 - y1);

  return horizontal + vertical;
};

/**
 * Returns function that creates list of node neighbors.
 * @param isOpen Should determines that neighbor is open.
 * @param withDiagonal True if diagonal.
 * @return Function that creates list of node neighbors.
 */
const createNeighborsFinder =
  (isOpen: PositionChecker, withDiagonal = false) =>
  (node: Node) => {
    const neighbors = [];

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const isDiagonal = Math.abs(x + y) !== 1;

        if (withDiagonal || !isDiagonal) {
          if (isOpen(node.x + x, node.y + y)) {
            neighbors.push(
              new Node({
                x: node.x + x,
                y: node.y + y,
                g: node.g + (isDiagonal ? Math.sqrt(2) : 1),
                parent: node,
              }),
            );
          }
        }
      }
    }

    return neighbors;
  };
