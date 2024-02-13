/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const nodeConfig = {
    mode: 'production',
    target: 'node',
  // build two different bundles from the transpiled js
  entry: {
    sdk: './lib/cjs/index.js',
    'sdk.min': './lib/cjs/index.js',
  },
  output: {
    filename: '[name].umd.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'umd',
    library: 'cord',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts', '.mjs', '.json'],
    symlinks: false,
  },
  stats: {
    errorDetails: true,
  },
  optimization: {
    minimize: true,
    // only minimize the *.min* bundle output
    minimizer: [new TerserPlugin({ include: /\.min\.umd\.js$/ })],
  },
}

const webConfig = {
  mode: 'production',
  // build two different bundles from the transpiled js
  entry: {
    sdk: './lib/cjs/index.js',
    'sdk.min': './lib/cjs/index.js',
  },
  output: {
    filename: '[name]-web.umd.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'umd',
    library: 'cord',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts', '.mjs', '.json'],
    symlinks: false,
  },
  stats: {
    errorDetails: true,
  },
  optimization: {
    minimize: true,
    // only minimize the *.min* bundle output
    minimizer: [new TerserPlugin({ include: /\.min\.umd\.js$/ })],
  },
}

module.exports = [ nodeConfig, webConfig ];
