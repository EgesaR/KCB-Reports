import {
  type UseQueryResult,
  type QueryFunction,
  useQuery,
} from "@tanstack/react-query";

type UseFetcherOptions<T> = {
  key?: string | readonly unknown[];
  url?: string;
  fetcherFn?: QueryFunction<T>;
};

export function useFetcher<T = unknown>({
  key = ["data"],
  url = "/api/posts",
  fetcherFn,
}: UseFetcherOptions<T> = {}): UseQueryResult<T> {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn:
      fetcherFn ??
      (async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
        return (await res.json()) as T;
      }),
  });
}
