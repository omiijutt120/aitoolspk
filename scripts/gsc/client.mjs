/**
 * Thin Search Console API client. Every call names the endpoint it hit in its
 * error text, because the usual failure is a property identifier that does not
 * match the verified one, not a network fault.
 *
 * Rate limits honoured here: URL Inspection allows 2,000 calls per property
 * per day and 600 per minute, so the inspector waits between calls and backs
 * off on 429 instead of firing the whole sitemap at once.
 */
import {
  buildAssertion,
  CREDENTIAL_HELP,
  GscConfigError,
  resolveServiceAccount,
  TOKEN_ENDPOINT,
} from './credentials.mjs';

export const INSPECT_ENDPOINT =
  'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
export const WEBMASTERS = 'https://www.googleapis.com/webmasters/v3';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAccessToken({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Math.floor(Date.now() / 1000),
} = {}) {
  const direct = env.GSC_ACCESS_TOKEN?.trim();
  if (direct) return { token: direct, source: 'GSC_ACCESS_TOKEN' };
  const credentials = resolveServiceAccount(env);
  if (!credentials) throw new GscConfigError(CREDENTIAL_HELP);
  const assertion = buildAssertion(credentials, { now });
  const response = await fetchImpl(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = {};
  }
  if (!response.ok)
    throw new GscConfigError(
      `Google refused the service account ${credentials.client_email}: ${
        payload.error_description || payload.error || response.status
      }. Check that the Search Console API is enabled and the key is current.`
    );
  if (!payload.access_token)
    throw new GscConfigError('Google returned no access_token.');
  return {
    token: payload.access_token,
    source: `service-account:${credentials.client_email}`,
    identity: credentials.client_email,
  };
}

async function requestJson(
  url,
  {
    token,
    method = 'GET',
    body,
    fetchImpl = globalThis.fetch,
    retries = 3,
    label,
  }
) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response;
    try {
      response = await fetchImpl(url, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await sleep(500 * 2 ** attempt);
      continue;
    }
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }
    if (response.ok) return payload ?? {};
    const detail =
      payload?.error?.message ||
      payload?.error_description ||
      text.slice(0, 200);
    lastError = new Error(
      `${label}: HTTP ${response.status}${detail ? ` — ${detail}` : ''}`
    );
    if (response.status === 429 || response.status >= 500) {
      if (attempt === retries) break;
      await sleep(Math.min(8000, 600 * 2 ** attempt));
      continue;
    }
    if (response.status === 401)
      throw new GscConfigError(
        `${label}: the access token was rejected. Regenerate it and retry.`
      );
    if (response.status === 403)
      throw new GscConfigError(
        `${label}: this credential cannot read that property. Add the service account address as a user in Search Console, then retry.`
      );
    if (response.status === 404)
      throw new GscConfigError(
        `${label}: property not found. Run "npm run gsc:sites" to see the exact identifier to pass with --site.`
      );
    throw lastError;
  }
  throw lastError;
}

export async function listSites({ token, fetchImpl } = {}) {
  const payload = await requestJson(`${WEBMASTERS}/sites`, {
    token,
    fetchImpl,
    label: 'sites.list',
  });
  return (payload.siteEntry ?? []).map((entry) => ({
    siteUrl: entry.siteUrl,
    permissionLevel: entry.permissionLevel,
  }));
}

export async function querySearchAnalytics({
  token,
  site,
  startDate,
  endDate,
  dimensions,
  rowLimit = 25000,
  dataState = 'all',
  fetchImpl,
} = {}) {
  const payload = await requestJson(
    `${WEBMASTERS}/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      token,
      method: 'POST',
      fetchImpl,
      label: `searchAnalytics(${dimensions.join('+')})`,
      body: {
        startDate,
        endDate,
        dimensions,
        rowLimit,
        dataState,
        type: 'web',
      },
    }
  );
  return payload.rows ?? [];
}

/**
 * Inspects one URL. Returns only the fields this repository acts on; the raw
 * response is deliberately not stored so an inspection cannot leak anything
 * beyond the URL's own index state.
 */
export async function inspectUrl({ token, site, url, fetchImpl } = {}) {
  const payload = await requestJson(INSPECT_ENDPOINT, {
    token,
    method: 'POST',
    fetchImpl,
    label: `urlInspection ${url}`,
    body: { inspectionUrl: url, siteUrl: site },
  });
  const result = payload.inspectionResult ?? {};
  const index = result.indexStatusResult ?? {};
  return {
    url,
    verdict: index.verdict ?? '',
    coverageState: index.coverageState ?? '',
    robotsTxtState: index.robotsTxtState ?? '',
    indexingState: index.indexingState ?? '',
    pageFetchState: index.pageFetchState ?? '',
    lastCrawlTime: index.lastCrawlTime ?? '',
    googleCanonical: index.googleCanonical ?? '',
    userCanonical: index.userCanonical ?? '',
    crawledAs: index.crawledAs ?? '',
    sitemapCount: (index.sitemap ?? []).length,
    referringUrlCount: (index.referringUrls ?? []).length,
  };
}

export { sleep };
