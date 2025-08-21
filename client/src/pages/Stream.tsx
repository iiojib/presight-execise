import { useQuery } from "../api/client";
import { StreamPrinter } from "../stream/StreamPrinter";

export const Stream = () => {
  const { data, isError, error } = useQuery("get", "/stream", { parseAs: "stream" }, {
      gcTime: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
  });

  if (isError) {
    throw error;
  }

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
            <h3 className="text-2xl sm:text-4xl font-bold">Stream</h3>
          </div>
        </div>
      </div>

      <section className="p-8 col-start-2 col-end-3 row-start-4 row-end-5">
        <StreamPrinter stream={data} />
      </section>
    </div>
  );
};
