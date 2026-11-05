export function hasNoindexDirective(content) {
  return (content || '').toLowerCase().split(/[\s,]+/).includes('noindex');
}

export function productionRequestAllowed(value, method) {
  try {
    const url = new URL(value);
    return url.origin === 'https://aitoolspk.tech' &&
      ['GET', 'HEAD'].includes(method) && !url.username && !url.password;
  } catch { return false; }
}

export async function guardProductionRoute(route) {
  const request = route.request();
  if (!productionRequestAllowed(request.url(), request.method())) return route.abort();
  let response;
  try {
    // Routing is not repeated for redirect hops: never expose a redirect to Chromium.
    response = await route.fetch({ maxRedirects: 0, maxRetries: 0, timeout: 15000 });
    if (response.status() >= 300 && response.status() < 400) return await route.abort();
    await route.fulfill({ response });
  } catch {
    await route.abort();
  } finally {
    if (response) await response.dispose();
  }
}

export async function fetchProductionSitemap(url) {
  if (!productionRequestAllowed(url, 'GET')) throw new Error('Disallowed production sitemap URL');
  const response = await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15000) });
  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel();
    throw new Error('Production sitemap redirect rejected');
  }
  if (!productionRequestAllowed(response.url, 'GET')) {
    await response.body?.cancel();
    throw new Error('Disallowed production sitemap response URL');
  }
  return response;
}
