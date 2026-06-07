export type RendererMode = 'css' | 'canvas';

/** CSS length (e.g. `128`, `'8rem'`, `'50%'`, `'10vw'`) */
export type SpriteSize = number | string;

/** Inclusive frame range on a sprite sheet */
export interface SpriteAnimationClip {
  /** First frame index (inclusive) */
  start: number;
  /** Last frame index (inclusive) */
  end: number;
  /** Loop this clip (default: inherits from `loop` option) */
  loop?: boolean;
}

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
  /** Play frames in reverse order (default: false) */
  reverse?: boolean;
  /** Named clips — use with `playAnimation()` */
  animations?: Record<string, SpriteAnimationClip>;
  /** Display width — number (px) or any CSS length (`rem`, `em`, `%`, `vw`, etc.) */
  width?: SpriteSize;
  /** Display height — number (px) or any CSS length (`rem`, `em`, `%`, `vw`, etc.) */
  height?: SpriteSize;
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
  /** Active clip, if playing a segment */
  segment: SpriteAnimationClip | null;
  /** Name of the clip from `animations`, if any */
  activeAnimation: string | null;
}

export interface FramePosition {
  row: number;
  col: number;
}
