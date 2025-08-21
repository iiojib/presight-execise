import { Router } from "express";

import type { PersonsService } from "./app/persons.ts";
import type { StreamService } from "./app/stream.ts";
import type { JobsService } from "./app/jobs.ts";

import { createPersonsRouter } from "./routes/persons.ts";
import { createStreamRouter } from "./routes/stream.ts";
import { createJobsRouter } from "./routes/jobs.ts";

export type Services = {
  personsService: PersonsService;
  streamService: StreamService;
  jobsService: JobsService;
};

export const createRouter = (service: Services) => {
  const router = Router();

  router.use("/persons", createPersonsRouter(service.personsService));
  router.use("/stream", createStreamRouter(service.streamService));
  router.use("/jobs", createJobsRouter(service.jobsService));

  return router;
};
