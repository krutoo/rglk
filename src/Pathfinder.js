import Node from './Node';

/**
 * Represents a Pathfinder class.
 */
export default class Pathfinder {
	/**
	 * Create a Pathfinder.
	 * @param {Function} isOpen Callback, defines that point is open.
	 */
	constructor(isOpen) {
		if (isOpen instanceof Function) {
			this._isOpen = isOpen;
		} else {
			throw new TypeError('Pathfinder.constructor: first argument must be a function');
		}
	}

	/**
	 * Search path between two points.
	 * @param {number} x1 First point x.
	 * @param {number} y1 First point y.
	 * @param {number} x2 Second point x.
	 * @param {number} y2 Second point y.
	 * @return {Array} List of path points.
	 */
	search(x1, y1, x2, y2) {
		let start = new Node({
				x: x1,
				y: y1,
			}),
			end = new Node({
				x: x2,
				y: y2,
			}),
			unvisitedNodes = [start],
			visitedNodes = [],
			resultPath = [];

		// main loop
		while (unvisitedNodes.length) {
			// search in open list node with lowest value f = g + h
			let currentNodeIndex = 0,
				currentNode = unvisitedNodes[0];
			unvisitedNodes.forEach((item, i) => {
				if (item.f < currentNode.f) {
					currentNode = item;
					currentNodeIndex = i;
				}
			});

			// add found node to closed list, delete it from open list
			unvisitedNodes.splice(currentNodeIndex, 1);
			visitedNodes.push(currentNode);

			// if current node is target then create path and break
			if (currentNode.isEqualTo(end)) {
				resultPath = currentNode.getPathToRoot();
				break;
			}

			let neighbors = this._getNeighbors(currentNode); // @TODO check length before run cycle
			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];

				// ignore neighbor if he in closed list
				if (visitedNodes.find(node => node.isEqualTo(neighbor))) {
					continue;
				}

				// if neighbor not in open list, add him to open list, update h
				if (!unvisitedNodes.find(node => node.isEqualTo(neighbor))) {
					neighbor.h = this._getHeuristic(neighbor.x, neighbor.y, end.x, end.y);
					unvisitedNodes.push(neighbor);
				}
			}
		}
		return resultPath;
	}

	/**
	 * Returns heuristic value (Manhattan distance) between two nodes.
	 * @param  {number} x1 First node x.
	 * @param  {number} y1 First node y.
	 * @param  {number} x2 Second node x.
	 * @param  {number} y2 Second node y.
	 * @return {number} heuristic value.
	 */
	_getHeuristic (x1, y1, x2, y2) {
		const d1 = Math.abs(x2 - x1),
			d2 = Math.abs(y2 - y1);
		return d1 + d2;
	}

	/**
	 * Returns list of node neighbors.
	 * @param  {Node} node Node to get a neighbors.
	 * @return {Array} List of neighbors.
	 * @TODO move to Node class?
	 */
	_getNeighbors (node) {
		let neighbors = [];
		for (let y = -1; y <= 1; y++) {
			for (let x = -1; x <= 1; x++) {
				// if is not diagonal neighbor
				if (Math.abs(x + y) === 1) {
					if (this._isOpen(node.x + x, node.y + y)) {
						neighbors.push(new Node({
							x: node.x + x,
							y: node.y + y,
							g: node.g + 1,
							parent: node,
						}));
					}
				}
			}
		}
		return neighbors;
	}
}
