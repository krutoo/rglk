import { useEffect, useRef, useState } from 'react';
import { Dungeon } from 'rglk';
import { Canvas, CanvasData } from './canvas';
import { Section } from './section';
import { calculateFitFactor } from './utils';

export function SectionDungeon() {
  const [version, setVersion] = useState(0);
  const viewRef = useRef<CanvasData>(null);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    const { canvas, context } = viewRef.current;

    const dungeon = new Dungeon({
      roomsAmount: 12,
      roomMinSize: 3,
      roomMaxSize: 8,
      corridorMinLength: 1,
      corridorMaxLength: 4,
      corridorComplexity: 3,
    });

    const tileSize = calculateFitFactor(dungeon, canvas);

    dungeon.forEachTile((x, y, isFloor) => {
      if (isFloor) {
        context.fillStyle = '#423a59';
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    });
  }, [version]);

  return (
    <Section title='Dungeons'>
      <Canvas ref={viewRef} onReload={() => setVersion(v => v + 1)} />
    </Section>
  );
}
