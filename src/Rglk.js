import Dungeon from './Dungeon';
import Pathfinder from './Pathfinder';
import Explorer from './Explorer';
import PRNG from './PRNG';

/**
 * Represents a toolkit for development roguelike games.
 */
export default class Rglk {
	/**
	 * Create a rglk toolkit.
	 */
	constructor () {
		Object.assign(this, {
			Dungeon,
			Explorer,
			Pathfinder,
			PRNG,
		});
	}
}
