import type { FramePosition, SpriteSize } from './types.js';

/** Converts a SpriteSize to a CSS length string. Numbers become `px`; strings pass through. */
export function toCssLength(size: SpriteSize): string {
  return typeof size === 'number' ? `${size}px` : size;
}

export function getTotalFrames(rows: number, cols: number): number {
  return rows * cols;
}

export function getFramePosition(frameIndex: number, cols: number): FramePosition {
  return {
    row: Math.floor(frameIndex / cols),
    col: frameIndex % cols,
  };
}

export function getBackgroundPositionPercent(
  frameIndex: number,
  rows: number,
  cols: number,
): { x: number; y: number } {
  const { row, col } = getFramePosition(frameIndex, cols);
  const x = cols <= 1 ? 0 : (col / (cols - 1)) * 100;
  const y = rows <= 1 ? 0 : (row / (rows - 1)) * 100;
  return { x, y };
}
