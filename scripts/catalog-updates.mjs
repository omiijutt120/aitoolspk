// Explicit owner changes take precedence over the immutable supplier snapshot.
// Consolidated records retain their IDs for inventory/import history but are
// excluded from the public catalog and can never regain purchase eligibility.
export function applyCatalogUpdates(products, updates = {}) {
  const ids = new Set(products.map((p) => p.id));
  const patches = updates.products || {};
  const mergedIds = new Set();
  const allowed = new Set(['price', 'warranty', 'date']);
  for (const [id, patch] of Object.entries(patches)) {
    if (!ids.has(id)) throw new Error(`Unknown catalog update ID ${id}`);
    if (Object.keys(patch).some((field) => !allowed.has(field)))
      throw new Error(`Unsupported catalog update field for ${id}`);
    if (
      patch.price !== undefined &&
      (!Number.isSafeInteger(patch.price) || patch.price <= 0)
    )
      throw new Error(`Invalid catalog update price for ${id}`);
    if (
      patch.warranty !== undefined &&
      (typeof patch.warranty !== 'string' ||
        !patch.warranty.trim() ||
        /[<>]|https?:/i.test(patch.warranty))
    )
      throw new Error(`Invalid catalog update warranty for ${id}`);
    if (
      patch.date !== undefined &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(patch.date) ||
        new Date(patch.date).toISOString().slice(0, 10) !== patch.date)
    )
      throw new Error(`Invalid catalog update date for ${id}`);
    if (patch.price !== undefined && !patch.date)
      throw new Error(`Price confirmation date required for ${id}`);
  }
  const groups = updates.consolidations || {};
  for (const [keep, merge] of Object.entries(groups)) {
    if (!ids.has(keep) || !Array.isArray(merge))
      throw new Error(`Invalid consolidation target ${keep}`);
    const target = products.find((p) => p.id === keep);
    for (const id of merge) {
      const product = products.find((p) => p.id === id);
      if (
        !product ||
        id === keep ||
        mergedIds.has(id) ||
        groups[id] ||
        product.brandSlug !== target.brandSlug ||
        product.duration !== target.duration
      )
        throw new Error(`Invalid consolidated product ${id}`);
      mergedIds.add(id);
    }
  }
  return products.map((p) => ({
    ...p,
    ...patches[p.id],
    ...(mergedIds.has(p.id)
      ? { approval: 'excluded', purchasable: false }
      : {}),
  }));
}
