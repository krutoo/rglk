import Point from './Point.js';
import { isFunction } from './utils.js';

/**
 * Represents a Explorer (FOV calculation).
 */
export default class Explorer {
	/**
	 * @param {Function} isTransparent Callback which must determine that tile is transparent.
	 */
	constructor (isTransparent) {
		if (isFunction(isTransparent)) {
			this.isTransparent = isTransparent;
		}
	}

	/**
	 * Returns an array of points in field of view.
	 * @param {number} centerX The x position of center.
	 * @param {number} centerY The y position of center.
	 * @param {number} radius Radius of view.
	 * @param {Function} [checkExplored] Called if tile is explored.
	 * @return {Array} Visible points array.
	 */
	calculate (centerX, centerY, radius, checkExplored) {
		// @todo change "visiblePoints" object on array (transform coords to index)
		const visiblePoints = {};

		if (this.checkArguments(...arguments)) {
			const { isTransparent } = this;
			const squareRadius = radius ** 2;
			const center = new Point(centerX, centerY);
			const minX = center.x - radius;
			const maxX = center.x + radius;
			const minY = center.y - radius;
			const maxY = center.y + radius;
			const canCheck = isFunction(checkExplored);

			// check floors in radius
			for (let y = minY; y <= maxY; y++) {
				for (let x = minX; x <= maxX; x++) {
					// if x or y equals to bound of square area
					if (minX === x || maxX === x || minY === y || maxY === y) {
						const points = this.getPointsOfLine(center, new Point(x, y));
						line: for (let i = 0; i < points.length; i++) {
							const point = points[i];
							const squareDistance = (center.x - point.x) ** 2 + (center.y - point.y) ** 2;
							const isTransparentTile = isTransparent(point.x, point.y);
							if (squareDistance <= squareRadius && isTransparentTile) {
								if (canCheck) {
									checkExplored(point.x, point.y);
								}
								visiblePoints[`${point.x}x${point.y}`] = point;
							} else {
								break line;
							}
						}
					}
				}
			}
		}

		return Object.values(visiblePoints);
	}

	checkArguments (centerX, centerY, radius, checkExplored) {
		return !isNaN(centerX + centerY + radius)
			&& isFinite(centerX + centerY + radius);
	}

	/**
	 * Get line on a grid. Based on Bresenham's line algorithm.
	 * @param {Point} point1 Start position.
	 * @param {Point} point2 End position.
	 */
	getPointsOfLine (point1, point2) {
		const dx = point2.x - point1.x;
		const dy = point2.y - point1.y;
		const nx = Math.abs(dx);
		const ny = Math.abs(dy);
		const sx = (dx > 0) ? 1 : -1;
		const sy = (dy > 0) ? 1 : -1;
		let p = new Point(point1.x, point1.y);
		let points = [new Point(p.x, p.y)];

		// when current position non in target
		for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
			if ((0.5 + ix) / nx === (0.5 + iy) / ny) {
				p.x += sx;
				p.y += sy;
				ix++;
				iy++;
			} else if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
				p.x += sx;
				ix++;
			} else {
				p.y += sy;
				iy++;
			}
			points.push(new Point(p.x, p.y));
		}

		return points;
	}
}
