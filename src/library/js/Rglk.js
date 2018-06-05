import PRNG from './PRNG';
import Dungeon from './Dungeon';
import Explorer from './Explorer';
import Pathfinder from './Pathfinder';

/**
 * Represents a toolkit for development roguelike games.
 */
export default class Rglk {
	/**
	 * Create a roguelike toolkit.
	 */
	constructor () {
		Object.assign(this, {
			PRNG,
			Dungeon,
			Explorer,
			Pathfinder,
		});
	}
}
