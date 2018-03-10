const webpack = require('webpack');
const path  = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
  entry: path.resolve(__dirname, '../src/browser', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
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
      enforce: 'pre', 
      test: /\.js$/,
      use: 'source-map-loader'
    }]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../src/browser', 'index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
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
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname, '../src/server'),
        path.resolve(__dirname, '../src/shared')
      ],
      loader: 'ts-loader'
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
