import type { SpriteAnimationOptions } from '../core/types.js';
import { forwardRef, useImperativeHandle } from 'react';
import { useSprite } from './useSprite.js';

export interface SpriteProps extends SpriteAnimationOptions {
  className?: string;
  style?: React.CSSProperties;
}

export interface SpriteHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
  goToFrame: (frame: number) => void;
}

export const Sprite = forwardRef<SpriteHandle, SpriteProps>(function Sprite(
  { className, style, ...options },
  ref,
) {
  const { ref: targetRef, play, pause, stop, goToFrame } = useSprite(options);

  useImperativeHandle(ref, () => ({ play, pause, stop, goToFrame }), [
    play,
    pause,
    stop,
    goToFrame,
  ]);

  if (options.renderer === 'canvas') {
    return (
      <canvas
        ref={targetRef as React.RefObject<HTMLCanvasElement>}
        className={className}
        style={style}
      />
    );
  }

  return (
    <div
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
      role="img"
      aria-label="Sprite animation"
    />
  );
});
