import { SPRITE_ANIMATION_DEFAULTS } from './constants.js';
import { drawCanvasFrame } from './canvas-renderer.js';
import { applyCssFrame, resetCssRenderer } from './css-renderer.js';
import type { SpriteAnimationOptions, SpriteAnimationState } from './types.js';
import { getTotalFrames } from './utils.js';

type StateListener = (state: SpriteAnimationState) => void;

type ResolvedSpriteAnimationOptions = Required<
  Pick<SpriteAnimationOptions, 'src' | 'rows' | 'cols'>
> &
  Required<Pick<SpriteAnimationOptions, 'fps' | 'loop' | 'width' | 'height' | 'autoPlay' | 'renderer'>> &
  Pick<SpriteAnimationOptions, 'onComplete' | 'onFrameChange'>;

export class SpriteAnimator {
  private options: ResolvedSpriteAnimationOptions;
  private currentFrame = 0;
  private isPlaying = false;
  private isLoaded = false;
  private rafId: number | null = null;
  private lastTimestamp = 0;
  private accumulatedTime = 0;
  private image: HTMLImageElement | null = null;
  private target: HTMLElement | HTMLCanvasElement | null = null;
  private listeners = new Set<StateListener>();
  private destroyed = false;

  constructor(options: SpriteAnimationOptions) {
    this.options = {
      ...SPRITE_ANIMATION_DEFAULTS,
      ...options,
    };
    this.loadImage();
  }

  attach(target: HTMLElement | HTMLCanvasElement): void {
    this.target = target;
    if (this.isLoaded) {
      this.render();
    }
    if (this.options.autoPlay) {
      this.play();
    }
  }

  play(): void {
    if (this.destroyed || this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = 0;
    this.accumulatedTime = 0;
    this.rafId = requestAnimationFrame(this.tick);
    this.notify();
  }

  pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notify();
  }

  stop(): void {
    this.pause();
    this.currentFrame = 0;
    this.render();
    this.notify();
  }

  goToFrame(frame: number): void {
    const total = this.getTotalFrames();
    this.currentFrame = Math.max(0, Math.min(frame, total - 1));
    this.render();
    this.options.onFrameChange?.(this.currentFrame);
    this.notify();
  }

  getState(): SpriteAnimationState {
    return {
      currentFrame: this.currentFrame,
      totalFrames: this.getTotalFrames(),
      isPlaying: this.isPlaying,
      isLoaded: this.isLoaded,
    };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  updateOptions(partial: Partial<SpriteAnimationOptions>): void {
    const prevSrc = this.options.src;
    const prevFps = this.options.fps;
    this.options = { ...this.options, ...partial };

    if (partial.src !== undefined && partial.src !== prevSrc) {
      this.loadImage();
    } else if (this.isLoaded) {
      this.render();
    }

    if (partial.fps !== undefined && partial.fps !== prevFps) {
      this.accumulatedTime = 0;
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.pause();
    this.listeners.clear();
    if (this.target && this.options.renderer === 'css') {
      resetCssRenderer(this.target);
    }
    this.target = null;
    this.image = null;
  }

  private getTotalFrames(): number {
    return getTotalFrames(this.options.rows, this.options.cols);
  }

  private loadImage(): void {
    this.isLoaded = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (this.destroyed) return;
      this.image = img;
      this.isLoaded = true;

      if (!this.options.width || !this.options.height) {
        const frameWidth = img.naturalWidth / this.options.cols;
        const frameHeight = img.naturalHeight / this.options.rows;
        this.options.width = frameWidth;
        this.options.height = frameHeight;
      }

      this.render();
      this.notify();

      if (this.options.autoPlay && this.target) {
        this.play();
      }
    };
    img.onerror = () => {
      console.error(`[SpriteAnimator] Failed to load image: ${this.options.src}`);
    };
    img.src = this.options.src;
  }

  private tick = (timestamp: number): void => {
    if (!this.isPlaying || this.destroyed) return;

    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
    }

    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    this.accumulatedTime += delta;

    const frameDuration = 1000 / this.options.fps;
    while (this.accumulatedTime >= frameDuration) {
      this.accumulatedTime -= frameDuration;
      this.advanceFrame();
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private advanceFrame(): void {
    const total = this.getTotalFrames();
    const next = this.currentFrame + 1;

    if (next >= total) {
      if (this.options.loop) {
        this.currentFrame = 0;
      } else {
        this.currentFrame = total - 1;
        this.pause();
        this.options.onComplete?.();
      }
    } else {
      this.currentFrame = next;
    }

    this.render();
    this.options.onFrameChange?.(this.currentFrame);
    this.notify();
  }

  private render(): void {
    if (!this.target || !this.isLoaded) return;

    const { src, rows, cols, width, height, renderer } = this.options;

    if (renderer === 'canvas' && this.target instanceof HTMLCanvasElement && this.image) {
      drawCanvasFrame(this.target, this.image, this.currentFrame, rows, cols, width, height);
    } else if (renderer === 'css' && this.target instanceof HTMLElement) {
      applyCssFrame(this.target, src, this.currentFrame, rows, cols, width, height);
    }
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}
