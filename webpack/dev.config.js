const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    index: 'index.html',
    historyApiFallback: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true,
    port: 8080,
    compress: true,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        pathRewrite: {"^/api" : ""}
      }
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
})
