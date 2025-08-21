import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "./v1.ts";

export const fetchClient = createFetchClient<paths>({
  baseUrl: `${String(import.meta.env["SERVER_URL"])}/api/v1`,
});

export const $api = createClient(fetchClient);

export const {
  queryOptions,
  useQuery,
  useInfiniteQuery,
  useMutation,
  useSuspenseQuery,
} = $api;
