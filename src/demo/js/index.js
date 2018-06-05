import rglk from 'rglk';

initSection('.js-section-dungeon', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 24,
		roomMinSize: 3,
		roomMaxSize: 10,
		corridorMinLength: 1,
		corridorMaxLength: Math.random() * 10,
		seed: Math.random(),
	});
	draw(canvas, {
		dungeon,
		roomColor: '#445',
		corridorColor: '#223',
		needRoomsNumbers: true,
	});
});

initSection('.js-section-labyrinth', canvas => {
	const dungeon = new rglk.Dungeon({
		roomsAmount: 128,
		roomMinSize: 1,
		roomMaxSize: 1,
		corridorMinLength: 1,
		corridorMaxLength: 1,
		seed: Math.random(),
	});
	draw(canvas, {
		dungeon,
		roomColor: '#445',
		corridorColor: '#445',
	});
});

initSection('.js-section-explorer', canvas => {
	const dungeon = new rglk.Dungeon({
			roomsAmount: 6,
			roomMinSize: 3,
			roomMaxSize: 12,
			corridorMinLength: 1,
			corridorMaxLength: 1,
			seed: Math.random(),
		}),
		explorer = new rglk.Explorer((x, y) => !dungeon.isWall(x, y)),
		fov = [];
	explorer.calculate(
		parseInt(dungeon.rooms[0].center.x, 10),
		parseInt(dungeon.rooms[0].center.y, 10),
		16,
		(x, y) => fov.push({x: x, y: y}),
	);
	draw(canvas, {
		fov,
		dungeon,
		radius: 16,
		center: dungeon.rooms[0].center,
	});
});

initSection('.js-section-pathfinder', canvas => {
	const dungeon = new rglk.Dungeon({
			roomsAmount: 24,
			roomMinSize: 4,
			roomMaxSize: 12,
			corridorMinLength: 1,
			corridorMaxLength: 5,
			seed: Math.random(),
		}),
		pathfinder = new rglk.Pathfinder((x, y) => dungeon.isFloor(x, y));
	const path = pathfinder.search(
		parseInt(dungeon.rooms[0].center.x, 10),
		parseInt(dungeon.rooms[0].center.y, 10),
		parseInt(dungeon.rooms[dungeon.rooms.length - 1].center.x, 10),
		parseInt(dungeon.rooms[dungeon.rooms.length - 1].center.y, 10),
	);
	draw(canvas, {
		path,
		dungeon,
	});
});

function initSection (sectionSelector, render) {
	const section = document.querySelector(sectionSelector);
	if (section) {
		const canvas = section.querySelector('canvas'),
			button = section.querySelector('.js-reload-button')
		if (canvas) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.width / 4 * 3;
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
		roomColor = '#445',
		corridorColor = '#223',
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
		if (data.needRoomsNumbers) {
			context.fillStyle = 'rgba(255,255,255,.5)';
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.font = `${tileSize}px Arial`;
			context.fillText(
				index,
				room.center.x * tileSize,
				room.center.y * tileSize,
			);
		}
	});

	// draw corridors
	dungeon.corridors.forEach(corridor => {
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
		const distance = center.distanceTo(tile),
			proportion = 1 - (distance / radius);
		context.fillStyle = `rgba(255,210,150,${proportion})`;
		context.globalAlpha = 0.1;
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
	context.strokeStyle = '#0e0';
	context.lineWidth = Math.ceil(tileSize / 3);
	if (path.length) {
		context.beginPath();
		context.moveTo(
			path[0].x * tileSize + (tileSize / 2),
			path[0].y * tileSize + (tileSize / 2)
		);
		path.forEach(point => {
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
