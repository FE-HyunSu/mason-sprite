import { getFramePosition } from './utils.js';

export function drawCanvasFrame(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  frameIndex: number,
  rows: number,
  cols: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (displayWidth === 0 || displayHeight === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const pixelWidth = Math.round(displayWidth * dpr);
  const pixelHeight = Math.round(displayHeight * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const frameWidth = image.naturalWidth / cols;
  const frameHeight = image.naturalHeight / rows;
  const { row, col } = getFramePosition(frameIndex, cols);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(
    image,
    col * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    0,
    0,
    displayWidth,
    displayHeight,
  );
}
