import { ZodError, type ZodType } from "zod";
import type { NextFunction, Request, Response } from "express";

type ParamsSchema<Params> = { params: ZodType<Params> } | { params?: never };
type QuerySchema<Query> = { query: ZodType<Query> } | { query?: never };
type BodySchema<Body> = { body: ZodType<Body> } | { body?: never };

type RequestSchema<Params, Query, Body> = ParamsSchema<Params> & QuerySchema<Query> & BodySchema<Body>;

export const validate = <Params extends {}, Query extends {}, Body extends {}>(
  schema: RequestSchema<Params, Query, Body>,
) => {
  return (req: Request<Params, unknown, Body, Query>, res: Response, next: NextFunction) => {
    try {
      if (schema.params) req.params = schema.params.parse(req.params);
      if (schema.query) Object.defineProperty(req, "query", { value: schema.query.parse(req.query) });
      if (schema.body) req.body = schema.body.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json({
          message: "Validation failed",
          errors: err.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
            message: issue.message,
          })),
        });

        return;
      }

      next(err);
    }
  };
};
