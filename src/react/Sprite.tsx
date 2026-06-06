import type { SpriteAnimationOptions } from '../core/types.js';
import { SPRITE_ANIMATION_DEFAULTS, toCssLength } from '../core/index.js';
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
  { className, style, width, height, ...options },
  ref,
) {
  const { ref: targetRef, play, pause, stop, goToFrame } = useSprite({
    width,
    height,
    ...options,
  });

  useImperativeHandle(ref, () => ({ play, pause, stop, goToFrame }), [
    play,
    pause,
    stop,
    goToFrame,
  ]);

  const sizeStyle = {
    width: toCssLength(width ?? SPRITE_ANIMATION_DEFAULTS.width),
    height: toCssLength(height ?? SPRITE_ANIMATION_DEFAULTS.height),
  };

  if (options.renderer === 'canvas') {
    return (
      <canvas
        ref={targetRef as React.RefObject<HTMLCanvasElement>}
        className={className}
        style={{ ...sizeStyle, ...style }}
      />
    );
  }

  return (
    <div
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={{ ...sizeStyle, ...style }}
      role="img"
      aria-label="Sprite animation"
    />
  );
});
