import z from "zod";

export const PaginationQueryParametersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type PaginationQueryParameters = z.infer<typeof PaginationQueryParametersSchema>;
