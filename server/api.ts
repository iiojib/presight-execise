import express, { type Router } from "express";

import { logger } from "./middleware/logger.ts";
import { notFound } from "./middleware/not-found.ts";
import { errorHandler } from "./middleware/error.ts";

export const createAPI = (router: Router) => {
  const api = express();

  api.use(logger);
  api.use(express.json());
  api.use("/api/v1", router);
  api.use(notFound);
  api.use(errorHandler);

  return api;
};
