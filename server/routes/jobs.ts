import { Router } from "express";
import z from "zod";

import type { JobsService } from "../app/jobs.ts";
import { validate } from "../middleware/validate.ts";

const CreateJobParamsSchema = z.object({
  sessionId: z.string(),
});

export const createJobsRouter = (jobsService: JobsService) => {
  const router = Router();

  router.post("/:sessionId", validate({ params: CreateJobParamsSchema }), (req, res) => {
    const sessionId = req.params.sessionId;
    const job = jobsService.createJob(sessionId);

    res.json(job);
  });

  return router;
};
