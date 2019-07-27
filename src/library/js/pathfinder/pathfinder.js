import Node from './node.js';
import { isFunction } from '../utils.js';

/**
 * Returns a 2d pathfinder function.
 * @return {function(number, number, number, number): Array} List of path points.
 */
export const createPathfinder = (isOpen, options = {}) => {
	if (!isFunction(isOpen)) {
		throw new TypeError('First argument "isOpen" must be a function');
	}

	const { getHeuristic = getManhattanDistance } = options || {};
	const getNeighbors = createNeighborsFinder(isOpen);

	/**
	 * Search path between two points.
	 * @param {number} x1 First point x.
	 * @param {number} y1 First point y.
	 * @param {number} x2 Second point x.
	 * @param {number} y2 Second point y.
	 * @return {Array} List of path points.
	 */
	return (x1, y1, x2, y2) => {
		const visitedNodes = [];
		const unvisitedNodes = [];
		const end = new Node({
			x: x2,
			y: y2,
		});
		let start = new Node({
			x: x1,
			y: y1,
		});
		let resultPath = [];
		unvisitedNodes.push(start);

		// main loop
		while (unvisitedNodes.length > 0) {
			// search in open list node with lowest value f = g + h
			let currentNodeIndex = 0;
			let currentNode = unvisitedNodes[0];

			unvisitedNodes.forEach((node, index) => {
				if (node.f < currentNode.f) {
					currentNode = node;
					currentNodeIndex = index;
				}
			});

			// add found node to closed list, delete it from open list
			unvisitedNodes.splice(currentNodeIndex, 1);
			visitedNodes.push(currentNode);

			// if current node is target then create path and break
			if (currentNode.isEqualTo(end)) {
				resultPath = currentNode.createPathToRoot();
				break;
			}

			let neighbors = getNeighbors(currentNode, isOpen); // @TODO check length before run cycle

			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];

				// ignore neighbor node if it is already visited
				if (visitedNodes.some(node => node.isEqualTo(neighbor))) {
					continue;
				}

				// if neighbor not in open list, add him to open list, update h
				if (!unvisitedNodes.some(node => node.isEqualTo(neighbor))) {
					neighbor.h = getHeuristic(neighbor.x, neighbor.y, end.x, end.y);
					unvisitedNodes.push(neighbor);
				}
			}
		}

		return resultPath;
	};
};

/**
 * Returns heuristic value (Manhattan distance) between two positions.
 * @param {number} x1 First position x.
 * @param {number} y1 First position y.
 * @param {number} x2 Second position x.
 * @param {number} y2 Second position y.
 * @return {number} heuristic value.
 */
export const getManhattanDistance = (x1, y1, x2, y2) => {
	const horizontal = Math.abs(x2 - x1);
	const vertical = Math.abs(y2 - y1);

	return horizontal + vertical;
};

/**
 * Returns list of node neighbors.
 * @param {Node} node Node to get a neighbors.
 * @return {Array} List of neighbors.
 * @TODO move to Node class?
 */
const createNeighborsFinder = (isOpen, withHorizontal = false) => node => {
	let neighbors = [];

	for (let y = -1; y <= 1; y++) {
		for (let x = -1; x <= 1; x++) {
			// if is not diagonal neighbor
			if (Math.abs(x + y) === 1) {
				if (isOpen(node.x + x, node.y + y)) {
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
