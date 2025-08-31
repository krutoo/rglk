import { Canvas, type DrawPayload } from '#components/canvas';
import { calculateFitFactor } from '#utils';
import { useCallback, useState } from 'react';
import { Dungeon, createPathfinder } from 'rglk';

export const meta = {
  category: 'Path finding',
  title: 'Demo',
};

export default function Example() {
  const [version, setVersion] = useState(0);

  const draw = useCallback(
    ({ canvas, context }: DrawPayload) => {
      const dungeon = new Dungeon({
        seed: version,
        roomsAmount: 32,
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
          context.fillStyle = '#393945';
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      });

      // draw path
      const path = findPath(
        Math.floor(dungeon.rooms.at(0)!.center.x),
        Math.floor(dungeon.rooms.at(0)!.center.y),
        Math.floor(dungeon.rooms.at(-1)!.center.x),
        Math.floor(dungeon.rooms.at(-1)!.center.y),
      );

      if (path.length) {
        context.strokeStyle = 'rgb(255, 67, 67)';
        context.fillStyle = 'rgb(255, 67, 67)';
        context.lineWidth = Math.ceil(tileSize / 3);
        context.beginPath();
        context.moveTo(path[0]!.x * tileSize + tileSize / 2, path[0]!.y * tileSize + tileSize / 2);

        path.forEach((point, index) => {
          if (index === 0 || index === path.length - 1) {
            context.fillRect(point.x * tileSize, point.y * tileSize, tileSize, tileSize);
          }
          context.lineTo(point.x * tileSize + tileSize / 2, point.y * tileSize + tileSize / 2);
        });

        context.stroke();
        context.closePath();
      }
    },
    [version],
  );

  return <Canvas fullscreen draw={draw} onReload={() => setVersion(v => v + 1)} />;
}
