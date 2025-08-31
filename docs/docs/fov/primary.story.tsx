import { createExplorer } from 'rglk';
import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { Canvas, type DrawPayload } from '#components/canvas';
import { getMousePos, calculateFitFactor } from '#utils';
import type { Point2d } from '@krutoo/utils';

export const meta = {
  category: 'Field of view (FOV)',
  title: 'Demo',
};

function createMap() {
  const tiles: number[][] = [];
  const width = 60;
  const height = 33;

  // init map area
  for (let x = 0; x < width; x++) {
    const column: number[] = [];

    for (let y = 0; y < height; y++) {
      column[y] = 0;
    }

    tiles[x] = column;
  }

  // prepare some squares
  const rectangles: Array<{ x: number; y: number; w: number; h: number }> = [
    { x: 10, y: 10, w: 10, h: 1 },
    { x: 50, y: 10, w: 1, h: 10 },
    { x: 25, y: 16, w: 5, h: 5 },
  ];

  // add squares on map
  for (const rect of rectangles) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      for (let y = rect.y; y < rect.y + rect.h; y++) {
        tiles[x]![y] = 1;
      }
    }
  }

  return {
    tiles,
    width,
    height,
    isWalkable(x: number, y: number) {
      return tiles[x]?.[y] !== 1;
    },
  };
}

export default function Example() {
  const [mouse, setMouse] = useState<Point2d>(() => ({ x: 0, y: 0 }));
  const fovRadius = 24;
  const map = useMemo(createMap, []);
  const explore = useMemo(() => createExplorer(map.isWalkable), [map]);

  const draw = useCallback(
    ({ canvas, context }: DrawPayload) => {
      const tileSize = calculateFitFactor(map, canvas);
      const center = {
        x: Math.floor(mouse.x / tileSize),
        y: Math.floor(mouse.y / tileSize),
      };

      context.fillStyle = '#23212b';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 0.7;

      for (const tile of explore(center.x, center.y, fovRadius)) {
        const distance = Math.sqrt((center.x - tile.x) ** 2 + (center.y - tile.y) ** 2);
        context.fillStyle = `rgba(255, 255, 255, ${1 - distance / fovRadius})`;

        context.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
      }
    },
    [mouse],
  );

  const handleMouseMove = (event: MouseEvent) => {
    setMouse(getMousePos(event));
  };

  return <Canvas fullscreen draw={draw} onMouseMove={handleMouseMove} />;
}
