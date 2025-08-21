import { useEffect, useMemo, useState } from "react";

export const useMatchMedia = (query: string) => {
  const mediaQuery = useMemo(() => {
    if (typeof document === "undefined") return null;
    return window.matchMedia(query);
  }, [query]);

  const [, setMatches] = useState(mediaQuery?.matches);

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery?.addEventListener("change", listener);

    return () => mediaQuery?.removeEventListener("change", listener);
  }, [mediaQuery]);

  return mediaQuery?.matches ?? false;
};
