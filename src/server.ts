import { app } from "./app";
import * as http from "http";
import { isProd } from "./utils";
import { SocketIOService } from "./services/socket.io";

const logger = console;

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

const server: http.Server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
SocketIOService.create(server);

function normalizePort(val: number|string): number|string|boolean {
  const $port: number = (typeof val === "string") ? parseInt(val, 10) : val;

  return isNaN($port) ? val : $port >= 0 ? $port : false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
      throw error;
  }
  const bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
  switch (error.code) {
      case "EACCES":
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
      case "EADDRINUSE":
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
      default:
          throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}, and listing in production mode: ${isProd ? "PROD" : "DEV"}`);
}


export default server;
