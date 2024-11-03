import { Point } from '../point.js';
import { getLinePoints } from './utils.js';

interface PositionChecker {
  (x: number, y: number): boolean;
}

export function createExplorer(isTransparent: PositionChecker) {
  return (
    centerX: number,
    centerY: number,
    radius: number,
    handleExplored?: (x: number, y: number) => void,
  ) => {
    const checkedPoints = new Set();
    const visiblePoints: Array<{ x: number; y: number }> = [];
    const hasExploredHandler = typeof handleExplored === 'function';
    const squareRadius = radius ** 2;
    const center = new Point(centerX, centerY);

    // define square area bounds
    const minX = center.x - radius;
    const maxX = center.x + radius;
    const minY = center.y - radius;
    const maxY = center.y + radius;

    // check floors in radius
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // if x or y equals to bound of square area
        if (minX === x || maxX === x || minY === y || maxY === y) {
          const rayPoints = getLinePoints(center.x, center.y, x, y);

          rayCast: for (const point of rayPoints) {
            const pointKey = `${point.x}x${point.y}`;

            if (!checkedPoints.has(pointKey)) {
              const squareDistance = (center.x - point.x) ** 2 + (center.y - point.y) ** 2;

              if (squareDistance <= squareRadius && isTransparent(point.x, point.y)) {
                visiblePoints.push(point);
                hasExploredHandler && handleExplored(point.x, point.y);
              } else {
                break rayCast;
              }

              checkedPoints.add(pointKey);
            }
          }
        }
      }
    }

    return visiblePoints;
  };
}
