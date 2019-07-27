import Point from '../Point.js';

/**
 * Get list of points 2d line on a grid. Based on Bresenham's line algorithm.
 * @param {number} x1 First point x position.
 * @param {number} y1 First point y position.
 * @param {number} x2 Second point x position.
 * @param {number} y2 Second point y position.
 * @return {Array<Point>} List of positions with round coords between two points.
 */
const getLinePoints = (x1, y1, x2, y2) => {
  const point1 = new Point(x1, y1);
  const point2 = new Point(x2, y2);
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;
  const nx = Math.abs(deltaX);
  const ny = Math.abs(deltaY);
  const sx = deltaX > 0 ? 1 : -1;
  const sy = deltaY > 0 ? 1 : -1;
  const currentPoint = new Point(point1.x, point1.y);
  const points = [currentPoint.clone()];

  // when current position non in target
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    if ((0.5 + ix) / nx === (0.5 + iy) / ny) {
      currentPoint.x += sx;
      currentPoint.y += sy;
      ix++;
      iy++;
    } else if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      currentPoint.x += sx;
      ix++;
    } else {
      currentPoint.y += sy;
      iy++;
    }
    points.push(currentPoint.clone());
  }

  return points;
};

export default getLinePoints;
