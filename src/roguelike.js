import Helper from './helper';
import Dungeon from './dungeon';
import Pathfinder from './pathfinder';
import Explorer from './explorer';
import PRNG from './prng';

/** 
 * Main class. 
 * Use this as window.rglk.
 */
class Roguelike {
	constructor() {
		this._utils = new Helper();
		this._Dungeon = Dungeon;
		this._Explorer = Explorer;
		this._Pathfinder = Pathfinder;
		this._PRNG = PRNG;
	}

	/**
	* get utils (Object of class Helper).
	* @return {Object}
	*/
	get utils() {
		return this._utils;
	}

	/**
	* @return {function} Dungeon class constructor
	*/
	get Dungeon() {
		return this._Dungeon;
	}

	/**
	* @return {function} Explorer class constructor
	*/
	get Explorer() {
		return this._Explorer;
	}

	/** 
	* @return {function} Pathfinder class constructor
	*/
	get Pathfinder() {
		return this._Pathfinder;
	}

	/** 
	* @return {function} PRNG class constructor
	*/
	get PRNG() {
		return this._PRNG;
	}
}

module.exports = new Roguelike();