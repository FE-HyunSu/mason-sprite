import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/package').SvelteConfig} */
const config = {
  preprocess: vitePreprocess(),
};

export default config;
