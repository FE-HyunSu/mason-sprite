import type { SpriteSize } from './types.js';
import { getBackgroundPositionPercent, toCssLength } from './utils.js';

export interface CssRendererTarget {
  style: CSSStyleDeclaration;
}

export function applyCssFrame(
  target: CssRendererTarget,
  src: string,
  frameIndex: number,
  rows: number,
  cols: number,
  width: SpriteSize,
  height: SpriteSize,
): void {
  const { x, y } = getBackgroundPositionPercent(frameIndex, rows, cols);

  target.style.backgroundImage = `url("${src}")`;
  target.style.backgroundRepeat = 'no-repeat';
  target.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
  target.style.backgroundPosition = `${x}% ${y}%`;
  target.style.width = toCssLength(width);
  target.style.height = toCssLength(height);
  target.style.display = 'inline-block';
}

export function resetCssRenderer(target: CssRendererTarget): void {
  target.style.backgroundImage = '';
}
