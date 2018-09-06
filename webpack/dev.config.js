const [ client, server ] = require('./base.config');
const mode = 'development'

const { rules, ...rest } = client.module
const newRules = [
  ...rules,
  {
    test: /\.css$/,
    use: [ 'style-loader', 'css-loader']
  }
]

module.exports = [
  {
    ...client,
    module: { rules: newRules, ...rest },
    mode 
  },
  {...server, mode }
]
