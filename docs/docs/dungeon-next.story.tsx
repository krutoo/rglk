import { DungeonNext } from 'rglk';

export const meta = {
  category: 'Dungeons (next)',
  title: 'Demo',
};

function init(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d')!;

  if (!context) {
    return;
  }

  context.imageSmoothingEnabled = false;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  canvas.style.position = 'fixed';
  canvas.style.setProperty('image-rendering', 'pixelated');
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  const generator = DungeonNext.createDungeon({
    roomAmount: 24,
    roomMinSize: 6,
    roomMaxSize: 12,
    roomMargin: 1,
  });

  const loop = () => {
    const { done, value } = generator.next();

    render(value);

    if (!done) {
      requestAnimationFrame(loop);
    }
  };

  const render = ({ rooms, corridors }: any) => {
    const scale = 5;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(canvas.width / 2, canvas.height / 2);
    context.save();

    // rooms:
    context.strokeStyle = '#000';
    for (const room of rooms) {
      context.fillRect(room.x * scale, room.y * scale, room.width * scale, room.height * scale);
    }

    // corridors:
    context.lineWidth = scale;
    for (const { a, b } of corridors) {
      context.beginPath();
      context.moveTo(a.x * scale, a.y * scale);
      context.lineTo(b.x * scale, b.y * scale);
      context.stroke();
      context.closePath();
    }
    context.lineWidth = 1;

    // connections:
    // context.strokeStyle = '#f00';
    // for (const { a: from, b: to } of connections) {
    //   context.beginPath();
    //   context.moveTo(from.x, from.y);
    //   context.lineTo(to.x, to.y);
    //   context.stroke();
    //   context.closePath();
    // }
    // context.strokeStyle = '#000';

    context.translate(-canvas.width / 2, -canvas.height / 2);
  };

  loop();
}

export default function Example() {
  return <canvas ref={init}></canvas>;
}
