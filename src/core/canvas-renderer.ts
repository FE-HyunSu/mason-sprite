import { getFramePosition } from './utils.js';

export function drawCanvasFrame(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  frameIndex: number,
  rows: number,
  cols: number,
  width: number,
  height: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const frameWidth = image.naturalWidth / cols;
  const frameHeight = image.naturalHeight / rows;
  const { row, col } = getFramePosition(frameIndex, cols);

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(
    image,
    col * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    0,
    0,
    width,
    height,
  );
}
