import { createServer as createHTTPServer, type Server as HTTPServer, type RequestListener } from "node:http";

import type { Server as WSServer } from "socket.io";

export type ServerConfig = {
  port: number;
};

export class Server {
  private httpServer: HTTPServer;
  private wsServer: WSServer;
  private config: ServerConfig;

  constructor(config: ServerConfig, handler: RequestListener, ws: WSServer) {
    this.httpServer = createHTTPServer(handler);
    this.wsServer = ws;
    this.config = config;

    this.wsServer.attach(this.httpServer);
  }

  start() {
    this.httpServer.listen(this.config.port, () => {
      console.log(`HTTP server listening on port ${this.config.port}`);
    });
  }

  shutdown() {
    const promise = Promise.withResolvers();

    this.httpServer.close(() => {
      console.log("HTTP server stopped");
      promise.resolve(null);
    });

    return promise.promise;
  }
}
