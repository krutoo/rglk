import type { Configuration } from '@rspack/core';
import path from 'node:path';
import * as utils from '@krutoo/utils/rspack';
import { emitStoriesEntrypoint } from '@krutoo/showcase/build';

await emitStoriesEntrypoint({
  filename: './.generated/found-stories.js',
  storiesGlob: './docs/**/*.{md,mdx,story.tsx}',
  storiesRootDir: './docs/',
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
});

export default {
  entry: {
    sandbox: './src/sandbox.tsx',
    showcase: './src/showcase.tsx',
  },
  output: {
    path: path.resolve(import.meta.dirname, 'dist'),
    filename: `[name].js`,
  },
  resolve: {
    alias: {
      '#found-stories$': path.resolve(import.meta.dirname, './.generated/found-stories.js'),
      rglk$: path.resolve(import.meta.dirname, '../src/index.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        loader: '@mdx-js/loader',
        // options: {
        //   providerImportSource: '@mdx-js/react',
        // },
      },
    ],
  },
  plugins: [
    utils.pluginHTML({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['showcase'],
    }),
    utils.pluginHTML({
      filename: 'sandbox.html',
      template: './src/index.html',
      chunks: ['sandbox'],
    }),
    utils.pluginTypeScript(),
    utils.pluginCSS(),
    utils.pluginRawImport(),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
  devServer: {
    hot: false,
    liveReload: true,
    static: false,
  },
} satisfies Configuration;
