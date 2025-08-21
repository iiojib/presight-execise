import { Router } from "express";

import type { StreamService } from "../app/stream.ts";

export const createStreamRouter = (streamService: StreamService) => {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(200).type("text/plain");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders();
    res.socket?.setNoDelay(true);

    const text = streamService.getText();

    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        res.write(text[i]);
        i++;
        return;
      }

      clearInterval(interval);
      res.end();
    }, 0);

    res.on("close", () => clearInterval(interval));
  });

  return router;
};
