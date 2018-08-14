import Point from './Point';

/**
 * Explorers private data.
 * @type {WeakMap}
 */
const explorersData = new WeakMap();

/**
 * Represents a Explorer (FOV calculation).
 */
export default class Explorer {
	/**
	 * @param {Function} isTransparent Callback which must determine that tile is transparent.
	 */
	constructor (isTransparent) {
		if (isTransparent instanceof Function) {
			explorersData.set(this, { isTransparent });
			this._isTransparent = isTransparent;
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
		const visiblePoints = {};
		if (this.checkArguments(...arguments)) {
			const squareRadius = radius ** 2;
			const center = new Point(centerX, centerY);
			const minX = center.x - radius;
			const maxX = center.x + radius;
			const minY = center.y - radius;
			const maxY = center.y + radius;
			const canCheck = checkExplored instanceof Function;
			const isTransparent = explorersData.get(this).isTransparent;

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
	 * @param {Point} point0 Start position.
	 * @param {Point} point1 End position.
	 */
	getPointsOfLine (point0, point1) {
		let dx = point1.x - point0.x,
			dy = point1.y - point0.y,
			nx = Math.abs(dx),
			ny = Math.abs(dy),
			sx = (dx > 0) ? 1 : -1,
			sy = (dy > 0) ? 1 : -1,
			p = new Point(point0.x, point0.y),
			points = [new Point(p.x, p.y)];
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
