import Point from './Point.js';

/**
 * Represents a Exlorer (FOV calculation) class.
 */
export default class Explorer {
	/**
	 * Create a Explorer.
	 * @param {Function} isTransparent - callback for identify tile.
	 */
	constructor(isTransparent) {
		if (isTransparent instanceof Function) {
			this._isTransparent = isTransparent;
		}
	}

	/**
	 * Get line on a grid. Based on Bresenham's line algorithm.
	 * @param {Point} point0 - Object of class Point, start position.
	 * @param {Point} point1 - Object of class Point, end position.
	 * @private
	 */
	_getPointsOfLine (point0, point1) {
		let dx = point1.x - point0.x,
			dy = point1.y - point0.y,
			nx = Math.abs(dx),
			ny = Math.abs(dy),
			sx = (dx > 0) ? 1 : -1,
			sy = (dy > 0) ? 1 : -1,
			p = new Point(p0.x, p0.y),
			points = [new Point(p.x, p.y)];
		for (var ix = 0, iy = 0; ix < nx || iy < ny;) {
			if ((0.5 + ix) / nx == (0.5 + iy) / ny) {
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

	/**
	 * Calculate FOV.
	 * @param {number} centerX The x position of center.
	 * @param {number} centerY The y position of center.
	 * @param {number} radius Radius of view.
	 * @param {Function} isExplored Called if tile is explored.
	 */
	calculate(centerX, centerY, radius, isExplored) {
		if (!(this._isTransparent instanceof Function)) {
			return console.warn(`Explorer.calculate: ${this._isTransparent} is not a Function`);
		}
		if (isNaN(centerX) || isNaN(centerY) || isNaN(radius)) {
			return console.warn(`Explorer.calculate: arguments ${centerX, centerY, radius} must be a Number`);
		}
		if (!(isExploredCallback instanceof Function)) {
			return console.warn(`Explorer.calculate: argument ${isExploredCallback} is not a Function`);
		}
		let squareRaduis = Math.pow(radius, 2),
			center = new Point(centerX, centerY),
			minX = center.x - radius,
			maxX = center.x + radius,
			minY = center.y - radius,
			maxY = center.y + radius;

		// check floors in radius
		for (var y = minY; y <= maxY; y++) {
			for (var x = minX; x <= maxX; x++) {
				if (y === minY || y === maxY || x === minX || x === maxX) {
					// check line of sight
					const line = this._getPointsOfLine(center, new Point(x, y));
					for (var i = 0; i < line.length; i++) {
						var tile = line[i],
							squareDistance = Math.pow(center.x - tile.x, 2) + Math.pow(center.y - tile.y, 2);
						if (squareDistance <= squareRaduis) {
							if (!this._isTransparent(tile.x, tile.y) ) {
								break;
							} else {
								isExploredCallback(tile.x, tile.y);
							}
						} else {
							break;
						}
					}
				}
			}
		}
	}
}
