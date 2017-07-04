import Dungeon from './dungeon';
import Pathfinder from './pathfinder';
import Explorer from './explorer';
import PRNG from './prng';

/** 
 * Represents a toolkit for development roguelike games.
 */
class Roguelike {
	/**
	 * Create a Roguelike toolkit.
	 */
	constructor() {
		this._Dungeon = Dungeon;
		this._Explorer = Explorer;
		this._Pathfinder = Pathfinder;
		this._PRNG = PRNG;
	}

	/**
	 * Get Dungeon class
	 * @return {class} Dungeon class.
	 */
	get Dungeon() {
		return this._Dungeon;
	}

	/**
	 * Get Explorer class.
	 * @return {class} Explorer class.
	 */
	get Explorer() {
		return this._Explorer;
	}

	/** 
	 * Get Pathfinder class.
	 * @return {class} Pathfinder class.
	 */
	get Pathfinder() {
		return this._Pathfinder;
	}

	/** 
	 * Get PRNG class.
	 * @return {class} PRNG class.
	 */
	get PRNG() {
		return this._PRNG;
	}
}

module.exports = new Roguelike();