import { Router } from "express";
import z from "zod";

import type { PersonsService } from "../app/persons.ts";

import { validate } from "../middleware/validate.ts";
import { PaginationQueryParametersSchema } from "../libs/pagination.ts";

const PersonListFiltersSchema = z.object({
  search: z.string().max(512).optional(),
  nationalities: z.union([
    z.string().trim().nonempty(),
    z.array(z.string().trim().nonempty())
  ]).optional(),
  hobbies: z.union([
    z.string().trim().nonempty(),
    z.array(z.string().trim().nonempty())
  ]).optional(),
});

const PersonListQueryParametersSchema = z.object({
  ...PersonListFiltersSchema.shape,
  ...PaginationQueryParametersSchema.shape,
});

export const createPersonsRouter = (personsService: PersonsService) => {
  const router = Router();

  router.get("/", validate({ query: PersonListQueryParametersSchema }), async (req, res) => {
    const persons = await personsService.getPersons(req.query);

    res.json(persons);
  });

  router.get("/top-nationalities", async (_req, res) => {
    const nationalities = await personsService.getTopNationalities();

    res.json(nationalities);
  });

  router.get("/top-hobbies", async (_req, res) => {
    const hobbies = await personsService.getTopHobbies();

    res.json(hobbies);
  });

  return router;
};
