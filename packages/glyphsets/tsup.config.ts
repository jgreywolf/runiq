import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // tsc handles declaration files
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
});
