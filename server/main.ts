import { Worker } from "node:worker_threads";

import { createConfig } from "./config.ts";
import { createDB } from "./db.ts";
import { createWSServer } from "./ws.ts";
import { createAPI } from "./api.ts";
import { createRouter } from "./router.ts";
import { Server } from "./server.ts";

import { PersonsService } from "./services/persons.ts";
import { StreamService } from "./services/stream.ts";
import { JobsService } from "./services/jobs.ts";
import { PersonsRepository } from "./repositories/persons.ts";

const config = createConfig();

const db = createDB(config.db);
const ws = createWSServer();
const worker = new Worker(new URL(import.meta.resolve("#worker")));

const personsRepository = new PersonsRepository(db);

const personsService = new PersonsService(personsRepository);
const streamService = new StreamService();
const jobsService = new JobsService(ws, worker);

const router = createRouter({
  personsService,
  streamService,
  jobsService,
});

const api = createAPI(router);
const server = new Server(config.server, api, ws);

let shuttingDown = false;

const shutdown = async (signal: string) => {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`${signal} received: starting graceful shutdown`);

  await Promise.all([
    server.shutdown(),
    db.destroy(),
    ws.close(),
    worker.terminate(),
  ]);
};

["SIGTERM", "SIGINT"].forEach((sig) => {
  process.on(sig, () => shutdown(sig));
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err);
  shutdown("uncaughtException");
});

server.start();
