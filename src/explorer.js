import Point2 from './point2.js';
import Helper from './helper';

class Explorer {
	constructor(isTransparent) {
		if (!new Helper().isFunction(isTransparent)) {
			console.warn(`Pathfinder: argument ${isTransparent} is not a Function`);
			this._isTransparent = () => {return null;};
			return;
		}

		this._isTransparent = isTransparent;
	}

	_line(p0, p1) {
		var dx = p1.x - p0.x, 
			dy = p1.y - p0.y,
			nx = Math.abs(dx), 
			ny = Math.abs(dy),
			sx = (dx > 0) ? 1 : -1, 
			sy = (dy > 0) ? 1 : -1,
			p = new Point2(p0.x, p0.y),
			points = [new Point2(p.x, p.y)];

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

			points.push(new Point2(p.x, p.y));
		}

		return points;
	}

	calculate(centerX, centerY, radius, isExploredCallback) {
		if (isNaN(centerX) || isNaN(centerY) || isNaN(radius)) {
			return console.warn(`Explorer.calculate: arguments ${centerX, centerY, radius} must be a Number`);
		}

		if (!new Helper().isFunction(isExploredCallback)) {
			return console.warn(`Explorer.calculate: argument ${isExploredCallback} is not a Function`);
		}

		var squareRaduis = Math.pow(radius, 2),
			center = new Point2(centerX, centerY),
			minX = center.x - radius,
			maxX = center.x + radius,
			minY = center.y - radius,
			maxY = center.y + radius;

		// check floors in radius
		for (var y = minY; y <= maxY; y++) {
			for (var x = minX; x <= maxX; x++) {
				if (y === minY || y === maxY || x === minX || x === maxX) {
					// check line of sight
					var line = this._line(center, new Point2(x, y));

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

export default Explorer;