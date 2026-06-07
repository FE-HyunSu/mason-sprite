import { SPRITE_ANIMATION_DEFAULTS } from './constants.js';
import { drawCanvasFrame } from './canvas-renderer.js';
import { applyCssFrame, resetCssRenderer } from './css-renderer.js';
import type { SpriteAnimationClip, SpriteAnimationOptions, SpriteAnimationState } from './types.js';
import { getTotalFrames, toCssLength } from './utils.js';

type StateListener = (state: SpriteAnimationState) => void;

type ResolvedSegment = {
  start: number;
  end: number;
  loop: boolean;
};

type ResolvedSpriteAnimationOptions = Required<
  Pick<SpriteAnimationOptions, 'src' | 'rows' | 'cols'>
> &
  Required<
    Pick<SpriteAnimationOptions, 'fps' | 'loop' | 'reverse' | 'width' | 'height' | 'autoPlay' | 'renderer'>
  > &
  Pick<SpriteAnimationOptions, 'onComplete' | 'onFrameChange' | 'animations'>;

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
  private resizeObserver: ResizeObserver | null = null;
  private segment: ResolvedSegment | null = null;
  private activeAnimation: string | null = null;

  constructor(options: SpriteAnimationOptions) {
    this.options = {
      ...SPRITE_ANIMATION_DEFAULTS,
      ...options,
    };
    this.loadImage();
  }

  attach(target: HTMLElement | HTMLCanvasElement): void {
    this.target = target;
    this.applyCanvasDisplaySize();
    this.setupResizeObserver();
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
    this.currentFrame = this.getSegmentStartFrame();
    this.clearSegment();
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

  playSegment(clip: SpriteAnimationClip): void {
    if (this.destroyed) return;
    this.segment = this.resolveClip(clip);
    this.activeAnimation = null;
    this.currentFrame = this.getSegmentStartFrame();
    this.render();
    this.options.onFrameChange?.(this.currentFrame);
    this.startOrResumePlayback();
  }

  playAnimation(name: string): void {
    if (this.destroyed) return;
    const clip = this.options.animations?.[name];
    if (!clip) {
      console.warn(`[SpriteAnimator] Unknown animation: "${name}"`);
      return;
    }
    this.segment = this.resolveClip(clip);
    this.activeAnimation = name;
    this.currentFrame = this.getSegmentStartFrame();
    this.render();
    this.options.onFrameChange?.(this.currentFrame);
    this.startOrResumePlayback();
  }

  private startOrResumePlayback(): void {
    this.accumulatedTime = 0;
    this.lastTimestamp = 0;
    if (this.isPlaying) {
      this.notify();
      return;
    }
    this.play();
  }

  clearSegment(): void {
    this.segment = null;
    this.activeAnimation = null;
  }

  getState(): SpriteAnimationState {
    return {
      currentFrame: this.currentFrame,
      totalFrames: this.getTotalFrames(),
      isPlaying: this.isPlaying,
      isLoaded: this.isLoaded,
      segment: this.getPublicSegment(),
      activeAnimation: this.activeAnimation,
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
    const prevRenderer = this.options.renderer;
    this.options = { ...this.options, ...partial };

    if (partial.src !== undefined && partial.src !== prevSrc) {
      this.loadImage();
    } else if (this.isLoaded) {
      this.render();
    }

    if (partial.fps !== undefined && partial.fps !== prevFps) {
      this.accumulatedTime = 0;
    }

    if (partial.width !== undefined || partial.height !== undefined) {
      this.applyCanvasDisplaySize();
    }

    if (partial.renderer !== undefined && partial.renderer !== prevRenderer) {
      this.setupResizeObserver();
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.pause();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.listeners.clear();
    if (this.target && this.options.renderer === 'css') {
      resetCssRenderer(this.target);
    }
    this.target = null;
    this.image = null;
    this.clearSegment();
  }

  private getTotalFrames(): number {
    return getTotalFrames(this.options.rows, this.options.cols);
  }

  private resolveClip(clip: SpriteAnimationClip): ResolvedSegment {
    const total = this.getTotalFrames();
    const start = Math.max(0, Math.min(clip.start, total - 1));
    const end = Math.max(start, Math.min(clip.end, total - 1));
    return {
      start,
      end,
      loop: clip.loop ?? this.options.loop,
    };
  }

  private getPlaybackBounds(): ResolvedSegment {
    if (this.segment) return this.segment;
    const total = this.getTotalFrames();
    return {
      start: 0,
      end: total - 1,
      loop: this.options.loop,
    };
  }

  private getSegmentStartFrame(): number {
    if (!this.segment) return 0;
    return this.options.reverse ? this.segment.end : this.segment.start;
  }

  private getPublicSegment(): SpriteAnimationClip | null {
    if (!this.segment) return null;
    return {
      start: this.segment.start,
      end: this.segment.end,
      loop: this.segment.loop,
    };
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
    const { start, end, loop } = this.getPlaybackBounds();

    if (this.options.reverse) {
      const prev = this.currentFrame - 1;
      if (prev < start) {
        if (loop) {
          this.currentFrame = end;
        } else {
          this.currentFrame = start;
          this.pause();
          this.options.onComplete?.();
        }
      } else {
        this.currentFrame = prev;
      }
    } else {
      const next = this.currentFrame + 1;
      if (next > end) {
        if (loop) {
          this.currentFrame = start;
        } else {
          this.currentFrame = end;
          this.pause();
          this.options.onComplete?.();
        }
      } else {
        this.currentFrame = next;
      }
    }

    this.render();
    this.options.onFrameChange?.(this.currentFrame);
    this.notify();
  }

  private render(): void {
    if (!this.target || !this.isLoaded) return;

    const { src, rows, cols, width, height, renderer } = this.options;

    if (renderer === 'canvas' && this.target instanceof HTMLCanvasElement && this.image) {
      drawCanvasFrame(this.target, this.image, this.currentFrame, rows, cols);
    } else if (renderer === 'css' && this.target instanceof HTMLElement) {
      applyCssFrame(this.target, src, this.currentFrame, rows, cols, width, height);
    }
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  private applyCanvasDisplaySize(): void {
    if (this.options.renderer !== 'canvas' || !(this.target instanceof HTMLCanvasElement)) {
      return;
    }
    this.target.style.width = toCssLength(this.options.width);
    this.target.style.height = toCssLength(this.options.height);
  }

  private setupResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (
      this.options.renderer !== 'canvas' ||
      !(this.target instanceof HTMLCanvasElement) ||
      typeof ResizeObserver === 'undefined'
    ) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      if (this.isLoaded) {
        this.render();
      }
    });
    this.resizeObserver.observe(this.target);
  }
}
