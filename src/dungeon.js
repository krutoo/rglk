import Point2 from './point2';
import Room from './room';
import Helper from './helper';

class Dungeon {
	constructor(options = {}) {
		this.options = {
			roomMinSize: isNaN(options.roomMinSize) ? 5 : options.roomMinSize,
			roomMaxSize: isNaN(options.roomMaxSize) ? 5 : options.roomMaxSize,
			roomAmount: isNaN(options.roomAmount) ? 1 : options.roomAmount,
			density: isNaN(options.density) ? 1 : options.density
		};
	}

	get width() {
		return this._tiles[0].length || 0;
	}

	get height() {
		return this._tiles.length || 0;
	}
	
	generate(callback) {
		this._createRooms();
		this._optimizeRooms();
		this._createMap();
		this.forEachTile(callback);
	}

	forEachTile(callback) {
		if (callback instanceof Function) {
			for (var y = 0; y < this._tiles.length; y++) {
				for (var x = 0; x < this._tiles[y].length; x++) {
					if (callback instanceof Function) {
						callback(x, y, this._tiles[y][x]);
					}
				}
			}
		}
	}

	isWall(x, y) {
		if (this._tiles[y] != undefined && this._tiles[y][x] != undefined) {
			return !this._tiles[y][x];
		}
		
		return undefined;
	}

	_createRooms() {
		var random = new Helper().random,
			density = this.options.density,
			amount = this.options.roomAmount,
			minSize = this.options.roomMinSize,
			maxSize = this.options.roomMaxSize,
			firstRoom = new Room(1, 1, random(minSize, maxSize), random(minSize, maxSize));
		
		this.rooms = [firstRoom];
		
		if (density > 1) {
			density = 1;
		} else if (density < 0) {
			density = 0;
		}
		
		while (this.rooms.length != amount) {
			/* create new room */
			var lastRoom = this.rooms[random(0, this.rooms.length - 1)],
				newWidth = random(minSize, maxSize),
				newHeight = random(minSize, maxSize),
				dxMin = 1 + Math.floor(lastRoom.width / 2 + newWidth / 2),
				dyMin = 1 + Math.floor(lastRoom.height / 2 + newHeight / 2),
				dxMax = Math.floor(dxMin * (2 - density)),
				dyMax = Math.floor(dyMin * (2 - density)),
				newRoom = new Room(0, 0, newWidth, newHeight),
				direction = random(0, 3),
				collision = false;

			newRoom.x = lastRoom.x - Math.round((newRoom.width - lastRoom.width) / 2);
			newRoom.y = lastRoom.y - Math.round((newRoom.height - lastRoom.height) / 2);
			
			switch (direction) {
				case 0: newRoom.x -= random(dxMin, dxMax); break;
				case 1: newRoom.y += random(dyMin, dyMax); break;
				case 2: newRoom.x += random(dxMin, dxMax); break;
				case 3: newRoom.y -= random(dyMin, dyMax); break;
			}

			/* check intersections */
			for (var i = 0; i < this.rooms.length; i++) {
				if (newRoom.intersects(this.rooms[i])) {
					collision = true;
					break;
				}
			}
			
			if (!collision) {
				newRoom.parent = lastRoom;
				this.rooms.push(newRoom);
			}
		}
	}

	_optimizeRooms() {
		/* leftmost top point search */
		var topLeft = this._getTopLeft();
		
		/* translate rooms */
		if (topLeft.x < 1) {
			this._translateRooms(1 - topLeft.x, 0);
		}
		
		if (topLeft.y < 1) {
			this._translateRooms(0, 1 - topLeft.y);
		}
	}

	_translateRooms(offsetX, offsetY) {
		this.rooms.forEach(function(room) {
			room.x += offsetX;
			room.y += offsetY;
		});
	}

	_getTopLeft() {
		var topLeft = new Point2(Infinity, Infinity);
		
		this.rooms.forEach(function (room) {
			if (room.x < topLeft.x) {
				topLeft.x = room.x;
			}
			
			if (room.y < topLeft.y) {
				topLeft.y = room.y;
			}
		});
		
		return topLeft;
	}

	_getBottomRight() {
		var bottomRight = new Point2(-Infinity, -Infinity);
		
		this.rooms.forEach(function (room) {
			if (room.x + room.width > bottomRight.x) {
				bottomRight.x = room.x + room.width;
			}
			
			if (room.y + room.height > bottomRight.y) {
				bottomRight.y = room.y + room.height;
			}
		});
		
		return bottomRight;
	}

	_createMap() {
		var bottomRight = this._getBottomRight();
		
		this._fillMap(bottomRight.x + 1, bottomRight.y + 1);
		this._buildRooms();
		this._buildCorridors();
	}

	_fillMap(width, height) {
		/* this._tiles[y][x] === true (floor) || false (wall) */
		this._tiles = []; 
		
		for (var y = 0; y < height; y++) {
			this._tiles.push([]);
			for (var x = 0; x < width; x++) {
				this._tiles[y].push(false);
			}
		}
	}

	_buildRooms() {
		this.rooms.forEach(function(room) {
			this._fillRect(room.x, room.y, room.width, room.height);
		}.bind(this));
	}

	_buildCorridors() {
		this.rooms.forEach(function(room) {
			if (!room.parent) {
				return;
			}

			this._fillRect(
				Math.min(room.center.x, room.parent.center.x), 
				room.center.y, 
				Math.abs(room.center.x - room.parent.center.x) + 1, 
				1
			);

			this._fillRect(
				room.parent.center.x, 
				Math.min(room.center.y, room.parent.center.y), 
				1, 
				Math.abs(room.center.y - room.parent.center.y) + 1
			);
		}.bind(this));
	}

	_fillRect(startX, startY, width, height) {
		for (var y = startY; y <= startY + height - 1; y++) {
			for (var x = startX; x <= startX + width - 1; x++) {
				this._tiles[y][x] = true;
			}
		}
	}
}

export default Dungeon;