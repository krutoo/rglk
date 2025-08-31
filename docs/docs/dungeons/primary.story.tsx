import { useState, useCallback } from 'react';
import { Canvas, type DrawPayload } from '#components/canvas';
import { Dungeon } from 'rglk';
import { calculateFitFactor } from '#utils';

export const meta = {
  category: 'Dungeon',
  title: 'Demo',
};

export default function Example() {
  const [version, setVersion] = useState(0);

  const draw = useCallback(
    ({ canvas, context }: DrawPayload) => {
      const dungeon = new Dungeon({
        seed: version,
        roomsAmount: 20,
        roomMinSize: 3,
        roomMaxSize: 8,
        corridorMinLength: 1,
        corridorMaxLength: 4,
        corridorComplexity: 3,
      });

      const tileSize = calculateFitFactor(dungeon, canvas);

      dungeon.forEachTile((x, y, isFloor) => {
        if (isFloor) {
          context.fillStyle = '#393945';
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      });
    },
    [version],
  );

  const handleReload = () => {
    setVersion(v => v + 1);
  };

  return <Canvas fullscreen draw={draw} onReload={handleReload} />;
}
