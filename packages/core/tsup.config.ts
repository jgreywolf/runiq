import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: process.env.NODE_ENV !== 'production',
  clean: true,
  splitting: false,
  minify: process.env.NODE_ENV === 'production',
  target: 'es2022',
});
