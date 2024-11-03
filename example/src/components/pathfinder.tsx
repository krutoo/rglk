import { useEffect, useRef, useState } from 'react';
import { createPathfinder, Dungeon } from '../../../src';
import { calculateFitFactor } from './utils';
import { Canvas, CanvasData } from './canvas';
import { Section } from './section';

export function SectionPathfinder() {
  const [version, setVersion] = useState(0);
  const viewRef = useRef<CanvasData>(null);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    const { canvas, context } = viewRef.current;

    const dungeon = new Dungeon({
      roomsAmount: 16,
      roomMinSize: 4,
      roomMaxSize: 12,
      corridorMinLength: 1,
      corridorMaxLength: 4,
      corridorComplexity: 2,
    });

    const findPath = createPathfinder((x, y) => dungeon.isFloor(x, y));

    const tileSize = calculateFitFactor(dungeon, canvas);

    dungeon.forEachTile((x, y, isFloor) => {
      if (isFloor) {
        context.fillStyle = '#423a59';
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    });

    context.strokeStyle = '#f00';
    context.fillStyle = '#f00';
    context.lineWidth = Math.ceil(tileSize / 3);

    // draw path
    const path = findPath(
      Math.floor(dungeon.rooms[0].center.x),
      Math.floor(dungeon.rooms[0].center.y),
      Math.floor(dungeon.rooms[dungeon.rooms.length - 1].center.x),
      Math.floor(dungeon.rooms[dungeon.rooms.length - 1].center.y),
    );

    if (path.length) {
      context.beginPath();
      context.moveTo(path[0].x * tileSize + tileSize / 2, path[0].y * tileSize + tileSize / 2);
      path.forEach((point, index) => {
        if (index === 0 || index === path.length - 1) {
          context.fillRect(point.x * tileSize, point.y * tileSize, tileSize, tileSize);
        }
        context.lineTo(point.x * tileSize + tileSize / 2, point.y * tileSize + tileSize / 2);
      });
      context.stroke();
      context.closePath();
    }
  }, [version]);

  return (
    <Section title='Path finding'>
      <Canvas ref={viewRef} onReload={() => setVersion(v => v + 1)} />
    </Section>
  );
}
