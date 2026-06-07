import type { RendererMode } from './types.js';

export const SPRITE_ANIMATION_DEFAULTS = {
  fps: 12,
  loop: true,
  reverse: false,
  width: 128,
  height: 128,
  autoPlay: true,
  renderer: 'css' as RendererMode,
} as const;
