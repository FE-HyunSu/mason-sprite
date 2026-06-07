# mason-sprite

[![npm version](https://img.shields.io/npm/v/mason-sprite.svg)](https://www.npmjs.com/package/mason-sprite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Lightweight sprite sheet animation for **React**, **Vue**, and **Svelte**.

Drop in a uniform-grid PNG or WebP sheet, set `rows`, `cols`, and `fps` — CSS or Canvas rendering with no timeline editor.

**Docs & demo:** [mason-sprite.com](https://mason-sprite.com)

## Preview

| Sprite sheet (2 × 5) | Rendered |
| :---: | :---: |
| <img src="https://raw.githubusercontent.com/FE-HyunSu/mason-sprite/main/docs/assets/readme/img-cat-run.webp" alt="Sprite sheet" width="360" /> | <img src="https://raw.githubusercontent.com/FE-HyunSu/mason-sprite/main/docs/assets/readme/img-cat-run-animate.webp" alt="Animation" width="120" /> |

## Install

```bash
npm install mason-sprite
```

| Framework | Peer dependencies |
| --- | --- |
| React | `react`, `react-dom` |
| Vue 3 | `vue` |
| Svelte | `svelte` |

## Usage

### React

```tsx
import { Sprite } from 'mason-sprite/react';

<Sprite
  src="/sprites/cat-run.webp"
  rows={2}
  cols={5}
  fps={10}
  loop
  width="8rem"
  height="8rem"
/>
```

### Vue

```vue
<script setup>
import { Sprite } from 'mason-sprite/vue';
</script>

<template>
  <Sprite
    src="/sprites/cat-run.webp"
    :rows="2"
    :cols="5"
    :fps="10"
    loop
    width="8rem"
    height="8rem"
  />
</template>
```

### Svelte

```svelte
<script>
  import { Sprite } from 'mason-sprite/svelte';
</script>

<Sprite
  src="/sprites/cat-run.webp"
  rows={2}
  cols={5}
  fps={10}
  loop
  width="8rem"
  height="8rem"
/>
```

### Vanilla JS

```ts
import { SpriteAnimator } from 'mason-sprite';

const animator = new SpriteAnimator({
  src: '/sprites/cat-run.webp',
  rows: 2,
  cols: 5,
  fps: 10,
  loop: true,
  width: '8rem',
  height: '8rem',
});

animator.attach(document.getElementById('sprite')!);
```

## Props

Shared by `<Sprite>` (React / Vue / Svelte) and `SpriteAnimator`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Sprite sheet image URL (PNG, WebP, etc.) |
| `rows` | `number` | — | Number of rows in the sheet |
| `cols` | `number` | — | Number of columns in the sheet |
| `fps` | `number` | `12` | Frames per second |
| `loop` | `boolean` | `true` | Loop the animation |
| `width` | `number \| string` | `128` | Display width — px number or CSS length (`rem`, `%`, `vw`, …) |
| `height` | `number \| string` | `128` | Display height — px number or CSS length |
| `autoPlay` | `boolean` | `true` | Start playing on attach |
| `renderer` | `'css' \| 'canvas'` | `'css'` | Rendering mode |
| `onComplete` | `() => void` | — | Called when a non-looping animation finishes |
| `onFrameChange` | `(frame: number) => void` | — | Called on each frame change |

Framework-specific props:

| Framework | Extra props |
| --- | --- |
| React | `className`, `style` |
| Vue | `class` |
| Svelte | `class` |

## Exports

| Import path | Contents |
| --- | --- |
| `mason-sprite` | `SpriteAnimator`, types, utilities |
| `mason-sprite/react` | `Sprite`, `useSprite` |
| `mason-sprite/vue` | `Sprite` |
| `mason-sprite/svelte` | `Sprite` |

## License

MIT
