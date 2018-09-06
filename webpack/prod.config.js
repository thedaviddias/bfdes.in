const [ client, server ] = require('./base.config');
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const mode = 'production'

// The config for the client bundles the CSS; in production it must be minified
const plugins = [
  ...client.plugins,
  new MiniCSSExtractPlugin({
    filename: "styles/[name].css",
  })
]

const { rules, ...rest } = client.module
const newRules = [
  ...rules,
  {
    test: /\.css$/,
    use: [
      MiniCSSExtractPlugin.loader,
      'css-loader'
    ]
  }
]

module.exports = [
  {
    ...client,
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    module:  {rules: newRules, ...rest },
    plugins,
    mode
  },
  {...server, mode }
]
