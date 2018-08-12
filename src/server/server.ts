import * as http from 'http'
import factory from './index'
import { parseFiles } from './utils'

// Create an app given the path to its posts
const posts = parseFiles(process.argv.pop())
const app = factory(posts)

// Attempt to normalize the port and store it on the app for reference
const port = normalizePort(process.env.PORT || 8080)
app.set('port', port)

// Listen on provided port, on all network interfaces
const server = http.createServer(app);
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val: number | string): number | string | boolean {
  const port = (typeof val === 'string') ? parseInt(val, 10) : val
  if(isNaN(port)) {
    // named pipe
    return val
  }

  if(port >= 0) {
    // port number
    return port
  }
  return false
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address()
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
  console.debug(`Express server listening on ${bind}`)
}
