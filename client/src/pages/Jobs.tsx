import { use, useEffect } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";

import { queryOptions } from "../api/client";
import { JobSubscriptionContext } from "../jobs/JobsSubscription";
import { hasOwn } from "../utils/hasOwn";

export const Jobs = () => {
  const queryClient = useQueryClient();
  const { sessionId, subscribe } = use(JobSubscriptionContext);

  const queries = useQueries({
    queries: Array.from({ length: 20 }, (_, i) => queryOptions("post", "/jobs/{sessionId}", {
      key: `${sessionId}-${i}`,
      params: {
        path: {
          sessionId,
        }
      },
    }, {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    })),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    return subscribe((data) => {
      queryClient.setQueriesData({
        predicate: ({ state }) => {
          if (hasOwn(state.data, "id")) {
            return state.data.id === data.id;
          }

          return false;
        },
      }, data);
    });
  }, [sessionId]);

  return (
    <div className="grid grid-cols-[1fr_minmax(0,1280px)_1fr] grid-rows-[0_minmax(0,auto)_minmax(0,auto)_1fr_0]">
      <div className="col-start-2 col-end-4 row-start-1 row-end-6 grid grid-cols-subgrid grid-rows-subgrid">
        <div
          className="
            col-start-1 col-end-2 row-start-1 row-end-5
            grid grid-cols-subgrid grid-rows-subgrid
          "
        >
          <div className="p-8 row-start-2">
            <h3 className="text-2xl sm:text-4xl font-bold">Async Jobs</h3>
          </div>
        </div>
      </div>

      <section className="p-8 col-start-2 col-end-3 row-start-4 row-end-5">
        <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="sticky top-16 bg-white dark:bg-gray-900">
              <th className="px-3 py-2 whitespace-nowrap text-left">ID</th>
              <th className="px-3 py-2 whitespace-nowrap text-center w-5/10">Result</th>
              <th className="px-3 py-2 whitespace-nowrap text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800">
            {queries.map((query, i) => {
              const { data, isPending, isLoading, isError } = query;

              if (isLoading || isPending) {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ignore
                  <tr key={i}>
                    <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-center">
                      Creating...
                    </td>
                  </tr>
                );
              }

              if (isError) {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ignore
                  <tr key={i}>
                    <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-center">
                      Error: {String(query.error)}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={query.data?.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-left">{data?.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">{data?.result ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">{data?.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
