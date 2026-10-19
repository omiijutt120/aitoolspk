export function emitCatalogEvent(name: 'search' | 'filter_apply') {
  window.dispatchEvent(
    new CustomEvent('aitoolspk:analytics', { detail: { name } })
  );
}
