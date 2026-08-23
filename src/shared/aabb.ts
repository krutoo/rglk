import { type Point2d, Vector2 } from '@krutoo/utils';

export interface Box2d extends Point2d {
  width: number;
  height: number;
}

export class AABB {
  static centerOf(box: Box2d): Vector2 {
    return Vector2.of(box.x + box.width / 2, box.y + box.height / 2);
  }

  static resolveCollision(a: Box2d, b: Box2d): boolean {
    const centerA = AABB.centerOf(a);
    const centerB = AABB.centerOf(b);

    const dist = centerB.subtract(centerA);

    const minSizeX = a.width / 2 + b.width / 2;
    const minSizeY = a.height / 2 + b.height / 2;

    const overlapX = minSizeX - Math.abs(dist.x);
    const overlapY = minSizeY - Math.abs(dist.y);

    if (overlapX > 0 && overlapY > 0) {
      // Выталкиваем по оси с МЕНЬШИМ перекрытием
      if (overlapX < overlapY) {
        // Выталкивание по горизонтали (X)
        // Разделяем силу выталкивания поровну (по 50% на каждый объект)
        const pushX = overlapX / 2;

        if (dist.x > 0) {
          a.x -= pushX;
          b.x += pushX;
        } else {
          a.x += pushX;
          b.x -= pushX;
        }
      } else {
        // Выталкивание по вертикали (Y)
        const pushY = overlapY / 2;

        if (dist.y > 0) {
          a.y -= pushY;
          b.y += pushY;
        } else {
          a.y += pushY;
          b.y -= pushY;
        }
      }

      return true;
    }

    return false;
  }
}
