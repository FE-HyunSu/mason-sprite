<script setup lang="ts">
import { SPRITE_ANIMATION_DEFAULTS, SpriteAnimator, toCssLength, type SpriteAnimationClip, type SpriteAnimationOptions } from '../core/index.js';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<
    SpriteAnimationOptions & {
      class?: string;
    }
  >(),
  SPRITE_ANIMATION_DEFAULTS,
);

const sizeStyle = computed(() => ({
  width: toCssLength(props.width),
  height: toCssLength(props.height),
}));

const emit = defineEmits<{
  complete: [];
  frameChange: [frame: number];
}>();

const targetRef = ref<HTMLElement | HTMLCanvasElement | null>(null);
let animator: SpriteAnimator | null = null;

function createAnimator() {
  animator?.destroy();
  animator = new SpriteAnimator({
    src: props.src,
    rows: props.rows,
    cols: props.cols,
    fps: props.fps,
    loop: props.loop,
    reverse: props.reverse,
    animations: props.animations,
    width: props.width,
    height: props.height,
    autoPlay: props.autoPlay,
    renderer: props.renderer,
    onComplete: () => emit('complete'),
    onFrameChange: (frame) => emit('frameChange', frame),
  });

  if (targetRef.value) {
    animator.attach(targetRef.value);
  }
}

onMounted(createAnimator);

onBeforeUnmount(() => {
  animator?.destroy();
  animator = null;
});

watch(
  () => [
    props.src,
    props.rows,
    props.cols,
    props.fps,
    props.loop,
    props.reverse,
    props.animations,
    props.width,
    props.height,
    props.autoPlay,
    props.renderer,
  ],
  createAnimator,
);

defineExpose({
  play: () => animator?.play(),
  pause: () => animator?.pause(),
  stop: () => animator?.stop(),
  goToFrame: (frame: number) => animator?.goToFrame(frame),
  playSegment: (clip: SpriteAnimationClip) => animator?.playSegment(clip),
  playAnimation: (name: string) => animator?.playAnimation(name),
  getState: () => animator?.getState(),
});
</script>

<template>
  <canvas
    v-if="renderer === 'canvas'"
    ref="targetRef"
    :class="props.class"
    :style="sizeStyle"
  />
  <div
    v-else
    ref="targetRef"
    :class="props.class"
    role="img"
    aria-label="Sprite animation"
    :style="sizeStyle"
  />
</template>
