const webpack = require('webpack');
const path  = require('path');

module.exports = [{
  entry: path.resolve(__dirname, '../src/browser', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname, '../src/browser'),
        path.resolve(__dirname, '../src/shared')
      ],
      use: 'ts-loader'
    }, {
      test: /\.(jpg|png|svg)$/,
      include: path.resolve(__dirname, '../src/shared/images'),
      use: 'url-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'true'
    })
  ],
  target: 'web'
}, {
  entry: path.resolve(__dirname, '../src/server', 'index.tsx'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname, '../src/server'),
        path.resolve(__dirname, '../src/shared')
      ],
      loader: 'ts-loader'
    }, {
      test: /\.(jpg|png|svg)$/,
      include: path.resolve(__dirname, '../src/shared/images'),
      use: 'url-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false'
    })
  ],
  target: 'node',
  externals: [
    // Every non-relative module is external
    // abc -> require("abc")
    /^[a-z\-0-9]+$/
  ]
}]
