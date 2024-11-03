import path from 'node:path';
import rspack from '@rspack/core';

export default {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash:7].js',
    path: path.resolve(import.meta.dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
    },
    tsConfig: {
      configFile: path.resolve(import.meta.dirname, 'tsconfig.json'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: 'typescript',
              jsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/i,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(module|m)\.css$/i,
                exportLocalsConvention: 'as-is',
                namedExport: false,
                localIdentName: '[name]__[local]--[hash:3]',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.CssExtractRspackPlugin({
      filename: '[name].[contenthash:7].css',
    }),
    new rspack.HtmlRspackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      scriptLoading: 'module',
      inject: 'body',
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
  devServer: {
    hot: false,
    liveReload: true,
  },
} satisfies rspack.Configuration;
