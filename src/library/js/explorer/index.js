import Point from '../point.js';
import { isFunction, isFiniteNumber } from '../utils.js';
import getLinePoints from './get-line-points.js';

export const createExplorer = isTransparent => {
  if (!isFunction(isTransparent)) {
    throw TypeError('First argument "isTransparent" must be a function.');
  }

  return (centerX, centerY, radius, handleExplored) => {
    if (!isFiniteNumber(centerX + centerY + radius)) {
      throw TypeError('First three arguments (centerX, centerY, radius) must be finite numbers');
    }

    const checkedPoints = new Set();
    const visiblePoints = [];
    const hasExploredHandler = isFunction(handleExplored);
    const squareRadius = radius ** 2;
    const center = new Point(centerX, centerY);
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
              const squareDistance = ((center.x - point.x) ** 2) + ((center.y - point.y) ** 2);

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
};
