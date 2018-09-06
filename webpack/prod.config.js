const [ client, server ] = require('./base.config');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const mode = 'production'

module.exports = [
  {
    ...client,
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    mode
  },
  {...server, mode }
]
