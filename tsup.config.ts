import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/core/index.ts' },
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
  },
  {
    entry: { index: 'src/react/index.ts' },
    outDir: 'dist/react',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom'],
    target: 'es2020',
  },
]);
