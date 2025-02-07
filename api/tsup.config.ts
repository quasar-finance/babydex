import { type Options, defineConfig } from 'tsup';

/**

@see https://tsup.egoist.dev/#usage*/
export default defineConfig({
  dts: true,
  shims: true,
  bundle: true,
  outDir: 'dist',
  platform: 'node',
  target: 'esnext',
  format: ['esm'],
  entry: ['./src/server.ts']
});
