import type { Worker } from "node:worker_threads";

import { faker } from "@faker-js/faker";
import type { Server as WSServer, Socket } from "socket.io";

import type { JobsService as JobsServiceInterface } from "../app/jobs.ts";
import { JobStatus, type Job } from "../models/job.ts";

type JobCompletedMessage = {
  type: "job:completed";
  job: Job;
};

type Message = JobCompletedMessage;

export class JobsService implements JobsServiceInterface {
  private ws: WSServer;
  private worker: Worker;
  private connections: Map<string, Socket>;

  constructor(ws: WSServer, worker: Worker) {
    this.ws = ws;
    this.worker = worker;
    this.connections = new Map<string, Socket>();

    this.ws.on("connection", (socket) => this.onConnection(socket));
    this.worker.on("message", (message: Message) => this.onWorkerMessage(message));
  }

  private onConnection(socket: Socket) {
    this.connections.set(socket.id, socket);
    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  private onDisconnect(socket: Socket) {
    this.connections.delete(socket.id);
    this.worker.postMessage({ type: "job:drop", sessionId: socket.id });
  }

  private onWorkerMessage(message: JobCompletedMessage) {
    this.connections.get(message.job.session_id)?.emit("job:completed", message.job);
  }

  createJob(sessionId: string) {
    const job: Job = {
      id: faker.string.uuid(),
      session_id: sessionId,
      status: JobStatus.pending,
    };

    this.worker.postMessage({ type: "job:start", job });

    return job;
  }
}
