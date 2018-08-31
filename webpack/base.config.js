const webpack = require('webpack');
const path  = require('path');

module.exports = [{
  entry: path.resolve(__dirname, '../src/browser', 'index.tsx'),
  output: {
    filename: 'javascripts/bundle.js',
    publicPath: '/', // public URL of the output directory when referenced in a browser
    path: path.resolve(__dirname, '../dist/static'),
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
      include: path.resolve(__dirname, '../src/shared'),
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
          limit: 8192  // Beyond this limit do not inline files, delegate processing to file-loader
        }
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'true'
    })
  ],
  target: 'web'
}, {
  entry: path.resolve(__dirname, '../src/server', 'server.ts'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
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
      include: path.resolve(__dirname, '../src/shared'),
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          outputPath: 'images/',
          name: '[name].[ext]',
          emitFile: false  // On the server we do not write the files to disk
        }
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false'
    })
  ],
  target: 'node'
}]
