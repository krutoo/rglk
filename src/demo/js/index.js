import * as rglk from '../../library/js/index.js';

initSection('.js-section-dungeon', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 12,
		roomMinSize: 3,
		roomMaxSize: 8,
		corridorMinLength: 1,
		corridorMaxLength: 4,
		corridorComplexity: 3,
	});
	draw(canvas, {
		dungeon,
		needRoomsNumbers: true,
	});
});

initSection('.js-section-labyrinth', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 64,
		roomMinSize: 1,
		roomMaxSize: 1,
		corridorMinLength: 1,
		corridorMaxLength: 1,
		corridorComplexity: 1,
	});
	draw(canvas, {
		dungeon,
		corridorColor: '#c8d6e5',
	});
});

let mousePosition = { x: 0, y: 0 };

initSection('.js-section-explorer', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 3,
		roomMinSize: 6,
		roomMaxSize: 12,
		corridorMinLength: 2,
		corridorMaxLength: 3,
		corridorComplexity: 1,
	});
	const explorer = new rglk.Explorer((x, y) => dungeon.isFloor(x, y));
	const tileSize = calculateTileSize(dungeon, canvas);
	const fov = explorer.calculate(
			parseInt(dungeon.rooms[0].center.x, 10),
			parseInt(dungeon.rooms[0].center.y, 10),
			12,
		);
	canvas.onmousemove = event => {
		mousePosition = getMousePosition(event);
		const inDungeonPosition = {
				x: Math.round(mousePosition.x / tileSize),
				y: Math.round(mousePosition.y / tileSize),
			},
			newFov = explorer.calculate(
				inDungeonPosition.x,
				inDungeonPosition.y,
				12,
			);
		if (dungeon.isFloor(inDungeonPosition.x, inDungeonPosition.y)) {
			draw(canvas, {
				fov: newFov,
				dungeon,
				radius: 12,
				roomColor: '#000',
				corridorColor: '#000',
				center: inDungeonPosition,
			});
		}
	};
	draw(canvas, {
		fov,
		dungeon,
		radius: 12,
		roomColor: '#000',
		corridorColor: '#000',
		center: dungeon.rooms[0].center,
	});
});

initSection('.js-section-pathfinder', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 16,
		roomMinSize: 4,
		roomMaxSize: 12,
		corridorMinLength: 1,
		corridorMaxLength: 4,
		corridorComplexity: 2,
	});
	const findPath = rglk.createPathfinder((x, y) => dungeon.isFloor(x, y));
	const path = findPath(
		parseInt(dungeon.rooms[0].center.x, 10),
		parseInt(dungeon.rooms[0].center.y, 10),
		parseInt(dungeon.rooms[dungeon.rooms.length - 1].center.x, 10),
		parseInt(dungeon.rooms[dungeon.rooms.length - 1].center.y, 10),
	);
	draw(canvas, {
		path,
		dungeon,
		roomColor: '#576574',
		corridorColor: '#576574',
	});
});

function initSection (sectionSelector, render) {
	const section = document.querySelector(sectionSelector);
	if (section) {
		const canvas = section.querySelector('canvas'),
			button = section.querySelector('.js-reload-button')
		if (canvas) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.width / 16 * 9;
			render(canvas);
		}
		if (button) {
			button.addEventListener('click', () => render(canvas));
		}
	}
}

function draw (canvas, data) {
	data = data || {};
	const context = canvas.getContext('2d'), {
		fov,
		path,
		dungeon,
	} = data;
	data.tileSize = calculateTileSize(dungeon, canvas);
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (dungeon) {
		drawMap(context, data);
		if (fov) {
			drawFOV(context, data);
		}
		if (path) {
			drawPath(context, data);
		}
	}
}

function drawMap (context, data) {
	data = data || {};
	const {
		dungeon,
		roomColor = '#c8d6e5',
		corridorColor = '#8395a7',
		tileSize,
	} = data;

	// draw rooms
	dungeon.rooms.forEach((room, index) => {
		context.fillStyle = roomColor;
		context.fillRect(
			room.x * tileSize,
			room.y * tileSize,
			room.width * tileSize,
			room.height * tileSize,
		);
	});

	// draw corridors
	dungeon.corridors.concat(dungeon.connectors).forEach(corridor => {
		context.fillStyle = corridorColor;
		context.fillRect(
		corridor.x * tileSize,
		corridor.y * tileSize,
		corridor.width * tileSize,
		corridor.height * tileSize,
		);
	});
}

function drawFOV (context, data) {
	const {
		fov,
		center,
		radius,
		dungeon,
		tileSize,
	} = data;
	fov.forEach(tile => {
		const distance = Math.sqrt((center.x - tile.x) ** 2 + (center.y - tile.y) ** 2);
		const proportion = 1 - (distance / radius);
		context.fillStyle = `rgba(255,210,150,${proportion})`;
		context.globalAlpha = 0.7;
		context.fillRect(
			tile.x * tileSize,
			tile.y * tileSize,
			tileSize,
			tileSize,
		);
		context.globalAlpha = 1;
	});
}

function drawPath (context, data) {
	const {
		path,
		dungeon,
		tileSize,
	} = data;
	context.strokeStyle = '#1dd1a1';
	context.fillStyle = '#1dd1a1';
	context.lineWidth = Math.ceil(tileSize / 3);
	if (path.length) {
		context.beginPath();
		context.moveTo(
			path[0].x * tileSize + (tileSize / 2),
			path[0].y * tileSize + (tileSize / 2)
		);
		path.forEach((point, index) => {
			if (index === 0 || index === path.length - 1) {
				context.fillRect(
					point.x * tileSize,
					point.y * tileSize,
					tileSize,
					tileSize,
				)
			}
			context.lineTo(
				point.x * tileSize + (tileSize / 2),
				point.y * tileSize + (tileSize / 2)
			);
		});
		context.stroke();
		context.closePath();
	}
}

function calculateTileSize (dungeon, canvas) {
	const canvasMinSide = Math.min(canvas.width, canvas.height),
		dungeonMaxSide = Math.max(dungeon.width, dungeon.height);
	return Math.floor(canvasMinSide / dungeonMaxSide) || 8;
}

function getMousePosition (event) {
	const mousePosition = {
		x: 0,
		y: 0,
	};
	if (event instanceof Event) {
		const rect = event.target.getBoundingClientRect();
		mousePosition.x = event.clientX - rect.left;
		mousePosition.y = event.clientY - rect.top;
	}
	return mousePosition;
}
