const [client, server] = require('./base.config');
const mode = 'production'

module.exports = [
  {...client, mode },
  {...server, mode }
]
