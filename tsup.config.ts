import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: {
    'index': 'server/index.ts',
    'routes/index': 'server/routes/index.ts',
  },
  outDir: 'dist',
  format: 'esm',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  tsconfig: 'server/tsconfig.json',
  external: ['node_modules'],
  noExternal: [
    /^@shared\//,
    /^@server\//
  ],
  esbuildOptions(options) {
    options.external = options.external || [];
    options.external.push('@shared/*', '@server/*');
  },
  onSuccess: 'npm run build:types',
  outExtension: () => ({
    js: '.js',
    dts: '.d.ts',
  }),
  treeshake: true,
  splitting: false,
  bundle: true
});
