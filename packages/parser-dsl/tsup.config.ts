import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  target: 'es2022',
  // Don't bundle Langium dependencies and Node built-ins
  noExternal: [],
  external: [
    'langium',
    'vscode-languageserver',
    'vscode-languageserver-protocol',
    'vscode-jsonrpc',
    'vscode-uri',
  ],
});
