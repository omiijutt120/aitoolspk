'use client';
import {
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useRef,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Fuse from 'fuse.js';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  ChevronDown,
  LayoutGrid,
  Info,
  ArrowDown,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/categories';
import { orderCatalog } from '@/lib/catalog-order';
import { ProductCard } from './product-card';
import { CategoryIcon } from './icon';
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
type SelectProps = {
  label: string;
  param: string;
  values: { value: string; label: string }[];
  params: URLSearchParams;
  update: (key: string, value: string) => void;
};
function Select({ label, param, values, params, update }: SelectProps) {
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
type CatalogProps = {
  initial: Product[];
  category?: string;
  continuous?: boolean;
  options: {
    brands: string[];
    durations: string[];
    warranties: string[];
    accesses: string[];
  };
  total: number;
};

export function CatalogBrowser({
  initial,
  category,
  continuous = false,
  options,
  total,
}: CatalogProps) {
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
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [loaded, setLoaded] = useState({ key: '', count: 32 });
  const dialog = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchFocused = useRef(false);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(q);
      if (q.trim()) emitCatalogEvent('search');
    }, 180);
    return () => clearTimeout(timer);
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
      `${window.location.pathname}${next.size ? '?' + next.toString() : ''}${continuous ? '#all-tools' : ''}`
    );
    window.dispatchEvent(new Event('catalog-query'));
  }
  function clear() {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${continuous ? '#all-tools' : ''}`
    );
    window.dispatchEvent(new Event('catalog-query'));
    setSuggestOpen(false);
  }
  const source = useMemo(
    () =>
      all
        ? orderCatalog(all.filter((p) => !category || p.category === category))
        : initial,
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
    const result = found.filter(
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
    if (params.get('sort') === 'price-asc')
      result.sort((a, b) => a.price - b.price);
    else if (params.get('sort') === 'price-desc')
      result.sort((a, b) => b.price - a.price);
    else if (params.get('sort') === 'name')
      result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [source, fuse, debounced, params]);
  const pageSize = 24;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(
    pages,
    Math.max(1, Math.trunc(Number(params.get('page')) || 1))
  );
  useEffect(() => {
    if (all && params.get('focus') === 'search' && !searchFocused.current) {
      searchRef.current?.focus();
      searchFocused.current = true;
    }
  }, [all, params]);
  const loadKey = queryString + '|' + debounced;
  const visible = loaded.key === loadKey ? loaded.count : 32;
  const shown = continuous
    ? filtered.slice(0, visible)
    : filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    const element = sentinel.current;
    if (!continuous || !element || !all || visible >= filtered.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting))
          setLoaded({
            key: loadKey,
            count: Math.min(visible + 32, filtered.length),
          });
      },
      { rootMargin: '700px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [continuous, all, visible, filtered.length, loadKey]);
  const active = Array.from(params.entries()).filter(
    ([key]) => !['focus', 'page', 'sort'].includes(key)
  );
  const suggestions =
    q.trim().length > 1 && q === debounced
      ? fuse
          .search(q)
          .slice(0, 4)
          .map((r) => r.item)
      : [];
  const shortcuts = [
    'chatgpt',
    'claude',
    'canva',
    'capcut',
    'gemini',
    'notion',
    'cursor',
    'perplexity',
  ].flatMap((slug) => source.find((p) => p.brandSlug === slug) || []);
  const close = () => {
    setMobileOpen(false);
    filterTrigger.current?.focus();
  };
  const filters = (
    <div className="filter-panel">
      <div className="filter-heading">
        <h2>
          <SlidersHorizontal size={16} />
          Filters
        </h2>
        <button className="filter-clear" onClick={clear}>
          Reset all
        </button>
      </div>
      {!category && (
        <div className="sidebar-categories">
          <p className="filter-label">CATEGORIES</p>
          <button
            className={!params.get('category') ? 'selected' : ''}
            onClick={() => update('category', '')}
            aria-pressed={!params.get('category')}
          >
            <LayoutGrid size={16} />
            <span>All tools</span>
            <small>{total}</small>
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={params.get('category') === c.slug ? 'selected' : ''}
              aria-pressed={params.get('category') === c.slug}
              onClick={() => update('category', c.slug)}
            >
              <CategoryIcon name={c.icon} size={16} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="filter-field">
        <span>Price range · PKR</span>
        <div className="price-inputs">
          <input
            aria-label="Minimum price in PKR"
            type="number"
            min="0"
            placeholder="From"
            value={params.get('min') || ''}
            onChange={(e) => update('min', e.target.value)}
          />
          <input
            aria-label="Maximum price in PKR"
            type="number"
            min="0"
            placeholder="To"
            value={params.get('max') || ''}
            onChange={(e) => update('max', e.target.value)}
          />
        </div>
      </div>
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
        label="Availability"
        param="stock"
        values={[
          { value: 'in-stock', label: 'Source reports stock (not live)' },
          { value: 'out-of-stock', label: 'Out of stock' },
          { value: 'unconfirmed', label: 'Stock unconfirmed' },
        ]}
      />
      <details className="advanced-filters">
        <summary>
          More filters <ChevronDown size={15} />
        </summary>
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
          label="Review status"
          param="approval"
          values={[
            { value: 'approved', label: 'Approved for sale' },
            { value: 'pending', label: 'Pending verification' },
          ]}
        />
      </details>
      <div className="sidebar-help">
        <p>Not sure which plan?</p>
        <span>We can help with the details.</span>
        <Link href="/contact/">
          Contact support <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
  return (
    <div
      className={`catalog-experience ${continuous ? 'continuous-catalog' : ''}`}
    >
      {continuous && (
        <div className="store-catalog-title">
          <div>
            <h2 id="catalog-heading">
              Explore all tools<span>{total}</span>
            </h2>
          </div>
          <p>Every plan, in one place.</p>
        </div>
      )}
      <div className="catalog-search-row">
        <div className="search-wrap">
          <div className="search-form catalog-search">
            <Search size={21} aria-hidden="true" />
            <label htmlFor="catalog-search" className="sr-only">
              Search tools, brands or tasks
            </label>
            <input
              ref={searchRef}
              id="catalog-search"
              autoComplete="off"
              placeholder="Search by tool, brand or what you want to do…"
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
                if (e.key === 'Escape' || e.key === 'Enter')
                  setSuggestOpen(false);
              }}
            />
            {q ? (
              <button
                aria-label="Clear search"
                onClick={() => {
                  update('q', '');
                  searchRef.current?.focus();
                }}
              >
                <X size={17} />
              </button>
            ) : (
              <span className="search-key">⌕</span>
            )}
          </div>
          {suggestOpen && suggestions.length > 0 && (
            <div className="suggestions" aria-label="Suggested tools">
              {suggestions.map((p) => (
                <Link href={`/tool/${p.slug}/`} key={p.id} prefetch={false}>
                  {p.logo && (
                    <Image src={p.logo} width={24} height={24} alt="" />
                  )}
                  <span>{p.name}</span>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="catalog-sort">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={params.get('sort') || 'relevance'}
            onChange={(e) => update('sort', e.target.value)}
          >
            <option value="relevance">Default order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>
      {!category && (
        <nav className="catalog-category-tabs" aria-label="Filter by category">
          <button
            className={!params.get('category') ? 'active' : ''}
            aria-pressed={!params.get('category')}
            onClick={() => update('category', '')}
          >
            <LayoutGrid size={15} />
            All tools
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={params.get('category') === c.slug ? 'active' : ''}
              aria-pressed={params.get('category') === c.slug}
              onClick={() => update('category', c.slug)}
            >
              <CategoryIcon name={c.icon} size={15} />
              {c.name}
            </button>
          ))}
        </nav>
      )}
      <div className="catalog-layout">
        <aside className="desktop-filters" aria-label="Catalog filters">
          {filters}
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <p className="result-count" role="status" aria-live="polite">
              <strong>{all ? filtered.length : total}</strong>{' '}
              {all && filtered.length === 1 ? 'offer' : 'offers'}{' '}
              {active.length ? 'matching your filters' : 'to explore'}
              {!all && (
                <span className="loading-label"> · Loading filters…</span>
              )}
            </p>
            <button
              ref={filterTrigger}
              className="button outline mobile-filter-button"
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal size={15} />
              Filters {active.length > 0 && <span>{active.length}</span>}
            </button>
            <span className="catalog-currency">All prices in PKR</span>
          </div>
          <div className="brand-shortcuts">
            <span>QUICK PICK</span>
            {shortcuts.map((p) => (
              <button
                key={p.brandSlug}
                aria-label={`Filter ${p.brand}`}
                aria-pressed={params.get('brand') === p.brand}
                className={params.get('brand') === p.brand ? 'selected' : ''}
                onClick={() =>
                  update(
                    'brand',
                    params.get('brand') === p.brand ? '' : p.brand
                  )
                }
              >
                {p.logo && <Image src={p.logo} width={18} height={18} alt="" />}
                {p.brand}
              </button>
            ))}
          </div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => update(key, '')}
                  aria-label={`Remove ${key} filter`}
                >
                  {key === 'category'
                    ? categories.find((c) => c.slug === value)?.name || value
                    : value}
                  <X size={12} />
                </button>
              ))}
              <button className="clear-active" onClick={clear}>
                Clear all
              </button>
            </div>
          )}
          <div className="catalog-notice">
            <Info size={15} />
            <p>
              Plans marked “Pending verification” need review before ordering.
              Prices and availability are confirmed on WhatsApp.
            </p>
          </div>
          {error && (
            <p role="alert" className="catalog-notice">
              The catalog could not load.{' '}
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
              <Search size={30} />
              <h2>No tools found.</h2>
              <p>Try another spelling, a different brand or fewer filters.</p>
              <button className="button outline" onClick={clear}>
                Clear all filters
              </button>
            </div>
          )}
          {continuous && shown.length > 0 && (
            <div ref={sentinel} className="catalog-loader">
              {shown.length < filtered.length ? (
                <>
                  <span className="loader-dots" aria-hidden="true">
                    •••
                  </span>
                  <p>
                    Keep exploring · {shown.length} of {filtered.length} offers
                  </p>
                  <ArrowDown size={15} />
                </>
              ) : (
                <p>You’ve explored all {filtered.length} offers.</p>
              )}
            </div>
          )}
          {!continuous && pages > 1 && (
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
                      <span className="px-2">…</span>
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
      </div>
      <dialog
        ref={dialog}
        className="filter-dialog"
        aria-label="Filter tools"
        onCancel={close}
      >
        <div className="filter-dialog-heading">
          <span className="store-eyebrow">FIND YOUR FIT</span>
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
