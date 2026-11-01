export function productionRequestAllowed(value, method) {
  try {
    const url = new URL(value);
    return url.origin === 'https://aitoolspk.tech' &&
      ['GET', 'HEAD'].includes(method) && !url.username && !url.password;
  } catch { return false; }
}
