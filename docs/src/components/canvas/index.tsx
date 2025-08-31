import { type CanvasHTMLAttributes, type RefObject, useCallback, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect, useMergeRefs, useResize } from '@krutoo/utils/react';
import styles from './canvas.module.css';
import classNames from 'classnames';

export interface DrawPayload {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  canvasRef?: RefObject<HTMLCanvasElement>;
  draw?: (payload: DrawPayload) => void;
  onReload?: () => void;
  fullscreen?: boolean;
}

export function Canvas({ fullscreen, canvasRef, draw, onReload, ...props }: CanvasProps) {
  const innerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mergedCanvasRef = useMergeRefs([canvasRef, innerCanvasRef]);
  const drawPayloadRef = useRef<DrawPayload>(null);

  const fit = useCallback(() => {
    const canvas = innerCanvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  const render = useCallback(() => {
    const payload = drawPayloadRef.current;

    if (!payload) {
      return;
    }

    const { canvas, context } = payload;

    context.clearRect(0, 0, canvas.width, canvas.height);
    draw?.(payload);
  }, [draw]);

  useResize(innerCanvasRef, () => {
    fit();
    render();
  });

  useIsomorphicLayoutEffect(() => {
    fit();
    render();
  }, [fit, render]);

  useIsomorphicLayoutEffect(() => {
    const canvas = innerCanvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    drawPayloadRef.current = {
      canvas,
      context,
    };
  }, []);

  return (
    <div className={classNames(styles.root, fullscreen && styles.fullscreen)}>
      <canvas ref={mergedCanvasRef} className={styles.canvas} {...props} />

      {onReload && (
        <div className={styles.controls}>
          <button className={styles.button} onClick={onReload}>
            Reload
          </button>
        </div>
      )}
    </div>
  );
}
