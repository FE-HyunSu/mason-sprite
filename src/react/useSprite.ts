import {
  SpriteAnimator,
  type SpriteAnimationClip,
  type SpriteAnimationOptions,
  type SpriteAnimationState,
} from '../core/index.js';
import { useEffect, useRef, useState } from 'react';

export interface UseSpriteOptions extends SpriteAnimationOptions {
  /** Skip auto-attach; useful when controlling the target manually */
  enabled?: boolean;
}

export interface UseSpriteReturn {
  ref: React.RefObject<HTMLElement | HTMLCanvasElement | null>;
  state: SpriteAnimationState;
  play: () => void;
  pause: () => void;
  stop: () => void;
  goToFrame: (frame: number) => void;
  playSegment: (clip: import('../core/types.js').SpriteAnimationClip) => void;
  playAnimation: (name: string) => void;
}

export function useSprite(options: UseSpriteOptions): UseSpriteReturn {
  const ref = useRef<HTMLElement | HTMLCanvasElement | null>(null);
  const animatorRef = useRef<SpriteAnimator | null>(null);
  const [state, setState] = useState<SpriteAnimationState>({
    currentFrame: 0,
    totalFrames: options.rows * options.cols,
    isPlaying: false,
    isLoaded: false,
    segment: null,
    activeAnimation: null,
  });

  const { enabled = true, ...animatorOptions } = options;

  useEffect(() => {
    if (!enabled) return;

    const animator = new SpriteAnimator(animatorOptions);
    animatorRef.current = animator;

    const unsubscribe = animator.subscribe(setState);

    queueMicrotask(() => {
      if (ref.current) {
        animator.attach(ref.current);
      }
    });

    return () => {
      unsubscribe();
      animator.destroy();
      animatorRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    animatorRef.current?.updateOptions(animatorOptions);
  }, [
    animatorOptions.src,
    animatorOptions.rows,
    animatorOptions.cols,
    animatorOptions.fps,
    animatorOptions.loop,
    animatorOptions.reverse,
    animatorOptions.animations,
    animatorOptions.width,
    animatorOptions.height,
    animatorOptions.autoPlay,
    animatorOptions.renderer,
  ]);

  return {
    ref,
    state,
    play: () => animatorRef.current?.play(),
    pause: () => animatorRef.current?.pause(),
    stop: () => animatorRef.current?.stop(),
    goToFrame: (frame) => animatorRef.current?.goToFrame(frame),
    playSegment: (clip: SpriteAnimationClip) => animatorRef.current?.playSegment(clip),
    playAnimation: (name) => animatorRef.current?.playAnimation(name),
  };
}
