import Helper from './helper';
import Dungeon from './dungeon';
import Pathfinder from './pathfinder';
import Explorer from './explorer';

class Roguelike {
	constructor() {
		this._utils = new Helper();
		this._Dungeon = Dungeon;
		this._Explorer = Explorer;
		this._Pathfinder = Pathfinder;
	}

	get utils() {
		return this._utils;
	}

	get Dungeon() {
		return this._Dungeon;
	}

	get Explorer() {
		return this._Explorer;
	}

	get Pathfinder() {
		return this._Pathfinder;
	}
}

module.exports = new Roguelike();