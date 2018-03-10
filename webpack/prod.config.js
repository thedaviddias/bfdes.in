const [client, server] = require('./base.config');

module.exports = [
  {...client, ...{devtool: 'source-map'}},
  {...server, ...{devtool: 'source-map'}}
]
