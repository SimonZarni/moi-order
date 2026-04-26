interface ItunesLookupResponse {
  resultCount: number;
  results: Array<{ version: string }>;
}

export interface AppStoreVersionResult {
  version: string;
}

export async function fetchAppStoreVersion(
  bundleId: string,
): Promise<AppStoreVersionResult | null> {
  const response = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(bundleId)}`,
  );
  if (!response.ok) return null;
  const json = (await response.json()) as ItunesLookupResponse;
  const entry = json.results[0];
  if (json.resultCount === 0 || entry === undefined) return null;
  return { version: entry.version };
}
