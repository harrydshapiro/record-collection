import Cache from "file-system-cache";

const cache = Cache({
  basePath: "./.cache", // (optional) Path where cache files are stored (default).
  ns: "my-namespace", // (optional) A grouping namespace for items.
  hash: "sha1", // (optional) A hashing algorithm used within the cache key.
});

/**
 * Implements a read-through cache strategy where the cache is favored,
 * and we fall back to the primary data source if it is not present in the cache.
 *
 * Upon every read, the cache is updated. If reading from the cache, the update happens
 * async. If reading from the data source, we update the cache after results are returned.
 *
 * There might be a standard name for this strategy, not sure - googled and couldn't find it.
 */
export async function readThroughWithBackgroundRefresh<T>({
  cacheKey,
  dataFetchCb,
}: {
  cacheKey: string;
  dataFetchCb: () => Promise<T>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cachedResults = await cache.get(cacheKey);
  console.log('CACHED RESULTS ARE', { cachedResults })
  const newData = dataFetchCb().then((r) => {
    cache.set(cacheKey, r).catch((error: unknown) =>
      console.error(`Error caching results`, {
        error,
        cacheKey,
        results: JSON.stringify(r),
      }),
    );
    return r;
  });
  console.log("about to return")
  return (cachedResults || (await newData)) as T;
}
