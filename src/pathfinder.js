import Node from './node';

export default class Pathfinder {
	constructor(isWalkable) {
		if (isWalkable instanceof Function) {
			this._isWalkable = isWalkable;
		} else {
			console.warn(`Pathfinder.constructor: value ${isWalkable} is not a Function`);
			this._isWalkable = null;
		}
	}

	_heuristic (x1, y1, x2, y2) {
		// get manhattan distance
		const d1 = Math.abs(x2 - x1),
			d2 = Math.abs(y2 - y1);
		return d1 + d2;
	}

	_findNode (array, node) {
		if (node instanceof Node) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].x === node.x && array[i].y === node.y) {
					return i;
				}
			}
		}

		return undefined;
	}

	// without diagonals
	_getNeighbors (node) {
		var neighbors = [];
		for (var y = node.y - 1; y <= node.y + 1; y++) {
			for (var x = node.x - 1; x <= node.x + 1; x++) {
				if (x === node.x && y != node.y || x != node.x && y === node.y) {
					if (this._isWalkable(x, y)) {
						// push node with updated g and parent
						neighbors.push(new Node({
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

	search(x1, y1, x2, y2) {
		if (!(this._isWalkable instanceof Function)) {
			return console.warn(`Pathfinder.search: ${this._isWalkable} is not a Function`);
		}

		var start = new Node({x: x1, y: y1}),
			end = new Node({x: x2, y: y2}),
			openList   = [start], // unvisited nodes
			closedList = []; // visited nodes

		// main loop
		while (openList.length > 0) {
			// search in open list node with lowest value f = g + h
			var currentNodeIndex = 0,
				currentNode = openList[0];

			openList.forEach(function(item, i) {
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

				while(current.parent) {
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
}
