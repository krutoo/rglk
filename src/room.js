import Point2 from './point2';

class Room extends Point2 {
	constructor(x, y, width, height) {
		super(x, y);
		
		this._width = isNaN(width) ? 5 : width;
		this._height = isNaN(height) ? 5 : height;
	}

	get width() {
		return this._width;
	}

	set width(value) {
		if (!isNaN(value)) {
			this._width = value;
		} else {
			throw new TypeError('Value ' + value + ' is not a Number');
		}
	}

	get height() {
		return this._height;
	}

	set height(value) {
		if (!isNaN(value)) {
			this._height = value;
		} else {
			throw new TypeError('Value ' + value + ' is not a Number');
		}
	}

	get center() {
		return new Point2(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2)); 
	}

	intersects(room) {
		if (
			room.x > this.x + this.width  ||
			room.x + room.width < this.x  ||
			room.y > this.y + this.height ||
			room.y + room.height < this.y
		) {
			return false;
		}
		
		return true;
	}
}

export default Room;