import { isMainThread, parentPort } from "node:worker_threads";

import { faker } from "@faker-js/faker";

import { type Job, JobStatus } from "./models/job.ts";
import { Queue } from "./libs/queue.ts";

if (isMainThread) {
  throw new Error("Worker cannot be imported in main thread.");
}

type JobStartMessage = {
  type: "job:start";
  job: Job;
};

type JobDropMessage = {
  type: "job:drop";
  sessionId: string;
};

type Message = JobStartMessage | JobDropMessage;

class JobProcess {
  static ABORT_SIGNAL = Symbol("abort_process");

  private reject: (reason: unknown) => void;

  job: Job;
  promise: Promise<void>;

  constructor(job: Job) {
    const { promise, reject } = Promise.withResolvers<void>();

    this.job = job;
    this.promise = promise;
    this.reject = reject;
  }

  abort() {
    this.reject(JobProcess.ABORT_SIGNAL);
  }
}

const queue = new Queue<Job>();
const sessionJobsMap = new Map<string, Job[]>();
let activeProcess: JobProcess | null = null;

parentPort?.on("message", (data: Message) => {
  switch (data.type) {
    case "job:start":
      startJob(data.job);
      break;

    case "job:drop":
      dropJobs(data.sessionId);
      break;
  }
});

function startJob(job: Job) {
  let sessionJobs = sessionJobsMap.get(job.session_id);

  if (!sessionJobs) {
    // biome-ignore lint/suspicious/noAssignInExpressions: ignore
    sessionJobsMap.set(job.session_id, (sessionJobs = []));
  }

  sessionJobs.push(job);
  queue.enqueue(job);

  if (!activeProcess) {
    processQueue();
  }
}

function dropJobs(sessionId: string) {
  const sessionJobs = sessionJobsMap.get(sessionId);

  if (sessionJobs) {
    sessionJobsMap.delete(sessionId);
    sessionJobs.forEach((job) => {
      queue.remove(job);

      if (activeProcess?.job === job) {
        activeProcess.abort();
      }
    });
  }
}

function next() {
  const job = queue.dequeue();

  if (!job) return null;

  return new JobProcess(job);
}

async function processQueue() {
  // biome-ignore lint/suspicious/noAssignInExpressions: ignore
  while ((activeProcess = next())) {
    try {
      await Promise.race([
        activeProcess.promise,
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      activeProcess.job.result = faker.string.hexadecimal({ length: 64 });
      activeProcess.job.status = JobStatus.completed;

      parentPort?.postMessage({
        type: "job:completed",
        job: activeProcess.job,
      });
    } catch (error) {
      if (error === JobProcess.ABORT_SIGNAL) {
        continue;
      }

      throw error;
    }
  }
}
