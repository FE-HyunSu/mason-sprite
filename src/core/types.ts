export type RendererMode = 'css' | 'canvas';

export interface SpriteAnimationOptions {
  /** Sprite sheet image URL (PNG, WebP, etc.) */
  src: string;
  /** Number of rows in the sprite sheet */
  rows: number;
  /** Number of columns in the sprite sheet */
  cols: number;
  /** Frames per second (default: 12) */
  fps?: number;
  /** Whether to loop the animation (default: true) */
  loop?: boolean;
  /** Display width in pixels */
  width?: number;
  /** Display height in pixels */
  height?: number;
  /** Start playing automatically (default: true) */
  autoPlay?: boolean;
  /** Rendering mode: CSS background-position or Canvas (default: 'css') */
  renderer?: RendererMode;
  /** Called when a non-looping animation completes */
  onComplete?: () => void;
  /** Called on each frame change */
  onFrameChange?: (frame: number) => void;
}

export interface SpriteAnimationState {
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  isLoaded: boolean;
}

export interface FramePosition {
  row: number;
  col: number;
}
