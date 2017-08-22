(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rglk"] = factory();
	else
		root["rglk"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a 2D Point.
 */
var Point = function () {
	/**
  * Create a Point.
  * @param {number} x - the x of point.
  * @param {number} y - the y of point.
  */
	function Point(x, y) {
		_classCallCheck(this, Point);

		this._x = isNaN(x) ? 0 : x;
		this._y = isNaN(x) ? 0 : y;
	}

	/**
  * Get x value.
  * @return {number} The x value.
  */


	_createClass(Point, [{
		key: "distance",


		/**
   * Get distance to a point.
   * @param {object} Object of Point class.
   * @return {number} The distance.
   */
		value: function distance(point2) {
			return Math.sqrt(Math.pow(point2.x - this.x, 2) + Math.pow(point2.y - this.y, 2));
		}
	}, {
		key: "x",
		get: function get() {
			return this._x;
		}

		/**
   * Set x value.
   * @param {number} The x value.
   */
		,
		set: function set(value) {
			if (isNaN(value)) {
				console.warn("Point.x: value " + value + " is NaN");
			} else {
				this._x = value;
			}
		}

		/**
   * Get y value.
   * @return {number} The y value.
   */

	}, {
		key: "y",
		get: function get() {
			return this._y;
		}

		/**
   * Set y value.
   * @param {number} The y value.
   */
		,
		set: function set(value) {
			if (isNaN(value)) {
				console.warn("Point.y: value " + value + " is NaN");
			} else {
				this._y = value;
			}
		}
	}]);

	return Point;
}();

exports.default = Point;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// source: http://indiegamr.com/generate-repeatable-random-numbers-in-js/

var PRNG = function () {
	function PRNG(seed) {
		_classCallCheck(this, PRNG);

		this._seed = isNaN(seed) ? 12345 : seed;
	}

	_createClass(PRNG, [{
		key: "getRandom",
		value: function getRandom(min, max) {
			max = isNaN(max) ? 1 : max;
			min = isNaN(min) ? 0 : min;

			this._seed = (this._seed * 9301 + 49297) % 233280;
			var rnd = this._seed / 233280;

			return min + rnd * (max - min);
		}
	}, {
		key: "seed",
		get: function get() {
			return this._seed;
		},
		set: function set(value) {
			if (isNaN(value)) {
				return;
			} else {
				this._seed = value;
			}
		}
	}]);

	return PRNG;
}();

exports.default = PRNG;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = __webpack_require__(0);

var _point2 = _interopRequireDefault(_point);

var _rectangle = __webpack_require__(6);

var _rectangle2 = _interopRequireDefault(_rectangle);

var _prng = __webpack_require__(1);

var _prng2 = _interopRequireDefault(_prng);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a dungeon generator.
 */
var Dungeon = function () {
	/**
  * Create a dungeon.
  * @param {object} options - Dungeon generation options.
  * @param {number} options.seed - The seed to pseudorandom number generator.
  * @param {number} options.roomAmount - The amount of rooms.
  * @param {number} options.roomMinSize - Min size of room.
  * @param {number} options.roomMaxSize - Max size of room.
  * @param {number} options.corridorMinLength - Min length of corridors.
  * @param {number} options.corridorMaxLength - Max length of corridors.
  */
	function Dungeon() {
		var _this = this;

		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Dungeon);

		options = options instanceof Object ? options : {};

		this._tiles = [];
		this._rooms = [];
		this._corridors = [];
		this._prng = new _prng2.default(isNaN(options.seed) ? 0 : options.seed);
		this._options = {};

		// correct & add options
		Object.keys(options).forEach(function (key) {
			var option = options[key];
			_this._options[key] = isNaN(option) || option < 1 ? 1 : option;
		});
	}

	/**
  * Get the array of rooms.
  * @return {array} List of rooms.
  */


	_createClass(Dungeon, [{
		key: 'getRooms',
		value: function getRooms() {
			return this._rooms;
		}

		/**
   * Get the array of corridors.
   * @return {array} List of corridors.
   */

	}, {
		key: 'getCorridors',
		value: function getCorridors() {
			return this._corridors;
		}

		/**
   * Get the array of all builds.
   * @return {array} List of builds (rooms & corridors).
   */

	}, {
		key: 'getBuilds',
		value: function getBuilds() {
			return this._rooms.concat(this._corridors);
		}

		/**
   * Get the width of dungeon.
   * @return {number} The dungeon width (number of tiles).
   */

	}, {
		key: 'getWidth',
		value: function getWidth() {
			return Array.isArray(this._tiles[0]) ? this._tiles[0].length : 0;
		}

		/**
   * Get the height of dungeon.
   * @return {number} The dungeon height (number of tiles).
   */

	}, {
		key: 'getHeight',
		value: function getHeight() {
			return Array.isArray(this._tiles) ? this._tiles.length : 0;
		}

		/**
   * Get seed of dungeon.
   * @return {number} The seed value.
   */

	}, {
		key: 'getSeed',
		value: function getSeed() {
			return this._prng.seed;
		}

		/**
   * Run callback to each tile of generated map.
   * @param {Dungeon~forEachTileCallback} forEachTileCallback - function called fo each tile.
   */

	}, {
		key: 'forEachTile',
		value: function forEachTile(callback) {
			if (!this._tiles) {
				return;
			}

			if (callback instanceof Function) {
				for (var y = 0; y < this._tiles.length; y++) {
					for (var x = 0; x < this._tiles[y].length; x++) {
						callback(x, y, this._tiles[y][x]);
					}
				}
			}

			return this;
		}
		/**
   * This callback called fo each tile. Is the part of the Dungeon class.
   * @callback Dungeon~forEachTileCallback
   * @param {number} The x of tile.
   * @param {number} The y of tile.
   * @param {boolean} Boolean giving is floor tile or not.
   */

		/**
   * Get type of tile.
   * @param {number} x - The y of tile position.
   * @param {number} y - The x of tile position.
   */

	}, {
		key: 'isWall',
		value: function isWall(x, y) {
			if (this._tiles[y] !== undefined && this._tiles[y][x] !== undefined) {
				return !this._tiles[y][x];
			}

			return undefined;
		}

		/**
   * Generate dungeon. Generate arrays of rooms and corridors, matrix of tiles
   */

	}, {
		key: 'generate',
		value: function generate() {
			this._generateBuilds();
			this._optimizeBuilds();
			this._createMap();

			return this;
		}

		/**
   * Generate builds (rooms & corridors).
   */

	}, {
		key: '_generateBuilds',
		value: function _generateBuilds() {
			var _this2 = this;

			var random = function random(max, min) {
				return Math.round(_this2._prng.getRandom(min, max));
			},
			    roomAmount = this._options.roomAmount,
			    roomMinSize = this._options.roomMinSize,
			    roomMaxSize = this._options.roomMaxSize,
			    corridorMinLength = this._options.corridorMinLength,
			    corridorMaxLength = this._options.corridorMaxLength;

			// set default
			this._rooms = [];
			this._corridors = [];

			// add first room
			this._rooms.push(new _rectangle2.default(1, 1, random(roomMinSize, roomMaxSize), random(roomMinSize, roomMaxSize)));

			// main loop
			while (this._rooms.length < roomAmount) {
				// configure new room relative random room from list
				var index = random(0, this._rooms.length - 1),
				    lastRoom = this._rooms[index],
				    newWidth = random(roomMinSize, roomMaxSize),
				    newHeight = random(roomMinSize, roomMaxSize),
				    newRoom = new _rectangle2.default(0, 0, newWidth, newHeight),
				    newCorridorLength = random(corridorMinLength, corridorMaxLength),
				    newCorridor = new _rectangle2.default(0, 0, 1, 1),
				    direction = random(0, 3),
				    collision = false,
				    deltaWidth = newRoom.width - lastRoom.width,
				    deltaHeight = newRoom.height - lastRoom.height;

				// configure new corridor and room
				if (direction === 0 || direction === 2) {
					newRoom.y = lastRoom.y - random(0, deltaHeight);
					newCorridor.y = random(Math.max(lastRoom.top, newRoom.top), Math.min(lastRoom.bottom, newRoom.bottom));
					newCorridor.width = newCorridorLength;
				} else {
					newRoom.x = lastRoom.x - random(0, deltaWidth);
					newCorridor.height = newCorridorLength;
					newCorridor.x = random(Math.max(lastRoom.left, newRoom.left), Math.min(lastRoom.right, newRoom.right));
				}

				// configure new corridor and room
				if (direction === 0) {
					newRoom.x = lastRoom.right + newCorridorLength + 1;
					newCorridor.x = lastRoom.right + 1;
				} else if (direction === 1) {
					newRoom.y = lastRoom.bottom + newCorridorLength + 1;
					newCorridor.y = lastRoom.bottom + 1;
				} else if (direction === 2) {
					newRoom.x = lastRoom.left - newCorridorLength - newRoom.width;
					newCorridor.x = lastRoom.left - newCorridor.width;
				} else {
					newRoom.y = lastRoom.top - newCorridorLength - newRoom.height;
					newCorridor.y = lastRoom.top - newCorridor.height;
				}

				// check cillosoions new room and corridor with rooms
				for (var i = 0; i < this._rooms.length; i++) {
					if (newRoom.collides(this._rooms[i])) {
						collision = true;
						break;
					}

					if (newCorridor.collides(this._rooms[i])) {
						if (index !== i) {
							// if this is not last room
							collision = true;
							break;
						}
					}
				}

				// check cillosoions new room with corridors
				for (var _i = 0; _i < this._corridors.length; _i++) {
					if (newRoom.collides(this._corridors[_i])) {
						collision = true;
						break;
					}
				}

				// add builds
				if (!collision) {
					this._rooms.push(newRoom);
					this._corridors.push(newCorridor);
				}
			}
		}

		/**
   * Optimize builds: translate all builds to positive coordinates.
   */

	}, {
		key: '_optimizeBuilds',
		value: function _optimizeBuilds() {
			// leftmost top point search
			var topLeft = this._getTopLeft();

			// translate rooms to leftmost top position (1, 1)
			if (topLeft.x < 1) {
				this._translateBuilds(1 - topLeft.x, 0);
			}

			if (topLeft.y < 1) {
				this._translateBuilds(0, 1 - topLeft.y);
			}
		}

		/**
   * Get the point of leftmost top position among all builds.
   * @return {object} The point.
   */

	}, {
		key: '_getTopLeft',
		value: function _getTopLeft() {
			var topLeft = new _point2.default(Infinity, Infinity);

			this.getBuilds().forEach(function (build) {
				if (build.x < topLeft.x) {
					topLeft.x = build.x;
				}

				if (build.y < topLeft.y) {
					topLeft.y = build.y;
				}
			});

			return topLeft;
		}

		/**
   * Get the point of rightmost bottom position among all builds.
   * @return {object} The point.
   */

	}, {
		key: '_getBottomRight',
		value: function _getBottomRight() {
			var bottomRight = new _point2.default(-Infinity, -Infinity);

			this.getBuilds().forEach(function (build) {
				if (build.right > bottomRight.x) {
					bottomRight.x = build.right;
				}

				if (build.bottom > bottomRight.y) {
					bottomRight.y = build.bottom;
				}
			});

			return bottomRight;
		}

		/**
   * Translate all builds.
   * @param {number} offsetX - Offset by x axis.
   * @param {number} offsetY - Offset by y axis.
   */

	}, {
		key: '_translateBuilds',
		value: function _translateBuilds(offsetX, offsetY) {
			this.getBuilds().forEach(function (build) {
				build.x += offsetX;
				build.y += offsetY;
			});
		}

		/**
   * Create map: generate array of arrays of tiles.
   */

	}, {
		key: '_createMap',
		value: function _createMap() {
			var _this3 = this;

			var bottomRight = this._getBottomRight();

			this._fillMap(bottomRight.x + 2, bottomRight.y + 2);
			this.getBuilds().forEach(function (build) {
				_this3._fillRectangle(build.x, build.y, build.width, build.height);
			});
		}

		/**
   * Fill map: generate matrix (array of arrays) with needed size.
   * @param {number} width - The width of matrix.
   * @param {number} height - The height of matrix.
   */

	}, {
		key: '_fillMap',
		value: function _fillMap(width, height) {
			// set default
			this._tiles = [];

			// this._tiles[y][x] === true (floor) || false (wall)
			for (var y = 0; y < height; y++) {
				this._tiles.push([]);
				for (var x = 0; x < width; x++) {
					this._tiles[y].push(false);
				}
			}
		}

		/**
   * Fill rectagle: fill rectangle area on map.
   * @param {number} startX - Left border position of rectangle.
   * @param {number} startY - Top border position of rectangle.
   * @param {number} width - Width of rectangle.
   * @param {number} height - Height of rectangle.
   */

	}, {
		key: '_fillRectangle',
		value: function _fillRectangle(startX, startY, width, height) {
			for (var y = startY; y <= startY + height - 1; y++) {
				for (var x = startX; x <= startX + width - 1; x++) {
					this._tiles[y][x] = true;
				}
			}
		}
	}]);

	return Dungeon;
}();

exports.default = Dungeon;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = __webpack_require__(0);

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a Exlorer (FOV calculation) class.
 */
var Explorer = function () {
	/**
  * Create a Explorer.
  * @param {Explorer~isTransparentCallback} isTransparentCallback - callback for identify tile.
  */
	function Explorer(isTransparentCallback) {
		_classCallCheck(this, Explorer);

		if (isTransparentCallback instanceof Function) {
			this._isTransparent = isTransparentCallback;
		} else {
			console.warn('Pathfinder: argument ' + isTransparentCallback + ' is not a Function');
			this._isTransparent = null;
		}
	}
	/**
  * @callback Explorer~isTransparentCallback
  * @param {number} The x position of tile.
  * @param {number} The y position of tile.
  * @return {boolean} Boolean: tile is transparent (true).
  */

	/**
  * Get line on a grid.
  * @param {object} p0 - Object of class Point, start position.
  * @param {object} p1 - Object of class Point, end position.
  */


	_createClass(Explorer, [{
		key: '_line',
		value: function _line(p0, p1) {
			var dx = p1.x - p0.x,
			    dy = p1.y - p0.y,
			    nx = Math.abs(dx),
			    ny = Math.abs(dy),
			    sx = dx > 0 ? 1 : -1,
			    sy = dy > 0 ? 1 : -1,
			    p = new _point2.default(p0.x, p0.y),
			    points = [new _point2.default(p.x, p.y)];

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

				points.push(new _point2.default(p.x, p.y));
			}

			return points;
		}

		/**
   * Calculate FOV.
   * @param {number} centerX - The x position of center.
   * @param {number} centerY - The y position of center.
   * @param {number} radius - radius of view.
   * @callback {Explorer~isExploredCallback} isExploredCallback - called if tile is explored.
   */

	}, {
		key: 'calculate',
		value: function calculate(centerX, centerY, radius, isExploredCallback) {
			if (!(this._isTransparent instanceof Function)) {
				return console.warn('Explorer.calculate: ' + this._isTransparent + ' is not a Function');
			}

			if (isNaN(centerX) || isNaN(centerY) || isNaN(radius)) {
				return console.warn('Explorer.calculate: arguments ' + (centerX, centerY, radius) + ' must be a Number');
			}

			if (!(isExploredCallback instanceof Function)) {
				return console.warn('Explorer.calculate: argument ' + isExploredCallback + ' is not a Function');
			}

			var squareRaduis = Math.pow(radius, 2),
			    center = new _point2.default(centerX, centerY),
			    minX = center.x - radius,
			    maxX = center.x + radius,
			    minY = center.y - radius,
			    maxY = center.y + radius;

			// check floors in radius
			for (var y = minY; y <= maxY; y++) {
				for (var x = minX; x <= maxX; x++) {
					if (y === minY || y === maxY || x === minX || x === maxX) {
						// check line of sight
						var line = this._line(center, new _point2.default(x, y));

						for (var i = 0; i < line.length; i++) {
							var tile = line[i],
							    squareDistance = Math.pow(center.x - tile.x, 2) + Math.pow(center.y - tile.y, 2);

							if (squareDistance <= squareRaduis) {
								if (!this._isTransparent(tile.x, tile.y)) {
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
		/**
   * @callback Explorer~isExploredCallback
   * @param {number} The x position of explored tile.
   * @param {number} The y position of explored tile.
   */

	}]);

	return Explorer;
}();

exports.default = Explorer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _node = __webpack_require__(5);

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pathfinder = function () {
	function Pathfinder(isWalkable) {
		_classCallCheck(this, Pathfinder);

		if (isWalkable instanceof Function) {
			this._isWalkable = isWalkable;
		} else {
			console.warn('Pathfinder.constructor: value ' + isWalkable + ' is not a Function');
			this._isWalkable = null;
		}
	}

	_createClass(Pathfinder, [{
		key: '_heuristic',
		value: function _heuristic(x1, y1, x2, y2) {
			// get manhattan distance
			var d1 = Math.abs(x2 - x1),
			    d2 = Math.abs(y2 - y1);

			return d1 + d2;
		}
	}, {
		key: '_findNode',
		value: function _findNode(array, node) {
			if (node instanceof _node2.default) {
				for (var i = 0; i < array.length; i++) {
					if (array[i].x === node.x && array[i].y === node.y) {
						return i;
					}
				}
			}

			return undefined;
		}

		// without diagonals

	}, {
		key: '_getNeighbors',
		value: function _getNeighbors(node) {
			var neighbors = [];

			for (var y = node.y - 1; y <= node.y + 1; y++) {
				for (var x = node.x - 1; x <= node.x + 1; x++) {
					if (x === node.x && y != node.y || x != node.x && y === node.y) {
						if (this._isWalkable(x, y)) {
							// push node with updated g and parent
							neighbors.push(new _node2.default({
								x: x,
								y: y,
								g: node.g + 1,
								parent: node
							}));
						}
					}
				}
			}

			return neighbors;
		}
	}, {
		key: 'search',
		value: function search(x1, y1, x2, y2) {
			if (!(this._isWalkable instanceof Function)) {
				return console.warn('Pathfinder.search: ' + this._isWalkable + ' is not a Function');
			}

			var start = new _node2.default({ x: x1, y: y1 }),
			    end = new _node2.default({ x: x2, y: y2 }),
			    openList = [start],
			    // unvisited nodes
			closedList = []; // visited nodes

			// main loop
			while (openList.length > 0) {
				// search in open list node with lowest value f (g + h)
				var currentNodeIndex = 0,
				    currentNode = openList[0];

				openList.forEach(function (item, i) {
					if (item.f < currentNode.f) {
						currentNode = item;
						currentNodeIndex = i;
					}
				});

				// add found node to closed list, delete it from open list
				openList.splice(currentNodeIndex, 1);
				closedList.push(currentNode);

				// if current node is target, then return path
				if (currentNode.x === end.x && currentNode.y === end.y) {
					var current = currentNode,
					    path = [];

					while (current.parent) {
						path.push(current);
						current = current.parent;
					}

					return path.reverse();
				}

				var neighbors = this._getNeighbors(currentNode);

				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = neighbors[i];

					// ignore neighbor if he in closed list
					if (this._findNode(closedList, neighbor)) {
						continue;
					}

					// if neighbor not in open list, add him to open list, update h
					if (!this._findNode(openList, neighbor)) {
						neighbor.h = this._heuristic(neighbor.x, neighbor.y, end.x, end.y);
						openList.push(neighbor);
					}
				}
			}

			// return empty array if path is not finded
			return [];
		}
	}]);

	return Pathfinder;
}();

exports.default = Pathfinder;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = __webpack_require__(0);

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = function (_Point) {
	_inherits(Node, _Point);

	function Node() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Node);

		var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, options.x, options.y));

		_this._g = isNaN(options.g) ? 0 : options.g;
		_this._h = isNaN(options.h) ? 0 : options.h;
		_this._parent = options.parent instanceof Node ? options.parent : null;
		return _this;
	}

	_createClass(Node, [{
		key: 'g',
		get: function get() {
			return this._g;
		},
		set: function set(value) {
			if (isNaN(value)) {
				return;
			} else {
				this._g = value;
			}
		}
	}, {
		key: 'h',
		get: function get() {
			return this._h;
		},
		set: function set(value) {
			if (isNaN(value)) {
				return;
			} else {
				this._h = value;
			}
		}
	}, {
		key: 'parent',
		get: function get() {
			return this._parent;
		},
		set: function set(value) {
			if (value instanceof Node) {
				this._parent = value;
			} else {
				return;
			}
		}
	}, {
		key: 'f',
		get: function get() {
			return this.g + this.h;
		}
	}]);

	return Node;
}(_point2.default);

exports.default = Node;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = __webpack_require__(0);

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a Rectangle
 * @extends Point
 */
var Rectangle = function (_Point) {
	_inherits(Rectangle, _Point);

	/**
  * Create a Rectangle.
  * @param {number} x - Left border position of rectangle.
  * @param {number} y - Top border position of rectangle.
  * @param {number} width - Width of rectangle.
  * @param {number} height - Height of rectangle.
  */
	function Rectangle(x, y, width, height) {
		_classCallCheck(this, Rectangle);

		var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, x, y));

		_this._width = isNaN(width) ? 1 : width;
		_this._height = isNaN(height) ? 1 : height;
		return _this;
	}

	/**
  * Get width of Rectangle.
  * @return {number} The width of Rectangle.
  */


	_createClass(Rectangle, [{
		key: 'collides',


		/**
   * Check collides with other Rectangle.
   * @param {object} rectangle - Object of class Rectangle.
   * @return {boolean} The boolean.
   */
		value: function collides(rectangle) {
			if (rectangle.left > this.left + this.width || rectangle.left + rectangle.width < this.left || rectangle.top > this.top + this.height || rectangle.top + rectangle.height < this.top) {
				return false;
			}

			return true;
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}

		/**
   * Set width of Rectangle.
   * @param {number} The Width of Rectangle.
   */
		,
		set: function set(value) {
			if (isNaN(value)) {
				return;
			}
			this._width = value;
		}

		/**
   * Get height of Rectangle.
   * @return {number} The height of Rectangle.
   */

	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}

		/**
   * Set height of Rectangle.
   * @param {number} The height of Rectangle.
   */
		,
		set: function set(value) {
			if (isNaN(value)) {
				return;
			}
			this._height = value;
		}

		/**
   * Get top of Rectangle.
   * @return {number} The top border of Rectangle.
   */

	}, {
		key: 'top',
		get: function get() {
			return this._y;
		}

		/**
   * Get right of Rectangle.
   * @return {number} The right border of Rectangle.
   */

	}, {
		key: 'right',
		get: function get() {
			return this._x + this._width - 1;
		}

		/**
   * Get bottom of Rectangle.
   * @return {number} The bottom border of Rectangle.
   */

	}, {
		key: 'bottom',
		get: function get() {
			return this._y + this._height - 1;
		}

		/**
   * Get left of Rectangle.
   * @return {number} The left border of Rectangle.
   */

	}, {
		key: 'left',
		get: function get() {
			return this._x;
		}

		/**
   * Get center of Rectangle.
   * @return {Point} Point with coordinates to center of Rectangle.
   */

	}, {
		key: 'center',
		get: function get() {
			return new _point2.default(this.x + this.width / 2, this.y + this.height / 2);
		}
	}]);

	return Rectangle;
}(_point2.default);

