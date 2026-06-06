import type { FramePosition } from './types.js';

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
