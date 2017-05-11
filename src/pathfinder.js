import Point2 from './point2';
import Node2 from './node2';
import Helper from './helper';

class Pathfinder {
	constructor(isWalkable) {
		if (!new Helper().isFunction(isWalkable)) {
			console.warn(`Pathfinder: value ${isWalkable} is not a Function`);
			this._isWalkable = () => {return null;};
			return;
		}

		this._isWalkable = isWalkable;
	}

	_heuristic(x1, y1, x2, y2) {
		var d1 = Math.abs(x2 - x1),
			d2 = Math.abs(y2 - y1);

		return d1 + d2;
	}

	_findNode(array, node) {
		if (node instanceof Node2) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].x === node.x && array[i].y === node.y) {
					return i;
				}
			}
		}

		return undefined;
	}

	_getNeighbors(node) {
		var neighbors = [];

		for (var y = node.y - 1; y <= node.y + 1; y++) {
			for (var x = node.x - 1; x <= node.x + 1; x++) {
				if (x === node.x && y != node.y || x != node.x && y === node.y) {
					if (this._isWalkable(x, y)) {
						neighbors.push(new Node2({
							x: x, 
							y: y,
							parent: node
						}));
					}
				}
			}
		}

		return neighbors;
	}

	search(x1, y1, x2, y2) {
		var start = new Node2({x: x1, y: y1}),
			end = new Node2({x: x2, y: y2}),
			openList   = [start], // unvisited nodes
			closedList = []; // visited nodes

		while (openList.length > 0) {
			/* search in open list node with lowest value f (g + h) */
			var currentNodeIndex = 0,
				currentNode = openList[0];

			openList.forEach(function(item, i) {
				if (item.f < currentNode.f) {
					currentNode = item;
					currentNodeIndex = i;
				}
			});

			/* if current node is target, then return path */
			if (currentNode.x === end.x && currentNode.y === end.y) {
				var current = currentNode,
					path = [];

				while(current.parent) {
					path.push(current);
					current = current.parent;
				}

				return path.reverse();
			}

			/* add found node to closed list, delete it from open list */
			openList.splice(currentNodeIndex, 1);
			closedList.push(currentNode);

			var neighbors = this._getNeighbors(currentNode);

			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i],
					gScore = currentNode.g + 1,
					gScoreIsBest = false;
				
				/* ignore neighbor if he in closed list */
				if (this._findNode(closedList, neighbor)) {
					continue;
				}

				/* if neighbor not in open list, add him to open list, calculate f, g, h */
				if (!this._findNode(openList, neighbor)) {
					gScoreIsBest = true;
					neighbor.h = this._heuristic(neighbor.x, neighbor.y, end.x, end.y);
					openList.push(neighbor);
				} else if (gScore < neighbor.g) {
					gScoreIsBest = true;
				}

				if (gScoreIsBest) {
					neighbor.parent = currentNode;
					neighbor.g = gScore;
				}
			}
		}

		/* return empty array if path is not finded */
		return [];
	}
}

export default Pathfinder;