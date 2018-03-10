const [client, server] = require('./base.config');

module.exports = [
  {...client, ...{devtool: 'inline-source-map'}},
  {...server, ...{devtool: 'inline-source-map'}}
]
