import type { MouseEvent } from 'react';

export function calculateFitFactor(
  map: { width: number; height: number },
  canvas: { width: number; height: number },
): number {
  return Math.floor(Math.min(canvas.width / map.width, canvas.height / map.height));
}

export function getMousePos(event: MouseEvent) {
  const result = { x: 0, y: 0 };

  if (event.target instanceof HTMLCanvasElement) {
    const rect = event.target.getBoundingClientRect();

    result.x = event.clientX - rect.left;
    result.y = event.clientY - rect.top;
  }

  return result;
}