exports.default = Rectangle;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dungeon = __webpack_require__(2);

var _dungeon2 = _interopRequireDefault(_dungeon);

var _pathfinder = __webpack_require__(4);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

var _explorer = __webpack_require__(3);

var _explorer2 = _interopRequireDefault(_explorer);

var _prng = __webpack_require__(1);

var _prng2 = _interopRequireDefault(_prng);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** 
 * Represents a toolkit for development roguelike games.
 */
var Roguelike = function () {
	/**
  * Create a Roguelike toolkit.
  */
	function Roguelike() {
		_classCallCheck(this, Roguelike);

		this._Dungeon = _dungeon2.default;
		this._Explorer = _explorer2.default;
		this._Pathfinder = _pathfinder2.default;
		this._PRNG = _prng2.default;
	}

	/**
  * Get Dungeon class
  * @return {class} Dungeon class.
  */


	_createClass(Roguelike, [{
		key: 'Dungeon',
		get: function get() {
			return this._Dungeon;
		}

		/**
   * Get Explorer class.
   * @return {class} Explorer class.
   */

	}, {
		key: 'Explorer',
		get: function get() {
			return this._Explorer;
		}

		/** 
   * Get Pathfinder class.
   * @return {class} Pathfinder class.
   */

	}, {
		key: 'Pathfinder',
		get: function get() {
			return this._Pathfinder;
		}

		/** 
   * Get PRNG class.
   * @return {class} PRNG class.
   */

	}, {
		key: 'PRNG',
		get: function get() {
			return this._PRNG;
		}
	}]);

	return Roguelike;
}();

module.exports = new Roguelike();

/***/ })
/******/ ]);
});