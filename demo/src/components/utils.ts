export function calculateFitFactor(
  map: { width: number; height: number },
  canvas: HTMLCanvasElement,
): number {
  return Math.floor(Math.min(canvas.width / map.width, canvas.height / map.height));
}
