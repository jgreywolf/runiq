import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/shapes/basic/index.ts',
    'src/shapes/flowchart/index.ts',
    'src/shapes/storage/index.ts',
    'src/shapes/rect-variants/index.ts',
    'src/shapes/control-systems/index.ts',
    'src/shapes/special/index.ts',
    'src/shapes/charts/index.ts',
    'src/shapes/network/index.ts',
    'src/shapes/quantum/index.ts',
    'src/shapes/uml/index.ts',
    'src/shapes/pedigree/index.ts',
    'src/shapes/c4/index.ts',
    'src/shapes/bpmn/index.ts',
    'src/shapes/aws/index.ts',
    'src/shapes/erd/index.ts',
  ],
  format: ['esm'],
  dts: true,
  sourcemap: process.env.NODE_ENV !== 'production',
  clean: true,
  splitting: false,
  minify: process.env.NODE_ENV === 'production',
  target: 'es2022',
});
