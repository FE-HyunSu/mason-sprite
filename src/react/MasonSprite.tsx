import type { SpriteAnimationClip, SpriteAnimationOptions } from '../core/types.js';
import { SPRITE_ANIMATION_DEFAULTS, toCssLength } from '../core/index.js';
import { forwardRef, useImperativeHandle } from 'react';
import { useMasonSprite } from './useMasonSprite.js';

export interface MasonSpriteProps extends SpriteAnimationOptions {
  className?: string;
  style?: React.CSSProperties;
}

export interface MasonSpriteHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
  goToFrame: (frame: number) => void;
  playSegment: (clip: SpriteAnimationClip) => void;
  playAnimation: (name: string) => void;
}

export const MasonSprite = forwardRef<MasonSpriteHandle, MasonSpriteProps>(function MasonSprite(
  { className, style, width, height, ...options },
  ref,
) {
  const { ref: targetRef, play, pause, stop, goToFrame, playSegment, playAnimation } = useMasonSprite({
    width,
    height,
    ...options,
  });

  useImperativeHandle(ref, () => ({ play, pause, stop, goToFrame, playSegment, playAnimation }), [
    play,
    pause,
    stop,
    goToFrame,
    playSegment,
    playAnimation,
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
      aria-label="Mason sprite animation"
    />
  );
});
