import { useEffect, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import type { components } from "../api/v1";
import { useMatchMedia } from "../utils/useMatchMedia";
import { PersonCard, PersonCardSkeleton } from "./PersonCard";

export type PersonListProps = {
  persons: components["schemas"]["Person"][];
  hasMore?: boolean | undefined;
  isLoading?: boolean | undefined;
  requestNextPage?: (() => void) | undefined;
};

export const PersonList = ({ persons, hasMore, isLoading, requestNextPage }: PersonListProps) => {
  const isSmall = useMatchMedia("(min-width: 896px)");
  const isMedium = useMatchMedia("(min-width: 1280px)");
  const isLarge = useMatchMedia("(min-width: 1536px)");

  const columnCount = useMemo(() => {
    if (isLarge) return 4;
    if (isMedium) return 3;
    if (isSmall) return 2;
    return 1;
  }, [isSmall, isMedium, isLarge]);

  let rowCount = 5;

  if (persons.length > 0) {
    rowCount = Math.ceil(persons.length / columnCount);
  }

  if (hasMore) {
    rowCount += 1;
  }

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 120,
    overscan: 2,
    gap: 16,
  });

  const rows = virtualizer.getVirtualItems();

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    const lastItem = rows[rows.length - 1];

    if (lastItem?.index === rowCount - 1 && hasMore && !isLoading) {
      requestNextPage?.();
    }
  }, [hasMore, rowCount, isLoading, rows]);

  return (
    <div className="relative" style={{ height: `${virtualizer.getTotalSize()}px` }}>
      {rows.map((virtualRow) => (
        <div
          key={virtualRow.key}
          data-size={columnCount}
          className="absolute w-full grid gap-4 data-[size=1]:grid-cols-1 data-[size=2]:grid-cols-2 data-[size=3]:grid-cols-3 data-[size=4]:grid-cols-4"
          style={{ transform: `translateY(${virtualRow.start}px)` }}
        >
          {Array.from({ length: columnCount }, (_, index) => {
            const personIndex = virtualRow.index * columnCount + index;
            const person = persons[personIndex];

            if (!person) {
              if (hasMore || isLoading) {
                // biome-ignore lint/suspicious/noArrayIndexKey: ignore
                return <PersonCardSkeleton key={index} />;
              }

              return null;
            }

            return <PersonCard key={person.id} person={person} />;
          })}
        </div>
      ))}
    </div>
  );
};
