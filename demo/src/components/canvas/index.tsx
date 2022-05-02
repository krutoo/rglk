import { forwardRef, useEffect, useImperativeHandle, useRef, CanvasHTMLAttributes } from 'react';
import styles from './canvas.module.css';

export interface CanvasData {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  onReload?: () => void;
}

export const Canvas = forwardRef<CanvasData | null, CanvasProps>(function Canvas(
  { onReload, ...props },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = (canvasRef.current.width / 16) * 9;
      contextRef.current = canvasRef.current.getContext('2d');
    }
  });

  useImperativeHandle<CanvasData | null, CanvasData | null>(ref, () => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }

    if (canvasRef.current && contextRef.current) {
      return { canvas: canvasRef.current, context: contextRef.current };
    } else {
      return null;
    }
  });

  return (
    <div className={styles.root}>
      {onReload && (
        <button className={styles.button} onClick={onReload}>
          Reload
        </button>
      )}
      <canvas ref={canvasRef} className={styles.canvas} {...props} />
    </div>
  );
});
