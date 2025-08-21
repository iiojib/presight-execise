import { useSearchParams } from "react-router";

import { useInfiniteQuery, useQuery } from "../api/client";
import { PersonFilter } from "../persons/PersonFilter";
import { PersonList } from "../persons/PersonList";
import { PersonSearch } from "../persons/PersonSearch";

export const Persons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const hobbies = searchParams.getAll("hobbies");
  const nationalities = searchParams.getAll("nationalities");

  const nationalitiesQuery = useQuery("get", "/persons/top-nationalities");
  const hobbiesQuery = useQuery("get", "/persons/top-hobbies");

  const personsQuery = useInfiniteQuery("get", "/persons", {
      params: {
        query: {
          search,
          nationalities,
          hobbies,
          limit: 20,
        },
      },
  }, {
      pageParamName: "page",
      initialPageParam: 1,
      getNextPageParam: (lastPage: unknown[], _allPages: unknown, lastPageParam: number) => {
        if (lastPage.length < 20) return null;
        return lastPageParam + 1;
      },
  });

  if (nationalitiesQuery.isError || hobbiesQuery.isError || personsQuery.isError) {
    throw nationalitiesQuery.error || hobbiesQuery.error || personsQuery.error;
  }

  const submitSearch = (value: string) => {
    setSearchParams((params) => {
      params.set("search", value);

      return params;
    });
  };

  const setNationality = (name: string, checked: boolean) => {
    setSearchParams((params) => {
      if (checked) {
        params.append("nationalities", name);
      } else {
        params.delete("nationalities", name);
      }

      return params;
    });
  };

  const setHobby = (name: string, checked: boolean) => {
    setSearchParams((params) => {
      if (checked) {
        params.append("hobbies", name);
      } else {
        params.delete("hobbies", name);
      }

      return params;
    });
  };

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
            <h3 className="text-2xl sm:text-4xl font-bold">Person List</h3>
          </div>

          <search
            className="
              sticky top-16 z-1
              h-16 border-b-1 px-8 row-start-3
              flex place-items-center
              bg-white dark:bg-gray-900
              border-gray-300/50 dark:border-gray-700/50
            "
          >
            <PersonSearch value={search} onSubmit={submitSearch} />
          </search>
        </div>

        <aside
          className="
            col-start-2 col-end-3 row-start-1 row-end-6
            flex place-items-start
          "
        >
          <div
            className="
              sticky top-16 p-8 w-3xs
              overflow-x-hidden overflow-y-auto max-h-[calc(100vh-calc(var(--spacing)*16))]
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-auto
            "
          >
            <div className="flex flex-col gap-4 text-gray-800 dark:text-gray-300">
              <PersonFilter
                isLoading={hobbiesQuery.isLoading}
                items={hobbiesQuery.data ?? []}
                selection={hobbies}
                onItemChange={setHobby}
              >
                Filter by Hobbies:
              </PersonFilter>

              <PersonFilter
                isLoading={nationalitiesQuery.isLoading}
                items={nationalitiesQuery.data ?? []}
                selection={nationalities}
                onItemChange={setNationality}
              >
                Filter by Nationalities:
              </PersonFilter>
            </div>
          </div>
        </aside>
      </div>

      <section className="p-8 col-start-2 col-end-3 row-start-4 row-end-5">
        <PersonList
          hasMore={personsQuery.hasNextPage}
          isLoading={personsQuery.isFetching}
          persons={personsQuery.data?.pages.flat() ?? []}
          requestNextPage={personsQuery.fetchNextPage}
        />
      </section>
    </div>
  );
};
