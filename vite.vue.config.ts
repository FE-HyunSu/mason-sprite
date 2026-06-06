import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src/vue',
      outDir: 'dist/vue',
      include: ['src/vue/**/*'],
      exclude: ['src/core/**', 'src/react/**', 'src/svelte/**'],
      insertTypesEntry: true,
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    outDir: 'dist/vue',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/vue/index.ts'),
      name: 'MasonSpriteVue',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
