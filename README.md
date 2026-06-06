# mason-sprite

Lightweight sprite sheet animation for **React**, **Vue**, and **Svelte** — one package, subpath imports.

Drop in a PNG or WebP sprite sheet, set `rows`, `cols`, and `fps` — and you're done. No Lottie, no timeline editor. Just a simple **CSS** or **Canvas** sprite player.

## Install

```bash
npm install mason-sprite
```

Peer dependencies (install only what you use):

| Framework | Peers |
|-----------|-------|
| React | `react`, `react-dom` |
| Vue 3 | `vue` |
| Svelte | `svelte` |

## Usage

### Core engine (vanilla JS)

```ts
import { SpriteAnimator } from 'mason-sprite';

const animator = new SpriteAnimator({
  src: '/sprites/hero.png',
  rows: 2,
  cols: 5,
  fps: 10,
  loop: true,
  width: 140,
  height: 140,
});

animator.attach(document.getElementById('sprite')!);
animator.play();
```

### React

```tsx
import { Sprite } from 'mason-sprite/react';

<Sprite
  src="/sprites/hero.png"
  rows={2}
  cols={5}
  fps={10}
  loop
  width={140}
  height={140}
/>
```

### Vue 3

```vue
<script setup>
import { Sprite } from 'mason-sprite/vue';
</script>

<template>
  <Sprite
    src="/sprites/hero.png"
    :rows="2"
    :cols="5"
    :fps="10"
    :loop="true"
    :width="140"
    :height="140"
  />
</template>
```

### Svelte

```svelte
<script>
  import { Sprite } from 'mason-sprite/svelte';
</script>

<Sprite
  src="/sprites/hero.png"
  rows={2}
  cols={5}
  fps={10}
  loop
  width={140}
  height={140}
/>
```

## Exports

| Import path | Contents |
|-------------|----------|
| `mason-sprite` | `SpriteAnimator`, types, utilities |
| `mason-sprite/react` | `Sprite`, `useSprite` |
| `mason-sprite/vue` | `Sprite` component |
| `mason-sprite/svelte` | `Sprite` component |

## Features

- PNG / WebP sprite sheet support
- CSS or Canvas rendering
- `play`, `pause`, `stop`, `goToFrame` controls
- Works with any uniform grid sprite sheet (`rows × cols`)

## Sprite Sheet Requirements

- Uniform grid — every frame is the same size
- PNG or WebP format
- `rows × cols` = total frame count

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
```

## Publish

```bash
npm publish
```

## License

MIT
