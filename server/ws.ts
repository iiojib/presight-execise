import { Server } from "socket.io";

export const createWSServer = () => {
  const server = new Server({ path: "/ws" });

  return server;
};
