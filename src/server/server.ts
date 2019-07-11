import * as http from "http";
import factory from "./index";

function normalizePort(val: number | string): number | string | boolean {
  const port = (typeof val === "string") ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
  console.debug(`Express server listening on ${bind}`);
}

// Create an app given its posts
const app = factory(__posts__);
delete (global as any).__posts__;

// Attempt to normalize the port
const port = normalizePort(process.env.PORT || 8080);

// Listen on provided port, on all network interfaces
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
