const [client, server] = require('./base.config');
const mode = 'development'

module.exports = [
  {...client, mode, },
  {...server, mode, }
]
