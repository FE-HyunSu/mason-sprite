<script lang="ts">
  import {
    SPRITE_ANIMATION_DEFAULTS,
    SpriteAnimator,
    toCssLength,
    type SpriteAnimationOptions,
  } from 'mason-sprite';

  interface Props extends SpriteAnimationOptions {
    class?: string;
  }

  let {
    src,
    rows,
    cols,
    fps = SPRITE_ANIMATION_DEFAULTS.fps,
    loop = SPRITE_ANIMATION_DEFAULTS.loop,
    reverse = SPRITE_ANIMATION_DEFAULTS.reverse,
    animations,
    width = SPRITE_ANIMATION_DEFAULTS.width,
    height = SPRITE_ANIMATION_DEFAULTS.height,
    autoPlay = SPRITE_ANIMATION_DEFAULTS.autoPlay,
    renderer = SPRITE_ANIMATION_DEFAULTS.renderer,
    onComplete,
    onFrameChange,
    class: className = '',
  }: Props = $props();

  let target = $state<HTMLElement | HTMLCanvasElement | undefined>();
  let animator = $state<SpriteAnimator | null>(null);

  $effect(() => {
    const el = target;
    if (!el) return;

    const instance = new SpriteAnimator({
      src,
      rows,
      cols,
      fps,
      loop,
      reverse,
      animations,
      width,
      height,
      autoPlay,
      renderer,
      onComplete,
      onFrameChange,
    });

    instance.attach(el);
    animator = instance;

    return () => {
      instance.destroy();
      animator = null;
    };
  });

  export function play() {
    animator?.play();
  }

  export function pause() {
    animator?.pause();
  }

  export function stop() {
    animator?.stop();
  }

  export function goToFrame(frame: number) {
    animator?.goToFrame(frame);
  }

  export function playSegment(clip: import('mason-sprite').SpriteAnimationClip) {
    animator?.playSegment(clip);
  }

  export function playAnimation(name: string) {
    animator?.playAnimation(name);
  }

  export function getState() {
    return animator?.getState();
  }
</script>

{#if renderer === 'canvas'}
  <canvas bind:this={target} class={className} style="width: {toCssLength(width)}; height: {toCssLength(height)};"></canvas>
{:else}
  <div
    bind:this={target}
    class={className}
    role="img"
    aria-label="Mason sprite animation"
    style="width: {toCssLength(width)}; height: {toCssLength(height)};"
  ></div>
{/if}
