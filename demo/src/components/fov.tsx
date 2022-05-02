import { MouseEvent, useEffect, useRef, useState } from 'react';
import { createExplorer } from '../../../src';
import { Canvas, CanvasData } from './canvas';
import { Section } from './section';
import { calculateFitFactor } from './utils';

export function SectionFOV() {
  const [mousePosition, setState] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewRef = useRef<CanvasData>(null);

  useEffect(() => {
    if (viewRef.current) {
      const { canvas, context } = viewRef.current;

      const fovRadius = 24;
      const map = createMap();
      const explore = createExplorer((x, y) => map.tiles[x]?.[y] === 0);

      // draw
      const tileSize = calculateFitFactor(map, canvas);
      const center = {
        x: Math.floor(mousePosition.x / tileSize),
        y: Math.floor(mousePosition.y / tileSize),
      };

      context.fillStyle = '#252033';
      context.fillRect(0, 0, canvas.width, canvas.height);

      for (const visibleTile of explore(center.x, center.y, fovRadius)) {
        const distance = Math.sqrt(
          (center.x - visibleTile.x) ** 2 + (center.y - visibleTile.y) ** 2,
        );

        context.fillStyle = `rgba(255, 210, 150, ${1 - distance / fovRadius})`;
        context.globalAlpha = 0.7;
        context.fillRect(visibleTile.x * tileSize, visibleTile.y * tileSize, tileSize, tileSize);
        context.globalAlpha = 1;
      }
    }
  }, [mousePosition]);

  return (
    <Section title="Field of view">
      <Canvas ref={viewRef} onMouseMove={e => setState(getMousePosition(e))} />
    </Section>
  );
}

function getMousePosition(event: MouseEvent<HTMLCanvasElement>) {
  const mousePosition = { x: 0, y: 0 };

  if (event.target instanceof HTMLCanvasElement) {
    const rect = event.target.getBoundingClientRect();

    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
  }

  return mousePosition;
}

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
        if (tiles[x]) {
          tiles[x][y] = 1;
        }
      }
    }
  }

  return { tiles, width, height };
}
