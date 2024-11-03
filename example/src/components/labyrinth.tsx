import { useEffect, useRef, useState } from 'react';
import { Dungeon } from '../../../src';
import { Canvas, CanvasData } from './canvas';
import { Section } from './section';
import { calculateFitFactor } from './utils';

export function SectionLabyrinth() {
  const [version, setVersion] = useState(0);
  const viewRef = useRef<CanvasData>(null);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    const { canvas, context } = viewRef.current;

    const labyrinth = new Dungeon({
      roomsAmount: 64,
      roomMinSize: 1,
      roomMaxSize: 1,
      corridorMinLength: 1,
      corridorMaxLength: 1,
      corridorComplexity: 3,
    });

    const tileSize = calculateFitFactor(labyrinth, canvas);

    labyrinth.forEachTile((x, y, isFloor) => {
      if (isFloor) {
        context.fillStyle = '#423a59';
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    });
  }, [version]);

  return (
    <Section title='Labyrinths'>
      <Canvas ref={viewRef} onReload={() => setVersion(v => v + 1)} />
    </Section>
  );
}
