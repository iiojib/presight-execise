import type { Job } from "../models/job.ts";

export type JobsService = {
  createJob: (sessionId: string) => Job;
};
