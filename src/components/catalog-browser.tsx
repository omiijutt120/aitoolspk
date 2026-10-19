'use client';
import {
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useRef,
} from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Search, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/categories';
import { ProductCard } from './product-card';
import { emitCatalogEvent } from '@/lib/events';
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  window.addEventListener('catalog-query', cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener('catalog-query', cb);
  };
};
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';
function Select({
  label,
  param,
  values,
  params,
  update,
}: {
  label: string;
  param: string;
  values: { value: string; label: string }[];
  params: URLSearchParams;
  update: (key: string, value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select
        aria-label={label}
        value={params.get(param) || ''}
        onChange={(e) => update(param, e.target.value)}
      >
        <option value="">All {label.toLowerCase()}</option>
        {values.map((v) => (
          <option value={v.value} key={v.value}>
            {v.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function CatalogBrowser({
  initial,
  category,
  options,
  total,
}: {
  initial: Product[];
  category?: string;
  options: {
    brands: string[];
    durations: string[];
    warranties: string[];
    accesses: string[];
  };
  total: number;
}) {
  const queryString = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const params = useMemo(() => new URLSearchParams(queryString), [queryString]);
  const q = params.get('q') || '';
  const [debounced, setDebounced] = useState(q);
  const [all, setAll] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(q);
      if (q.trim()) emitCatalogEvent('search');
    }, 180);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/catalog/index.json', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Catalog unavailable');
        return r.json();
      })
      .then(setAll)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('focus') === 'search')
      searchRef.current?.focus();
  }, []);
  useEffect(() => {
    if (mobileOpen) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);
  function update(key: string, value: string) {
    if (!['q', 'page'].includes(key)) emitCatalogEvent('filter_apply');
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${next.size ? '?' + next.toString() : ''}`
    );
    window.dispatchEvent(new Event('catalog-query'));
  }
  function clear() {
    window.history.replaceState(null, '', window.location.pathname);
    window.dispatchEvent(new Event('catalog-query'));
  }
  const source = useMemo(
    () => all?.filter((p) => !category || p.category === category) ?? initial,
    [all, category, initial]
  );
  const fuse = useMemo(
    () =>
      new Fuse(source, {
        keys: [
          { name: 'name', weight: 3 },
          { name: 'brand', weight: 2 },
          'category',
          'description',
        ],
        threshold: 0.34,
        ignoreDiacritics: true,
        ignoreLocation: true,
      }),
    [source]
  );
  const filtered = useMemo(() => {
    const found = debounced.trim()
      ? fuse.search(debounced.trim()).map((r) => r.item)
      : source;
    const results = found.filter(
      (p) =>
        (!params.get('category') || p.category === params.get('category')) &&
        (!params.get('brand') || p.brand === params.get('brand')) &&
        (!params.get('duration') || p.duration === params.get('duration')) &&
        (!params.get('warranty') || p.warranty === params.get('warranty')) &&
        (!params.get('access') || p.access === params.get('access')) &&
        (!params.get('stock') || p.stock === params.get('stock')) &&
        (!params.get('approval') || p.approval === params.get('approval')) &&
        (!params.get('min') || p.price >= Number(params.get('min'))) &&
        (!params.get('max') || p.price <= Number(params.get('max')))
    );
    switch (params.get('sort')) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return results;
  }, [debounced, fuse, source, params]);
  const pageSize = 24;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(pages, Math.max(1, Number(params.get('page')) || 1));
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);
  const suggestions =
    q.trim().length > 1 && q === debounced
      ? fuse
          .search(q)
          .slice(0, 4)
          .map((r) => r.item)
      : [];
  const [suggestOpen, setSuggestOpen] = useState(false);
  const isFiltered = Array.from(params.keys()).some(
    (k) => !['focus', 'sort', 'page'].includes(k)
  );
  const close = () => {
    setMobileOpen(false);
    filterTrigger.current?.focus();
  };
  const filters = (
    <div className="filter-panel">
      <div className="filter-heading">
        <h2>Refine your search</h2>
        <button className="filter-clear" onClick={clear}>
          Reset
        </button>
      </div>
      {!category && (
        <Select
          params={params}
          update={update}
          label="Categories"
          param="category"
          values={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
      )}
      <Select
        params={params}
        update={update}
        label="Brands"
        param="brand"
        values={options.brands.map((v) => ({ value: v, label: v }))}
      />
      <Select
        params={params}
        update={update}
        label="Durations"
        param="duration"
        values={options.durations.map((v) => ({ value: v, label: v }))}
      />
      <Select
        params={params}
        update={update}
        label="Warranty terms"
        param="warranty"
        values={options.warranties.map((v) => ({ value: v, label: v }))}
      />
      <Select
        params={params}
        update={update}
        label="Access types"
        param="access"
        values={options.accesses.map((v) => ({ value: v, label: v }))}
      />
      <Select
        params={params}
        update={update}
        label="Availability"
        param="stock"
        values={[
          { value: 'in-stock', label: 'Source reports stock (not live)' },
          { value: 'out-of-stock', label: 'Out of stock' },
          { value: 'unconfirmed', label: 'Stock unconfirmed' },
        ]}
      />
      <Select
        params={params}
        update={update}
        label="Review status"
        param="approval"
        values={[
          { value: 'approved', label: 'Approved for sale' },
          { value: 'pending', label: 'Pending verification' },
        ]}
      />
      <div className="filter-field">
        <span>Price range (PKR)</span>
        <div className="price-inputs">
          <input
            aria-label="Minimum price in PKR"
            type="number"
            min="0"
            placeholder="Min"
            value={params.get('min') || ''}
            onChange={(e) => update('min', e.target.value)}
          />
          <input
            aria-label="Maximum price in PKR"
            type="number"
            min="0"
            placeholder="Max"
            value={params.get('max') || ''}
            onChange={(e) => update('max', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div className="catalog-layout">
      <aside className="desktop-filters" aria-label="Catalog filters">
        {filters}
      </aside>
      <div className="catalog-results">
        <div className="search-wrap">
          <div className="search-form catalog-search">
            <Search size={19} aria-hidden="true" />
            <label htmlFor="catalog-search" className="sr-only">
              Search tools, brands or tasks
            </label>
            <input
              ref={searchRef}
              id="catalog-search"
              autoComplete="off"
              placeholder="Search tools, brands or tasks…"
              value={q}
              onChange={(e) => {
                update('q', e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              onBlur={(e) => {
                if (
                  !e.currentTarget.parentElement?.parentElement?.contains(
                    e.relatedTarget
                  )
                )
                  setSuggestOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSuggestOpen(false);
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setSuggestOpen(false);
                }
              }}
            />
            {q && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  update('q', '');
                  searchRef.current?.focus();
                }}
              >
                <X size={17} />
              </button>
            )}
          </div>
          {suggestOpen && suggestions.length > 0 && (
            <div className="suggestions" aria-label="Suggested tools">
              {suggestions.map((p) => (
                <Link href={`/tool/${p.slug}/`} key={p.id} prefetch={false}>
                  {p.name}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="catalog-toolbar">
          <p className="result-count" role="status" aria-live="polite">
            {all
              ? `${filtered.length} ${filtered.length === 1 ? 'offer' : 'offers'}${isFiltered ? ' found' : ''}`
              : `${total} offers · Loading filters…`}
          </p>
          <button
            ref={filterTrigger}
            className="button outline mobile-filter-button"
            onClick={() => setMobileOpen(true)}
          >
            <SlidersHorizontal size={15} />
            Filters {isFiltered && '•'}
          </button>
          <div className="catalog-sort">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={params.get('sort') || 'relevance'}
              onChange={(e) => update('sort', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>
        <p className="catalog-notice">
          Prices and stock are snapshots. Pending offers require approval;
          source warranty labels are unverified. Confirm current terms before
          payment.
        </p>
        {error && (
          <p role="alert" className="catalog-notice">
            The full catalog could not load. Showing a saved selection.{' '}
            <button
              className="filter-clear"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </p>
        )}
        {shown.length ? (
          <div className="product-grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No tools found.</h2>
            <p>Try a different spelling, a broader search or fewer filters.</p>
            <button className="button outline" onClick={clear}>
              Clear all filters
            </button>
          </div>
        )}
        {pages > 1 && (
          <nav aria-label="Catalog pages" className="pagination">
            <button
              disabled={page === 1}
              onClick={() => update('page', String(page - 1))}
              aria-label="Previous page"
            >
              ←
            </button>
            {Array.from(
              new Set([
                1,
                ...Array.from({ length: 5 }, (_, i) => page - 2 + i).filter(
                  (n) => n > 1 && n < pages
                ),
                pages,
              ])
            )
              .sort((a, b) => a - b)
              .map((n, i, arr) => (
                <span key={n}>
                  {i > 0 && n - arr[i - 1] > 1 && (
                    <span className="px-2" aria-hidden="true">
                      …
                    </span>
                  )}
                  <button
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => {
                      update('page', String(n));
                      searchRef.current?.scrollIntoView({ block: 'center' });
                    }}
                  >
                    {n}
                  </button>
                </span>
              ))}
            <button
              disabled={page === pages}
              onClick={() => update('page', String(page + 1))}
              aria-label="Next page"
            >
              →
            </button>
          </nav>
        )}
      </div>
      <dialog
        ref={dialog}
        className="filter-dialog"
        aria-label="Filter tools"
        onCancel={close}
      >
        <div className="filter-dialog-heading">
          <span className="eyebrow">FIND YOUR FIT</span>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close filters"
          >
            <X />
          </button>
        </div>
        {filters}
        <button className="button w-full" onClick={close}>
          Show {filtered.length} offers
        </button>
      </dialog>
    </div>
  );
}
